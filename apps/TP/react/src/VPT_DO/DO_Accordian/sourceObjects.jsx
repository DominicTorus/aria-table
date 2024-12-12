import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import {
  Handle,
  MarkerType,
  Position,
  useUpdateNodeInternals,
} from 'reactflow';
import { TorusModellerContext } from '../../Layout';
import { DoAddIcon, DoNewIcon, NavbarArrowDown } from '../../SVG_Application';
import TorusButton from '../../torusComponents/TorusButton';
import TorusDialog from '../../torusComponents/TorusDialog';
import TorusDropDown from '../../torusComponents/TorusDropDown';
import TorusModularInput from '../../torusComponents/TorusModularInput';
import TorusSearch from '../../torusComponents/TorusSearch';
import { OrchestratorContext } from '../App';
import _ from 'lodash';

export default function SourceObjects({ id, data }) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { selectedSubFlow, selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);
  const [search, setSearch] = useState('');
  const { edges } = useContext(OrchestratorContext);

  console.log(data, 'sco');

  const items = useMemo(() => {
    try {
      let p = data?.path;
      if (selectedSubFlow === 'DO') {
        if (!search) return data?.schema;
        return data?.schema?.filter(
          (item) =>
            item?.nodeName.toLowerCase().includes(search.toLowerCase()) ||
            item?.schema.includes(search.toLowerCase()),
        );
      }

      if (selectedSubFlow === 'UO') {
        if (!search)
          return data?.dfo?.[p].filter(
            (item) => item?.nodeId === data.selectedIndex,
          );
        return data?.dfo?.[p].filter((item) => {
          return (
            item.nodeId === data.selectedIndex &&
            (item?.nodeName.toLowerCase().includes(search.toLowerCase()) ||
              item?.schema.includes(search.toLowerCase()))
          );
        });
      }
      if (selectedSubFlow === 'PO') {
        if (!search)
          return data?.dfo?.[p].filter(
            (item) =>
              item?.selectedDropdownName ===
              data?.path + '|' + data.selectedIndex,
          );
        return data?.dfo?.[p].filter((item) => {
          return (
            item.selectedDropdownName ===
              data?.path + '|' + data.selectedIndex &&
            (item?.nodeName.toLowerCase().includes(search.toLowerCase()) ||
              item?.schema.includes(search.toLowerCase()))
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [data, search]);

  const color = useCallback(
    (key) => {
      try {
        console.log(id, data?.path, key, 'datadid');
        let indexs = edges.findIndex(
          (edge) =>
            edge.sourceHandle === `${data?.path}|${key}` ||
            edge.sourceHandle === `${id}|${key}`,
        );
        if (indexs > -1) {
          return `${selectedAccntColor}`;
        }

        return '#ccc';
      } catch (error) {
        console.log(error);
      }
    },
    [edges, data?.path],
  );
  useEffect(() => {
    updateNodeInternals(id);
  }, [JSON.stringify(data)]);
  const colorPO = useCallback(
    (key) => {
      try {
        console.log(key, edges, data, 'datadid');
        let indexs = edges.findIndex((edge) => edge.sourceHandle === `${key}`);
        if (indexs > -1) {
          return '#0736C4';
        }

        return '#ccc';
      } catch (error) {
        console.log(error);
      }
    },
    [edges, data?.path],
  );

  return (
    <div
      className="flex h-full w-[20vw] flex-col space-y-[0.20vw] overflow-scroll rounded-lg border py-[0.5vw] "
      style={{
        backgroundColor: selectedTheme?.bg,
        borderColor: selectedTheme?.border,
      }}
    >
      <div className="px-[0.5vw] pb-[0.30vw]">
        <TorusSearch
          // inputClassName="text-[0.72vw] font-medium capitalize leading-[2.22vh]"
          // placeholder="Search"
          // radius="sm"
          // height="sm"
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
          {items && items.length > 0 ? (
            items.map((data, keyIndex) => (
              <DoSourceObject
                edges={edges}
                data={data}
                key={keyIndex}
                id={id}
                color={color}
                keyIndex={keyIndex}
              />
            ))
          ) : (
            <span className="pb-[2.55vh] text-center text-[0.83vw] font-normal leading-[2.22vh] text-[#344054]">
              No Items Found
            </span>
          )}
        </>
      ) : selectedSubFlow === 'PO' ? (
        <>
          {items && items.length > 0 ? (
            items.map((datas, keyIndex) => (
              <PoSourceObject
                edges={edges}
                data={datas}
                items={datas}
                key={keyIndex}
                id={data?.selectedDropdownName}
                color={colorPO}
                keyIndex={keyIndex}
              />
            ))
          ) : (
            <span className="pb-[2.55vh] text-center text-[0.83vw] font-normal leading-[2.22vh] text-[#344054]">
              No Items Found
            </span>
          )}
        </>
      ) : (
        <>
          {items && items.length > 0 ? (
            items.map((datass, keyIndex) => (
              <UoSourceObject
                edges={edges}
                data={datass}
                items={data}
                key={keyIndex}
                id={data?.path}
                color={color}
                keyIndex={keyIndex}
              />
            ))
          ) : (
            <span className="pb-[2.55vh] text-center text-[0.83vw] font-normal leading-[2.22vh] text-[#344054]">
              No Items Found
            </span>
          )}
        </>
      )}
    </div>
  );
}

const DoSourceObject = ({ data, id, color, keyIndex }) => {
  const [open, setOpen] = useState(true);
  const [togglecheckbox, settogglecheckbox] = useState(false);
  const [sourcehandler, setSourceHandler] = useState(null);
  const [sourceNodehandler, setSourceNodeHandler] = useState([]);

  const [doubleClicked, setDoubleClicked] = useState({});
  const [variableInput, setVariableInput] = useState(null);
  const [variableDropdown, setVariableDropdown] = useState(null);

  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);
  const {
    nodes,
    edges,
    setEdges,
    setNodes,
    setMappedData,
    mappedData,
    selectedSource,
  } = useContext(OrchestratorContext);
  const [variableDropdownType, setVariableDropdownType] = useState([
    {
      key: 'string',
      label: 'string',
    },
    {
      key: 'integer',
      label: 'integer',
    },
    {
      key: 'boolean',
      label: 'boolean',
    },
  ]);
  const colorChange = useCallback(
    (key) => {
      if (data?.ifo && data?.ifo.length > 0) {
        const index = data?.ifo.findIndex((ifo) => {
          return (
            ifo?.path === selectedSource?.path + '|' + data?.nodeId + '|' + key
          );
        });
        if (index > -1) {
          return true;
        }
        return false;
      }
      return false;
    },
    [data, selectedSource],
  );

  console.log(data, 'datadopssss');
  const handleifo = (id, key, data, type, edges) => {
    console.log('called');
    if (data?.nodeId == id) {
      const newInfo = {
        path: selectedSource?.path + '|' + data?.nodeId + '|' + key,
        name: key,
        key: key,
        nodeId: id,
        nodeName: data?.nodeName,
        type: type,
      };

      if (
        !data?.ifo ||
        !data?.ifo.find((existingInfo) => {
          return (
            existingInfo.path ===
            selectedSource?.path + '|' + data?.nodeId + '|' + key
          );
        })
      ) {
        data.ifo = data.ifo || [];
        data.ifo.push(newInfo);
        console.log(id, key, data, type, edges, newInfo, 'datadop');

        // setMappedData((prev) => {
        //   return {
        //     ...prev,
        //     artifact: {
        //       ...prev.artifact,
        //       node: prev?.artifact?.node.map((item) => {
        //         if (item.nodeId === id) {
        //           return {
        //             ...item,
        //             ifo:
        //               item?.ifo !== undefined && item?.ifo !== null
        //                 ? item?.ifo.length > 0 &&
        //                   !item?.ifo.find((ifo) => ifo.path === newInfo.path)
        //                   ? [...item.ifo, newInfo]
        //                   : item?.ifo.length == 0
        //                     ? [...item.ifo, newInfo]
        //                     : item.ifo
        //                 : data.ifo,
        //           };
        //         }
        //         return item;
        //       }),
        //     },
        //   };
        // });
      }
      if (
        doubleClicked[selectedSource?.path + '|' + data?.nodeId + '|' + key]
      ) {
        const findEdge = edges.filter((edge) => {
          const sourcehandlesplit = edge.sourceHandle.split('|');
          sourcehandlesplit.shift();

          const splittedsource = sourcehandlesplit.join('|');
          const findedIfo = data?.nodeId + '|' + key;
          console.log(findedIfo, splittedsource, 'findedge');
          return findedIfo !== splittedsource;
        });
        setEdges(findEdge);

        const updatedNodes = nodes.map((node) => {
          if (node.type === 'customTargetItems') {
            return {
              ...node,
              data: node.data.filter((dataNode) => {
                const splittedTargetnode = dataNode.path.split('|');
                splittedTargetnode.shift();
                const findtargetednode = splittedTargetnode.join('|');
                return findtargetednode !== data?.nodeId + '|' + key;
              }),
            };
          }
          return node;
        });
        console.log(
          id,
          mappedData,
          data?.nodeName,
          key,
          id + '|' + data?.nodeName + '|' + key,
          'findedgefil',
        );

        setNodes(updatedNodes);

        // setMappedData((prev) => {
        //   return {
        //     ...prev,
        //     artifact: {
        //       ...prev.artifact,
        //       node: prev?.artifact?.node.map((item) => {
        //         console.log(item, 'nodeitem');
        //         if (item.nodeId === id) {
        //           return {
        //             ...item,
        //             ifo:
        //               item?.ifo &&
        //               item?.ifo.filter(
        //                 (ifo) =>
        //                   ifo.path !==
        //                   selectedSource?.path + '|' + data?.nodeId + '|' + key,
        //               ),
        //           };
        //         }
        //         return item;
        //       }),
        //     },
        //   };
        // });

        console.log(nodes, updatedNodes, data, 'findtargetnode');

        data.ifo = data.ifo.filter(
          (info) =>
            info.path !== selectedSource?.path + '|' + data?.nodeId + '|' + key,
        );

        data.schema = data.schema.filter((item) => {
          return !(item.name === key && item.showIcon);
        });

        setDoubleClicked((prev) => ({
          ...prev,
          [selectedSource?.path + '|' + data?.nodeId + '|' + key]: false,
        }));
        return;
      }
      setDoubleClicked((prev) => ({
        ...prev,
        [selectedSource?.path + '|' + data?.nodeId + '|' + key]: true,
      }));
      return data;
    }
  };

  console.log('datadedge', edges, nodes, mappedData);

  useEffect(() => {
    if (edges && edges.length > 0) {
      const source = edges.map((item) => {
        if (item && item.sourceHandle) {
          const parts = item.sourceHandle.split('|');
          return parts.length > 2 ? parts[2] : null;
        }
        return null;
      });
      setSourceHandler(source.filter(Boolean));

      const sourceNode = edges.map((item) => item?.sourceHandle?.split('|')[1]);
      const uniqueSourceNodes = [...new Set(sourceNode)];

      setSourceNodeHandler((prev) => {
        if (!Array.isArray(prev)) return uniqueSourceNodes;
        return [
          ...prev,
          ...uniqueSourceNodes.filter((node) => !prev.includes(node)),
        ];
      });
    }
  }, [edges]);
  console.log(sourcehandler, sourceNodehandler, 'foundNodehandler');

  const handleVariableInputChange = (e) => {
    setVariableInput(e);
  };
  const handleVariableDropdownChange = (e) => {
    setVariableDropdown(e);
  };

  const handleAddNewVariable = (inputval, dropdownval, data, close) => {
    const newInfo = {
      key: inputval,
      name: inputval,
      path: selectedSource?.path + '|' + data?.nodeId + '|' + inputval,
      nodeId: data.nodeId,
      nodeName: data.nodeName,
      type: Array.from(dropdownval)[0],
      showIcon: true,
    };
    if (
      !_.isEmpty(data.ifo) &&
      data?.ifo.findIndex((existingInfo) => {
        return existingInfo.path === newInfo.path;
      }) === -1
    ) {
      data.ifo = data.ifo || [];
      data.ifo.push(newInfo);
      data.schema.push(newInfo);

      // setMappedData((prev) => {
      //   return {
      //     ...prev,
      //     artifact: {
      //       ...prev.artifact,
      //       node: prev?.artifact?.node.map((item) => {
      //         if (item.nodeId === data.nodeId) {
      //           return {
      //             ...item,
      //             ifo: data.ifo,
      //           };
      //         }
      //         return item;
      //       }),
      //     },
      //   };
      // });
      setDoubleClicked((prev) => ({
        ...prev,
        [newInfo.path]: true,
      }));
    } else if (!data?.ifo || data?.ifo?.length === 0) {
      data.ifo = data.ifo || [];
      data.ifo.push(newInfo);
      setDoubleClicked((prev) => ({
        ...prev,
        [newInfo.path]: true,
      }));
    }
    setVariableDropdown(null);
    setVariableInput(null);
    close();
  };

  // console.log(data, variableDropdown, variableInput, 'dataDO');
  const handlecheckboxchange = (data, id, togglecheckbox) => {
    console.log(
      data,
      id,
      togglecheckbox,
      nodes,
      selectedSource,
      sourcehandler,
      'checkbox',
    );
    if (togglecheckbox) {
      setNodes((nodes) => {
        return nodes.map((node) => {
          if (node.type === 'customTargetItems') {
            let schema = node?.data;
            console.log(schema, data, nodes, edges, 'schemanode');
            if (Array.isArray(schema) && schema.length > 0) {
              let foundNode = schema.findIndex(
                (item) =>
                  item.path ===
                  selectedSource?.path + '|' + data?.nodeId + '|' + item.name,
              );

              if (foundNode > -1) {
                return node;
              } else {
                data?.schema.forEach((item) => {
                  const existingNode = schema.findIndex(
                    (existingItem) =>
                      existingItem.path ===
                      selectedSource?.path +
                        '|' +
                        data?.nodeId +
                        '|' +
                        item.name,
                  );
                  if (existingNode === -1) {
                    schema.push({
                      artifact: selectedSource?.path,
                      id: item.name,
                      nodeId: data?.nodeId,
                      nodeName: data?.nodeName,
                      label: item.name,
                      path:
                        selectedSource?.path +
                        '|' +
                        data?.nodeId +
                        '|' +
                        item.name,
                    });
                  }
                });
              }
            } else {
              console.log(schema, data, nodes, edges, 'schemanodeElse');

              data?.schema.forEach((item) => {
                const existingNode = schema.findIndex(
                  (existingItem) =>
                    existingItem.path ===
                    selectedSource?.path + '|' + data?.nodeId + '|' + item.name,
                );
                if (existingNode === -1) {
                  schema.push({
                    artifact: selectedSource?.path,
                    id: item.name,
                    nodeId: data?.nodeId,
                    nodeName: data?.nodeName,
                    label: item.name,
                    path:
                      selectedSource?.path +
                      '|' +
                      data?.nodeId +
                      '|' +
                      item.name,
                  });
                }
              });

              data?.ifo &&
                data?.ifo.length > 0 &&
                data?.ifo.forEach((item) => {
                  const existingNode = schema.find(
                    (existingItem) =>
                      existingItem.path ===
                      selectedSource?.path +
                        '|' +
                        data?.nodeId +
                        '|' +
                        item.name,
                  );
                  if (!existingNode) {
                    schema.push({
                      artifact: selectedSource?.path,
                      id: item.nodeName,
                      nodeId: data?.nodeId,
                      nodeName: data?.nodeName,
                      label: item.name,
                      key: item.name,
                      path:
                        selectedSource?.path +
                        '|' +
                        data?.nodeId +
                        '|' +
                        item.name,
                    });
                  }
                });
              console.log(schema, data, nodes, edges, 'schemanodeElse');
            }
          }
          return node;
        });
      });
      let targetPath = selectedSource?.path.replace('DF-DFD', 'DF-DST');

      setEdges((els) =>
        els.concat(
          data.schema &&
            data.schema
              .map((item) => {
                const edgeHandle = `${selectedSource?.path + '|' + data?.nodeId + '|' + item.name}-target`;
                const edgeId = `reactflow__edge-${selectedSource?.path}${selectedSource?.path + '|' + data?.nodeId + '|' + item.name}-${targetPath}${targetPath + '|' + data?.nodeId + '|' + item.name}-target`;
                if (!els.find((edge) => edge.targetHandle === edgeHandle)) {
                  return {
                    id: edgeId,
                    source: selectedSource?.path,
                    target: targetPath,
                    sourceHandle:
                      selectedSource?.path +
                      '|' +
                      data?.nodeId +
                      '|' +
                      item.name,
                    targetHandle:
                      selectedSource?.path +
                      '|' +
                      data?.nodeId +
                      '|' +
                      item.name +
                      '-target',
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: '#2196f3',
                    },
                    style: {
                      zIndex: 10000,
                      paddingLeft: '10%',
                      paddingRight: '10%',
                      position: 'absolute',
                    },
                  };
                } else {
                  return null;
                }
              })
              .filter((edge) => edge !== null),
        ),
      );

      if (data.ifo && data.ifo.length > 0) {
        setEdges((els) =>
          els.concat(
            data.schema &&
              data.ifo
                .map((item) => {
                  const edgeHandle = `${selectedSource?.path + '|' + data?.nodeId + '|' + item.name}-target`;

                  const edgeId = `reactflow__edge-${selectedSource?.path}${selectedSource?.path + '|' + data?.nodeId + '|' + item.nodeName}-${targetPath}${targetPath + '|' + data?.nodeId + '|' + item.nodeName}-target`;
                  if (!els.find((edge) => edge.targetHandle === edgeHandle)) {
                    return {
                      id: edgeId,
                      source: selectedSource?.path,
                      target: targetPath,
                      sourceHandle:
                        selectedSource?.path +
                        '|' +
                        data?.nodeId +
                        '|' +
                        item.name,
                      targetHandle:
                        selectedSource?.path +
                        '|' +
                        data?.nodeId +
                        '|' +
                        item.name +
                        '-target',
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#2196f3',
                      },
                      style: {
                        zIndex: 10000,
                        paddingLeft: '10%',
                        paddingRight: '10%',
                        position: 'absolute',
                      },
                    };
                  } else {
                    return null;
                  }
                })
                .filter((edge) => edge !== null),
          ),
        );
      }

      if (data?.schema && data?.schema.length > 0) {
        const checkboxifo = data.schema
          .filter((item) => !item.showIcon)
          .map((item) => {
            return {
              name: item?.name,
              key: item?.name,
              path:
                selectedSource?.path + '|' + data?.nodeId + '|' + item?.name,
              nodeName: data?.nodeName,
              nodeId: data?.nodeId,
              type: item?.type,
            };
          });
        console.log(checkboxifo, 'schemanodeifo');

        if (
          data?.ifo &&
          data?.ifo.length > 0 &&
          checkboxifo &&
          checkboxifo.length > 0
        ) {
          const newItems = checkboxifo.filter((item) =>
            data.ifo.some(
              (existingItem) =>
                existingItem.path !== id + '|' + data?.nodeId + '|' + item.name,
            ),
          );
          data.ifo.push(...newItems);
        } else {
          data.ifo = checkboxifo;
        }

        data.ifo &&
          data.ifo.length > 0 &&
          data.ifo.forEach((item) => {
            setDoubleClicked((prev) => ({
              ...prev,
              [item.path]: true,
            }));
          });

        // setMappedData((prev) => {
        //   return {
        //     ...prev,
        //     artifact: {
        //       ...prev.artifact,
        //       node: prev?.artifact?.node.map((item) => {
        //         if (item.nodeId === data.nodeId) {
        //           return {
        //             ...item,
        //             ifo: data.ifo,
        //           };
        //         }
        //         return item;
        //       }),
        //     },
        //   };
        // });
      }
    }

    if (!togglecheckbox) {
      setNodes((nodes) => {
        return nodes.map((node) => {
          if (node.type === 'customTargetItems') {
            let schema = node?.data;

            if (Array.isArray(schema) && schema.length > 0) {
              node.data = schema.filter((item) => item.nodeId !== data.nodeId);
            } else {
              node.data = [];
            }
          }

          return node;
        });
      });

      setEdges((els) => {
        return els.filter((edge) => {
          return edge.sourceHandle.split('|')[1] !== data?.nodeId;
        });
      });

      // setMappedData((prev) => {
      //   return {
      //     ...prev,
      //     artifact: {
      //       ...prev.artifact,
      //       node:
      //         prev?.artifact?.node &&
      //         prev?.artifact?.node.length > 0 &&
      //         prev?.artifact?.node.map((item) => {
      //           if (item.nodeId === data?.nodeId) {
      //             return {
      //               ...item,
      //               DataSet: [],
      //               ifo: item.ifo.filter((item) => item.showIcon),
      //             };
      //           }
      //           return item;
      //         }),
      //     },
      //   };
      // });
      data.ifo &&
        data.ifo.length > 0 &&
        data.ifo.forEach((item) => {
          setDoubleClicked((prev) => ({
            ...prev,
            [item.path]: false,
          }));
        });

      if (data?.ifo && data?.ifo.length > 0) {
        data.ifo = data.ifo.filter((item) => item.showIcon);
      }
    }

    settogglecheckbox(togglecheckbox);
  };

  useEffect(() => {
    if (data) {
      data?.ifo &&
        data?.ifo.length > 0 &&
        data?.ifo.forEach((item) => {
          setDoubleClicked((prev) => ({
            ...prev,
            [item.path]: true,
          }));
        });
    }
  }, []);

  console.log(edges, nodes, data, mappedData, doubleClicked, 'pro_');

  return (
    <div className="px-[.5vw] py-[.3vw]">
      <div
        className="flex flex-col gap-[0] rounded-md "
        style={{
          backgroundColor: `${selectedTheme?.bg}`,
        }}
      >
        <div
          className={`flex cursor-pointer items-center justify-between ${open && data?.ifo && data?.ifo.length > 0  ? 'rounded-tl-md border-t-1 border-r-1 border-l-1  rounded-tr-md' : 'rounded-md border-1'} p-2 text-[0.72vw] font-normal leading-[2.22vh]`}
          style={{
            backgroundColor: `${selectedTheme?.bgCard}`,
            color: `${selectedTheme?.text}`,
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          <span onClick={() => setOpen(!open)} className="flex flex-col ">
            <span>{data.nodeName}</span>
            <span
              className="text-[0.62vw] font-normal leading-[2.22vh] "
              style={{
                color: `${selectedTheme?.text}80`,
              }}
            >
              {data?.nodeType}
            </span>
          </span>
          <span className="flex items-center justify-between gap-[1vw]">
            {data.schema.length > 0 && (
              <>
                <span className="flex items-center justify-center ">
                  <input
                    checked={togglecheckbox}
                    style={{
                      accentColor: '#0736C4',
                    }}
                    type="checkbox"
                    className={`h-[2.45vh] w-4 transform rounded-lg border-gray-200  transition duration-200 ease-in-out hover:scale-110   dark:border-gray-600`}
                    onChange={(e) =>
                      handlecheckboxchange(data, data?.nodeId, e.target.checked)
                    }
                  />
                </span>
                <TorusDialog
                  key={'ADD Variable'}
                  triggerElement={
                    <TorusButton
                      size={'md'}
                      radius={'lg'}
                      isIconOnly={true}
                      height={'md'}
                      Children={
                        <div
                          className="rounded-md"
                          style={{
                            backgroundColor: `${selectedAccntColor}`,
                          }}
                        >
                          <DoAddIcon size={18} color={'#FFFFFF'} />
                        </div>
                      }
                      fontStyle={'text-sm font-medium text-[#FFFFFF]'}
                      buttonClassName={
                        'flex h-[2.45vh] w-[2.45vh] items-center justify-center rounded-md'}
                    />
                  }
                  classNames={{
                    modalOverlayClassName:
                      ' pt-[8.5%] justify-center items-center',
                    modalClassName:
                      ' h-[40.27vh]  w-[36.61vw] flex  justify-center items-center ',
                    dialogClassName:
                      ' w-full h-[30.27vh] border-0 focus:outline-none focus:ring-0 focus:border-0 rounded-lg flex-col bg-white  ',
                  }}
                  title={'Add'}
                  message={'Add'}
                  children={({ close }) => (
                    <div
                      className={` flex h-[60%] w-full flex-col justify-between rounded-lg   `}
                      style={{
                        backgroundColor: `${selectedTheme?.bg}`,
                      }}
                    >
                      <div className=" h-[10%] w-[100%] flex-row gap-3  p-2  ">
                        <div
                          className="flex w-[100%]  items-center justify-between gap-2 border-b p-2 "
                          style={{
                            borderColor: `${selectedTheme?.border}`,
                          }}
                        >
                          <span
                            className=" text-[0.72vw] font-bold  "
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            <span>Add Variable</span>
                          </span>
                          <span
                            className="flex cursor-pointer items-center  rounded-md  transition-all duration-200  "
                            onClick={() => {
                              close();
                              setVariableDropdown(null);
                              setVariableInput(null);
                            }}
                          >
                            <IoCloseOutline
                              size={18}
                              className="  text-black dark:text-white"
                            />
                          </span>
                        </div>
                        <div
                          className=" w-[100%] border-b "
                          style={{
                            borderColor: `${selectedTheme?.border}`,
                          }}
                        >
                          <div className="flex items-center justify-between  p-2">
                            <span
                              className="text-[0.72vw] font-bold  "
                              style={{
                                color: `${selectedTheme?.text}`,
                              }}
                            >
                              Variable Name*
                            </span>
                            <span>
                              <TorusModularInput
                                isRequired={true}
                                type="text"
                                placeholder="Enter here"
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
                                onChange={(e) => {
                                  handleVariableInputChange(e);
                                }}
                                value={variableInput ? variableInput : ''}
                                textSize={'text-[0.83vw]'}
                                inputClassName={'px-[0.25vw] py-[0.55vh]'}
                                wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                              />
                            </span>
                          </div>
                          <div className="flex w-[100%] items-center justify-between  p-2">
                            <span
                              className="w-[63%]  text-[0.72vw]  font-bold  "
                              style={{
                                color: `${selectedTheme?.text}`,
                              }}
                            >
                              Type*
                            </span>
                            <span className="w-[36%]">
                              <TorusDropDown
                                title={
                                  <div className="flex flex-col items-baseline justify-center ">
                                    <span className="font-inter  h-[4vh]  px-[0.5vw]  text-left text-[0.62vw]  font-normal tracking-tighter text-black dark:text-[#FFFFFF]/35">
                                      {variableDropdown && variableDropdown ? (
                                        <span
                                          className="flex items-start justify-start "
                                          style={{
                                            color: `${selectedTheme?.['textOpacity/50']}`,
                                          }}
                                        >
                                          {variableDropdown}
                                        </span>
                                      ) : (
                                        <span
                                          style={{
                                            color: `${selectedTheme?.['textOpacity/50']}`,
                                          }}
                                        >
                                          Set Variable Type
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                }
                                items={
                                  variableDropdownType &&
                                  variableDropdownType.map((item) => ({
                                    key: item.key,
                                    label: item.label,
                                  }))
                                }
                                selectionMode="single"
                                selectedKey={variableDropdown}
                                setSelected={handleVariableDropdownChange}
                                listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                                listItemColor={`${selectedTheme && selectedTheme?.text}`}
                                btncolor={`${selectedTheme?.bgCard}`}
                                buttonClassName={
                                  'pl-[1vw] font-semibold w-[13.64vw] h-[4.07vh] bg-gray-500/25 torus-pressed:animate-torusButtonActive'
                                }
                                popoverClassName="w-[13.64vw]"
                                listBoxClassName="bg-white text-black text-[0.83vw]"
                                labelClassName="text-black font-[500] text-[0.62vw] pl-[0.25vw]"
                              />
                            </span>
                          </div>
                        </div>
                        <div className=" mt-3 flex w-[100%] items-center justify-end gap-8">
                          <span>
                            <TorusButton
                              buttonClassName=" dark:bg-[#0F0F0F] dark:border dark:border-[#212121] bg-gray-300/25 w-[5vw] h-[4.07vh]  rounded-md flex justify-center items-center"
                              Children={
                                <div className="flex h-full w-[100%]  items-center justify-end gap-1">
                                  <p className="w-full text-[0.73vw] font-semibold  text-black  ">
                                    Cancel
                                  </p>
                                </div>
                              }
                              onPress={() => {
                                close();
                                setVariableDropdown(null);
                                setVariableInput(null);
                              }}
                            />
                          </span>
                          <span>
                            <TorusButton
                              buttonClassName=" dark:bg-[#0F0F0F] dark:border dark:border-[#212121] bg-[#0736C4] w-[5vw] h-[4.07vh]  rounded-md flex justify-center items-center"
                              Children={
                                <div className="flex h-full w-[100%]  items-center justify-end gap-1">
                                  <p className="w-full text-[0.73vw] font-semibold  text-white  ">
                                    Save
                                  </p>
                                </div>
                              }
                              onPress={() => {
                                handleAddNewVariable(
                                  variableInput,
                                  variableDropdown,
                                  data,
                                  close,
                                );
                              }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  dialogbackground={`${selectedTheme?.bg}`}
                />
              </>
            )}
            <span
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <NavbarArrowDown
                stroke={selectedTheme && selectedTheme?.text}
                className={`h-[0.83vw] w-[0.83vw] transition-all duration-75 ease-in-out ${open && data?.schema && data?.schema.length > 0 ? '' : 'rotate-[-90deg]'}`}
              />
            </span>
          </span>
        </div>

        {open && data?.schema && data?.schema.length > 0 && (
          <div
            className={`flex flex-col gap-2 border-l-1 border-r-1 border-b-1 rounded-bl-md rounded-br-md py-[1.5vh] pl-[0.85vw] pr-[0.35vw]`}
            style={{
              backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
              borderColor: `${selectedTheme && selectedTheme?.border}`,
            }}
          >
            {data?.schema.map((key, keyIndex) => (
              <div
                style={{ pointerEvents: 'all' }}
                className=" relative  flex  w-full cursor-grab flex-col gap-2   "
                onDoubleClick={() => {
                  handleifo(data?.nodeId, key.name, data, key.type, edges);
                }}
                key={keyIndex}
              >
                <div
                  className={`flex w-[100%] justify-between rounded-l-md p-2 text-[0.72vw] font-normal leading-[2.22vh] `}
                  style={{
                    backgroundColor: `${
                      colorChange(key.name)
                        ? `${selectedAccntColor}60`
                        : `${selectedTheme?.bg}`
                    }`,
                  }}
                >
                  <span className="flex w-[95%] justify-between">
                    <span
                      style={{
                        color: `${
                          colorChange(key.name)
                            ? `${selectedTheme?.text}`
                            : `${selectedTheme?.['textOpacity/50']}`
                        }`,
                      }}
                    >
                      {console.log(key, 'ifo')}
                      {key.name}
                    </span>
                    {key.showIcon && (
                      <span>
                        <DoNewIcon size={18} />
                      </span>
                    )}
                    <span
                      style={{
                        color: `${
                          colorChange(key.name)
                            ? `${selectedTheme?.text}`
                            : `${selectedTheme?.['textOpacity/50']}`
                        }`,
                      }}
                    >
                      {key.type}
                    </span>
                  </span>
                </div>
                {
                  <>
                    <div
                      className={`absolute right-[-0.1vw]  ml-3 h-[100%] w-[2%] rounded-r-md  `}
                      style={{
                        backgroundColor: `${color(`${data?.nodeId}|${key.name}`)}`,
                      }}
                    />
                    <Handle
                      isConnectable={true}
                      id={`${id}|${data?.nodeId}|${key.name}`}
                      position={Position.Right}
                      type="source"
                      style={{
                        right: '-0.5vw',
                        backgroundColor: color(`${data?.nodeId}|${key.name}`),
                        width: '0.5vw',
                        height: '0.5vw',
                      }}
                    />
                  </>
                }
              </div>
            ))}

            {/* {data &&
              data.ifo &&
              data?.ifo
                .filter(
                  (info) =>
                    !data?.schema.some((key) => key.name === info.nodeName),
                )
                .map((key, keyIndex) => (
                  <div
                    style={{ pointerEvents: 'all' }}
                    className=" relative  flex  w-full cursor-grab flex-col gap-2   "
                    key={keyIndex}
                  >
                    <div
                      onDoubleClick={() => {
                        handleifo(
                          data?.nodeId,
                          key.nodeName,
                          data,
                          key.type,
                          edges,
                        );
                      }}
                      className={`flex w-[100%] justify-between rounded-md p-2 text-[0.72vw] font-normal leading-[2.22vh] `}
                      style={{
                        color: `${selectedTheme?.bg}`,
                        backgroundColor: `#D0D8F2`,
                        borderColor: `${selectedTheme?.bgCard}`,
                      }}
                    >
                      <span className="flex w-[95%] justify-between">
                        <span>{key?.nodeName}</span>
                        <span>
                          <DoNewIcon size={18} />
                        </span>
                        <span>{key?.type}</span>
                      </span>
                    </div>
                    <div
                      className={`absolute right-[-0.1vw]  ml-3 h-[100%] w-[2%] rounded-r-md `}
                      style={{
                        backgroundColor: `${color(`${data?.nodeName}.${key.nodeName}`)}`,
                      }}
                    />
                    <Handle
                      isConnectable={true}
                      id={`${id}.${data?.nodeId}.${key.nodeName}`}
                      position={Position.Right}
                      type="source"
                      style={{
                        right: '-0.5vw',
                        backgroundColor: color(
                          `${data?.nodeId}.${key.nodeName}`,
                        ),
                        width: '0.5vw',
                        height: '0.5vw',
                      }}
                    />
                  </div>
                ))} */}
          </div>
        )}
      </div>
    </div>
  );
};

const PoSourceObject = ({ data, id, color, keyIndex, items }) => {
  const [open, setOpen] = useState(true);

  const [doubleClicked, setDoubleClicked] = useState({});
  const [variableInput, setVariableInput] = useState(null);
  const [variableDropdown, setVariableDropdown] = useState(null);

  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);
  const { nodes, edges, setMappedData, mappedData } =
    useContext(OrchestratorContext);
  const [variableDropdownType, setVariableDropdownType] = useState([
    {
      key: 'string',
      label: 'string',
    },
    {
      key: 'integer',
      label: 'integer',
    },
    {
      key: 'boolean',
      label: 'boolean',
    },
  ]);

  const colorChange = useCallback(
    (key) => {
      if (data.ifo && data.ifo.length > 0) {
        const index = data.ifo.findIndex((ifo) => {
          return (
            ifo.path ===
            data.selectedDropdownName + '|' + data?.nodeId + '|' + key
          );
        });
        if (index > -1) {
          return true;
        }
        return false;
      }
      return false;
    },
    [data],
  );

  console.log(data, 'datadopssss');
  const handleifo = (id, key, type, name, edges) => {
    if (data.nodeId === id) {
      console.log(id, key, data, type, edges, 'datadop');
      const newInfo = {
        path: data?.selectedDropdownName + '|' + data?.nodeId + '|' + key,
        nodeId: data?.nodeId,
        nodeName: data?.nodeName,
        type: type,
        name: name,
        key: key,
        artifact: data?.selectedDropdownName,
      };

      console.log(newInfo, data, edges, 'datadinfoedge');
      if (
        !data.ifo ||
        !data.ifo.find((existingInfo) => {
          return existingInfo.path === newInfo.path;
        })
      ) {
        data.ifo = data.ifo || [];
        data.ifo.push(newInfo);
        setMappedData((prev) => {
          return {
            ...prev,
            artifact: {
              ...prev.artifact,
              node: prev?.artifact?.node.map((item) => {
                edges &&
                  edges.forEach((edge) => {
                    const targetHandleParts = edge.targetHandle.split('|')[1];
                    const sourceHandleParts = edge.sourceHandle
                      .split('|')
                      .slice(1)
                      .join('|');
                    console.log(
                      item,
                      targetHandleParts,
                      item?.nodeId,
                      sourceHandleParts,
                      data?.selectedDropdownName,
                      data?.selectedDropdownName.split('|').slice(1).join('|') +
                        '|' +
                        data?.nodeId,
                      'handlenew1',
                    );

                    if (
                      targetHandleParts === item.nodeId &&
                      sourceHandleParts ===
                        data?.selectedDropdownName
                          .split('|')
                          .slice(1)
                          .join('|') +
                          '|' +
                          data?.nodeId
                    ) {
                      if (
                        item.ifo &&
                        item.ifo.length > 0 &&
                        !item.ifo.find((ifo) => ifo.path === newInfo.path)
                      ) {
                        item.ifo = [...item.ifo, newInfo];
                      } else if (!item.ifo || item.ifo.length === 0) {
                        item.ifo = data.ifo;
                      }
                    }
                  });
                return item;
              }),
            },
          };
        });
      }

      if (
        doubleClicked[
          data?.selectedDropdownName + '|' + data?.nodeId + '|' + key
        ]
      ) {
        data.ifo = data.ifo.filter(
          (info) =>
            info.path !==
            data?.selectedDropdownName + '|' + data?.nodeId + '|' + key,
        );
        setMappedData((prev) => {
          return {
            ...prev,
            artifact: {
              ...prev.artifact,
              node: prev?.artifact?.node.map((item) => {
                edges &&
                  edges.forEach((edge) => {
                    const targetHandleParts = edge.targetHandle.split('|')[1];
                    const sourceHandleParts = edge.sourceHandle
                      .split('|')
                      .slice(1)
                      .join('|');
                    console.log(
                      targetHandleParts[targetHandleParts.length - 1],
                      'datadhp',
                    );
                    if (
                      targetHandleParts === item.nodeId &&
                      sourceHandleParts ===
                        data?.selectedDropdownName
                          .split('|')
                          .slice(1)
                          .join('|') +
                          '|' +
                          data?.nodeId
                    ) {
                      if (item.ifo) {
                        item.ifo = item.ifo.filter(
                          (ifo) =>
                            ifo.path !==
                            data?.selectedDropdownName +
                              '|' +
                              data?.nodeId +
                              '|' +
                              key,
                        );
                      }
                    }
                  });
                return item;
              }),
            },
          };
        });

        setDoubleClicked((prev) => ({
          ...prev,
          [data?.selectedDropdownName + '|' + data?.nodeId + '|' + key]: false,
        }));
        return;
      }

      setDoubleClicked((prev) => ({
        ...prev,
        [data?.selectedDropdownName + '|' + data?.nodeId + '|' + key]: true,
      }));

      return data;
    }
  };
  const handleifoNew = (id, key, data, type, edges) => {
    if (data.nodeId === id) {
      data.ifo = data.ifo.filter(
        (info) =>
          info.path !==
          data?.selectedDropdownName + '|' + data?.nodeId + '|' + key,
      );
      setMappedData((prev) => {
        return {
          ...prev,
          artifact: {
            ...prev.artifact,
            node: prev?.artifact?.node.map((item) => {
              edges &&
                edges.forEach((edge) => {
                  const targetHandleParts = edge.targetHandle.split('|')[1];
                  const sourceHandleParts = edge.sourceHandle
                    .split('|')
                    .slice(1)
                    .join('|');
                  console.log(
                    targetHandleParts[targetHandleParts.length - 1],
                    'datadhp',
                  );
                  if (
                    targetHandleParts === item.nodeId &&
                    sourceHandleParts ===
                      data?.selectedDropdownName.split('|').slice(1).join('|') +
                        '|' +
                        data?.nodeId
                  ) {
                    if (item.ifo) {
                      item.ifo = item.ifo.filter(
                        (ifo) =>
                          ifo.path !==
                          data?.selectedDropdownName +
                            '|' +
                            data?.nodeId +
                            '|' +
                            key,
                      );
                    }
                  }
                });
              return item;
            }),
          },
        };
      });

      setDoubleClicked((prev) => ({
        ...prev,
        [data?.selectedDropdownName + '|' + data?.nodeId + '|' + key]: false,
      }));
      return;
    }

    return data;
  };

  console.log('datadedge', edges, nodes, mappedData);

  const handleVariableInputChange = (e) => {
    setVariableInput(e);
  };
  const handleVariableDropdownChange = (e) => {
    setVariableDropdown(e);
  };

  const handleAddNewVariable = (inputval, dropdownval, data, close) => {
    console.log(inputval, dropdownval, data, 'datadre');
    const newInfo = {
      path: data?.selectedDropdownName + '|' + data?.nodeId + '|' + inputval,
      nodeId: data?.nodeId,
      nodeName: data?.nodeName,
      artifact: data?.selectedDropdownName,
      key: inputval,
      name: inputval,
      type: Array.from(dropdownval)[0],
      showIcon: true,
    };
    if (
      !data.ifo ||
      !data.ifo.find((existingInfo) => {
        return existingInfo.path === newInfo.path;
      })
    ) {
      data.ifo = data.ifo || [];
      data.ifo.push(newInfo);

      setDoubleClicked((prev) => ({
        ...prev,
        [data?.selectedDropdownName + '|' + data?.nodeId + '|' + inputval]:
          true,
      }));

      setMappedData((prev) => {
        return {
          ...prev,
          artifact: {
            ...prev.artifact,
            node: prev?.artifact?.node.map((item) => {
              edges &&
                edges.forEach((edge) => {
                  const targetHandleParts = edge.targetHandle.split('|')[1];
                  const sourceHandleParts = edge.sourceHandle
                    .split('|')
                    .slice(1)
                    .join('|');
                  console.log(
                    item,
                    targetHandleParts,
                    item?.nodeId,
                    sourceHandleParts,
                    data?.selectedDropdownName,
                    data?.selectedDropdownName.split('|').slice(1).join('|') +
                      '|' +
                      data?.nodeId,
                    'handlenew1',
                  );

                  if (
                    targetHandleParts === item.nodeId &&
                    sourceHandleParts ===
                      data?.selectedDropdownName.split('|').slice(1).join('|') +
                        '|' +
                        data?.nodeId
                  ) {
                    if (
                      item.ifo &&
                      item.ifo.length > 0 &&
                      !item.ifo.find((ifo) => ifo.path === newInfo.path)
                    ) {
                      item.ifo = [...item.ifo, newInfo];
                    } else if (!item.ifo || item.ifo.length === 0) {
                      item.ifo = data.ifo;
                    }
                  }
                });
              return item;
            }),
          },
        };
      });
    }

    setVariableDropdown(null);
    setVariableInput(null);
    close();
  };

  // console.log(data, variableDropdown, variableInput, 'dataDO');

  return (
    <div className="px-[.5vw] py-[.3vw]">
      <div
        className="flex flex-col gap-[0.5vw] rounded-md"
        style={{
          backgroundColor: `${selectedTheme?.bgCard}`,
        }}
      >
        <div
          className=" relative flex cursor-pointer items-center justify-between rounded-md p-2 text-[0.72vw] font-normal leading-[2.22vh] "
          style={{
            backgroundColor: `${selectedTheme?.bgCard}`,
            color: `${selectedTheme?.text}`,
            border: `1px solid ${selectedTheme?.border}`,
          }}
        >
          <span onClick={() => setOpen(!open)} className="flex flex-col ">
            <span>{data.nodeName}</span>
            <span
              className="text-[0.62vw] font-normal leading-[2.22vh]"
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              {data?.nodeType}
            </span>
          </span>
          <span>
            <>
              <div
                className={`absolute bottom-[-0.01vw] right-[-0.05vw] h-[100%] w-[3%] ${open ? 'rounded-tr-md' : 'rounded-r-md'}  bg-[${color(`${data?.selectedDropdownName}|${data?.nodeId}`)}] `}
              />
              <Handle
                isConnectable={true}
                id={`${data?.selectedDropdownName}|${data?.nodeId}`}
                position={Position.Right}
                type="source"
                style={{
                  right: '-0.45vw',
                  backgroundColor: color(
                    `${data?.selectedDropdownName}|${data?.nodeId}`,
                  ),
                  width: '0.5vw',
                  height: '0.5vw',
                }}
              />
            </>
          </span>
          <span className="flex items-center justify-between gap-[1vw]">
            {data?.schema && data?.schema.length > 0 && (
              <TorusDialog
                key={'ADD Variable'}
                triggerElement={
                  <TorusButton
                    size={'md'}
                    radius={'lg'}
                    isIconOnly={true}
                    height={'md'}
                    Children={
                      <div
                        className="rounded-md "
                        style={{
                          backgroundColor: `${selectedAccntColor}`,
                        }}
                      >
                        <DoAddIcon size={18} color={'#FFFFFF'} />
                      </div>
                    }
                    fontStyle={'text-sm font-medium text-[#FFFFFF]'}
                  />
                }
                classNames={{
                  modalOverlayClassName: ' pt-[8.5%] items-start',
                  modalClassName:
                    ' h-[40.27vh]  w-[36.61vw] flex  justify-center items-center ',
                  dialogClassName:
                    ' w-full h-[30.27vh] border-0 focus:outline-none focus:ring-0 focus:border-0  rounded-lg flex-col bg-white  ',
                }}
                dialogbackground={`${selectedTheme?.bg}`}
                title={'Add'}
                message={'Add'}
                children={({ close }) => (
                  <div
                    className={` flex h-[60%] w-full flex-col justify-between rounded-lg  `}
                    style={{
                      backgroundColor: `${selectedTheme?.bg}`,
                    }}
                  >
                    <div className=" h-[10%] w-[100%] flex-row gap-3  p-2  ">
                      <div
                        className="flex w-[100%]  items-center justify-between gap-2 border-b  p-2 "
                        style={{
                          borderColor: `${selectedTheme?.border}`,
                        }}
                      >
                        <span
                          className=" text-[0.72vw] font-bold "
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          <span>Add Variable</span>
                        </span>
                        <span
                          className="flex cursor-pointer items-center  rounded-md  transition-all duration-200  "
                          onClick={() => {
                            close();
                            setVariableDropdown(null);
                            setVariableInput(null);
                          }}
                        >
                          <IoCloseOutline
                            size={18}
                            className="  text-black dark:text-white"
                          />
                        </span>
                      </div>
                      <div
                        className=" w-[100%] border-b "
                        style={{
                          borderColor: `${selectedTheme?.border}`,
                        }}
                      >
                        <div className="flex items-center justify-between  p-2">
                          <span
                            className="text-[0.72vw] font-bold"
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            Variable Name*
                          </span>
                          <span>
                            <TorusModularInput
                              isRequired={true}
                              type="text"
                              placeholder="Enter here"
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
                              backgroundColor={
                                'bg-gray-300/25 dark:bg-[#0F0F0F]'
                              }
                              onChange={(e) => {
                                handleVariableInputChange(e);
                              }}
                              value={variableInput ? variableInput : ''}
                              textSize={'text-[0.83vw]'}
                              inputClassName={'px-[0.25vw] py-[0.55vh]'}
                              wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                            />
                          </span>
                        </div>
                        <div className="flex w-[100%] items-center justify-between  p-2">
                          <span
                            className="w-[63%]  text-[0.72vw]  font-bold "
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            Type*
                          </span>
                          <span className="w-[36%]">
                            <TorusDropDown
                              title={
                                <div className="flex flex-col items-baseline justify-center ">
                                  <span className="font-inter  h-[4vh]  px-[0.5vw]  text-left text-[0.62vw]  font-normal tracking-tighter text-black dark:text-[#FFFFFF]/35">
                                    {variableDropdown && variableDropdown ? (
                                      <span
                                        className="flex items-start justify-start "
                                        style={{
                                          color: `${selectedTheme?.['textOpacity/50']}`,
                                        }}
                                      >
                                        {variableDropdown}
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          color: `${selectedTheme?.['textOpacity/50']}`,
                                        }}
                                      >
                                        Set Variable Type
                                      </span>
                                    )}
                                  </span>
                                </div>
                              }
                              items={
                                variableDropdownType &&
                                variableDropdownType.map((item) => ({
                                  key: item.key,
                                  label: item.label,
                                }))
                              }
                              selectionMode="single"
                              selectedKey={variableDropdown}
                              setSelected={handleVariableDropdownChange}
                              listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                              listItemColor={`${selectedTheme && selectedTheme?.text}`}
                              btncolor={`${selectedTheme?.bgCard}`}
                              buttonClassName={
                                'pl-[1vw] font-semibold w-[13.64vw] h-[4.07vh] bg-gray-500/25 torus-pressed:animate-torusButtonActive'
                              }
                              popoverClassName="w-[13.64vw]"
                              listBoxClassName="bg-white text-black text-[0.83vw]"
                              labelClassName="text-black font-[500] text-[0.62vw] pl-[0.25vw]"
                            />
                          </span>
                        </div>
                      </div>
                      <div className=" mt-3 flex w-[100%] items-center justify-end gap-8">
                        <span>
                          <TorusButton
                            buttonClassName=" dark:bg-[#0F0F0F] dark:border dark:border-[#212121] bg-gray-300/25 w-[5vw] h-[4.07vh]  rounded-md flex justify-center items-center"
                            Children={
                              <div className="flex h-full w-[100%]  items-center justify-end gap-1">
                                <p className="w-full text-[0.73vw] font-semibold  text-black  ">
                                  Cancel
                                </p>
                              </div>
                            }
                            onPress={() => {
                              close();
                              setVariableDropdown(null);
                              setVariableInput(null);
                            }}
                          />
                        </span>
                        <span>
                          <TorusButton
                            buttonClassName=" dark:bg-[#0F0F0F] dark:border dark:border-[#212121] bg-[#0736C4] w-[5vw] h-[4.07vh]  rounded-md flex justify-center items-center"
                            Children={
                              <div className="flex h-full w-[100%]  items-center justify-end gap-1">
                                <p className="w-full text-[0.73vw] font-semibold  text-white  ">
                                  Save
                                </p>
                              </div>
                            }
                            onPress={() => {
                              handleAddNewVariable(
                                variableInput,
                                variableDropdown,
                                data,
                                close,
                              );
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
            <span
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <NavbarArrowDown
                stroke={selectedTheme && selectedTheme?.text}
                className={`h-[0.83vw] w-[0.83vw] transition-all duration-75 ease-in-out ${open && data?.schema && data?.schema.length > 0 ? '' : 'rotate-[-90deg]'}`}
              />
            </span>
          </span>
        </div>

        {open && data?.schema && data?.schema.length > 0 && (
          <div
            className=" flex flex-col gap-2 rounded-bl-md rounded-br-md py-[1.5vh] pl-[0.35vw] pr-[0.35vw]"
            style={{
              backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
            }}
          >
            {data?.schema.map((key, keyIndex) => (
              <div
                style={{ pointerEvents: 'all' }}
                className=" relative  flex  w-full cursor-grab flex-col gap-2   "
                onDoubleClick={() => {
                  handleifo(data?.nodeId, key.id, key.type, key.name, edges);
                }}
                key={keyIndex}
              >
                <div
                  className={`flex justify-between rounded-md  p-2 text-[0.72vw] font-normal leading-[2.22vh] `}
                  style={{
                    backgroundColor: `${colorChange(key.id) ? `${selectedAccntColor}80` : `${selectedTheme?.bg}`}`,
                    color: `${colorChange(key.id) ? `${selectedTheme?.text}` : `${selectedTheme?.['textOpacity/50']}`}`,
                  }}
                >
                  <span>{key.name}</span>
                  <span>{key.type}</span>
                </div>
              </div>
            ))}

            {data &&
              data?.schema.length !== 0 &&
              data.ifo &&
              data?.ifo
                .filter(
                  (info) => !data?.schema.some((key) => key.name === info.name),
                )
                .map((key, keyIndex) => (
                  <div
                    style={{ pointerEvents: 'all' }}
                    className=" relative  flex  w-full cursor-grab flex-col gap-2   "
                    key={keyIndex}
                    onDoubleClick={() => {
                      handleifoNew(
                        data?.nodeId,
                        key.name,
                        data,
                        key.type,
                        edges,
                      );
                    }}
                  >
                    <div
                      className={`flex w-[100%] justify-between rounded-l-md  bg-[#D0D8F2]  p-2 text-[0.72vw] font-normal leading-[2.22vh] text-black`}
                    >
                      <span className="flex w-[70%] justify-between">
                        <span>{key.name}</span>
                        <span>
                          <DoNewIcon size={18} />
                        </span>
                      </span>
                      <span>{key.type}</span>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UoSourceObject = ({ data, id, color, keyIndex, items }) => {
  const [open, setOpen] = useState(true);

  const [doubleClicked, setDoubleClicked] = useState({});
  const [variableInput, setVariableInput] = useState(null);
  const [variableDropdown, setVariableDropdown] = useState(null);

  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);
  const { edges, setEdges, setMappedData, mappedData } =
    useContext(OrchestratorContext);
  const [variableDropdownType, setVariableDropdownType] = useState([
    {
      key: 'string',
      label: 'string',
    },
    {
      key: 'integer',
      label: 'integer',
    },
    {
      key: 'boolean',
      label: 'boolean',
    },
  ]);
  const colorChange = useCallback(
    (key) => {
      if (data.ifo && data.ifo.length > 0) {
        const index = data.ifo.findIndex((ifo) => {
          return ifo?.path === id + '|' + data?.nodeId + '|' + key;
        });
        if (index > -1) {
          return true;
        }
        return false;
      }
      return false;
    },
    [data],
  );

  console.log(data, items, 'datadopssss');
  const handleifo = (id, key, data, type, edges, items) => {
    console.log(id, key, data, type, edges, 'datadop');
    const newInfo = {
      path: id + '|' + data?.nodeId + '|' + key,
      name: key,
      key: key,
      artifact: id,
      nodeId: data?.nodeId,
      nodeName: data?.nodeName,
      type: type,
    };
    console.log(doubleClicked, 'datadedge');
    if (
      !doubleClicked?.[id + '|' + data?.nodeId + '|' + key] &&
      (!data.ifo ||
        data.ifo.findIndex(
          (existingInfo) => existingInfo.path === newInfo.path,
        ) === -1)
    ) {
      data.ifo = data.ifo || [];
      data.ifo.push(newInfo);
      console.log('datadedge add');
      // setMappedData((prev) => {
      //   edges.forEach((edge) => {
      //     if (edge.sourceHandle === newInfo.path) {
      //       let targetHandleSplit = edge.targetHandle.split('|');
      //       if (prev && prev.artifact && prev.artifact.node) {
      //         const returnData = prev.artifact.node.map((item) => {
      //           if (item.nodeId === targetHandleSplit[1]) {
      //             if (targetHandleSplit.length === 2) {
      //               if (item.nodeId === targetHandleSplit[1]) {
      //                 if (
      //                   item.ifo &&
      //                   item.ifo.length > 0 &&
      //                   item.ifo.findIndex(
      //                     (ifo) => ifo.path === newInfo.path,
      //                   ) === -1
      //                 ) {
      //                   item.ifo.push(newInfo);
      //                 } else if (_.isEmpty(item?.ifo)) {
      //                   item.ifo = [newInfo];
      //                 }
      //               }
      //             } else if (targetHandleSplit.length === 3) {
      //               item.objElements.map((element) => {
      //                 if (element.elementId === targetHandleSplit[2]) {
      //                   if (
      //                     element.ifo &&
      //                     element.ifo.length > 0 &&
      //                     element.ifo.findIndex(
      //                       (ifo) => ifo.path === newInfo.path,
      //                     ) === -1
      //                   ) {
      //                     element.ifo.push(newInfo);
      //                   } else if (_.isEmpty(element?.ifo)) {
      //                     element.ifo = [newInfo];
      //                   }
      //                 }
      //                 return element;
      //               });
      //             }
      //           }
      //           return item;
      //         });
      //         prev = {
      //           ...prev,
      //           artifact: { ...prev.artifact, node: returnData },
      //         };
      //       }
      //     }
      //   });
      //   return prev;
      // });
    }
    if (doubleClicked?.[id + '|' + data?.nodeId + '|' + key]) {
      const findEdge = edges.filter((edge) => {
        const sourcehandlesplit = edge.sourceHandle.split('|');
        sourcehandlesplit.shift();

        const splittedsource = sourcehandlesplit.join('|');
        const findedIfo = data?.nodeId + '|' + key;
        console.log(findedIfo, splittedsource, 'findedge');
        return findedIfo !== splittedsource;
      });
      console.log('datadedge remove');
      // setMappedData((prev) => {
      //   if (prev && prev.artifact && prev.artifact.node) {
      //     const returnData = prev.artifact.node.map((item) => {
      //       if (Array.isArray(item?.objElements)) {
      //         item = {
      //           ...item,
      //           objElements: item?.objElements?.map((element) => {
      //             if (!_.isEmpty(element?.ifo)) {
      //               element = {
      //                 ...element,
      //                 ifo: element?.ifo?.filter(
      //                   (ifo) =>
      //                     ifo?.path !== id + '|' + data?.nodeId + '|' + key,
      //                 ),
      //               };
      //               return element;
      //             } else return element;
      //           }),
      //         };
      //       }
      //       if (!_.isEmpty(item?.ifo)) {
      //         item = {
      //           ...item,
      //           ifo: item?.ifo?.filter(
      //             (ifo) => ifo?.path !== id + '|' + data?.nodeId + '|' + key,
      //           ),
      //         };
      //       }

      //       return item;
      //     });
      //     return {
      //       ...prev,
      //       artifact: { ...prev.artifact, node: returnData },
      //     };
      //   } else return prev;
      // });
      setEdges(findEdge);
      data.ifo = data.ifo.filter(
        (info) => info?.path !== id + '|' + data?.nodeId + '|' + key,
      );

      data.schema = data.schema.filter((item) => {
        return !(item.name === key && item.showIcon);
      });

      setDoubleClicked((prev) => ({
        ...prev,
        [id + '|' + data?.nodeId + '|' + key]: false,
      }));
    } else {
      setDoubleClicked((prev) => ({
        ...prev,
        [id + '|' + data?.nodeId + '|' + key]: true,
      }));
    }
  };

  useEffect(() => {
    if (data) {
      data?.ifo &&
        data?.ifo.length > 0 &&
        data?.ifo.forEach((item) => {
          setDoubleClicked((prev) => ({
            ...prev,
            [item.path]: true,
          }));
        });
    }
  }, []);
  console.log('datadedge', mappedData, edges);

  const handleVariableInputChange = (e) => {
    setVariableInput(e);
  };
  const handleVariableDropdownChange = (e) => {
    setVariableDropdown(e);
  };

  const handleAddNewVariable = (inputval, dropdownval, data, close) => {
    console.log(inputval, dropdownval, 'dataDO');

    const newInfo = {
      path: id + '|' + data.nodeId + '|' + inputval,
      name: inputval,
      key: inputval,
      artifact: id,
      nodeId: data?.nodeId,
      nodeName: data?.nodeName,
      type: Array.from(dropdownval)[0],
      showIcon: true,
    };
    if (
      !data.ifo ||
      !data.ifo.find((existingInfo) => {
        return existingInfo.path === newInfo.path;
      })
    ) {
      data.ifo = data.ifo || [];
      data.ifo.push(newInfo);
      data.schema.push(newInfo);
      setDoubleClicked((prev) => ({
        ...prev,
        [newInfo.path]: true,
      }));
    }
    setVariableDropdown(null);
    setVariableInput(null);
    close();
  };

  return (
    <div
      className="mt-0 flex flex-col rounded-bl-md rounded-br-md px-[.5vw] py-[.3vw]"
      style={{
        backgroundColor: `${selectedTheme?.bg}`,
      }}
    >
      <div
        className={` flex cursor-pointer items-center justify-between ${open && data?.schema?.length > 0 ? 'rounded-tl-md rounded-tr-md' : 'rounded-md'} p-2 text-[0.72vw] font-normal leading-[2.22vh] `}
        style={{
          backgroundColor: `${selectedTheme?.bgCard}`,
          color: `${selectedTheme?.text}`,
        }}
      >
        <span onClick={() => setOpen(!open)} className="flex flex-col ">
          <span>{data.nodeName}</span>
          <span
            className="text-[0.62vw] font-normal leading-[2.22vh]"
            style={{
              color: `${selectedTheme?.text}80`,
            }}
          >
            {data?.nodeType}
          </span>
        </span>
        <span className="flex items-center justify-between gap-[1vw]">
          {data?.schema.length > 0 && (
            <TorusDialog
              key={'ADD Variable'}
              triggerElement={
                <TorusButton
                  size={'md'}
                  radius={'lg'}
                  isIconOnly={true}
                  height={'md'}
                  Children={
                    <div
                      className="rounded-md"
                      style={{
                        backgroundColor: `${selectedAccntColor}`,
                      }}
                    >
                      <DoAddIcon size={18} color={'#FFFFFF'} />
                    </div>
                  }
                  fontStyle={'text-sm font-medium text-[#FFFFFF]'}
                />
              }
              classNames={{
                modalOverlayClassName: ' pt-[8.5%] items-start',
                modalClassName:
                  ' h-[40.27vh]  w-[36.61vw]  flex  justify-center items-center ',
                dialogClassName: `w-full h-[30.27vh] border-0 focus:outline-none focus:ring-0 focus:border-0 border   rounded-lg flex-col bg-white`,
              }}
              dialogbackground={`${selectedTheme?.bg}`}
              title={'Add'}
              message={'Add'}
              children={({ close }) => (
                <div
                  className={` flex h-[60%] w-full flex-col justify-between rounded-lg`}
                >
                  <div className=" h-[10%] w-[100%] flex-row gap-3  p-2  ">
                    <div
                      className="flex w-[100%]  items-center justify-between gap-2 border-b p-2 "
                      style={{
                        borderColor: `${selectedTheme?.border}`,
                      }}
                    >
                      <span className=" text-[0.72vw] font-bold  ">
                        <span
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Add Variable
                        </span>
                      </span>
                      <span
                        className="flex cursor-pointer items-center  rounded-md  transition-all duration-200  "
                        onClick={() => {
                          close();
                          setVariableDropdown(null);
                          setVariableInput(null);
                        }}
                      >
                        <IoCloseOutline
                          size={18}
                          className="  text-black dark:text-white"
                        />
                      </span>
                    </div>
                    <div
                      className=" w-[100%] border-b "
                      style={{
                        borderColor: `${selectedTheme?.border}`,
                      }}
                    >
                      <div className="flex items-center justify-between  p-2">
                        <span
                          className="flex flex-col text-[0.72vw] font-bold"
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Variable Name*
                          <span
                            className="text-[0.62vw] font-normal leading-[2.22vh]"
                            style={{
                              color: `${selectedTheme?.['textOpacity/50']}`,
                            }}
                          >
                            Set the name of the variable.
                          </span>
                        </span>
                        <span className="w-[50%]">
                          <TorusModularInput
                            isRequired={true}
                            type="text"
                            placeholder="Enter Variable Name"
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
                            onChange={(e) => {
                              handleVariableInputChange(e);
                            }}
                            value={variableInput ? variableInput : ''}
                            textSize={'text-[0.83vw]'}
                            inputClassName={'px-[0.25vw] py-[0.55vh]'}
                            wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                          />
                        </span>
                      </div>
                      <div className="flex w-[100%] items-center justify-between  p-2">
                        <span
                          className="flex flex-col text-[0.72vw] font-bold"
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Type*
                          <span
                            className="text-[0.62vw] font-normal leading-[2.22vh]"
                            style={{
                              color: `${selectedTheme?.['textOpacity/50']}`,
                            }}
                          >
                            Set the type of the variable.
                          </span>
                        </span>
                        <span className="w-[50%]">
                          <TorusDropDown
                            title={
                              <div className="flex flex-col items-baseline justify-center ">
                                <span className="font-inter flex h-[4vh] items-center justify-center bg-transparent px-[0.5vw]  text-left text-[0.62vw]  font-normal tracking-tighter text-black dark:text-[#FFFFFF]/35">
                                  {variableDropdown && variableDropdown ? (
                                    <span
                                      className="flex items-start justify-start "
                                      style={{
                                        color: `${selectedTheme?.['textOpacity/50']}`,
                                      }}
                                    >
                                      {variableDropdown}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        color: `${selectedTheme?.['textOpacity/50']}`,
                                      }}
                                    >
                                      Set Variable Type
                                    </span>
                                  )}
                                </span>
                              </div>
                            }
                            items={
                              variableDropdownType &&
                              variableDropdownType.map((item) => ({
                                key: item.key,
                                label: item.label,
                              }))
                            }
                            selectionMode="single"
                            selectedKey={variableDropdown}
                            setSelected={handleVariableDropdownChange}
                            // darkMode={darkMode}
                            listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                            listItemColor={`${selectedTheme && selectedTheme?.text}`}
                            btncolor={`${selectedTheme?.bgCard}`}
                            buttonClassName={
                              'pl-[1vw] font-semibold w-[13.64vw] h-[4.07vh] bg-gray-500/25 torus-pressed:animate-torusButtonActive'
                            }
                            popoverClassName="w-[13.64vw]"
                            listBoxClassName="bg-white text-black text-[0.83vw]"
                            labelClassName="text-black font-[500] text-[0.62vw] pl-[0.25vw]"
                          />
                        </span>
                      </div>
                    </div>
                    <div className=" mt-3 flex w-[100%] items-center justify-end gap-8">
                      <span>
                        <TorusButton
                          buttonClassName=" dark:bg-[#0F0F0F] dark:border dark:border-[#212121] bg-gray-300/25 w-[5vw] h-[4.07vh]  rounded-md flex justify-center items-center"
                          Children={
                            <div className="flex h-full w-[100%]  items-center justify-end gap-1">
                              <p
                                className="0 w-full text-[0.73vw] font-semibold "
                                style={{
                                  color: `${selectedTheme?.['textOpacity/50']}`,
                                }}
                              >
                                Cancel
                              </p>
                            </div>
                          }
                          onPress={() => {
                            close();
                            setVariableDropdown(null);
                            setVariableInput(null);
                          }}
                        />
                      </span>
                      <span>
                        <TorusButton
                          buttonClassName=" dark:bg-[#0F0F0F] dark:border dark:border-[#212121] bg-[#0736C4] w-[5vw] h-[4.07vh]  rounded-md flex justify-center items-center"
                          Children={
                            <div className="flex h-full w-[100%]  items-center justify-end gap-1">
                              <p className="w-full text-[0.73vw] font-semibold  text-white  ">
                                Save
                              </p>
                            </div>
                          }
                          onPress={() => {
                            handleAddNewVariable(
                              variableInput,
                              variableDropdown,
                              data,
                              close,
                            );
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            />
          )}
          <span
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <NavbarArrowDown
              stroke={selectedTheme && selectedTheme?.text}
              className={`h-[0.83vw] w-[0.83vw] transition-all duration-75 ease-in-out ${open && data?.schema && data?.schema.length > 0 ? '' : 'rotate-[-90deg]'}`}
            />
          </span>
        </span>
      </div>

      {open && data?.schema && data?.schema.length > 0 && (
        <div
          className=" flex flex-col gap-2 rounded-bl-md rounded-br-md py-[1.5vh] pl-[0.85vw] pr-[0.35vw]"
          style={{
            backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
          }}
        >
          {data?.schema.map((key, keyIndex) => (
            <div
              style={{ pointerEvents: 'all' }}
              className=" relative  flex  w-full cursor-grab flex-col gap-2   "
              onDoubleClick={() => {
                handleifo(id, key.name, data, key.type, edges, items);
              }}
              key={keyIndex}
            >
              <div
                className={`flex justify-between rounded-l-md rounded-r-md  p-2 text-[0.72vw] font-normal leading-[2.22vh]`}
                style={{
                  backgroundColor: `${
                    colorChange(key.name)
                      ? `${selectedAccntColor}60`
                      : `${selectedTheme?.bg}`
                  }`,
                }}
              >
                <span className="flex w-[95%] justify-between">
                  <span
                    style={{
                      color: `${
                        colorChange(key.name)
                          ? `${selectedTheme?.text}`
                          : `${selectedTheme?.['textOpacity/50']}`
                      }`,
                    }}
                  >
                    {key.name}
                  </span>
                  {key.showIcon && (
                    <span>
                      <DoNewIcon size={18} />
                    </span>
                  )}
                  <span
                    style={{
                      color: `${
                        colorChange(key.name)
                          ? `${selectedTheme?.text}`
                          : `${selectedTheme?.['textOpacity/50']}`
                      }`,
                    }}
                  >
                    {key.type}
                  </span>
                </span>
              </div>
              {
                <>
                  <div
                    className={`absolute right-[-0.1vw]  ml-3 h-[100%] w-[2%] rounded-r-md bg-[${color(`${data?.nodeName}|${key.name}`)}] `}
                  />
                  <Handle
                    isConnectable={true}
                    id={`${id}|${data?.nodeId}|${key.name}`}
                    position={Position.Right}
                    type="source"
                    style={{
                      right: '-0.5vw',
                      backgroundColor: color(`${data?.nodeId}|${key.name}`),
                      width: '0.5vw',
                      height: '0.5vw',
                    }}
                  />
                </>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
