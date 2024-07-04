import React from "react";
import { RadioGroup, Radio, Input } from "react-aria-components"; // Import your radio components from your UI library
import { Label } from "react-aria-components"; // Import Label component if needed

export default function TorusRadio(props) {
  return (
    <div
      className={`${props.marginT} flex flex-col items-center w-[100%]`}
    >
      {props.label && <Label className="pl-5 w-full">{props.label}</Label>}
      <div className="w-[100%] flex justify-start">
        <div className="flex items-center flex-col justify-start">
          {props.content?.map((value, index) => {
            return (
              <div className="flex items-center  w-[100%]">
                <div className="w-[20%] flex justify-start items-center ">
                  <Input
                    type="radio"
                    value=""
                    name="default-radio"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 torus-focus-within:ring-pink-500 torus-focus:ring-transparent dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="w-[80%] flex justify-start items-center">
                  <Label class="ms-2  text-gray-900 dark:text-gray-300 whitespace-nowrap">
                    {value}
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
