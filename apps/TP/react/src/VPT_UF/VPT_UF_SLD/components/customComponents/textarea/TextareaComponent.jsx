import { Textarea } from '@nextui-org/react';
import React from 'react';

export const TextareaComponent = ({ height, width }) => {
  return (
    <div>
      <Textarea
        style={{
          height: height,
          width: width,
        }}
        variant="faded"
        label="Description"
        placeholder="Enter your description"
        description="Enter a concise description of your project."
        className="max-w-xs"
      />
    </div>
  );
};
