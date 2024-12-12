import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TorusModellerContext } from '../../Layout';
import {
  CodeIcon,
  EventsIcon,
  NavbarArrowDown,
  RuleIcon,
} from '../../SVG_Application';
import { handlNestedObj } from '../../utils/utils';
import { LogicCenterContext } from './LogicCenter';

const LogicTargetAccordian = ({
  data,
  selectedLogic,
  handleTargetClick,
  selectedActionName,
  activeArtifact,
  setActiveArtifact,
}) => {
  useEffect(() => {
    if (selectedActionName === null) {
      handleTargetClick([data?.artifact?.name]);
      setActiveArtifact(!activeArtifact);
    }
  }, [selectedActionName]);

  const { selectedTheme } = useContext(TorusModellerContext);
  console.log(data, 'data');

  return (
    <div className="  flex h-full w-full flex-col gap-[0.55vw] overflow-scroll text-ellipsis  ">
      <div
        onClick={() => {
          setActiveArtifact(!activeArtifact);
          handleTargetClick([data?.artifact?.name]);
        }}
        className={` flex h-[2.25vh]  w-[100%] cursor-pointer items-center  justify-between gap-[0.30vw] px-[0.25vw] `}
      >
        <div className="w-[20%]">
          <NavbarArrowDown
            stroke={selectedTheme && selectedTheme?.['textOpacity/50']}
            className={` h-[0.83vw] w-[0.83vw] transition-all ease-in ${activeArtifact ? '' : 'rotate-[-90deg]'}`}
          />
        </div>
        <div className="flex w-[80%] justify-between">
          <span
            className={` w-[50%] truncate text-[0.72vw]  font-medium capitalize leading-[2.22vh]`}
            style={{
              color: `${
                selectedActionName &&
                selectedActionName.length === 1 &&
                selectedActionName[0] === data?.artifact?.name
                  ? `${selectedTheme?.text}50`
                  : `${selectedTheme?.text}90`
              }`,
            }}
          >
            {selectedLogic?.artifact}
          </span>
          <div className="w-[50%] pl-[0.25vw]">
            <div className="flex w-[100%] items-center justify-start pl-[0.45vw] ">
              <HasEventsCodeRule
                searchKeys={['name']}
                searchValues={[data?.artifact?.name]}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={` ${activeArtifact ? 'flex' : 'hidden'} ml-[0.58vw] mr-[0.55vw] flex-col gap-[0.55vw] border-l  transition-all`}
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        {data?.artifact?.node && data?.artifact?.node?.length > 0 && (
          <>
            {data?.artifact?.node.map((item) => (
              <DisplayAccordianNode
                key={item?.nodeId}
                item={item}
                id={data?.artifact?.name}
                handleTargetClick={handleTargetClick}
                selectedActionName={selectedActionName}
                selectedTheme={selectedTheme}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const DisplayAccordianNode = ({
  item,
  id,
  handleTargetClick,
  selectedActionName,
  selectedTheme,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      selectedActionName &&
      selectedActionName.length > 2 &&
      selectedActionName[0] === id &&
      selectedActionName[2] === item?.nodeId
    ) {
      setOpen(true);
    }
  }, [selectedActionName]);

  console.log(item, 'nodeonbj');

  return (
    <div
      key={item?.nodeId}
      className={`${item?.objElements?.length > 0 ? 'ml-[0.85vw]' : 'ml-[2.52vw]'}  max-h-[100%] rounded-sm`}
    >
      <div
        className={`flex h-[2.25vh] w-[100%] cursor-pointer items-center  `}
        onClick={() => {
          if (item?.objElements?.length > 0) {
            setOpen(!open);
          }
          handleTargetClick([id, item?.nodeId]);
        }}
      >
        {item.objElements && item.objElements?.length > 0 && (
          <div className="w-[20%]">
            <NavbarArrowDown
              stroke={selectedTheme && selectedTheme?.['textOpacity/50']}
              className={` w-[0.83vw]  transition-all ease-in  ${open ? '' : 'rotate-[-90deg]'}`}
            />
          </div>
        )}

        <div
          className={`${item.objElements?.length > 0 ? 'w-[80%] justify-between' : ' w-[100%] '}`}
        >
          <div className="flex w-[100%] items-center justify-between">
            <span
              title={item?.nodeName}
              className={` w-[50%] truncate text-[0.72vw]  font-medium capitalize leading-[2.22vh] 
               `}
              style={{
                color: `${
                  selectedActionName &&
                  selectedActionName.length === 2 &&
                  selectedActionName[1] === item?.nodeId
                    ? `${selectedTheme?.text}90`
                    : `${selectedTheme?.text}60`
                }`,
              }}
            >
              {item?.nodeName}
            </span>

            <div className="w-[50%] ">
              <div className="flex w-[100%] items-center justify-start pl-[0.45vw] ">
                <HasEventsCodeRule
                  searchKeys={['name', 'nodeId']}
                  searchValues={[id, item?.nodeId]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {item.objElements?.length > 0 && (
        <div
          className={`  ${open ? 'flex' : 'hidden'} ml-[0.35vw]  mt-[1.55vh] max-h-[30vh] flex-col  gap-[1.55vh] overflow-y-scroll border-l scrollbar-hide `}
          style={{
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          {item.objElements && (
            <>
              {item?.objElements.map((child, childIndex) => (
                <DisplayAccordianObjElement
                  handleTargetClick={handleTargetClick}
                  item={child}
                  id={[id, item?.nodeId]}
                  key={child?.elementId}
                  selectedActionName={selectedActionName}
                  selectedTheme={selectedTheme}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
const DisplayAccordianObjElement = ({
  item,
  id,
  handleTargetClick,
  selectedActionName,
  selectedTheme,
}) => {
  return (
    <div
      key={item?.elementId}
      onClick={() => {
        handleTargetClick([...id, item.elementId]);
      }}
      className={`flex h-[2.25vh]  w-full cursor-pointer items-center justify-between gap-[0.30vw] pl-[1.25vw]  text-[0.72vw] font-medium  leading-[2.22vh]  transition-all duration-100   fade-in-15  fade-out-15 
          `}
    >
      <span
        title={item?.elementName}
        className="w-[70%] truncate"
        style={{
          color: `${
            selectedActionName &&
            selectedActionName.length === 3 &&
            selectedActionName[2] === item?.elementId
              ? `${selectedTheme?.text}90`
              : `${selectedTheme?.text}60`
          }`,
        }}
      >
        {item?.elementName}
      </span>

      <HasEventsCodeRule
        searchKeys={['name', 'nodeId', 'elementId']}
        searchValues={[...id, item.elementId]}
      />
    </div>
  );
};

const HasEventsCodeRule = ({ searchKeys, searchValues }) => {
  const { mappedData, subFlow } = useContext(LogicCenterContext);
  const { selectedTheme } = useContext(TorusModellerContext);

  const checkEventsCodeRule = useCallback(
    (id) => {
      let check = handlNestedObj(
        'get',
        'events',
        id,
        searchKeys,
        searchValues,
        mappedData,
      );
      console.log(check, 'check');

      if (check) {
        if (typeof check === 'object') {
          if (Object.keys(check).length > 0) {
            if (subFlow === 'PO' || subFlow === 'DO' || subFlow === 'UO') {
              const valueChecks = Object.values(check).some((item) => {
                return Object.values(item).some((value) => {
                  return Object.values(value).some((value) => {
                    return value !== '';
                  });
                });
              });
              if (valueChecks) {
                return `${selectedTheme?.text}`;
              } else {
                return `${selectedTheme?.text}70`;
              }
            }
          } else {
            return `${selectedTheme?.text}70`;
          }
        }
        return `${selectedTheme?.text}`;
      }
      return `${selectedTheme?.text}70`;
    },
    [mappedData, searchKeys, searchValues],
  );

  return (
    <div className="flex items-center justify-between gap-[0.35vw]">
      <EventsIcon size={'0.80vw'} color={() => checkEventsCodeRule('events')} />
      <RuleIcon size={'0.75vw'} color={() => checkEventsCodeRule('rule')} />
      <CodeIcon size={'0.72vw'} color={() => checkEventsCodeRule('code')} />
    </div>
  );
};

export default LogicTargetAccordian;
