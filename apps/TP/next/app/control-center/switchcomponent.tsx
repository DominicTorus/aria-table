import React from 'react';

interface SwitchProps {
  isSelected: boolean;
  onChange: () => void;
  localAccentColor:string
}

const SwitchComponent = ({ isSelected, onChange, localAccentColor}: SwitchProps) => {


  return (
    <label className="flex items-center cursor-pointer">
    {/* <span className="mr-3 text-[0.72vw] leading-[1.04vw] text-[#000000]/50 whitespace-nowrap">{label}</span> */}
    <div className='justify-between'>
    <div
    style={{background : isSelected ? localAccentColor : "#d1d5db"}}
      className={` w-[1.70vw] h-[1vw] rounded-full transition-colors duration-300 flex items-center`}
      onClick={onChange}
    >
    
      <div
        className={` w-[0.65vw] h-[0.61vw] bg-white  rounded-full shadow-md  ${
          isSelected ? 'translate-x-[1vw]' : 'translate-x-[0.1vw]'
        }`}
      />
    </div>
    </div>
  </label>
  
  );
};
export default SwitchComponent;