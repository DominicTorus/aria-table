import React, { useEffect } from 'react';
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';
import { FaAngleDown } from 'react-icons/fa6';
import { IoIosCheckmark } from 'react-icons/io';
export default function TorusSelector({
  label,
  items,
  marginT,
  selected,
  setSelected,
  renderEmptyState,
  placeholder,
  type,
}) {
  console.log(items, 'keyhg');
  const handleSelect = (code) => {
    console.log(code, 'keyhg');
    setSelected(code);
  };

  const spliting = (code) => {
    if (code) {
      let value = code;

      console.log(value, 'value');
    }
  };

  useEffect(() => {
    spliting(selected);
  }, [selected]);

  return (
    <div className={`${marginT} flex w-[100%] justify-start `}>
      <Select
        className={
          'flex w-[100%] flex-col gap-0.5 rounded-md bg-white px-2 py-[5px]'
        }
        onSelectionChange={handleSelect}
        selectedKey={selected}
        placeholder={placeholder}
        defaultSelectedKey={selected}
      >
        <Label className="text-xs text-[#000000]/50">{label}</Label>
        <Popover
          offset={15}
          placement="bottom"
          className="scrollbar-none min-h-[5rem] w-[17%] overflow-y-scroll"
        >
          <ListBox
            items={items}
            className="flex  w-[100%] flex-col items-center  gap-1 bg-white p-1 transition-all torus-focus:outline-none"
            selectionMode="single"
          >
            {(item) => (
              <ListBoxItem
                className="flex w-[100%] flex-col items-center gap-1 rounded-md bg-white p-1 transition-all torus-hover:bg-gray-100 torus-hover:outline-none "
                value={item.key}
                textValue={item.label}
                key={item.specialKey}
              >
                {({ isSelected }) => (
                  <div
                    className={`w-full ${
                      isSelected ? 'bg-white px-1  py-2' : ''
                    } flex items-center justify-between torus-hover:border-none torus-hover:outline-none torus-hover:ring-0 torus-focus:outline-none `}
                  >
                    <span className="whitespace-nowrap text-[0.2rem] font-normal tracking-tighter xl:text-sm  3xl:text-xs">
                      {type === 'mobilenumber' ? item.phone : item.label}
                    </span>

                    <div className="flex items-center justify-center  ">
                      <span
                        className={` transition-all duration-150  ${
                          isSelected ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <IoIosCheckmark size={20} color="#000" />
                      </span>
                    </div>
                  </div>
                )}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
        <Button
          className={
            'flex items-center justify-between torus-focus:outline-none torus-pressed:border-transparent torus-pressed:ring-0  '
          }
        >
          <div className="flex w-[50%] justify-start">
            <SelectValue
              className="text-sm text-[#000000]"
              children={type == 'mobilenumber' ? selected : null}
            />
          </div>
          <div className="flex w-[50%] justify-end" aria-hidden="true">
            <span className="pr-1">
              <FaAngleDown size={15} />
            </span>
          </div>
        </Button>
      </Select>
    </div>
  );
}
