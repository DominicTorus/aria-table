import React from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export default function TorusPopOver({
  children,
  parentHeading,
  dialogClassName,
}: {
  children: React.ReactNode | ((close: any) => React.ReactNode);
  parentHeading: React.ReactNode;
  dialogClassName: string;
}) {
  return (
    <DialogTrigger>
      <Button>{parentHeading}</Button>
      <Popover
        style={{
          zIndex: 999,
        }}
      >
        <Dialog
          className={twMerge("rounded-lg outline-none ", dialogClassName)}
        >
          {children}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
