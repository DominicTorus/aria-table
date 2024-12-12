import { Checkbox } from '@nextui-org/react';
import React from 'react';
const Checkboxx = () => {
  return (
    <div className="flex flex-col gap-4 border-slate-700 bg-slate-100 p-2">
      <Checkbox defaultSelected size="sm">
        Small
      </Checkbox>
      <Checkbox defaultSelected size="md">
        Medium
      </Checkbox>
      <Checkbox defaultSelected size="lg">
        Large
      </Checkbox>
    </div>
  );
};

export default Checkboxx;
