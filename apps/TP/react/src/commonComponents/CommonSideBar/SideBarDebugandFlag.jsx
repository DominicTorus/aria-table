import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useState } from 'react';
import { BsCollectionPlay } from 'react-icons/bs';
import { IoIosInformationCircle } from 'react-icons/io';
import {
  VscDebug,
  VscGitPullRequestGoToChanges,
  VscSaveAll,
} from 'react-icons/vsc';
import { NavbarArrowDown } from '../../SVG_Application';

export const SideBarDebugandFlag = ({
  sideBarData,
  currentDrawing,
  darkMode,

  activeTab,
  handleDebug,
  handleRequest,
  handleSubmit,
  setSideResponse,
  sideResponse,
  upIdKey,
}) => {
  return (
    <div className="w-[100%]">
      {sideBarData && currentDrawing === 'PF' && (
        <>
          <CustomAccordion>
            <CustomAccordionItem
              key={'2'}
              title="Debug"
              darkMode={darkMode}
              startContent={
                <IoIosInformationCircle
                  className={
                    darkMode
                      ? 'font-bolder text-lg text-blue-400'
                      : 'font-bolder text-lg text-blue-700'
                  }
                />
              }
            >
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  {' '}
                  <CustomButton
                    isDisabled={!upIdKey}
                    className={`flex w-[100%] flex-row items-center  justify-center rounded border-1 border-gray-400 py-[0.55vh] text-[0.83vw]  font-[500]  text-black transition-colors hover:border-gray-600 dark:text-white  ${
                      !upIdKey ? 'bg-opacity-40 hover:bg-opacity-40' : ''
                    }`}
                    onClick={handleDebug}
                    startContent={<VscDebug className="mr-1" />}
                  >
                    Debug
                  </CustomButton>
                </div>
                <div className="col-span-6">
                  <CustomButton
                    isDisabled={!activeTab}
                    className={`flex w-[100%] flex-row items-center  justify-center rounded border-1 border-gray-400 py-[0.55vh]  text-[0.83vw]  font-[500]  text-black transition-colors hover:border-gray-600  dark:text-white  ${
                      !activeTab ? 'bg-opacity-40 hover:bg-opacity-40' : ''
                    }`}
                    onClick={handleRequest}
                    startContent={
                      <VscGitPullRequestGoToChanges className="mr-1" />
                    }
                  >
                    Request
                  </CustomButton>
                </div>
                <div className="col-span-6">
                  {' '}
                  <CustomButton
                    isDisabled={!activeTab}
                    className={`flex w-[100%] flex-row items-center justify-center rounded border-1 border-gray-400  py-[0.55vh] text-[0.83vw]  font-[500]  text-black  transition-colors hover:border-gray-600 dark:text-white  ${
                      !activeTab ? 'bg-opacity-40 hover:bg-opacity-40' : ''
                    }`}
                    onClick={handleSubmit}
                    startContent={<VscSaveAll className="mr-1" />}
                  >
                    Submit
                  </CustomButton>
                </div>
                <div className="col-span-6">
                  <CustomButton
                    isDisabled={!activeTab}
                    className={`flex w-[100%] flex-row items-center justify-center rounded border-1 border-gray-400 py-[0.55vh]   text-[0.83vw]  font-[500]  text-black transition-colors hover:border-gray-600  dark:text-white  ${
                      !activeTab ? 'bg-opacity-40 hover:bg-opacity-40' : ''
                    }`}
                    onClick={() => {
                      setSideResponse(!sideResponse);
                    }}
                    startContent={<BsCollectionPlay className="mr-1" />}
                  >
                    Response
                  </CustomButton>
                </div>
              </div>
            </CustomAccordionItem>
          </CustomAccordion>
        </>
      )}
    </div>
  );
};

// Components used in SideBarDebugandFlag
const CustomAccordion = ({ children }) => {
  return <div className="accordion">{children}</div>;
};

const CustomAccordionItem = ({ title, children, startContent, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useGSAP(() => {
    gsap.fromTo(
      accordionRef.current,
      { height: 0, opacity: 0, duration: 0.3, ease: 'power1.inOut' },
      { height: 'auto', opacity: 1, duration: 0.5, ease: 'power1.inOut' },
    );
  }, [isOpen]);

  // Framer Motion animation variants
  const accordionVariants = {
    closed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
    open: { height: 'auto', opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div
        className="flex cursor-pointer items-center justify-between bg-white p-4 dark:bg-[#0F0F0F]"
        onClick={toggleAccordion}
      >
        {React.isValidElement(title) ? (
          <div className="w-[100%] dark:text-white">{title}</div>
        ) : (
          <span className="text-[0.72vw] font-[500] dark:text-white">
            {title}
          </span>
        )}
        <span
          className={`transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <NavbarArrowDown className={'h-[0.83vw] w-[0.83vw]'} />
        </span>
      </div>
      <div ref={accordionRef} className="overflow-scroll">
        <div className="max-h-[40vh] overflow-y-scroll bg-white px-[0.55vw] dark:bg-[#0F0F0F]">
          {children}
        </div>
      </div>
    </div>
  );
};

const CustomButton = ({
  children,
  onClick,
  isDisabled,
  className,
  startContent,
  darkMode,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${className}  ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div
        className={`${!startContent ? 'hidden' : ''} flex w-[30%] items-center justify-end`}
      >
        {startContent}
      </div>
      <div
        className={`flex ${startContent ? 'w-[70%]' : 'w-[100%]}'} items-center justify-start`}
      >
        {children}
      </div>
    </button>
  );
};

const CustomDropdown = ({
  title,
  items,
  selectedKey = [],
  handleSelectedKey,
  darkMode,
  label,
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(selectedKey);

  const dropdownRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      dropdownRef.current,
      { height: 0, opacity: 0, duration: 0.3, ease: 'power1.inOut' },
      { height: 'auto', opacity: 1, duration: 0.5, ease: 'power1.inOut' },
    );
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    if (multiple) {
      let updatedItems;
      if (selectedItems.includes(item)) {
        updatedItems = selectedItems.filter((key) => key !== item);
      } else {
        updatedItems = [...selectedItems, item];
      }
      setSelectedItems(updatedItems);
      handleSelectedKey(updatedItems);
    } else {
      setSelectedItems([item]);
      setIsOpen(false);
      handleSelectedKey([item]);
    }
  };

  const dropdownVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  return (
    <div
      className={`relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
      <button
        className="flex w-full items-center justify-between rounded-md bg-gray-300/35 px-4 py-2"
        onClick={toggleDropdown}
        // onBlur={() => setIsOpen(false)}
      >
        <span className="pt-2 text-[0.83vw] font-[500]">
          {multiple
            ? selectedItems
                .map((item) => items.find((i) => i.key === item)?.label)
                .join(', ') || title
            : items.find((i) => i.key === selectedItems[0])?.label || title}
        </span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <NavbarArrowDown className={'h-[0.83vw] w-[0.83vw]'} />
        </span>
      </button>
      {label && (
        <div className="absolute left-0 top-0 px-4 py-1 text-[0.62vw] text-gray-500">
          {label}
        </div>
      )}
      <div
        ref={dropdownRef}
        className={`${
          isOpen ? 'block' : 'hidden'
        } absolute z-10 mt-1 w-[80%] border border-gray-300 bg-white`}
      >
        {items.map((item) => (
          <div
            key={item.key}
            className={`cursor-pointer px-4 py-2 text-[0.83vw] ${
              selectedItems.includes(item.key) ? 'bg-gray-200' : ''
            }`}
            onClick={() => handleItemClick(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropdown;
