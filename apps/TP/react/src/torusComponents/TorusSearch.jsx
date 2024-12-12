import React, { useEffect, useState } from 'react';
import { Input, TextField } from 'react-aria-components';
import { SearchIcon } from '../SVG_Application';
import { merger } from '../utils/utils';

export default function TorusSearch(props) {
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState(props.value || '');

  useEffect(() => {
    toggleClicked();
  }, [props.value]);

  const toggleClicked = () => {
    if (value.length > 0) {
    } else if (value.length <= 0) {
    }
  };

  const handleInputChange = (e) => {
    props.type == 'number'
      ? setValue(e.target.value.replace(/[a-zA-Z]+/g, ''))
      : setValue(e.target.value);

    if (e.target.value.length === 0) {
      props.onChange(e.target.value);
      console.log(e.target.value, 'Searchvalue');
    } else {
      props.onChange(e.target.value);
    }
  };

  const colorsBgFn = () => {
    if (props.bgColor) {
      return `${props.bgColor}`;
    }
    return '';
  };

  const colorsHoverFn = () => {
    if (props.hoverColor) {
      return `${props.hoverColor}`;
    }
    return '';
  };

  const borderColor = () => {
    if (props.borderColor) {
      return `transision-border duration-100 ease-in-out border-1 ${props.borderColor}`;
    }
    return '';
  };

  const rounded = () => {
    if (props.radius === 'sm') {
      return 'rounded-[0.3vw]';
    } else if (props.radius === 'md') {
      return 'rounded-md';
    } else if (props.radius === 'lg') {
      return 'rounded-lg';
    } else if (props.radius === 'full') {
      return 'rounded-full';
    } else {
      return 'rounded-none';
    }
  };
  const placeholderStyle = () => {
    if (props.placeholderStyle) {
      return props.placeholderStyle;
    } else {
      return '';
    }
  };

  const colorsBg = colorsBgFn();
  const colorsHover = colorsHoverFn();
  const border = borderColor();
  const radius = rounded();
  const placeholderClass = placeholderStyle();

  return (
    <TextField
      className={` 
    ${props.marginT ? props.marginT : ''} 
    flex w-[100%] items-center ${border}  ${radius} ${colorsBg} ${colorsHover} ${colorsBg}
    ${clicked ? `${border}` : ''} 

   
  `}
      isDisabled={props.isDisabled ? props.isDisabled : false}
      style={{
        backgroundColor: `${props.bgColor ? props.bgColor : ''}`,
        borderColor: `${props.borderColor ? props.borderColor : ''}`,
      }}
    >
      <div className="flex w-[6.5%] items-center justify-end ">
        <SearchIcon
          className={
            'h-[0.83vw] w-[0.83vw]'
          }
          strokeColor={props.strokeColor}
          
        />
      </div>
      <div className="flex w-[90%] items-center justify-center">
        <Input
          {...props}
          placeholder={clicked ? '' : props.placeholder}
          onFocus={() => setClicked(true)}
          onBlur={() => setClicked(false)}
          onChange={handleInputChange}
          value={value}
          type={props.type === 'number' ? 'text' : `${props.type}`}
          className={merger(
            `w-[98%] bg-transparent 
        ${clicked ? 'border-transparent' : ''} 
        ${colorsHover}  
        focus:outline-none 
          ${placeholderClass}
        ${props.textStyle ? `${props.textStyle}` : ' font-normal text-black'} 
        ${
          props.height === 'sm'
            ? 'h-[3.14vh]'
            : props.height === 'md'
              ? 'h-[3.98vh]'
              : props.height === 'lg'
                ? 'h-10'
                : props.height === 'xl'
                  ? 'h-12'
                  : props.height
        } 
        placeholder:text-[0.65vw]
      `,
            props?.inputClassName,
          )}
        />
      </div>
    </TextField>
  );
}
