import React, { useContext, useEffect, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';

const Treearr = ({ data, parentdata }) => {
  const { darkMode } = useContext(DarkmodeContext);
  const [getparent, setGetParent] = useState({});
  const [filteredObj, setFilteredObj] = useState({});

  useEffect(() => {
    setGetParent(parentdata);
  }, [parentdata]);

  useEffect(() => {
    const newFilteredObj = {};
    for (const key in getparent) {
      if (key.endsWith('GrpName')) {
        newFilteredObj['name'] = getparent[key];
      }
      if (key === 'id') {
        newFilteredObj[key] = getparent[key];
      }
    }

    setFilteredObj(newFilteredObj);
  }, [getparent]);

  const onDragStart = (event, nodeName, nodeType, parentnode, item) => {
    if (nodeType.includes('org')) {
      event.dataTransfer.setData(
        'application/groupName',
        JSON.stringify({
          nodeType: nodeType,
          nodeName: nodeName,
          code: item?.orgCode,
        }),
      );

      event.dataTransfer.setData(
        'application/childparent',
        JSON.stringify(parentnode),
      );

      event.dataTransfer.effectAllowed = 'move';
    }

    if (nodeType.includes('role')) {
      event.dataTransfer.setData(
        'application/roleName',
        JSON.stringify({
          nodeType: nodeType,
          nodeName: nodeName,
          code: item?.roleCode,
        }),
      );
      event.dataTransfer.setData(
        'application/childparent',
        JSON.stringify(parentnode),
      );

      event.dataTransfer.effectAllowed = 'move';
    }
    if (nodeType.includes('ps')) {
      event.dataTransfer.setData(
        'application/psName',
        JSON.stringify({
          nodeType: nodeType,
          nodeName: nodeName,
          code: item?.psCode,
        }),
      );
      event.dataTransfer.setData(
        'application/childparent',
        JSON.stringify(parentnode),
      );

      event.dataTransfer.effectAllowed = 'move';
    }
  };

  return (
    <div>
      {data &&
        data.length > 0 &&
        data.map((item, index) => (
          <div
            key={index}
            className={` mb-2 cursor-grab rounded-md bg-[#F4F5FA] p-2 hover:bg-white dark:bg-[#161616]  `}
          >
            {Object.entries(item) &&
              Object.entries(item).length > 0 &&
              Object.entries(item).map(([key, value]) => (
                <div key={key} className="text-white">
                  {key.includes('Code') ? (
                    <div className="flex  w-full items-center justify-center gap-1">
                      <div
                        className={`flex w-full select-none items-center justify-start pl-[5%] text-[0.73vw] font-medium text-black dark:text-white  `}
                      >
                        {value}
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full gap-1">
                      <div
                        className="flex  w-full items-center justify-center gap-3 hover:cursor-grab"
                        onDragStart={(event) =>
                          onDragStart(event, value, key, filteredObj, item)
                        }
                        draggable
                      >
                        <div
                          className={`flex w-full select-none items-center  justify-start pl-[5%] text-[0.52vw] text-black/50 dark:text-white `}
                        >
                          {value}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

const TreeObj = ({ obj }) => {
  const { darkMode } = useContext(DarkmodeContext);
  const [expanded, setExpanded] = useState(false);
  const [getparent, setGetParent] = useState({});
  const [filteredObj, setFilteredObj] = useState({});

  useEffect(() => {
    setGetParent(obj);
  }, [obj]);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const newFilteredObj = {};
    for (const key in getparent) {
      if (key.endsWith('GrpName')) {
        newFilteredObj[key] = getparent[key];
      }
      if (key === 'id') {
        newFilteredObj[key] = getparent[key];
      }
    }

    setFilteredObj(newFilteredObj);
  }, [getparent]);

  const onDragStart = (event, nodeName, nodeType, parentnode) => {
    if (nodeType.includes('org')) {
      event.dataTransfer.setData(
        'application/orgGroup',
        JSON.stringify({
          nodeType: nodeType,
          nodeName: nodeName,
          childNodes: obj.org,
          type: 'orgGrp',
          label: 'orgName',
          code: 'orgCode',
          obj: obj.orgGrpCode,
          childType: 'org',
          parentId: obj.id,
        }),
      );

      event.dataTransfer.setData(
        'application/parentNode',
        JSON.stringify(parentnode),
      );

      event.dataTransfer.effectAllowed = 'move';
    }

    if (nodeType.includes('role')) {
      event.dataTransfer.setData(
        'application/roleGroup',
        JSON.stringify({
          nodeType: nodeType,
          nodeName: nodeName,
          childNodes: obj.roles,
          type: 'roleGrp',
          obj: obj.roleGrpCode,
          label: 'roleName',
          code: 'roleCode',
          childType: 'roles',
          parentId: obj.id,
        }),
      );
      event.dataTransfer.setData(
        'application/parentNode',
        JSON.stringify(parentnode),
      );
      event.dataTransfer.effectAllowed = 'move';
    }
    if (nodeType.includes('psGrp')) {
      event.dataTransfer.setData(
        'application/psGroup',
        JSON.stringify({
          nodeType: nodeType,
          nodeName: nodeName,
          childNodes: obj.ps,
          type: 'psGrp',
          label: 'psName',
          code: 'psCode',
          obj: obj.psGrpCode,
          childType: 'ps',
          parentId: obj.id,
        }),
      );
      event.dataTransfer.setData(
        'application/parentNode',
        JSON.stringify(parentnode),
      );
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  return (
    <div
      className={`mb-2 w-full rounded-md bg-[#F4F5FA] p-1 text-black dark:bg-[#0F0F0F]  dark:text-white`}
    >
      {obj &&
        Object.keys(obj) &&
        Object.keys(obj).length > 0 &&
        Object.keys(obj).map((key) => {
          if (
            typeof obj[key] == 'object' &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            return <>{TreeObj(obj[key])}</>;
          }
          if (typeof obj[key] == 'string') {
            return (
              <div className="flex items-center justify-center">
                {key.includes('Code') ? (
                  <>
                    <div
                      className={`flex w-full select-none items-center justify-start gap-2 pl-[21%] text-[0.52vw] text-black/50 dark:text-white `}
                    >
                      {obj[key]}
                    </div>
                  </>
                ) : key.includes('Name') ? (
                  <div className="flex w-full items-center justify-center  ">
                    <div
                      className="flex   w-[95%] items-center justify-start gap-2 hover:cursor-grab"
                      onDragStart={(event) =>
                        onDragStart(event, obj[key], key, filteredObj)
                      }
                      draggable
                    >
                      <span className="flex h-[1.25vw] w-[1.25vw] select-none items-center justify-center rounded bg-[#0736C4]/15  text-[#0736C4] ">
                        <FaRegUser size={8} />
                      </span>
                      <div
                        className={`flex w-[45%] select-none  items-center justify-start gap-2 text-[0.72vw] font-medium text-black dark:text-white`}
                      >
                        {obj[key]}
                      </div>
                    </div>
                    <div
                      className="flex h-[30px] w-[30px] cursor-pointer select-none items-center justify-end  bg-transparent p-0"
                      onClick={toggleExpansion}
                    >
                      <IoIosArrowDown
                        size={12}
                        className={`text-black transition-all  duration-200  dark:text-white ${expanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            );
          }

          if (Array.isArray(obj[key]) && expanded) {
            return (
              <div className="mb-2 mt-2">
                <Treearr data={obj[key]} parentdata={obj} />
              </div>
            );
          }
          return null;
        })}
    </div>
  );
};

const TreeView = ({ data }) => {
  console.log(data, 'sff');
  return (
    <div className=" overflow-y-scroll ">
      {data &&
        data.length > 0 &&
        data.map((item, index) => {
          if (typeof item === 'object' && item !== null) {
            return (
              <React.Fragment key={index}>
                <TreeObj obj={item} />
              </React.Fragment>
            );
          }
          return null;
        })}
    </div>
  );
};

export default TreeView;
