interface ConnectionLineProps {
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  isActive?: boolean;
  isAnimating?: boolean;
  isCreated?: boolean;
}

export function ConnectionLine({ sourcePosition, targetPosition, isActive = false, isAnimating = false, isCreated = false }: ConnectionLineProps) {
  // Calculate the path for a curved connection line
  const dx = targetPosition.x - sourcePosition.x;
  const dy = targetPosition.y - sourcePosition.y;
  
  // Control point for bezier curve (creates a nice arc)
  const controlPointX = sourcePosition.x + dx / 2;
  const controlPointY = sourcePosition.y;
  
  const path = `M ${sourcePosition.x} ${sourcePosition.y} Q ${controlPointX} ${controlPointY} ${targetPosition.x} ${targetPosition.y}`;
  
  // Determine the color and stroke width based on state
  let strokeColor = "#6b7280"; // Default gray
  let strokeWidth = "2";
  
  if (isActive) {
    strokeColor = "#3b82f6"; // Blue when actively connecting
  } else if (isAnimating || isCreated) {
    strokeColor = "#ea580c"; // Orange when animating or created
    strokeWidth = isAnimating ? "3" : "2";
  }
  
  return (
    <g>
      {/* Base connection line */}
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={isActive ? "5,5" : "none"}
        className="transition-all duration-200"
      />
      
      {/* Animated flow indicator - only during animation */}
      {isAnimating && (
        <>
          {/* Animated dashed line */}
          <path
            d={path}
            stroke="#ea580c"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            className="animate-pulse"
            style={{
              strokeDashoffset: "12",
              animation: "dash 3s linear infinite"
            }}
          />
          
          {/* Moving dot along the path */}
          <circle
            r="4"
            fill="#ea580c"
            className="animate-pulse"
          >
            <animateMotion
              dur="3s"
              repeatCount="2"
              path={path}
            />
          </circle>
          
          {/* Glowing effect */}
          <path
            d={path}
            stroke="#ea580c"
            strokeWidth="6"
            fill="none"
            opacity="0.3"
            className="animate-pulse"
          />
        </>
      )}
      
      {/* Arrow head */}
      <polygon
        points={`${targetPosition.x-8},${targetPosition.y-4} ${targetPosition.x},${targetPosition.y} ${targetPosition.x-8},${targetPosition.y+4}`}
        fill={strokeColor}
        className={`transition-all duration-200 ${isAnimating ? 'animate-pulse' : ''}`}
      />
    </g>
  );
}