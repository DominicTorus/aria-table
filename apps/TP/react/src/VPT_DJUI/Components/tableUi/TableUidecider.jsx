/* eslint-disable */
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Tooltip } from '@nextui-org/react';
import { Input } from 'react-aria-components';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import ReusableInput from '../../../commonComponents/reusableComponents/ReusableInput';
import TorusDropDown from '../../../torusComponents/TorusDropDown';
import { BuilderContext } from '../../builder';
import { RenderTooltip } from '../utils/RenderTooltip';
import { handlepath } from '../utils/utils';
import Tableui from './tableui';
import _ from 'lodash';

const CustomInput = ({ keyJson, Objkey, value, path }) => {
  const { editedValues, setEditedValues } = useContext(BuilderContext);
  const [toogleInput, setToogleInput] = useState(false);
  const { darkMode } = useContext(DarkmodeContext);

  return (
    <div className="flex h-full w-full items-start">
      {!toogleInput ? (
        <div className="flex gap-2">
          <span className={'text-grey-700 dark:text-white'}>{Objkey}:</span>
          {keyJson &&
            keyJson.hasOwnProperty(handlepath(path + '.' + Objkey)) && (
              <Tooltip
                content={
                  <RenderTooltip
                    tooltip={keyJson[handlepath(path + '.' + Objkey)]}
                  />
                }
              >
                <div className="flex items-center gap-2">
                  <span>
                    <AiOutlineInfoCircle className="text-black dark:text-white " />
                  </span>
                </div>
              </Tooltip>
            )}
          <span
            className={'text-grey-700 dark:text-white'}
            onDoubleClick={() => setToogleInput(true)}
          >
            {value || 'Double Click to Edit'}
          </span>
        </div>
      ) : (
        <div className="g-2 flex">
          <span className={'text-grey-700 dark:text-white'}>{Objkey}:</span>
          <div className=" ">
            <TableInput
              path={path}
              keys={Objkey}
              json={json}
              editedValues={editedValues}
              setEditedValues={setEditedValues}
            />
            {/* <ReusableInput
              key={path + '.' + Objkey}
              type="text"
              darkMode={darkMode}
              defaultValue={value}
              className={`text-grey-700 h-[100%] w-[80%]  rounded-2xl  border-2 border-gray-600/80 bg-transparent shadow-none outline-none dark:text-white`}
              value={editedValues[path + '.' + Objkey]}
              handleChange={(e) =>
                setEditedValues((prev) => ({
                  ...prev,
                  [path + '.' + Objkey]: e.target.value,
                }))
              }
              label={Objkey}
              inputProps={{
                onBlur: () => setToogleInput(false),
                onKeyDown: (e) => e.key === 'Enter' && setToogleInput(false),
              }}
            /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Tableuidecider({ data, path, keyJson }) {
  const { functionality, editedValues, setEditedValues } =
    useContext(BuilderContext);
  const handleDropDownDupilcate = (data) => {
    try {
      if (data && data.type == 'singleSelect') {
        if (data.selectionList.includes(data.selectedValue[0])) {
          return data.selectedValue;
        } else {
          functionality('update', path + '.' + 'selectedValue', {
            value: [],
          });
        }
      } else if (data && data.type == 'multipleSelect') {
        if (
          data.selectedValue.every((item) => data.selectionList.includes(item))
        ) {
          return data.selectedValue.join(', ');
        } else {
          functionality('update', path + '.' + 'selectedValue', {
            value: [
              ...data.selectedValue.filter((item) =>
                data.selectionList.includes(item),
              ),
            ],
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const newData = useMemo(() => {
    try {
      if (_.isEmpty(data)) return {};
      else return data;
    } catch (error) {
      console.error(error);
    }
  }, [data]);
  if (
    newData &&
    Object.keys(newData).length > 0 &&
    newData.hasOwnProperty('type') &&
    newData?.type == 'singleSelect'
  ) {
    return (
      <div className="bg-transparent">
        <TorusDropDown
          title={
            <div className="flex w-[100%] justify-between">
              <div>
                {editedValues[path + '.' + 'selectedValue'] ||
                  newData.selectedValue ||
                  'Select Data Type'}
              </div>
              <div>
                <IoIosArrowDown
                  className="text-[#1C274C] dark:text-white"
                  size={'0.83vw'}
                />
              </div>
            </div>
          }
          key={path}
          selected={
            _.isEmpty(editedValues[path + '.' + 'selectedValue'])
              ? _.isEmpty(newData.selectedValue)
                ? ''
                : new Set([newData.selectedValue])
              : new Set([editedValues[path + '.' + 'selectedValue']])
          }
          selectionMode="single"
          items={
            newData.selectionList && newData.selectionList.length > 0
              ? newData.selectionList.map((item) => {
                  return {
                    label: item,
                    value: item,
                    key: item,
                  };
                })
              : []
          }
          setSelected={(e) => {
            setEditedValues((prev) => ({
              ...prev,
              [path + '.' + 'selectedValue']: Array.from(e)[0],
            }));
          }}
          classNames={{
            buttonClassName:
              'rounded border-none px-2 outline-none h-[5.07vh] w-[11vw] text-[0.72vw] font-medium text-[#1C274C]/50   bg-[#F4F5FA] dark:bg-[#0F0F0F] text-start dark:text-white',
            popoverClassName:
              'flex item-center justify-center w-[13.64vw] text-[0.72vw]',
            listBoxClassName:
              'overflow-y-auto bg-white border border-[#F2F4F7] dark:bg-[#0F0F0F] ',
            listBoxItemClassName: 'flex  justify-between text-md',
          }}
        />
      </div>
    );
  }

  if (
    newData &&
    Object.keys(newData).length > 0 &&
    newData.hasOwnProperty('type') &&
    newData?.type == 'multipleSelect'
  ) {
    return (
      <div>
        <TorusDropDown
          title={
            <span className="truncate">
              {(editedValues[path + '.' + 'selectedValue'] &&
                editedValues[path + '.' + 'selectedValue']) ||
                (newData.selectedValue && newData.selectedValue.join(', ')) ||
                'Select from the list'}
            </span>
          }
          key={path}
          selected={
            new Set(
              editedValues[path + '.' + 'selectedValue'] ??
                newData.selectedValue,
            )
          }
          selectionMode="multiple"
          items={
            newData.selectionList && newData.selectionList.length > 0
              ? newData.selectionList.map((item, index) => {
                  return {
                    label: item,
                    value: item,
                    key: item,
                  };
                })
              : []
          }
          setSelected={(e) => {
            functionality('update', path + '.' + 'selectedValue', {
              value: Array.from(e),
            });
          }}
          classNames={{
            buttonClassName:
              'rounded border-none px-2 outline-none h-[4.07vh] w-[13.64vw] truncate text-[0.72vw] font-medium text-[#1C274C]/50   bg-[#F4F5FA] dark:bg-[#0F0F0F] text-start dark:text-white',
            popoverClassName:
              'flex item-center justify-center w-[13.64vw] text-[0.72vw]',
            listBoxClassName:
              'overflow-y-auto bg-white border border-[#F2F4F7] dark:bg-[#0F0F0F] ',
            listBoxItemClassName: 'flex  justify-between text-md',
          }}
        />
      </div>
    );
  }

  if (
    newData &&
    Object.keys(newData).length > 0 &&
    !newData.hasOwnProperty('type')
  ) {
    return (
      <ul className="flex flex-col gap-2">
        {typeof newData === 'object' && !Array.isArray(newData) ? (
          <>
            {Object.keys(newData) &&
              Object.keys(newData).length > 0 &&
              Object.keys(newData)?.map((key) => {
                if (typeof newData[key] == 'object') {
                  return (
                    <li key={key} className="flex flex-row gap-2">
                      <label className="text-black dark:text-white">
                        {key}:
                      </label>
                      <Tableuidecider
                        key={key}
                        data={newData[key]}
                        path={path + '.' + key}
                      />
                    </li>
                  );
                }
                if (Array.isArray(newData[key])) {
                  return (
                    <li key={key} className="flex flex-row gap-2">
                      <Tableui
                        ArrayJson={newData[key]}
                        functionality={functionality}
                      />
                    </li>
                  );
                }
                return (
                  <div key={key}>
                    <CustomInput
                      keyJson={keyJson}
                      Objkey={key}
                      value={newData[key]}
                      path={path}
                    />
                  </div>
                );
              })}
          </>
        ) : (
          <li key={path} className="flex flex-row gap-2">
            <Tableui
              toogleFunctionality={false}
              ArrayJson={newData}
              functionality={functionality}
              path={path}
            />
          </li>
        )}
      </ul>
    );
  }

  if (
    newData &&
    Object.keys(newData).length > 0 &&
    newData.hasOwnProperty('type') &&
    newData?.type == 'checkbox'
  ) {
    return (
      <div
        key={path + '.' + 'value'}
        className=" flex w-[5vw] items-center justify-center gap-2"
      >
        <Input
          key={path + '.' + 'value'}
          type="checkbox"
          className="  h-[1.04vw] w-[1.04vw] rounded-lg border-slate-500 bg-[#0736C4] transition-all duration-100"
          defaultChecked={
            editedValues?.[path + '.' + 'value'] ?? newData?.value
          }
          onChange={(e) => {
            setEditedValues((prev) => ({
              ...prev,
              [path + '.' + 'value']: e.target.checked,
            }));
          }}
        />

        {newData.hasOwnProperty('label') && <label>{newData.label}</label>}
      </div>
    );
  }
}
