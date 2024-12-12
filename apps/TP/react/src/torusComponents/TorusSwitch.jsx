import React from 'react';

import './switch.css';

export default function TorusSwitch({
  skey,
  label,
  isChecked,
  setIsChecked,
  marginT,
  switchClassName,
}) {
  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <div className={`${marginT} ${switchClassName} `}>
      <span className="switch">
        <input
          key={skey}
          id="switch-rounded"
          type="checkbox"
          className="peer hidden"
          checked={isChecked}
          onChange={handleToggle}
        />
        <label htmlFor="switch-rounded"> </label>
      </span>
      <label className=' text-[0.72vw]  w-10 overflow-hidden'>  {label} </label>
    </div>
  );
}
