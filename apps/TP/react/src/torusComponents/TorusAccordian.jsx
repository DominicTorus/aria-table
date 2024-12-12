import React from 'react';
import { TorusAccordianArrow } from '../SVG_Application';

const Accordion = ({
  children,
  selectedKeys,
  onSelectionChange,
  items,
  contentKey,
  tittleKey,
}) => {
  return (
    <div className="w-full">
      {items.map((item) => (
        <>
          {children && typeof children === 'function' ? (
            children(item)
          ) : (
            <AccordionItem
              key={item[contentKey]}
              {...item}
              title={item[tittleKey]}
              content={item[contentKey]}
              // isSelected={selectedKeys.includes(item[contentKey])}
              // onSelectionChange={onSelectionChange}
            />
          )}
        </>
      ))}
    </div>
  );
};

const AccordionItem = ({
  eventKey,
  title,
  content,
  children,
  isSelected,
  onSelectionChange,
}) => {
  const handleToggle = () => {
    onSelectionChange(eventKey);
  };

  return (
    <div className="mb-2">
      <div className="flex w-[100%] items-center justify-center">
        <button
          className="flex w-full  cursor-pointer bg-transparent pl-[0.25rem] pr-[0.5rem] text-left "
          onClick={handleToggle}
          aria-expanded={isSelected}
        >
          <span
            className={`w-[20%] transition duration-300 ease-in-out ${
              isSelected ? 'rotate-[0deg]' : 'rotate-[-90deg]'
            }`}
          >
            {children ? <TorusAccordianArrow /> : null}
          </span>
          <span
            className={`flex w-[80%] justify-center ${children ? 'text-sm font-medium text-[#000000]/75' : `text-sm font-medium ${isSelected ? 'text-[#000000]/80' : 'text-[#000000]/30'} `}`}
          >
            {title}
          </span>
        </button>
      </div>

      {isSelected && (
        <div className="ml-[0.7rem] border border-b-0 border-l-1 border-r-0 border-t-0 border-[#000000]/15 p-[0.2rem]">
          {children}
        </div>
      )}
    </div>
  );
};

export { Accordion, AccordionItem };
