import React, { useState } from 'react';

const TorusTitle = ({
  text,
  children,
  bgColor,
  color,
  position = 'top',
  borderColor = '#D3D3D3',
  alignment,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = (event) => {
    event.stopPropagation();
    setShowTooltip(true);
  };

  const handleMouseLeave = (event) => {
    event.stopPropagation();
    setShowTooltip(false);
  };

  const getTooltipPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-1 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-1 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-1 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-1 top-1/2 transform -translate-y-1/2';
      default:
        return 'bottom-full mb-1 left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div
      className="relative z-[2000] flex items-center "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="z-30">{children}</div>

      {showTooltip && text && (
        <div
          style={{
            backgroundColor: bgColor || '#0736c4',
            color: color || 'white',
            border: `1px solid ${borderColor}`,
            
          }}
          className={`absolute z-[9999] ${alignment ? alignment : ''} ${getTooltipPositionStyles()} w-max rounded px-2 py-1 text-[0.62vw] shadow-lg`}
          onMouseEnter={(e) => e.stopPropagation()}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default TorusTitle;
