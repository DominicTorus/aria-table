import React from 'react';
import { Input, Label } from 'react-aria-components';

export default function TorusCheckBox(props) {


  const handleOnChange = (e) => {
    const value = e.target.value;
    props.onChange && props.onChange((prevSelectedValues) => {
      if (prevSelectedValues.includes(value)) {
        return prevSelectedValues.filter((item) => item !== value);
      } else {
        return [...prevSelectedValues, value];
      }
    });
  };

  return (
    <>
      {(
        <div className=" w-[100%] ">
          <div
            className={`${props.marginT} flex w-[100%] flex-col gap-0.5 rounded-md bg-white px-2 py-3`}
          >
            {props.label && (
              <Label className="text-xs text-[#000000]/50  text-[0.72vw] ">{props.label}</Label>
            )}
            <div className="w-[100%]">
              <div
                className={`flex items-center justify-start ${
                  props.content &&  props.content?.length > 3 ? 'grid grid-cols-8' : ''
                }`}
              >
                {props.content &&props.content?.map((value, index) => {
                  return (
                    <div
                      className={`${
                        props.content?.length > 2 ? 'col-span-4' : 'w-[100%]'
                      } flex items-center`}
                    >
                      <div className="flex w-[10%] items-center  text-[0.72vw]  justify-start">
                        <Input
                          type="checkbox"
                          key={index}
                          value={`${value}`}
                          name="default-radio"
                          onChange={handleOnChange}
                          className="h-3 w-3  text-[0.72vw]  border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 torus-focus-within:ring-pink-500 torus-focus:ring-transparent dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                      </div>
                      <div className="flex w-[90%] items-center justify-start">
                        <Label className="ms-2 whitespace-nowrap text-[0.72vw]  text-[#000000] ">
                          {value}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {props.type === 'single ' && (
        <div className="g-white w-[100%] rounded-md px-2 py-3">
          <div className="flex w-[10%] items-center justify-start">
            <Input
              type="checkbox"
              name="default-radio"
              onChange={handleOnChange}
              className="h-3 w-3 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 torus-focus-within:ring-pink-500 torus-focus:ring-transparent dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
          </div>
        </div>
      )}
    </>
  );
}
