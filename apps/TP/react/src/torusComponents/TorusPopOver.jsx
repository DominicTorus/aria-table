import React from 'react';
import { Dialog, DialogTrigger, Popover } from 'react-aria-components';
import TorusButton from './TorusButton';

export default function TorusPopOver({
  children,
  parentHeading,
  popOverContent,
  popBgColor,
  popbuttonClassNames,
  popoverClassName,
  popoverStyle,
  dialogClassName,
  dialogStyle,
  overlayStyle,
  overlayClassName,
  isDisabled = false,
  fontStyle = "",
  background
}) {
  return (
    <DialogTrigger>
      <TorusButton
        bgColor={popBgColor}
        Children={parentHeading}
        startContent={popOverContent}
        buttonClassName={popbuttonClassNames}
        isDisabled={isDisabled}
        fontStyle={fontStyle}
      />

      {/* Overlay for background dimming */}
      <div
        className={({ isEntering, isExiting }) => `
          fixed inset-0 z-40 bg-black/25 transition-opacity 
          ${isEntering ? 'opacity-100 duration-300 ease-out' : ''}
          ${isExiting ? 'opacity-0 duration-200 ease-in' : ''}
          ${overlayClassName || ''}
        `}
        style={{ ...overlayStyle, zIndex: 999 }}
      />

      <Popover
        className={({ isEntering, isExiting }) => `
          focus:outline-spacing-1 absolute z-50 bg-transparent focus:border-spacing-1
          ${isEntering ? 'duration-300 ease-out animate-in fade-in' : ''}
          ${isExiting ? 'duration-200 ease-in animate-out fade-out' : ''}
          ${popoverClassName || ''}
        `}
        style={{ ...popoverStyle, zIndex: 1000 }}
      >
        <Dialog
          className={`${background || 'bg-transparent'} focus:border-none focus:outline-none ${dialogClassName || ''}`}
          style={{ ...dialogStyle }}
        >
          {children}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
