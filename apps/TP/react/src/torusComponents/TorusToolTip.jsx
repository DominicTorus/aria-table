import React from 'react';
import {
  Button,
  OverlayArrow,
  Tooltip,
  TooltipTrigger,
} from 'react-aria-components';
export default function TorusToolTip({
  hoverContent,
  tooltipContent,
  color,
  setShowObj,
  setActiveTab,
  setPath,
  fg,
  textColor,
  ele,
  tooltipFor,
  setLabel,
  setCheckActivestatus,
  obj,
  setExpandedItem,
  placement = 'top',
  triggerElement = null,
  children,
}) {
  return (
    <TooltipTrigger delay={0} closeDelay={0} trigger='hover'>
      {triggerElement ? (
        <>{triggerElement}</>
      ) : (
        <Button
          onPress={() => {
            if (tooltipFor === 'arr') {
              setShowObj(fg);
              setActiveTab(fg);
              setPath(fg);
              setLabel(tooltipContent);
              setCheckActivestatus(obj);
              setExpandedItem([]);
            } else if (tooltipFor === 'obj') {
              setShowObj(ele);
              setActiveTab(ele);
              setPath(ele);
              setLabel(tooltipContent);
            }
          }}
          className="border-none outline-none"
        >
          {hoverContent}
        </Button>
      )}

      {children ? children : null}
      <Tooltip
        style={{
          backgroundColor: color || '#ccc',
          color: textColor || 'white',
        }}
        className={
          '  items-center justify-center rounded-lg  px-3 py-1 text-[0.72vw] font-normal  shadow-sm'
        }
        placement={placement}
        
      >
        <OverlayArrow>
          <svg
            width={8}
            height={8}
            transform={`rotate(${placement === 'top' ? 0 : placement === 'bottom' ? 180 : placement === 'right' ? 90 : 270})`}
            viewBox="0 0 8 8"
          >
            <path d="M0 0 L4 4 L8 0" fill={'#ccc'} />
          </svg>
        </OverlayArrow>
        {tooltipContent}
      </Tooltip>
    </TooltipTrigger>
  );
}
