import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactFlow, {
  addEdge,
  MarkerType,
  Panel,
  updateEdge,
  useReactFlow,
} from 'reactflow';
import CustomDoEdge from './CustomDoEdge';
import SourceGallery from './DO_Gallery/SourceGallery';
import TargetGallery from './DO_Gallery/TargetGallery';

import _ from 'lodash';
import { isLightColor } from '../asset/themes/useTheme';
import {
  getDFAPI,
  poEventsEjs,
  saveSubflow,
} from '../commonComponents/api/orchestratorApi';
import { TorusModellerContext } from '../Layout';
import {
  LogicCenterSVG,
  LogicScreenEnlargement,
  Save,
} from '../SVG_Application';
import TorusButton from '../torusComponents/TorusButton';
import TorusDialog from '../torusComponents/TorusDialog';
import TorusTitle from '../torusComponents/torusTitle';
import {
  calculatePositionX,
  calculatePositionY,
  pendingToast,
  updateToast,
} from '../utils/utils';
import SourceObjects from './DO_Accordian/sourceObjects';
import TargetAccordionMenu from './DO_Accordian/targetAccordian';
import LogicCenterMain from './DO_Logic_Screen/LogicCenterMain';
const NODETYPES = {
  customSourceItems: SourceObjects,
  customTargetItems: TargetAccordionMenu,
};
const EDGETYPE = {
  customDoEdge: CustomDoEdge,
};
export const OrchestratorContext = createContext();
const APPDO = ({
  nodes,
  edges,
  setEdges,
  setNodes,
  onNodesChange,
  onEdgesChange,
  children,
  proOptions,
}) => {
  const {
    selectedTenant,
    selectedSubFlow,
    selectedFabric,
    client,
    sessionToken,
    redisKey,
    selectedAccntColor,
  } = useContext(TorusModellerContext);

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([' ']);
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState({});
  const [allNodes, setallnodes] = useState({});
  const { setViewport } = useReactFlow();
  const [setreactflowinstance] = useState(null);
  const edgeUpdateSuccessful = useRef(true);
  const [currentArtifact, setCurrentArtifact] = useState('');
  const [mappedData, setMappedData] = useState({
    source: [],
    target: [],
  });

  const [securityData, setSecurityData] = useState({
    afk: '',
    accessProfile: [],
    securityTemplate: {},
  });
  const [sourceDraggable, setSourceDraggable] = useState(false);
  const [targetDraggable, setTargetDraggable] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(-1);
  const [targetIndex, setTargetIndex] = useState(-1);
  const [securityTarget, setSecurityTarget] = useState(null);

  const [wordLength, setWordLength] = useState(0);

  const [selectedArtifactForLogic, setSelectedArtifactForLogic] =
    useState(null);
  const hasRunRef = useRef(false);

  const onConnect = useCallback((params) => {
    try {
      if (selectedSubFlow === 'DO') {
        const { source, target, sourceHandle, targetHandle } = params;

        let newData = sourceHandle.split('|');
        let findnodeName;
        if (targetHandle === 'createNewDataSet') {
          setNodes((nodes) => {
            return nodes.map((node) => {
              if (node?.type === 'customSourceItems') {
                let schema = node?.data?.schema;

                if (
                  Array.isArray(schema) &&
                  schema.length > 0 &&
                  newData &&
                  newData.length > 0
                ) {
                  findnodeName = schema.find(
                    (item) => item.nodeId === newData?.[1],
                  );
                }
              }
              if (node.id === target) {
                if (newData.length === 3) {
                  let sourceNode = newData?.[1];
                  let sourceObjElement = newData?.[2];

                  let schema = node?.data;

                  if (Array.isArray(schema) && schema.length > 0) {
                    let foundNode = schema.findIndex(
                      (item) =>
                        item?.artifact === source &&
                        item?.id === sourceObjElement &&
                        item?.nodeId === sourceNode,
                    );
                    if (foundNode > -1) {
                      return node;
                    } else {
                      schema.push({
                        artifact: source,
                        id: sourceObjElement,
                        nodeId: sourceNode,
                        nodeName: findnodeName?.nodeName,
                        label: sourceObjElement,
                        path: sourceHandle,
                      });

                      return {
                        ...node,
                        data: schema,
                      };
                    }
                  } else {
                    return {
                      ...node,
                      data: [
                        {
                          artifact: source,
                          id: sourceObjElement,
                          nodeId: sourceNode,
                          nodeName: findnodeName?.nodeName,
                          label: sourceObjElement,
                          path: sourceHandle,
                        },
                      ],
                    };
                  }
                } else return node;
              } else return node;
            });
          });

          setEdges((els) =>
            addEdge(
              {
                ...params,
                targetHandle: sourceHandle + '-target',
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
              },
              els,
            ),
          );
        } else
          setEdges((els) =>
            addEdge(
              {
                ...params,
                targetHandle: sourceHandle + '-target',
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
              },
              els,
            ),
          );
      } else
        setEdges((els) =>
          addEdge(
            {
              ...params,
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
            },
            els,
          ),
        );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (edges.length > 0 && nodes.length > 0 && !hasRunRef.current) {
      const newNodes = nodes.filter(
        (node) =>
          node.type === 'customSourceItems' ||
          node.type === 'customTargetItems',
      );
      const newEdges = edges.filter((edge) => !_.isEmpty(edge.sourceHandle));
      setNodes(newNodes);
      setEdges(newEdges);
      hasRunRef.current = true;
    }
  }, [edges, nodes]);

  useEffect(() => {
    try {
      if (nodes.length > 1 && edges && selectedSubFlow !== null) {
        if (selectedSubFlow == 'DO') {
          let items;
          nodes.forEach((item, index) => {
            if (item.type == 'customTargetItems') {
              items = item.data;
            }
          });

          if (items.length > 0) {
            setTargetItems(items);
            // setMappedData((prev) => {
            //   return {
            //     ...prev,
            //     artifact: {
            //       ...prev?.artifact,
            //       node: prev?.artifact?.node.map((item) => {
            //         const matchingDataSet = items.filter(
            //           (itemx) => itemx?.path.split('|')[1] === item?.nodeId,
            //         );
            //         if (matchingDataSet.length > 0) {
            //           return {
            //             ...item,
            //             DataSet: matchingDataSet,
            //           };
            //         }
            //         return item;
            //       }),
            //     },
            //   };
            // });
          }
        }

        // return edges.reduce((acc, items, index) => {
        //   if (items !== ' ') {
        //     acc.push({
        //       source_key: items['sourceHandle'],
        //       target_key: items['targetHandle'],
        //       sourcePath: items['source'],
        //       targetPath: items['target'],
        //     });
        //   }
        //   return acc;
        // }, []);
      }
      // if (nodes && edges.length === 0 && selectedSubFlow !== null) {
      //   return [];
      // }
    } catch (error) {
      console.error(error);
    }
  }, [nodes, edges]);

  // useEffect(() => {
  //   try {
  //     if (selectedSubFlow === 'UO') {
  //       if (data) {
  //         const targetKeys = {};
  //         data.forEach((item) => {
  //           if (!targetKeys[item.target_key]) {
  //             targetKeys[item.target_key] = [];
  //           }
  //           targetKeys[item.target_key].push(item.source_key);
  //         });

  //         const mapper = Object.keys(targetKeys).map((targetKey) => ({
  //           sourceKey: targetKeys[targetKey],
  //           targetKey,
  //         }));

  //         if (mapper) {
  //           let mapperdata = mapper.map((item) => {
  //             const artifact = item?.targetKey.split(':')[11];
  //             const node = item?.targetKey.split('|')[1];
  //             const object = item?.targetKey.split('|')?.[2] || '';
  //             return { artifact, node, object };
  //           });

  //           let checknode = mapperdata.map((item) => {
  //             return item.node;
  //           });
  //           let checktarget = mapperdata.map((item) => {
  //             return item.object;
  //           });

  //           if (mapperdata && mapperdata.length > 0) {
  //             setMappedData((prev) => {
  //               mapperdata.forEach((item) => {
  //                 const artifactName = item.artifact;
  //                 const nodeId = item.node;
  //                 const objectId = item.object;
  //                 const checkExistingartifact =
  //                   prev?.artifact?.name === artifactName;

  //                 if (checkExistingartifact) {
  //                   const checkExistingNode = prev?.artifact?.node.find(
  //                     (item) => item.nodeId === nodeId,
  //                   );

  //                   if (checkExistingNode) {
  //                     const mapobjectlen = mapper.filter(
  //                       (item) => item.targetKey.split('|').length === 2,
  //                     );
  //                     if (mapobjectlen) {
  //                       const mapobject = mapobjectlen.filter(
  //                         (item) => item.targetKey.split('|')[1] === nodeId,
  //                       );
  //                       checkExistingNode.mapper = mapobject.filter((item) => {
  //                         const existingMapperItem =
  //                           checkExistingNode?.mapper?.find((existingItem) => {
  //                             return existingItem?.sourceKey.some(
  //                               (sourceKeyItem) => {
  //                                 return item.sourceKey.includes(sourceKeyItem);
  //                               },
  //                             );
  //                           });
  //                         const existingtargetItem =
  //                           checkExistingNode?.mapper?.find((existingItem) => {
  //                             return existingItem.targetKey === item.targetKey;
  //                           });

  //                         if (existingMapperItem && existingtargetItem) {
  //                           return true;
  //                         } else {
  //                           checkExistingNode?.mapper?.push(item);

  //                           return true;
  //                         }
  //                       });
  //                     }

  //                     const existingObjectElement =
  //                       checkExistingNode.objElements.find(
  //                         (element) => element.elementId === objectId,
  //                       );

  //                     if (existingObjectElement) {
  //                       const mapobject = mapper.filter(
  //                         (item) =>
  //                           item.targetKey.split('|')[2] === objectId &&
  //                           item.targetKey.split('|')[1] === nodeId,
  //                       );

  //                       existingObjectElement.mapper = mapobject.filter(
  //                         (item) => {
  //                           const existingMapperItem =
  //                             existingObjectElement?.mapper?.find(
  //                               (existingItem) => {
  //                                 return existingItem?.sourceKey.some(
  //                                   (sourceKeyItem) => {
  //                                     return item.sourceKey.includes(
  //                                       sourceKeyItem,
  //                                     );
  //                                   },
  //                                 );
  //                               },
  //                             );

  //                           const existingtargetItem =
  //                             existingObjectElement?.mapper?.find(
  //                               (existingItem) => {
  //                                 return (
  //                                   existingItem.targetKey === item.targetKey
  //                                 );
  //                               },
  //                             );

  //                           if (existingMapperItem && existingtargetItem) {
  //                             return true;
  //                           } else {
  //                             existingObjectElement?.mapper?.push(item);

  //                             return true;
  //                           }
  //                         },
  //                       );
  //                     } else {
  //                       checkExistingNode?.objElements.map((item) => {
  //                         return {
  //                           ...item,
  //                           mapper: [],
  //                         };
  //                       });
  //                     }
  //                   } else {
  //                     checkExistingNode?.objElements.map((item) => {
  //                       return {
  //                         ...item,
  //                         mapper: [],
  //                       };
  //                     });
  //                   }
  //                 }
  //               });
  //               if (
  //                 prev &&
  //                 prev.artifact &&
  //                 prev?.artifact?.node &&
  //                 mapperdata.filter(
  //                   (item) => item.artifact === prev?.artifact?.name,
  //                 )
  //               ) {
  //                 let returndata;
  //                 returndata = prev?.artifact?.node.map((item) => {
  //                   if (checknode.includes(item.nodeId)) {
  //                     return {
  //                       ...item,

  //                       objElements: item?.objElements?.map((obj) => {
  //                         if (!checktarget.includes(obj.elementId)) {
  //                           return {
  //                             ...obj,
  //                             mapper: [],
  //                           };
  //                         }
  //                         return obj;
  //                       }),
  //                     };
  //                   } else {
  //                     return {
  //                       ...item,
  //                       mapper: [],
  //                       objElements: item?.objElements?.map((obj) => {
  //                         return {
  //                           ...obj,
  //                           mapper: [],
  //                         };
  //                       }),
  //                     };
  //                   }
  //                 });
  //                 return {
  //                   ...prev,
  //                   artifact: {
  //                     ...prev?.artifact,
  //                     node: returndata,
  //                   },
  //                 };
  //               } else {
  //                 return prev;
  //               }
  //             });
  //           }
  //         }
  //       }
  //       if (data && data.length === 0 && edges.length === 0 && mappedData) {
  //         if (mappedData.artifact && mappedData.artifact.node) {
  //           setMappedData((prev) => {
  //             return {
  //               ...prev,
  //               artifact: {
  //                 ...prev?.artifact,
  //                 node: prev?.artifact?.node?.map((item) => {
  //                   return {
  //                     ...item,
  //                     mapper: [],
  //                     objElements: item?.objElements?.map((obj) => {
  //                       return {
  //                         ...obj,
  //                         mapper: [],
  //                       };
  //                     }),
  //                   };
  //                 }),
  //               },
  //             };
  //           });
  //         }
  //       }
  //     }

  //     if (selectedSubFlow === 'PO') {
  //       if (data) {
  //         const targetKeys = {};
  //         data.forEach((item) => {
  //           if (!targetKeys[item.target_key]) {
  //             targetKeys[item.target_key] = [];
  //           }
  //           targetKeys[item.target_key].push(item.source_key);
  //         });
  //         const mapper = Object.keys(targetKeys).map((targetKey) => ({
  //           sourceKey: targetKeys[targetKey],
  //           targetKey,
  //         }));
  //         if (mapper) {
  //           let mapperdata = mapper.map((item) => {
  //             const artifact = item?.targetKey.split(':')[11];
  //             const node = item?.targetKey.split('|')[1];
  //             const object = item?.targetKey.split('|')?.[2] || '';
  //             return { artifact, node, object };
  //           });

  //           let checknode = mapperdata.map((item) => {
  //             return item.node;
  //           });

  //           if (mapperdata && mapperdata.length > 0) {
  //             setMappedData((prev) => {
  //               mapperdata.forEach((item) => {
  //                 const artifactName = item.artifact;
  //                 const nodeId = item.node;

  //                 const checkExistingartifact =
  //                   prev?.artifact?.name === artifactName;

  //                 if (checkExistingartifact) {
  //                   const checkExistingNode = prev?.artifact?.node.find(
  //                     (item) => item.nodeId === nodeId,
  //                   );

  //                   if (checkExistingNode) {
  //                     const mapobject = mapper.filter(
  //                       (item) => item.targetKey.split('|')[1] === nodeId,
  //                     );
  //                     checkExistingNode.mapper = mapobject.filter((item) => {
  //                       const existingMapperItem =
  //                         checkExistingNode?.mapper?.find((existingItem) => {
  //                           return existingItem?.sourceKey.some(
  //                             (sourceKeyItem) => {
  //                               return item.sourceKey.includes(sourceKeyItem);
  //                             },
  //                           );
  //                         });
  //                       const existingtargetItem =
  //                         checkExistingNode?.mapper?.find((existingItem) => {
  //                           return existingItem.targetKey === item.targetKey;
  //                         });

  //                       if (existingMapperItem && existingtargetItem) {
  //                         return true;
  //                       } else {
  //                         checkExistingNode?.mapper?.push(item);

  //                         return true;
  //                       }
  //                     });
  //                   } else {
  //                     checkExistingNode?.map((item) => {
  //                       return {
  //                         ...item,
  //                         mapper: [],
  //                       };
  //                     });
  //                   }
  //                 }
  //               });

  //               if (
  //                 prev &&
  //                 prev.artifact &&
  //                 prev?.artifact?.node &&
  //                 mapperdata.filter(
  //                   (item) => item.artifact === prev?.artifact?.name,
  //                 )
  //               ) {
  //                 let returndata;
  //                 returndata = prev?.artifact?.node.map((item) => {
  //                   if (checknode.includes(item.nodeId)) {
  //                     return item;
  //                   }
  //                   if (mapper.length == 0) {
  //                     return {
  //                       ...item,
  //                       mapper: [],
  //                     };
  //                   } else {
  //                     return {
  //                       ...item,
  //                       mapper: [],
  //                     };
  //                   }
  //                 });
  //                 return {
  //                   ...prev,
  //                   artifact: {
  //                     ...prev?.artifact,
  //                     node: returndata,
  //                   },
  //                 };
  //               }
  //               return prev;
  //             });
  //           }

  //           if (data && data.length === 0 && edges.length === 0 && mappedData) {
  //             if (mappedData.artifact && mappedData.artifact.node) {
  //               setMappedData((prev) => {
  //                 return {
  //                   ...prev,
  //                   artifact: {
  //                     ...prev?.artifact,
  //                     node: prev?.artifact?.node?.map((item) => {
  //                       return {
  //                         ...item,
  //                         mapper: [],
  //                       };
  //                     }),
  //                   },
  //                 };
  //               });
  //             }
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [data]);

  const handleMoveToDefaultPosition = () => {
    try {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.type === 'customSourceItems') {
            return {
              ...n,
              position: {
                x: calculatePositionX(200),
                y: calculatePositionY(15),
              },
            };
          }
          if (n.type === 'customTargetItems') {
            return {
              ...n,
              position: {
                x: calculatePositionX(900),
                y: calculatePositionY(15),
              },
            };
          }
          return n;
        }),
      );
      setallnodes((prev) => {
        if (!prev || Object.keys(prev).length === 0) return {};
        Object.keys(prev).forEach((key) => {
          if (prev[key]?.type === 'customSourceItems') {
            prev[key].position = {
              x: calculatePositionX(200),
              y: calculatePositionY(15),
            };
          }
          if (prev[key]?.type === 'customTargetItems') {
            prev[key].position = {
              x: calculatePositionX(900),
              y: calculatePositionY(15),
            };
          }
        });
        return prev;
      });

      setViewport({ x: 0, y: 0, zoom: 1 });
    } catch (error) {}
  };

  const onEdgeUpdateStart = useCallback(() => {
    try {
      edgeUpdateSuccessful.current = false;
    } catch (error) {}
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      try {
        edgeUpdateSuccessful.current = true;

        setEdges((els) => updateEdge(oldEdge, newConnection, els));
      } catch (error) {
        console.error(error);
      }
    },
    [setEdges],
  );

  const onEdgeUpdateEnd = useCallback(
    (_, edge) => {
      try {
        if (!edgeUpdateSuccessful.current) {
          if (selectedSubFlow === 'DO') {
            setNodes((els) => {
              return els.map((el) => {
                {
                }
                if (el.id === edge.target) {
                  const splittedkey = edge.targetHandle.split('|');
                  splittedkey.pop();
                  const filteredKeys = edge.targetHandle.split('|')[2];

                  const filteredlastKey = filteredKeys.split('-')[0];
                  const filteredKey =
                    splittedkey.join('|') + '|' + filteredlastKey;
                  return {
                    ...el,
                    data: el.data.filter((d) => d.path !== filteredKey),
                  };
                }
                return el;
              });
            });

            // setMappedData((prev) => {
            //   return {
            //     ...prev,
            //     artifact: {
            //       ...prev.artifact,
            //       node: prev?.artifact?.node.map((item) => {
            //         const targetHandleNodeID = edge.targetHandle.split('|')[1];
            //         if (item.ifo && item.nodeId === targetHandleNodeID) {
            //           item.ifo = item.ifo.filter(
            //             (i) => i.path !== edge.sourceHandle,
            //           );
            //         }
            //         return item;
            //       }),
            //     },
            //   };
            // });

            setNodes((els) => {
              return els.map((el) => {
                if (el.type === 'customSourceItems') {
                  return {
                    ...el,
                    data: {
                      ...el.data,
                      schema: el.data.schema.map((item) => {
                        if (item.ifo) {
                          item.ifo = item.ifo.filter(
                            (i) => i.path !== edge.sourceHandle,
                          );
                        }
                        return item;
                      }),
                    },
                  };
                } else {
                  return el;
                }
              });
            });
          }
          if (selectedSubFlow === 'PO') {
            const edgetoRemoveIfo = edge.targetHandle.split('|');

            setNodes((nodes) =>
              nodes.map((n) => {
                if (n.type === 'customSourceItems') {
                  return {
                    ...n,
                    data: {
                      ...n.data,
                      dfo: {
                        ...n.data.dfo,
                        [edge.sourceHandle.split('|')[0]]: n.data.dfo[
                          edge.sourceHandle.split('|')[0]
                        ].map((item) => {
                          if (
                            item.selectedDropdownName + '|' + item.nodeId ===
                            edge.sourceHandle
                          ) {
                            item.ifo = [];
                          }
                          return item;
                        }),
                      },
                    },
                  };
                } else {
                  return n;
                }
              }),
            );

            // setMappedData((prev) => {
            //   return {
            //     ...prev,
            //     artifact: {
            //       ...prev.artifact,
            //       node: prev?.artifact?.node.map((item) => {
            //         if (
            //           item.nodeId ===
            //           edgetoRemoveIfo[edgetoRemoveIfo.length - 1]
            //         ) {
            //           item.ifo = [];
            //         }
            //         return item;
            //       }),
            //     },
            //   };
            // });
          }
          // if (selectedSubFlow === 'UO') {
          //   const edgetoRemoveIfo = edge.targetHandle.split('|');

          //   setNodes((nodes) =>
          //     nodes.map((n) => {

          //       if (n.type === 'customSourceItems') {
          //         return {
          //           ...n,
          //           data: {
          //             ...n.data,
          //             dfo: {
          //               ...n.data.dfo,
          //               [edge.sourceHandle.split('|')[0]]: n.data.dfo[
          //                 edge.sourceHandle.split('|')[0]
          //               ].map((item) => {
          //                 if (item.nodeId == edge.sourceHandle.split('|')[1]) {
          //                   item.ifo = [];
          //                 }
          //                 return item;
          //               }),
          //             },
          //           },
          //         };
          //       } else {
          //         return n;
          //       }
          //     }),
          //   );
          // }
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeUpdateSuccessful.current = true;
      } catch (error) {
        console.error(error);
      }
    },
    [setEdges, selectedSubFlow, edges],
  );
  const handleTargetMappedData = (data) => {
    if (data?.mappedData) {
      setMappedData(data?.mappedData);
    }
    if (data?.securityData) {
      setSecurityData(data?.securityData);
    }
  };
  const handleSave = async (showToast = true) => {
    let toastId;
    try {
      toastId =
        showToast && pendingToast('Please wait for the saving of subflow');
      if (
        selectedTarget &&
        (selectedSubFlow === 'UO' || selectedSubFlow === 'PO')
      ) {
        const payload = {
          source,
          target,
          sourceItems,
          targetItems,
          selectedSource,
          selectedTarget,
          mappedData,
          securityData,
          nodes,
          edges,
        };

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
        let key = selectedTarget?.path.split(':');
        key = key.filter((item) => !otherKey.includes(item));

        let save = await saveSubflow(payload, key, selectedSubFlow);

        if (save.status === 200 && save.data === 'success') {
          if (selectedSubFlow === 'PO') {
            poEventsEjs(selectedTarget?.path + ':').then((res) => {});
          }
          showToast &&
            updateToast(
              toastId,
              'success',
              'orchestration saved successfully.',
            );

          return true;
        } else {
          showToast &&
            updateToast(toastId, 'error', 'Error in saving subflow.');

          return false;
        }
      }
      if (selectedTarget && selectedSubFlow == 'DO') {
        const Sourcepayload = {
          source,
          target,
          sourceItems,
          targetItems,
          selectedSource,
          selectedTarget,
          mappedData,
          securityData,
          nodes,
          edges,
        };
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

        let Sourcekey = selectedSource?.path.split(':');
        Sourcekey = Sourcekey.filter((item) => !otherKey.includes(item));

        let sourcesave = await saveSubflow(
          Sourcepayload,
          Sourcekey,
          selectedSubFlow,
        );

        if (sourcesave.status === 200 && sourcesave.data === 'success') {
          const eventapi = await getDFAPI(selectedSource?.path, sessionToken);

          showToast &&
            updateToast(
              toastId,
              'success',
              'orchestration saved successfully.',
            );

          return true;
        } else {
          showToast &&
            updateToast(toastId, 'error', 'Error in saving subflow.');
          return false;
        }
      }
    } catch (error) {
      showToast && updateToast(toastId, 'error', `Error : ${error}`);
    }
  };

  const handleArtifactSelectionLogicCenter = (data) => {
    setSelectedArtifactForLogic(data);
  };
  const displayedEdges = useMemo(() => {
    if (selectedSubFlow === 'PO') {
      const node = nodes.find((n) => n.type === 'customSourceItems');
      if (_.isEmpty(node)) return edges;
      const { data } = node;
      if (_.isEmpty(data)) return edges;
      const { path, selectedIndex } = data;
      if (_.isEmpty(path)) return edges;
      if (_.isEmpty(selectedIndex)) return edges;
      return edges.filter((edge) =>
        edge.sourceHandle.includes(path + '|' + selectedIndex),
      );
    }
    if (selectedSubFlow === 'UO') {
      const node = nodes.find((n) => n.type === 'customSourceItems');
      if (_.isEmpty(node)) return edges;
      const { data } = node;
      if (_.isEmpty(data)) return edges;
      const { path, selectedIndex } = data;
      if (_.isEmpty(path)) return edges;
      if (_.isEmpty(selectedIndex)) return edges;
      return edges.filter((edge) =>
        edge.sourceHandle.includes(path + '|' + selectedIndex),
      );
    }
    return edges;
  }, [edges, nodes, selectedSubFlow]);
  return (
    <div className="h-full w-full">
      <OrchestratorContext.Provider
        value={{
          edges,
          nodes,
          source,
          setSource,
          target,
          setTarget,
          setSourceItems,
          setSelectedTarget,
          setTargetItems,
          selectedSource,
          setSelectedSource,
          mappedData,
          setMappedData,
          setEdges,
          setNodes,
          sourceDraggable,
          targetDraggable,
          setSourceIndex,
          setTargetIndex,
          setSecurityTarget,
          securityTarget,
          securityData,
          setSecurityData,
          selectedTarget,
          targetItems,
        }}
      >
        <ReactFlow
          translateExtent={[
            [0, 0],
            [window.innerWidth, Infinity],
          ]}
          nodeExtend={[
            [0, 0],
            [Infinity, Infinity],
          ]}
          snapToGrid={false}
          panOnScrollMode="vertical"
          onInit={setreactflowinstance}
          nodesConnectable={true}
          onConnect={onConnect}
          nodeTypes={NODETYPES}
          panOnScroll={true}
          zoomOnScroll={false}
          nodes={nodes}
          proOptions={proOptions}
          edges={displayedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
        >
          {children &&
            (typeof children == 'function' ? children({}) : children)}

          <>
            <SourceGallery
              allNodes={allNodes}
              setAllNodes={setallnodes}
              setNodes={setNodes}
              nodes={nodes}
              handleArtifactSelectionLogicCenter={
                handleArtifactSelectionLogicCenter
              }
              selectedArtifactForLogic={selectedArtifactForLogic}
              currentArtifact={currentArtifact}
              setCurrentArtifact={setCurrentArtifact}
            />
            <TargetGallery
              handleArtifactSelectionLogicCenter={
                handleArtifactSelectionLogicCenter
              }
              selectedArtifactForLogic={selectedArtifactForLogic}
              allNodes={allNodes}
              setAllNodes={setallnodes}
              setNodes={setNodes}
              nodes={nodes}
            />
          </>

          <Panel className="flex items-center gap-2" position="bottom-center">
            <TorusDialog
              classNames={{
                modalOverlayClassName:
                  ' justify-center  pt-[4.25vw] pl-[1.15vw] pb-[1vw] pr-[0.65vw]',
                modalClassName:
                  ' h-full  w-full flex  justify-center items-center ',
                dialogClassName: ' w-full h-full  ',
              }}
              isDismissable={false}
              triggerElement={
                <TorusTitle
                  text={
                    _.isEmpty(selectedArtifactForLogic)
                      ? 'Logic center'
                      : selectedArtifactForLogic?.version +
                        '-' +
                        selectedArtifactForLogic?.artifact +
                        ' logic center'
                  }
                  bgColor={`${selectedAccntColor}90`}
                  color={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
                >
                  <TorusButton
                    fontStyle={
                      'truncate  text-center flex flex-row items-center'
                    }
                    btncolor={`${
                      _.isEmpty(selectedArtifactForLogic)
                        ? `${selectedAccntColor}70`
                        : `${selectedAccntColor}`
                    }`}
                    startContent={
                      <LogicCenterSVG
                        fill={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
                      />
                    }
                    isDisabled={_.isEmpty(selectedArtifactForLogic)}
                    endContent={selectedArtifactForLogic?.version}
                    buttonClassName={`flex w-[8.7vw] h-[4.7vh] cursor-pointer items-center rounded ${_.isEmpty(selectedArtifactForLogic) ? ' bg-[#0736C4]/50' : 'bg-[#0736C4]'} px-2 py-1 text-[0.72vw] leading-[2.22vh] text-white`}
                    Children={
                      <span
                        className="truncate"
                        style={{
                          color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`,
                        }}
                      >
                        Logic center
                      </span>
                    }
                  />
                </TorusTitle>
              }
            >
              {({ close }) => (
                <LogicCenterMain
                  triggerSave={handleSave}
                  tenant={selectedTenant}
                  setShowLogic={close}
                  selectedLogic={selectedArtifactForLogic}
                  setLogicCenterData={handleTargetMappedData}
                  client={client}
                  redisKey={redisKey}
                  fabric={selectedFabric}
                />
              )}
            </TorusDialog>

            <TorusTitle
              text={'Move to default position'}
              bgColor={`${selectedAccntColor}90`}
              color={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
            >
              <TorusButton
                Children={
                  <LogicScreenEnlargement
                    className="h-[1vw] w-[1vw]"
                    fill={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
                  />
                }
                btncolor={`${selectedAccntColor}`}
                buttonClassName="rounded border border-black/25   w-[2vw] h-[2vw] flex items-center justify-center  text-white"
                onPress={handleMoveToDefaultPosition}
              />
            </TorusTitle>

            <TorusTitle
              text={'Save'}
              bgColor={`${selectedAccntColor}90`}
              color={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
            >
              <TorusButton
                btncolor={`${selectedAccntColor}`}
                Children={
                  <Save
                    className="h-[1vw] w-[1vw] "
                    stroke={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
                  />
                }
                buttonClassName="rounded  border border-black/25 w-[2vw] h-[2vw] flex items-center justify-center  text-white"
                onPress={handleSave}
              />
            </TorusTitle>
          </Panel>
        </ReactFlow>
      </OrchestratorContext.Provider>
    </div>
  );
};

export default APPDO;
