import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { PlusIcon } from '../../SVG_Application.jsx';
import TorusButton from '../../torusComponents/TorusButton.jsx';
import TorusDropDown from '../../torusComponents/TorusDropDown';
import TorusModularInput from '../../torusComponents/TorusModularInput.jsx';

const AddObj = ['object'];
const AddKey = ['input', 'boolean', 'dropdown'];
export const AddModalContentType = ({
  close,
  obj,
  showObj,
  handleAddjs,
  type,
  path,
}) => {
  const [value, setValue] = useState(null);

  const [keyinput, setkeyinput] = useState(null);
  const [valueinput, setvalueinput] = useState(null);
  const [dropdownValues, setdropdownValues] = useState(['']);

  const handleAdd = (selectedValue) => {
    try {
      if (selectedValue == 'input' && keyinput && valueinput) {
        handleAddjs(showObj, keyinput, valueinput, type, path, selectedValue);
        // close();
      }
      if (selectedValue == 'object' && keyinput) {
        handleAddjs(showObj, keyinput, valueinput, type, path, selectedValue);
        // close();
      }
      if (selectedValue === 'boolean') {
        handleAddjs(showObj, keyinput, valueinput, type, path, selectedValue);
        // close();
      }
      if (selectedValue === 'dropdown') {
        handleAddjs(
          showObj,
          keyinput,
          dropdownValues,
          type,
          path,
          selectedValue,
        );
        // close();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(obj, showObj, keyinput, valueinput, path, 'df', type);
  return (
    <div className="mb-3 flex  h-[100%] w-[100%] items-center rounded  transition-all duration-100 ease-in-out dark:bg-[#070707] ">
      <div className="flex h-[100%] w-[50%] justify-start border-r border-gray-400/25">
        <TorusDropDown
          renderEmptyState={() => 'No Items...'}
          classNames={{
            buttonClassName: `bg-white dark:bg-[#161616] w-[100%] h-[40px] text-black dark:text-white  mb-2 border border-gray-300 dark:border-[#212121] 3xl:h-[30px] 3xl:text-sm`,
            listBoxClassName:
              'bg-white dark:bg-[#161616] text-black dark:text-white',
          }}
          title={
            <div className="flex w-[100%] flex-row  items-center">
              <div
                className={
                  ' w-[80%] whitespace-nowrap tracking-tighter text-black dark:text-white xl:text-sm xl:font-normal 3xl:text-sm'
                }
              >
                {value ? value : 'Add Content Type'}
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
          selectionMode="single"
          items={(type === 'obj' || type === 'arr-1' ? AddKey : AddObj).map(
            (ele) => ({
              key: ele,
              label: ele,
            }),
          )}
          btWidth={'md'}
        />
      </div>

      {value && Array.from(value)[0] !== 'object' && (
        <>
          <div className="flex w-[100%] flex-col items-center justify-center">
            <div
              style={{
                display:
                  value && Array.from(value)[0] !== 'object' ? 'flex' : 'none',
                width: '50%',
                paddingTop: '2rem',
              }}
            >
              <TorusModularInput
                label="Key"
                defaultValue={keyinput}
                value={keyinput}
                onChange={(e) => {
                  setkeyinput(e);
                }}
                isRequired={true}
                maxLength={10}
                type="text"
                placeholder="Type Key..."
                backgroundColor="bg-gray-300/25"
                labelColor="text-gray-400/60"
                textColor="text-black"
                radius="md"
                size="sm"
                isReadOnly={false}
                isDisabled={false}
                errorShown={false}
                isClearable={true}
              />
            </div>

            <div
              style={{
                display:
                  value && Array.from(value)[0] === 'input' ? 'block' : 'none',
                width: '50%',
              }}
              className="input==>"
            >
              <TorusModularInput
                label="Value"
                defaultValue={valueinput}
                value={valueinput}
                onChange={(e) => {
                  setvalueinput(e);
                }}
                isRequired={true}
                maxLength={10}
                type="text"
                placeholder="Type Key..."
                bgColor="bg-transparent"
                labelColor="text-gray-400/60"
                
                textColor="text-black"
                radius="md"
                size="sm"
                backgroundColor={'bg-gray-300/25'}
                isReadOnly={false}
                isDisabled={false}
                errorShown={false}
                isClearable={true}
              />
            </div>
            <div
              style={{
                display:
                  value && Array.from(value)[0] === 'dropdown'
                    ? 'block'
                    : 'none',
                width: '50%',
              }}
            >
              <div className="flex flex-col items-center justify-center pt-2">
                {/* <button
                   onClick={() =>
                dropdownValues[dropdownValues.length - 1] !== "" &&
                setdropdownValues([...dropdownValues, ""])
                  }
                  >
              Add Field
                        </button> */}

                <TorusButton
                  Children={<PlusIcon />}
                  size={'xs'}
                  btncolor={'#0736C4'}
                  radius={'lg'}
                  color={'#ffffff'}
                  gap={'py-[0.2rem] px-[0.2rem]'}
                  height={'md'}
                  borderColor={'3px solid #0736C4'}
                  fontStyle={'text-sm font-medium text-[#FFFFFF]'}
                  buttonClassName={'w-[100%]'}
                  isIconOnly={true}
                  onPress={() =>
                    dropdownValues[dropdownValues.length - 1] !== '' &&
                    setdropdownValues([...dropdownValues, ''])
                  }
                />

                <div className="h-[100px]  w-[100%] overflow-y-scroll pt-2">
                  {dropdownValues.map((item, i) => {
                    return (
                      // <TorusInput
                      //   label={`Item ${i + 1}`}
                      //   variant="fade"
                      //   labelColor="text-[#000000]/50"
                      //   borderColor="[#000000]/50"
                      //   placeholder=""
                      //   isDisabled={false}
                      //   onChange={(e) => {
                      //     setdropdownValues((prev) =>
                      //       prev.map((item, index) => (index === i ? e : item)),
                      //     );
                      //   }}
                      //   radius="lg"
                      //   width="md"
                      //   height="md"
                      //   textColor="text-[#000000] dark:text-[#FFFFFF]"
                      //   bgColor="bg-[#FFFFFF] dark:bg-[#161616]"
                      //   value={item}
                      // />

                      <TorusModularInput
                        label={`Item ${i + 1}`}
                        defaultValue={item}
                        value={item}
                        onChange={(e) => {
                          setdropdownValues((prev) =>
                            prev.map((item, index) => (index === i ? e : item)),
                          );
                        }}
                        isRequired={true}
                        maxLength={10}
                        type="text"
                        placeholder="Type Key..."
                        bgColor="bg-transparent"
                        labelColor="text-gray-400/60"
                        
                        textColor="text-black"
                        radius="md"
                        size="sm"
                        isReadOnly={false}
                        isDisabled={false}
                        errorShown={false}
                        isClearable={true}
                        backgroundColor={'bg-gray-300/25'}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className=""
        style={{
          display:
            value && Array.from(value)[0] === 'object' ? 'block' : 'none',
        }}
      >
        {/* <TorusInput
          label="Key"
          variant="fade"
          labelColor="text-[#000000]/50"
          borderColor="[#000000]/50"
          isDisabled={false}
          onChange={(e) => {
            setkeyinput(e);
          }}
          radius="lg"
          width="md"
          height="md"
          textColor="text-[#000000] dark:text-[#FFFFFF]"
          bgColor="bg-[#FFFFFF] dark:bg-[#161616]"
          value={keyinput}
        /> */}

        <TorusModularInput
          label="Key"
          defaultValue={keyinput}
          value={keyinput}
          onChange={(e) => {
            setkeyinput(e);
          }}
          isRequired={true}
          maxLength={10}
          type="text"
          placeholder="Type Key..."
          bgColor="bg-transparent"
          labelColor="text-gray-400/60"
          
          textColor="text-black"
          radius="md"
          size="sm"
          isReadOnly={false}
          isDisabled={false}
          errorShown={false}
          isClearable={true}
          backgroundColor={'bg-gray-300/25'}
        />
      </div>

      {/* <div className=" flex h-[20%] w-[100%] justify-around "> */}
      <div className="items-center">
        {value && (
          <button
            id="btn-add"
            className="hidden rounded-md bg-violet-600 px-3 py-1 dark:text-white"
            onClick={() => handleAdd(Array.from(value)[0])}
          >
            Add
          </button>
        )}
      </div>
      {/* <div className="justify-end">
          <button
            className="rounded-md bg-violet-600  px-3 py-1 dark:text-white"
            onClick={close}
          >
            cancel
          </button>
        </div> */}
      {/* </div> */}
    </div>
  );
};
