/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';

import TorusDropDown from '../../torusComponents/TorusDropDown';
import { useReactFlow } from 'reactflow';
import {
  calculatePositionX,
  calculatePositionY,
  findDiffAndChangeDiffInObject,
} from '../../utils/utils';
import {
  getdfo,
  getEvents,
  getUfoHandler,
} from '../../commonComponents/api/orchestratorApi';
import { TorusModellerContext } from '../../Layout';
import { OrchestratorContext } from '../App';

export default function SourceGalleryDropDown({
  path,
  children,
  setAllNodes,
  allNodes,
  setCurrentArtifact,
  fabric,

  pathData,
  ddvalidate,
}) {
  console.log(pathData, 'ddvalidate');
  const { getNodes, setNodes } = useReactFlow();
  const [dropdownList, setDropDownList] = useState([]);
  const [dfoData, setDfoData] = useState([]);
  const [dfoSelectedIndex, setDfoSelectedIndex] = useState(new Set([]));
  const { client, selectedSubFlow, selectedTheme } =
    useContext(TorusModellerContext);
  const { nodes } = useContext(OrchestratorContext);
  function traverseChildren(children, path = '') {
    const result = [];
    children.forEach((child) => {
      if (child.type === 'handlerNode') {
        result.push({
          name: `${path}${child.name}`,
          type: `${path}${child.type}`,
          id: `${path}${child.id}`,
        });
      }
      if (child.children) {
        result.push(
          ...traverseChildren(child.children, `${path}${child.name}/`),
        );
      }
    });
    return result;
  }

  function getNodePo(artf, data) {
    console.log(artf, data, '->>>wt2');
    const result = [];
    if (artf && Object.keys(artf).length > 0) {
      artf.children.forEach((event) => {
        const handlers = traverseChildren(event.children || []);
        result.push({
          node: `${event.name}`,
          nodeId: event.id,
          objElem: handlers,
        });
      });
    }
    data &&
      data.length > 0 &&
      data.forEach(({ component, control, id: componentId }) => {
        control.forEach(({ name: controlName, events, id }) => {
          let nodeElem =
            component === controlName
              ? component
              : `${component}/${controlName}`;
          const finalid =
            componentId === id ? componentId : `${componentId}/${id}`;
          const eventSummary = events.eventSummary || {};
          const eventsList = eventSummary.children || [];
          eventsList.forEach((event) => {
            const handlers = traverseChildren(event.children || []);
            result.push({
              node: `${nodeElem}/${event.name}`,
              nodeId: finalid + '/' + event.id,
              objElem: handlers,
            });
          });
        });
      });
    console.log(result, 'nodePo');
    return result;
  }

  const getEventData = async () => {
    try {
      const body = {
        SOURCE: 'redis',
        TARGET: 'redis',
        CK: client,
        FNGK: 'AF',
        FNK: pathData.fabric,
        CATK: pathData.catalog,
        AFGK: pathData.artifactGroup,
        AFK: pathData.artifact,
        AFVK: pathData.version,
        AFSK: 'UO',
      };
      if (dropdownList.length > 0) return;
      const res = await getEvents(body);
      console.log(res, 'rsss');
      if (res && (res.artifact || Array.isArray(res.component))) {
        let data = getNodePo(res.artifact, res.component);

        console.log(data, 'nodePo');

        let sc_data = [];

        data.forEach((item, ind) => {
          let existingNode = sc_data.find(
            (node) => node.nodeId === item.nodeId,
          );
          if (!existingNode) {
            sc_data.push({
              nodeId: item.nodeId,
              nodeName: item.node,
              schema: item.objElem,
            });
          } else {
            existingNode.schema.push(item.objElem);
          }
        });

        console.log(data, 'dsss');

        data = data.map((item, ind) => {
          // sc_data[item.node] = {
          //   schema: item.objElem,
          // };
          return {
            label: item.node,
            key: item.nodeId,
          };
        });
        setDropDownList(data);
        setDfoData(sc_data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      if (
        dropdownList.length == 0 &&
        (fabric == 'UF-UFW' || fabric == 'UF-UFM' || fabric == 'UF-UFD')
      ) {
        getDfo();
      } else if (dropdownList.length == 0 && fabric == 'PF-PFD') {
        getEventData();
      }
    } catch (error) {
      console.log(error);
    }
  }, [path]);
  const getDfo = async () => {
    try {
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
      let key = path.split(':');
      key = key.filter((item) => !otherKey.includes(item));
      console.log(key, 'resDSTkey');
      if (dropdownList.length > 0) return;
      let res = await getdfo(JSON.stringify(key), selectedSubFlow)
        .then((res) => res?.data)
        .catch((error) => console.error(error));

      console.log(res, 'resDST');
      if (selectedSubFlow == 'UO') {
        if (res) {
          let data = res.map((item, ind) => ({
            label: item.nodeName,
            key: item.nodeId,
          }));

          let sc_data = [];

          res.forEach((item, ind) => {
            let existingNode = sc_data.find(
              (node) => node.nodeId === item.nodeId,
            );
            if (!existingNode) {
              sc_data.push({
                nodeId: item.nodeId,
                nodeName: item.nodeName,
                schema: [item.label],
              });
            } else {
              existingNode.schema.push(item.label);
            }
          });
          console.log(data, 'dsss-207');
          setDropDownList(data);
          setDfoData(sc_data);
        }
      } else {
        if (res && Array.isArray(res)) {
          let data = res.map((item, ind) => ({
            label: item.nodeName,
            key: item.nodeId,
          }));
          let sc_data = {};
          res.forEach((item, ind) => {
            sc_data[item.nodeId] = {
              schema: item.schema,
            };
          });
          console.log(data, 'dsss-223');
          setDropDownList(data);
          setDfoData(sc_data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(dropdownList, dfoData, 'dropdownList');
  const handleDfoSelection = async (path, ind) => {
    try {
      console.log(ind, path, 'pind');
      const selectedLabel = dropdownList.find(
        (item) => item?.key === ind,
      )?.label;
      if (selectedSubFlow == 'UO') {
        if (ind !== undefined && ind !== null) {
          const ufoSchemaArr = dfoData;
          const newsourcedataUO =
            ufoSchemaArr &&
            ufoSchemaArr.map((item) => {
              return {
                nodeId: item.nodeId,
                nodeName: item.nodeName,
                schema: item.schema.map((item) => {
                  return {
                    name: item,
                    type: 'string',
                  };
                }),
              };
            });

          console.log(newsourcedataUO, allNodes, dfoData, 'ufodata');

          let newSourceNode = {
            id: path,

            type: 'customSourceItems',
            data: {
              dfo: { [path]: newsourcedataUO },
              path: path,
              selectedIndex: ind,
              label: dropdownList[ind]?.label,
            },
            position: {
              x: calculatePositionX(200),
              y: calculatePositionY(15),
            },
          };
          let nodes = getNodes();
          let index = nodes.findIndex(
            (node) => node.type === 'customSourceItems',
          );
          if (index === -1) {
            setNodes((prev) => prev.concat(newSourceNode));
          } else {
            if (!_.isEmpty(nodes[index]?.data?.dfo)) {
              setNodes((prev) => {
                return prev.map((node) => {
                  if (node.type === 'customSourceItems') {
                    return {
                      ...node,
                      id: path,
                      data: {
                        ...node.data,
                        dfo: {
                          ...node.data.dfo,
                          [path]: findDiffAndChangeDiffInObject(
                            newsourcedataUO,
                            node.data.dfo[path],
                            ['ifo'],
                            ['nodeId'],
                          ),
                        },
                        path: path,
                        selectedIndex: ind,
                        label: dropdownList[ind]?.label,
                      },
                    };
                  }
                  return node;
                });
              });
            } else {
              setNodes((prev) =>
                prev
                  .filter((node) => node.type !== 'customSourceItems')
                  .concat(newSourceNode),
              );
            }
          }
        }
        // } else {
        //   setNodes((prev) =>
        //     prev.filter((node) => node.type !== 'customSourceItems'),
        //   );
        // }
      } else if (selectedSubFlow == 'PO') {
        if (ind !== undefined && ind !== null) {
          let ufo = await getUfoHandler(path, selectedLabel.split('/')[0]);
          console.log(ufo, dfoData, ind, path, 'ufo_');
          const schemaArr = dfoData.flatMap((item) => {
            return {
              id: item.nodeId,
              name: item.nodeName,
              schema: item.schema,
            };
          });
          console.log(schemaArr, allNodes, 'ufodSchemaArr');

          const newsourcedata = schemaArr.flatMap((schema) => {
            return schema.schema.map((node) => {
              return {
                nodeId: node.id,
                nodeName: node.name,
                schema: ufo?.schema,
                selectedDropdownName: path + '|' + schema.id,
              };
            });
          });

          console.log(
            newsourcedata,
            allNodes,
            'ccc993fd-4707-4f6e-b1ab-b61acba6fe4e.1.1.1',
          );

          let newSourceNode = {
            id: path,
            type: 'customSourceItems',
            data: {
              dfo: { [path]: newsourcedata },
              path: path,
              label: selectedLabel,
              selectedIndex: ind,
            },
            position: {
              x: calculatePositionX(200),
              y: calculatePositionY(15),
            },
          };
          let nodes = getNodes();
          let index = nodes.findIndex(
            (node) => node.type === 'customSourceItems',
          );
          if (index === -1) {
            setNodes((prev) => prev.concat(newSourceNode));
          } else {
            if (!_.isEmpty(nodes[index]?.data?.dfo)) {
              setNodes((prev) => {
                return prev.map((node) => {
                  if (node.type === 'customSourceItems') {
                    return {
                      id: path,
                      ...node,
                      data: {
                        ...node.data,
                        dfo: {
                          ...node.data.dfo,
                          [path]: findDiffAndChangeDiffInObject(
                            newsourcedata,
                            node.data.dfo[path],
                            ['ifo'],
                            ['nodeId'],
                          ),
                        },
                        path: path,
                        selectedIndex: ind,
                        label: selectedLabel,
                      },
                    };
                  }
                  return node;
                });
              });
            } else {
              setNodes((prev) =>
                prev
                  .filter((node) => node.type !== 'customSourceItems')
                  .concat(newSourceNode),
              );
            }
          }
          console.log(newSourceNode, 'newSourceNode');
        }
      } else {
        if (ind !== undefined && ind !== null) {
          console.log(dfoData[ind]['schema'], 'ufo');
          const schemaArr = dfoData[ind]['schema'];

          const newsourcedata = schemaArr.map((schema) => ({
            nodeId: schema.id,
            nodeName: schema.name,
            schema: ufo?.schema,
          }));

          console.log(newsourcedata, 'ufodata');

          if (allNodes?.[path + '|' + ind]) {
            let nodes = getNodes();
            let index = nodes.findIndex(
              (node) => node.type === 'customSourceItems',
            );
            if (index === -1) {
              setNodes((prev) => prev.concat(allNodes?.[path + '|' + ind]));
            } else {
              setAllNodes((prev) => {
                return { ...prev, [nodes?.[index]?.id]: nodes?.[index] };
              });
              setNodes((prev) =>
                prev
                  .filter((node) => node.type !== 'customSourceItems')
                  .concat(allNodes?.[path + '|' + ind]),
              );
            }
          } else {
            let newSourceNode = {
              id: path + '|' + ind,
              type: 'customSourceItems',
              data: {
                dfo: dfoData[ind],
                path: path,
                label: dropdownList[ind]?.label,
              },
              position: {
                x: calculatePositionX(200),
                y: calculatePositionY(15),
              },
            };
            let nodes = getNodes();
            let index = nodes.findIndex(
              (node) => node.type === 'customSourceItems',
            );
            if (index === -1) {
              setNodes((prev) => prev.concat(newSourceNode));
            } else {
              setAllNodes((prev) => {
                return { ...prev, [nodes?.[index]?.id]: nodes?.[index] };
              });
              setNodes((prev) =>
                prev
                  .filter((node) => node.type !== 'customSourceItems')
                  .concat(newSourceNode),
              );
            }
            console.log(newSourceNode, 'newSourceNode');
          }
        } else {
          setNodes((prev) =>
            prev.filter((node) => node.type !== 'customSourceItems'),
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log(nodes, allNodes, 'all');

  return (
    <div className="flex h-[3vh] w-[100%] items-center justify-center">
      <TorusDropDown
        title={children}
        selectionMode="single"
        setSelected={(index) => {
          setDfoSelectedIndex(index);
          handleDfoSelection(path, Array.from(index)[0]);
          setCurrentArtifact(path);
        }}
        // classNames={{ listBoxClassName: "m-4" }}
        items={dropdownList}
        fontStyle={'w-[100%]'}
        selected={ddvalidate && dfoSelectedIndex}
        listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
        listItemColor={`${selectedTheme && selectedTheme?.text}`}
        classNames={{
          buttonClassName:
            'rounded-lg w-[100%] flex justify-center items-center text-[0.83vw] h-[2.7vh] font-[400] bg-transparent dark:bg-[#0F0F0F] text-center dark:text-white',
          popoverClassName:
            'flex item-center justify-center mt-1 w-[11vw] text-[0.72vw]',
          listBoxClassName:
            'overflow-y-auto bg-white border border-neutral-400/35 dark:bg-[#0F0F0F] ',
          listBoxItemClassName: 'flex  justify-between text-md',
        }}
      />
    </div>
  );
}
