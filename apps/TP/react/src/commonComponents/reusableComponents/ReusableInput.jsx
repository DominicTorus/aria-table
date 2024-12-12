import { Input } from '@nextui-org/react';
import React from 'react';

export default function ReusableInput({
  value,
  label,
  defaultValue,
  placeholder,
  type = 'text',
  darkMode,
  handleChange,
  errrMsg,
  labelPlacement = 'outside',
  isinvalid,
  startContent,
  endContent,
  isClearable = true,
  inputProps,
}) {
  return (
    <Input
      errorMessage={errrMsg}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      isInvalid={isinvalid}
      type={type}
      isClearable={isClearable}
      radius="sm"
      label={label}
      startContent={startContent}
      endContent={endContent}
      labelPlacement={labelPlacement}
      className="text-gray-700  dark:text-black"
      classNames={{
        base: 'text-slate-700 w-full dark:text-gray-200',
        label: [
          'data-[focused=true]:border-none text-sm font-bold text-zinc-700 dark:text-white',
        ],
        mainWrapper: 'h-full text-slate-700 ',
        input: [
          'bg-transparent',
          'text-white',
          'placeholder:text-sm dark:text-white text-black ',
        ],
        inputWrapper: [
          'h-[8px] rounded-md text-slate-700 bg-transparent hover:bg-[#D9DEE8] hover:border-blue-500/50 hover:text-slate-700 border border-slate-500/75 dark:border-slate-500/50 ',
          'dark:data-[focused=true]:border-pink-500/50',
        ],
      }}
      {...inputProps}
    />
  );
}
