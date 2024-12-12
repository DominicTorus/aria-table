/* eslint-disable */
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  MarkerType,
  updateEdge,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import {
  getCrkNodeData,
  getLatestVersion,
} from '../../../commonComponents/api/fabricsApi';
import {
  getNodePositionInsideParent,
  sortNodes,
} from '../../../commonComponents/react-flow-pro/dynamicGrouping/utils';
import { getHelperLines } from '../../../commonComponents/react-flow-pro/helperLines/getHelperLines';
import HelperLines from '../../../commonComponents/react-flow-pro/helperLines/helperLines';
import useUndoRedo from '../../../commonComponents/react-flow-pro/useUndoRedo';
import { TorusModellerContext } from '../../../Layout';
import {
  avatar,
  ButtonNode,
  card,
  checkbox,
  column,
  datePicker,
  dropdown,
  Form,
  icon,
  InputNode,
  label,
  list,
  NavBarNode,
  pagination,
  pininput,
  progress,
  radiobutton,
  radioGroup,
  Sidebarnav,
  switchmode,
  Table,
  textarea,
  TextUpdaterNode,
  timeinput,
} from './customNodes/CustomNode';
import groupNode from './customNodes/groupNode';

//Node Types
const nodeTypes = {
  navbar: NavBarNode,
  table: Table,
  form: Form,
  sidebarnav: Sidebarnav,
  newNode: TextUpdaterNode,
  button: ButtonNode,
  input: InputNode,
  textinput: InputNode,
  group: groupNode,
  radiogroup: radioGroup,
  checkbox: checkbox,
  textarea: textarea,
  time: timeinput,
  card: card,
  datepicker: datePicker,
  dropdown: dropdown,
  avatar: avatar,
  icon: icon,
  label: label,
  list: list,
  pagination: pagination,
  pininput: pininput,
  progress: progress,
  radiobutton: radiobutton,
  switch: switchmode,
  column: column,
};

/**
 * Renders the App component.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - {string} tenant - The tenant value.
 *   - {string} appGroup - The appGroup value.
 *   - {function} stateTrack - The stateTrack function.
 *   - {string} application - The application value.
 *   - {string} currentFabric - The currentFabric value.
 * @returns {JSX.Element} The rendered App component.
 */
const AppUF = forwardRef(
  (
    { nodes, edges, setEdges, setNodes, onEdgesChange, children, proOptions },
    ref,
  ) => {
    const { onNodeContextMenu, onPaneClick, selectedTkey, selectedFabric } =
      useContext(TorusModellerContext);
    const [helperLineHorizontal, setHelperLineHorizontal] = useState(undefined);
    const [helperLineVertical, setHelperLineVertical] = useState(undefined);
    const { getIntersectingNodes, flowToScreenPosition } = useReactFlow();
    const store = useStoreApi();

    const [nodeConfig, setNodeConfig] = useState([]);

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const [menu, setMenu] = useState(false);

    const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();

    useEffect(() => {
      /**
       * Handles errors that occur during the execution of the function.
       *
       * @param {Error} e - The error object.
       * @return {void}
       */
      const errorHandler = (e) => {
        if (
          e.message.includes(
            'ResizeObserver loop completed with undelivered notifications' ||
              'ResizeObserver loop limit exceeded' ||
              'Maximum update depth exceeded' ||
              'React limits the number of nested updates to prevent infinite loops',
          )
        ) {
          const resizeObserverErr = document.getElementById(
            'webpack-dev-server-client-overlay',
          );
          if (resizeObserverErr) {
            resizeObserverErr.style.display = 'none';
          }
        }
      };
      window.addEventListener('error', errorHandler);

      return () => {
        window.removeEventListener('error', errorHandler);
      };
    }, []);

    /**
     * Custom implementation of the applyNodeChanges hook.
     *
     * @param {Array} changes - An array of changes to apply to the nodes.
     * @param {Object} nodes - The nodes object.
     * @return {void} No return value.
     */
    const customApplyNodeChanges = useCallback((changes, nodes) => {
      // reset the helper lines (clear existing lines, if any)
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);
      // this will be true if it's a single node being dragged
      // inside we calculate the helper lines and snap position for the position where the node is being moved to
      if (
        changes.length === 1 &&
        changes[0].type === 'position' &&
        changes[0].dragging &&
        changes[0].position
      ) {
        const helperLines = getHelperLines(changes[0], nodes);
        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x =
          helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y =
          helperLines.snapPosition.y ?? changes[0].position.y;
        // if helper lines are returned, we set them so that they can be displayed
        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }
      return applyNodeChanges(changes, nodes);
    }, []);

    /**
     * Generates a callback function that updates the nodes based on the given changes.
     *
     * @param {Object} changes - The changes to be applied to the nodes.
     * @return {Function} The callback function.
     */
    const onNodesChange = useCallback(
      (changes) => {
        setNodes((nodes) => customApplyNodeChanges(changes, nodes));
      },
      [setNodes, customApplyNodeChanges],
    );

    /**
     * Handles the 'dragover' event by preventing the default behavior and setting the
     * drop effect to 'move'.
     *
     * @param {DragEvent} event - The dragover event object.
     * @return {void} This function does not return anything.
     */
    const onDragOver = (event) => {
      if (selectedTkey === 'AF') {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    /**
     * Handles the drop event for the react flow instance.
     *
     * @param {Event} event - The drop event object.
     * @return {Promise<void>} - A promise that resolves when the function completes.
     */
    const onDrop = async (event) => {
      if (selectedTkey === 'AF') {
        return;
      }
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
      // const roles = event.dataTransfer.getData("application/roles");
      // const rolesColor = event.dataTransfer.getData("application/roleColor");
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const nodeStyle =
        type === 'group' ? { width: 400, height: 200 } : undefined;
      const intersections = getIntersectingNodes({
        x: position.x,
        y: position.y,
        width: 40,
        height: 40,
      }).filter((n) => n.type === 'group');
      const groupNode = intersections[0];

      const nodeDetails = type;

      let nodeProperty = {
        elementInfo: {
          events: [
            {
              name: 'onLoad',
              type: 'Group',
              enabled: 'true',
            },
          ],
        },
      };
      if (selectedTkey == 'AF') {
        await getCrkNodeData(key)
          .then((res) => {
            if (res && res?.data) {
              let prop = res?.data?.nodes?.[0]?.data?.nodeProperty;
              if (!prop) return;
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
        if (type !== 'group') {
          const response = await getLatestVersion(
            'torus',
            'Fintech',
            selectedFabric,
            type,
          ).catch((error) => {
            console.error(error);
          });
          if (response && response?.data?.nodes?.[0]?.data?.nodeProperty) {
            nodeProperty = response?.data?.nodes?.[0]?.data?.nodeProperty;
          }
        }
      }
      let ids = uuidv4();
      const newNode = {
        id: ids,
        type: nodeDetails,
        position,
        T_parentId: groupNode ? groupNode?.id : ids,
        canva: groupNode ? groupNode?.id : 'canvas',
        layoutFlag: 'no',
        grid: {
          start: '',
          length: '',
          order: '',
        },
        groupType: 'group',
        height: '',
        positionAbsolute: position,
        viewport: {
          screenWidth,
          screenHeight,
        },
        data: {
          label: '',
          height: '',
          width: '',
          nodeProperty: nodeProperty,
        },

        flowToScreenPosition: {
          ...flowToScreenPosition({ x: position.x, y: position.y }),
        },
        property: {
          name: '',
          nodeType: nodeDetails,
          description: '',
        },
        style: nodeStyle,
      };
      if (groupNode) {
        if (type === 'group') {
          alert("Can't place group inside group 1");
          return;
        }
        // if we drop a node on a group node, we want to position the node inside the group
        newNode.position = getNodePositionInsideParent(
          {
            position,
            width: 40,
            height: 40,
          },
          groupNode,
        ) ?? { x: 0, y: 0 };
        newNode.parentNode = groupNode?.id;
        delete newNode.groupType;
        newNode.expandParent = true;
      }
      // we need to make sure that the parents are sorted before the children
      // to make sure that the children are rendered on top of the parents
      const sortedNodes = store
        .getState()
        .getNodes()
        .concat(newNode)
        .sort(sortNodes);
      setNodes(sortedNodes);
      takeSnapshot();
    };

    /**
     * Callback function for when a node is dragged and stopped.
     * Updates the node's position and parent node if it intersects with another node.
     *
     * @param {Object} _ - The event object.
     * @param {Object} node - The node being dragged.
     * @return {void}
     */
    const onNodeDragStop = useCallback(
      (_, node) => {
        const intersections = getIntersectingNodes(node).filter(
          (n) => n.type === 'group',
        );
        const groupNode = intersections[0];
        // when there is an intersection on drag stop, we want to attach the node to its new parent
        if (intersections.length && node.parentNode !== groupNode?.id) {
          if (node.type === 'group') {
            alert("Can't place group inside group 2");
            return;
          }
          const nextNodes = store
            .getState()
            .getNodes()
            .map((n) => {
              if (n.id === groupNode.id) {
                return {
                  ...n,
                  className: '',
                  flowToScreenPosition: {
                    ...n?.flowToScreenPosition,
                    ...flowToScreenPosition({
                      x: n.position.x,
                      y: n.position.y,
                    }),
                  },
                };
              } else if (n.id === node.id) {
                const position = getNodePositionInsideParent(n, groupNode) ?? {
                  x: 0,
                  y: 0,
                };
                return {
                  ...n,
                  position,
                  parentNode: groupNode.id,
                  T_parentId: groupNode?.id,
                  flowToScreenPosition: {
                    ...n?.flowToScreenPosition,
                    ...flowToScreenPosition({ x: position.x, y: position.y }),
                  },
                  extent: 'parent',
                };
              }
              return n;
            })
            .sort(sortNodes);
          setNodes(nextNodes);
        }
      },
      [getIntersectingNodes, setNodes, store],
    );

    /**
     * Callback function that is triggered when a node is dragged.
     *
     * @param {Object} event - The event object.
     * @param {Object} node - The node being dragged.
     * @return {void}
     */
    const onNodeDrag = useCallback(
      (_, node) => {
        const intersections = getIntersectingNodes(node).filter(
          (n) => n.type === 'group',
        );
        const groupClassName =
          intersections.length && node.parentNode !== intersections[0]?.id
            ? 'active'
            : '';
        setNodes((nds) => {
          return (
            nds &&
            nds.map((n) => {
              if (n.type === 'group') {
                return {
                  ...n,
                  className: groupClassName,
                  flowToScreenPosition: {
                    ...n?.flowToScreenPosition,
                    ...flowToScreenPosition({
                      x: n.position.x,
                      y: n.position.y,
                    }),
                  },
                };
              } else if (n.id === node.id) {
                return {
                  ...n,
                  position: node.position,
                  flowToScreenPosition: {
                    ...n?.flowToScreenPosition,
                    ...flowToScreenPosition({
                      x: node.position.x,
                      y: node.position.y,
                    }),
                  },
                };
              }
              return { ...n };
            })
          );
        });
      },
      [getIntersectingNodes, setNodes],
    );

    /**
     * Callback function that is called when a new connection is made.
     *
     * @param {Object} params - The parameters of the connection.
     * @param {string} params.source - The source node of the connection.
     * @param {string} params.target - The target node of the connection.
     * @param {string} params.sourceHandle - The source handle of the connection.
     * @param {string} params.targetHandle - The target handle of the connection.
     * @return {void} This function does not return anything.
     */
    const onConnect = useCallback(
      (params) => {
        if (nodes.length) {
          setEdges((eds) => {
            if (eds.source !== params.target && eds.target !== params.source) {
              return addEdge(
                {
                  ...params,

                  type: nodes,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                  },
                },
                eds,
              );
            } else {
              return addEdge(eds);
            }
          });
        }
        takeSnapshot();
      },
      [setEdges, nodes, takeSnapshot],
    );

    /**
     * Callback function that is called when an edge is updated.
     *
     * @param {Object} oldEdge - The old edge object.
     * @param {Object} newConnection - The new connection object.
     * @return {void} This function does not return anything.
     */
    const onEdgeUpdate = useCallback(
      (oldEdge, newConnection) => {
        takeSnapshot();
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
      },
      [takeSnapshot],
    );

    const connectionLineStyle = {
      strokeWidth: 3,
      stroke: 'red',
    };

    /**
     * Deletes a node from the state.
     *
     * @param {string} id - The ID of the node to delete.
     * @return {void}
     */
    const deleteNode = useCallback(
      (id) => {
        takeSnapshot();
        if (nodeConfig.hasOwnProperty(id)) {
          let data = { ...nodeConfig };
          delete data[id];
          setNodeConfig(data);
        }
        setNodes((nodes) =>
          nodes.filter((node) => {
            if (node.id !== id) {
              if (node.parentId && node.parentId.includes(id)) {
                return {
                  ...node,
                  parentId: node.parentId.filter((parentId) => parentId !== id),
                };
              }
              return node;
            }
          }),
        );

        setEdges((edges) =>
          edges.filter((edge) => {
            if (edge.source !== id && edge.target !== id) {
              return edge;
            }
          }),
        );
        setMenu(null);
      },
      [nodes, nodeConfig, takeSnapshot],
    );

    return (
      <ReactFlow
        translateExtent={[
          [0, 0],
          [Infinity, Infinity],
        ]}
        nodeExtend={[
          [0, 0],
          [Infinity, Infinity],
        ]}
        ref={ref}
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        onDragOver={onDragOver}
        selectNodesOnDrag={false}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        panOnDrag={false}
        panOnScroll={true}
        zoomOnScroll={false}
        preventScrolling={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        autoPanOnNodeDrag={false}
        deleteNode={deleteNode}
        menu={menu}
        onPaneClick={onPaneClick}
        snapGrid={[10, 10]}
        snapToGrid={true}
        nodesDraggable={true}
        onEdgeUpdate={onEdgeUpdate}
        connectionLineStyle={connectionLineStyle}
        proOptions={proOptions}
      >
        {children &&
          (typeof children == 'function'
            ? children({
                undo,
                redo,
                canUndo,
                canRedo,
              })
            : children)}

        <HelperLines
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />
      </ReactFlow>
    );
  },
);

/**
 * Renders the FlowWithProvider component.
 *
 * @param {Object} props - The properties passed to the component.
 * @return {JSX.Element} The rendered React element.
 */

export default AppUF;
