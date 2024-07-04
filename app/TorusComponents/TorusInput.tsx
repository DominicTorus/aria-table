import { useEffect, useState } from "react";
import { Input, Label } from "react-aria-components";
import React from "react";

export default function TorusInput(props: any) {
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    toggleClicked();
    colorsBorderFn();
    colorsLabelFn();
  }, [props.value, props.labelColor, props.borderColor]);

  const colorsLabelFn = () => {
    if (props.labelColor) {
      return props.labelColor;
    }
    return "";
  };

  const colorsBorderFn = () => {
    if (props.borderColor) {
      return props.borderColor;
    }
    return "";
  };

  console.log(
    colorsBorderFn(),
    "colorsBorderFn()",
    colorsLabelFn(),
    "colorsLabelFn()"
  );
  const toggleClicked = () => {
    if (value.length > 0) {
      setClicked(false);
    } else setClicked(true);
  };

  const handleInputChange = (e: {
    target: { value: string | any[]; name: string | any; type: string | any };
  }) => {
    if (e.target.type == "number") {
      setValue((prev: any) => ({
        ...prev,
        [e.target.name]: Number(e.target.value),
      }));
    } else {
      setValue((prev: any) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <div
      className={`w-[100%] flex justify-between relative ${
        props.marginT ? `${props.marginT}` : ""
      }`}
    >
      <Label
        onClick={toggleClicked}
        className={`cursor-pointer absolute ${
          clicked
            ? "left-5 top-[5px]"
            : `left-0 top-[-25px] font-semibold ${colorsLabelFn()}  font-small`
        } 
       transition-all ease-in-out duration-150`}
      >
        {props.label}
      </Label>
      <Input
        {...props}
        placeholder={clicked ? "" : props.placeholder}
        onClick={toggleClicked}
        onChange={handleInputChange}
        value={value}
        className={`w-[100%] bg-transparent  outline-none border-2 border-b-slate-500/30 
              border-t-transparent border-l-transparent border-r-transparent
              ${colorsBorderFn()} transition-all ease-linear duration-75 ${
          clicked ? "border-transparent" : ""
        } px-3 py-1`}
      />
    </div>
  );
}
