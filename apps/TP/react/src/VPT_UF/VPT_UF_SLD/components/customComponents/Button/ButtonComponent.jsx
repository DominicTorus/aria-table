import { Button } from '@nextui-org/react';
import React from 'react';

const ButtonComponent = ({ height, width, json }) => {
  return (
    <React.Fragment>
      <div className="flex w-full items-center justify-center px-2  py-2">
        <Button
          isDisabled
          style={{
            height: height,
            width: width,
          }}
          className=""
          color="primary"
        >
          Button
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ButtonComponent;
