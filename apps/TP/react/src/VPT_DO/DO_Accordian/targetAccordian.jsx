/* eslint-disable */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from 'reactflow';
import { TorusModellerContext } from '../../Layout';
import { NavbarArrowDown } from '../../SVG_Application';
import TorusButton from '../../torusComponents/TorusButton';
import TorusModularInput from '../../torusComponents/TorusModularInput';
import TorusSearch from '../../torusComponents/TorusSearch';
import { OrchestratorContext } from '../App';
import TargetObject from './TargetObject';
const positionStyles = {
  [Position.Left]: {
    left: '-16px',
    top: '51%',
    transform: 'translateY(-50%)',
  },
  [Position.Right]: {
    right: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  [Position.Top]: {
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  [Position.Bottom]: {
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
};

const TargetAccordionMenu = ({ id, data }) => {
  const [search, setSearch] = useState('');
  const updateNodeInternals = useUpdateNodeInternals();
  const { edges } = useContext(OrchestratorContext);
  const [activeIndices, setActiveIndices] = useState({});
  const { securityTarget } = useContext(OrchestratorContext);
  const { selectedSubFlow, selectedTheme } = useContext(TorusModellerContext);
  useEffect(() => {
    try {
      updateNodeInternals(id);
    } catch (error) {
      console.log(error);
    }
  }, [activeIndices, id, data]);

  const toggleAccordion = (index) => {
    try {
      setActiveIndices((prevActiveIndices) => {
        const newActiveIndices = { ...prevActiveIndices };
        if (newActiveIndices[index]) {
          delete newActiveIndices[index];
        } else {
          newActiveIndices[index] = true;
        }
        return newActiveIndices;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const datas = useMemo(() => {
    try {
      if (selectedSubFlow === 'PO') {
        if (!search) return data;
        return data.filter((item) => {
          return item.nodeName.toLowerCase().includes(search.toLowerCase());
        });
      }

      if (selectedSubFlow === 'DO') {
        if (!search) return data;
        if (data?.length > 0)
          return data.filter((item) => {
            return item?.label.toLowerCase().includes(search.toLowerCase());
          });
        return data;
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }, [data, search, selectedSubFlow]);

  const color = useCallback(
    (key) => {
      try {
        let indexs = edges.findIndex((edge) => edge.targetHandle === key);
        if (indexs > -1) {
          return '#0736C4';
        }

        return '#ccc';
      } catch (error) {
        console.log(error);
      }
    },
    [edges],
  );

  return (
    <div
      className="flex h-full w-[20vw] flex-col space-y-[0.20vw] overflow-scroll rounded-lg border py-[0.5vw] "
      style={{
        backgroundColor: `${selectedTheme?.bg}`,
        borderColor: `${selectedTheme?.border}`,
      }}
    >
      <div className="px-[0.5vw] pb-[0.30vw]">
        <TorusSearch
          height="md"
          placeholder="Search"
          radius="sm"
          textStyle={`text-[${selectedTheme?.text}]  text-[0.83vw] font-normal leading-[2.22vh] tracking-normal pl-[0.5vw]`}
          borderColor={`${selectedTheme?.bgCard}`}
          bgColor={`${selectedTheme?.bgCard}`}
          strokeColor={`${selectedTheme?.['textOpacity/50']}`}
          placeholderStyle={
            'placeholder:text-[#1C274C] dark:placeholder:text-[#FFFFFF]/35 text-start  placeholder-opacity-75 placeholder:text-[0.72vw]  dark:placeholder-[#3f3f3f]'
          }
          onChange={(e) => {
            setSearch(e);
          }}
        />
      </div>
      {selectedSubFlow === 'DO' ? (
        <>
          <div className="relative flex items-center justify-start px-[0.5vw] py-[1.25vh]">
            <span
              className="px-[0.5vw] text-start text-[0.72vw] font-medium capitalize italic leading-[1.5vh]"
              style={{
                color: `${selectedTheme?.text}70`,
              }}
            >
              Connect here to Create a new DataSet
            </span>
            <Handle
              isConnectable={true}
              id={'createNewDataSet'}
              position={Position.Left}
              type="target"
              style={{
                left: '0.2vw',
                width: '0.5vw',
                height: '0.5vw',
                // backgroundColor: color(id + '.' + item?.nodeName),
                // borderTopLeftRadius: "2px",
                // borderBottomLeftRadius: "2px",
              }}
            />
          </div>

          {datas && datas.length > 0 && (
            <div className='flex flex-col gap-[1vh]'>
              {datas.map((item, index) => (
                <DisplayDoDataSet key={item?.path} nodeId={id} item={item} />
              ))}
              {console.log(datas, 'datas')}
            </div>
          )}
        </>
      ) : (
        <>
          {datas && datas.length > 0 ? (
            datas.map(
              (item, index) =>
                item && (
                  <div className="mt-0 flex flex-col rounded-bl-md rounded-br-md px-[.5vw] py-[.3vw]">
                    <div
                      key={item?.nodeId}
                      className={`max-h-[60%]  rounded-md`}
                      style={{
                        backgroundColor: `${selectedTheme?.bgCard}`,
                      }}
                    >
                      <div
                        className={`relative ml-3 flex min-h-[10%] cursor-pointer items-center justify-between gap-3 p-2 `}
                        onClick={() => toggleAccordion(item?.nodeId)}
                      >
                        <Handle
                          isConnectable={true}
                          id={id + '|' + item?.nodeId}
                          position={Position.Left}
                          type="target"
                          style={{
                            left: '-0.5vw',
                            width: '0.5vw',
                            height: '0.5vw',
                            backgroundColor: color(id + '|' + item?.nodeId),
                            // borderTopLeftRadius: "2px",
                            // borderBottomLeftRadius: "2px",
                          }}
                        />

                        <span
                          className="flex w-[100%] justify-start pl-[0.55vw] text-[0.72vw] font-medium capitalize leading-[1.5vh]"
                          style={{
                            color: `${selectedTheme?.text}80`,
                          }}
                        >
                          {item?.nodeName}
                        </span>
                        {item.children && (
                          <TorusButton
                            btncolor={`${selectedTheme?.bgCard}`}
                            isIconOnly={true}
                            onPress={() => toggleAccordion(item?.nodeId)}
                            buttonClassName={`text-black w-[2.29vw]  h-[2.29vw]   rounded-md flex justify-center items-center`}
                            Children={
                              <NavbarArrowDown
                                stroke={selectedTheme && selectedTheme?.text}
                                className={`h-[0.83vw] w-[0.83vw] transition-all duration-75 ease-in-out ${open ? '' : 'rotate-[-90deg]'}`}
                              />
                            }
                          />
                        )}
                      </div>

                      {activeIndices?.[item?.nodeId] && (
                        <div
                          className={`max-h-[85%] overflow-scroll scrollbar-hide`}
                        >
                          {item?.children && (
                            <TargetObject
                              search={search}
                              color={color}
                              id={securityTarget + '|' + item?.nodeId}
                              item={item?.children}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ),
            )
          ) : (
            <span className="mt-0 pb-[2.55vh] text-center text-[0.83vw] font-normal leading-[2.22vh] text-[#344054]">
              No Items Found
            </span>
          )}
        </>
      )}
    </div>
  );
};
const DisplayDoDataSet = ({ nodeId, item }) => {
  const { selectedTheme } = useContext(TorusModellerContext);
  const { setNodes } = useReactFlow();
  const [newLabel, setNewLabel] = useState(item?.label);
  const changeProperty = (e) => {
    setNodes((prev) => {
      return prev.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: node.data.map((obj) => {
              if (obj.path === item.path) return { ...obj, label: e };
              return obj;
            }),
          };
        }
        return node;
      });
    });
  };
  return (
    <div className="relative flex items-center justify-start px-[0.5vw]">
      <TorusModularInput
        key={item.path + 'name'}
        otherMethod={{
          onPaste: (e) => {
            setNewLabel(e);
          },
        }}
        label={item?.nodeName + ' - ' + item?.id}
        isRequired={true}
        type="text"
        placeholder="Type New Label..."
        bgColor={`${selectedTheme?.bgCard}`}
        textColor={`text-[${selectedTheme?.text}]`}
        
        labelColor={`${selectedTheme?.text}70`}
        labelSize={'text-[0.62vw] pl-[0.25vw]'}
        outlineColor="#cbd5e1"
        radius="sm"
        size=""
        isReadOnly={false}
        isDisabled={false}
        errorShown={false}
        isClearable={true}
        backgroundColor={'bg-gray-300/25 dark:bg-[#161616] '}
        onChange={(e) => {
          setNewLabel(e);
        }}
        
      
        // value={value}
        defaultValue={newLabel}
        textSize={'text-[0.72vw]'}
        inputClassName={'px-[0.25vw] py-[0.55vh]'}
        wrapperClass={'px-[0.25vw] py-[0.55vh]'}
        endContent={
          <TorusButton
            onPress={() => {
              changeProperty(newLabel);
            }}
            Children={
              <FaCircleCheck
                size={13}
                className="text-gray-400 hover:text-gray-600"
              />
            }
          />
        }
      />

      <Handle
        isConnectable={false}
        id={`${item?.path}-target`}
        position={Position.Left}
        type="target"
        style={{
          left: '0.2vw',
          width: '0.5vw',
          height: '0.5vw',
        }}
      />
    </div>
  );
};
export default TargetAccordionMenu;
