import { useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import { merger } from '../commonComponents/utils/utils';
import { TorusAccordianArrow } from '../SVG_Application';

const TorusButton = ({
  title,
  value,
  isDisabled = false,
  Children,
  autoFocus = false,
  gap,
  onPress,
  size = 'md',
  buttonClassName,
  marginT,
  color,
  outlineColor,
  radius = 'lg',
  btncolor,
  fontStyle,
  btnTxtSize,
  endContent,
  startContent,
  borderColor,
  id,
  isIconOnly = false,
  isDropDown = false,
  secbuttonClassName,
}) => {
  const btnRef = useRef(null);
  const [rotateState, setRotateState] = useState(false);
  const outlineFn = () => {
    if (outlineColor) {
      return ` torus-hover:ring-2 torus-hover:ring-offset-4  ${outlineColor}`;
    }
    return 'outline-none';
  };

  const hoverOutline = outlineFn();

  const sizeClasses = {
    sm: 'px-1.5 py-0.5',
    md: 'px-2.5 py-1.5',
    lg: 'p-3.5 py-2.5',
    xl: 'px-4.5 py-3.5',
    full: 'px-5.5 py-4.5',
  };

  const radiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const commonClass = `font-lg ${secbuttonClassName ? secbuttonClassName : 'w-[100%]'} ${marginT} 
  outline-none torus-pressed:animate-torusButtonActive 
  torus-hover:outline-none  ${hoverOutline} ${gap} ${
    (startContent || endContent) && 'flex justify-center items-center'
  } ${radiusClasses[radius] || 'rounded-lg'}`;

  const contentClass = sizeClasses[size] || '';
console.log(isDisabled,'btncolor');
  return (
    <Button
      title={title}
      id={id}
      style={{
        background: btncolor,
        border: `1px solid ${borderColor}`,
      }}
      className={merger(commonClass, buttonClassName)}
      value={value}
      isDisabled={isDisabled}
      autoFocus={autoFocus}
      onPress={(e) => {
        if (onPress) onPress();
      }}
      onFocus={() => {
        setRotateState(true);
      }}
      onBlur={() => {
        setRotateState(true);
      }}
      ref={btnRef}
    >
      {isIconOnly ? (
        <div
          title={title}
          className={`${contentClass} flex items-center justify-center`}
        >
          {Children}
        </div>
      ) : startContent ? (
        <div
          title={title}
          className={`${contentClass} flex h-full w-full items-center justify-center`}
        >
          <div className="flex w-[100%] justify-evenly gap-1">
            <div className="flex w-[20%] items-center justify-center">
              {startContent}
            </div>
            <div className={`${fontStyle} flex w-[80%] justify-center `}>
              {Children}
            </div>
          </div>
        </div>
      ) : endContent ? (
        <div
          title={title}
          className={`${contentClass} flex items-center justify-center`}
        >
          <div className="flex w-[100%] justify-evenly gap-1">
            <div className={`${fontStyle} flex w-[80%] justify-start pr-1`}>
              <p>{Children}</p>
            </div>
            <div className="flex w-[20%] items-center justify-center">
              {endContent}
            </div>
          </div>
        </div>
      ) : (
        <>
          {isDropDown ? (
            <div
              title={title}
              className={`${contentClass} flex w-[100%] items-center justify-between gap-[0.5rem]`}
            >
              <p className={`w-[80%] ${fontStyle}`}>{Children}</p>
              <div className="flex w-[20%] items-center justify-center">
                <span
                  className={`transition duration-300 ease-in-out 
                    
                    ${rotateState ? 'rotate-[-90deg]' : 'rotate-[0deg]'}
                    `}
                >
                  <TorusAccordianArrow fill={color} />
                </span>
              </div>
            </div>
          ) : (
            <p title={title} className={`${fontStyle}`}>
              {Children}
            </p>
          )}
        </>
      )}
    </Button>
  );
};

// TorusButton.propTypes = {
//   value: PropTypes.string,
//   isDisabled: PropTypes.bool,
//   Children: PropTypes.node,
//   autoFocus: PropTypes.bool,
//   gap: PropTypes.string,
//   onPress: PropTypes.func,
//   size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
//   buttonClassName: PropTypes.string,
//   marginT: PropTypes.string,
//   color: PropTypes.string,
//   outlineColor: PropTypes.string,
//   radius: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
//   btncolor: PropTypes.string,
//   fontStyle: PropTypes.string,
//   btnTxtSize: PropTypes.string,
//   endContent: PropTypes.node,
//   startContent: PropTypes.node,
//   borderColor: PropTypes.string,
//   isIconOnly: PropTypes.bool,
// };

export default TorusButton;
