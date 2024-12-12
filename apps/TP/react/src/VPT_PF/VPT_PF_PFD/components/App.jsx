/* eslint-disable */
import {
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  MarkerType,
  updateEdge,
} from 'reactflow';

import dagre from 'dagre';
import 'reactflow/dist/style.css';
import FloatingEdge from './FloatEdge';

import 'primereact/resources/themes/tailwind-light/theme.css';
import { v4 as uuidv4 } from 'uuid';
import {
  getCrkNodeData,
  getLatestVersion,
} from '../../../commonComponents/api/fabricsApi';
import { AnimatedSvgEdge } from '../../../commonComponents/customEdge/animated-svg-edge';
import { TorusModellerContext } from '../../../Layout';
import CustomEdge from './CustomEdge';
import {
  ApiNode,
  AutomationNode,
  DBNode,
  DecisionNode,
  EndNode,
  FileNode,
  HumanTaskNode,
  SchedulerNode,
  StartNode,
  StreamNode,
} from './CustomNode';

//Node types
const NODE_TYPE = {
  startnode: StartNode,
  decisionnode: DecisionNode,
  endnode: EndNode,
  apinode: ApiNode,
  humantasknode: HumanTaskNode,
  schedulernode: SchedulerNode,
  automationnode: AutomationNode,
  dbnode: DBNode,
  streamnode: StreamNode,
  filenode: FileNode,
};

//Edge types
const edgeTypes = {
  customedge: CustomEdge,
  floatEdge: FloatingEdge,
  animatedSvgEdge: AnimatedSvgEdge,
};

const AppPF = forwardRef(
  (
    {
      nodes,
      edges,
      setEdges,
      setNodes,
      onNodesChange,
      onEdgesChange,
      children,
      proOptions,
      undoRedo,
    },
    ref,
  ) => {
    const { onNodeContextMenu, onPaneClick, selectedTkey, selectedAccntColor } =
      useContext(TorusModellerContext);
    const { takeSnapshot } = undoRedo;
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const dagreGraph = new dagre.graphlib.Graph();

    const edgeUpdateSuccessful = useRef(true);

    /**
     * Callback function that is invoked when the edge update ends.
     *
     * @param {Event} _ - The event object.
     * @param {Object} edge - The edge object.
     * @return {void}
     */
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // /**
    //  * Changes the color and role of child nodes based on the parent node color and role.
    //  *
    //  * @param {Array} nodes - The array of nodes to update.
    //  * @param {Array} childID - The array of child IDs.
    //  * @param {string} Id - The ID of the parent node.
    //  * @return {Array} - The updated array of nodes.
    //  */
    // const changeChildColor = (nodes, childID, Id) => {
    //   try {
    //     return (
    //       nodes &&
    //       nodes.map((node) => {
    //         if (childID.includes(node.id)) {
    //           return {
    //             ...node,
    //             data: {
    //               ...node.data,
    //               nodeColor: nodes.find((node) => node.id === Id)?.data.nodeColor,
    //               role: nodes.find((node) => node.id === Id)?.data.role,
    //             },
    //           };
    //         }
    //         return node;
    //       })
    //     );
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    /**
     * Function to handle connect nodes in react flow work space through edges
     *
     * @return {void} This function does not return a value.
     */
    const onConnect = useCallback(
      (params) => {
        try {
          takeSnapshot();
          if (nodes && nodes.length) {
            updateAddedEdges(params);
            setEdges((eds) => {
              if (
                eds.source !== params.target &&
                eds.target !== params.source
              ) {
                return addEdge(
                  {
                    ...params,

                    type:
                      nodes &&
                      nodes.filter((node) => node.id === params.source)[0]
                        ?.type === 'decisionnode'
                        ? 'customedge'
                        : 'smoothstep',
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                    },
                  },
                  eds,
                );
              } else {
                console.error('Source and Target cannot be same');
                return addEdge(eds);
              }
            });
          }
        } catch (error) {
          console.error(error);
        }
      },
      [setEdges, nodes, takeSnapshot],
    );

    /**
     * Function to handle drag over event in react flow work space.
     *
     * @param {Object} event - The drag over event object.
     * @return {void} This function does not return anything.
     */
    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    /**
     * Updates the details of a node in the nodes array based on the oldEdge, newEdges, and childID.
     *
     * @param {Array} nodes - The array of nodes to update.
     * @param {Object} oldEdge - The old edge object.
     * @param {Object} newEdges - The new edges object.
     * @param {Array} childID - The array of child IDs.
     * @return {Array} - The updated nodes array.
     */
    const updateNodeDetails = useCallback(
      (nodes, oldEdge, newEdges, getChildId) => {
        try {
          // takeSnapshot();
          return (
            nodes &&
            nodes.map((node) => {
              const childID = getChildId(newEdges.target, edges);
              if (node.id === oldEdge.target) {
                return {
                  ...node,
                  T_parentId: [...node.T_parentId, newEdges.source],

                  data: {
                    ...node.data,
                    nodeColor: nodes[newEdges.source]?.data.nodeColor,
                    role: nodes[newEdges.source]?.data.role,
                  },
                };
              }
              if (childID.includes(node.id)) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    nodeColor: nodes[newEdges.source]?.data.nodeColor,
                    role: nodes[newEdges.source]?.data.role,
                  },
                };
              }
              return node;
            })
          );
        } catch (error) {
          console.error(error);
          return nodes; // Return original nodes array in case of error
        }
      },
      [edges], // Dependency array should include all dependencies used within this function
    );

    // find child node Id using edges and targetId
    const getChildId = useCallback(
      (target, edges, sr = []) => {
        try {
          const sources = [];
          for (let index in edges) {
            if (
              edges[index].source === target &&
              !sr.includes(edges[index].target)
            ) {
              sr.push(edges[index].source);
              sources.push(edges[index].target);
              sources.push(...getChildId(edges[index].target, edges, sr));
            }
          }
          return sources;
        } catch (error) {
          console.error(error);
          return []; // Return an empty array or handle error case appropriately
        }
      },
      [], // Ensure to include all dependencies used inside getChildId if any
    );

    /**
     * Function to update JSON based on old and new edges.
     *
     * @param {Object} oldEdge - The old edge object.
     * @param {Object} newEdges - The new edges object.
     * @param {Array} nodes - The nodes array.
     * @param {Array} edges - The edges array.
     * @param {Function} setNodes - The state setter for nodes.
     * @param {Function} getChildId - Function to get child ID.
     * @param {Function} updateNodeDetails - Function to update node details.
     * @return {void} This function does not return anything.
     */
    const updateJson = useCallback(
      (
        oldEdge,
        newEdges,
        nodes,
        edges,
        setNodes,
        getChildId,
        updateNodeDetails,
      ) => {
        if (nodes && nodes.length) {
          try {
            const childID = getChildId(newEdges.target, edges);

            const updatedNodes = updateNodeDetails(
              nodes,
              oldEdge,
              newEdges,
              childID,
            );

            setNodes(updatedNodes);
          } catch (error) {
            console.error(error);
          }
        }
      },
      [], // Dependency array should ideally include all dependencies used within this function.
    );

    /**
     * Function to handle edge update in react flow work space.
     *
     * @param {Object} oldEdge - The old edge object.
     * @param {Object} newConnection - The new connection object.
     * @return {void} This function does not return anything.
     */
    const onEdgeUpdate = useCallback(
      (oldEdge, newConnection) => {
        try {
          takeSnapshot();
          edgeUpdateSuccessful.current = true;
          updateJson(
            oldEdge,
            newConnection,
            nodes,
            edges,
            setNodes,
            getChildId,
            updateNodeDetails,
          );
          return setEdges((els) => {
            return updateEdge(oldEdge, newConnection, els);
          });
        } catch (error) {
          console.error(error);
        }
      },
      [
        setEdges,
        takeSnapshot,
        updateJson,
        nodes,
        edges,
        setNodes,
        getChildId,
        updateNodeDetails,
      ],
    );

    /**
     * Callback function for handling onDrop event.
     * Generates a new ID for the dropped node and adds it to the nodes array.
     *
     * @param {Event} event - The onDrop event object.
     * @return {Promise<void>} A promise that resolves when the function completes.
     */
    const onDrop = useCallback(
      async (event) => {
        try {
          takeSnapshot();
          event.preventDefault();
          const reactFlowBounds = ref.current.getBoundingClientRect();
          const type =
            selectedTkey === 'AF'
              ? event.dataTransfer.getData('application/nodeType')
              : event.dataTransfer.getData('application/reactflow');
          const key =
            selectedTkey === 'AF'
              ? event.dataTransfer.getData('application/key')
              : event.dataTransfer.getData('application/name');
          if (typeof type === 'undefined' || !type) {
            return;
          }
          console.log(type, 'oms');
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });
          let nodeProperty = {};
          if (selectedTkey === 'AF') {
            await getCrkNodeData(key)
              .then((res) => {
                try {
                  console.log(res, 'crkres');
                  if (res && res?.data) {
                    let prop = res?.data?.nodes?.[0]?.data?.nodeProperty;
                    let key = Object.keys(prop).filter(
                      (key) =>
                        key !== 'nodeId' &&
                        key !== 'nodeName' &&
                        key !== 'nodeType' &&
                        key !== 'mode',
                    );
                    key.forEach((k) => {
                      nodeProperty[k] = prop[k];
                    });
                  }
                } catch (error) {
                  console.error(error);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            const response = await getLatestVersion(
              'torus',
              'Fintech',
              'PF',
              type.toLowerCase(),
            ).catch((error) => {
              console.error(error);
            });
            console.log(response, type, 'response');
            if (response && type !== 'startnode' && type !== 'endnode') {
              nodeProperty = response?.data?.nodes[0]?.data?.nodeProperty ?? {};
            }
          }

          const nodeDetails = type;
          console.log(nodeDetails, 'nodeDetails');
          const newNode = {
            id: uuidv4(),
            type: nodeDetails.toLowerCase(),
            position,
            T_parentId: [],
            data: {
              label:
                nodeDetails.toLowerCase() === 'endnode'
                  ? 'End'
                  : nodeDetails.toLowerCase() === 'startnode'
                    ? 'Start'
                    : nodeDetails.toLowerCase(),
              nodeColor: '#ccc',
              role: 'testing',
              nodeProperty: nodeProperty,
            },
            property: {
              name:
                nodeDetails.toLowerCase() === 'endnode'
                  ? 'End'
                  : nodeDetails.toLowerCase() === 'startnode'
                    ? 'Start'
                    : nodeDetails.toLowerCase(),
              nodeType: nodeDetails.toLowerCase(),
              description: '',
            },

            IPC_flag: 'N',
          };

          setNodes((nds) => nds.concat(newNode));
        } catch (error) {
          console.error(error);
        }
      },
      [reactFlowInstance, setNodes, takeSnapshot, selectedTkey],
    );

    console.log(nodes, '<--nodes');
    /**
     * Updates the nodes based on the provided role and childID.
     * @param {string} [role=""] - The role to be assigned to the nodes.
     * @param {Array} [childID=[]] - The array of child IDs.
     * @return {Promise<void>} - A promise that resolves when the update is complete.
     */
    const updateNode = useCallback(
      (role = '', childID = [], newEdge) => {
        try {
          // takeSnapshot();

          setNodes((node) => {
            let sourceIndex;
            node &&
              node.length > 0 &&
              node.forEach((ele, index) => {
                if (ele.id === newEdge.source) {
                  sourceIndex = index;
                }
              });
            const nds =
              node &&
              node.length > 0 &&
              node.map((nodes, index) => {
                if (nodes.id === newEdge.target) {
                  return {
                    ...nodes,
                    T_parentId: [...nodes.T_parentId, newEdge.source],

                    data: {
                      ...nodes.data,
                      nodeColor: node[sourceIndex]?.data.nodeColor,
                      role,
                    },
                  };
                }
                if (childID.includes(nodes.id)) {
                  return {
                    ...nodes,

                    data: {
                      ...nodes.data,

                      nodeColor: node[sourceIndex]?.data.nodeColor,
                      role,
                    },
                  };
                }
                return nodes;
              });
            return nds;
          });
        } catch (error) {
          console.error(error);
        }
      },
      [setNodes], // Include dependencies used inside updateNode
    );

    const updateAddedEdges = useCallback(
      (edge) => {
        if (edge) {
          try {
            const edgesSource = getChildId(edge.target, edges);
            let sourceIndex;
            // let targeTIndex;
            nodes &&
              nodes.length > 0 &&
              nodes.forEach((ele, index) => {
                // if (ele.id === newEdge.target) targeTIndex = index;
                if (ele.id === edge.source) sourceIndex = index;
              });
            edgesSource.unshift(edge.target);
            const role = nodes[Number(sourceIndex)]?.data?.role;
            updateNode(role, edgesSource, edge);
          } catch (error) {
            console.error(error);
          }
        }
      },
      [updateNode, nodes, edges],
    );

    const displayEdges = useMemo(
      () =>
        edges.map((edge) => {
          if (edge)
            return {
              ...edge,
              // type: 'animatedSvgEdge',
              animated: true,
              style: {
                stroke: selectedAccntColor,
                strokeWidth: 1,
              },
              markerEnd: {
                ...edge.markerEnd,
                color: selectedAccntColor,
              },
            };
        }),
      [edges],
    );
    return (
      <>
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          onEdgeUpdate={onEdgeUpdate}
          connectionLineType={ConnectionLineType.SmoothStep}
          nodeTypes={NODE_TYPE}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          proOptions={proOptions}
          fitView={true}
        >
          {children && (typeof children == 'function' ? children() : children)}
        </ReactFlow>
      </>
    );
  },
);

export default AppPF;
