import React, { useRef } from 'react';
import {
  Dialog,
  DialogTrigger,
  Heading,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';
import { IoIosCheckmark } from 'react-icons/io';
import TorusButton from '../torusComponents/TorusButton';
import { merger } from '../utils/utils';

const defaultTropdownClassNames = {
  buttonClassName: `torus-pressed:animate-torusButtonActive dark:bg-[#161616] dark:text-white bg-[#F9FAFB] text-sm font-medium rounded-md transition-colors duration-300`,
  popoverClassName:
    'torus-entering:animate-torusPopOverOpen torus-exiting:animate-torusPopOverClose w-40',
  dialogClassName: 'outline-none w-full',
  listBoxClassName:
    'w-full bg-slate-200 dark:bg-[#161616] border-2 dark:border-gray-700 border-gray-300 transition-all p-2 rounded-md gap-1 flex flex-col items-center',
  listBoxItemClassName:
    'p-1 w-full torus-focus:outline-none rounded-md cursor-pointer transition-colors duration-300',
};

export default function TorusMultipleSelect({
  isDisabled,
  label,
  title,
  classNames,
  buttonHeight = '',
  buttonWidth = '',
  setSelected,
  selected,
  endContent,
  renderEmptyState,
  items = [
    { key: 'Item 1', label: 'Item 1' },
    { key: 'Item 2', label: 'Item 2' },
    { key: 'Item 3', label: 'Item 3' },
  ],
  size = 20,
  popOverProps,
  listBoxProps,
  color,
  btWidth,
  btheight,
  selectionMode = 'multiple', // Multi-select mode
  fontStyle,
  btncolor,
  radius,
  outlineColor,
  gap,
  borderColor,
  startContent,
  isDropDown = false,
  className,
  onPress,
  secbuttonClassName,
  listBoxBackground,
  listItemColor,
}) {
  const listBoxRefItem = useRef(null);
  const closeFn = () => {
    const parentNode = listBoxRefItem.current?.parentNode;
    if (parentNode) {
      parentNode.style.display = 'none';
    }
  };


  const handleSelectionChange = (keys) => {
    setSelected && setSelected([...keys]); 
  };

  return (
    <DialogTrigger>
      <TorusButton
        Children={title}
        buttonClassName={merger(
          defaultTropdownClassNames.buttonClassName,
          classNames?.buttonClassName,
        )}
        height={btheight}
        width={btWidth}
        fontStyle={fontStyle}
        btncolor={btncolor}
        radius={radius}
        outlineColor={outlineColor}
        color={color}
        gap={gap}
        borderColor={borderColor}
        startContent={startContent ? startContent : ''}
        endContent={endContent ? endContent : ''}
        isDropDown={isDropDown}
        onPress={onPress}
        isDisabled={isDisabled}
        secbuttonClassName={secbuttonClassName}
      />
      <Popover
        placement="bottom"
        className={merger(
          defaultTropdownClassNames.popoverClassName,
          classNames?.popoverClassName,
        )}
        {...popOverProps}
      >
        <Dialog
          className={merger(
            defaultTropdownClassNames.dialogClassName,
            classNames?.dialogClassName,
          )}
        >
          {({ close }) => (
            <ListBox
              className={merger(
                defaultTropdownClassNames.listBoxClassName,
                merger(
                  `max-h-[40vh] ${items.length > 6 ? 'min-h-[30vh] overflow-y-auto' : ''}`,
                  classNames?.listBoxClassName,
                ),
              )}
              selectionMode={selectionMode}
              onSelectionChange={handleSelectionChange}
              selectedKeys={selected} // Pass selected keys here
              items={items}
              {...listBoxProps}
              style={{
                backgroundColor: listBoxBackground,
                border: `1px solid ${borderColor}`,
              }}
            >
              {items.map((item) => (
                <ListBoxItem
                  key={item.key}
                  className={merger(
                    defaultTropdownClassNames.listBoxItemClassName,
                    classNames?.listBoxItemClassName,
                  )}
                  ref={listBoxRefItem}
                  style={{ color: listItemColor }}
                >
                  {({ isSelected }) => (
                    <div
                      className="flex w-full items-center justify-between"
                      onClick={() => {
                        
                        if (selectionMode === 'multiple') {
                          console.log('Multiple selection', isSelected, item);
                        } else {
                          close();
                        }
                      }}
                    >
                      <Heading className="text-[0.72vw] font-normal">
                        {item.label}
                      </Heading>
                      <div className="flex items-center">
                        <span
                          className={`transition-all duration-150 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        >
                          <IoIosCheckmark
                            size={20}
                            className={`${isSelected ? 'text-[#0736C4] dark:text-white' : ''}`}
                          />
                        </span>
                      </div>
                    </div>
                  )}
                </ListBoxItem>
              ))}
            </ListBox>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
