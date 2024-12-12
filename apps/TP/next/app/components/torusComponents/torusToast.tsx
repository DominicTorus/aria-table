import React, { useEffect, useState } from "react";
import "../../globals.css";
import "react-toastify/dist/ReactToastify.css";
import {
  ToastClose,
  ToastError,
  ToastSucess,
  ToastWarning,
  TorusInformation,
} from "../../constants/svgApplications";

const TorusToast = ({ closeToast, toastProps, setWordLength }: any) => {
  const [length, setLength] = useState(0);

  useEffect(() => {
    let count = toastProps?.text?.trim().split(/\s+/).filter(Boolean).length;

    if (count > 0) {
      setWordLength(count);
      setLength(count);
    }
  }, []);

  if (length) {
    const element: any = document.getElementsByClassName(
      "Toastify__toast-body"
    )[0];

    if (element) {
      element.style.width =
        length <= 30
          ? "20rem"
          : length > 30 && length <= 50
            ? "10rem "
            : length > 50 && length <= 80
              ? "20rem "
              : length > 80 && length <= 130
                ? "25rem "
                : length > 130 && length <= 180
                  ? "30rem "
                  : length > 180 && length <= 210
                    ? "45rem "
                    : "50rem ";
    }
  }
  return (
    <div className="z-[999] flex h-full w-full flex-col gap-2">
      <div className="z-[999] flex w-[100%] justify-between">
        <div className="z-[999] flex w-[50%] items-center justify-start gap-1">
          <div className="z-[999] flex w-[10%] items-center justify-start">
            {toastProps.type === "success" ? (
              <ToastSucess />
            ) : toastProps.type === "warning" ? (
              <ToastWarning />
            ) : toastProps.type === "error" ? (
              <ToastError />
            ) : toastProps.type === "info" ? (
              <TorusInformation />
            ) : null}
          </div>
          <div className="flex w-[90%] items-center justify-start">
            <p className="font-roboto font-medium text-[0.93vw] leading-[1.66vh] text-white text-nowrap">
              {toastProps.title}
            </p>
          </div>
        </div>
        <div className="flex w-[50%] items-center justify-end">
          <button onClick={closeToast}>
            <ToastClose />
          </button>
        </div>
      </div>
      <div className="ml-5">
        {length <= 30 ? (
          <p className="font-roboto text-[0.72vw] leading-[1.94vh] text-white">
            {toastProps.text}
          </p>
        ) : length > 30 && length <= 50 ? (
          <p className="font-roboto text-[0.72vw] leading-[1.94vh] text-white ">
            {toastProps.text}
          </p>
        ) : length > 50 && length <= 80 ? (
          <p className="font-roboto text-[0.72vw] leading-[1.94vh] text-white ">
            {toastProps.text}
          </p>
        ) : length > 80 && length <= 130 ? (
          <p className="font-roboto text-[0.72vw] leading-[1.94vh] text-white ">
            {toastProps.text}
          </p>
        ) : length > 130 && length <= 180 ? (
          <p className="font-roboto text-[0.72vw] leading-[1.94vh] text-white ">
            {toastProps.text}
          </p>
        ) : length > 180 && length <= 210 ? (
          <p className="font-roboto text-[0.72vw] leading-[1.94vh] text-white ">
            {toastProps.text}
          </p>
        ) : (
          <p className="font-roboto text-[0.72vw] leading-[1.94vh] text-white ">
            {toastProps.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default TorusToast;
