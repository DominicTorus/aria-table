import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { TorusModellerContext } from '../../Layout';
import { NavbarArrowDown } from '../../SVG_Application';
import TorusModularInput from '../../torusComponents/TorusModularInput';
import { LogicCenterContext } from './LogicCenter';

const DisplayAccordianNode = ({
  path,
  item,
  id,
  handleTargetClick,
  selectedActionName,
  eventsData,
  setEventsData,
  mappedThing,
  selectedProcess,
  contentRef,
  mappedData,
  setMappedData,
  data,
  isOpen,
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  console.log(item, data, mappedData, 'nodeonbj');

  return (
    <div
      key={item?.path ?? item?.nodeId}
      className={` ml-[0.85vw] flex max-h-[100%] w-[100%] rounded-sm`}
    >
      <div className="">
        <div className=" ">
          <DisplayNodething
            path={path}
            eventsData={eventsData}
            setEventsData={setEventsData}
            mappedThing={mappedThing}
            selectedProcess={selectedProcess}
            contentRef={contentRef}
            mappedData={mappedData}
            setMappedData={setMappedData}
            selectedNode={selectedNode}
            displayNode={item}
          />
        </div>
      </div>
    </div>
  );
};
const DisplayAccordianObjElement = ({
  path,
  item,
  id,
  handleTargetClick,
  selectedActionName,
  eventsData,
  setEventsData,
  mappedThing,
  selectedProcess,
  contentRef,
  mappedData,
  setMappedData,
  data,
}) => {
  console.log('<<--item-->>', item, id, mappedData, mappedThing);

  return (
    <>
      <div className=" ml-[-1.25vw] w-[100%]">
        <DisplayNodething
          path={path}
          mappedThing={mappedThing}
          selectedProcess={selectedProcess}
          contentRef={contentRef}
          mappedData={mappedData}
          setMappedData={setMappedData}
        />
      </div>
    </>
  );
};

const DisplayNodething = ({
  path,
  contentRef,
  mappedThing,
  selectedProcess,
}) => {
  const { mappedData, setMappedData } = useContext(LogicCenterContext);
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  console.log('selectedProcess', selectedProcess, path);
  const handleInputChange = (path, value) => {
    setMappedData((prevData) => {
      _.set(prevData, path, value);
      return prevData;
    });
  };

  return (
    <div className="" ref={contentRef}>
      <div
        className="grid w-[100%] grid-cols-12 gap-[0.55vw] border-b-1 pb-[0.95vw] pl-[1.25vw]"
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        <div className={`col-span-12 grid grid-cols-12 gap-[0.55vw]  `}>
          <div className="col-span-4 flex flex-col items-center justify-start">
            <span
              className="w-[100%] text-start text-[0.72vw] font-bold "
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              Source
            </span>
            <span
              className="w-[100%] text-start text-[0.72vw] font-medium"
              style={{
                color: `${selectedTheme?.text}70`,
              }}
            >
              Data Source Type
            </span>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center">
            <TorusModularInput
              isRequired={true}
              type="text"
              placeholder={'Enter here'}
              bgColor={`${selectedTheme?.bgCard}`}
              textColor={`text-[${selectedTheme?.text}]`}
              outlineColor="#cbd5e1"
              labelSize={'text-[0.62vw] pl-[0.25vw]'}
              radius="sm"
              size=""
              isReadOnly={false}
              isDisabled={false}
              errorShown={false}
              isClearable={true}
              backgroundColor={'bg-gray-300/25 dark:bg-[#0F0F0F]'}
              value={_.get(mappedData, path + '.events.sourceQueue')}
              onChange={(e) => {
                handleInputChange(path + '.events.sourceQueue', e);
              }}
              textSize={'text-[0.83vw]'}
              inputClassName={'px-[0.25vw] py-[0.55vh]'}
              wrapperClass={'px-[0.25vw] py-[0.55vh]'}
            />
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center">
            <TorusModularInput
              isRequired={true}
              type="text"
              placeholder={'Enter here'}
              bgColor={`${selectedTheme?.bgCard}`}
              textColor={`text-[${selectedTheme?.text}]`}
              labelColor="text-black dark:text-white/35 "
              outlineColor="#cbd5e1"
              labelSize={'text-[0.62vw] pl-[0.25vw]'}
              radius="sm"
              size=""
              isReadOnly={false}
              isDisabled={false}
              errorShown={false}
              isClearable={true}
              backgroundColor={'bg-gray-300/25 dark:bg-[#0F0F0F]'}
              value={_.get(mappedData, path + '.events.sourceStatus')}
              onChange={(e) => {
                handleInputChange(path + '.events.sourceStatus', e);
              }}
              textSize={'text-[0.83vw]'}
              inputClassName={'px-[0.25vw] py-[0.55vh]'}
              wrapperClass={'px-[0.25vw] py-[0.55vh]'}
            />
          </div>
        </div>
      </div>

      <div
        key={path + selectedProcess}
        className="mt-[0.95vw] flex flex-col gap-[0.95vw] border-b pb-[0.95vw] pl-[1.25vw] pr-[1.25vw]"
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        {mappedThing?.map((item, index) => (
          <div className="grid w-[100%] grid-cols-12 gap-[0.55vw]" key={index}>
            <div
              className={`col-span-12 grid grid-cols-12 gap-[0.55vw] ${index === mappedThing.length - 1 ? 'pb-0' : ''}`}
            >
              <div className="col-span-4 flex flex-col items-center justify-start">
                <span
                  className="w-[100%] text-start text-[0.72vw] font-bold "
                  style={{
                    color: `${selectedTheme?.text}`,
                  }}
                >
                  {item}
                </span>
                <span className="w-[100%] text-start text-[0.72vw] font-medium text-[#AFAFAF] dark:text-white/35">
                  {item === 'success'
                    ? 'Operation Success'
                    : item === 'failure'
                      ? 'Operation Failure'
                      : 'Risk Assessment'}
                </span>
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <TorusModularInput
                  value={_.get(
                    mappedData,
                    path +
                      '.events.' +
                      selectedProcess +
                      '.' +
                      item +
                      '.targetQueue',
                  )}
                  isRequired={true}
                  type="text"
                  placeholder="Enter here"
                  labelSize="text-[0.62vw] pl-[0.25vw]"
                  bgColor={`${selectedTheme?.bgCard}`}
                  textColor={`text-[${selectedTheme?.text}]`}
                  labelColor="text-black dark:text-white/35"
                  outlineColor="#cbd5e1"
                  radius="sm"
                  size=""
                  isReadOnly={false}
                  isDisabled={false}
                  errorShown={false}
                  isClearable={true}
                  backgroundColor="bg-gray-300/25 dark:bg-[#0F0F0F]"
                  onChange={(e) => {
                    handleInputChange(
                      path +
                        '.events.' +
                        selectedProcess +
                        '.' +
                        item +
                        '.targetQueue',
                      e,
                    );
                  }}
                  textSize="text-[0.83vw]"
                  inputClassName="px-[0.25vw] py-[0.55vh]"
                  wrapperClass="px-[0.25vw] py-[0.55vh]"
                />
              </div>

              <div className="col-span-2 flex flex-col items-center justify-center">
                <TorusModularInput
                  value={_.get(
                    mappedData,
                    path +
                      '.events.' +
                      selectedProcess +
                      '.' +
                      item +
                      '.targetStatus',
                  )}
                  isRequired={true}
                  type="text"
                  placeholder="Enter here"
                  bgColor={`${selectedTheme?.bgCard}`}
                  textColor={`text-[${selectedTheme?.text}]`}
                  labelColor="text-black dark:text-white/35"
                  outlineColor="#cbd5e1"
                  labelSize="text-[0.62vw] pl-[0.25vw]"
                  radius="sm"
                  size=""
                  isReadOnly={false}
                  isDisabled={false}
                  errorShown={false}
                  isClearable={true}
                  backgroundColor="bg-gray-300/25 dark:bg-[#0F0F0F]"
                  onChange={(e) => {
                    handleInputChange(
                      path +
                        '.events.' +
                        selectedProcess +
                        '.' +
                        item +
                        '.targetStatus',
                      e,
                    );
                  }}
                  textSize="text-[0.83vw]"
                  inputClassName="px-[0.25vw] py-[0.55vh]"
                  wrapperClass="px-[0.25vw] py-[0.55vh]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsTargetAccordion = ({
  mappedThing,
  selectedProcess,
  contentRef,
}) => {
  const { mappedData, setMappedData } = useContext(LogicCenterContext);

  return (
    <div className="flex p-3">
      <div className="w-full">
        <ArtifactAccordion
          path="artifact"
          artifact={mappedData.artifact}
          mappedThing={mappedThing}
          selectedProcess={selectedProcess}
          setMappedData={setMappedData}
          mappedData={mappedData}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
};

const ArtifactAccordion = ({
  path,
  artifact,
  mappedThing,
  selectedProcess,
  setMappedData,
  mappedData,
  contentRef,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const { selectedTheme } = useContext(TorusModellerContext);

  return (
    <div className="mt-4">
      <div
        className={`flex items-start ${isOpen ? 'border-l' : ''} `}
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="text-md flex w-[10%] text-left font-semibold">
          <div
            className="ml-[-0.45vw] w-[20%] "
            style={{
              backgroundColor: `${selectedTheme?.bg}`,
            }}
          >
            <NavbarArrowDown
              stroke={`${selectedTheme?.text}`}
              className={` h-[0.83vw] w-[0.83vw] transition-all ease-in ${isOpen ? '' : 'rotate-[-90deg]'}`}
            />
          </div>

          <span
            className=" w-[50%] truncate pl-[0.25vw]  text-[0.72vw] font-medium capitalize 
                leading-[2.22vh]"
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {artifact.name}
          </span>
        </button>
        <div className="ml-[0.95vw]">
          <DisplayNodething
            path={path}
            mappedThing={mappedThing}
            selectedProcess={selectedProcess}
            contentRef={contentRef}
            mappedData={mappedData}
            setMappedData={setMappedData}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className="border-l pl-3 pt-1"
          style={{
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          <div className="">
            {artifact.node.map((node, index) => (
              <NodeAccordion
                searchValues={[artifact.name, node.nodeId]}
                key={node.nodeId}
                selectedProcess={selectedProcess}
                path={path + '.node.' + index}
                node={node}
                mappedThing={mappedThing}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NodeAccordion = ({
  node,
  mappedThing,
  path,
  selectedProcess,
  searchValues,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { selectedTheme } = useContext(TorusModellerContext);

  return (
    <div className=" border-[#E2E8F0] pt-2">
      <div
        className={`bottom0 flex items-start ${isOpen ? `${node.objElements && node.objElements.length > 0 ? 'border-l' : ''}` : ''} `}
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        <button
          className="flex w-[10%] text-left text-xl font-semibold"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className={` ${node.objElements && node.objElements.length > 0 ? '' : 'invisible'} ml-[-0.45vw] w-[20%]`}
            style={{
              backgroundColor: `${selectedTheme?.bg}`,
            }}
          >
            <NavbarArrowDown
              stroke={`${selectedTheme?.text}`}
              className={` h-[0.83vw] w-[0.83vw] transition-all ease-in ${isOpen ? '' : 'rotate-[-90deg]'}`}
            />
          </div>

          <span
            className=" w-[50%] truncate pl-[0.25vw]  text-[0.72vw] font-medium capitalize 
                leading-[2.22vh]"
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {node.nodeName}
          </span>
        </button>
        <div className="ml-[-1vw]">
          <DisplayAccordianNode
            path={path}
            selectedProcess={selectedProcess}
            item={node}
            id={node.nodeId}
            mappedData={node}
            mappedThing={mappedThing}
            isOpen={isOpen}
          />
        </div>
      </div>

      {isOpen && node?.objElements && (
        <div
          className="border-l pl-1 pt-2 "
          style={{
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          <div className="mt-2">
            {node.objElements.map((obj, index) => (
              <ObjElementAccordion
                selectedProcess={selectedProcess}
                path={path + '.objElements.' + index}
                key={obj.elementId}
                obj={obj}
                mappedThing={mappedThing}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ObjElementAccordion = ({ obj, mappedThing, path, selectedProcess }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { selectedTheme } = useContext(TorusModellerContext);

  return (
    <div className="ml-[0.15vw] pt-4 ">
      <div className="flex items-start">
        <button
          className="flex w-[10%] truncate text-left text-lg font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className=" w-[70%] truncate pl-[0.25vw]  text-[0.72vw] font-medium capitalize 
                leading-[2.22vh]  "
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {obj.elementName}
          </span>
        </button>

        <>
          <DisplayAccordianObjElement
            selectedProcess={selectedProcess}
            path={path}
            item={obj}
            id={obj.elementId}
            mappedThing={mappedThing}
          />
        </>
      </div>
    </div>
  );
};

export default EventsTargetAccordion;
