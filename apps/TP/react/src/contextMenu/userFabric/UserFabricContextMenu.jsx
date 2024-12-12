import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Text } from 'react-aria-components';
import { toast } from 'react-toastify';
import { useReactFlow } from 'reactflow';
import { TorusModellerContext } from '../../Layout';
import { Copy, Cut, Delete, EditNode, Paste } from '../../SVG_Application';
import { getSubflow } from '../../commonComponents/api/orchestratorApi';
import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';
import useCopyPaste from '../../commonComponents/react-flow-pro/useCopyPaste';
import TorusButton from '../../torusComponents/TorusButton';
import TorusToast from '../../torusComponents/TorusToaster/TorusToast';
import { useComponent } from '../../VPT_UF/TM_GRID/contexts/Componet';
export default function ProcessFabricContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const component = useComponent();
  const { getNode: gN, getNodes, deleteElements: dE } = useReactFlow();
  const { selectedTkey, redispath, client,selectedTheme } = useContext(TorusModellerContext);

  const getNode = useMemo(() => {
    if (selectedTkey === 'AF') {
      return (id) => component?.state?.[id];
    } else return gN;
  });

  const deleteElements = useMemo(() => {
    if (selectedTkey === 'AF') {
      return component.deleteNode;
    } else {
      return dE;
    }
  }, [selectedTkey]);
  const node = getNode(id);
  const { cut, copy, paste } = useCopyPaste();
  const canCopy = getNodes().some(({ selected }) => selected);

  const [wordLength, setWordLength] = useState(0);

  const handleUoUpdation = (js, redispath) => {
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
      console.log(key, rdiskey, 'uouo');
      getSubflow(JSON.stringify(key), 'UO')
        .then((res) => {
          if (res && res?.data && res?.status === 200) {
            console.log('res');
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
              console.log(filteredobj, filteredNode, 'filteredobj');
              //deleting the bjectelement or not
              if (filteredobj && !filteredNode.length > 0) {
                const deletingobject = filteredobj.flatMap((item) => {
                  if (item?.objElements.length > 0) {
                    return item.objElements.filter(
                      (obj) => obj?.elementId === js?.id,
                    );
                  }
                  return [];
                });

                if (deletingobject.length > 0) {
                  const isEmpty = deletingobject.every((obj) => {
                    return (
                      obj.mapper.length === 0 &&
                      obj.code.length === 0 &&
                      Object.keys(obj.rule).length === 0 &&
                      Object.keys(obj.events).length === 0
                    );
                  });
                  if (isEmpty) {
                    deleteElements({ nodes: [{ id }] });
                    props.onClick();
                  } else {
                    if (
                      window.confirm(
                        'this node obj already have a value on UO, Do you want to delete it ?',
                      )
                    )
                      deleteElements({ nodes: [{ id }] });
                    // else
                    //   toast(
                    //     <TorusToast
                    //       setWordLength={setWordLength}
                    //       wordLength={wordLength}
                    //     />,
                    //     {
                    //       type: 'warning',
                    //       position: 'bottom-right',
                    //       autoClose: 2000,
                    //       hideProgressBar: true,
                    //       title: 'warning',
                    //       text: `node's obj already have a value on UO`,
                    //       closeButton: false,
                    //     },
                    //   );
                  }
                }
                if (deletingobject.length === 0) {
                  deleteElements({ nodes: [{ id }] });
                  props.onClick();
                }
              }
              //deleteing the node or not
              else if (filteredNode && filteredNode.length > 0) {
                const deletingNode = filteredNode.filter((item) => {
                  return item.nodeId === js?.id;
                });
                const checkObjectelement = deletingNode.map((item) => {
                  if (item?.objElements.length > 0) {
                    return item.objElements.every((obj) => {
                      return (
                        obj.mapper.length === 0 &&
                        obj.code.length === 0 &&
                        Object.keys(obj.rule).length === 0 &&
                        Object.keys(obj.events).length === 0
                      );
                    });
                  }
                });
                const objectElementlength = deletingNode.flatMap((item) => {
                  return item.objElements;
                });
                const allTrue = checkObjectelement.every((value) => value);

                if (deletingNode && deletingNode.length > 0) {
                  const isEmpty = deletingNode.every((obj) => {
                    return (
                      obj.mapper.length === 0 &&
                      obj.code.length === 0 &&
                      Object.keys(obj.rule).length === 0 &&
                      Object.keys(obj.events).length === 0
                    );
                  });

                  if (isEmpty && allTrue) {
                    deleteElements({ nodes: [{ id }] });
                    props.onClick();
                  } else if (isEmpty && objectElementlength.length == 0) {
                    deleteElements({ nodes: [{ id }] });
                    props.onClick();
                  } else {
                    if (
                      window.confirm(
                        'node already have a value on UO, Do you want to delete it ?',
                      )
                    )
                      deleteElements({ nodes: [{ id }] });
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
                    //     text: `node already have a value on UO`,
                    //     closeButton: false,
                    //   },
                    // );
                  }
                }
                if (!deletingNode || deletingNode.length == 0) {
                  deleteElements({ nodes: [{ id }] });
                  props.onClick();
                }
              }
            } else {
              deleteElements({ nodes: [{ id }] });
              props.onClick();
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      deleteElements({ nodes: [{ id }] });
      props.onClick();
    }
  };

  const topValue = (val) => {
    if (val === false) return val;
    if (val <= 50) return `${val + 50}px`;
    return `${val - 50}px`;
  };

  const topVal = useMemo(() => {
    if (top === false || top === 0) return top;
    if (top <= 50) return `${top + 50}px`;
    return `${top - 50}px`;
  }, [top]);

  const leftValue = (val) => {
    if (val === false) return val;

    if (val <= 200) return `${val + 50}px`;

    return `${val - 200}px`;
  };

  const leftVal = useMemo(() => {
    if (left === false || left === 0) return left;
    if (left <= 200) return `${left + 50}px`;
    return `${left - 200}px`;
  }, [left]);

  const rightVal = useMemo(() => {
    if (right === false || right === 0) return right;

    if (right > 0 && right <= 200) return `${right + 50}px`;

    if (right < 0) return `${Math.max(right + 200, 0)}px`;

    return `${right - 200}px`;
  }, [right]);

  const bottomVal = useMemo(() => {
    if (bottom === false || bottom === 0) return bottom;

    if (bottom <= 200) return `${bottom + 50}px`;

    return `${bottom - 200}px`;
  }, [bottom]);

  return (
    <>
      {node && (
        <div
          style={{
            top: topVal,
            left: leftVal,
            right: rightVal,
            bottom: bottomVal,
            backgroundColor: `${selectedTheme?.bg}`,
            border: `1px solid ${selectedTheme?.border}`,
          }}
       
          className={`absolute z-50 flex ${node?.data?.label ? 'h-[21.85vh]' : 'h-[17.85vh]'}  w-[12.5vw] cursor-default flex-col rounded-md shadow-md`}
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

          <div className="flex flex-col justify-around gap-[1.85vh] py-[1.85vh]">
            <TorusButton
              key={'uf_edit'}
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
            {selectedTkey !== 'AF ' && (
              <>
                <TorusButton
                  key={'uf_Duplicate'}
                  // isDisabled={!canCopy}
                  onPress={() => {
                    component?.DuplicateComponent(
                      component?.state[id],
                      component?.state[id]?.parent,
                    );
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
              </>
            )}

            <TorusButton
              key={'uf_delete'}
              onPress={() => {
                const js = getNode(id);
                handleUoUpdation(js, redispath);
                // deleteElements({ nodes: [{ id }] });
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
