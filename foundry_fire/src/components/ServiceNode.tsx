import { Server, HardDrive, Database, Cloud, Plus, ArrowRight } from 'lucide-react';

interface ServiceNodeProps {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  onClick: () => void;
  onStartConnection: (serviceId: string) => void;
  onCompleteConnection: (serviceId: string) => void;
  isConnecting: boolean;
  isConnectionStart: boolean;
  instanceId: string;
  hasError?: boolean;
}

const iconMap = {
  ec2: Server,
  s3: HardDrive,
  rds: Database,
};

const colorMap = {
  ec2: 'text-orange-500 border-orange-200 bg-orange-50',
  s3: 'text-green-500 border-green-200 bg-green-50',
  rds: 'text-blue-500 border-blue-200 bg-blue-50',
  dynamodb: 'text-purple-500 border-purple-200 bg-purple-50',
};

export function ServiceNode({ 
  id, 
  name, 
  type, 
  position, 
  onClick, 
  onStartConnection,
  onCompleteConnection,
  isConnecting,
  isConnectionStart,
  instanceId,
  hasError
}: ServiceNodeProps) {
  const Icon = iconMap[id as keyof typeof iconMap] || Server;
  const colorClasses = colorMap[id as keyof typeof colorMap] || 'text-gray-500 border-gray-200 bg-gray-50';

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) {
      onCompleteConnection(instanceId);
    } else {
      onStartConnection(instanceId);
    }
  };

  return (
    <div
      className="absolute select-none group"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Node Circle */}
      <div
        className={`
          w-20 h-20 rounded-full border-2 
          flex flex-col items-center justify-center
          hover:shadow-md transition-all duration-200
          ${hasError ? 'border-red-500 bg-red-50 ring-2 ring-red-400' : colorClasses}
          ${!hasError && isConnectionStart ? 'ring-2 ring-blue-400' : ''}
          ${!hasError && isConnecting && !isConnectionStart ? 'ring-2 ring-green-400 cursor-pointer' : 'cursor-pointer'}
        `}
        onClick={isConnecting && !isConnectionStart ? handleConnectionClick : onClick}
      >
        <Icon size={24} className={hasError ? 'text-red-600' : ''} />
      </div>
      
      {/* Persistent Label */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                      bg-background border rounded px-3 py-1.5 shadow-sm
                      pointer-events-none whitespace-nowrap z-10 min-w-max max-w-32">
        <span className="text-xs font-medium text-foreground text-center block leading-tight">{name}</span>
      </div>
      
      {/* Connection ports */}
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
        <button
          onClick={handleConnectionClick}
          className={`
            w-5 h-5 rounded-full border-2 bg-white shadow-sm
            flex items-center justify-center
            transition-all duration-200
            ${isConnecting ? 
              (isConnectionStart ? 'border-blue-400 bg-blue-50' : 'border-green-400 bg-green-50 hover:bg-green-100') 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }
            ${!isConnecting ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}
          `}
        >
          {isConnecting ? (
            isConnectionStart ? <ArrowRight size={10} className="text-blue-500" /> : <Plus size={10} className="text-green-500" />
          ) : (
            <Plus size={10} className="text-gray-500" />
          )}
        </button>
      </div>
      
      {/* Input port */}
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
        <div
          className={`
            w-5 h-5 rounded-full border-2 bg-white shadow-sm
            transition-all duration-200
            ${isConnecting && !isConnectionStart ? 'border-green-400 bg-green-50' : 'border-gray-300'}
            ${!isConnecting ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}
          `}
        />
      </div>
    </div>
  );
}