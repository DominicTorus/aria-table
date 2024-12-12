import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React from 'react';
import { BsTrash3 } from 'react-icons/bs';
export default function ReusableDropDown({
  isDisabled = false,
  title,
  buttonProps,
  selectionMode = 'single',
  darkMode,
  DropdownMenuClassName,
  items,
  buttonClassName,
  selectedKey,
  handleSelectedKey,
  closeOnSelect = true,
  handleDelete = null,
  textAlign,
}) {
  return (
    <Dropdown
      isDisabled={isDisabled}
      classNames={{
        trigger: 'border-none',
      }}
    >
      <DropdownTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={
            buttonClassName ??
            ` w-[100%] border border-slate-400/30 text-black 
         
             dark:text-[#F4F4F5] `
          }
          {...buttonProps}
        >
          <span
            className={` w-[100%] truncate text-[0.72vw] ${textAlign ? textAlign : ''}`}
          >
            {title}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="faded"
        className={DropdownMenuClassName}
        itemClasses={{
          base: [
            'rounded-md',
            'text-white font-bold',
            'border-none',
            'transition-opacity',
            'data-[hover=true]:text-pink-500 font-bold',
            'data-[hover=true]:bg-gray-600/40 ',
            'dark:data-[hover=true]:bg-[#1E1E1E]',
            'data-[selectable=true]:focus:bg-gray-600/40',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
          selectedIcon: 'w-1 h-1 flex items-center',
        }}
        classNames={{
          base: ` bg-[#1E1E1E] text-white font-bold p-[5px] rounded-lg ${items && items.length > 5 ? 'overflow-y-auto h-[200px]' : ''}  `,
        }}
        closeOnSelect={closeOnSelect}
        selectionMode={selectionMode}
        selectedKeys={selectedKey}
        onSelectionChange={handleSelectedKey}
        items={items && items.length > 0 ? items : []}
      >
        {(item, index) => (
          <DropdownItem onClick={() => {}} key={item.key}>
            {handleDelete ? (
              <div className={'flex justify-between   gap-2 '}>
                <div>{item.label}</div>

                <div
                  onClick={() => {
                    handleDelete(item.key);
                  }}
                  className="  bg-transparent text-[#616A6B] duration-200
       hover:scale-125 hover:text-red-500 hover:transition hover:ease-in-out"
                >
                  <BsTrash3 className=" items-end text-[#616A6B] hover:text-red-500" />
                </div>
              </div>
            ) : (
              <div>{item.label}</div>
            )}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
