import React, { useMemo } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
  ToastClose,
  ToastError,
  ToastSucess,
  ToastWarning,
  TorusInformation,
} from '../../SVG_Application';
import './toast.css';

const TorusToast = ({ closeToast, toastProps }) => {
  console.log(toastProps, closeToast, 'ToastProps');
  const length = useMemo(() => {
    const count = toastProps?.text?.trim().split(/\s+/).filter(Boolean).length;
    if (count > 0) return count;
    return 0;
  }, [toastProps]);

  // if (length) {
  //   const element = document.getElementsByClassName('Toastify__toast-body')[0];
  //   if (element) {
  //     element.style.width =
  //       length <= 30
  //         ? '20rem'
  //         : length > 30 && length <= 50
  //           ? '10rem '
  //           : length > 50 && length <= 80
  //             ? '20rem'
  //             : length > 80 && length <= 130
  //               ? '25rem'
  //               : length > 130 && length <= 180
  //                 ? '30rem'
  //                 : length > 180 && length <= 210
  //                   ? '45rem'
  //                   : '50rem';
  //   }
  // }

  return (
    <div
      style={{
        width:
          length <= 30
            ? '18vw'
            : length > 30 && length <= 50
              ? '25vw '
              : length > 50 && length <= 80
                ? '15vw'
                : length > 80 && length <= 130
                  ? '20vw'
                  : length > 130 && length <= 180
                    ? '25vw'
                    : length > 180 && length <= 210
                      ? '35vw'
                      : '40vw',
        
        height: 'auto',
        padding:"0.35vw "
      }}
      className=" flex h-full w-full flex-col gap-[0.25vw]"
    >
      <div className=" flex h-[50%] w-[100%] justify-between">
        <div className=" flex w-[50%] items-center justify-start gap-[0.5vw]">
          <div className=" flex w-[20%]  items-center justify-start">
            {toastProps.type === 'success' ? (
              <ToastSucess className={'h-[1.25vw] w-[1.25vw]  '} />
            ) : toastProps.type === 'warning' ? (
              <ToastWarning className={'h-[1.25vw] w-[1.25vw]  '} />
            ) : toastProps.type === 'error' ? (
              <ToastError className={'h-[1.25vw] w-[1.25vw]  '} />
            ) : toastProps.type === 'info' ? (
              <TorusInformation className={'h-[1.25vw] w-[1.25vw]  '} />
            ) : toastProps.type === 'progress' ? (
              <Spinner />
            ) : (
              toastProps.type === 'pending' && <Spinner />
            )}
          </div>
          <div className="flex w-[90%] items-center justify-start">
            <div
              className={`font-roboto whitespace-nowrap text-[0.82vw] font-medium ${toastProps.type === 'pending' ? 'text-black' : 'text-white'} `}
            >
              {toastProps.title}
            </div>
          </div>
        </div>
        <div className="flex w-[5%] items-center justify-end">
          <button onClick={closeToast}>
            <ToastClose className={'h-[1vw] w-[1vw]  '} />
          </button>
        </div>
      </div>
      <div className="flex h-[50%] w-[100%] items-center justify-center ">
        <div
          className={`  ${toastProps.type === 'pending' ? 'text-black' : 'text-white'}  font-roboto w-full text-wrap text-[0.72vw] leading-3`}
        >
          {toastProps.text}
        </div>
      </div>
    </div>
  );
};

export default TorusToast;


const Spinner = () => (
  <div
    className={`mx-auto h-4 w-4 animate-spin rounded-full 
      border-4 border-white border-t-gray-300`}
  />
);
