import React, { useCallback, useContext } from 'react';
import { Text } from 'react-aria-components';
import { useReactFlow } from 'reactflow';
import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';
import { Copy, Cut, Delete, EditNode, Paste } from '../../SVG_Application';
import TorusButton from '../../torusComponents/TorusButton';
import { TorusModellerContext } from '../../Layout';
export default function ProcessFabricContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  undoRedo,
  cutCopyPaste,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges, getNodes } = useReactFlow();
  const node = getNode(id);

  const { selectedTheme } = useContext(TorusModellerContext);
  const { darkMode } = useContext(DarkmodeContext);
  const {takeSnapshot} = undoRedo;
  const {cut, copy, paste, canCopy, canPaste} = cutCopyPaste;

  const deleteNode = useCallback(() => {
    takeSnapshot();
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges, takeSnapshot]);
  return (
    <>
      {node && (
        <div
          style={{
            top,
            left,
            right,
            bottom,
            backgroundColor: `${selectedTheme?.bg}`,
            border: `1px solid ${selectedTheme?.border}`,
          }}
          className="absolute z-50 flex w-[12.5vw] cursor-default flex-col rounded-md "
          {...props}
        >
          {node?.data?.label && (
            <div
              className="h-[4.50vh] w-full rounded-tl-md rounded-tr-md p-[0.6vw] py-[0.3vh]"
              style={{
                backgroundColor: `transparent`,
                borderColor: `${selectedTheme?.border}`,
                borderTop: `0`,
                borderLeft: `0`,
                borderRight: `0`,
                borderBottom: `1px solid`,
                color: `${selectedTheme?.text}`,
              }}
            >
              <Text className="flex h-full w-full items-center justify-start overflow-hidden text-ellipsis text-[0.92vw] font-medium  capitalize">
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
                    id={"df_rule"}
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
                tooltipFor={"df_rule"}
                tooltipContent={"rule"}
              />
              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={"df_customCode"}
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
                tooltipFor={"df_customCode"}
                tooltipContent={"code"}
              />

              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={"df_mapper"}
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
                tooltipFor={"df_mapper"}
                tooltipContent={"mapper"}
              />
            </div>
          </div> */}

          <div className="flex flex-col justify-around gap-[1.85vh] py-[1.85vh]">
            <TorusButton
              key={'df_edit'}
              onPress={() => {
                props?.onEdit(id);

                props.onClose('edit');
              }}
              Children={
                <div className="flex items-center justify-center">
                  <div className="  flex w-[90%] cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className=" flex items-center justify-center gap-3  text-sm">
                        <EditNode
                          className={' h-[0.83vw] w-[0.83vw] '}
                          stroke={`${selectedTheme && selectedTheme?.['textOpacity/50']}`}
                        />
                        <span
                          className="text-[0.72vw] leading-[2.22vh]"
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Edit Node
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className="  flex h-[1vw] w-[1VW]  items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]"
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                        }}
                      ></div>
                      <div
                        className="flex h-[1vw] w-[1vw] items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]
 "
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                          color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
                        }}
                      >
                        E
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'df_cut'}
              isDisabled={!canCopy}
              onPress={() => {
                cut();
                // props.onClose('cut');
              }}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm text-black dark:text-white">
                        <Cut
                          className={' h-[0.83vw] w-[0.83vw] '}
                          stroke={`${selectedTheme && selectedTheme?.['textOpacity/50']}`}
                        />
                        <span
                          className="text-[0.72vw] leading-[2.22vh]"
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Cut
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className="  flex h-[1vw] w-[1VW]  items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]"
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                          color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
                        }}
                      >
                        ⌘
                      </div>
                      <div
                        className="flex h-[1vw] w-[1vw] items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]
 "
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                          color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
                        }}
                      >
                        X
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'df_copy'}
              isDisabled={!canCopy}
              onPress={() => {
                copy();
                // props.onClose('copy');
              }}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm ">
                        <Copy
                          className={' h-[0.83vw] w-[0.83vw] '}
                          stroke={`${selectedTheme && selectedTheme?.['textOpacity/50']}`}
                        />
                        <span
                          className="text-[0.72vw] leading-[2.22vh]"
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Copy
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className="  flex h-[1vw] w-[1VW]  items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]"
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                          color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
                        }}
                      >
                        ⌘
                      </div>
                      <div
                        className="flex h-[1vw] w-[1vw] items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]
 "
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                          color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
                        }}
                      >
                        C
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'df_paste'}
              isDisabled={!canPaste}
              onPress={() => {
                paste();
                // props.onClose('paste');
              }}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm text-black dark:text-white">
                        <Paste
                          className={' h-[0.83vw] w-[0.83vw]'}
                          stroke={`${selectedTheme && selectedTheme?.['textOpacity/50']}`}
                        />
                        <span
                          className="text-[0.72vw] leading-[2.22vh]"
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Paste
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
                      <div
                        className="  flex h-[1vw] w-[1VW]  items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]"
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                          color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
                        }}
                      >
                        ⌘
                      </div>
                      <div
                        className="flex h-[1vw] w-[1vw] items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]
 "
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                          border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
                          color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
                        }}
                      >
                        V
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <TorusButton
              key={'df_delete'}
              onPress={() => {
                deleteNode();
                props.onClick();
                props.onClose('delete');
              }}
              Children={
                <div className="flex items-center justify-center">
                  <div className="flex  w-[90%]  cursor-pointer flex-row items-center">
                    <div className="flex w-[70%] items-center justify-start">
                      <div className="   flex items-center justify-center gap-3  text-sm text-[#F44336] dark:text-[#F44336] ">
                        <Delete
                          className={
                            ' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white '
                          }
                        />
                        <span className="text-[0.72vw] leading-[2.22vh]">
                          Delete
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[30%]  items-center justify-end gap-2 p-1">
                      <div className=" flex h-[1.85vh] w-[1.51vw] items-center justify-center rounded-sm border border-red-500  bg-red-300 text-red-600 ">
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
