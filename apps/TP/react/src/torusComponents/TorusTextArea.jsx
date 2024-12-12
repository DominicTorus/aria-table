import React, { useEffect, useState } from 'react';
import { Label, TextArea, TextField } from 'react-aria-components';

const TorusModularTextArea = (props) => {
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState(props.defaultValue || props.value || '');
  const [error, setError] = useState(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (props.autoSize && props.onHeightChange) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const newHeight = textarea.scrollHeight;
        setHeight(newHeight);
        props.onHeightChange(newHeight);
      }
    }
  }, [value, props.autoSize, props.onHeightChange]);

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
    props.onChange(inputValue);
  };

  const handleBlur = () => {
    setClicked(false);
    if (props.isRequired && !value.trim()) {
      // Check if value is empty or whitespace
      setError('This field is required.');
    } else {
      setError(null);
    }
  };

  const outlineColor = (style) => {
    return `transition-border duration-100 ease-in-out border-2 ${style || ''}`;
  };

  const colorsBgFn = () => {
    return props.bgColor || '';
  };

  const labelStyle = (style) => {
    return `${props.labelSize} font-medium ${style || ''}`;
  };

  const colorsBg = colorsBgFn();

  const renderLabel = () => (
    <div className="flex w-[100%] items-center justify-start">
      <Label className={labelStyle(props.labelColor)}
      style={{
        color: `${props.labelColor || ''}`,
      }}
      >{props.label}</Label>
    </div>
  );

  return (
    <div
      className={`w-full rounded-md px-1.5 py-1 ${
        props.marginT || 'mt-1'
      } ${clicked ? '' : ''}`}

      style={{
        backgroundColor: colorsBg,
      }}
    >
      {props.labelPlacement === 'top' && renderLabel()}
      <TextField
        isReadOnly={props.isReadOnly || false}
        isRequired={props.isRequired || false}
        isInvalid={props.isInvalid || false}
        isDisabled={props.isDisabled || false}
        className={`flex w-full items-center justify-center ${
          props.radius === 'sm'
            ? 'rounded-sm'
            : props.radius === 'md'
              ? 'rounded-md'
              : props.radius === 'lg'
                ? 'rounded-lg'
                : props.radius === 'full'
                  ? 'rounded-full'
                  : 'rounded-none'
        }`}
      >
        {props.labelPlacement === 'left' && renderLabel()}
        <div className={`flex w-[100%]`}>
          <div className="flex w-[100%] justify-start">
            <TextArea
              placeholder={props.placeholder || ''}
              onChange={handleInputChange}
              onFocus={() => setClicked(true)}
              onBlur={handleBlur}
              value={value}
              className={`w-[100%] bg-transparent focus:outline-none ${
                props.textColor
                  ? `${props.textColor} ${props.textSize} font-normal`
                  : '  font-normal'
              } ${
                props.size === 'sm'
                  ? 'h-6'
                  : props.size === 'md'
                    ? 'h-8'
                    : props.size === 'lg'
                      ? 'h-10'
                      : props.size === 'xl'
                        ? 'h-12'
                        : props.size
              } 
              placeholder:text-[0.65vw]
              `}
              style={props.autoSize ? { height: `${height}px` } : {}}
            />
          </div>
        </div>
        {props.labelPlacement === 'right' && renderLabel()}
      </TextField>

      {props.description && (
        <p className="text-xs text-gray-500">{props.description}</p>
      )}

      {props.errorShown && error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TorusModularTextArea;
