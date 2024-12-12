import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { Input } from 'react-aria-components';

export default function TableInput({
  json,
  path,
  keys,
  editedValues,
  setEditedValues,
  modalRef,
  placeholder,
}) {
  const value = useMemo(
    () => editedValues[path + '.' + keys] ?? _.get(json, keys) ?? '',
    [editedValues[path + '.' + keys], json, keys],
  );

  const hasValue = value !== '';

  const valuemore20 = value.length > 20;

  return (
    <div className="w-[100%]">
      <Input
        key={path + '.' + keys}
        className={`w-[100%] placeholder-[#1C274C] placeholder-opacity-20 placeholder:text-[0.83vw] dark:placeholder-[#3f3f3f]  ${
          hasValue
            ? 'border-transparent text-[0.72vw]'
            : 'rounded-sm border border-[#E7EAEE] bg-transparent dark:border-[#3f3f3f]'
        } px-[0.25vw] py-[0.85vh]  text-[0.83vw] font-medium text-black shadow-none outline-none transition-all duration-300 ease-in-out focus:rounded-sm focus:border focus:border-[#E7EAEE] focus:bg-white focus:px-[0.45vw] focus:pr-[0.5vw]  focus:text-[0.72vw] focus:outline-none dark:text-white dark:focus:bg-[#3d3d3d]`}
        type="text"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            modalRef && modalRef?.current?.blur();
          }
        }}
        value={value}
        onChange={(e) => {
          setEditedValues((prev) => ({
            ...prev,
            [path + '.' + keys]: e.target.value,
          }));
        }}
        inputProps={{
          ref: modalRef && modalRef,
        }}
        style={{
          width: valuemore20 ? '30vh' : '23vh',
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
