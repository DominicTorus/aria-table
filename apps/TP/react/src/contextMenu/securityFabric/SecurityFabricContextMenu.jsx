import React, { useCallback, useContext } from 'react';
import { Text } from 'react-aria-components';
import { useReactFlow } from 'reactflow';
import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';
import useCopyPaste from '../../commonComponents/react-flow-pro/useCopyPaste';
import { Copy, Cut, Delete, EditNode, Paste } from '../../SVG_Application';
import TorusButton from '../../torusComponents/TorusButton';
export default function ProcessFabricContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges, getNodes } = useReactFlow();
  const node = getNode(id);
  const { darkMode } = useContext(DarkmodeContext);
  const { cut, copy, paste, bufferedNodes } = useCopyPaste();
  const canCopy = getNodes().some(({ selected }) => selected);
  const canPaste = bufferedNodes.length > 0;

  const duplicateNode = useCallback(() => {
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);
  return (
    <>
      {node && (
        <div
          style={{ top, left, right, bottom }}
          className="absolute z-50 flex w-[12.5vw] cursor-default flex-col rounded-md    bg-white shadow-md dark:border dark:border-[#212121] dark:bg-[#161616]  "
          {...props}
        >
          {node?.data?.label && (
            <div className="h-[4.50vh] w-full border-b border-[#F2F4F7] p-[0.6vw] py-[0.3vh]  dark:border-[#212121] ">
              <Text className="flex h-full w-full items-center justify-start overflow-hidden text-ellipsis text-[0.92vw] font-medium  capitalize text-[#344054] dark:text-white">
                {node?.data?.label}
              </Text>
            </div>
          )}
          {/* <div className=" flex w-full items-center justify-center border-b p-[0.3vw]  py-[0.25vh]  dark:border-[#212121]  ">
            <div className={"flex w-full items-center  justify-between"}>
              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={"sf_rule"}
                    buttonClassName={"w-1/3"}
                    isIconOnly={true}
                    onPress={() => {
                      props?.onEdit(id, "rule");
                    }}
                    Children={
                      <RulesIcon className={" h-[0.83vw] w-[0.83vw]"} />
                    }
                  />
                }
                color={"#ccc"}
                tooltipFor={"sf_rule"}
                tooltipContent={"rule"}
              />
              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={"sf_customCode"}
                    buttonClassName={"w-1/3"}
                    isIconOnly={true}
                    onPress={() => {
                      props?.onEdit(id, "code");
                    }}
                    Children={
                      <CustomCode className={" h-[0.83vw] w-[0.83vw]"} />
                    }
                  />
                }
                color={"#ccc"}
                tooltipFor={"sf_customCode"}
                tooltipContent={"code"}
              />

              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={"sf_mapper"}
                    buttonClassName={"w-1/3"}
                    onPress={() => {
                      props?.onEdit(id, "mapper");
                    }}
                    isIconOnly={true}
                    Children={
                      <MapperIcon className={" h-[0.83vw] w-[0.83vw]"} />
                    }
                  />
                }
                color={"#ccc"}
                tooltipFor={"sf_mapper"}
                tooltipContent={"mapper"}
              />
            </div>
          </div> */}

          <div className="flex flex-col justify-around gap-[1.85vh] py-[1.85vh]">
            <TorusButton
              key={'sf_edit'}
              onPress={() => {props?.onEdit(id);props?.onClose("edit");}}
              Children={
                <div className="flex items-center justify-center">
                  <div className="  flex w-[90%] cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className=" flex items-center justify-center gap-3  text-sm text-black dark:text-white">
                        <EditNode
                          className={
                            ' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white'
                          }
                        />
                        <span className="text-[0.72vw] leading-[2.22vh]">
                          Edit Node
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1VW]  items-center justify-center  rounded-sm bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh]
text-[#020202]/35 dark:bg-[#0F0F0F]  dark:text-[#FFFFFF]/35"
                      ></div>
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1vw] items-center justify-center  rounded-sm bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh]
text-[#020202]/35 dark:bg-[#0F0F0F]  dark:text-[#FFFFFF]/35 "
                      >
                        E
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'sf_cut'}
              isDisabled={!canCopy}
              onPress={() => {cut(id);props?.onClose("cut");}}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm text-black dark:text-white">
                        <Cut
                          className={
                            ' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white'
                          }
                        />
                        <span className="text-[0.72vw] leading-[2.22vh]">
                          Cut
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1VW] items-center  justify-center rounded-sm  bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh] text-[#020202]/35
dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
                      >
                        ⌘
                      </div>
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1VW]  items-center justify-center rounded-sm  bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh] text-[#020202]/35
dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
                      >
                        X
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'sf_copy'}
              isDisabled={!canCopy}
              onPress={() => {copy(id);props?.onClose("copy");}}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm text-black dark:text-white">
                        <Copy
                          className={
                            ' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white'
                          }
                        />
                        <span className="text-[0.72vw] leading-[2.22vh]">
                          Copy
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1VW] items-center  justify-center rounded-sm  bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh] text-[#020202]/35
dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
                      >
                        ⌘
                      </div>
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1VW]  items-center justify-center rounded-sm  bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh] text-[#020202]/35
dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
                      >
                        C
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'sf_paste'}
              isDisabled={!canCopy}
              onPress={() => {paste(id);props?.onClose("paste");}}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm text-black dark:text-white">
                        <Paste
                          className={
                            ' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white'
                          }
                        />
                        <span className="text-[0.72vw] leading-[2.22vh]">
                          Paste
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1VW] items-center  justify-center rounded-sm  bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh] text-[#020202]/35
                      dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
                      >
                        ⌘
                      </div>
                      <div
                        className=" dark:text-[ #FFFFFF]/35 flex h-[1vw] w-[1VW]  items-center justify-center rounded-sm  bg-[#F2F3F8] text-[0.72vw] leading-[1.04vh] text-[#020202]/35
                      dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
                      >
                        V
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'sf_delete'}
              onPress={() => {
                deleteNode();
                props.onClick();
                props?.onClose("delete");
              }}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex  w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm text-[#F44336] dark:text-[#F44336]">
                        <Delete
                          className={
                            ' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white'
                          }
                        />
                        <span className="text-[0.72vw] leading-[2.22vh]">
                          Delete
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%]  items-center justify-end gap-2 p-1">
                      <div className="dark:text-[ #FFFFFF]/35 flex h-[1.85vh] w-[1.51vw] items-center  justify-center rounded-sm  bg-[#F2F3F8]  dark:bg-[#0F0F0F]">
                        <span
                          className="text-[0.72vw]
leading-[1.04vh] text-[#020202]/35 dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
                        >
                          Del
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
