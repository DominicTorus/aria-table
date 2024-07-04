import React from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Label,
  ListBox,
  ListBoxItem,
  OverlayArrow,
  Popover,
  Select,
  Switch,
} from "react-aria-components";
import { IoIosCheckmark } from "react-icons/io";
import ButtonComponent from "./TorusButton";
const defaultTropdownClassNames = {
  buttonClassName: "p-2 torus-pressed:animate-torusButtonActive",
  popoverClassName:
    "torus-entering:animate-torusPopOverOpen torus-exiting:animate-torusPopOverClose w-40",
  dialogClassName: " outline-none w-full",
  listBoxClassName: `w-full bg-slate-200 border-2 border-gray-300 transition-all p-1  rounded-md gap-1  flex flex-col items-center `,
  listBoxItemClassName:
    " p-1 w-full torus-focus:outline-none torus-hover:bg-blue-300  rounded-md  cursor-pointer transition-colors duration-300",
};
export default function TorusDropDown({
  title,
  classNames,
  buttonHeight = "15px",
  buttonWidth = "15px",
  setSelected,
  selected,
  endContent,
  renderEmptyState,
  items = [
    { key: "Item 1", label: "Item 1" },
    { key: "Item 2", label: "Item 2" },
    { key: "Item 3", label: "Item 3" },
  ],
  popOverProps,
  listBoxProps,

  selectionMode = "multiple",
}: any) {
  return (
    <DialogTrigger>
      <ButtonComponent
        Children={title}
        buttonClassName={
          defaultTropdownClassNames.buttonClassName +
          " " +
          classNames?.buttonClassName
        }
        height={buttonHeight}
        width={buttonWidth}
        value={undefined}
        isDisabled={undefined}
        autoFocus={undefined}
        gap={undefined}
        onPress={undefined}
        pressedWidth={undefined}
        pressedHeight={undefined}
        marginT={undefined}
      />

      <Popover
        placement="bottom"
        className={
          defaultTropdownClassNames.popoverClassName +
          " " +
          classNames?.popoverClassName
        }
        {...popOverProps}
      >
        <Dialog
          className={
            defaultTropdownClassNames.dialogClassName +
            " " +
            classNames?.dialogClassName
          }
        >
          {({ close }) => (
            <ListBox
              className={
                defaultTropdownClassNames.listBoxClassName +
                " " +
                classNames?.listBoxClassName
              }
              selectionMode={selectionMode}
              onSelectionChange={(keys) => {
                setSelected(keys);
                if (selectionMode === "single") {
                  close();
                }
              }}
              renderEmptyState={() => renderEmptyState}
              selectedKeys={selected}
              items={items}
              {...listBoxProps}
            >
              {(item: any) => (
                <ListBoxItem
                  key={item.key}
                  className={
                    defaultTropdownClassNames.listBoxItemClassName +
                    " " +
                    classNames?.listBoxItemClassName
                  }
                >
                  {({ isSelected }) => (
                    <div className="w-full flex justify-between items-center">
                      <Heading>{item.label}</Heading>

                      <div className="flex items-center justify-center  ">
                        <span
                          className={` transition-all duration-150  ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <IoIosCheckmark size={20} className="text-black " />
                        </span>
                        {endContent}
                      </div>
                    </div>
                  )}
                </ListBoxItem>
              )}
            </ListBox>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
