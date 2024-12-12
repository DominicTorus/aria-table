/* eslint-disable */
import { forwardRef, useCallback, useContext, useMemo, useState } from 'react';

import ReactFlow, { addEdge, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

import styles from './styles.module.css';

import {
  ControlNode,
  EventNode,
  GroupNode,
  HandlerNode,
  ResponseNode,
  ScreenNode,
} from './DynamicNodes';

import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import TorusToast from '../../../torusComponents/TorusToaster/TorusToast';
import { toast } from 'react-toastify';
import _ from 'lodash';

const proOptions = { account: 'paid-pro', hideAttribution: true };

const nodeOrigin = [0.5, 0.5];

const defaultEdgeOptions = { style: { stroke: '#a9a9a9' } };

/**
 * Renders the event dashboard component.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.data - The data for the component.
 * @param {Object} props.currentDrawing - The current drawing.
 * @param {Function} props.sendData - The function to send data.
 * @return {JSX.Element} The rendered event dashboard component.
 */
export const EventDashBoard = forwardRef(
  (
    {
      nodes,
      edges,
      setEdges,
      setNodes,
      onNodesChange,
      onEdgesChange,
      children,
      onNodeContextMenu,
      onPaneClick,
    },
    ref,
  ) => {
    const { getNode } = useReactFlow();
    const { screenToFlowPosition } = useReactFlow();

    const [strength, setStrength] = useState(0);
    const [wordLength, setWordLength] = useState(0);
    const [distance, setDistance] = useState(200);
    const [menu, setMenu] = useState(null);

    const [nodeData, setNodeData] = useState(null);
    const [mainSequence, setMainSequence] = useState(0);
    const { darkMode } = useContext(DarkmodeContext);
    const [miniMapOpn, setMinimapOpn] = useState(true);
    const [panelOPen, setpanelOPen] = useState(false);

    const NODE_TYPES = useMemo(
      () => ({
        groupNode: GroupNode,
        controlNode: ControlNode,
        eventNode: EventNode,
        handlerNode: HandlerNode,
        responseNode: ResponseNode,
        screen: ScreenNode,
      }),
      [],
    );

    /**
     * Validates the children of a node against an event name.
     *
     * @param {Object} node - The node to validate.
     * @param {string} eventName - The event name to validate against.
     * @return {boolean} Returns true if the node has children and the event name does not exist, otherwise false.
     */
    const validateChildern = useCallback(
      (node, eventName) => {
        try {
          let isValid = true;
          node?.data?.children &&
            node?.data?.children.length > 0 &&
            node.data.children.map((child) => {
              const childNode = getNode(child);

              if (childNode && childNode.data.label === eventName) {
                isValid = false;
                return child;
              }
              return child;
            });

          return isValid;
        } catch (error) {
          console.error(error);
        }
      },
      [getNode],
    );

    /**
     * Adds a node on drop with parent.
     *
     * @param {Object} node - The node to add.
     * @param {string} eventName - The event name to validate against.
     * @return {void}
     *
     * */
    const addNodeOnDropWithParent = useCallback(
      (node, eventName) => {
        try {
          if (!node) return;
          const valitateChild = validateChildern(node, eventName);
          if (valitateChild) {
            let sequenceArr = [];
            if (node.data.children.length > 0) {
              sequenceArr =
                node.data.children &&
                node.data.children.length > 0 &&
                node.data.children.map((elem) => {
                  return elem.split('.').slice(1).join('.');
                });
            }

            const maxValue = Math.max(...sequenceArr);
            const incrementLastDigit = (num) => {
              const numStr = num.toString();
              const lastDigitIndex = numStr.length - 1;
              const lastDigit = parseInt(numStr[lastDigitIndex], 10);
              const newLastDigit = (lastDigit + 1) % 10;
              return parseFloat(numStr.slice(0, lastDigitIndex) + newLastDigit);
            };
            const newChildId = incrementLastDigit(maxValue);
            let childId = `${node.id}.${newChildId}`;
            const childNode = {
              id: `${node.id}.${newChildId}`,
              type: 'eventNode',
              position: {
                x: node.position.x + Math.random() * (150 - 100) + 100,
                y: Math.random() * (400 - 300) + 300,
              },
              data: {
                label: eventName,
                sequence: childId.split('.').splice(1).join('.'),
                parentId: node.id,
                children: [],
                nodeProperty: {},
              },
              className: styles.node,
            };
            node = {
              ...node,
              data: {
                ...node.data,
                children: [...node.data.children, `${node.id}.${newChildId}`],
              },
            };
            const childEdge = {
              id: `${node.id}->${node.id}.${newChildId}`,
              source: node.id,
              type: 'straight',
              target: `${node.id}.${newChildId}`,
            };

            setNodes((nds) => [
              ...nds.filter((nd) => nd.id !== node.id),
              node,
              childNode,
            ]);
            setEdges((eds) => [...eds, childEdge]);
          } else {
            toast(
              <TorusToast
                setWordLength={setWordLength}
                wordLength={wordLength}
              />,
              {
                type: 'warning',
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: true,
                title: 'Warning',
                text: `Event already exists`,
                closeButton: false,
              },
            );
          }
        } catch (error) {
          console.error(error);
        }
      },

      [setNodes, setEdges, validateChildern],
    );

    /**
     * Handles the connection event.
     *
     * @param {Object} params - The parameters for the connection.
     * @return {void}
     */
    const onConnect = useCallback(
      (params) => {
        try {
          setEdges((eds) =>
            addEdge(
              {
                ...params,
                type: 'straight',
              },
              eds,
            ),
          );
        } catch (error) {
          console.error(error);
        }
      },
      [setEdges],
    );

    /**
     * Handles the dragover event on the component.
     *
     * @param {Event} event - The dragover event.
     * @return {void}
     */
    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    /**
     * Sets the node data in the state.
     *
     * @param {Object} node - The node object.
     * @param {string} id - The id of the node.
     * @return {Promise<void>} - A promise that resolves when the node data is set.
     **/
    const setSidebar = async (node, id) => {
      try {
        setNodeData(node);
      } catch (e) {
        console.error(e);
      }
    };

    /**
     * Updates the node details.
     *
     * @param {Object} data - The data object containing the key-value pair to be updated.
     * @return {void} This function does not return anything.
     */
    const updatenodeDetails = (data) => {
      try {
        let key = Object.keys(data)[0];
        let value = Object.values(data)[0];

        setNodes((nds) => {
          return (
            nds &&
            nds.map((nds) => {
              if (nds.id === nodeData.id) {
                if (key === 'label') {
                  return {
                    ...nds,
                    data: {
                      ...nds.data,
                      label: value,
                    },
                  };
                } else if (key === 'type') {
                  return {
                    ...nds,
                    [key]: value,
                  };
                } else {
                  return nds;
                }
              }

              return nds;
            })
          );
        });

        setNodeData((nds) => {
          if (key === 'label') {
            return {
              ...nds,
              data: {
                ...nds.data,
                label: value,
              },
            };
          } else {
            return nds;
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    /**
     * Updates the configuration of a node.
     *
     * @param {string} id - The ID of the node.
     * @param {string} key - The key of the configuration property to update.
     * @param {Object} metadata - Additional metadata to update.
     * @param {any} data - The new value for the configuration property.
     * @return {void} This function does not return anything.
     */
    const updatedNodeConfig = (id, key, metadata, data) => {
      try {
        setNodes((prev) => {
          return prev?.map((node) => {
            if (node.id === id) {
              if (node?.data.hasOwnProperty('nodeProperty')) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    nodeProperty: {
                      ...node.data.nodeProperty,
                      ...metadata,
                      [key]: data,
                    },
                  },
                };
              } else {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    nodeProperty: {
                      ...metadata,
                      [key]: data,
                    },
                  },
                };
              }
            }
            return node;
          });
        });

        setNodeData((prev) => {
          if (prev?.id === id) {
            return {
              ...prev,
              data: {
                ...prev.data,
                nodeProperty: {
                  ...prev.data.nodeProperty,
                  ...metadata,
                  [key]: data,
                },
              },
            };
          }
          return prev;
        });
      } catch (error) {
        console.error(error);
      }
    };
    console.log(nodes, nodeData, 'change');

    const togglePanel = () => {
      setpanelOPen((prev) => !prev);
    };

    /**
     * Handles the drop event on the component.
     *
     * @param {Event} event - The drop event.
     * @return {void}
     */
    const onDrop = useCallback(
      (event) => {
        try {
          event.preventDefault();
          // setisforcelayoutenabled(true);

          const eventName = event.dataTransfer.getData('application/eventName');
          const parentNode = JSON.parse(
            event.dataTransfer.getData('application/parentNode'),
          );
          let parentGroupNode = event.dataTransfer.getData(
            'application/parentGroupNode',
          );
          console.log(eventName, parentNode, 'parentGroupNode');
          if (parentGroupNode) parentGroupNode = JSON.parse(parentGroupNode);

          const node = getNode(parentNode.nodeId);
          if (parentGroupNode) {
            let parentGroup = getNode(parentGroupNode?.nodeId);

            if (!eventName || !parentNode) {
              return;
            }

            const position = screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            });
            if (!parentGroup) {
              let parentIds = parentGroupNode.nodeId;

              let parentGroupNodes = {
                id: parentIds,
                type: 'groupNode',
                position,
                data: {
                  ...parentGroupNode,
                  children: [],
                  sequence: '1',
                  nodeProperty: {},
                },
              };

              let parentGroupToNode = {
                id: parentIds + '->' + parentNode.nodeId,
                source: parentIds,
                type: 'straight',
                target: parentNode.nodeId,
              };

              let ids = parentNode.nodeId;
              let newChildId = '1.1.1';
              let newNode = {
                id: ids,
                type: 'controlNode',
                position: {
                  x: parentGroupNodes.position.x + 100,
                  // y: parentGroupNodes.position.y + 100,
                },
                data: {
                  ...parentNode,
                  children: [],
                  sequence: '1.1',
                  nodeProperty: {},
                },
              };

              parentGroupNodes = {
                ...parentGroupNodes,
                data: {
                  ...parentGroupNodes.data,
                  children: [...parentGroupNodes.data.children, newNode.id],
                },
              };
              const childNode = {
                id: `${newNode.id}.${newChildId}`,
                type: 'eventNode',
                position: {
                  x: newNode.position.x + 100,
                  // y: newNode.position.y + 100,
                },
                data: {
                  label: eventName,
                  sequence: newChildId,
                  parentId: newNode.id,
                  children: [],
                  nodeProperty: {},
                },
                className: styles.node,
              };

              const childEdge = {
                id: `${newNode.id}->${newNode.id}.${newChildId}`,
                source: newNode.id,
                type: 'straight',
                target: `${newNode.id}.${newChildId}`,
              };

              newNode = {
                ...newNode,
                data: {
                  ...newNode.data,
                  children: [
                    ...newNode.data.children,
                    `${newNode.id}.${newChildId}`,
                  ],
                },
              };

              setNodes((nds) => [...nds, parentGroupNodes, newNode, childNode]);
              setEdges((eds) => [...eds, parentGroupToNode, childEdge]);
            } else {
              if (!parentGroup.data.children.includes(parentNode.nodeId)) {
                let ids = parentNode.nodeId;
                let lastSequence = parseInt(
                  getNode(
                    parentGroup.data.children[
                      parentGroup.data.children.length - 1
                    ],
                  ).data.sequence.split('.')[1],
                  10,
                );

                let newChildId = `${parentGroup.data.sequence}.${lastSequence + 1}.1`;
                let newNode = {
                  id: ids,
                  type: 'controlNode',
                  position,
                  data: {
                    ...parentNode,
                    children: [],
                    nodeProperty: {},
                    sequence: `${parentGroup.data.sequence}.${lastSequence + 1}`,
                  },
                };

                parentGroup = {
                  ...parentGroup,
                  data: {
                    ...parentGroup.data,
                    children: [...parentGroup.data.children, newNode.id],
                  },
                };

                let parentToNodeEdge = {
                  id: parentGroup.id + '->' + parentNode.nodeId,
                  source: parentGroup.id,
                  type: 'straight',
                  target: parentNode.nodeId,
                };
                const childNode = {
                  id: `${newNode.id}.${newChildId}`,
                  type: 'eventNode',
                  position: {
                    x: newNode.position.x + 100,
                    y: newNode.position.y + 100,
                  },
                  data: {
                    label: eventName,
                    sequence: newChildId,
                    parentId: newNode.id,
                    children: [],
                    nodeProperty: {},
                  },
                  className: styles.node,
                };

                const childEdge = {
                  id: `${newNode.id}->${newNode.id}.${newChildId}`,
                  source: newNode.id,
                  type: 'straight',
                  target: `${newNode.id}.${newChildId}`,
                };

                newNode = {
                  ...newNode,
                  data: {
                    ...newNode.data,
                    children: [
                      ...newNode.data.children,
                      `${newNode.id}.${newChildId}`,
                    ],
                  },
                };

                setNodes((nds) => [
                  ...nds.filter((n) => n.id !== parentGroup.id),
                  parentGroup,
                  newNode,
                  childNode,
                ]);
                setEdges((eds) => [...eds, parentToNodeEdge, childEdge]);
              } else {
                addNodeOnDropWithParent(node, eventName);
              }
            }
          } else {
            if (!eventName || !parentNode) {
              return;
            }
            console.log(node, 'parentNode');

            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            if (_.isEmpty(node)) {
              const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
              });
              let ids = parentNode.nodeId;

              let sequence = 1;
              nodes.forEach((node) => {
                if (Number.isInteger(node.data.sequence)) {
                  sequence = sequence + 1;
                }
              });
              let newChildId = `${sequence}.1`;
              let newNode = {
                id: ids,
                type:
                  parentNode.nodeType !== 'group' ? 'controlNode' : 'groupNode',
                position,
                data: {
                  ...parentNode,
                  label: parentNode.nodeName,
                  children: [],
                  sequence: sequence,
                  nodeProperty: {},
                },
              };
              const childNode = {
                id: `${newNode.id}.${newChildId}`,
                type: 'eventNode',
                position: {
                  x: newNode.position.x + Math.random() * (150 - 100) + 20,
                  y: newNode.position.y + Math.random() * (150 - 100) + 20,
                },
                data: {
                  label: eventName,
                  sequence: newChildId,
                  parent: newNode.id,
                  children: [],
                  nodeProperty: {},
                },
                className: styles.node,
              };

              const childEdge = {
                id: `${newNode.id}->${newNode.id}.${newChildId}`,
                source: newNode.id,
                type: 'straight',
                target: `${newNode.id}.${newChildId}`,
              };

              newNode = {
                ...newNode,
                data: {
                  ...newNode.data,
                  children: [
                    ...newNode.data.children,
                    `${newNode.id}.${newChildId}`,
                  ],
                },
              };
              setMainSequence(mainSequence + 1);
              setNodes((nds) => [...nds, newNode, childNode]);
              setEdges((eds) => [...eds, childEdge]);
            } else addNodeOnDropWithParent(node, eventName);
          }
        } catch (error) {
          console.error(error);
        }
      },
      [
        nodes,
        getNode,
        addNodeOnDropWithParent,
        mainSequence,
        setMainSequence,
        setEdges,
        setNodes,
        screenToFlowPosition,
      ],
    );

    // useEffect(() => {
    //   if (isforcelayoutenabled) {
    //     useForceLayout({ strength, distance });
    //     setisforcelayoutenabled(false);
    //   }
    // }, [isforcelayoutenabled, strength, distance]);

    // useForceLayout({ strength, distance });

    return (
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={proOptions}
        onConnect={onConnect}
        nodeOrigin={nodeOrigin}
        defaultEdgeOptions={defaultEdgeOptions}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={NODE_TYPES}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        {children &&
          (typeof children === 'function'
            ? children({ setSidebar, updatenodeDetails, updatedNodeConfig })
            : children)}
        {/* {children} */}

        {/* force layout settings --->> */}
        {/* <div>
          <Panel
            position="top-right"
            className="transition-all duration-100 ease-in-out"
            style={{
              width: "8%",
              height: "30%",
              backgroundColor: darkMode ? "transparent" : "transparent",
              display: "flex",
              justifyContent: panelOPen ? "center" : "start",
              alignItems: panelOPen ? "center" : "start",
              flexDirection: "column",
            }}
          >
            <div className="flex h-[15%] w-[100%] items-center justify-end py-2">
              <span
                onClick={togglePanel}
                className={`cursor-pointer transition-all duration-400 ease-in-out ${panelOPen ? "rotate-[260deg]" : "rotate-[-260deg] "}`}
              >
                <TfiSettings size={20} className="text-black dark:text-white" />
              </span>
            </div>

            <div
              className={`transform transition-transform duration-400 ease-in-out 
              ${
                panelOPen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              } 
            mt-2 flex h-[100%] w-[100%] flex-col justify-between rounded-md border 
            border-slate-300 bg-white shadow-sm dark:border-[#212121] dark:bg-[#0F0F0F]`}
            >
              <div className="flex h-[100%] w-[100%] items-center justify-around">
                <div>
                  <TorusRangeSlider
                    orientation="vertical"
                    sliderValue={strength}
                    setSliderValue={setStrength}
                    keys={"strenght"}
                    min={"-2000"}
                    max={"100"}
                    step={"10"}
                  />
                </div>

                <div>
                  <TorusRangeSlider
                    orientation="vertical"
                    sliderValue={distance}
                    setSliderValue={setDistance}
                    keys={"distance"}
                    min={"100"}
                    max={"1000"}
                    step={"50"}
                  />
                </div>
              </div>
              <div className="flex h-[10%] w-[100%] items-center justify-center pb-[1rem] pt-[0.8rem]">
                <div className="flex w-[50%] items-center justify-center">
                  <WiStrongWind
                    className="text-[#0736c4] dark:text-white/50"
                    size={25}
                  />
                </div>
                <div className="flex w-[50%] items-center justify-center">
                  <MdOutlineHorizontalDistribute
                    className="text-[#0736c4] dark:text-white/50"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </Panel>
        </div> */}

        {/* {menu && (
          <ContextMenuEvents
            uniqueNames={uniqueNames}
            setMenu={setMenu}
            menu={menu}
            {...menu}
            currentDrawing={currentDrawing}
            changeProperty={updatenodeDetails}
            setToogle={setSidebar}
            updatedNodeConfig={updatedNodeConfig}
            nodeConfig={nodeConfig}
            nodeData={nodeData}
          />
        )} */}
      </ReactFlow>
    );
  },
);
