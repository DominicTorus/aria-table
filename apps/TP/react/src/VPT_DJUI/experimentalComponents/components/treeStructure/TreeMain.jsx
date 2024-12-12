/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import TabMain from '../tabStructure/TabMain';

const TreeElements = ({ data, path, id, setSelectedpath }) => {
  const [jsondata, setJsondata] = useState(null);
  const [showChild, setShowChild] = useState(false);
  const [hasObj, setHasObj] = useState(false);
  const handleClick = () => {
    setSelectedpath((prev) => {
      const unique = prev && prev.map((item) => item.path);
      if (!unique.includes(path)) {
        return [...prev, { path: path, title: id }];
      } else {
        return prev;
      }
    });
  };
  useEffect(() => {
    const jsClone = structuredClone(data);
    if (jsClone) {
      Object.keys(jsClone) &&
        Object.keys(jsClone).length > 0 &&
        Object.keys(jsClone).forEach((key) => {
          if (typeof jsClone[key] === 'object' && !hasObj) {
            setHasObj(true);
          }
        });
    }
    setJsondata(jsClone);
  }, [data, hasObj]);
  return (
    <div className={`ml-2`}>
      {jsondata && (
        <div
          className={`border-l border-opacity-0 transition-all duration-75 ease-in ${showChild && 'border-opacity-100'}   border-slate-400   hover:border-opacity-100`}
        >
          <div className="flex cursor-pointer items-center hover:bg-gray-300/40">
            <span
              className=" transition-all-ease-in flex 
              items-center justify-center rounded-2xl p-2  duration-500 "
              role="button"
              style={{
                border: 'none',
              }}
              onClick={() => setShowChild(!showChild)}
            >
              {hasObj && (
                <>
                  {showChild ? (
                    <IoIosArrowDown color="#90A4AE" />
                  ) : (
                    <IoIosArrowForward color="#90A4AE" />
                  )}
                </>
              )}
            </span>
            <span onClick={handleClick} className="text-[#636c70] ">
              {id}
            </span>
          </div>

          {Object.keys(jsondata) &&
            Object.keys(jsondata).length > 0 &&
            Object.keys(jsondata).map((key) => {
              if (typeof jsondata[key] === 'object' && showChild) {
                return (
                  <TreeElements
                    key={path + '.' + key}
                    data={jsondata[key]}
                    path={path + '.' + key}
                    id={key}
                    setSelectedpath={setSelectedpath}
                  />
                );
              }
              return null;
            })}
        </div>
      )}
    </div>
  );
};

export default function TreeMain({ data, setjson, path }) {
  const [jsondata, setJsondata] = useState(null);
  const [selectedpath, setSelectedpath] = useState([]);
  const [showChild, setShowChild] = useState(true);

  useEffect(() => {
    const jsClone = structuredClone(data);
    setJsondata(jsClone);
  }, [data]);
  return (
    <>
      {jsondata && (
        <div className="flex h-full w-full gap-1 p-2">
          <div className="h-full w-[25%] overflow-scroll border-2 border-slate-300 p-1">
            {showChild &&
              Object.keys(jsondata) &&
              Object.keys(jsondata).length > 0 &&
              Object.keys(jsondata).map((key) => {
                if (typeof jsondata[key] === 'object') {
                  return (
                    <div>
                      <TreeElements
                        key={path + '.' + key}
                        data={jsondata[key]}
                        path={path + '.' + key}
                        id={key}
                        setSelectedpath={setSelectedpath}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>

          <div className="h-full w-[75%] border-2 border-slate-300 p-2">
            <TabMain
              data={jsondata}
              setjson={setjson}
              path={path}
              setSelectedpath={setSelectedpath}
              selectedpath={selectedpath}
            />
          </div>
        </div>
      )}
    </>
  );
}
