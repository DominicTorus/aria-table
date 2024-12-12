import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';
import { BiDownArrow } from 'react-icons/bi';
import { IoIosCheckmark } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';

const PortalDropdown = ({
  triggerButton,
  multiple = false,
  selectedKeys,
  setSelectedKeys,
  items,
  displayParam,
  classNames,
  renderOption,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelectionChange = (selectedItem, close) => {
    if (multiple) {
      setSelectedKeys((prevKeys) =>
        prevKeys.some((k) =>
          displayParam
            ? k[displayParam] === selectedItem[displayParam]
            : k === selectedItem,
        )
          ? prevKeys.filter((k) =>
              displayParam
                ? k[displayParam] !== selectedItem[displayParam]
                : k !== selectedItem,
            )
          : [...prevKeys, selectedItem],
      );
    } else {
      setSelectedKeys([selectedItem]);
      close();
      setOpen(false);
    }
  };

  const getItemDisplayValue = (item) => {
    return displayParam ? item[displayParam] : item;
  };

  return (
    <DialogTrigger>
      <Button
        className={twMerge(
          `flex w-full items-center justify-between rounded bg-[#F4F5FA] p-2 focus:outline-none ${
            open ? 'border-[#0736C4]' : ''
          }`,
          classNames?.triggerButton,
        )}
        onPress={() => setOpen(!open)}
      >
        {selectedKeys.length
          ? selectedKeys.map((item) => getItemDisplayValue(item)).join(', ')
          : triggerButton}
        <BiDownArrow />
      </Button>
      <Popover
        placement="bottom"
        className={twMerge('w-full', classNames?.popover)}
      >
        <Dialog className="rounded-lg border bg-[#F4F5FA] focus:outline-none">
          {({ close }) => (
            <ListBox
              aria-label="Custom dropdown"
              selectionMode={multiple ? 'multiple' : 'single'}
              className={twMerge('', classNames?.listbox)}
            >
              {items.map((item) => {
                const isSelected = selectedKeys.some((k) =>
                  displayParam
                    ? k[displayParam] === item[displayParam]
                    : k === item,
                );
                if (renderOption) {
                  return renderOption(
                    item,
                    close,
                    handleSelectionChange,
                    setOpen,
                  );
                } else {
                  return (
                    <ListBoxItem
                      key={displayParam ? item[displayParam] : item}
                      textValue={getItemDisplayValue(item)}
                      onAction={() => handleSelectionChange(item, close)}
                      className={twMerge(
                        `p-2 focus:outline-none ${
                          isSelected ? 'bg-[#F9FAFB]' : ''
                        }`,
                        classNames?.listboxItem,
                      )}
                    >
                      {getItemDisplayValue(item)}
                      {isSelected && <IoIosCheckmark fill="blue" />}
                    </ListBoxItem>
                  );
                }
              })}
            </ListBox>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};

export default PortalDropdown;
