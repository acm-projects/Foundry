import { useDrag } from 'react-dnd';
import { Database, HardDrive, Server, Cloud } from 'lucide-react';
import { useState } from 'react';

interface ServiceItem {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<any>;
  color: string;
}

const awsServices: ServiceItem[] = [
  {
    id: 'ec2',
    name: 'EC2 Instance',
    type: 'compute',
    icon: Server,
    color: 'text-orange-500'
  },
  {
    id: 's3',
    name: 'S3 Bucket',
    type: 'storage',
    icon: HardDrive,
    color: 'text-green-500'
  },
  {
    id: 'rds',
    name: 'RDS',
    type: 'database',
    icon: Database,
    color: 'text-blue-500'
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB Table',
    type: 'database',
    icon: Database,
    color: 'text-purple-500'
  }
];

interface DraggableServiceProps {
  service: ServiceItem;
}

function DraggableService({ service }: DraggableServiceProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'service',
    item: { ...service },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 1000); // Reduced from 2000ms to 1000ms (1 second)
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  const Icon = service.icon;

  return (
    <div
      ref={drag}
      className={`
        relative flex items-center justify-center p-3 rounded-lg cursor-grab
        hover:bg-orange-50/50 hover:border-orange-200 transition-all duration-200 border border-transparent
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`p-2 rounded-md bg-background border ${service.color}`}>
        <Icon size={20} />
      </div>
      
      {/* Tooltip that appears on hover after delay */}
      {showTooltip && (
        <div className="absolute left-full ml-3 z-50 bg-black text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          <div className="font-medium">{service.name}</div>
          <div className="text-xs opacity-75 capitalize">{service.type}</div>
          {/* Arrow pointing to the left */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-black border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
        </div>
      )}
    </div>
  );
}

export function ServiceSidebar() {
  return (
    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
        <div className="flex flex-col items-center gap-3">
          {/* Header with icon */}
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-2">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          
          {/* Service icons */}
          <div className="flex flex-col gap-2">
            {awsServices.map((service) => (
              <DraggableService key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}