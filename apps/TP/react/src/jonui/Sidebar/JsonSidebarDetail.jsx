/* eslint-disable */
import { Switch } from '@nextui-org/react';
import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import { IoIosArrowDown } from 'react-icons/io';

import {
  DeleteIcon,
  NavbarArrowDown,
  SuccessIcon,
} from '../../SVG_Application';
import TorusDropDown from '../../torusComponents/TorusDropDown';

import { useGSAP } from '@gsap/react';
import TorusModularInput from '../../torusComponents/TorusModularInput.jsx';

const RenderSwitch = ({ obj }) => {
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };
  return (
    <div>
      <select onClick={handleDropdownClick}>
        {obj && obj.map((ele) => ({ ele }))}
      </select>
    </div>
  );
};

const RenderDropdown = ({
  obj,
  path,
  handlejs,
  item,
  showObj,
  handleDeletejs,
}) => {
  const [value, setValue] = useState(null);
  const [bool, setBool] = useState();
  useEffect(() => {
    try {
      if (value) {
        handlejs(
          Array.from(value),
          path + '.' + item + '.' + 'selectedValue',
          'selectedValue',
          'dropdown',
          showObj,
        );
      }
    } catch (error) {}
  }, [value]);

  useEffect(() => {
    try {
      if (bool !== undefined)
        handlejs(
          bool,
          path + '.' + item + '.' + 'selectedValue',
          'selectedValue',
          'boolean',
          showObj,
        );
    } catch (error) {}
  }, [bool]);

  return (
    <>
      {obj && (obj.type == 'dropdown' || obj.type == 'boolean') && (
        <>
          {
            <div className="mb-2 flex w-full rounded-lg  dark:bg-[#161616]">
              <div div className="my-2 flex w-full flex-col rounded-lg">
                {obj?.selectedValue.length > 0 && (
                  <span className="pl-[0.65vw] pt-[0.25vw] text-[0.83vw] text-gray-400/60">
                    {obj.label}
                  </span>
                )}
                {obj.type == 'dropdown' ? (
                  <div className="flex w-full items-center rounded-sm  dark:bg-[#161616]">
                    <div className="flex w-full items-center justify-center">
                      <TorusDropDown
                        key={path + '.' + item + '.' + obj?.label}
                        renderEmptyState={() => 'No Items...'}
                        classNames={{
                          buttonClassName: `bg-transparent w-[100%] bg-[#F4F5FA]  h-[40px] text-black dark:text-white mt-2`,
                          listBoxClassName:
                            'bg-[#F4F5FA] dark:bg-[#161616] text-black dark:text-white',
                        }}
                        label={obj?.selectedValue.length > 0 && obj.label}
                        title={
                          <div className="flex w-[100%] flex-row items-center justify-between">
                            <div
                              className={
                                'flex w-[80%] justify-start whitespace-nowrap pl-[0.65vw] text-[0.72vw] font-[500] tracking-tighter text-black dark:text-white'
                              }
                            >
                              {obj?.selectedValue.length > 0
                                ? Array.from(obj?.selectedValue).join(',')
                                : obj.label}
                            </div>
                            <div className="w-[10%]">
                              <IoIosArrowDown className="text-black dark:text-white" />
                            </div>
                          </div>
                        }
                        fontStyle={
                          'font-plexsans 3xl:text-xs  3xl:font-medium xl:text-sm xl:font-semibold tracking-tighter'
                        }
                        selected={value}
                        setSelected={setValue}
                        selectionMode={
                          obj.mode == 'single' ? 'single' : 'multiple'
                        }
                        items={
                          obj.selectionList &&
                          obj.selectionList.map((ele) => ({
                            key: ele,
                            label: ele,
                          }))
                        }
                        btWidth={'md'}
                      />
                    </div>
                    {/* <div className="flex w-[20%] items-center justify-center">
                      <Button
                        className={'mt-1'}
                        onPress={() => handleDeletejs(path + '.' + item, 'obj')}
                      >
                        <DeleteIcon
                          className={'h-[0.83vw] w-[0.83vw] stroke-red-500'}
                        />
                      </Button>
                    </div> */}

                    {/* <div className="w-[105%] pt-2"> */}
                    {/* <TorusButton
                        Children={`Delete`}
                        size={"xs"}
                        btncolor={"#0736C4"}
                        radius={"lg"}
                        color={"#f00"}
                        gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
                        height={"md"}
                        borderColor={"3px solid #0736C4"}
                        btheight={"200px"}
                        startContent={<CiTrash color="white" />}
                        fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                        onPress={() => handleDeletejs(path + "." + item, "obj")}
                      /> */}
                    {/* </div> */}
                  </div>
                ) : obj.type == 'boolean' ? (
                  <div className="w-full ">
                    <div className="flex w-full items-center justify-between ">
                      <div className="flex w-[80%] items-center justify-between">
                        <span className=" pl-[0.65vw] pt-[0.25vw] text-[0.83vw] text-gray-400/60">
                          {obj?.label}
                        </span>
                        {/* <TorusSwitch
                        skey={path + "." + item + obj?.label}
                        isChecked={obj?.selectedValue}
                        setIsChecked={setBool}
                      /> */}
                        <Switch
                          key={path + '.' + item + obj?.label}
                          isSelected={obj?.selectedValue}
                          onValueChange={setBool}
                          size="sm"
                        />
                      </div>

                      <div className="flex w-[20%] items-center justify-end">
                        <Button
                          className={'mt-1'}
                          onPress={() =>
                            handleDeletejs(path + '.' + item, 'obj')
                          }
                        >
                          <DeleteIcon
                            className={'h-[0.83vw] w-[0.83vw] stroke-red-500'}
                          />
                        </Button>
                      </div>
                    </div>
                    {/* <TorusButton
                      Children={`Delete`}
                      size={"xs"}
                      btncolor={"#0736C4"}
                      radius={"lg"}
                      color={"#f00"}
                      gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
                      height={"md"}
                      borderColor={"3px solid #0736C4"}
                      startContent={<CiTrash color="white" />}
                      fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                      onPress={() => handleDeletejs(path + "." + item, "obj")}
                    /> */}
                  </div>
                ) : (
                  <></>
                )}
                {/* {
                  <TorusSelector
                    selected={
                      obj.selectedValue.length > 0 ? obj.selectedValue : value
                    }
                    setSelected={setValue}
                    label={obj.label}
                    items={obj.selectionList.map((ele) => ({
                      key: ele,
                      label: ele,
                    }))}
                  />
                }  */}
              </div>
              {/* <p className="flex  gap-4 mb-3">
                {" "}
                selectedValue :<span>{obj?.selectedValue}</span>
              </p> */}
            </div>
          }
        </>
      )}
    </>
  );
};

const RenderJsonArraySidebarDetail = ({
  obj,
  showObj,
  path,
  handlejs,
  objs,
  handleAddjs,
  handleDeletejs,
  expandedItem,
  setExpandedItem,
  selectedTheme,
}) => {
  const [showAccordianItem, setShowAccordianItem] = useState(null);
  const [value, setValue] = useState(null);
  const isExpandedRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      isExpandedRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
    );
  }, []);

  const handleInput = (e, i, key, type) => {
    try {
      setValue(e);
      if (value) {
        handlejs(e, i, key, type, showObj);
      } else {
        handlejs(e, i, key, type, showObj);
      }
    } catch (error) {}
  };

  const handlePaste = (e, i, key, type) => {
    e.stopPropagation();
    try {
      setValue(e);
      if (value) {
        handlejs(e, i, key, type, showObj);
      } else {
        handlejs(e, i, key, type, showObj);
      }
    } catch (error) {}
  };

  const toggleKey = (key) => {
    try {
      if (expandedItem.includes(key)) {
        setExpandedItem(expandedItem.filter((k) => k !== key));
      } else {
        setExpandedItem([...expandedItem, key]);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="  flex h-[100%] items-center justify-end pb-[1vh]">
        {/* <TorusDialog
          key={"TableDelete"}
          triggerElement={
            // <TorusButton
            //   Children={`Add`}
            //   size={"xs"}
            //   btncolor={"#0736C4"}
            //   radius={"lg"}
            //   color={"#ffffff"}
            //   gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
            //   height={"md"}
            //   borderColor={"3px solid #0736C4"}
            //   startContent={<PlusIcon />}
            //   fontStyle={"text-sm font-medium text-[#FFFFFF]"}
            // />

            <Button
              className={
                "transition-border flex h-[2vw] w-[2vw] items-center justify-center rounded-full border border-gray-700/50 bg-gray-100/50 shadow-md duration-150 fade-in-10 fade-out-5 hover:border-gray-200/35 dark:border-gray-700/50 dark:bg-gray-700/50 dark:hover:border-gray-300/35"
              }
            >
              <Add
                className={"h-[0.83vw] w-[0.83vw] stroke-gray-500 stroke-2"}
              />
            </Button>
          }
          classNames={{
            modalClassName: " w-[40%] flex justify-center items-center  ",
            dialogClassName: " w-full h-full rounded-lg flex-col bg-white",
          }}
          title={"Add"}
          message={"Edit"}
          children={({ close }) => (
            <AddModalContentType
              obj={obj}
              showObj={showObj}
              close={close}
              handleAddjs={handleAddjs}
              type="arr-0"
            />
          )}
        /> */}
        {/* <TorusButton
          Children={`Delete`}
          size={"xs"}
          btncolor={"#0736C4"}
          radius={"lg"}
          color={"#f00"}
          gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
          height={"md"}
          borderColor={"3px solid #0736C4"}
          startContent={<CiTrash color="white" />}
          fontStyle={"text-sm font-medium text-[#FFFFFF]"}
          onPress={() => handleDeletejs(path)}
        /> */}
      </div>
      <div className=" flex max-h-[55vh] min-h-[50vh] flex-col gap-[0.5vw] overflow-y-scroll">
        {obj &&
          obj.map((ele, index) => {
            const isExpanded = expandedItem.includes(ele?.label);
            return (
              <div className="rounded-lg border">
                <div
                  key={index}
                  className={`flex w-[100%]   ${isExpanded ? 'rounded-t-lg ' : 'mt-[1.25vh] rounded-lg'} justify-between  `}
                  style={{
                    backgroundColor: `${selectedTheme?.bg}`,
                  }}
                >
                  <div
                    className="flex cursor-pointer items-center gap-1 p-2 pl-[0.55vw]"
                    onClick={() => {
                      setShowAccordianItem(ele);
                      toggleKey(ele?.label);
                    }}
                  >
                    <span className="flex justify-end">
                      <span
                        className={`transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <NavbarArrowDown
                          pathClassName={
                            'fill-black dark:fill-white stroke-black dark:stroke-white'
                          }
                          stroke={selectedTheme?.text}
                          className={'h-[0.83vw] w-[0.83vw]'}
                        />
                      </span>
                    </span>
                    <p className="m-0 w-[100%] select-none whitespace-nowrap text-[0.62vw]">
                      {ele?.label}
                    </p>
                  </div>
                  <div className="flex w-[35%] justify-between">
                    {isExpanded && (
                      <div
                        className="flex h-[100%] w-full items-center justify-end  px-[1vh] py-[1.25vh] "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* <TorusDialog
                          key={'TableDelete'}
                          triggerElement={
                            // <TorusButton
                            //   Children={`Add`}
                            //   size={"xs"}
                            //   btncolor={"#0736C4"}
                            //   radius={"lg"}
                            //   color={"#ffffff"}
                            //   gap={"py-[0.2rem] px-[0.2rem] mb-[0.5rem]"}
                            //   height={"md"}
                            //   borderColor={"3px solid #0736C4"}
                            //   startContent={
                            //     <IoAddCircleOutline color="white" size={20} />
                            //   }
                            //   fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                            // />
                            <TorusButton
                              buttonClassName={
                                'transition-border flex h-[2vw] w-[2vw] items-center justify-center rounded-full bg-transparent  '
                              }
                              Children={
                                <Add
                                  className={
                                    'h-[0.83vw] w-[0.83vw] stroke-gray-500 stroke-2 dark:stroke-white'
                                  }
                                />
                              }
                            />
                          }
                          classNames={{
                            modalClassName:
                              ' w-[40%] h-[40%]  flex justify-center items-center  ',
                            dialogClassName:
                              ' w-full h-full rounded-lg flex-col bg-white',
                          }}
                          title={'Add'}
                          message={'Edit'}
                          children={({ close }) => (
                            <AddModalContentType
                              obj={obj}
                              showObj={showObj}
                              close={close}
                              handleAddjs={handleAddjs}
                              type="arr-1"
                              path={index}
                            />
                          )}
                        /> */}
                        {/* <TorusButton
                        Children={`kia`}
                        size={"xs"}
                        btncolor={"#0736C4"}
                        radius={"lg"}
                        color={"#f00"}
                        gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
                        height={"md"}
                        borderColor={"3px solid #0736C4"}
                        startContent={<CiTrash color="white" />}
                        fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                        onPress={() => handleDeletejs(path, "arr-1", ele.label)}
                      /> */}
                        {/* <TorusButton
                          onPress={() => {
                            handleDeletejs(path, 'arr-1', ele.label);
                          }}
                          buttonClassName={
                            ' flex h-[2vw] w-[2vw] transistion-[shadow] ease-in-out duration-150 items-center justify-center rounded-full border-0    hover:border hover:shadow-lg     hover:border-gray-400   dark:hover:border-gray-300/35'
                          }
                          Children={
                            <DeleteIcon
                              className={'h-[0.83vw] w-[0.83vw] stroke-red-500'}
                            />
                          }
                        ></TorusButton> */}
                      </div>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div
                    className={`mb-[1.5vh] max-h-[50vh] min-h-[20vh] w-[100%] overflow-scroll rounded-b-lg  px-2  pt-[1vh]  dark:bg-[#0F0F0F] `}
                    ref={isExpandedRef}
                  >
                    {objs &&
                      Object.keys(objs[showObj][index])
                        .filter(
                          (item) => item !== 'grouplabel' && item !== 'label',
                        )
                        .map((item, inds) => {
                          if (
                            !Array.isArray(objs[showObj][index][item]) &&
                            typeof objs[showObj][index][item] !== 'object'
                          ) {
                            return (
                              <p
                                style={{
                                  display: item === 'label' ? 'none' : '',
                                }}
                                className={`mb-2 rounded-lg bg-[#F4F5FA]  pb-2 dark:bg-[#161616] `}
                              >
                                <div className="flex w-[100%] items-center">
                                  {/* <TorusInput
                                    key={inds}
                                    variant="bordered"
                                    label={item}
                                    labelColor="text-[#000000]/50"
                                    borderColor="[#000000]/50"
                                    outlineColor="torus-focus:ring-[#000000]/50"
                                    placeholder=""
                                    isDisabled={false}
                                    onChange={(e) => {
                                      handleInput(
                                        e,
                                        path + "." + index + "." + item,
                                        item,
                                        "arr",
                                      );
                                    }}
                                    radius="lg"
                                    width="xl"
                                    height="xl"
                                    textColor="text-[#000000] dark:text-[#FFFFFF]"
                                    bgColor="bg-[#FFFFFF] dark:bg-[#161616]"
                                    value={objs[showObj][index][item]}
                                    NoneRightRadius={true}
                                  /> */}

                                  <TorusModularInput
                                    key={inds}
                                    label={item}
                                    value={objs[showObj][index][item]}
                                    isRequired={true}
                                    type="text"
                                    placeholder="Type Key..."
                                    bgColor="bg-transparent"
                                    labelColor="text-gray-400/60 text-[0.83vw] pl-[0.25vw] dark:text-white/35"
                                    
                                    textColor="text-black dark:text-white"
                                    textSize={'text-[0.72vw]'}
                                    // radius="sm"
                                    size="sm"
                                    isReadOnly={false}
                                    isDisabled={false}
                                    errorShown={false}
                                    isClearable={true}
                                    backgroundColor={
                                      'bg-transparent border-1 dark:border-[#161616]'
                                    }
                                    onChange={(e) =>
                                      handleInput(
                                        e,
                                        path + '.' + index + '.' + item,
                                        item,
                                        'arr',
                                      )
                                    }
                                    
                                    inputClassName={'px-[0.25vw] py-[0.65vw] '}
                                    // endContent={
                                    //   <Button
                                    //     className=""
                                    //     onPress={() =>
                                    //       handleDeletejs(
                                    //         path + '.' + index + '.' + item,
                                    //         'obj',
                                    //       )
                                    //     }
                                    //   >
                                    //     <DeleteIcon
                                    //       className={
                                    //         'h-[0.83vw] w-[0.83vw] stroke-red-500 stroke-2'
                                    //       }
                                    //     />
                                    //   </Button>
                                    // }
                                  />
                                  {/* <TorusButton
                                    Children={`Delete`}
                                    size={"xs"}
                                    btncolor={"#0736C4"}
                                    radius={"lg"}
                                    color={"#f00"}
                                    gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
                                    height={"md"}
                                    borderColor={"3px solid #0736C4"}
                                    startContent={<CiTrash color="white" />}
                                    fontStyle={
                                      "text-sm font-medium text-[#FFFFFF]"
                                    }
                                    onPress={() =>
                                      handleDeletejs(
                                        path + "." + index + "." + item,
                                        "obj",
                                      )
                                    }
                                  /> */}
                                </div>
                                {/* <input
                             className="border text-orange-500 "
                             type="text"
                             value={obj[showObj][ele]}
                             onChange={(e) =>
                               handleInput(e.target.value, path, ele, "obj")
                             }
                           /> */}
                              </p>
                            );
                          }

                          if (
                            Array.isArray(objs[showObj][index][item]) ||
                            typeof objs[showObj][index][item] === 'object'
                          ) {
                            return (
                              <>
                                <RenderDropdown
                                  obj={objs[showObj][index][item]}
                                  item={item}
                                  path={path + '.' + index}
                                  handlejs={handlejs}
                                  showObj={showObj}
                                  handleDeletejs={handleDeletejs}
                                />
                              </>
                            );
                          }
                          if (typeof objs[showObj][index][item] === 'boolean') {
                            <RenderSwitch obj={objs[showObj][index][item]} />;
                          }
                        })}
                  </div>
                )}
              </div>
            );
          })}

        {/* 
      {obj && (
        <>
          {obj && obj.map((ele, index) => {
            {
            }
            return (
              <div key={index}>
                <p
                  onClick={() => setShowAccordianItem(ele) }
                  className="cursor-pointer"
                >
                  {ele.label}
                </p>
              </div>
            );
          })}

           {
           showAccordianItem &&
            Object.keys(showAccordianItem).map((item, inds) => {
              if (!Array.isArray(showAccordianItem[item])) {
                return (
                  <p >
                  {item} :
                  <input
                    className="border text-blue-500 "
                    type="text"
                    Value={showAccordianItem[item]}
                   
                  />
                </p> 
              
                );
              }
            })} 
        </>
      )} */}

        {/* <select>
        {obj &&
          obj.map((ele) => (
            <option key={ele} value={ele}>
              {ele}
            </option>
          ))}
      </select> */}
      </div>
    </>
  );
};

export default function JsonSidebarDetail({
  showObj,
  obj,
  handlejs,
  path,
  label,
  OgJson,
  handleAddjs,
  handleDeletejs,
  checkActivestatus,
  expandedItem,
  setExpandedItem,
  selectedTheme,
}) {
  const [value, setValue] = useState(null);

  const handleInput = (e, i, key, type) => {
    try {
      setValue(e);
      if (value) {
        handlejs(e, i, key, type, showObj);
      } else {
        handlejs(e, i, key, type, showObj);
      }
    } catch (error) {}
  };

  return (
    <div className=" mt-3 flex  h-[100%] w-[98%] flex-col gap-3 py-2 pl-2 text-sm  font-semibold">
      <span className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="w-[50%]">
            <p
              className="text-[0.83vw] font-[500]"
              style={{
                color: `${selectedTheme && selectedTheme?.text}`,
              }}
            >
              {' '}
              Properties
            </p>
          </div>

          <div className="flex w-[50%] items-center justify-end">
            {/* <TorusButton
              startContent={<CiSaveDown2 color="white" size={20} />}
              Children={"Save"}
              size={"sm"}
              btncolor={"#0736C4"}
              radius={"lg"}
              color={"#ffffff"}
              borderColor={"3px solid #0736C4"}
              fontStyle={"text-sm font-medium text-[#FFFFFF]"}
              buttonClassName={"w-[100%]"}
              isIconOnly={false}
              onPress={() => OgJson()}
            /> */}

            <AnimatedButton onClick={() => OgJson()} />
          </div>
        </div>

        {label && (
          <div
            className=" rounded-md px-[0.25vw] py-[0.85vh] "
            style={{
              backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
            }}
          >
            <div className="flex w-[100%] items-center justify-center rounded-sm px-[0.5vw] py-[1vh]">
              <div
                className="flex w-[100%] flex-col rounded-md  px-[0.55vw] py-[0.85vh]"
                style={{
                  backgroundColor: `${selectedTheme && selectedTheme?.bg}`,
                }}
              >
                <h1
                  className={`${'mb-2  text-[0.62vw]  font-bold '}    cursor-pointer  `}
                  style={{
                    color: `${selectedTheme && selectedTheme?.text}`,
                  }}
                >
                  Label :
                </h1>

                {label ? (
                  <span
                    className=""
                    style={{
                      display: 'block',
                      width: '75%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.83vw',
                      fontWeight: 500,
                      lineHeight: '2.22vh',
                      color: `${selectedTheme && selectedTheme?.text}`,
                    }}
                  >
                    {label}
                  </span>
                ) : (
                  <p
                    className={`${'text-[0.83vw] font-medium text-black  dark:text-[#F4F4F5] '}`}
                  >
                    there is no value in this field
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </span>
      <div
        style={{
          height: 'inherit',
        }}
        className="scrollbar-none  w-[100%] overflow-y-auto  overflow-x-hidden"
      >
        {obj && showObj && obj[showObj] && (
          <div className="">
            {
              !Array.isArray(obj[showObj]) ? (
                <div className="flex flex-col gap-2">
                  {
                    // <div >
                    //   <Button size="sm" onPress={onOpen}>Add</Button>
                    //   <Modal  size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                    //     <ModalContent>
                    //       {(onClose) => (
                    //         <>
                    //           <ModalHeader className="flex flex-col gap-1 dark:text-white">
                    //             Add key-value
                    //           </ModalHeader>
                    //           <ModalBody>
                    //             <AddModalContentType/>
                    //           </ModalBody>
                    //           <ModalFooter>
                    //             <Button
                    //               color="danger"
                    //               variant="light"
                    //               onPress={onClose}
                    //             >
                    //               Close
                    //             </Button>
                    //             <Button color="primary" onPress={onClose}>
                    //               Action
                    //             </Button>
                    //           </ModalFooter>
                    //         </>
                    //       )}
                    //     </ModalContent>
                    //   </Modal>
                    // </div>
                    // <div className="  flex h-[100%] w-[100%] items-center justify-end">
                    //   {/* <TorusDialog
                    //     key={"TableDelete"}
                    //     triggerElement={
                    //       <TorusButton
                    //         Children={`Add`}
                    //         size={"xs"}
                    //         btncolor={"#0736C4"}
                    //         radius={"lg"}
                    //         color={"#ffffff"}
                    //         gap={"py-[0.2rem] px-[0.2rem]"}
                    //         height={"md"}
                    //         borderColor={"3px solid #0736C4"}
                    //         startContent={<PlusIcon />}
                    //         fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                    //       />
                    //     }
                    //     classNames={{
                    //       modalClassName:
                    //         " w-[40%] h-[40%]  flex justify-center items-center  ",
                    //       dialogClassName:
                    //         " w-full h-full rounded-lg flex-col bg-white",
                    //     }}
                    //     title={"Add"}
                    //     message={"Edit"}
                    //     children={({ close }) => (
                    //       <AddModalContentType
                    //         obj={obj}
                    //         showObj={showObj}
                    //         close={close}
                    //         handleAddjs={handleAddjs}
                    //         type={"obj"}
                    //       />
                    //     )}
                    //   /> */}
                    //   <TorusModel
                    //     body={
                    //       <AddModalContentType
                    //         obj={obj}
                    //         showObj={showObj}
                    //         // close={close()}
                    //         handleAddjs={handleAddjs}
                    //         type={"obj"}
                    //       />
                    //     }
                    //     title={
                    //       <div className="flex w-[50%] justify-around gap-[0.525rem]">
                    //         <div className="flex w-[10%] items-center justify-end">
                    //           <MdOutlineNoteAdd color="#4C8DF7" size={13} />
                    //         </div>
                    //         <div className="flex w-[90%] items-center justify-start">
                    //           Add Key and Values
                    //         </div>
                    //       </div>
                    //     }
                    //     triggerButton={
                    //       <TorusButton
                    //         Children={<PlusIcon />}
                    //         size={"xs"}
                    //         btncolor={"#0736C4"}
                    //         radius={"lg"}
                    //         color={"#ffffff"}
                    //         gap={"py-[0.2rem] px-[0.2rem]"}
                    //         height={"md"}
                    //         borderColor={"3px solid #0736C4"}
                    //         fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                    //         buttonClassName={"w-[100%]"}
                    //         isIconOnly={true}
                    //       />
                    //     }
                    //     triggerButtonStyle={"cursor-pointer bg=transparent"}
                    //     titleStyle="text-blue-500"
                    //     confirmButtonText={"Add"}
                    //     cancelButtonText={"Cancel"}
                    //     confirmButtonStyle={
                    //       "pressed:bg-blue-600 cursor-pointer bg-[#4C8DF7] text-white hover:border-blue-600"
                    //     }
                    //     modelClassName={
                    //       "max-h-130 max-w-[45%] min-w-[43%] bg-white dark:bg-[#161616] rounded-lg shadow-xl"
                    //     }
                    //   />
                    //   {/* <TorusButton
                    //     Children={`Delete`}
                    //     size={"xs"}
                    //     btncolor={"#0736C4"}
                    //     radius={"lg"}
                    //     color={"#f00"}
                    //     gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
                    //     height={"md"}
                    //     borderColor={"3px solid #0736C4"}
                    //     startContent={<CiTrash color="white" />}
                    //     fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                    //     onPress={() => handleDeletejs(path)}
                    //   /> */}
                    // </div>
                  }
                  <div className="flex max-h-[60vh] flex-col gap-[0.55vh] overflow-y-scroll">
                    {obj &&
                      showObj &&
                      obj[showObj] &&
                      Object.keys(obj[showObj]).map((ele) => {
                        if (
                          !Array.isArray(obj[showObj][ele]) &&
                          typeof obj[showObj][ele] !== 'object' &&
                          ele !== 'groupLabel'
                        ) {
                          return (
                            <div
                              // style={{
                              //   display: ele === "label" ? "none" : "",
                              // }}
                              className="mb-2.5 flex w-[100%]  rounded-lg  px-2 pb-2 pt-2 "
                              style={{
                                backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                              }}
                            >
                              <div className="flex w-full items-center">
                                <div className="flex w-[100%] items-center justify-start">
                                  {/* <TorusInput
                                    key={path}
                                    variant="bordered"
                                    label={ele}
                                    labelColor="text-[#000000]/50"
                                    borderColor="[#000000]/50"
                                    outlineColor="torus-focus:ring-[#000000]/50"
                                    placeholder=""
                                    isDisabled={false}
                                    onChange={(e) =>
                                      handleInput(e, path, ele, "obj")
                                    }
                                    radius="lg"
                                    width="xl"
                                    height="xl"
                                    textColor="text-[#000000] dark:text-[#FFFFFF]"
                                    bgColor="bg-[#FFFFFF] dark:bg-[#161616]"
                                    value={obj[showObj][ele]}
                                    NoneRightRadius={true}
                                  /> */}

                                  {
                                    <TorusModularInput
                                      key={ele}
                                      label={ele}
                                      // defaultValue={obj[showObj][ele]}
                                      value={obj[showObj][ele]}
                                      isRequired={true}
                                      type="text"
                                      placeholder="Type Key..."
                                      bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                                      textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                                      // labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                                      labelColor={`  ${selectedTheme && `${selectedTheme?.text}80`}`}
                                      labelSize={'text-[0.62vw]'}
                                      
                                      textSize={'text-[0.62vw]'}
                                      // radius="sm"
                                      size="sm"
                                      isReadOnly={false}
                                      isDisabled={false}
                                      errorShown={false}
                                      isClearable={true}
                                      backgroundColor={'bg-transparent  '}
                                      onChange={(e) =>
                                        handleInput(e, path, ele, 'obj')
                                      }
                                      inputClassName={
                                        'px-[0.25vw] py-[0.65vw] '
                                      }
                                      // endContent={
                                      //   <Button
                                      //     className=""
                                      //     onPress={() =>
                                      //       handleDeletejs(
                                      //         path + '.' + ele,
                                      //         'obj',
                                      //       )
                                      //     }
                                      //   >
                                      //     <DeleteIcon
                                      //       className={
                                      //         'h-[0.83vw] w-[0.83vw] stroke-red-500 stroke-2'
                                      //       }
                                      //     />
                                      //   </Button>
                                      // }
                                    />
                                  }

                                  {/* <TorusModularInput
                                    label={ele}
                                    defaultValue={obj[showObj][ele]}
                                    value={obj[showObj][ele]}
                                    onChange={(e) =>
                                      handleInput(e, path, ele, "obj")
                                    }
                                    isRequired={true}
                                    maxLength={10}
                                    type="text"
                                    placeholder="Type here..."
                                    bgColor="bg-transparent"
                                    labelColor="text-gray-400/60"
                                    textColor="text-black"
                                    radius="md"
                                    size="sm"
                                    endContent={
                                      <Button
                                        className="rounded-r-lg bg-white"
                                        onPress={() =>
                                          handleDeletejs(
                                            path + "." + ele,
                                            "obj",
                                          )
                                        }
                                      >
                                        <CiTrash color="red" size={15} />
                                      </Button>
                                    }
                                    isReadOnly={false}
                                    isDisabled={false}
                                    errorShown={false}
                                    isClearable={true}
                                  /> */}
                                </div>

                                {/* <TorusButton
                                  Children={`Delete`}
                                  size={"xs"}
                                  btncolor={"#0736C4"}
                                  radius={"lg"}
                                  color={"#f00"}
                                  gap={"py-[0.2rem] px-[0.2rem] mb-[0.3rem]"}
                                  height={"md"}
                                  borderColor={"3px solid #0736C4"}
                                  startContent={<CiTrash color="white" />}
                                  fontStyle={
                                    "text-sm font-medium text-[#FFFFFF]"
                                  }
                                  onPress={() =>
                                    handleDeletejs(path + "." + ele, "obj")
                                  }
                                /> */}

                                {/* <input
                               className="border text-orange-500 "
                               type="text"
                               value={obj[showObj][ele]}
                               onChange={(e) =>
                                 handleInput(e.target.value, path, ele, "obj")
                               }
                             /> */}
                              </div>
                            </div>
                          );
                        }
                        if (
                          Array.isArray(obj[showObj][ele]) ||
                          typeof obj[showObj][ele] === 'object'
                        ) {
                          return (
                            <RenderDropdown
                              obj={obj[showObj][ele]}
                              item={ele}
                              path={path}
                              handlejs={handlejs}
                              showObj={showObj}
                              handleDeletejs={handleDeletejs}
                            />
                          );
                        }
                      })}
                  </div>
                </div>
              ) : (
                <RenderJsonArraySidebarDetail
                  obj={obj[showObj]}
                  showObj={showObj}
                  path={path}
                  handlejs={handlejs}
                  objs={obj}
                  handleAddjs={handleAddjs}
                  handleDeletejs={handleDeletejs}
                  checkActivestatus={checkActivestatus}
                  setExpandedItem={setExpandedItem}
                  expandedItem={expandedItem}
                  selectedTheme={selectedTheme}
                />
              )
              // showObj &&
              //   Object.keys(showObj).map((ele ,index) => {
              //     if (!Array.isArray(showObj[ele]))
              //       return (
              //         <p style={{ display: ele === "label" ? "none" : "" }} key={path + "."+ele}>

              //           {ele} :
              //            <input
              //             className="border text-blue-500 "
              //             type="text"
              //             defaultValue={showObj[ele]}
              //             onChange={(e) =>
              //               handleInput(e.target.value, path + "."+ele ,"", "arr" )
              //             }
              //           />
              //         </p>
              //       );
              //     else if (Array.isArray(showObj[ele]))
              //       return <RenderJsonArraySidebarDetail obj={showObj[ele]} />;
              //     else if (typeof showObj[ele] == "object")
              //       return (
              //         <p>
              //           {ele} : {showObj[ele].label}
              //         </p>
              //       );
              //   })
            }
          </div>
        )}
      </div>
    </div>
  );
}

const Spinner = () => (
  <div
    style={{
      width: '10px',
      height: '10px',
      border: '4px solid #ccc',
      borderTop: '4px solid #9CA3AF',
      borderRadius: '50%',
      margin: '0 auto',
    }}
    className="spinner"
  />
);

const AnimatedButton = ({ onClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(true); // Show success icon by default
  const successIconRef = useRef(null);

  // Animate success icon opacity based on state
  useEffect(() => {
    if (showSuccessIcon) {
      gsap.fromTo(
        successIconRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
    } else {
      gsap.to(successIconRef.current, { opacity: 1 }, { opacity: 0.3 });
    }
  }, [showSuccessIcon]);

  const handleClick = async () => {
    try {
      setIsClicked(true);
      setShowSuccessIcon(false);
      setShowSpinner(true);

      setTimeout(() => {
        setShowSpinner(false);
        setShowSuccessIcon(true);
      }, 300);

      await onClick();

      setTimeout(() => {
        setIsClicked(false);
      }, 500);
    } catch (error) {
      console.error(error);
      setIsClicked(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        isClicked ? 'bg-green-500' : 'bg-gray-400 hover:bg-gray-500'
      } relative flex h-[1.55vw] w-[1.55vw] items-center justify-center rounded-full text-white transition-colors duration-300`}
    >
      <div
        ref={successIconRef}
        className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
      >
        <SuccessIcon className="h-[0.72vw] w-[0.72vw] fill-white" />
      </div>
    </button>
  );
};
