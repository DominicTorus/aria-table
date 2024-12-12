import React from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Popover,
  ListBox,
  ListBoxItem,
} from "react-aria-components";
import { IoIosCheckmark } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import { DownArrow } from "../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";

type classNames = {
  triggerButton?: string;
  popover?: string;
  listbox?: string;
  listboxItem?: string;
};

type styles = {
  triggerButton?: React.CSSProperties;
  popover?: React.CSSProperties;
  listbox?: React.CSSProperties;
  listboxItem?: React.CSSProperties;
};

interface CustomDropDpwnProps {
  triggerButton: React.ReactNode;
  multiple?: boolean;
  selectedKeys: string[] | any[] | any;
  setSelectedKeys: (keys: any) => void;
  items: any[];
  displayParam?: string;
  classNames?: classNames;
  renderOption?: (
    item: any,
    close: () => void,
    handleSelectionChange: (selectedItems: any, close: () => void) => void,
    setOpen: (open: boolean) => void,
    selected: boolean | any
  ) => React.ReactNode;
  isDarkMode?: boolean;
  displaySelectedKeys?: boolean;
  isDisabled?: boolean;
  arrowFill?: string;
  styles?: styles;
}

const DropDown = ({
  triggerButton,
  multiple = false,
  selectedKeys,
  setSelectedKeys,
  items,
  displayParam,
  classNames,
  renderOption,
  displaySelectedKeys = true,
  isDisabled = false,
  arrowFill,
  styles
}: CustomDropDpwnProps) => {
  const [open, setOpen] = React.useState(false);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleSelectionChange = (selectedItem: any, close: () => void) => {
    if (multiple) {
      const prevSelectedKeys = structuredClone(selectedKeys);
      const updated = prevSelectedKeys.some((k: any) =>
        displayParam
          ? k[displayParam] === selectedItem[displayParam]
          : k === selectedItem
      )
        ? prevSelectedKeys.filter((k: any) =>
          displayParam
            ? k[displayParam] !== selectedItem[displayParam]
            : k !== selectedItem
        )
        : [...prevSelectedKeys, selectedItem]
      setSelectedKeys(updated);
    } else {
      setSelectedKeys(selectedItem);
      close();
      setOpen(false);
    }
  };

  const getItemDisplayValue = (item: any) => {
    return displayParam ? item[displayParam] : item;
  };

  return (
    <DialogTrigger>
      <Button
        style={styles?.triggerButton || { backgroundColor: torusTheme['bgCard'], color: torusTheme['text'] }}
        className={twMerge(
          `p-2 items-center flex justify-between disabled:cursor-default rounded focus:outline-none w-full`,
          classNames?.triggerButton
        )}
        isDisabled={isDisabled}
        onPress={() => setOpen(!open)}
      >
        {displaySelectedKeys
          ? selectedKeys?.length && Array.isArray(selectedKeys)
            ? selectedKeys
              .map((item: any) => getItemDisplayValue(item))
              .join(", ")
            : selectedKeys && typeof selectedKeys === "string"
              ? getItemDisplayValue(selectedKeys)
              : triggerButton
          : triggerButton}
        {displaySelectedKeys && <DownArrow fill={arrowFill ? arrowFill : torusTheme['textOpacity/15']} />}
      </Button>
      <Popover
        placement="bottom"
        className={twMerge("w-full", classNames?.popover)}
        style={styles?.popover || { backgroundColor: torusTheme['bg'], color: torusTheme['text'] }}
      >
        <Dialog className={twMerge(`border focus:outline-none rounded-lg`, classNames?.listbox)} style={styles?.listbox || { borderColor: torusTheme['borderLine'] }}>
          {({ close }) => (
            <ListBox
              aria-label="Custom dropdown"
              selectionMode={multiple ? "multiple" : "single"}
              className={twMerge("", classNames?.listbox)}
              style={styles?.listbox || {}}
              renderEmptyState={() => <div style={{ color: torusTheme['text'], backgroundColor: torusTheme['bg'], fontSize: `${fontSize * 0.83}vw` }} className="p-2 leading-[2.22vh] rounded">No data found</div>}
            >
              {items.map((item: any) => {
                const isSelected = () => {
                  if (multiple) {
                    return selectedKeys?.some((k: any) =>
                      displayParam
                        ? k[displayParam] === item[displayParam]
                        : k === item
                    );
                  } else {
                    return selectedKeys === item;
                  }
                };
                if (renderOption) {
                  const selectedKey = isSelected()
                  return renderOption(
                    item,
                    close,
                    handleSelectionChange,
                    setOpen,
                    selectedKey
                  );
                } else {
                  return (
                    <ListBoxItem
                      key={displayParam ? item[displayParam] : item}
                      textValue={getItemDisplayValue(item)}
                      onAction={() => handleSelectionChange(item, close)}
                      style={{ backgroundColor: isSelected() ? styles?.listboxItem?.backgroundColor || torusTheme["borderLine"] : "transparent" }}
                      className={twMerge(
                        `focus:outline-none p-1.5 items-center flex justify-between border border-transparent cursor-pointer rounded ${isSelected() ? "" : "p-2"
                        }`,
                        classNames?.listboxItem
                      )}
                    >
                      {getItemDisplayValue(item)}
                      {isSelected() && <IoIosCheckmark size={20} fill={accentColor} />}
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

export default DropDown;
