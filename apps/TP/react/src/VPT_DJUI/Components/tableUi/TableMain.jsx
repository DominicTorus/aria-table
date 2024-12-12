import React, { useEffect, useState } from 'react';
import { onJsonChange } from '../utils/utils';
import Tableui from './tableui';

export default function TableMain({
  mode,
  json,
  tableIName,
  tableIIName,
  updatedNodeConfig,
}) {
  const [tableI, setTableI] = useState([]);
  const [tableII, setTableII] = useState([]);
  const [tabopen, tabvisible] = useState(1);
  useEffect(() => {
    if (
      mode == 'dual' &&
      json &&
      json.hasOwnProperty(tableIIName) &&
      json.hasOwnProperty(tableIName)
    ) {
      setTableI(json[tableIName]);
      setTableII(json[tableIIName]);
    } else if (mode == 'single' && json && json.hasOwnProperty(tableIName)) {
      setTableI(json[tableIName]);
    }
  }, [tableIjson]);

  const onJsonUpdate1stTable = (func, path, obj) => {
    try {
      let newTable = onJsonChange(tableI, func, path, obj);
      if (newTable) {
        updatedNodeConfig({
          [tableIName]: jsons,
          [tableIIName]: tableII,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onJsonUpdate2ndTable = (func, path, obj) => {
    try {
      let newTable = onJsonChange(tableII, func, path, obj);
      if (newTable) {
        updatedNodeConfig({
          [tableIName]: tableI,
          [tableIIName]: newTable,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center 
          gap-4 overflow-y-hidden transition-all delay-100 "
    >
      <div
        className={
          '  items-between flex w-[60%] flex-row justify-around gap-[0px] rounded-md bg-transparent py-[2px] text-base xl:py-[3px] '
        }
      >
        <div
          onClick={() => tabvisible(1)}
          className={`xl:text-md flex cursor-pointer select-none flex-row items-center gap-2 rounded-md  px-[21px] py-[4px] text-center text-sm  capitalize text-slate-600 transition-all  dark:text-white xl:px-[25px] xl:py-[3px]  ${tabopen === 1 && `border border-slate-500/50 font-bold `}`}
        >
          <AiOutlineDatabase className="text-xl" />
          {tableIName}
        </div>
        <div
          onClick={() => tabvisible(2)}
          className={`xl:text-md flex cursor-pointer select-none flex-row items-center gap-1 rounded-md 
                px-[21px] py-[4px] text-center text-sm  
                 capitalize text-slate-600 transition-all dark:text-white 
                  xl:gap-2 xl:px-[28px] xl:py-[3px]
                  ${tabopen === 2 && `border border-slate-500/50  font-bold `} `}
        >
          <VscSymbolMethod className="text-xl" />
          {tableIIName}
        </div>
      </div>
      <div className=" h-[80%] w-full rounded-xl shadow-black/40">
        <div
          className={
            ' h-full w-full  ' +
            (tabopen === 1 ? ' flex items-center justify-center' : ' hidden')
          }
        >
          <Tableui
            ArrayJson={tableI}
            functionality={onJsonUpdate1stTable}
            path={''}
            key={Math.random()}
          />
        </div>
        <div
          className={
            ' h-full w-full  ' +
            (tabopen === 2 ? ' flex items-center justify-center' : ' hidden')
          }
        >
          {tableII.length > 0 ? (
            <Tableui
              key={Math.random()}
              functionality={onJsonUpdate2ndTable}
              path={''}
              ArrayJson={tableII}
            />
          ) : (
            <p className="text-center text-2xl text-white">
              column found for this node
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
