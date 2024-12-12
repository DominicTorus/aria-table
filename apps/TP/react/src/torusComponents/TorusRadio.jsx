import React from 'react';
import { Radio, RadioGroup } from 'react-aria-components'; // Import your radio components from your UI library
import { CheckBox } from '../SVG_Application';
import { merger } from '../utils/utils';

export default function TorusRadio(props) {
  const handleOnChange = (e) => {
    props.onChange && props.onChange(e);
  };

  return (
    <RadioGroup
      value={props.value}
      className={props.radioGrpClassName}
      onChange={handleOnChange}
      orientation={props.orientation}
      isDisabled={props.isDisabled}
    >
      {props.content &&
        props.content?.map((value, index) => {
          return (
            <>
              <Radio
                className={merger(
                  'flex cursor-pointer flex-row  items-start gap-2 ',
                  props.radioClassName,
                )}
                key={index}
                id={`radio-${index}`}
                value={value.values}
              >
                {({ isSelected }) => (
                  <>
                    <CheckBox
                      size={'0.80vw'}
                      checkBoxClassname={`transition-all duration-300 fade-in-out ${isSelected ? 'fill-[#0736C4]' : 'dark:fill-[#161616] dark:stroke-[#F0F0F1] dark:stroke-2 fill-white'}`}
                    />

                    <span className=" flex w-[100%] flex-col gap-[0.25vh]  overflow-hidden text-[0.72vw]  font-medium ">
                      {value.values && (
                        <span
                          className="whitespace-nowrap text-[0.72vw]  font-medium  "
                          style={{
                            color: `${props.valueColor ? props.valueColor : ''}`,
                          }}
                        >
                          {value.values}
                        </span>
                      )}

                      {value.label && (
                        <span
                          className="whitespace-nowrap text-[0.72vw]  font-medium  "
                          style={{
                            color: `${props.labelColor ? props.labelColor : ''}`,
                          }}
                        >
                          {value.label}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </Radio>
            </>
          );
        })}
    </RadioGroup>
    // <div className={` ${props.className}  w-[100%] `} key={props.key}>
    //   <div
    //     className={`${props.marginT} flex w-[100%] flex-col gap-0.5 rounded-md bg-white`}
    //   >
    //     <div className=" flex w-[100%]  items-center">
    //       <div
    //         className={` items-center  ${
    //           props.orientation === "vertical"
    //             ? " flex  flex-col gap-3"
    //             : "flex-row gap-[0.5rem]"
    //         }

    //         ${props.content?.length > 4 && "grid grid-cols-12"}`}
    //       >
    //         {props.content?.map((value, index) => {
    //           return (
    //             <div
    //               className={`
    //                 ${
    //                   props.content?.length > 3 &&
    //                   "col-span-6 max-xl:col-span-6 max-lg:col-span-12 max-md:col-span-12"
    //                 }

    //               flex  gap-0.5`}
    //             >
    //               <div className="">
    //                 <Input
    //                   type="radio"
    //                   id={`radio-${index}`}
    //                   key={index}
    //                   value={value.values}
    //                   name="default-radio"
    //                   onChange={handleOnChange}
    //                   className={` ${
    //                     props.size === "sm"
    //                       ? "h-3 w-3"
    //                       : props.size === "md"
    //                         ? "h-4 w-4"
    //                         : props.size === "lg"
    //                           ? "h-5 w-5"
    //                           : props.size === "xl"
    //                             ? "h-6 w-6"
    //                             : "h-4 w-4"
    //                   }`}
    //                 />
    //               </div>
    //               <div className="flex  flex-col  justify-center ">
    //                 <Label className="whitespace-nowrap text-[0.72vw] font-medium text-[#000000]">
    //                   {value.values}
    //                 </Label>
    //                 <Label
    //                   className="text-[0.80vw] text-[#AFAFAF]"
    //                   htmlFor={`radio-${index}`}
    //                 >
    //                   {value.label}
    //                 </Label>
    //               </div>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //     {/* {props.label && (
    //       <Label className="text-xs text-[#000000]/50">{props.label}</Label>
    //     )} */}
    //   </div>
    // </div>
  );
}
