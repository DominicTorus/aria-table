import React, { useEffect, useState } from 'react';
import { Input, Label, TextField } from 'react-aria-components';

export default function TorusInput(props) {
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState(props?.value || '');

  useEffect(() => {
    toggleClicked();
  }, [props?.value]);

  const toggleClicked = () => {
    if (value.length > 0) {
      setClicked(true);
    } else if (value.length <= 0) {
      setClicked(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const isNumberInput = props?.type === 'number';
  
    const sanitizedValue = isNumberInput
      ? inputValue.replace(/[a-zA-Z]+/g, '')
      : inputValue;
  
    setValue(sanitizedValue);
    props?.onChange(sanitizedValue); 
  
   
    setClicked(sanitizedValue.length > 0);
  };

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('Text');
    const isNumberInput = props?.type === 'number';
  
   
    const sanitizedValue = isNumberInput
      ? pastedValue.replace(/[a-zA-Z]+/g, '')
      : pastedValue;
  
    setValue(sanitizedValue);
    props?.onChange(sanitizedValue); 
  
   
    setClicked(sanitizedValue.length > 0);
  
    
    e.preventDefault();
  };
  
  

  const colorsLabelFn = () => {
    if (props?.labelColor) {
      return props?.labelColor;
    }
    return '';
  };

  const colorsBgFn = () => {
    if (props?.bgColor) {
      return `${props?.bgColor}`;
    }
    return '';
  };

  const colorsHoverFn = () => {
    if (props?.hoverColor) {
      return `${props?.hoverColor}`;
    }
    return '';
  };

  const defaultClassNames = {
    bordered: {
      textFieldClassName: `relative  pb-2.5 pt-4  text-sm text-gray-200 bg-transparent ${props.NoneRightRadius ? 'rounded-r-none' : 'rounded-lg'}`,
      labelClassNames: `absolute top-0 left-0 p-4 dark:text-gray-400 text-xs transition-all duration-300 outline-none `,
      inputClassNames:
        'w-full px-2 text-sm font-normal py-3 pb-0 mt-1 border border-gray-300 rounded-md outline-none ',
    },
    fade: {
      textFieldClassName: 'w-[100%]',
      labelClassNames:
        'w-[100%] cursor-pointer flex justify-start items-center  ',
      inputClassNames: ` outline-none  border-t-transparent border-l-transparent border-r-transparent border-b-transparent torus-focus:border-b-purple-500 transition-all ease-linear duration-75 px-3 py-1`,
    },
    underline: {
      textFieldClassName: 'w-[100%] relative',
      labelClassNames:
        'w-[10%] cursor-pointer flex justify-start items-center absolute transition-all ease-in-out duration-150',
      inputClassNames: `px-2 outline-none border-2 border-b-slate-500/30 
      border-t-transparent border-l-transparent border-r-transparent bg-transparent`,
    },
  };

  const { variant } = props;
  const classNames = defaultClassNames[variant];

  const topValueFn = () => {
    const getting = () => {
      return props?.height === 'sm'
        ? '6'
        : props?.height === 'md'
          ? '8'
          : props?.height === 'lg'
            ? '10'
            : props?.height === 'xl'
              ? '12'
              : '10';
    };

    const value = getting();
    const number = parseInt(value, 10);

    if (number) {
      const newValue = number + 2;
      return `${newValue}px`;
    }

    return '';
  };

  const topNValueFn = () => {
    const getting = () => {
      return props?.height === 'sm'
        ? '6'
        : props?.height === 'md'
          ? '8'
          : props?.height === 'lg'
            ? '10'
            : props?.height === 'xl'
              ? '12'
              : '10';
    };

    const value = getting();
    const number = parseInt(value, 10);

    if (number) {
      return `${number * 2}px`;
    }

    return '';
  };

  const outlineFn = () => {
    if (props?.outlineColor) {
      return ` torus-focus:ring-1 torus-focus:ring-blue-500 ${props?.outlineColor}`;
    }
    return 'outline-none';
  };

  const topValue = topValueFn();
  const topNValue = topNValueFn();
  const outline = outlineFn();
  const colorsLabel = colorsLabelFn();
  const colorsBg = colorsBgFn();
  const colorsHover = colorsHoverFn();

  return (
    <TextField
      className={`${classNames?.textFieldClassName} ${
        props?.isDisabled ? 'pointer-events-none opacity-50' : ''
      } ${props?.marginT ? props?.marginT : 'mt-1'}`}
      isDisabled={props?.isDisabled ? props?.isDisabled : false}
    >
      {props?.startContent && (
        <div className="absolute left-4 top-[2.5rem] text-sm text-gray-400">
          <div>{props?.startContent}</div>
        </div>
      )}

      <Label
        className={`${classNames?.labelClassNames} 
        ${props?.variant === 'bordered' ? 'pt-[1.50rem]' : ''}

       
        
        ${
          props?.variant === 'underline'
            ? `${
                !clicked
                  ? `font-semibold ${colorsLabel}`
                  : 'torus-text-gray-400'
              }`
            : `${colorsLabel}`
        } `}
        style={{
          left: `${
            props?.variant === 'underline' ? (clicked ? '1rem' : '0') : '0'
          }`,
          top: `${
            props?.variant === 'underline'
              ? clicked
                ? `${topValue}`
                : `-${topNValue}`
              : '0'
          }`,
          transition: 'all ease-in-out 0.15s',
        }}
      >
        {props?.label}
      </Label>
      <Input
        {...props}
        placeholder={clicked ? '' : props?.placeholder}
        onFocus={() => setClicked(true)}
        onChange={handleInputChange}
        value={value}
        onPaste={()=>{
          console.log("pasteEvent--->>>>>")
        }}
        type={props?.type === 'number' ? 'text' : `${props?.type}`}
        className={`${classNames?.inputClassNames} ${
          clicked ? 'border-transparent' : ''
        } ${colorsBg} ${colorsHover} 
      
  
 ${props?.startContent ? 'pl-[2.2rem]' : 'pl-[1rem]'}
      ${props?.variant === 'bordered' ? 'pl-[1rem]' : ''}
        ${
          props?.variant === 'bordered'
            ? `torus-focus:outline-none torus-focus:ring-1 ${
                props?.outlineColor
                  ? `${outline}`
                  : 'torus-focus:outline-none torus-focus:ring-1 torus-focus:ring-blue-500'
              }`
            : ''
        }

        ${
          props?.variant === 'fade'
            ? `${props?.hoverColor ? `${colorsHover}` : 'bg-slate-500/70'} `
            : ''
        }
        ${
          props?.variant === 'fade'
            ? `${
                props?.bgColor ? `${colorsBg}` : 'torus-hover:bg-slate-500/40'
              } `
            : ''
        }
        
        ${props?.variant === 'fade' ? `${props?.textColor}` : ' text-black'}
        
        ${
          props?.textColor
            ? `${props?.textColor} font-base font-normal `
            : 'font-base font-normal text-black'
        } 
        
        ${
          props?.height === 'sm'
            ? 'h-6'
            : props?.height === 'md'
              ? 'h-8'
              : props?.height === 'lg'
                ? 'h-10'
                : props?.height === 'xl'
                  ? 'h-12'
                  : 'h-10'
        } 

        ${
          props?.width === 'sm'
            ? 'w-[30%]'
            : props?.width === 'md'
              ? 'w-[45%]'
              : props?.width === 'lg'
                ? 'w-[60%]'
                : props?.width === 'xl'
                  ? 'w-[75%]'
                  : props?.width === 'full'
                    ? 'w-[100%]'
                    : 'w-[80%]'
        } 
          ${
            props?.radius === 'sm'
              ? 'rounded-sm'
              : props?.radius === 'md'
                ? 'rounded-md'
                : props?.radius === 'lg' && props.NoneRightRadius
                  ? 'rounded-l-lg rounded-r-none'
                  : props?.radius === 'lg'
                    ? 'rounded-lg'
                    : props?.radius === 'full'
                      ? 'rounded-full'
                      : 'rounded-none'
          }`}
      />
      {props?.endContent && (
        <div className="absolute  right-4  top-[2.5rem] text-sm text-gray-400">
          {' '}
          <span> {props?.endContent}</span>
        </div>
      )}
    </TextField>
  );
}
