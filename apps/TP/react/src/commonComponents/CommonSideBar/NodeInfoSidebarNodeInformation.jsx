/* eslint-disable */
import React, { useRef, useState } from 'react';
import { NavbarArrowDown } from '../../SVG_Application';
import TorusModularInput from '../../torusComponents/TorusModularInput';
import TorusRadio from '../../torusComponents/TorusRadio';
import TorusModularTextArea from '../../torusComponents/TorusTextArea';

import { IoIosArrowDown } from 'react-icons/io';
import TorusDropDown from '../../torusComponents/TorusDropDown';
import { merger } from '../utils/utils';
import NodePropertyWindow from '../../VPT_UF/TM_GRID/componets/PropertyWindow';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const NodeInfoSidebarNodeInformation = ({
  sideBarData,
  currentDrawing,
  handleNames,

  changeProperty,
  selectedIPC,
  handleIPCselection,
  selectedTheme,
}) => {
  return (
    <div className="">
      <NodeInfoAccordion
        data={sideBarData}
        handleNames={handleNames}
        changeProperty={changeProperty}
        handleIPCselection={handleIPCselection}
        selectedIPC={selectedIPC}
        currentDrawing={currentDrawing}
        selectedTheme={selectedTheme}
      />
    </div>
  );
};

const NodeInfoAccordionItem = ({ children, selectedTheme }) => {
  const itemRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      itemRef.current,
      { opacity: 0, duration: 0.3, ease: 'power1.inOut' },
      { opacity: 1, duration: 0.3, ease: 'power1.inOut' },
    );
  }, []);

  return (
    <div className="">
      <div initial={false} className="overflow-hidden" ref={itemRef}>
        <div
          className={` mt-[1.25vh] flex flex-col gap-[1.25vh] overflow-hidden`}
          style={{
            backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const NodeInfoAccordion = ({
  data,
  handleNames,
  changeProperty,
  handleIPCselection,
  selectedIPC,
  currentDrawing,
  selectedTheme,
}) => {
  return (
    <>
      <NodeInfoAccordionItem key="node-info">
        {data.property && (
          <>
            {data && currentDrawing === 'PF-PFD' && data?.IPC_flag && (
              <>
                <div className="flex w-[100%] items-center justify-center">
                  <div
                    className="w-full rounded-md  px-[0.25vw] py-[0.55vh] "
                    style={{
                      backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                    }}
                  >
                    <div className="flex w-full items-center justify-start">
                      <label
                        className="pl-[0.25vw] text-[0.62vw] font-medium "
                        style={{
                          color: `${selectedTheme?.text}80`,
                        }}
                      >
                        Select Flag for Layout
                      </label>
                    </div>

                    {/* <ReusableDropDown
                    darkMode={false}
                    key={contextProps.node.id + contextProps.node.type}
                    title={
                      (selectedResponseData && selectedResponseData) ||
                      'select response type'
                    }
                    selectedKey={new Set([selectedResponseData])}
                    handleSelectedKey={(keys) => {
                      setSelectedResponseData(Array.from(keys)[0]);
                    }}
                    items={
                      contextProps.responsedata &&
                      contextProps.responsedata.length > 0 &&
                      contextProps.responsedata.map((data, index) => {
                        return {
                          key: data,

                          label: data,
                        };
                      })
                    }
                    textAlign={'text-start'}
                  /> */}
                    <TorusDropDown
                      // onPress={() => {
                      //   setInputchange(false);
                      // }}
                      title={
                        <div className="flex w-[100%] items-center justify-between ">
                          <div
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            {selectedIPC ||
                              data?.property?.IPC_flag ||
                              'select IPC'}
                          </div>
                          <div>
                            <IoIosArrowDown
                              className="text-[#667085] dark:text-white"
                              size={'0.83vw'}
                            />
                          </div>
                        </div>
                      }
                      items={[
                        { key: 'AG', label: 'AG' },
                        { key: 'APP', label: 'APP' },
                        { key: 'N', label: 'N' },
                      ]}
                      listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                      btncolor={`${selectedTheme?.bgCard}`}
                      listItemColor={`${selectedTheme && selectedTheme?.text}`}
                      selectionMode="single"
                      selectedKey={new Set([selectedIPC])}
                      setSelected={(e) => handleIPCselection(Array.from(e)[0])}
                      classNames={{
                        buttonClassName:
                          '  px-2 rounded-sm  h-[4.5vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#FFFFFF] dark:bg-[#0F0F0F] text-start dark:text-white',
                        popoverClassName:
                          'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                        listBoxClassName:
                          'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                        listBoxItemClassName:
                          'flex w-[100%] items-center  justify-center text-md',
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {Object.entries(data.property).map(([key, value]) => (
              <>
                {key === 'name' && (
                  <div key={data.id + key} className="mt-0 w-full rounded-sm">
                    <TorusModularInput
                      key={data.id + key}
                      label={key}
                      isRequired={true}
                      type="text"
                      placeholder="Type Key..."
                      bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                      textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                      labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                      labelSize={'text-[0.62vw] pl-[0.25vw]'}
                      outlineColor="#cbd5e1"
                      radius="sm"
                      size=""
                      isReadOnly={false}
                      isDisabled={false}
                      errorShown={false}
                      isClearable={true}
                      backgroundColor={'bg-white dark:bg-[#161616]'}
                      onChange={(e) => {
                        handleNames(e, key);
                        console.log(e);
                      }}
                      // value={value}
                      defaultValue={value}
                      textSize={'text-[0.62vw]'}
                      inputClassName={'px-[0.25vw] py-[0.55vh]'}
                      wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                    />
                  </div>
                )}

                {key === 'description' && (
                  <div
                    className="mt-0 w-full rounded-md "
                    style={{
                      backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                    }}
                    id={data.id + key}
                  >
                    <TorusModularTextArea
                      key={data.id + key}
                      defaultValue={value}
                      // value={value}
                      onChange={(e) => changeProperty({ [key]: e })}
                      placeholder="Enter description..."
                      bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                      textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                      labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                      size="md"
                      radius="md"
                      marginT="mt-0"
                      isReadOnly={false}
                      isRequired={true}
                      isDisabled={false}
                      labelPlacement="top"
                      isInvalid={false}
                      autoSize={true}
                      errorShown={false}
                      onHeightChange={(height) =>
                        console.log(`New height: ${height}px`)
                      }
                      label={key}
                      labelSize={'text-[0.62vw]'}
                      textSize={'text-[0.83vw]'}
                    />
                  </div>
                )}
              </>
            ))}
          </>
        )}
        {/* {currentDrawing === 'DF-DFD' && (
          <>
            <div
              key={data.id + 'DCname'}
              className="mt-0 w-full  "
              style={{
                backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
              }}
              // key={`${key}_${value}`}
            >
              <TorusModularInput
                key={data.id + 'DCname'}
                otherMethod={{
                  onPaste: (e) => {
                    changeProperty({ DCname: e });
                  },
                }}
                label={'DCname'}
                isRequired={true}
                type="text"
                placeholder="Type Key..."
                bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelSize={'text-[0.62vw] pl-[0.25vw]'}
                outlineColor="#cbd5e1"
                radius="sm"
                size=""
                isReadOnly={false}
                isDisabled={false}
                errorShown={false}
                isClearable={true}
                backgroundColor={'bg-white dark:bg-[#161616]'}
                onChange={(e) => {
                  changeProperty({ DCname: e });
                }}
                // value={value}
                defaultValue={data?.data?.nodeProperty?.DCname}
                textSize={'text-[0.83vw]'}
                inputClassName={'px-[0.25vw] py-[0.55vh]'}
                wrapperClass={'px-[0.25vw] py-[0.55vh]'}
              />
            </div>

            <div
              key={data.id + 'DFOname'}
              className="mt-0 w-full  "
              style={{
                backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
              }}
              // key={`${key}_${value}`}
            >
              <TorusModularInput
                key={data.id + 'DFOname'}
                otherMethod={{
                  onPaste: (e) => {
                    changeProperty({ DFOname: e });
                  },
                }}
                label={'DFOname'}
                isRequired={true}
                type="text"
                placeholder="Type Key..."
                bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelSize={'text-[0.62vw] pl-[0.25vw]'}
                outlineColor="#cbd5e1"
                radius="sm"
                size=""
                isReadOnly={false}
                isDisabled={false}
                errorShown={false}
                isClearable={true}
                backgroundColor={'bg-white dark:bg-[#161616]'}
                onChange={(e) => {
                  changeProperty({ DFOname: e });
                }}
                // value={value}
                defaultValue={data?.data?.nodeProperty?.DFOname}
                textSize={'text-[0.83vw]'}
                inputClassName={'px-[0.25vw] py-[0.55vh]'}
                wrapperClass={'px-[0.25vw] py-[0.55vh]'}
              />
            </div>
            <div
              key={data.id + 'dfowriteFlag'}
              className="mt-0 w-full  "
              style={{
                backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
              }}
              // key={`${key}_${value}`}
            >
              <TorusModularInput
                key={data.id + 'dfowriteFlag'}
                otherMethod={{
                  onPaste: (e) => {
                    changeProperty({ dfowriteFlag: e });
                  },
                }}
                label={'dfowriteFlag'}
                isRequired={true}
                type="text"
                placeholder="Type Key..."
                bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelSize={'text-[0.62vw] pl-[0.25vw]'}
                outlineColor="#cbd5e1"
                radius="sm"
                size=""
                isReadOnly={false}
                isDisabled={false}
                errorShown={false}
                isClearable={true}
                backgroundColor={'bg-white dark:bg-[#161616]'}
                onChange={(e) => {
                  changeProperty({ dfowriteFlag: e });
                }}
                // value={value}
                defaultValue={data?.data?.nodeProperty?.dfowriteFlag}
                textSize={'text-[0.83vw]'}
                inputClassName={'px-[0.25vw] py-[0.55vh]'}
                wrapperClass={'px-[0.25vw] py-[0.55vh]'}
              />
            </div>
          </>
        )} */}

        {currentDrawing === 'PF-PFD' && (
          <>
            <div
              key={data.id + 'breakPoint'}
              className="mt-0 w-full  "
              style={{
                backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
              }}
              // key={`${key}_${value}`}
            >
              <TorusModularInput
                key={data.id + 'breakPoint'}
                otherMethod={{
                  onPaste: (e) => {
                    changeProperty({ breakPoint: e });
                  },
                }}
                label={'Breakpoint'}
                isRequired={true}
                type="text"
                placeholder="Type breakpoint..."
                bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelSize={'text-[0.62vw] pl-[0.25vw]'}
                outlineColor="#cbd5e1"
                radius="sm"
                size=""
                isReadOnly={false}
                isDisabled={false}
                errorShown={false}
                isClearable={true}
                backgroundColor={'bg-white dark:bg-[#161616]'}
                onChange={(e) => {
                  changeProperty({ breakPoint: e });
                }}
                // value={value}
                defaultValue={data?.data?.nodeProperty?.breakPoint}
                textSize={'text-[0.83vw]'}
                inputClassName={'px-[0.25vw] py-[0.55vh]'}
                wrapperClass={'px-[0.25vw] py-[0.55vh]'}
              />
            </div>
          </>
        )}
        {data &&
          (currentDrawing === 'UF-UFM' ||
            currentDrawing === 'UF-UFW' ||
            currentDrawing === 'UF-UFD') && (
            <>
              <>
                {data.type == 'group' && data?.layoutFlag && (
                  <CustomRadio
                    changeProperty={changeProperty}
                    data={data}
                    keys={'layoutFlag'}
                    value={data?.layoutFlag}
                    selectedTheme={selectedTheme}
                  />
                )}
              </>
              {data.type == 'group' && (
                <div
                  key={data.id + 'groupType'}
                  className="mt-0 w-full  "
                  style={{
                    backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                  }}
                  // key={`${key}_${value}`}
                >
                  {console.log(data, 'ufdata')}
                  <TorusModularInput
                    key={data.id + 'groupType'}
                    label={'groupType'}
                    isRequired={true}
                    type="text"
                    placeholder="Type Key..."
                    bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                    textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                    labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                    labelSize={'text-[0.62vw] pl-[0.25vw]'}
                    outlineColor="#cbd5e1"
                    radius="sm"
                    size=""
                    isReadOnly={false}
                    isDisabled={
                      data?.groupType && data?.groupType === 'table'
                        ? true
                        : false
                    }
                    errorShown={false}
                    isClearable={true}
                    backgroundColor={'bg-white dark:bg-[#161616]'}
                    onChange={(e) => {
                      handleNames(e, 'groupType');
                    }}
                    defaultValue={data?.groupType}
                    textSize={'text-[0.83vw]'}
                    inputClassName={'px-[0.25vw] py-[0.55vh]'}
                    wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                  />
                </div>
              )}
              <NodePropertyWindow selectedTheme={selectedTheme} />
            </>
          )}

        {/* {data && currentDrawing === 'UF-UFD' && (
          <>
            {Object.entries(data).map(([key, value]) => (
              <>
                <CustomGrid
                  keys={key}
                  data={data}
                  changeProperty={changeProperty}
                />
              </>
            ))}
          </>
        )} */}
      </NodeInfoAccordionItem>
    </>
  );
};

const CustomDropdown = ({
  label,
  title,
  items,
  selectedKey,
  handleSelectedKey,
  darkMode,
  buttonClassName,
  listBoxClassName,
  labelClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const dropdownRef = useRef(null);

  const handleItemClick = (item) => {
    handleSelectedKey(item);
    setIsOpen(false);
  };

  const dropdownVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  useGSAP(() => {
    gsap.fromTo(
      dropdownRef.current,
      { opacity: 0, height: 0 },
      { opacity: 1, height: 'auto', duration: 0.3 },
    );
  }, [isOpen]);

  return (
    <div className="relative w-[100%] rounded-md bg-gray-300/35 py-[0.85vh] dark:bg-[#161616] ">
      {label && (
        <div className={merger('dark:text-[#F4F4F5]', labelClassName)}>
          {label}
        </div>
      )}
      <button className={buttonClassName} onClick={toggleDropdown}>
        <span className="pt-2 text-[0.83vw] font-[500]">{title}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <NavbarArrowDown
            pathClassName={
              'fill-black dark:fill-white stroke-black dark:stroke-white'
            }
            className={'h-[0.83vw] w-[0.83vw]'}
          />
        </span>
      </button>

      <div
        className={` ${isOpen ? 'block' : 'none'} absolute z-10 w-full border border-gray-300 ${listBoxClassName}`}
        ref={dropdownRef}
      >
        {items.map((item) => (
          <div
            key={item.key}
            className={`cursor-pointer px-4 py-2 text-[0.83vw] font-[500] ${selectedKey === item.key ? 'bg-gray-200' : ''}`}
            onClick={() => handleItemClick(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomRadio = ({ keys, data, changeProperty, value, selectedTheme }) => {
  return (
    <div
      className="mt-0 w-full  "
      style={{
        backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
      }}
      id={data.id + keys}
    >
      <div className="w-full rounded-md bg-gray-300/25 px-[0.25vw] py-[0.55vh] dark:bg-[#161616]">
        <div className="flex w-full items-center justify-start">
          <label className="pl-[0.25vw] text-[0.62vw] font-medium  text-black dark:text-white/35 ">
            {keys}
          </label>
        </div>
        <TorusRadio
          // value={
          // selectedActionName
          // ? handleValue({
          // selectedActionName: selectedActionName,
          // tabName: "action",
          // type: "lock",
          // key: "lockMode",
          // })
          // : ""
          // }
          onChange={(value) => {
            changeProperty({ [keys]: value });
          }}
          radioGrpClassName="h-full flex flex-row gap-[1.5vh] py-[0.55vh] pl-[0.55vw] "
          orientation="horizontal"
          size="sm"
          value={value}
          content={[
            {
              // label: "Yes",
              values: 'yes',
            },
            {
              // label: "No",
              values: 'no',
            },
          ]}
        />
      </div>
    </div>
  );
};
const CustomGrid = ({ keys, data, changeProperty }) => {
  return (
    <>
      {keys === 'grid' && (
        <>
          {Object.entries(data[keys]).map(([key, value]) => (
            <div
              className="mt-0 w-full  "
              style={{
                backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
              }}
              id={data.id + key}
            >
              <TorusModularInput
                key={data.id + 'grid' + key}
                // otherMethod={{
                // onblur: (e) => {
                // changeProperty({ [key]: e.target.value });
                // },
                // onkeydown: (e) => {
                // if (e.key === "Enter") {
                // changeProperty({ [key]: e.target.value });
                // }
                // },
                // }}
                label={key}
                isRequired={true}
                type="number"
                placeholder={`Type ${key}...`}
                bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                labelSize={'text-[0.62vw] pl-[0.25vw]'}
                outlineColor="#cbd5e1"
                radius="sm"
                size=""
                isReadOnly={false}
                isDisabled={false}
                errorShown={false}
                isClearable={true}
                backgroundColor={'bg-white dark:bg-[#161616]'}
                onChange={(e) => {
                  changeProperty({ [key]: e });
                }}
                value={value}
                // defaultValue={value}
                textSize={'text-[0.83vw]'}
                inputClassName={'px-[0.25vw] py-[0.55vh]'}
                wrapperClass={'px-[0.25vw] py-[0.55vh]'}
              />
            </div>
          ))}
        </>
      )}
    </>
  );
};

const CustomOrder = ({ keys, values, changeProperty }) => {
  return (
    <>
      <div
        key={keys}
        className="mt-0 w-full  "
        style={{
          backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
        }}
      >
        <TorusModularInput
          // otherMethod={{
          // onblur: (e) => {
          // changeProperty({ [keys]: e.target.value });
          // },
          // onkeydown: (e) => {
          // if (e.key === "Enter") {
          // changeProperty({ [keys]: e.target.value });
          // }
          // },
          // }}
          label={keys}
          isRequired={true}
          type="number"
          placeholder={`Type ${keys}...`}
          bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
          textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
          labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
          labelSize={'text-[0.62vw] pl-[0.25vw]'}
          outlineColor="#cbd5e1"
          radius="sm"
          size=""
          isReadOnly={false}
          isDisabled={false}
          errorShown={false}
          isClearable={true}
          backgroundColor={'bg-white dark:bg-[#161616]'}
          onChange={(e) => {
            changeProperty({ [keys]: e });
            console.log(e, 'order-->>');
          }}
          value={values}
          textSize={'text-[0.83vw]'}
          inputClassName={'px-[0.25vw] py-[0.55vh]'}
          wrapperClass={'px-[0.25vw] py-[0.55vh]'}
        />
      </div>
    </>
  );
};
