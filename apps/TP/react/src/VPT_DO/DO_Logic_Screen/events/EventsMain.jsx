import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IoIosArrowDown, IoIosArrowRoundBack } from 'react-icons/io';
import { MdOutlineEmojiEvents } from 'react-icons/md';
import {
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { eventSummaryAndNodeProperty } from '../../../commonComponents/api/orchestratorApi';
import { Upload } from '../../../commonComponents/Model/UploadJson';
import { nodeInfoTabs, RenderJson } from '../../../jonui/JsonUI';
import {
  FailureIcon,
  NavbarArrowDown,
  NavbarBackward,
  PropertyIcon,
  SuccessIcon,
} from '../../../SVG_Application';
import TorusDropDown from '../../../torusComponents/TorusDropDown';
import TorusModularInput from '../../../torusComponents/TorusModularInput';
import TorusRadio from '../../../torusComponents/TorusRadio';
import TorusTab from '../../../torusComponents/TorusTab';
import { handlNestedObj } from '../../../utils/utils';
import { EventDashBoard } from '../../../VPT_UF/VPT_EVENTS/components/DashBoard';
import { ContextMenuEvents } from './OrchContextMenuEvents';

import TorusModularTextArea from '../../../torusComponents/TorusTextArea';
import { LogicCenterContext } from '../LogicCenter';
import axios from 'axios';
import EventsTargetAccordian from '../EventsTargetAccordian';
import { AxiosService } from '../../../utils/axiosService';
import { Header } from 'react-aria-components';
import TorusButton from '../../../torusComponents/TorusButton';
import { Back } from '../../../SVG_Application';
import { TorusModellerContext } from '../../../Layout';
import {
  artifactList,
  getAllCatalogWithArtifactGroup,
} from '../../../commonComponents/api/fabricsApi';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const handlerDropdownData = [
  { key: 'saveHandler', label: 'saveHandler', listenerType: 'type1' },
  { key: 'bindTran', label: 'bindTran', listenerType: 'type1' },
  { key: 'infoMsg', label: 'infoMsg', listenerType: 'type1' },
  { key: 'updateHandler', label: 'updateHandler', listenerType: 'type1' },
  { key: 'getFormData', label: 'getFormData', listenerType: 'type1' },
  { key: 'setFormData', label: 'setFormData', listenerType: 'type1' },
  { key: 'eventEmitter', label: 'eventEmitter', listenerType: 'type1' },
  { key: 'showProfile', label: 'showProfile', listenerType: 'type2' },
  {
    key: 'showProfileAsModal',
    label: 'showProfileAsModal',
    listenerType: 'type2',
  },
  { key: 'searchHandler', label: 'searchHandler', listenerType: 'type2' },
  { key: 'clearHandler', label: 'clearHandler', listenerType: 'type1' },
];

function EventsMainUO({
  actionName,
  setNavigateTo,
  initial,
  currentDrawing,
  selectedTheme,
}) {
  const { getNode } = useReactFlow();

  const { mappedData, setMappedData, controlJson, client } =
    useContext(LogicCenterContext);

  const [nodes, setNodes, onNodesChange] = useNodesState(initial?.NDS || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial?.NDE || []);

  const [menu, setMenu] = React.useState(null);

  const ref = React.useRef(null);
  const [eventsNodeType, setEventsNodeType] = useState(null);
  const [eventHandlerType, setEventHandlerType] = useState(null);
  const [selectedResponseData, setSelectedResponseData] = useState('defaults');
  const [contextProps, setContextProps] = useState(null);
  const [handlerNodeVal, setHandlerNodeVal] = useState(null);
  const [selectedHandlerData, setSelectedHandlerData] = useState(null);

  const [showNodeProperty, setShowNodeProperty] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sucessBtn, setSucessBtn] = useState(false);
  const [DropdownData, setDropdownData] = useState([]);
  const [clickedGroup, setClickedGroup] = useState([]);
  const [failureBtn, setFailureBtn] = useState(false);
  const { controlJson: eventJson } = useContext(LogicCenterContext);
  const { getNodes, getEdges } = useReactFlow();
  const [riseListenSidebar, setRiseListenSidebar] = useState(false);
  const [riseListenSidebarForShow, setRiseListenSidebarForShow] =
    useState(false);
  const [getnodeid, setnodeid] = useState(null);
  const [eventPropertyDropdownData, setEventPropertyDropdownData] =
    useState(handlerDropdownData);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY - 100,
        left: event.clientX < pane.width - 200 && event.clientX - 300,
        right:
          event.clientX >= pane.width - 200 &&
          pane.width - (event.clientX - 300),
        bottom:
          event.clientY >= pane.height - 200 &&
          pane.height - (event.clientY - 100),
      });
    },
    [setMenu],
  );

  const updatedNodeConfig = (id, metadata, updatedData) => {
    console.log(id, metadata, updatedData, 'upateconfg');
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
                    ...updatedData,
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
                    ...updatedData,
                  },
                },
              };
            }
          }
          return node;
        });
      });

      setSelectedNode((prev) => {
        if (prev?.id === id) {
          if (prev?.data?.nodeProperty) {
            return {
              ...prev,
              data: {
                ...prev.data,
                nodeProperty: {
                  ...prev.data.nodeProperty,
                  ...metadata,
                  ...updatedData,
                },
              },
            };
          } else
            return {
              ...prev,
              data: {
                ...prev.data,
                nodeProperty: {
                  ...metadata,
                  ...updatedData,
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
  const changeProperty = (values) => {
    try {
      // takeSnapshot();
      let key = Object.keys(values)[0];
      let value = Object.values(values)[0];
      console.log('values', values, key, value);
      if (key) {
        setNodes((nds) => {
          return (
            nds &&
            nds.map((nds) => {
              if (nds.id == selectedNode.id) {
                if (key == 'name') {
                  return {
                    ...nds,
                    data: {
                      ...nds.data,
                      label: value,
                    },
                    property: {
                      ...nds.property,
                      [key]: value,
                    },
                  };
                } else if (key === 'label') {
                  return {
                    ...nds,
                    label: value,
                    data: {
                      ...nds.data,
                      label: value,
                    },
                  };
                } else if (key === 'layoutFlag') {
                  return {
                    ...nds,
                    [key]: value,
                  };
                } else if (
                  key === 'start' ||
                  key === 'length' ||
                  key === 'order'
                ) {
                  return {
                    ...nds,
                    grid: {
                      ...nds?.grid,
                      [key]: value,
                    },
                  };
                } else if (key == 'value') {
                  return {
                    ...nds,
                    data: {
                      ...nds.data,
                      [key]: value,
                    },
                  };
                } else {
                  return {
                    ...nds,
                    property: {
                      ...nds.property,
                      [key]: value,
                    },
                  };
                }
              }

              return nds;
            })
          );
        });

        setSelectedNode((prev) => {
          if (key == 'name') {
            return {
              ...prev,
              data: {
                ...prev.data,
                label: value,
              },
              property: {
                ...prev.property,
                [key]: value,
              },
            };
          } else if (key == 'label') {
            return {
              ...prev,
              label: value,
              data: {
                ...prev.data,
                label: value,
              },
            };
          } else if (key == 'layoutFlag') {
            return {
              ...prev,
              [key]: value,
            };
          } else if (key === 'start' || key === 'length' || key === 'order') {
            return {
              ...prev,
              grid: {
                ...prev?.grid,
                [key]: value,
              },
            };
          } else {
            return {
              ...prev,
              property: {
                ...prev.property,
                [key]: value,
              },
            };
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eventsNodeGalleryData = useMemo(() => {
    let component;
    let control;
    if (actionName && actionName.length === 2) {
      component = actionName[1];
      control = actionName[1];
    }
    if (actionName && actionName.length === 3) {
      component = actionName[1];
      control = actionName[2];
    }
    let result = {};
    if (actionName && actionName.length === 1) {
      component = actionName[0];
      control = actionName[0];

      result = {
        nodeId: component,
        nodeName: component,
        nodeType: 'artifact',
        events: [
          {
            name: 'onLoad',
          },
        ],
      };
    } else if (
      component &&
      control &&
      controlJson &&
      Array.isArray(controlJson) &&
      controlJson.length > 0
    ) {
      if (component === control) {
        controlJson.forEach((item) => {
          if (item?.nodeId === component) {
            result = {
              nodeId: item?.nodeId,
              nodeName: item?.nodeName,
              nodeType: item?.nodeType,
              events: item?.elementInfo?.events,
            };
          }
        });
      }
      if (component !== control) {
        controlJson.forEach((item) => {
          if (
            item?.nodeId === component &&
            item?.children &&
            Array.isArray(item?.children) &&
            item?.children?.length > 0
          ) {
            item?.children.forEach((child) => {
              if (child?.nodeId === control) {
                result = {
                  nodeId: child?.nodeId,
                  nodeName: child?.nodeName,
                  nodeType: child?.nodeType,
                  events: child?.elementInfo?.events,
                };
              }
            });
          }
        });
      }
    }
    return result;
  }, [controlJson, actionName]);

  const onPaneClick = useCallback(
    (type) => {
      setMenu(null);
      if (type === 'delete') {
        setShowNodeProperty(false);
      }
    },
    [setMenu],
  );

  const handleSave = async () => {
    let searchKey = [];
    let searchValue = actionName;
    if (actionName && actionName.length === 3) {
      searchKey = ['name', 'nodeId', 'elementId'];
    }

    if (actionName && actionName.length === 2) {
      searchKey = ['name', 'nodeId'];
    }

    if (actionName && actionName.length === 1) {
      searchKey = ['name'];
    }

    const oldEventSummary = handlNestedObj(
      'get',
      '',
      'events.eventSummary',
      searchKey,
      searchValue,
      mappedData,
    );

    if (nodes.length === 0) {
      setMappedData((prev) => {
        return handlNestedObj(
          'set',
          {},
          'events',
          searchKey,
          searchValue,
          prev,
        );
      });
    } else {
      let data = await eventSummaryAndNodeProperty(nodes, oldEventSummary);
      if (typeof data === 'object' && Object.keys(data).length > 0) {
        data = {
          ...data,
          NDS: nodes,
          NDE: edges,
        };

        setMappedData((prev) => {
          let result = handlNestedObj(
            'set',
            data,
            'events',
            searchKey,
            searchValue,
            prev,
          );

          return result;
        });
      }
    }
  };

  const handleSelectedListener = (e, resdata, listenHandler) => {
    try {
      console.log(
        e,
        resdata,
        getnodeid,
        listenHandler,
        'handleSelectedListener',
      );
      let parentNode = getNode(getnodeid.id);
      console.log(parentNode, 'parentNoder');

      if (parentNode.data.parentId === e) {
        alert('cannot select parent');
        return;
      }
      let id = e;
      // setSelectedListener(e);
      let nod = getNode(id);
      const hasChild =
        parentNode &&
        Array.isArray(parentNode.data.children) &&
        parentNode.data.children.length > 0;
      let maxChildId;
      if (hasChild && parentNode.data.children.length == 1) {
        maxChildId = parentNode.data.children[0];
        const hasChild = maxChildId.split('.');
        const lastChild = hasChild[hasChild.length - 1];
        maxChildId = parseInt(lastChild, 10);
      } else {
        maxChildId = getNodes().reduce((initialId, currentNode) => {
          if (currentNode.id.startsWith(`${parentNode.id}.`)) {
            const hasChild = currentNode.id.split('.');
            const lastChild = hasChild[hasChild.length - 1];
            const childId = parseInt(lastChild, 10);
            return childId;
          }
          return initialId;
        }, 0);
      }
      const newChildId = maxChildId + 1;
      let childId = `${parentNode.id}.${newChildId}`;
      let seq = childId.split('.').splice(1).join('.');

      if (resdata !== 'defaults') {
        let responseNode = {
          id: childId,
          type: 'responseNode',
          position: {
            x: parentNode.position.x + Math.random() * (150 - 100) + 100,
            y: parentNode.position.y + Math.random() * (150 - 100) + 100,
          },

          data: {
            label: resdata,
            responseType: resdata,
            parentId: parentNode.id,
            children: [],
            sequence: seq,
          },
        };

        const responseEdge = {
          id: `${parentNode.id}->${responseNode.id}`,
          source: parentNode.id,
          type: 'straight',
          target: responseNode.id,
        };

        let handlerNode = {
          id: `${responseNode.id + '.1'}`,
          type: 'handlerNode',
          eventContext: 'riseListen',
          label: listenHandler ?? 'riseListen',
          position: {
            x: responseNode.position.x + Math.random() * (150 - 100) + 100,
            y: responseNode.position.y + Math.random() * (150 - 100) + 100,
          },
          data: {
            label: listenHandler ?? 'riseListen',
            eventContext: 'riseListen',
            parentId: responseNode.id,
            value: '',
            sequence: `${seq}.1`,
            children: [],
          },
        };

        const handlerEdge = {
          id: `${responseNode.id}->${handlerNode.id}`,
          source: responseNode.id,
          type: 'straight',
          target: handlerNode.id,
        };

        responseNode = {
          ...responseNode,
          data: {
            ...responseNode.data,
            children: [...responseNode.data.children, handlerNode.id],
          },
        };
        parentNode = {
          ...parentNode,
          data: {
            ...parentNode.data,
            children: [...parentNode.data.children, responseNode.id],
          },
        };
        if (nod) {
          let idw = nod.id.split('.')[0];
          const copyofNode = {
            id: idw + `${handlerNode.data.sequence}.1`,
            type: nod.type,
            position: {
              x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
              y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              ...nod.data,
              parentId: handlerNode.id,
              children: [],
              sequence: `${handlerNode.data.sequence}.1`,
            },
          };

          handlerNode = {
            ...handlerNode,
            data: {
              ...handlerNode.data,

              children: [...handlerNode.data.children, copyofNode.id],
            },
          };

          const edge = {
            id: `${handlerNode.id}->${copyofNode.id}`,
            source: handlerNode.id,
            type: 'straight',
            target: copyofNode.id,
          };
          setNodes((nds) => [
            ...nds.filter((n) => n.id !== parentNode.id),
            copyofNode,
            responseNode,
            handlerNode,
            parentNode,
          ]);
          setEdges((eds) => [...eds, handlerEdge, edge, responseEdge]);
        } else {
          const nodesData = DropdownData.filter((node) => {
            return node.key === id;
          });
          let newNode = {
            id: `${nodesData[0].key}.${handlerNode.data.sequence}.1`,
            type: nodesData[0].type !== 'group' ? 'controlNode' : 'groupNode',
            position: {
              x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
              y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              sequence: `${handlerNode.data.sequence}.1`,
              parentId: handlerNode.id,
              nodeName: nodesData[0].label,
              nodeId: nodesData[0].key,
              nodeType: nodesData[0].type,
              children: [],
            },
          };
          const edge = {
            id: `${id}->${newNode.id}`,
            source: handlerNode.id,
            type: 'straight',
            target: newNode.id,
          };

          handlerNode = {
            ...handlerNode,
            data: {
              ...handlerNode.data,
              children: [...handlerNode.data.children, newNode.id],
            },
          };

          setNodes((nds) => [
            ...nds.filter((node) => node.id !== parentNode.id),
            parentNode,
            handlerNode,
            responseNode,

            newNode,
          ]);
          setEdges((eds) => [...eds, handlerEdge, edge, responseEdge]);
        }
      } else {
        let handlerNode = {
          id: childId,
          type: 'handlerNode',
          eventContext: 'riseListen',
          label: listenHandler ?? 'riseListen',

          position: {
            x: parentNode.position.x + Math.random() * (150 - 100) + 100,
            y: parentNode.position.y + Math.random() * (150 - 100) + 100,
          },
          data: {
            label: listenHandler ?? 'riseListen',
            eventContext: 'riseListen',

            parentId: parentNode.id,
            value: '',
            sequence: `${seq}`,
            children: [],
          },
        };

        const handlerEdge = {
          id: `${parentNode.id}->${handlerNode.id}`,
          source: parentNode.id,
          type: 'straight',
          target: handlerNode.id,
        };

        parentNode = {
          ...parentNode,
          data: {
            ...parentNode.data,

            children: [...parentNode.data.children, handlerNode.id],
          },
        };
        if (nod) {
          let idw = nod.id.split('.')[0];
          const copyofNode = {
            id: idw + `.${seq}.1`,
            type: nod.type,
            position: {
              x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
              y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              ...nod.data,
              parentId: handlerNode.id,
              children: [],
              sequence: `${seq}.1`,
            },
          };

          const edge = {
            id: `${handlerNode.id}->${copyofNode.id}`,
            source: handlerNode.id,
            type: 'straight',
            target: copyofNode.id,
          };
          handlerNode = {
            ...handlerNode,
            data: {
              ...handlerNode.data,
              children: [...handlerNode.data.children, copyofNode.id],
            },
          };

          setNodes((nds) => [
            ...nds.filter((node) => node.id !== parentNode.id),
            handlerNode,
            copyofNode,
            parentNode,
          ]);
          setEdges((eds) => [...eds, edge, handlerEdge]);
        } else {
          const nodesData = DropdownData.filter((node) => {
            return node.key === id;
          });
          let newNode = {
            id: `${nodesData[0].key}.${seq}.1`,
            type: nodesData[0].type !== 'group' ? 'controlNode' : 'groupNode',
            position: {
              x: parentNode.position.x + Math.random() * (150 - 100) + 100,
              y: parentNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              sequence: `${seq}.1`,
              parentId: handlerNode.id,
              nodeName: nodesData[0].label,
              nodeId: nodesData[0].key,
              nodeType: nodesData[0].type,
              children: [],
            },
          };
          const edge = {
            id: `${handlerNode.id}->${newNode.id}`,
            source: handlerNode.id,
            type: 'straight',
            target: newNode.id,
          };

          handlerNode = {
            ...handlerNode,
            data: {
              ...handlerNode.data,
              children: [...handlerNode.data.children, newNode.id],
            },
          };

          setNodes((nds) => [
            ...nds.filter((node) => node.id !== parentNode.id),
            parentNode,
            handlerNode,
            newNode,
          ]);
          setEdges((eds) => [...eds, edge, handlerEdge]);
        }
      }
      setSelectedResponseData('defaults');
      setSelectedHandlerData(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full w-full flex-col ">
      <div
        className="flex h-[8%] w-[100%]  items-center justify-between border-b-1 pb-[0.5vw] pl-0 pr-[0.5vw] pt-[0.5vw]"
        style={{
          borderColor: `${selectedTheme?.border}`,
          color: `${selectedTheme?.text}`,
        }}
      >
        <div className="flex w-[80%] cursor-pointer items-center text-[1.10vw] font-medium leading-[1.85vh]">
          <span className="cursor-pointer" onClick={() => setNavigateTo('')}>
            <NavbarBackward
              className={'h-[1.25vw] w-[2.31vw]'}
              stroke={`${selectedTheme?.['textOpacity/50']}`}
            />
          </span>
          <span
            className=" text-[1.10vw] font-bold "
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            Events
          </span>
        </div>
        <div className="flex w-[20%] items-center justify-end">
          <div
            className={`flex w-[5.36vw] items-center justify-center rounded-md
                ${
                  sucessBtn && !failureBtn
                    ? 'bg-[#4CAF50]'
                    : !sucessBtn && failureBtn
                      ? 'bg-[#F14336]'
                      : !sucessBtn && !failureBtn
                        ? 'bg-[#0736c4]'
                        : ''
                } p-1 text-[0.83vw] `}
          >
            <AnimatedButton
              onClick={handleSave}
              label={'Save'}
              sucessBtn={sucessBtn}
              failureBtn={failureBtn}
              setSucessBtn={setSucessBtn}
              setFailureBtn={setFailureBtn}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[92%] w-full items-center justify-between">
        <div
          className="h-full w-[12%] border-r"
          style={{
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          <EventNodeGallery selectedControlEvents={eventsNodeGalleryData} />
        </div>
        <div
          className="h-full w-[70%]"
          style={{
            backgroundColor: `${selectedTheme?.bgCard}`,
          }}
        >
          <EventDashBoard
            onNodeContextMenu={onNodeContextMenu}
            nodes={nodes}
            edges={edges}
            setEdges={setEdges}
            setNodes={setNodes}
            onPaneClick={onPaneClick}
            ref={ref}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          >
            <Background
              gap={12}
              variant={BackgroundVariant.Lines}
              // className="bg-[#f0f0f0]"
              // color='#f6d000'
            />
            {menu && (
              <ContextMenuEvents
                onEdit={(id) => {
                  setSelectedNode(getNode(id));
                  setShowNodeProperty(true);
                  // node = getNode(id);
                }}
                eventsNodeType={eventsNodeType}
                eventHandlerType={eventHandlerType}
                setContextProps={setContextProps}
                setEventsNodeType={setEventsNodeType}
                setEventHandlerType={setEventHandlerType}
                setShowNodeProperty={setShowNodeProperty}
                selectedResponseData={selectedResponseData}
                setSelectedResponseData={setSelectedResponseData}
                setHandlerNodeVal={setHandlerNodeVal}
                DropdownData={DropdownData}
                setDropdownData={setDropdownData}
                clickedGroup={clickedGroup}
                setClickedGroup={setClickedGroup}
                eventJson={eventJson}
                setRiseListenSidebar={setRiseListenSidebar}
                setRiseListenSidebarForShow={setRiseListenSidebarForShow}
                onClose={onPaneClick}
                setnodeid={setnodeid}
                setSelectedHandlerData={setSelectedHandlerData}
                {...menu}
              />
            )}
          </EventDashBoard>
        </div>
        <div
          className="h-full w-[18%] overflow-hidden  border-l"
          style={{
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          {showNodeProperty ? (
            <EventsNodeProperties
              setSelectedResponseData={setSelectedResponseData}
              selectedResponseData={selectedResponseData}
              changeProperty={changeProperty}
              contextProps={contextProps}
              handlerNodeVal={handlerNodeVal}
              setHandlerNodeVal={setHandlerNodeVal}
              selectedHandlerData={selectedHandlerData}
              setSelectedHandlerData={setSelectedHandlerData}
              sideBarData={selectedNode}
              setMenu={setMenu}
              currentDrawing={currentDrawing}
              client={client}
              eventsNodeType={eventsNodeType}
              updatedNodeConfig={updatedNodeConfig}
              eventJson={eventJson}
              DropdownData={DropdownData}
              clickedGroup={clickedGroup}
              setClickedGroup={setClickedGroup}
              handleSelectedListener={handleSelectedListener}
              setRiseListenSidebar={setRiseListenSidebar}
              setRiseListenSidebarForShow={setRiseListenSidebarForShow}
              riseListenSidebar={riseListenSidebar}
              riseListenSidebarForShow={riseListenSidebarForShow}
              actionName={actionName}
              eventPropertyDropdownData={eventPropertyDropdownData}
              selectedTheme={selectedTheme}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-[0.72vw] italic"
              style={{
                color: `${selectedTheme?.text}80`,
              }}
            >
              no node selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventsMainPO({
  mapppedType,
  actionName,
  setNavigateTo,
  initial,
  currentDrawing,
}) {
  const [selectedProcess, setSelectedProcess] = useState(mapppedType[0].key);

  const [sucessBtn, setSucessBtn] = useState(false);

  const [failureBtn, setFailureBtn] = useState(false);
  const [selectedActionName, setSelectedActionName] = useState([]);
  const [selectedAction, setSelectedAction] = useState();
  const [activeArtifact, setActiveArtifact] = useState('');
  const accordionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScrollSync = (sourceRef, targetRef) => {
      if (sourceRef.current && targetRef.current) {
        sourceRef.current.addEventListener('scroll', () => {
          targetRef.current.scrollTop = sourceRef.current.scrollTop;
        });

        targetRef.current.addEventListener('scroll', () => {
          sourceRef.current.scrollTop = targetRef.current.scrollTop;
        });
      }
    };

    handleScrollSync(accordionRef, contentRef);

    return () => {
      if (accordionRef.current && contentRef.current) {
        accordionRef.current.removeEventListener('scroll', () => {});
        contentRef.current.removeEventListener('scroll', () => {});
      }
    };
  }, []);

  const [mappedThing, setMappedThing] = useState([
    'success',
    'failure',
    'suspicious',
  ]);

  const {
    subFlow,
    tenant,
    items,
    selectedLogic,
    mappedData,
    setMappedData,
    securityData,
    setSecurityData,
    setShowLogic,
    children,
  } = useContext(LogicCenterContext);

  const { selectedTheme } = useContext(TorusModellerContext);

  const [eventsData, setEventsData] = useState(
    initial ?? {
      sourceQueue: '',
      sourceStatus: '',
      pre: {
        success: {
          targetQueue: '',
          targetStatus: '',
        },
        failure: {
          targetQueue: '',
          targetStatus: '',
        },
        suspicious: {
          targetQueue: '',
          targetStatus: '',
        },
      },
      pro: {
        success: {
          targetQueue: '',
          targetStatus: '',
        },
        failure: {
          targetQueue: '',
          targetStatus: '',
        },
        suspicious: {
          targetQueue: '',
          targetStatus: '',
        },
      },
      pst: {
        success: {
          targetQueue: '',
          targetStatus: '',
        },
        failure: {
          targetQueue: '',
          targetStatus: '',
        },
        suspicious: {
          targetQueue: '',
          targetStatus: '',
        },
      },
    },
  );
  console.log(
    currentDrawing,
    actionName,
    initial,
    mapppedType,
    'Drawings----->>>',
  );

  const handleTargetClick = (target, type) => {
    console.log(target, type, '<---target-->');
    setSelectedAction(type);
    setSelectedActionName(target);
  };

  console.log(mappedData, 'mappedData--->>>>');

  const handleSave = async (data) => {
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      console.log('data 88', actionName);
      let searchKey = [];
      let searchValue = actionName;
      if (actionName && actionName.length === 3) {
        searchKey = ['name', 'nodeName', 'elementName'];
      }

      if (actionName && actionName.length === 2) {
        searchKey = ['name', 'nodeName'];
      }

      if (actionName && actionName.length === 1) {
        searchKey = ['name'];
      }
      console.log('data 99', searchKey, searchValue, data);
      setMappedData((prev) => {
        let result = handlNestedObj(
          'set',
          data,
          'events',
          searchKey,
          searchValue,
          prev,
        );
        console.log('data 111', result);
        return result;
      });
    }
  };

  // useEffect(() => {
  // console.log(eventsData, 'Events----->>>>>>');
  // console.log(eventsData[selectedProcess].sucess, 'Events----->>>>>>');
  // }, [eventsData]);

  return (
    <div className="h-full w-full flex-col ">
      <div
        className="flex h-[8%] w-[100%]  items-center justify-between border-b-1 pb-[0.5vw] pl-0 pr-[0.5vw] pt-[0.5vw]"
        style={{
          borderColor: `${selectedTheme?.border}`,
          color: `${selectedTheme?.text}`,
        }}
      >
        <div className="flex w-[60%] cursor-pointer items-center text-[1.10vw] font-medium leading-[1.85vh] text-[#0736c4] dark:text-white">
          <span className="cursor-pointer" onClick={() => setNavigateTo('')}>
            <NavbarBackward
              className={'h-[1.25vw] w-[2.31vw]'}
              stroke={`${selectedTheme?.['textOpacity/50']}`}
            />
          </span>
          <span
            className="dark:text-whites text-[1.10vw] font-bold "
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            Events
          </span>
        </div>
        <div className="flex w-[40%] items-center justify-end">
          <div className="flex w-[100%] justify-end">
            <div className="flex w-[75%] justify-end">
              <TorusTab
                defaultSelectedKey={selectedProcess}
                key="TorusTab"
                tabsbgcolor={selectedTheme?.bgCard}
                orientation="horizontal"
                onSelectionChange={(e) => setSelectedProcess(e)}
                classNames={{
                  tabs: ` bg-[${selectedTheme?.bgCard}] cursor-pointer h-[4.98vh] w-[100%] rounded-lg`,
                  tabList:
                    'w-full h-[100%]  flex justify-center items-center rounded-sm',
                  tab: `rounded-sm h-full w-full flex justify-center items-center 
					torus-pressed:outline-none torus-focus:outline-none torus-pressed:ring-0 torus-focus:ring-0 border-2 border-transparent text-center text-xs font-semibold tracking-[0.45px]`,
                }}
                tabs={mapppedType?.map((item) => ({
                  id: item.key,
                  content: ({ isSelected }) => (
                    <div
                      className={` flex h-[100%] w-[100%] items-center justify-center rounded-sm py-[0.55vh] text-[0.72vw] font-[500] torus-focus:outline-none torus-focus:ring-0 torus-pressed:ring-0`}
                      style={{
                        backgroundColor: `${isSelected ? selectedTheme?.bg : ''}`,
                        color: `${isSelected ? selectedTheme?.text : '#A59E92'}`,
                      }}
                    >
                      {item.label}
                    </div>
                  ),
                }))}
              />
            </div>

            {/* <div
				className={`flex w-[20%] items-center justify-center rounded-md
					${
						sucessBtn && !failureBtn
							? 'bg-[#4CAF50]'
							: !sucessBtn && failureBtn
								? 'bg-[#F14336]'
								: !sucessBtn && !failureBtn
									? 'bg-[#F4F5FA]'
									: ''
					} p-1 text-[0.83vw] `}
			>
				<AnimatedButton
					label={'Save'}
					sucessBtn={sucessBtn}
					failureBtn={failureBtn}
					setSucessBtn={setSucessBtn}
					setFailureBtn={setFailureBtn}
					onClick={() => handleSave(eventsData)}
				/>
			</div> */}
          </div>
        </div>
      </div>
      <div className="flex h-[5%]  items-center">
        <div className="flex h-[100%] w-[15%] items-center justify-start pl-[0.85vw] ">
          <div className="flex items-center justify-start">
            <span
              className="w-[100%] text-start text-[0.72vw] font-bold  "
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              Target
            </span>
          </div>
        </div>
        <div className="ml-[-2.95vw] grid h-[100%] w-[85%] grid-cols-12">
          <div
            className="col-span-4 grid w-[100%] text-start text-[0.72vw] font-bold "
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {' '}
            <span> </span>{' '}
          </div>
          <div
            className="col-span-2 grid w-[100%] items-center justify-start pl-[0.85vw]  text-start text-[0.72vw] font-bold"
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {' '}
            <span> Queue </span>{' '}
          </div>
          <div
            className="col-span-2 grid w-[100%] items-center justify-start pl-[0.85vw]  text-start text-[0.72vw] font-bold"
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {' '}
            <span> Status </span>{' '}
          </div>
        </div>
      </div>

      <div className="  flex h-[91%] w-[100%] rounded-bl-md rounded-br-md dark:bg-[#161616]">
        <div
          className=" h-[90%]  w-[100%] overflow-y-scroll  pb-3 pt-[1.95vh]"
          ref={accordionRef}
        >
          <div className="flex flex-col justify-between gap-[1.25vh] pl-[0.25vw]">
            <EventsTargetAccordian
              data={items}
              selectedLogic={selectedLogic}
              activeArtifact={activeArtifact}
              setActiveArtifact={setActiveArtifact}
              handleTargetClick={handleTargetClick}
              selectedActionName={selectedActionName}
              eventsData={eventsData}
              setEventsData={setEventsData}
              mappedThing={mappedThing}
              selectedProcess={selectedProcess}
              contentRef={contentRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const EventNodeGallery = ({ selectedControlEvents }) => {
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  const onDragStart = (event, eventName, parentNode) => {
    console.log(parentNode, eventName, 'parentNodeaweqwe');
    event.dataTransfer.setData(
      'application/parentNode',
      JSON.stringify(parentNode),
    );
    event.dataTransfer.setData('application/eventName', eventName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      {selectedControlEvents && (
        <div className="h-full w-full">
          <div
            className="felx-col flex w-[100%] justify-between border-b py-[0.45vw] pl-[0.85vw]  pr-[0.55vw]"
            style={{
              borderColor: `${selectedTheme?.border}`,
            }}
          >
            <div className="flex w-[70%] items-center justify-start">
              <Header
                className={` text-[0.83vw] font-semibold leading-[16px] tracking-normal transition-opacity duration-1000 ease-in-out`}
                style={{
                  color: `${selectedTheme?.text}`,
                }}
              >
                Node Gallery
              </Header>
            </div>
          </div>
          <div className="flex h-[5%] w-full flex-row items-center justify-between p-2 pl-[0.85vw]">
            <div
              className={`text-[0.72vw] font-medium `}
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              {selectedControlEvents?.nodeName ||
                selectedControlEvents?.nodeType}
            </div>
          </div>
          {console.log(selectedControlEvents, 'dropevnts')}
          {selectedControlEvents?.events &&
          selectedControlEvents?.events.length > 0 ? (
            selectedControlEvents?.events
              .filter((it) => it.enabled === 'true')
              .map((item) => {
                return (
                  <div
                    className="flex w-full cursor-grab items-center gap-1 rounded py-[0.25rem] pl-[0.85vw] pr-[0.50rem]  hover:bg-[#F4F5FA] dark:text-white dark:hover:bg-[#0F0F0F]"
                    onDragStart={(event) =>
                      onDragStart(event, item.name, selectedControlEvents)
                    }
                    draggable
                  >
                    <div
                      className={` flex h-[93.75%] w-[100%] flex-col justify-between transition-opacity duration-700 ease-in-out`}
                    >
                      <div className="item-start flex  h-[100%] w-[100%] justify-start gap-2 ">
                        <span className=" flex h-[1.25vw] w-[1.25vw] items-center justify-center rounded bg-[#0736C4]/15 ">
                          <MdOutlineEmojiEvents color="#0736C4" size={12} />
                        </span>

                        <div className=" cursor-grab text-[0.72vw] font-normal leading-[2.22vh] tracking-normal">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className=" m-1 flex  h-[88%] w-[100%]  items-center justify-center ">
              <span className=" w-[100%] text-[0.72vw] font-normal italic leading-[2.22vh] text-red-400/55">
                No events available for the selected node
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const EventsNodeProperties = ({
  selectedResponseData,
  sideBarData,
  contextProps,
  handlerNodeVal,
  setHandlerNodeVal,
  changeProperty,
  setSelectedResponseData,
  currentDrawing,
  client,
  eventsNodeType,
  updatedNodeConfig,
  eventJson,
  clickedGroup,
  setClickedGroup,
  DropdownData,
  setDropdownData,
  handleSelectedListener,
  setRiseListenSidebar,
  setRiseListenSidebarForShow,
  riseListenSidebar,
  riseListenSidebarForShow,
  actionName,
  setMenu,
  eventPropertyDropdownData,
  selectedTheme,
  selectedHandlerData,
  setSelectedHandlerData,
}) => {
  console.log(
    'eventsNodeType1',
    contextProps,
    eventsNodeType,
    riseListenSidebarForShow,
    riseListenSidebar,
  );
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [rendervalue, setRendervalue] = useState(null);
  const [currentModel, setCurrentModel] = useState(null);

  const [activeTab, setActiveTab] = useState('property');
  const [tabData, setTabData] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [json, setJson] = useState({});
  const [files, setFiles] = useState(null);
  const [selectedArtifactListener, setSelectedArtifactListener] =
    useState(null);
  const [showComponentControls, setShowComponentControls] = useState(false);
  const [toggleopen, setToggleopen] = useState(false);
  const [handlerDropdownList, setHandlerDropdownList] = useState(
    eventPropertyDropdownData,
  );
  const [sideBarDataPrevID, setSideBarDataPrevID] = useState('');

  useEffect(() => {
    if (sideBarData.id !== sideBarDataPrevID) {
      setJson({});
      setSideBarDataPrevID(sideBarData.id);
    }
  }, [sideBarData.id]);
  const convertData = (data) => {
    return data.map((item, index) => ({
      label: item.label,
      icon: item.icon,
      id: `${item.label}-${index}`,
    }));
  };

  useEffect(() => {
    try {
      if (files) {
        setJson((prev) => ({
          ...prev,
          [rendervalue]: JSON.parse(files),
        }));
        setToggle(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [files]);

  console.log(json, currentDrawing, activeTab, rendervalue, eventJson, 'files');

  useEffect(() => {
    setTabData(convertData(nodeInfoTabs[currentDrawing]));
  }, [nodeInfoTabs]);

  useEffect(() => {
    try {
      const handleOutsideClick = () => {
        setContextMenuVisible(false);
      };

      if (contextMenuVisible) {
        document.addEventListener('click', handleOutsideClick);
      } else {
        document.removeEventListener('click', handleOutsideClick);
      }

      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    } catch (error) {
      console.error(error);
    }
  }, [contextMenuVisible, setContextMenuVisible]);
  const handleContextMenu = (e, value) => {
    try {
      console.log(e, value, 'contextMenuebets');
      setCurrentModel(value);
      e.preventDefault();

      setRendervalue(value);

      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setContextMenuVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getHandlerJson = async (key, sideBarData) => {
    try {
      console.log(sideBarData, key, 'getHandlerJson');

      if (
        sideBarData &&
        sideBarData?.data?.nodeProperty &&
        sideBarData?.data?.nodeProperty.hasOwnProperty('hlr') &&
        sideBarData?.data?.nodeProperty.hlr &&
        Object.keys(sideBarData.data.nodeProperty.hlr).length > 0
      )
        return;

      const response = await AxiosService.get(`api/getHandlers`, {
        params: {
          type: 'Client',
          artifact: key,
          version: 'v1',
        },
      });
      if (response.status == 200) {
        setJson((prev) => ({
          ...prev,
          hlr: response.data,
        }));

        updatedNodeConfig(
          sideBarData?.id,
          {
            nodeId: sideBarData?.id,
            nodeName: sideBarData?.data?.label,
            nodeType: sideBarData?.type,
          },
          {
            hlr: response.data,
          },
        );

        console.log(response, sideBarData, 'getHandlerJsonupdated');

        // setSelectedHandlerData(null);
      } else {
        setJson((prev) => ({
          ...prev,
          hlr: {},
        }));
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      sideBarData &&
      sideBarData?.label &&
      sideBarData?.label.length > 0 &&
      (sideBarData?.type === 'handlerNode' || sideBarData?.type === 'screen')
    ) {
      getHandlerJson(sideBarData?.label, sideBarData);
    }
  }, [sideBarData?.label]);
  console.log(json, sideBarData, 'main');
  const handleRenders = (value) => {
    console.log(value, 'tabvalue');

    switch (value) {
      case 'property':
        return (
          <div className="h-[65vh] overflow-y-scroll">
            <div className="w-[100%] pt-[1vh]">
              <div
                className="flex w-[100%] flex-col rounded-md px-[0.55vw] py-[0.85vh]"
                style={{
                  backgroundColor: `${selectedTheme?.bgCard}`,
                }}
              >
                <h1
                  className={`${'mb-2  text-[0.62vw]  font-bold '} cursor-pointer `}
                  style={{
                    color: `${selectedTheme?.text}80`,
                  }}
                >
                  Node Id :
                </h1>

                {sideBarData?.id ? (
                  <span
                    className=""
                    style={{
                      display: 'block',
                      width: '98%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.83vw',
                      fontWeight: 500,
                      lineHeight: '2.22vh',
                      color: `${selectedTheme?.text}`,
                    }}
                  >
                    {sideBarData?.id}
                  </span>
                ) : (
                  <span
                    className=""
                    style={{
                      display: 'block',
                      width: '98%',
                      whiteSpace: 'nowrap',
                      fontSize: '0.83vw',
                      fontWeight: 500,
                      lineHeight: '2.22vh',
                      color: `${selectedTheme?.text}`,
                    }}
                  >
                    There is no data on this field.
                  </span>
                )}
              </div>
            </div>

            {/* Node type */}
            <div className="w-[100%] pt-[1vh]">
              {(sideBarData?.type === 'handlerNode' ||
                sideBarData?.type === 'eventNode') && (
                <div
                  className="mb-2 flex w-[100%] flex-col rounded-md px-[0.55vw] py-[0.85vh]"
                  style={{
                    backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                  }}
                >
                  <h1
                    className={`${'mb-2  text-[0.62vw]  font-bold '} cursor-pointer `}
                    style={{
                      color: `${selectedTheme?.text}80`,
                    }}
                  >
                    Node Name :
                  </h1>
                  {sideBarData &&
                    Object.entries(sideBarData) &&
                    Object.entries(sideBarData).length > 0 &&
                    Object.entries(sideBarData)?.map(([key, value]) => (
                      <>
                        {key === 'data' &&
                          sideBarData?.data?.hasOwnProperty('label') && (
                            <span
                              className=""
                              style={{
                                display: 'block',
                                width: '98%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: '0.83vw',
                                fontWeight: 500,
                                lineHeight: '2.22vh',
                                color: `${selectedTheme?.text}`,
                              }}
                            >
                              {sideBarData?.data?.label
                                ? sideBarData?.data?.label
                                : 'No Data'}
                            </span>
                          )}
                      </>
                    ))}
                </div>
              )}
              <div
                className="flex w-[100%] flex-col rounded-md px-[0.55vw] py-[0.85vh]"
                style={{
                  backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                }}
              >
                <h1
                  className={`${'mb-2  text-[0.62vw]  font-bold '} cursor-pointer `}
                  style={{
                    color: `${selectedTheme?.text}80`,
                  }}
                >
                  Node type :
                </h1>
                {sideBarData &&
                  Object.entries(sideBarData) &&
                  Object.entries(sideBarData).length > 0 &&
                  Object.entries(sideBarData)?.map(([key, value]) => (
                    <>
                      {key === 'type' && (
                        <span
                          className=""
                          style={{
                            display: 'block',
                            width: '98%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '0.83vw',
                            fontWeight: 500,
                            lineHeight: '2.22vh',
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          {value && value.length > 0 ? value : 'No Data'}
                        </span>
                      )}
                    </>
                  ))}
              </div>
            </div>

            {/* Node sequence */}
            <div className="w-[100%] pt-[1vh]">
              <div
                className="flex w-[100%] flex-col rounded-md  px-[0.55vw] py-[0.85vh]"
                style={{
                  backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                }}
              >
                <h1
                  className={`${'mb-2  text-[0.62vw]  font-bold '} cursor-pointer `}
                  style={{
                    color: `${selectedTheme?.text}80`,
                  }}
                >
                  Node sequence :
                </h1>

                {sideBarData &&
                  Object.entries(sideBarData) &&
                  Object.entries(sideBarData).length > 0 &&
                  Object.entries(sideBarData)?.map(([key, value]) => (
                    <>
                      {key === 'data' &&
                        Object.entries(value)?.map(([key, value]) => (
                          <>
                            {key === 'sequence' && (
                              <span
                                className=""
                                style={{
                                  display: 'block',
                                  width: '98%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontSize: '0.83vw',
                                  fontWeight: 500,
                                  lineHeight: '2.22vh',
                                  color: `${selectedTheme?.text}`,
                                }}
                              >
                                {value ? value : 'No Data'}
                              </span>
                            )}
                          </>
                        ))}
                    </>
                  ))}
              </div>
            </div>

            <div className="w-[100%] pt-[1vh]">
              {(contextProps.node?.type === 'handlerNode' ||
                contextProps.node?.type === 'eventNode') && (
                <div className="mb-2 flex w-[100%] items-center justify-center ">
                  <div
                    className="w-full rounded-md  px-[0.25vw] py-[0.55vh]"
                    style={{
                      backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                    }}
                  >
                    <div className="flex w-full items-center justify-start">
                      <label
                        className="pl-[0.25vw] text-[0.62vw] font-medium "
                        style={{
                          color: `${selectedTheme?.text}80`,
                        }}
                      >
                        type
                      </label>
                    </div>

                    {/* <ReusableDropDown
						darkMode={false}
						key={contextProps.node.id + contextProps.node.type}
						title={
							(selectedResponseData && selectedResponseData) ||
							'select response type'
						}
						selectedKey={new Set([selectedResponseData])}
						handleSelectedKey={(keys) => {
							setSelectedResponseData(Array.from(keys)[0]);
						}}
						items={
							contextProps.responsedata &&
							contextProps.responsedata.length > 0 &&
							contextProps.responsedata.map((data, index) => {
								return {
									key: data,

									label: data,
								};
							})
						}
						textAlign={'text-start'}
					/> */}
                    <TorusDropDown
                      // onPress={() => {
                      // setInputchange(false);
                      // }}
                      title={
                        <div className="flex w-[100%] items-center justify-between ">
                          <div
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            {(selectedResponseData && selectedResponseData) ||
                              'select response type'}
                          </div>
                          <div>
                            <IoIosArrowDown
                              className="text-[#667085] dark:text-white"
                              size={'0.83vw'}
                            />
                          </div>
                        </div>
                      }
                      listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                      btncolor={`${selectedTheme?.bgCard}`}
                      listItemColor={`${selectedTheme && selectedTheme?.text}`}
                      selectionMode="single"
                      selected={new Set([selectedResponseData])}
                      setSelected={(keys) => {
                        setSelectedResponseData(Array.from(keys)[0]);
                      }}
                      items={
                        contextProps.responsedata &&
                        contextProps.responsedata.length > 0 &&
                        contextProps.responsedata.map((data, index) => {
                          return {
                            key: data,

                            label: data,
                          };
                        })
                      }
                      classNames={{
                        buttonClassName:
                          '  px-2 rounded-sm  h-[4.5vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#FFFFFF] dark:bg-[#0F0F0F] text-start dark:text-white',
                        popoverClassName:
                          'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                        listBoxClassName:
                          'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                        listBoxItemClassName:
                          'flex w-[100%] items-center  justify-center text-md',
                      }}
                    />
                  </div>

                  <hr />
                </div>
              )}
              {contextProps.node?.type !== 'groupNode' &&
                contextProps.node?.type !== 'controlNode' && (
                  <>
                    <div className="flex w-[100%] items-center justify-center">
                      <div
                        className="w-full rounded-md  px-[0.25vw] py-[0.55vh]"
                        style={{
                          backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                        }}
                      >
                        <div className="flex w-full items-center justify-start">
                          <label
                            className="pl-[0.25vw] text-[0.62vw] font-medium "
                            style={{
                              color: `${selectedTheme?.text}80`,
                            }}
                          >
                            Next Handler
                          </label>
                        </div>
                        <TorusDropDown
                          // onPress={() => {
                          // setInputchange(false);
                          // }}
                          title={
                            <div className="flex w-[100%] items-center justify-between ">
                              <div
                                style={{
                                  color: `${selectedTheme?.text}`,
                                }}
                              >
                                {selectedHandlerData ?? 'Please Select Handler'}
                              </div>
                              <div>
                                <IoIosArrowDown
                                  className="text-[#667085] dark:text-white"
                                  size={'0.83vw'}
                                />
                              </div>
                            </div>
                          }
                          listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                          btncolor={`${selectedTheme?.bgCard}`}
                          listItemColor={`${selectedTheme && selectedTheme?.text}`}
                          selectionMode="single"
                          selected={new Set([selectedHandlerData])}
                          setSelected={(keys) => {
                            setSelectedHandlerData(Array.from(keys)[0]);
                            // changeProperty({
                            // [key]: Array.from(keys)[0],
                            // });
                            // getHandlerJson(Array.from(keys)[0]);
                          }}
                          items={
                            handlerDropdownList &&
                            handlerDropdownList.length > 0 &&
                            handlerDropdownList
                          }
                          classNames={{
                            buttonClassName:
                              '  px-2 rounded-sm  h-[4.5vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#FFFFFF] dark:bg-[#0F0F0F] text-start dark:text-white',
                            popoverClassName:
                              'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                            listBoxClassName:
                              'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                            listBoxItemClassName:
                              'flex w-[100%] items-center  justify-center text-md',
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

              {contextProps.node?.type !== 'groupNode' &&
                contextProps.node?.type !== 'controlNode' && (
                  <div className="mt-2 w-full pb-2 ">
                    <div
                      className="w-full rounded-md px-[0.25vw] py-[0.55vh]"
                      style={{
                        backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                      }}
                    >
                      <div className="flex w-full items-center justify-start">
                        <label
                          className="pl-[0.25vw] text-[0.62vw] font-medium"
                          style={{
                            color: `${selectedTheme?.text}80`,
                          }}
                        >
                          Event Trigger
                        </label>
                      </div>
                      <TorusRadio
                        isDisabled={selectedHandlerData === null ? true : false}
                        value={handlerNodeVal ? handlerNodeVal : ''}
                        content={[
                          {
                            values: 'rise',
                          },
                          {
                            values: 'riseListen',
                          },
                          {
                            values: 'self',
                          },
                        ]}
                        valueColor={`${selectedTheme?.text}`}
                        onChange={(value) => {
                          setHandlerNodeVal(value);
                          contextProps.risenode(
                            value,
                            contextProps.node.type,
                            selectedResponseData ? selectedResponseData : '',
                            selectedHandlerData,
                            eventPropertyDropdownData.find(
                              (item) => item.key === selectedHandlerData,
                            ),
                          );
                          setMenu(null);
                          value !== 'riseListen' &&
                            setSelectedHandlerData(null);
                        }}
                        orientation="horizontal"
                        radioGrpClassName="flex w-[100%] items-center justify-between gap-[0.55vw] p-[0.85vw]"
                      />
                    </div>
                  </div>
                )}

              {sideBarData &&
                Object.entries(sideBarData) &&
                Object.entries(sideBarData).length > 0 &&
                Object.entries(sideBarData)?.map(([key, value]) => (
                  <React.Fragment>
                    {key === 'data' && (
                      <>
                        {sideBarData.type === 'handlerNode' && (
                          <div className="mt-2 w-full pb-2 ">
                            <div
                              className="flex w-[100%]  flex-col rounded-md"
                              style={{
                                backgroundColor: `${selectedTheme && selectedTheme?.bgCard}`,
                              }}
                            >
                              {console.log(value, 'label--->>')}

                              <TorusModularTextArea
                                variant="bordered"
                                labelColor={`${selectedTheme && `${selectedTheme?.text}80`}`}
                                borderColor="dark:border dark:border-[#212121]"
                                outlineColor="outline-blue-500"
                                placeholder="Enter here"
                                value={value?.['value'] ?? ''}
                                textSize={
                                  'text-[0.72vw] font-medium placeholder:text-[0.82vw]'
                                }
                                isDisabled={
                                  sideBarData.type === 'handlerNode'
                                    ? false
                                    : true
                                }
                                onChange={(e) =>
                                  changeProperty({
                                    value: e,
                                  })
                                }
                                labelSize="pl-[0.25vw] text-[0.62vw]"
                                label="value"
                                radius="md"
                                width="xl"
                                height="xl"
                                size="h-[7.5vh]"
                                textColor={`${selectedTheme && selectedTheme?.text}`}
                                backgroundColor="bg-[#FFFFFF] dark:bg-[#0F0F0F]"
                                isClearable={false}
                                labelPlacement={'top'}
                                autoSize={false}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        );

      case 'hlr':
        return (
          <div className="w-full">
            <RenderJson
              renderFor={'events'}
              json={json[activeTab] ?? json.hlr}
              setJson={setJson}
              nodedata={sideBarData}
              cm={activeTab}
              updatedNodeConfig={updatedNodeConfig}
            />
          </div>
        );
    }
  };
  const handleTabChange = (tab, label) => {
    console.log(tab, label, 'tab--->>');
    setActiveTab(tab);

    setJson((prev) => {
      return {
        ...prev,
        [tab]: sideBarData?.data?.nodeProperty?.[tab] ?? json.hlr ?? {},
      };
    });
  };

  return (
    <>
      {!riseListenSidebar && !riseListenSidebarForShow && (
        <div className=" flex w-[100%] flex-col items-start justify-start px-[0.25vw]">
          <p
            className="p-2 text-[0.72vw] font-medium"
            style={{
              color: `${selectedTheme && selectedTheme?.text}`,
            }}
          >
            {sideBarData?.type} - {sideBarData?.data?.sequence} Properties
          </p>

          <div
            className="  mt-[0.5vh] w-[100%] rounded-sm  px-[0.43vw] py-[1vh] pb-[1.85vh]  "
            style={{
              backgroundColor: `${selectedTheme && selectedTheme?.bg}`,
            }}
          >
            <p
              className="text-[0.72vw] font-[400] "
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              Node Properties
            </p>

            <TorusTab
              tabsbgcolor={selectedTheme?.bgCard}
              aria-label="Options"
              variant="solid"
              classNames={{
                tabList:
                  'items-center justify-between  h-[4vh] max-w-[18.68vw] overflow-x-scroll  dark:bg-[#0F0F0F] gap-0 border-none outline-none rounded flex items-center justify-center',
                cursor:
                  'border-none  rounded torus-focus:outline-none outline-none torus-focus-within:outline-none',
              }}
              selectedKey={activeTab}
              orientation="horizontal"
              onSelectionChange={(data) => {
                handleTabChange(
                  data,
                  sideBarData.label ?? sideBarData.data.label,
                );
              }}
              tabs={[
                {
                  id: 'property',
                  content: (
                    <span
                      className={`flex h-[0.83vw] w-[0.83vw] cursor-pointer items-center justify-center `}
                    >
                      <PropertyIcon
                        className={`h-[0.83vw] w-[0.83vw] ${activeTab === 'property' ? 'stroke-[#00bfff]' : 'stroke-0.5 stroke-[#353636]'}`}
                      />
                    </span>
                  ),
                },
                eventsNodeType === 'handlerNode' && {
                  id: 'hlr',
                  content: (
                    <span
                      className={`flex h-[0.83vw] w-[0.83vw] cursor-pointer items-center justify-center `}
                      onContextMenu={(e) => handleContextMenu(e, 'hlr')}
                    >
                      <PropertyIcon
                        className={`h-[0.83vw] w-[0.83vw] ${activeTab === 'hlr' ? 'stroke-[#00bfff]' : 'stroke-0.5 stroke-[#353636]'}`}
                      />

                      <div
                        className="App"
                        id="sideBar-contextMenu"
                        style={{
                          display:
                            contextMenuVisible && rendervalue === 'hlr'
                              ? 'block'
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            zIndex: 9999,
                            backgroundColor: 'rgb(109 96 96 / 13%)',
                            width: '1.5vw',
                            height: '1.5vw',
                            display:
                              contextMenuVisible && rendervalue === 'hlr'
                                ? 'flex'
                                : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '0.25rem',
                            right: '100px',
                            top: '120px',
                            // left: '99px',
                            position: 'absolute',
                          }}
                          className="ring-2 ring-[#00BFFF] ring-offset-2 "
                        >
                          <div className=" px-[0.5vw] py-[0.5vh]">
                            <Upload id={'hlr'} setFiles={setFiles} />
                          </div>
                        </div>
                      </div>
                    </span>
                  ),
                },
              ]}
              panels={[
                {
                  id: 'property',

                  content: handleRenders('property'),
                },
                {
                  id: 'hlr',

                  content: handleRenders('hlr'),
                },
              ]}
            />

            {/* <div className=" flex items-center  gap-10 p-2 ">
			<div
				onClick={() => {
					setActiveTab('property');
				}}
				className="cursor-pointer"
			>
				<TorusToolTip
					tooltipContent={'property'}
					hoverContent={
						<span
							className={
								'flex h-[0.83vw]  w-[0.83vw]  items-center justify-center '
							}
						>
							<PropertyIcon
								className={`stroke-0.5 h-[0.83vw] w-[0.83vw] ${activeTab === 'property' ? 'stroke-[#00bfff]' : 'stroke-0.5 stroke-[#353636]'}`}
							/>
						</span>
					}
					color={'#00BFFF'}
				/>
			</div>

			{eventsNodeType === 'handlerNode' &&
				Object.entries(nodeInfoTabs['events']).map(([key, value]) => {
					return (
						<div
							className="cursor-pointer"
							onClick={() => {
								setActiveTab('renderJson');
							}}
						>
							<TorusToolTip
								tooltipContent={value.label}
								hoverContent={
									<span
										className={' h-[0.83vw]  w-[0.83vw] cursor-pointer  '}
										onContextMenu={(e) =>
											handleContextMenu(e, value.modelOpen)
										}
									>
										{React.createElement(value.icon, {
											className: `h-[1vw] w-[1vw] ${activeTab !== 'property' ? 'stroke-[#00bfff] fill-[#00bfff] ' : 'stroke-0.5 stroke-[#717272]'}`,
										})}
									</span>
								}
								color={'#00BFFF'}
							/>

							<div
								className="App"
								id="sideBar-contextMenu"
								style={{
									display:
										contextMenuVisible && rendervalue === value.modelOpen
											? 'block'
											: 'none',
								}}
							>
								<div
									style={{
										zIndex: 9999,
										backgroundColor: 'rgb(109 96 96 / 13%)',
										width: '1.5vw',
										height: '1.5vw',
										display:
											contextMenuVisible &&
											rendervalue === value.modelOpen
												? 'flex'
												: 'none',
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: '0.25rem',
										right: '100px',
										top: '120px',
										// left: '99px',
										position: 'absolute',
									}}
									className="ring-2 ring-[#00BFFF] ring-offset-2 "
								>
									<div className=" px-[0.5vw] py-[0.5vh]">
										<Upload id={value.label} setFiles={setFiles} />
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div> */}
          </div>
        </div>
      )}
      {riseListenSidebar && !riseListenSidebarForShow && (
        <div className="h-[80%] w-[100%] flex-col items-start">
          <div className="m-2  flex space-x-4 p-2">
            <span
              className="cursor-pointer"
              onClick={() => setRiseListenSidebar(false)}
            >
              <IoIosArrowRoundBack
                color={`${selectedTheme?.text}80`}
                size={20}
              />
            </span>
            <p
              className=" text-[0.72vw] font-bold"
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              Select Event Trigger
            </p>
          </div>
          <div className="h-[100%] w-[100%] px-2">
            {console.log(eventJson, 'pos')}

            <div
              className="curosor-pointer flex items-center space-x-2 rounded-md border  py-[0.85vh]  pl-[0.95vw] pr-[0.25vw]"
              style={{
                backgroundColor: `${selectedTheme?.bg}`,
                color: `${selectedTheme?.text}`,
                borderColor: `${selectedTheme?.border}`,
              }}
            >
              <span
                onClick={() => {
                  setShowComponentControls(!showComponentControls);
                }}
              >
                <NavbarArrowDown
                  stroke={`${selectedTheme?.text}90`}
                  className={` h-[1vw] w-[1vw] transition-all ease-in ${showComponentControls ? ' ' : 'rotate-[-90deg]'}`}
                />
              </span>
              <span
                className={`text-[0.72vw] font-medium`}
                style={{
                  color: `${selectedTheme?.text}80`,
                }}
              >
                {actionName[0]}
              </span>
            </div>

            {showComponentControls &&
              eventJson &&
              DropdownData &&
              DropdownData.length && (
                <>
                  <div
                    className=" w-[100%] pl-2.5   pt-[0.55vw]"
                    style={{
                      color: `${selectedTheme?.text}`,
                      backgroundColor: `${selectedTheme?.bg}`,
                    }}
                  >
                    {eventJson.map((item, index) => {
                      return (
                        Object.keys(item) &&
                        Object.keys(item).length > 0 && (
                          <>
                            <div
                              className="mb-[0.25vw] mt-0  flex w-[99%] items-center  space-x-2 rounded-md border py-[0.85vh]  pl-[0.95vw] pr-[0.25vw]"
                              style={{
                                backgroundColor: `${selectedTheme?.bg}`,
                                color: `${selectedTheme?.text}`,
                                borderColor: `${selectedTheme?.border}`,
                              }}
                            >
                              <span
                                onClick={() => {
                                  setSelectedArtifactListener(item);
                                  setToggleopen(
                                    selectedArtifactListener?.nodeId ===
                                      item.nodeId
                                      ? !toggleopen
                                      : true,
                                  );
                                }}
                              >
                                <NavbarArrowDown
                                  stroke={`${selectedTheme?.text}90`}
                                  className={`h-[1vw] w-[1vw] transition-all ease-in ${toggleopen && selectedArtifactListener?.nodeId === item.nodeId ? ' ' : 'rotate-[-90deg]'}`}
                                />
                              </span>
                              <span
                                onClick={() => {
                                  if (clickedGroup.includes(item.nodeId)) {
                                    setClickedGroup(
                                      clickedGroup.filter(
                                        (group) => group !== item.nodeId,
                                      ),
                                    );
                                  } else {
                                    setClickedGroup([
                                      ...clickedGroup,
                                      item.nodeId,
                                    ]);
                                  }
                                  handleSelectedListener(
                                    item.nodeId,
                                    selectedResponseData,
                                    selectedHandlerData,
                                  );
                                  setRiseListenSidebar(false);
                                  // setClickedJson(item);
                                  // setShowEvents(true);
                                }}
                                className={` mb-1 text-[0.72vw] font-medium ${toggleopen && selectedArtifactListener?.nodeName === item.nodeName ? 'text-black ' : ' text-[#6F6F6F]'} `}
                                style={{
                                  color: `${selectedTheme?.text}80`,
                                }}
                              >
                                {item?.nodeName}
                              </span>
                            </div>
                            {toggleopen &&
                              selectedArtifactListener?.nodeId ===
                                item.nodeId && (
                                <div
                                  className={`top-0 mb-4 ml-[1.5vw] mr-4 mt-0 max-h-[400px] w-[89%] overflow-y-scroll ${item['children'].length > 7 ? ' h-[250px] overflow-y-scroll' : ''} w-[100%] border-l `}
                                  style={{
                                    borderColor: `${selectedTheme?.border}`,
                                  }}
                                >
                                  {Object.keys(item).map((key) => {
                                    return (
                                      <>
                                        {console.log(item, 'pop')}
                                        {key == 'children' &&
                                          item[key] &&
                                          item[key].length > 0 &&
                                          item[key]?.map((key1) => {
                                            return Object.keys(key1).map(
                                              (key2) => {
                                                return (
                                                  <div
                                                    className={` ${key2 === 'nodeName' ? 'cursor-pointer' : ''}`}
                                                  >
                                                    {key2 === 'nodeName' && (
                                                      <div
                                                        onClick={() => {
                                                          handleSelectedListener(
                                                            key1.nodeId,
                                                            selectedResponseData,
                                                            selectedHandlerData,
                                                          );
                                                          setRiseListenSidebar(
                                                            false,
                                                          );
                                                          // onOpenChange(false);
                                                          // setTimeout(() => {
                                                          // onClose(null);
                                                          // }, 1000);
                                                        }}
                                                        className={`mb-2 ml-[0.95vw] mt-[0.25vw] rounded-sm px-2 py-[0.25vw] text-[0.72vw] font-normal text-[#6F6F6F]  hover:bg-[#F5F6Fa] dark:text-[#6F6F6F]`}
                                                        style={{
                                                          backgroundColor: `${selectedTheme?.bgCard}`,
                                                          color: `${selectedTheme?.text}80`,
                                                          borderColor: `${selectedTheme?.border}`,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                          e.target.style.backgroundColor = `${selectedTheme?.text}60`;
                                                          e.target.style.color = `${selectedTheme?.text}90`;
                                                        }}
                                                        onMouseLeave={(e) => {
                                                          e.target.style.backgroundColor = `${selectedTheme?.bgCard}`;
                                                          e.target.style.color = `${selectedTheme?.text}80`;
                                                        }}
                                                      >
                                                        {key1[key2]}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              },
                                            );
                                          })}
                                        <></>
                                      </>
                                    );
                                  })}
                                </div>
                              )}
                          </>
                        )
                      );
                    })}
                  </div>
                </>
              )}
          </div>
        </div>
      )}
      {riseListenSidebarForShow && !riseListenSidebar && (
        <RiseListenDropdown
          currentDrawing={currentDrawing}
          client={client}
          setRiseListenSidebar={setRiseListenSidebar}
          setRiseListenSidebarForShow={setRiseListenSidebarForShow}
          selectedTheme={selectedTheme}
          selectedResponseData={selectedResponseData}
          setSelectedResponseData={setSelectedResponseData}
          contextProps={contextProps?.node}
          selectedHandlerData={selectedHandlerData}
          setSelectedHandlerData={setSelectedHandlerData}
          handleSelectedListener={handleSelectedListener}
        />
      )}
    </>
  );
};

const RiseListenDropdown = ({
  client,
  currentDrawing,
  setRiseListenSidebar,
  setRiseListenSidebarForShow,
  selectedTheme,
  selectedResponseData,
  contextProps,
  selectedHandlerData,
  setSelectedResponseData,
  setSelectedHandlerData,
}) => {
  const [CatalogItems, setCataLogItems] = useState(null);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(null);
  const [artifactGroupItem, setArtifactGroupItem] = useState(null);
  const [selectedArtifactGroupItem, setSelectedArtifactGroupItem] =
    useState(null);
  const [artifactItem, setArtifactItem] = useState(null);
  const [selectedArtifactItem, setselectedArtifactItem] = useState(null);
  const [versionList, setVersionList] = useState(null);
  const [selectedVersionList, setSelectedVersionList] = useState(null);
  const { getNode, getNodes, setEdges, setNodes } = useReactFlow();

  useEffect(() => {
    if (client) {
      handleCatalogWithArtifactGroup(currentDrawing, client)
        .then((data) => {
          setCataLogItems(data?.AF ? data?.AF : data);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const handleCatalogWithArtifactGroup = useCallback(async (fabric, client) => {
    return await getAllCatalogWithArtifactGroup(fabric, client)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
      });
  });

  const handleGetArtifactWithVersion = useCallback(async (cat, ArtGrp) => {
    return await artifactList(
      currentDrawing,
      JSON.stringify([client, 'AF', currentDrawing, cat, ArtGrp]),
      true,
    )
      .then((res) => res?.data)
      .catch((err) => {
        console.error(err);
      });
  });

  const handleSelectedCatalogItems = useCallback((key, CatalogItems) => {
    console.log(Array.from(key)[0], CatalogItems, 'catselected');
    setSelectedCatalogItem(Array.from(key)[0]);
    let artifactGroup =
      CatalogItems &&
      CatalogItems.find((item) => item?.catalog == Array.from(key)[0]);
    console.log(artifactGroup, artifactGroup?.artifactGroupList, 'catArtgrp');
    setArtifactGroupItem(
      artifactGroup?.artifactGroupList
        ? artifactGroup?.artifactGroupList
        : ['no artifactGroup'],
    );
  }, []);

  const handleSelectedArtifactGroupItem = useCallback(
    (key, selectedCatalogItem) => {
      console.log(key, selectedCatalogItem, 'catred');
      setSelectedArtifactGroupItem(Array.from(key)[0]);
      handleGetArtifactWithVersion(
        selectedCatalogItem,
        Array.from(key)[0],
      ).then((data) => {
        setArtifactItem(data);
      });
    },
    [],
  );

  const handleSelectedArtifactItem = useCallback((key, artifactItem) => {
    console.log(Array.from(key)[0], artifactItem, 'catselectedversion');
    setselectedArtifactItem(Array.from(key)[0]);
    let version =
      artifactItem &&
      artifactItem.find((item) => item?.artifact == Array.from(key)[0]);
    console.log(version, version?.versionList, 'catversion');
    setVersionList(
      version?.versionList ? version?.versionList : ['no versionList'],
    );
  }, []);

  const handleShowRiseListen = useCallback(
    (rediskey, selectedResponseData, contextProps, selectedHandlerData) => {
      let parentNode = getNode(contextProps?.id);
      const hasChild =
        parentNode &&
        Array.isArray(parentNode.data.children) &&
        parentNode.data.children.length > 0;
      let maxChildId;
      if (hasChild && parentNode.data.children.length == 1) {
        maxChildId = parentNode.data.children[0];
        const hasChild = maxChildId.split('.');
        const lastChild = hasChild[hasChild.length - 1];
        maxChildId = parseInt(lastChild, 10);
      } else {
        maxChildId = getNodes().reduce((initialId, currentNode) => {
          if (currentNode.id.startsWith(`${parentNode.id}.`)) {
            const hasChild = currentNode.id.split('.');
            const lastChild = hasChild[hasChild.length - 1];
            const childId = parseInt(lastChild, 10);
            return childId;
          }
          return initialId;
        }, 0);
      }
      const newChildId = maxChildId + 1;
      let childId = `${parentNode.id}.${newChildId}`;
      let seq = childId.split('.').splice(1).join('.');

      let handlerEdge;
      let handlerNode;

      if (selectedResponseData) {
        if (selectedResponseData !== 'defaults') {
          let responseNode = {
            id: `${parentNode.id}.${newChildId}`,
            type: 'responseNode',
            position: {
              x: parentNode.position.x + Math.random() * (500 - 300) + 100,
              y: parentNode.position.y + Math.random() * (500 - 300) + 100,
            },

            data: {
              label: selectedResponseData == 'fail' ? 'fail' : 'success',
              responseType: selectedResponseData == 'fail' ? 'fail' : 'success',
              parentId: parentNode.id,
              sequence: `${seq}`,
              children: [],
            },
          };
          const responseEdge = {
            id: `${parentNode.id}->${responseNode.id}`,
            source: parentNode.id,
            type: 'straight',
            target: responseNode.id,
          };

          let handlerNode = {
            id: `${responseNode.id}.1`,
            type: 'handlerNode',
            eventContext: 'rise',
            position: {
              x: responseNode.position.x + Math.random() * (150 - 100) + 100,
              y: responseNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              label: selectedHandlerData ?? 'rise',
              eventContext: 'rise',
              sequence: `${seq}.1`,
              value: '',
              parentId: responseNode.id,
              children: [],
            },
          };

          const handlerEdge = {
            id: `${responseNode.id}->${responseNode.id}.${newChildId}`,
            source: responseNode.id,
            type: 'straight',
            target: handlerNode.id,
          };

          responseNode = {
            ...responseNode,
            data: {
              ...responseNode.data,
              children: [...responseNode.data.children, handlerNode.id],
            },
          };

          parentNode = {
            ...parentNode,
            data: {
              ...parentNode.data,
              children: [...parentNode.data.children, responseNode.id],
            },
          };

          let ids = uuidv4();
          const copyofNode = {
            id: ids + `.${handlerNode.data.sequence}.1`,
            type: 'screen',
            key: rediskey,
            position: {
              x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
              y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              ...parentNode.data,

              label: rediskey.split(':')[11] + '.' + rediskey.split(':')[13],
              parentId: handlerNode.id,
              children: [],
              sequence: `${handlerNode.data.sequence}.1`,
            },
          };

          const edge = {
            id: `${handlerNode.id}->${copyofNode.id}`,
            source: handlerNode.id,
            type: 'straight',
            target: copyofNode.id,
          };
          handlerNode = {
            ...handlerNode,
            data: {
              ...handlerNode.data,
              children: [...handlerNode.data.children, copyofNode.id],
            },
          };

          setNodes((nds) => [
            ...nds.filter((node) => node.id !== parentNode.id),
            responseNode,
            handlerNode,
            copyofNode,
            parentNode,
          ]);
          setEdges((eds) => [...eds, edge, handlerEdge, responseEdge]);
        }

        if (selectedResponseData === 'defaults') {
          let handlerNode = {
            id: `${parentNode.id}.${newChildId}`,
            type: 'handlerNode',
            label: selectedHandlerData ?? 'rise',
            eventContext: 'rise',
            position: {
              x: parentNode.position.x + Math.random() * (150 - 100) + 100,
              y: parentNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              label: selectedHandlerData ?? 'rise',
              eventContext: 'rise',
              value: '',
              sequence: `${seq}`,
              parentId: parentNode.id,
              children: [],
            },
          };

          parentNode = {
            ...parentNode,
            data: {
              ...parentNode.data,
              children: [...parentNode.data.children, handlerNode.id],
            },
          };

          const handlerEdge = {
            id: `${parentNode.id}->${parentNode.id}.${newChildId}`,
            source: parentNode.id,
            type: 'straight',
            target: `${parentNode.id}.${newChildId}`,
          };

          let ids = uuidv4();
          const copyofNode = {
            id: ids + `.${seq}.1`,
            type: 'screen',
            key: rediskey,
            position: {
              x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
              y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
            },
            data: {
              ...parentNode.data,
              label: rediskey.split(':')[11] + '.' + rediskey.split(':')[13],
              parentId: handlerNode.id,
              children: [],
              sequence: `${seq}.1`,
            },
          };

          const edge = {
            id: `${handlerNode.id}->${copyofNode.id}`,
            source: handlerNode.id,
            type: 'straight',
            target: copyofNode.id,
          };
          handlerNode = {
            ...handlerNode,
            data: {
              ...handlerNode.data,
              children: [...handlerNode.data.children, copyofNode.id],
            },
          };

          setNodes((nds) => [
            ...nds.filter((node) => node.id !== parentNode.id),
            handlerNode,
            copyofNode,
            parentNode,
          ]);
          setEdges((eds) => [...eds, edge, handlerEdge]);
        }
        setRiseListenSidebarForShow(false);
        setSelectedHandlerData(null);
        setSelectedResponseData('defaults');
      } else {
        setNodes((nds) => [
          ...nds.filter((n) => n.id !== parentNode.id),
          parentNode,
          handlerNode,
        ]);
        setEdges((eds) => [...eds, handlerEdge]);
        setSelectedHandlerData(null);
        setRiseListenSidebarForShow(false);

        setSelectedResponseData('defaults');
      }

      console.log(parentNode, 'catparent', rediskey, selectedResponseData);
    },
    [],
  );

  const handleSelectedVersionList = useCallback(
    (
      key,
      cat,
      artgrp,
      art,
      selectedResponseData,
      contextProps,
      selectedHandlerData,
    ) => {
      setSelectedVersionList(Array.from(key)[0]);
      let redisKey = `CK:${client}:FNGK:AF:FNK:${currentDrawing}:CATK:${cat}:AFGK:${artgrp}:AFK:${art}:AFVK:${Array.from(key)[0]}`;
      console.log(redisKey, selectedResponseData, contextProps, 'catfinal');

      handleShowRiseListen(
        redisKey,
        selectedResponseData,
        contextProps,
        selectedHandlerData,
      );
    },
    [],
  );

  console.log(CatalogItems, 'cat');

  return (
    <>
      <div className="h-[80%] w-[100%] flex-col items-start">
        <div className="m-2  flex space-x-4 p-2">
          <span
            className="cursor-pointer"
            onClick={() => {
              setRiseListenSidebarForShow(false);
              setRiseListenSidebar(false);
            }}
          >
            <IoIosArrowRoundBack color={`${selectedTheme?.text}80`} size={20} />
          </span>
          <p
            className=" text-[0.72vw] font-bold"
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            Select Event Trigger
          </p>
        </div>
        <div className="h-[100%] w-[100%]">
          <div className="flex h-[40%] w-[100%] flex-col p-2  ">
            <div className=" mb-3 flex gap-4 ">
              <TorusDropDown
                // isDisabled={
                // CatalogItems && CatalogItems.length>0 ? true :false
                // }
                title={
                  <div className="flex w-[100%] items-center justify-between ">
                    <div
                      style={{
                        color: `${selectedTheme?.text}`,
                      }}
                    >
                      {selectedCatalogItem ?? 'select Catalog'}
                    </div>
                    <div>
                      <IoIosArrowDown
                        className="text-[#667085] dark:text-white"
                        size={'0.83vw'}
                      />
                    </div>
                  </div>
                }
                listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                btncolor={`${selectedTheme?.bgCard}`}
                listItemColor={`${selectedTheme && selectedTheme?.text}`}
                selectionMode="single"
                selected={new Set([selectedCatalogItem])}
                setSelected={(keys) => {
                  handleSelectedCatalogItems(keys, CatalogItems);
                }}
                items={
                  CatalogItems &&
                  CatalogItems.length > 0 &&
                  CatalogItems.map((item) => {
                    return {
                      key: item?.catalog,
                      label: item?.catalog,
                    };
                  })
                }
                classNames={{
                  buttonClassName:
                    '  px-2 rounded-sm  h-[4.5vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#FFFFFF] dark:bg-[#0F0F0F] text-start dark:text-white',
                  popoverClassName:
                    'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                  listBoxClassName:
                    'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                  listBoxItemClassName:
                    'flex w-[100%] items-center  justify-center text-md',
                }}
              />

              <TorusDropDown
                isDisabled={
                  artifactGroupItem && artifactGroupItem.length > 0
                    ? false
                    : true
                }
                title={
                  <div className="flex w-[100%] items-center justify-between ">
                    <div
                      style={{
                        color: `${selectedTheme?.text}`,
                      }}
                    >
                      {selectedArtifactGroupItem ?? 'select ArtifactGroup'}
                    </div>
                    <div>
                      <IoIosArrowDown
                        className="text-[#667085] dark:text-white"
                        size={'0.83vw'}
                      />
                    </div>
                  </div>
                }
                listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                btncolor={`${selectedTheme?.bgCard}`}
                listItemColor={`${selectedTheme && selectedTheme?.text}`}
                selectionMode="single"
                selected={new Set([selectedArtifactGroupItem])}
                setSelected={(keys) => {
                  handleSelectedArtifactGroupItem(keys, selectedCatalogItem);
                }}
                items={
                  artifactGroupItem &&
                  artifactGroupItem.length > 0 &&
                  artifactGroupItem.map((item) => {
                    return {
                      key: item,
                      label: item,
                    };
                  })
                }
                classNames={{
                  buttonClassName:
                    '  px-2 rounded-sm  h-[4.5vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#FFFFFF] dark:bg-[#0F0F0F] text-start dark:text-white',
                  popoverClassName:
                    'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                  listBoxClassName:
                    'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                  listBoxItemClassName:
                    'flex w-[100%] items-center  justify-center text-md',
                }}
              />
            </div>

            <div className=" flex gap-4">
              <TorusDropDown
                isDisabled={
                  artifactItem && artifactItem.length > 0 ? false : true
                }
                title={
                  <div className="flex w-[100%] items-center justify-between ">
                    <div
                      style={{
                        color: `${selectedTheme?.text}`,
                      }}
                    >
                      {selectedArtifactItem ?? 'select Artifact'}
                    </div>
                    <div>
                      <IoIosArrowDown
                        className="text-[#667085] dark:text-white"
                        size={'0.83vw'}
                      />
                    </div>
                  </div>
                }
                listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                btncolor={`${selectedTheme?.bgCard}`}
                listItemColor={`${selectedTheme && selectedTheme?.text}`}
                selectionMode="single"
                selected={new Set([selectedArtifactItem])}
                setSelected={(keys) => {
                  handleSelectedArtifactItem(keys, artifactItem);
                }}
                items={
                  artifactItem &&
                  artifactItem.length > 0 &&
                  artifactItem.map((item) => {
                    return {
                      key: item?.artifact,
                      label: item?.artifact,
                    };
                  })
                }
                classNames={{
                  buttonClassName:
                    '  px-2 rounded-sm  h-[4.5vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#FFFFFF] dark:bg-[#0F0F0F] text-start dark:text-white',
                  popoverClassName:
                    'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                  listBoxClassName:
                    'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                  listBoxItemClassName:
                    'flex w-[100%] items-center  justify-center text-md',
                }}
              />
              <TorusDropDown
                isDisabled={
                  versionList && versionList.length > 0 ? false : true
                }
                title={
                  <div className="flex w-[100%] items-center justify-between ">
                    <div
                      style={{
                        color: `${selectedTheme?.text}`,
                      }}
                    >
                      {selectedVersionList ?? 'select version'}
                    </div>
                    <div>
                      <IoIosArrowDown
                        className="text-[#667085] dark:text-white"
                        size={'0.83vw'}
                      />
                    </div>
                  </div>
                }
                listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                btncolor={`${selectedTheme?.bgCard}`}
                listItemColor={`${selectedTheme && selectedTheme?.text}`}
                selectionMode="single"
                selected={new Set([selectedVersionList])}
                setSelected={(keys) => {
                  handleSelectedVersionList(
                    keys,
                    selectedCatalogItem,
                    selectedArtifactGroupItem,
                    selectedArtifactItem,
                    selectedResponseData,
                    contextProps,
                    selectedHandlerData,
                  );
                }}
                items={
                  versionList &&
                  versionList.length > 0 &&
                  versionList.map((item) => {
                    return {
                      key: item,
                      label: item,
                    };
                  })
                }
                classNames={{
                  buttonClassName:
                    '  px-2 rounded-sm  h-[4.5vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#FFFFFF] dark:bg-[#0F0F0F] text-start dark:text-white',
                  popoverClassName:
                    'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                  listBoxClassName:
                    'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                  listBoxItemClassName:
                    'flex w-[100%] items-center  justify-center text-md',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Main(props) {
  const mapppedType = [
    { label: 'Pre Processing', key: 'pre' },
    {
      label: 'Processing',
      key: 'pro',
    },
    {
      label: 'Post Processing',
      key: 'pst',
    },
  ];

  return (
    <ReactFlowProvider>
      {props.currentDrawing === 'UF-UFM' ||
      props.currentDrawing === 'UF-UFW' || props.currentDrawing === 'UF-UFD' ? (
        <EventsMainUO {...props} />
      ) : props.currentDrawing === 'PF-PFD' ||
        props.currentDrawing === 'DF-DFD' ||
        props.currentDrawing === 'DF-DST' ? (
        <EventsMainPO mapppedType={mapppedType} {...props} />
      ) : (
        <p> Not Found </p>
      )}
    </ReactFlowProvider>
  );
}

const Spinner = ({ sucessBtn, failureBtn }) => (
  <div
    style={{
      width: '15px',
      height: '15px',
      border: `${
        failureBtn || sucessBtn ? '4px solid #fff' : '4px solid #ccc'
      }`,
      borderTop: '4px solid #9CA3AF',
      borderRadius: '50%',
      margin: '0 auto',
    }}
  />
);

const AnimatedButton = ({
  onClick,
  label,
  setBackShown,
  setSucessBtn,
  setFailureBtn,
  sucessBtn,
  failureBtn,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showFailuer, setShowFailuer] = useState(false);

  const handleClick = () => {
    try {
      setShowSuccess(false);
      setShowSpinner(true);

      onClick();
      setTimeout(() => {
        setShowSpinner(false);
        setShowSuccess(true);
        setSucessBtn(true);
        setTimeout(() => {
          setSucessBtn(false);
          setShowSuccess(true);
        }, 1500);
      }, 300);
    } catch (error) {
      console.log(error);
      setShowSuccess(false);
      setShowSpinner(true);

      onClick();
      setTimeout(() => {
        setShowSpinner(false);
        setShowFailuer(true);
        setFailureBtn(true);
        setTimeout(() => {
          setFailureBtn(false);
          setShowFailuer(true);
          setShowSuccess(true);
        }, 1500);
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '0.785vw 0.65vw',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        width: 'auto',
        height: '1vw',
        gap: '0.5vw',
      }}
      className={`bg-transparent `}
    >
      {label && (
        <span
          className={` ${
            sucessBtn && !failureBtn
              ? 'text-white'
              : !sucessBtn && failureBtn
                ? 'text-white'
                : !sucessBtn && !failureBtn
                  ? 'text-white'
                  : ''
          } text-[0.83vw] font-[600]`}
        >
          {label}
        </span>
      )}
    </button>
  );
};
