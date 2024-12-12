import React, { useCallback, useContext, useState } from 'react';
import { Text } from 'react-aria-components';
import { toast } from 'react-toastify';
import { useReactFlow } from 'reactflow';
import { TorusModellerContext } from '../../Layout';
import { Copy, Cut, Delete, EditNode, Paste } from '../../SVG_Application';
import { getSubflow } from '../../commonComponents/api/orchestratorApi';
import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';
import TorusButton from '../../torusComponents/TorusButton';
import TorusToast from '../../torusComponents/TorusToaster/TorusToast';

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
  const {
    selectedSubFlow,
    setSelectedSubFlow,
    redispath,
    setRedispath,
    mappedData,
    setMappedData,
    selectedTheme,
    client,
  } = useContext(TorusModellerContext);
  const { getNode, setNodes, addNodes, setEdges, getNodes } = useReactFlow();
  const {takeSnapshot} = undoRedo;
  const {cut, copy, paste, canCopy, canPaste} = cutCopyPaste;
  const node = getNode(id);
  const { darkMode } = useContext(DarkmodeContext);
  const [wordLength, setWordLength] = useState(0);

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
    takeSnapshot();
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges, takeSnapshot]);

  const handlePoUpdation = (js, redispath) => {
    console.log(redispath, js, 'POupdation');
    if (redispath) {
      let rdiskey =
        'CK:' +
        client +
        ':FNGK:' +
        redispath[0] +
        ':FNK:' +
        redispath[1] +
        ':CATK:' +
        redispath[2] +
        ':AFGK:' +
        redispath[3] +
        ':AFK:' +
        redispath[4] +
        ':AFVK:' +
        redispath[5];
      let otherKey = [
        'CK',
        'FNGK',
        'FNK',
        'CATK',
        'AFGK',
        'AFK',
        'AFVK',
        'AFSK',
      ];
      let key = rdiskey?.split(':');
      key = key.filter((item) => !otherKey.includes(item));
      console.log(key, rdiskey, 'popo');
      getSubflow(JSON.stringify(key), 'PO')
        .then((res) => {
          if (res && res?.data && res?.status === 200) {
            if (res?.data?.mappedData) {
              console.log('map');
              const filteredobj = res?.data?.mappedData?.artifact?.node.filter(
                (item) => {
                  return (
                    item.nodeId === js?.T_parentId ||
                    item.nodeName === js?.canva
                  );
                },
              );

              const filteredNode = res?.data?.mappedData?.artifact?.node.filter(
                (item) => {
                  return (
                    item.nodeId === js?.id ||
                    item.nodeName === (js?.data?.label ?? js?.property?.name)
                  );
                },
              );

              // //deleting the bjectelement or not
              // if (filteredobj && !filteredNode.length > 0  ) {
              //   const deletingobject = filteredobj.flatMap((item) => {
              //     if (item?.objElements.length > 0) {
              //       return item.objElements.filter(
              //         (obj) => obj?.elementId === js?.id,
              //       );
              //     }
              //     return [];
              //   });
              //   console.log(deletingobject, 'deletingobject');

              //   if (deletingobject.length > 0) {
              //     const isEmpty = deletingobject.every((obj) => {
              //       return (
              //         obj.mapper.length === 0 &&
              //         obj.code.length === 0 &&
              //         Object.keys(obj.rule).length === 0 &&
              //         Object.keys(obj.events).length === 0
              //       );
              //     });
              //     if (isEmpty) {
              //       deleteElements({ nodes: [{ id }] });
              //       props.onClick();
              //     } else {
              //       alert('already have a obj value');
              //     }
              //   }
              //   if (deletingobject.length == 0) {
              //     deleteElements({ nodes: [{ id }] });
              //     props.onClick();
              //   }
              //   console.log(
              //     filteredobj,
              //     filteredNode,
              //     deletingobject,
              //     'filteredNode',
              //   );
              // }
              // //deleteing the node or not
              if (filteredNode && filteredNode.length > 0) {
                const deletingNode = filteredNode.filter((item) => {
                  return item.nodeId === js?.id;
                });
                // const checkObjectelement = deletingNode.map((item) => {
                //   if (item?.objElements.length > 0) {
                //     return item.objElements.every((obj) => {
                //       return (
                //         obj.mapper.length === 0 &&
                //         obj.code.length === 0 &&
                //         Object.keys(obj.rule).length === 0 &&
                //         Object.keys(obj.events).length === 0
                //       );
                //     });
                //   }
                // });
                // const objectElementlength = deletingNode.flatMap((item) => {
                //   return item.objElements
                // })
                // const allTrue = checkObjectelement.every((value) => value);

                if (deletingNode && deletingNode.length > 0) {
                  const isEmpty = deletingNode.every((obj) => {
                    return (
                      obj.mapper.length === 0 &&
                      obj.code.length === 0 &&
                      Object.keys(obj.rule).length === 0
                    );
                  });

                  if (isEmpty) {
                    deleteNode();
                    props.onClick();
                  } else {
                    if (
                      window.confirm(
                        'node already have a value on PO, Do you want to delete it ?',
                      )
                    )
                      deleteNode();
                    // toast(
                    //   <TorusToast
                    //     setWordLength={setWordLength}
                    //     wordLength={wordLength}
                    //   />,
                    //   {
                    //     type: 'warning',
                    //     position: 'bottom-right',
                    //     autoClose: 2000,
                    //     hideProgressBar: true,
                    //     title: 'warning',
                    //     text: `node already have a value on PO`,
                    //     closeButton: false,
                    //   },
                    // );
                  }
                }
                if (!deletingNode || deletingNode.length == 0) {
                  deleteNode();
                  props.onClick();
                }
              }
              if (!filteredNode || filteredNode.length == 0) {
                deleteNode();
                props.onClick();
              }
            } else {
              deleteNode();
              props.onClick();
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      deleteNode();
      props.onClick();
    }
  };

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
              className="w-full p-[0.6vw] h-[4.50vh] rounded-tl-md rounded-tr-md py-[0.3vh] border-b"
              style={{
              
                borderColor: `${selectedTheme?.border}`,
                
              }}
            >
              <Text
                className="flex h-full w-full items-center justify-start overflow-hidden text-ellipsis  text-[0.92vw] font-medium  capitalize "
                style={{
                  color: `${selectedTheme?.text}`,
                }}
              >
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
                    id={"pf_rule"}
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
                tooltipFor={"pf_rule"}
                tooltipContent={"rule"}
              />
              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={"pf_customCode"}
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
                tooltipFor={"pf_customCode"}
                tooltipContent={"code"}
              />

              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={"pf_mapper"}
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
                tooltipFor={"pf_mapper"}
                tooltipContent={"mapper"}
              />
            </div>
          </div> */}

          <div className="flex flex-col justify-around gap-[1.85vh] py-[1.85vh]">
            <TorusButton
              key={'pf_edit'}
              onPress={() => {
                props?.onEdit(id);
                props?.onClose('edit');
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
              key={'pf_cut'}
              isDisabled={!canCopy}
              onPress={() => {
                cut();
                // props?.onClose('cut');
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
              key={'pf_copy'}
              isDisabled={!canCopy}
              onPress={() => {
                copy();
                // props?.onClose('copy');
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
              key={'pf_paste'}
              isDisabled={!canPaste}
              onPress={() => {
                paste();
                // props?.onClose('paste');
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
              key={'pf_delete'}
              onPress={() => {
                const js = getNode(id);
                console.log(js, 'kol');
                handlePoUpdation(js, redispath);
                props?.onClose('delete');
                // deleteNode();
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
                      <div className=" flex h-[1.85vh] bg-red-300 border border-red-500 text-red-600 w-[1.51vw] items-center  justify-center rounded-sm ">
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
