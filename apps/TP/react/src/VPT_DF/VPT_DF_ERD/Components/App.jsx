/* eslint-disable */
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactFlow, { addEdge, ConnectionLineType, updateEdge } from 'reactflow';
import 'reactflow/dist/style.css';

import dagre from 'dagre';
import { v4 as uuidv4 } from 'uuid';

import CustomEdge from './CustomEdge';
import { CustomTableNode } from './DynamicNodes';

import { Toast } from 'primereact/toast';

import {
  getCrkNodeData,
  getLatestVersion,
} from '../../../commonComponents/api/fabricsApi';
import { TorusModellerContext } from '../../../Layout.jsx';

//Node Dimensions
const NODE_WIDTH = 172;
const NODE_HEIGHT = 36;

/**
 * Creates a context for the UniQue name.
 *
 * @return {Context} The UniQue name context.
 */
export const uniQueNameContext = createContext(null);
const NODE_TYPES = {
  customTable: CustomTableNode,
};

//App Function
export default forwardRef(function AppDF(
  {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    children,
    undoRedo,
  },
  ref,
) {
  const edgeUpdateSuccessful = useRef(true);
  const { onNodeContextMenu, onPaneClick, selectedTkey } =
    useContext(TorusModellerContext);

  const [reactFlowInstance, setreactflowinstance] = useState(null);
  const toast = useRef(null);

  const proOptions = { hideAttribution: true };

  const { takeSnapshot } = undoRedo;

  //Declaring node types

  //This is for edge type using for node connection
  const edgeTypes = useMemo(
    () => ({
      'start-end': CustomEdge,
    }),
    [],
  );

  //useEFfect for get data from navbar

  //This function is used to update the edges
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      try {
        takeSnapshot();
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
      } catch (error) {
        console.error(error);
      }
    },
    [setEdges, takeSnapshot],
  );

  const onEdgeUpdateEnd = useCallback(
    (_, edge) => {
      try {
        takeSnapshot();
        if (!edgeUpdateSuccessful.current) {
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeUpdateSuccessful.current = true;
      } catch (error) {
        console.error(error);
      }
    },
    [setEdges, takeSnapshot],
  );

  //This function is used to connect nodes
  const onConnect = useCallback(
    (params) => {
      try {
        takeSnapshot();
        const newEdge = {
          ...params,

          type: 'start-end',
          data: {
            startLabel: 'One',
            endLabel: 'One',
          },
        };

        setEdges((eds) => addEdge(newEdge, eds));
      } catch (error) {
        console.error(error);
      }
    },
    [setEdges, takeSnapshot],
  );

  // This function is used to handle the drag over event.
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  //This function is used to handle the drop event.
  const onDrop = useCallback(
    async (event) => {
      try {
        takeSnapshot();
        event.preventDefault();

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
        console.log(type, key, 'tupe');
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // create flow using DAGRE graph for Edges
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        //calculateLayout for both nodes and edges
        const getLayoutedElements = (nodes, edges, direction = 'TB') => {
          const isHorizontal = direction === 'LR';
          dagreGraph.setGraph({ rankdir: direction });

          nodes.forEach((node) => {
            dagreGraph.setNode(node.id, {
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
            });
          });

          edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
          });

          dagre.layout(dagreGraph);

          nodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = isHorizontal ? 'left' : 'top';
            node.sourcePosition = isHorizontal ? 'right' : 'bottom';

            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            node.position = {
              x: nodeWithPosition.x - NODE_WIDTH / 2,
              y: nodeWithPosition.y - NODE_HEIGHT / 2,
            };

            return node;
          });

          return { node: nodes, edge: edges };
        };
        let nodeProperty = {};
        if (selectedTkey == 'AF') {
          await getCrkNodeData(key)
            .then((res) => {
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
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          const response = await getLatestVersion(
            'torus',
            'Fintech',
            'DF-ERD',
            type.toLocaleLowerCase(),
          ).catch((error) => {
            console.error(error);
          });
          if (response && response?.data?.nodes[0]?.data?.nodeProperty) {
            nodeProperty = response?.data?.nodes[0]?.data?.nodeProperty;
          }
        }

        const newNode = {
          getLayoutedElements,
          id: uuidv4(),
          type,
          position,
          data: {
            label: '',

            nodeProperty: nodeProperty,
          },
          property: {
            name: '',
            nodeType: type,
            description: '',
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.log(error);
      }
    },
    [reactFlowInstance, setNodes, takeSnapshot, selectedTkey],
  );

  // Returns JSX
  return (
    <>
      <Toast ref={toast} />
      <ReactFlow
        proOptions={proOptions}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        nodeTypes={NODE_TYPES}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onInit={setreactflowinstance}
        ref={ref}
        onDrop={onDrop}
        edgeTypes={edgeTypes}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        connectionLineType={ConnectionLineType.SimpleBezier}
      >
        {children && (typeof children == 'function' ? children() : children)}
      </ReactFlow>
    </>
  );
});
