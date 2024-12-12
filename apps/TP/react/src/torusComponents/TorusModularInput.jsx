/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Input, Label, TextField } from 'react-aria-components';
import { IoIosCloseCircle } from 'react-icons/io';

const TorusModularInput = ({
  otherMethod,
  defaultValue = '',
  value: propValue,
  onChange,
  onPaste,
  maxLength,
  type = 'text',
  placeholder,
  bgColor,
  borderColor,
  labelColor,
  textColor,
  size,
  radius,
  marginT,
  isReadOnly,
  isRequired,
  isDisabled,
  startContent,
  endContent,
  errorShown,
  description,
  isClearable,
  label,
  backgroundColor,
  textSize,
  inputClassName,
  wrapperClass,
  labelSize,
  children,
}) => {
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (propValue !== undefined && propValue !== null) {
      setValue(propValue);
    } else if (defaultValue !== undefined && defaultValue !== null) {
      setValue(defaultValue);
    }
  }, [propValue, defaultValue]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const isNumberInput = type === 'number';

    const sanitizedValue = isNumberInput
      ? inputValue.replace(/[a-zA-Z]+/g, '')
      : inputValue;

    setValue(sanitizedValue);
    onChange?.(sanitizedValue);
    setClicked(sanitizedValue.length > 0);
  };

  const handlePaste = (e) => {
    console.log("paste",e)
    e.preventDefault();

    const pastedData = e.clipboardData?.getData('text');
    const updatedValue = value + pastedData;

    setValue(updatedValue);
    onPaste?.(updatedValue);
    onChange?.(updatedValue);
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && (event.key === 'v' || event.key === 'V')) {
      const value =event.clipboardData;
      console.log('Ctrl+V detected',event,inputRef,value);

      inputRef.current?.focus(); 
      handleInputChange(event);
    }
    otherMethod?.onkeydown?.(event);
  };

  const handleBlur = (e) => {
    setClicked(false);
    if (isRequired && !value) {
      setError('This field is required.');
    }
    otherMethod?.onblur?.(e);
  };

  const handleClear = () => {
    setValue('');
    setError(null);
    onChange?.('');
  };

  const outlineColor = (style) =>
    `transition-border duration-100 ease-in-out border-2 ${style}`;

  const labelStyle = (style) => `${labelSize} font-medium ${style}`;

  return (
    <div
      className={`w-full rounded-md focus-within:border-none focus-within:outline-none ${wrapperClass || ''} ${marginT || ''}`}
      style={{
        backgroundColor: bgColor || '',
      }}
    >
      {label && (
        <div className="flex w-full items-center justify-start">
          <Label
            className={labelStyle(labelColor)}
            style={{
              color: labelColor || '',
            }}
          >
            {label}
          </Label>
        </div>
      )}

      <TextField
        isReadOnly={isReadOnly || false}
        isRequired={isRequired || false}
        isDisabled={isDisabled || false}
        className={`flex w-full items-center focus-within:border-none focus-within:outline-none ${
          startContent ? 'justify-center' : ''
        } ${
          radius === 'sm'
            ? 'rounded-sm'
            : radius === 'md'
            ? 'rounded-md'
            : radius === 'lg'
            ? 'rounded-lg'
            : radius === 'full'
            ? 'rounded-full'
            : 'rounded-none'
        }`}
      >
        {startContent && (
          <div className="flex w-[10%] items-center justify-center text-sm font-normal">
            {startContent}
          </div>
        )}
        <div
          className={`flex items-center ${
            startContent || (endContent && 'justify-between')
          } ${isClearable ? 'w-[90%]' : 'w-[100%]'}`}
        >
          <Input
            aria-label={label}
            placeholder={placeholder || ''}
            onChange={handleInputChange}
            ref={inputRef}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            value={value}
            type={type === 'number' ? 'text' : type}
            className={`w-[100%] bg-transparent px-1 focus:outline-none ${
              textSize || 'text-sm'
            } ${textColor || 'text-black'} ${
              size === 'sm'
                ? 'h-3'
                : size === 'md'
                ? 'h-8'
                : size === 'lg'
                ? 'h-10'
                : size === 'xl'
                ? 'h-12'
                : size
            } ${inputClassName || ''} placeholder:text-[0.65vw]`}
            disabled={isDisabled}
          />
          {isClearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="flex w-[10%] items-center justify-center"
            >
              <IoIosCloseCircle
                size={15}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}
        </div>
        {endContent && (
          <div className="flex items-center justify-center text-sm font-normal">
            {endContent}
          </div>
        )}
      </TextField>

      {errorShown && (
        <>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {!error && description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </>
      )}
    </div>
  );
};

export default TorusModularInput;
