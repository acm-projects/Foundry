import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { ServiceNode } from "./ServiceNode";
import { ConnectionLine } from "./ConnectionLine";

interface DroppedService {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  instanceId: string;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

interface ServiceCanvasProps {
  services: DroppedService[];
  connections: Connection[];
  onDrop: (service: any, position: { x: number; y: number }) => void;
  onServiceClick: (service: DroppedService) => void;
  onStartConnection: (serviceId: string) => void;
  onCompleteConnection: (serviceId: string) => void;
  onCancelConnection: () => void;
  isConnecting: boolean;
  connectionStart: string | null;
  animatingConnections?: string[];
  isCreationAnimating?: boolean;
  createdConnections?: string[];
  nodeErrors?: string[];
  onUpdatePosition: (
    instanceId: string,
    position: { x: number; y: number }
  ) => void;
}

export function ServiceCanvas({
  services,
  connections,
  onDrop,
  onServiceClick,
  onStartConnection,
  onCompleteConnection,
  onCancelConnection,
  isConnecting,
  connectionStart,
  animatingConnections = [],
  isCreationAnimating = false,
  createdConnections = [],
  nodeErrors = [],
  onUpdatePosition,
}: ServiceCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "service",
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const componentRect = monitor.getDropResult();

      if (clientOffset) {
        // Get the canvas container element
        const canvasElement = document.getElementById("service-canvas");
        if (canvasElement) {
          const canvasRect = canvasElement.getBoundingClientRect();
          const position = {
            x: clientOffset.x - canvasRect.left - 40, // Offset for centering circular node
            y: clientOffset.y - canvasRect.top - 40,
          };
          onDrop(item, position);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getNodeCenter = (service: DroppedService) => ({
    x: service.position.x + 40, // Half of w-20 (80px)
    y: service.position.y + 40, // Half of h-20 (80px)
  });

  const handleCanvasClick = () => {
    if (isConnecting) {
      onCancelConnection();
    }
  };

  return (
    <div
      id="service-canvas"
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`
        flex-1 relative bg-background
        transition-colors duration-200
        ${isOver ? "bg-accent/50" : ""}
        ${isConnecting ? "cursor-crosshair" : ""}
      `}
      style={{ minHeight: "100vh" }}
      onClick={handleCanvasClick}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ea580c 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Connection lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      >
        {connections.map((connection) => {
          const sourceService = services.find(
            (s) => s.instanceId === connection.sourceId
          );
          const targetService = services.find(
            (s) => s.instanceId === connection.targetId
          );

          if (!sourceService || !targetService) return null;

          const sourcePos = getNodeCenter(sourceService);
          const targetPos = getNodeCenter(targetService);

          // Adjust positions for connection ports
          sourcePos.x += 40; // Right side of source node
          targetPos.x -= 40; // Left side of target node

          return (
            <ConnectionLine
              key={connection.id}
              sourcePosition={sourcePos}
              targetPosition={targetPos}
              isActive={connectionStart === connection.sourceId}
              isAnimating={animatingConnections.includes(connection.id)}
              isCreated={createdConnections.includes(connection.id)}
            />
          );
        })}
      </svg>

      {/* Drop hint */}
      {services.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>Drag AWS services from the sidebar to get started</p>
            <p className="mt-2">Click the + button on nodes to connect them</p>
          </div>
        </div>
      )}

      {/* Connection mode hint */}
      {isConnecting && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-md">
          Click on another service to connect, or click anywhere to cancel
        </div>
      )}

      {/* Rendered services */}
      {services.map((service) => (
        <ServiceNode
          key={service.instanceId}
          id={service.id}
          name={service.name}
          type={service.type}
          position={service.position}
          onClick={() => !isConnecting && onServiceClick(service)}
          onStartConnection={onStartConnection}
          onCompleteConnection={onCompleteConnection}
          isConnecting={isConnecting}
          isConnectionStart={connectionStart === service.instanceId}
          instanceId={service.instanceId}
          hasError={nodeErrors.includes(service.instanceId)}
        />
      ))}
    </div>
  );
}
