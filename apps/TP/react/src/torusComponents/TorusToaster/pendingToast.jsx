import React from 'react';
import './toast.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  ToastClose,
  ToastError,
  ToastSucess,
  ToastWarning,
  TorusInformation,
} from '../../SVG_Application';
const TorusToast = ({ closeToast, toastProps, setWordLength }) => {
  console.log(toastProps, 'ToatProps');
  const [length, setLength] = React.useState(0);
  React.useEffect(() => {
    let count = toastProps?.text?.trim().split(/\s+/).filter(Boolean).length;
    if (count > 0) {
      setWordLength(count);
      setLength(count);
    }
  }, []);
  if (length) {
    const element = document.getElementsByClassName('Toastify__toast-body')[0];
    if (element) {
      element.style.width =
        length <= 30
          ? '20rem'
          : length > 30 && length <= 50
            ? '10rem '
            : length > 50 && length <= 80
              ? '20rem'
              : length > 80 && length <= 130
                ? '25rem'
                : length > 130 && length <= 180
                  ? '30rem'
                  : length > 180 && length <= 210
                    ? '45rem'
                    : '50rem';
    }
  }
  console.log(length, 'countWords');
  return (
    <div className="z-[999] flex h-full w-full flex-col">
      {' '}
      <div className="z-[999] flex w-[100%] justify-between">
        {' '}
        <div className="z-[999] flex w-[50%] items-center justify-start">
          {' '}
          <div className="z-[999] flex w-[10%] items-center justify-start">
            {' '}
            {toastProps.type === 'success' ? (
              <ToastSucess />
            ) : toastProps.type === 'warning' ? (
              <ToastWarning />
            ) : toastProps.type === 'error' ? (
              <ToastError />
            ) : toastProps.type === 'info' ? (
              <TorusInformation />
            ) : toastProps.type === 'progress' ? (
              <Spinner />
            ) : null}{' '}
          </div>{' '}
          <div className="flex w-[90%] items-center justify-start">
            {' '}
            <p className="font-roboto text-lg font-medium text-white ">
              {' '}
              {toastProps.title}{' '}
            </p>{' '}
          </div>{' '}
        </div>{' '}
        <div className="flex w-[50%] items-center justify-end">
          {' '}
          <button onClick={closeToast}>
            {' '}
            <ToastClose />{' '}
          </button>{' '}
        </div>{' '}
      </div>{' '}
      <div>
        {' '}
        {length <= 30 ? (
          <p className="font-roboto text-sm font-normal leading-3 text-white">
            {' '}
            {toastProps.text}{' '}
          </p>
        ) : length > 30 && length <= 50 ? (
          <p className="font-roboto text-xs leading-3 text-white ">
            {' '}
            {toastProps.text}{' '}
          </p>
        ) : length > 50 && length <= 80 ? (
          <p className="font-roboto text-xs leading-3 text-white ">
            {' '}
            {toastProps.text}{' '}
          </p>
        ) : length > 80 && length <= 130 ? (
          <p className="font-roboto text-xs leading-3 text-white ">
            {' '}
            {toastProps.text}{' '}
          </p>
        ) : length > 130 && length <= 180 ? (
          <p className="font-roboto text-xs leading-3 text-white ">
            {' '}
            {toastProps.text}{' '}
          </p>
        ) : length > 180 && length <= 210 ? (
          <p className="font-roboto text-xs leading-3 text-white ">
            {' '}
            {toastProps.text}{' '}
          </p>
        ) : (
          <p className="font-roboto text-xs leading-3 text-white ">
            {' '}
            {toastProps.text}{' '}
          </p>
        )}{' '}
      </div>{' '}
    </div>
  );
};
export default TorusToast;
const Spinner = () => (
  <div
    className={`mx-auto h-4 w-4 animate-spin rounded-full       border-4      border-gray-300 border-t-gray-400`}
  />
);
