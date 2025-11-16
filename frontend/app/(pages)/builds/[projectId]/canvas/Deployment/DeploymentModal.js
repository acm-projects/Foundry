"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Clock,
  Eye,
  EyeOff,
  Server,
  Database,
  HardDrive,
  Table,
} from "lucide-react";

// Resource status to UI mapping
const STATUS_CONFIG = {
  CREATE_IN_PROGRESS: {
    icon: Loader2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Creating",
    spin: true,
  },
  CREATE_COMPLETE: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Complete",
    spin: false,
  },
  CREATE_FAILED: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Failed",
    spin: false,
  },
  UPDATE_IN_PROGRESS: {
    icon: Loader2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Updating",
    spin: true,
  },
  UPDATE_COMPLETE: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Updated",
    spin: false,
  },
  UPDATE_FAILED: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Update Failed",
    spin: false,
  },
  ROLLBACK_IN_PROGRESS: {
    icon: Loader2,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Rolling Back",
    spin: true,
  },
  ROLLBACK_COMPLETE: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Rolled Back",
    spin: false,
  },
};

// AWS service icon mapping with Lucide icons
const getServiceIcon = (resourceType) => {
  if (resourceType.includes("EC2")) return Server;
  if (resourceType.includes("S3")) return HardDrive;
  if (resourceType.includes("RDS")) return Database;
  if (resourceType.includes("DynamoDB")) return Table;
  return Server;
};

function DeploymentModal({ isOpen, onClose, stackName, keyPairs }) {
  const [resources, setResources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stackInfo, setStackInfo] = useState(null);
  const [stackOutputs, setStackOutputs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0s");
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [dividerPosition, setDividerPosition] = useState(50); // Percentage of left panel width
  const [isDragging, setIsDragging] = useState(false);
  const [downloadedKeys, setDownloadedKeys] = useState(new Set());
  const [lastValidProgress, setLastValidProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  const wsRef = useRef(null);
  const logsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Debug keyPairs prop
  useEffect(() => {
    console.log("🔑 KeyPairs prop received:", keyPairs);
  }, [keyPairs]);

  // Timer for elapsed time
  useEffect(() => {
    if (!startTime || isComplete) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setElapsedTime(minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  // WebSocket connection
  useEffect(() => {
    if (!isOpen || !stackName) return;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(
          `ws://localhost:8000/canvas/deploy/track/${stackName}`,
        );
        wsRef.current = ws;

        ws.onopen = () => {
          setIsReconnecting(false);
          if (!startTime) {
            setStartTime(Date.now());
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "resource_update") {
              handleResourceUpdate(data);
            } else if (data.type === "stack_complete") {
              handleStackComplete(data);
            } else if (data.type === "error") {
              handleError(data);
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };

        ws.onerror = (error) => {
          setIsReconnecting(true);
        };

        ws.onclose = () => {
          if (!isComplete && !isFailed && isOpen) {
            setIsReconnecting(true);
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
            }, 3000);
          }
        };
      } catch (err) {
        console.error("Failed to create WebSocket:", err);
        setIsReconnecting(true);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isOpen, stackName, isComplete, isFailed]);

  const handleResourceUpdate = (data) => {
    // Ignore updates if deployment is already complete
    if (isComplete || isFailed) return;

    const { resource, stack } = data;

    // Validate resource data
    if (!resource || !resource.logicalId || !resource.status) return;

    // Add to logs
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date(data.timestamp).toLocaleTimeString(),
      message: `${resource.logicalId} - ${resource.status.replace(/_/g, " ")}`,
      status: resource.status,
      resource: resource.logicalId,
    };
    setLogs((prev) => [...prev, logEntry]);

    setResources((prev) => {
      const existing = prev.findIndex(
        (r) => r.logicalId === resource.logicalId,
      );
      const newResource = {
        ...resource,
        timestamp: data.timestamp,
      };

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResource;
        return updated;
      } else {
        return [...prev, newResource];
      }
    });

    setStackInfo(stack);

    // Auto-scroll logs to bottom
    setTimeout(() => {
      if (logsRef.current) {
        logsRef.current.scrollTop = logsRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleStackComplete = (data) => {
    setIsComplete(true);
    setStackInfo(data.stack);
    setStackOutputs(data.stack.outputs || []);

    if (
      data.stack.status === "CREATE_FAILED" ||
      data.stack.status === "UPDATE_FAILED"
    ) {
      setIsFailed(true);
    }
    // Close WebSocket immediately to stop further polling
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const handleError = (data) => {
    // Error is already reflected in resource status
  };

  const togglePasswordVisibility = (key) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Download SSH key pair as .pem file
  const downloadKeyPair = (keyName, keyMaterial, instanceName) => {
    const blob = new Blob([keyMaterial], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${instanceName}-key.pem`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Mark as downloaded
    setDownloadedKeys((prev) => new Set([...prev, keyName]));
  };

  // Handle divider dragging
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newPosition =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Clamp between 20% and 80%
      const clampedPosition = Math.min(Math.max(newPosition, 20), 80);
      setDividerPosition(clampedPosition);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update cached progress when stackInfo changes with valid data
  useEffect(() => {
    if (stackInfo && stackInfo.totalResources !== undefined && stackInfo.completedResources !== undefined) {
      const { totalResources, completedResources } = stackInfo;
      if (totalResources > 0) {
        const progressValue = Math.round((completedResources / totalResources) * 100);
        const validProgress = Math.min(Math.max(progressValue, 0), 100);
        
        setLastValidProgress({
          completed: completedResources,
          total: totalResources,
          percentage: validProgress
        });
      }
    }
  }, [stackInfo]);

  const calculateProgress = () => {
    if (!stackInfo || stackInfo.totalResources === undefined || stackInfo.completedResources === undefined) {
      // Return last valid progress if stackInfo becomes invalid
      return lastValidProgress.percentage;
    }
    const { totalResources, completedResources } = stackInfo;
    if (totalResources === 0) return lastValidProgress.percentage;
    const progressValue = Math.round((completedResources / totalResources) * 100);
    // Ensure we return a valid number between 0 and 100
    return Math.min(Math.max(progressValue, 0), 100);
  };

  if (!isOpen) return null;

  const progress = calculateProgress();
  const statusColor = isFailed
    ? "bg-red-600"
    : isComplete
      ? "bg-green-600"
      : "bg-blue-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Deployment Status
              </h2>
              <p className="text-sm text-gray-600 font-mono mt-1">
                {stackName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  isFailed
                    ? "bg-red-100 text-red-800"
                    : isComplete
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {isFailed ? "Failed" : isComplete ? "Complete" : "In Progress"}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Reconnecting Banner */}
          {isReconnecting && (
            <div className="mt-3 px-4 py-2 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-900 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Reconnecting to deployment stream...
            </div>
          )}
        </div>

        {/* Main Content - Split Layout */}
        <div
          ref={containerRef}
          className="flex-1 flex overflow-hidden relative"
        >
          {/* Left Side - Logs */}
          <div
            className="border-r border-gray-200 flex flex-col"
            style={{ width: `${dividerPosition}%` }}
          >
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Activity Logs
              </h3>
            </div>
            <div
              ref={logsRef}
              className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50"
            >
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Initializing deployment...</p>
                </div>
              ) : (
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log) => {
                    const statusConfig =
                      STATUS_CONFIG[log.status] ||
                      STATUS_CONFIG["CREATE_IN_PROGRESS"];
                    return (
                      <div key={log.id} className="flex gap-3 text-gray-700">
                        <span className="text-gray-500 flex-shrink-0">
                          {log.timestamp}
                        </span>
                        <span className={`${statusConfig.color} flex-shrink-0`}>
                          {log.status.includes("COMPLETE")
                            ? "[SUCCESS]"
                            : log.status.includes("FAILED")
                              ? "[ERROR]"
                              : log.status.includes("PROGRESS")
                                ? "[INFO]"
                                : "[UPDATE]"}
                        </span>
                        <span className="flex-1">{log.message}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Draggable Divider */}
          <div
            onMouseDown={handleMouseDown}
            className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors relative group ${isDragging ? "bg-blue-500" : ""}`}
            style={{ userSelect: "none" }}
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
          </div>

          {/* Right Side - Resources */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Resources
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {resources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No resources yet...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {resources.map((resource) => {
                    const statusConfig =
                      STATUS_CONFIG[resource.status] ||
                      STATUS_CONFIG["CREATE_IN_PROGRESS"];
                    const StatusIcon = statusConfig.icon;
                    const ServiceIcon = getServiceIcon(resource.type);
                    const hasError =
                      resource.statusReason && resource.statusReason.length > 0;
                    const isResourceComplete =
                      resource.status.includes("COMPLETE") &&
                      !resource.status.includes("ROLLBACK");

                    // Find outputs related to this resource
                    const resourceOutputs = stackOutputs.filter((output) =>
                      output.key
                        .toLowerCase()
                        .includes(resource.logicalId.toLowerCase()),
                    );

                    // Find SSH key for this EC2 instance
                    const isEC2 = resource.type.includes("EC2::Instance");
                    const isS3 = resource.type.includes("S3::Bucket");

                    const keyPairForResource =
                      keyPairs && isEC2
                        ? Object.values(keyPairs).find((kp) => {
                            // Try multiple matching strategies since IDs might be encoded differently
                            // Strategy 1: Direct include (for similar IDs)
                            const directMatch = resource.logicalId.includes(
                              kp.instanceNodeId.replace("EC2:", ""),
                            );

                            // Strategy 2: Check if they share significant parts (ignoring underscores and extra chars)
                            const resourceIdClean = resource.logicalId
                              .replace(/_/g, "")
                              .toLowerCase();
                            const nodeIdClean = kp.instanceNodeId
                              .replace(/[EC2:_]/g, "")
                              .toLowerCase();
                            const partialMatch =
                              resourceIdClean.includes(nodeIdClean) ||
                              nodeIdClean.includes(resourceIdClean);

                            const matches = directMatch || partialMatch;

                            if (matches) {
                              console.log("✅ KEY MATCH FOUND:", {
                                resourceId: resource.logicalId,
                                nodeId: kp.instanceNodeId,
                                strategy: directMatch ? "direct" : "partial",
                              });
                            }

                            return matches;
                          })
                        : null;

                    return (
                      <div
                        key={resource.logicalId}
                        className="px-6 py-3 hover:bg-gray-50 transition-colors"
                      >
                        {/* Resource Header */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <ServiceIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {resource.logicalId}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {resource.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* SSH Key Download Button for EC2 */}
                            {isResourceComplete && keyPairForResource && (
                              <button
                                onClick={() =>
                                  downloadKeyPair(
                                    keyPairForResource.keyName,
                                    keyPairForResource.keyMaterial,
                                    keyPairForResource.instanceName,
                                  )
                                }
                                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-1"
                                title="Download SSH key pair for this instance"
                              >
                                <Copy className="w-3 h-3" />
                                SSH Key
                              </button>
                            )}
                            <StatusIcon
                              className={`w-4 h-4 ${statusConfig.color} ${statusConfig.spin ? "animate-spin" : ""}`}
                            />
                            <span
                              className={`text-xs font-medium ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {/* Error Message */}
                        {hasError && (
                          <div className="mt-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded border-l-2 border-red-500">
                            {resource.statusReason}
                          </div>
                        )}

                        {/* Resource Details */}
                        {isResourceComplete && resource.physicalId && (
                          <div className="mt-2 space-y-1.5 text-xs">
                            {/* For EC2 and S3, only show Resource ID and domain name */}
                            {isEC2 || isS3 ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600 font-medium w-24 flex-shrink-0">
                                    Resource ID:
                                  </span>
                                  <code className="flex-1 text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded truncate">
                                    {resource.physicalId}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(resource.physicalId)
                                    }
                                    className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                                    title="Copy ID"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {isS3 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-medium w-24 flex-shrink-0">
                                      S3 Link:
                                    </span>
                                    <code className="flex-1 text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded truncate">
                                      {`${resource.physicalId}.s3.amazonaws.com`}
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          `${resource.physicalId}.s3.amazonaws.com`,
                                        )
                                      }
                                      className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                                      title="Copy Link"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600 font-medium w-24 flex-shrink-0">
                                    Resource ID:
                                  </span>
                                  <code className="flex-1 text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded truncate">
                                    {resource.physicalId}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(resource.physicalId)
                                    }
                                    className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                                    title="Copy ID"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Resource-specific outputs for non-EC2 resources */}
                                {resourceOutputs.map((output, idx) => {
                                  const isPassword =
                                    output.key
                                      .toLowerCase()
                                      .includes("password") ||
                                    output.key.toLowerCase().includes("secret");
                                  const isVisible = visiblePasswords.has(
                                    output.key,
                                  );

                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <span
                                        className="text-gray-600 font-medium w-24 flex-shrink-0 truncate"
                                        title={output.description || output.key}
                                      >
                                        {output.description || output.key}:
                                      </span>
                                      <code className="flex-1 text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded truncate">
                                        {isPassword && !isVisible
                                          ? "••••••••••••"
                                          : output.value}
                                      </code>
                                      {isPassword && (
                                        <button
                                          onClick={() =>
                                            togglePasswordVisibility(output.key)
                                          }
                                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                                          title={isVisible ? "Hide" : "Show"}
                                        >
                                          {isVisible ? (
                                            <EyeOff className="w-3.5 h-3.5" />
                                          ) : (
                                            <Eye className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          copyToClipboard(output.value)
                                        }
                                        className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                                        title="Copy"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="space-y-3">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span className="font-medium">
                  {stackInfo && stackInfo.completedResources !== undefined && stackInfo.totalResources !== undefined
                    ? `${stackInfo.completedResources} of ${stackInfo.totalResources} resources`
                    : lastValidProgress.total > 0
                    ? `${lastValidProgress.completed} of ${lastValidProgress.total} resources`
                    : "Initializing..."}
                </span>
                <span className="font-semibold">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${statusColor} transition-all duration-500 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Time and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Time elapsed: {elapsedTime}</span>
              </div>

              {isComplete && (
                <button
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    isFailed
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isFailed ? "Close" : "Done"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeploymentModal;
