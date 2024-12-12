import { Input } from '@nextui-org/react';
import React from 'react';

const InputComponent = ({ height, width, json }) => {
  return (
    <React.Fragment>
      <div className="flex w-full items-center justify-center px-2  py-2">
        <Input
          style={{
            height: height,
            width: width,
          }}
          type="email"
          label="Email"
          placeholder="Enter your email"
        />
      </div>
    </React.Fragment>
  );
};

export default InputComponent;
