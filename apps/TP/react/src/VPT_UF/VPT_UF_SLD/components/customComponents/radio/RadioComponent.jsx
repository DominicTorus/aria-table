import { Radio, RadioGroup } from '@nextui-org/react';
import React from 'react';
// import { CiCircleList } from "react-icons/ci";

export const RadioComponent = ({ height, width, json }) => {
  return (
    <div className="flex w-full items-center justify-center px-2  py-2">
      <RadioGroup
        label="Select your favorite city"
        style={{
          height: height,
          width: width,
        }}
      >
        <Radio size="md" value="buenos-aires">
          <span className="text-white"> Buenos Aires</span>
        </Radio>
        <Radio size="md" value="sydney">
          <span className="text-white">Lionel Andres Messi </span>
        </Radio>
        <Radio size="md" value="san-francisco">
          <span className="text-white"> San Francisco</span>
        </Radio>
        <Radio size="md" value="london">
          <span className="text-white">London </span>
        </Radio>
      </RadioGroup>
    </div>
  );
};
