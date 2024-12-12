import React, { useEffect, useRef, useState } from 'react';

const TorusRangeSlider = ({
  orientation,
  sliderValue,
  setSliderValue,
  keys,
  min,
  max,
  step,
}) => {
  const sliderRef = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(0);

  useEffect(() => {
    applyFill(sliderValue);
  }, [sliderValue]);

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setSliderValue(value);
    updateTooltipPosition(value);
  };

  const applyFill = (value) => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const percentage =
        ((value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.background = `linear-gradient(90deg, #7580ec ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage + 0.1}%)`;
    }
  };

  const updateTooltipPosition = (value) => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      console.log(rect, 'Rect position');
      const percentage =
        ((value - slider.min) / (slider.max - slider.min)) * 100;
      const position = (percentage / 100) * rect.width;
      setTooltipPosition(position);
    }
  };

  return (
    <div
      className={`relative flex w-full items-center justify-center ${orientation === 'vertical' ? 'rotate-[-90deg]' : ''}`}
    >
      <div className="relative flex h-[100%] w-full items-center justify-center rounded-lg">
        {tooltipVisible && (
          <TorusSliderToolTip
            position={tooltipPosition}
            value={sliderValue}
            orientation={orientation}
          />
        )}
        <input
          ref={sliderRef}
          id={`slider-${keys}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          className={`h-1 w-full cursor-pointer appearance-none bg-transparent outline-none
          [&::-webkit-slider-runnable-track]:rounded-full 
          [&::-webkit-slider-runnable-track]:bg-transparent
          [&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:w-3 
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-[#0736C4] dark:[&::-webkit-slider-thumb]:border-[#212121] dark:[&::-webkit-slider-thumb]:bg-[#3e6cf5] `}
          key={keys}
        />
      </div>
    </div>
  );
};

export default TorusRangeSlider;

const TorusSliderToolTip = ({ position, value, orientation }) => {
  return (
    <div
      className="absolute top-[-30px] -translate-x-1/2 transform rounded bg-gray-700 px-2 py-1 text-xs text-white"
      style={{
        left: `${position}px`,

        rotate: orientation === 'vertical' ? '90deg' : '0deg',
      }}
    >
      {value}
    </div>
  );
};
