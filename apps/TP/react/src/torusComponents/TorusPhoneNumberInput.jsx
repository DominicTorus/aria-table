import React, { useEffect, useState } from 'react';
import { Input, Label, ListBoxItem, TextField } from 'react-aria-components';
import { IoIosCheckmark } from 'react-icons/io';
import { Question } from '../SVG_Application';
import countryCode from './countryCode.json';
import PortalDropdown from './PortalDropdown';

export default function TorusPhoneNumberInput(props) {
  const [countryCodeList, setCountryCodeList] = useState([]);
  const [selectedCC, setSelectedCC] = useState(new Set(['IN']));
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState(props.value || '');
  const [inputDefaultValue, setInutDefaultValue] = useState(null);
  const [defaultLength, setDefaultLength] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedKeyLength, setSelectedKeyLength] = useState(null);
  const [displayValue, setDisplayValue] = useState('IN');
  const [error, setError] = useState(null);

  const gettingCountryCode = () => {
    if (displayValue) {
      let code = countryCode.find((item) => {
        return item.code == displayValue;
      });
      console.log(code, 'code-1');
      if (code) {
        setDefaultLength(code?.phoneLength);
        setInutDefaultValue(code);
      }
    }
  };

  console.log(inputDefaultValue, 'keyss{IN}');
  console.log(defaultLength, 'keyss.length');
  console.log(selectedKeys, 'keyss{}');
  console.log(selectedKeyLength, 'keyss{.length}');

  const renderOption = (item, close, handleSelectionChange) => (
    <ListBoxItem
      key={item.code}
      textValue={item.specialKey}
      onAction={() => handleSelectionChange(item, close)}
      className={`flex cursor-pointer justify-between p-2 focus:outline-none`}
    >
      {` +${item.phone} ${item.label}`}
      {selectedKeys.includes(item) ? (
        <IoIosCheckmark size={20} fill="blue" />
      ) : (
        ''
      )}
    </ListBoxItem>
  );

  const gettingCode = (value) => {
    if (value) {
      let code = countryCode.find((item) => item.code == value);
      console.log(code, 'code-1');
      if (code) {
        setInutDefaultValue(code);
      }
    }
  };

  const toggleClicked = () => {
    console.log(value.length, 'length-2');
    if (value.length > 0) {
    } else if (value.length <= 0) {
    }
  };

  useEffect(() => {
    console.log(selectedKeys, 'keyss');
    if (selectedKeys.length > 0) {
      console.log(selectedKeys[0].phoneLength, 'keyss.length->');
      setSelectedKeyLength(selectedKeys[0].phoneLength);
    }
  }, [selectedKeys]);

  useEffect(() => {
    toggleClicked();
    gettingCode(selectedCC);
    gettingCountryCode();
  }, [props.value, countryCode, selectedCC, selectedKeys]);

  const handleInputChange = (e) => {
    const length =
      selectedKeys.length > 0
        ? `${selectedKeys[0]?.phoneLength}`
        : `${inputDefaultValue?.phoneLength}`;
    const regex = new RegExp(`^.{${length}}$`);

    let inputValue = e.target.value;
    if (props.type === 'number') {
      inputValue = inputValue.replace(/[a-zA-Z]+/g, '');
    }

    setValue(inputValue);

    if (!regex.test(inputValue)) {
      setError(`Input must be exactly ${length} characters long.`);
    } else {
      setError('');
      props.onChange(inputValue);
    }
  };

  const colorsBgFn = () => {
    if (props.bgColor) {
      return `${props.bgColor}`;
    }
    return '';
  };

  const colorsBg = colorsBgFn();

  console.log(clicked, 'clicked');
  console.log(countryCodeList, 'countryCodeList');

  return (
    <div
      className={`w-[100%] rounded-md bg-[#FFFFFF] p-2 ${
        props.marginT ? props.marginT : 'mt-1'
      } `}
    >
      <Label className="text--base text-base font-semibold">Phone Number</Label>
      <TextField
        className={` 
    
    flex w-[100%] items-center  ${colorsBg}  ${colorsBg}
    ${
      props.radius === 'sm'
        ? 'rounded-sm'
        : props.radius === 'md'
          ? 'rounded-md'
          : props.radius === 'lg'
            ? 'rounded-lg'
            : props.radius === 'full'
              ? 'rounded-full'
              : 'rounded-none'
    }
  `}
        isDisabled={props.isDisabled ? props.isDisabled : false}
      >
        <div className="flex w-[20%] items-center justify-end">
          <PortalDropdown
            triggerButton={displayValue}
            multiple={false}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            items={countryCode}
            displayParam="code"
            classNames={{
              triggerButton: 'border',
              popover: 'w-[25%]',
              listbox: 'h-80  overflow-y-auto scrollbar-none',
              listboxItem: 'flex justify-between',
            }}
            renderOption={renderOption}
          />
        </div>
        <div className="w-[20%]">
          <Input
            {...props}
            value={
              selectedKeys.length > 0
                ? `+${selectedKeys[0]?.phone} -`
                : `+${inputDefaultValue?.phone} -`
            }
            readOnly
            type={props.type === 'number' ? 'text' : `${props.type}`}
            className={`w-[98%] bg-transparent pl-[0.8rem]
        ${clicked ? 'border-transparent' : ''} 
       
        focus:outline-none 
        ${props.variant === 'fade' ? props.textColor : 'text-black'} 
        ${
          props.textColor
            ? `${props.textColor} font-base font-normal`
            : 'font-base font-normal text-black'
        } 
        ${
          props.height === 'sm'
            ? 'h-6'
            : props.height === 'md'
              ? 'h-8'
              : props.height === 'lg'
                ? 'h-10'
                : props.height === 'xl'
                  ? 'h-12'
                  : 'h-10'
        } 
      `}
          />
        </div>
        <div className="w-[50%]">
          <Input
            {...props}
            onChange={handleInputChange}
            value={value}
            type={props.type === 'number' ? 'text' : `${props.type}`}
            maxLength={
              selectedKeys.length > 0
                ? `${selectedKeys[0]?.phoneLength}`
                : `${inputDefaultValue?.phoneLength}`
            }
            className={`w-[98%] bg-transparent 
        ${clicked ? 'border-transparent' : ''} 
  
        focus:outline-none 
        ${props.variant === 'fade' ? props.textColor : 'text-black'} 
        ${
          props.textColor
            ? `${props.textColor} font-base font-normal`
            : 'font-base font-normal text-black'
        } 
        ${
          props.height === 'sm'
            ? 'h-6'
            : props.height === 'md'
              ? 'h-8'
              : props.height === 'lg'
                ? 'h-10'
                : props.height === 'xl'
                  ? 'h-12'
                  : 'h-10'
        } 
      `}
          />
        </div>
        <div className="w-[10%]">
          <Question />
        </div>
      </TextField>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
