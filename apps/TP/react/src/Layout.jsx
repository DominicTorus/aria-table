/* eslint-disable */
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import {
  Background,
  MiniMap,
  Panel,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CanvasPanel from './CanvasPanel';
import {
  changeArtifactLock,
  getAllCatalogWithArtifactGroup,
  getJson,
} from './commonComponents/api/fabricsApi';
import useCopyPaste from './commonComponents/react-flow-pro/useCopyPaste';
import useUndoRedo from './commonComponents/react-flow-pro/useUndoRedo';
import { tablejson } from './commonComponents/utils/util';
import ContextMenuSelector from './contextMenu/ContextMenuSelector';
import { FabricsSelector } from './FabricsSelector';
import { nodeInfoTabs } from './jonui/JsonUI';
import NewNodeInfoSidebar from './jonui/NewNodeInfoSidebar';
import Navbar from './Navbar';
import NodeGallery from './NodeGallery';
import SideBar from './SideBar';
import Editor from './VPT_UF/TM_GRID/componets/Editor';
import { useComponent } from './VPT_UF/TM_GRID/contexts/Componet';
export const TorusModellerContext = createContext(null);

export default function Layout({
  sessionToken,
  ck,
  clientLoginId,
  currentArtifactKey = null,
  tennant,
  selectedTheme,
  profileImg,
  selectedAccntColor,
}) {
  const component = useComponent();
  const [mainFabric, setMainFabric] = useState('DF');

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedTkey, setSelectedTkey] = useState('AF');
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedArtifactGroup, setSelectedArtifactGroup] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const [showNodeProperty, setShowNodeProperty] = useState(false);
  const [showFabricSideBar, setShowFabricSideBar] = useState(true);
  const [menu, setMenu] = useState(null);
  const [recentClicked, setrecentClicked] = useState(false);
  const ref = useRef(null);
  const [nodePropertyData, setNodePropertyData] = useState({});
  const [artifactLockToggle, setArtifactLockToggle] = useState(false);
  const [redispath, setRedispath] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(tennant);
  const [cataLogListWithArtifactGroup, setCataLogListWithArtifactGroup] =
    useState({
      AF: [],
      AFR: [],
      TFRK: [],
    });
  const [selectedSubFlow, setSelectedSubFlow] = useState(null);
  const [currentUpdation, setCurrentUpdation] = useState('');
  const [artifactsVersion, setArtifactsVersion] = useState([]);
  const [fromSubFlow, setFromSubFlow] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');
  const [isAppOrArtifact, setIsAppOrArtifact] = useState('artifacts');
  const [selectedN8nId, setSelectedN8nId] = useState(null);
  const [selectedTenantObj, setSelectedTenantObj] = React.useState(null);

  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();

  const nodes = useMemo(() => {
    if (
      selectedTkey == 'AF' &&
      selectedFabric &&
      selectedFabric.startsWith('UF') &&
      !selectedSubFlow
    ) {
      return component.nodes;
    } else return reactFlowNodes;
  }, [selectedTkey, selectedFabric, component.nodes, reactFlowNodes]);

  const setNodes = useMemo(() => {
    if (
      selectedTkey == 'AF' &&
      selectedFabric &&
      selectedFabric.startsWith('UF') &&
      !selectedSubFlow
    ) {
      return component.setNodes;
    } else return setReactFlowNodes;
  }, [
    selectedTkey,
    selectedFabric,
    component.setNodes,
    setReactFlowNodes,
    nodes,
  ]);

  const { cut, copy, paste, bufferedNodes } = useCopyPaste();
  const canCopy = nodes.some(({ selected }) => selected);
  const canPaste = bufferedNodes?.length > 0;

  useEffect(() => {
    if (selectedFabric === 'AIF-AIFD') {
      const handleIframeMessage = (event) => {
        // Check the origin to ensure the message is from the expected iframe domain
        if (event.origin === process.env.REACT_APP_N8N_URL) {
          if (event.data?.id) setSelectedN8nId(event.data?.id);
        }
      };

      // Add the message event listener
      window.addEventListener('message', handleIframeMessage);
    }
    // Function to handle messages received from the iframe

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  const handleArtifactLock = useCallback(
    async (toogle) => {
      try {
        if (
          selectedTkey &&
          selectedFabric &&
          selectedProject &&
          selectedArtifactGroup &&
          selectedArtifact &&
          selectedVersion
        ) {
          let res = await changeArtifactLock({
            data: {
              redisKey: [
                client,
                selectedTkey,
                selectedFabric,
                selectedProject,
                selectedArtifactGroup,
                selectedArtifact,
                selectedVersion,
              ],
              value: toogle,
            },
          });
          if (res?.status === 200) {
            setArtifactLockToggle(toogle);
          }
        }
      } catch (error) {}
    },
    [
      artifactLockToggle,
      selectedTkey,
      selectedFabric,
      selectedProject,
      selectedArtifactGroup,
      selectedArtifact,
      selectedVersion,
    ],
  );

  const handleCatalogWithArtifactGroup = useCallback(async (fabric, client) => {
    try {
      return await getAllCatalogWithArtifactGroup(fabric, client)
        .then((res) => res?.data)
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  });

  const preProcessClient = useMemo(() => {
    try {
      if (isAppOrArtifact == 'artifacts') {
        handleCatalogWithArtifactGroup(selectedFabric, ck)
          .then((data) => {
            handleCatalogWithArtifactGroup(selectedFabric, 'TRL')
              .then((res) => {
                setCataLogListWithArtifactGroup({ ...data, AFR: res?.AFR });
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
        return ck;
      }
      if (isAppOrArtifact == 'apps') {
        handleCatalogWithArtifactGroup(selectedFabric, selectedTenant)
          .then((data) => {
            setCataLogListWithArtifactGroup(data);
          })
          .catch((error) => console.error(error));
        return selectedTenant;
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedTenant, isAppOrArtifact, ck, selectedFabric]);

  const client = useMemo(() => {
    try {
      if (selectedTkey === 'AFR') {
        return 'TRL';
      } else return preProcessClient;
    } catch (error) {
      console.error(error);
    }
  }, [preProcessClient, selectedTkey]);

  const redisKey = useMemo(() => {
    try {
      if (selectedVersion)
        return `CK:${client}:FNGK:${selectedTkey}:FNK:${selectedFabric}:CATK:${selectedProject}:AFGK:${selectedArtifactGroup}:AFK:${selectedArtifact}:AFVK:${selectedVersion}`;
      else
        return `CK:${client}:FNGK:${selectedTkey}:FNK:${selectedFabric}:CATK:${selectedProject}:AFGK:${selectedArtifactGroup}:AFK:${selectedArtifact}:AFVK:v1`;
    } catch (error) {
      console.error(error);
    }
  }, [
    selectedTkey,
    client,
    selectedFabric,
    selectedProject,
    selectedArtifactGroup,
    selectedArtifact,
    selectedVersion,
  ]);

  const handleCurrentArtifactKey = async (key) => {
    try {
      const { tKey, fabric, project, artifactGroup, artifact, version } = key;

      const fabrics = {
        'DF-ERD': 'DF',
        'UF-UFW': 'UF',
        'UF-UFM': 'UF',
        'UF-UFD': 'UF',
        'PF-PFD': 'PF',
        'DF-DFD': 'DF',
        'AIF-AIFD': 'AIF',
      };
      if (tKey && fabric && project && artifactGroup && artifact && version) {
        let response = await getJson(
          fabric.toUpperCase(),
          JSON.stringify([
            client,
            tKey.toUpperCase(),
            fabric.toUpperCase(),
            project,
            artifactGroup,
            artifact,
            version,
          ]),
        )
          .then((res) => res?.data)
          .catch((error) => console.error(error));

        if (response) {
          fabrics[fabric.toUpperCase()] &&
            setMainFabric(fabrics[fabric.toUpperCase()]);
          setSelectedArtifactGroup(artifactGroup);
          setSelectedProject(project);
          handleTabChange(fabric.toUpperCase(), true);
          setSelectedArtifact(artifact);
          setSelectedVersion(version);
          setSelectedTkey(tKey.toUpperCase());

          getDataFromNavbar(response);
          setArtifactLockToggle(response?.isLoccked ?? true);
        }
      } else {
        fabric &&
          fabrics[fabric.toUpperCase()] &&
          setMainFabric(fabrics[fabric.toUpperCase()]);
        tKey && setSelectedTkey(tKey);
        fabric && handleTabChange(fabric.toUpperCase());
        project && setSelectedProject(project);
        artifactGroup && setSelectedArtifactGroup(artifactGroup);
        artifact && setSelectedArtifact(artifact);
        version && setSelectedVersion(version);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    try {
      if (currentArtifactKey) {
        handleCurrentArtifactKey(currentArtifactKey);
      }
    } catch (error) {
      console.error(error);
    }
  }, [currentArtifactKey]);

  const loadArtifact = useMemo(() => {
    if (!currentArtifactKey) return null;
    return null;
  }, [currentArtifactKey]);

  const handleTabChange = async (fabric, isLoaded = false) => {
    try {
      setCurrentUpdation('');
      if (fabric == selectedFabric) {
        setShowFabricSideBar(!showFabricSideBar);
        return;
      }
      if (selectedVersion && !isLoaded) handleArtifactLock(false);
      setSelectedFabric(fabric);
      setSearchedValue('');
      setrecentClicked(!recentClicked);
      setShowFabricSideBar(true);
      setSelectedSubFlow(null);

      if (fabric !== 'Home') {
        handleCatalogWithArtifactGroup(fabric, client)
          .then((data) => {
            setCataLogListWithArtifactGroup(data);
          })
          .catch((error) => console.error(error));
      }

      if (!isLoaded) {
        setSelectedProject('');
        setSelectedArtifact('');
        setSelectedVersion('');
        setNodes([]);
        setEdges([]);
        setSelectedN8nId('');
        component?.resetState();
      }

      setShowNodeProperty(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSidebarToggle = () => {
    setShowFabricSideBar(!showFabricSideBar);
  };

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();
      event.stopPropagation();

      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );
  const uniqueNames = useMemo(() => {
    try {
      if (nodes.length > 0) {
        let uniqNameArray = [];
        for (let node of nodes) {
          if (!uniqNameArray.includes(node.data.label)) {
            uniqNameArray.push(node.data.label);
          }
        }

        return uniqNameArray;
      } else {
        return [];
      }
    } catch (error) {}
  }, [nodes]);
  const updatedNodeConfig = (id, metadata, updatedData) => {
    try {
      setNodes((prev) => {
        return prev?.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                nodeProperty: {
                  ...node?.data?.nodeProperty,
                  ...metadata,
                  ...updatedData,
                },
              },
            };
          }
          return node;
        });
      });

      setNodePropertyData((prev) => {
        if (prev?.id === id) {
          return {
            ...prev,
            data: {
              ...prev.data,
              nodeProperty: {
                ...prev?.data?.nodeProperty,
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

  const changeNodeProperty = (values) => {
    try {
      let key = Object.keys(values)[0];
      let value = Object.values(values)[0];

      if (key) {
        setNodes((nds) => {
          return (
            nds &&
            nds.map((nds) => {
              if (nds.id == nodePropertyData.id) {
                if (
                  key == 'name' &&
                  selectedFabric &&
                  selectedFabric.startsWith('UF')
                ) {
                  return {
                    ...nds,
                    data: {
                      ...nds.data,
                      label: value,
                      nodeProperty: {
                        ...nds?.data?.nodeProperty,
                        elementInfo: {
                          ...nds?.data?.nodeProperty?.elementInfo,
                          label: value,
                        },
                      },
                    },
                    property: {
                      ...nds.property,
                      [key]: value,
                    },
                  };
                } else if (
                  key == 'groupType' &&
                  selectedFabric &&
                  selectedFabric.startsWith('UF') &&
                  value == 'table'
                ) {
                  return {
                    ...nds,
                    [key]: value,
                    data: {
                      ...nds.data,
                      nodeProperty: tablejson,
                    },
                    grid: {
                      ...nds.grid,
                      style: {
                        ...nds.grid.style,
                        backgroundColor: '#D3D3D3',
                        // border: '3px solid #FF0072',
                      },
                    },
                  };
                } else if (
                  key == 'groupType' &&
                  selectedFabric &&
                  selectedFabric.startsWith('UF') &&
                  value !== 'table'
                ) {
                  return {
                    ...nds,
                    [key]: value,
                    grid: {
                      ...nds.grid,
                      style: {
                        ...nds.grid.style,
                        backgroundColor: 'rgba(135, 206, 235,0.3)',
                        // border: '3px solid #FF0072'
                      },
                    },
                  };
                } else if (
                  key == 'name' &&
                  selectedFabric &&
                  !selectedFabric.startsWith('UF')
                ) {
                  return {
                    ...nds,
                    data: {
                      ...nds.data,
                      label: value,
                      nodeProperty: {
                        ...nds?.data?.nodeProperty,
                        nodeName: value,
                      },
                    },
                    property: {
                      ...nds.property,
                      [key]: value,
                    },
                  };
                } else if (
                  key === 'label' &&
                  selectedFabric &&
                  selectedFabric.startsWith('UF')
                ) {
                  return {
                    ...nds,
                    data: {
                      ...nds.data,
                      label: value,
                      nodeProperty: {
                        ...nds?.data?.nodeProperty,
                        elementInfo: {
                          ...nds?.data?.nodeProperty?.elementInfo,
                          label: value,
                        },
                      },
                    },
                    property: {
                      ...nds.property,
                      [key]: value,
                    },
                  };
                } else if (
                  key === 'label' &&
                  selectedFabric &&
                  !selectedFabric.startsWith('UF')
                ) {
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
                } else if (key === 'breakPoint') {
                  return {
                    ...nds,
                    data: {
                      ...nds.data,
                      nodeProperty: {
                        ...nds.data.nodeProperty,
                        [key]: value,
                      },
                    },
                  };
                } else {
                  return {
                    ...nds,
                    [key]: value,
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

        setNodePropertyData((prev) => {
          if (
            key == 'name' &&
            selectedFabric &&
            selectedFabric.startsWith('UF')
          ) {
            return {
              ...prev,
              data: {
                ...prev.data,
                label: value,
                nodeProperty: {
                  ...prev?.data?.nodeProperty,
                  elementInfo: {
                    ...prev?.data?.nodeProperty?.elementInfo,
                    label: value,
                  },
                },
              },
              property: {
                ...prev.property,
                [key]: value,
              },
            };
          } else if (
            key == 'name' &&
            selectedFabric &&
            !selectedFabric.startsWith('UF')
          ) {
            return {
              ...prev,
              data: {
                ...prev.data,
                label: value,
                nodeProperty: {
                  ...prev?.data?.nodeProperty,
                  nodeName: value,
                },
              },

              property: {
                ...prev.property,
                [key]: value,
              },
            };
          } else if (
            key == 'groupType' &&
            selectedFabric &&
            selectedFabric.startsWith('UF') &&
            value == 'table'
          ) {
            return {
              ...prev,
              [key]: value,
              data: {
                ...prev.data,
                nodeProperty: tablejson,
              },
              grid: {
                ...prev.grid,
                style: {
                  ...prev.grid.style,
                  backgroundColor: '#D3D3D3',
                  // border: '3px solid #FF0072',
                },
              },
            };
          } else if (
            key == 'groupType' &&
            selectedFabric &&
            selectedFabric.startsWith('UF') &&
            value !== 'table'
          ) {
            return {
              ...prev,
              [key]: value,
              grid: {
                ...prev.grid,
                style: {
                  ...prev.grid.style,
                  backgroundColor: 'rgba(135, 206, 235,0.3)',
                  // border: '3px solid #FF0072',
                },
              },
            };
          } else if (
            key == 'label' &&
            selectedFabric &&
            selectedFabric.startsWith('UF')
          ) {
            return {
              ...prev,
              data: {
                ...prev.data,
                label: value,
                nodeProperty: {
                  ...prev?.data?.nodeProperty,
                  elementInfo: {
                    ...prev?.data?.nodeProperty?.elementInfo,
                    label: value,
                  },
                },
              },
              property: {
                ...nds.property,
                [key]: value,
              },
            };
          } else if (
            key == 'label' &&
            selectedFabric &&
            !selectedFabric.startsWith('UF')
          ) {
            return {
              ...prev,
              data: {
                ...prev.data,
                label: value,
              },
              property: {
                ...nds.property,
                [key]: value,
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
              [key]: value,

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
  const sendDataToFabrics = useMemo(() => {
    if (selectedFabric === 'AIF-AIFD') {
      return {
        n8nWorkflowId: selectedN8nId,
      };
    } else
      return {
        nodes: nodes,
        nodeEdges: edges,
      };
  }, [nodes, edges, selectedFabric, selectedN8nId]);

  const getDataFromNavbar = (data) => {
    if (data?.n8nWorkflowId) {
      setSelectedN8nId(data?.n8nWorkflowId);
    } else {
      setEdges(data?.nodeEdges ?? []);
      setNodes(data?.nodes ?? []);
    }
  };

  const handleMainFabricChange = (mainFab) => {
    const fabric = {
      DF: 'DF-ERD',
      UF: 'UF-UFW',

      PF: 'PF-PFD',
      AIF: 'AIF-AIFD',
    };
    setMainFabric(mainFab);
    handleTabChange(fabric[mainFab]);
  };
  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(
    (type) => {
      setMenu(null);
      if (type === 'delete') {
        setShowNodeProperty(false);
      }
    },
    [setMenu],
  );

  const n8nLoginId = useMemo(() => {
    if (selectedVersion)
      if (selectedN8nId)
        return `${process.env.REACT_APP_N8N_URL}/workflow/${selectedN8nId}`;
      else `${process.env.REACT_APP_N8N_URL}/home/`;
    return '';
  }, [selectedN8nId, selectedVersion]);

  const n8nDefaultId = useMemo(() => {
    const data = {
      login: {
        email: 'support@torus.tech',
        password: 'Torus@123',
      },
    };

    const result = btoa(JSON.stringify(data));
    return `${process.env.REACT_APP_N8N_URL}/signin/${result}`;
  });
  return (
    <TorusModellerContext.Provider
      value={{
        redisKey,
        handleMainFabricChange,
        setMainFabric,
        mainFabric,
        setSelectedFabric,
        currentUpdation,
        setCurrentUpdation,
        sessionToken,
        cataLogListWithArtifactGroup,
        setCataLogListWithArtifactGroup,
        handleArtifactLock,
        artifactLockToggle,
        setArtifactLockToggle,
        loadArtifact,
        setSelectedTkey,
        selectedTkey,
        redispath,
        setRedispath,
        client,
        selectedProject,
        selectedArtifact,
        selectedVersion,
        onPaneClick,
        uniqueNames,
        selectedFabric,
        handleTabChange,
        nodePropertyData,
        selectedArtifactGroup,
        setSelectedArtifactGroup,
        onNodeContextMenu,
        setSelectedArtifact,
        setSelectedProject,
        setSelectedVersion,
        nodes,
        edges,
        setNodes,
        setEdges,
        setSelectedSubFlow,
        selectedSubFlow,
        fromSubFlow,
        setFromSubFlow,
        selectedTenant,
        selectedTheme,
        selectedAccntColor,
        setSelectedTenant,
        artifactsVersion,
        setArtifactsVersion,
        tennant,
      }}
    >
      <div
        className={` flex h-full w-full flex-col max-md:gap-3 lg:max-xl:gap-0 xl:max-3xl:gap-0 xl:max-3xl:bg-gray-600 `}
      >
        <>
          <div
            className="sticky top-0 h-[7%] w-full"
            style={{
              zIndex: 999,
            }}
          >
            <Navbar
              isAppOrArtifact={isAppOrArtifact}
              setIsAppOrArtifact={setIsAppOrArtifact}
              setShowNodeProperty={setShowNodeProperty}
              sendDataToFabrics={getDataFromNavbar}
              getDataFromFabrics={sendDataToFabrics}
              clientLoginId={clientLoginId}
              nodesEdges={{ nodes: nodes, edges: edges }}
              searchedValue={searchedValue}
              setSearchedValue={setSearchedValue}
            />
          </div>

          <>
            <div
              className={`flex h-[93%] w-full  `}
              style={{
                background: ` ${selectedTheme && selectedTheme?.bgCard}`,
                borderColor: `${selectedTheme && selectedTheme?.borderLine}`,
              }}
            >
              <div
                className={`flex h-[100%]  ${showNodeProperty ? 'w-[80.83vw]' : 'w-[100vw]'}`}
              >
                {selectedTkey === 'AF' &&
                selectedFabric &&
                selectedFabric.startsWith('UF') &&
                !selectedSubFlow ? (
                  <div
                    className={`bg-[${selectedTheme?.bgCard}] relative h-full w-full `}
                  >
                    <SideBar
                      isAppOrArtifact={isAppOrArtifact}
                      showNodeProperty={showNodeProperty}
                      setSelectedSubFlow={setSelectedSubFlow}
                      client={client}
                      clientLoginId={clientLoginId}
                      profileImg={profileImg}
                      selectedTenantObj={selectedTenantObj}
                      setSelectedTenantObj={setSelectedTenantObj}
                    />
                    <NodeGallery
                      showFabricSideBar={showFabricSideBar}
                      color={''}
                      handleSidebarToggle={handleSidebarToggle}
                      showNodeProperty={showNodeProperty}
                    />
                    <Panel
                      position="top-center"
                      className={`h-[95%]  ${showNodeProperty ? 'w-[79%]' : 'w-[83%]'} `}
                      style={{
                        left: `${showNodeProperty ? '59%' : '57%'}`,
                        transition: 'left 0.3s ease-in-out',
                      }}
                    >
                      <Editor
                        onNodeContextMenu={onNodeContextMenu}
                        onPaneClick={() => {
                          onPaneClick();
                          setNodePropertyData('');
                          setShowNodeProperty(false);
                          setNodePropertyData({});
                        }}
                        ref={ref}
                      >
                        {menu && (
                          <ContextMenuSelector
                            onClick={onPaneClick}
                            onClose={onPaneClick}
                            fabric={selectedFabric}
                            onEdit={(id) => {
                              component?.setSelectedComponent(id);
                              setNodePropertyData(component?.state?.[id]);
                              setShowNodeProperty(true);
                              onPaneClick();
                            }}
                            selectedTheme={selectedTheme}
                            undoRedo={{
                              undo,
                              redo,
                              canRedo,
                              canRedo,
                              takeSnapshot,
                            }}
                            cutCopyPaste={{
                              cut,
                              copy,
                              paste,
                              canCopy,
                              canPaste,
                            }}
                            {...menu}
                          />
                        )}
                      </Editor>
                    </Panel>
                  </div>
                ) : selectedTkey === 'AF' &&
                  selectedFabric === 'AIF-AIFD' &&
                  !selectedSubFlow ? (
                  <div
                    className="relative h-full w-[100%]"
                    style={{
                      backgroundColor: `${selectedTheme?.bgCard}`,
                    }}
                  >
                    <SideBar
                      isAppOrArtifact={isAppOrArtifact}
                      showNodeProperty={showNodeProperty}
                      setSelectedSubFlow={setSelectedSubFlow}
                      client={client}
                      clientLoginId={clientLoginId}
                      profileImg={profileImg}
                      selectedTenantObj={selectedTenantObj}
                      setSelectedTenantObj={setSelectedTenantObj}
                    />
                    <Panel
                      position="top-center"
                      className={`h-[95%] w-[91%]  rounded-sm border border-slate-300  `}
                      style={{
                        left: '51%',
                        transition: 'left 0.3s ease-in-out',
                      }}
                    >
                      <div
                        style={{ display: !selectedVersion ? 'flex' : 'none' }}
                        className=" h-full  w-full items-center justify-center text-center  italic"
                      >
                        Please load an artifact
                      </div>

                      <iframe
                        id="n8nIframe"
                        src={_.isEmpty(n8nLoginId) ? n8nDefaultId : n8nLoginId}
                        style={{
                          display: selectedVersion ? 'block' : 'none',
                        }}
                        frameborder="0"
                        width="100%"
                        height="100%"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-storage-access-by-user-activation"
                      />
                    </Panel>
                  </div>
                ) : (
                  <FabricsSelector
                    nodes={nodes}
                    edges={edges}
                    setEdges={setEdges}
                    setNodes={setNodes}
                    fabric={selectedFabric}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    undoRedo={{
                      undo: undo,
                      redo: redo,
                      canRedo: canRedo,
                      canUndo: canUndo,
                      takeSnapshot: takeSnapshot,
                    }}
                    ref={ref}
                  >
                    {() => (
                      <>
                        <SideBar
                          isAppOrArtifact={isAppOrArtifact}
                          showNodeProperty={showNodeProperty}
                          setSelectedSubFlow={setSelectedSubFlow}
                          client={client}
                          clientLoginId={clientLoginId}
                          profileImg={profileImg}
                          selectedTenantObj={selectedTenantObj}
                      setSelectedTenantObj={setSelectedTenantObj}
                        />

                        {mainFabric !== 'Home' && !selectedSubFlow && (
                          <>
                            <NodeGallery
                              showFabricSideBar={showFabricSideBar}
                              color={''}
                              handleSidebarToggle={handleSidebarToggle}
                              showNodeProperty={showNodeProperty}
                            />

                            {!showNodeProperty && (
                              <div
                                className={`transition-transform duration-500 ease-in-out ${
                                  !showNodeProperty
                                    ? 'animate-fadeIn'
                                    : 'animate-fadeOut'
                                }`}
                              >
                                {selectedSubFlow == null && (
                                  <MiniMap
                                    position="bottom-right"
                                    style={{
                                      bottom: '8%',
                                      backgroundColor: `${selectedTheme?.bg}`,
                                      borderColor: `${selectedTheme?.bgCard}`,
                                    }}
                                    maskColor="transparent"
                                    className="h-[16.66vh] w-[14.21vw] rounded-lg border"
                                  />
                                )}
                                {selectedSubFlow == null && (
                                  <CanvasPanel
                                    undo={undo}
                                    redo={redo}
                                    canUndo={canUndo}
                                    canRedo={canRedo}
                                  />
                                )}
                              </div>
                            )}

                            {menu && (
                              <ContextMenuSelector
                                onClick={() => {
                                  selectedFabric !== 'events' && onPaneClick();
                                }}
                                onClose={onPaneClick}
                                fabric={selectedFabric}
                                onEdit={(id, type = null) => {
                                  setNodePropertyData(
                                    nodes.find((node) => node.id === id),
                                  );
                                  setShowNodeProperty(true);
                                }}
                                setShowNodeProperty={setShowNodeProperty}
                                selectedTheme={selectedTheme}
                                undoRedo={{
                                  undo,
                                  redo,
                                  canRedo,
                                  canRedo,
                                  takeSnapshot,
                                }}
                                cutCopyPaste={{
                                  cut,
                                  copy,
                                  paste,
                                  canCopy,
                                  canPaste,
                                }}
                                {...menu}
                              />
                            )}
                          </>
                        )}
                        {mainFabric !== 'Home' && (
                          <Background
                            variant="dots"
                            gap={12}
                            size={1}
                            onClick={onPaneClick}
                          />
                        )}
                      </>
                    )}
                  </FabricsSelector>
                )}
              </div>

              {showNodeProperty && (
                <div
                  className={`z-50 h-[100%] overflow-hidden  ${showNodeProperty ? 'w-[19.17vw]' : 'hidden'}  `}
                >
                  <div
                    className={`flex h-[100vh] transform flex-col items-start justify-center  transition-transform delay-75 duration-300 ease-in-out ${showNodeProperty ? 'translate-x-0' : 'translate-x-full'}`}
                    style={{
                      backgroundColor: `${selectedTheme?.bg}`,
                    }}
                  >
                    <div className="top-0 flex h-[5%] w-[100%] cursor-pointer items-center justify-between overflow-hidden text-[#161616] dark:text-[#FFFFFF]">
                      <span
                        className={`px-[0.85vw] text-[0.83vw] font-semibold leading-[2.22vh] text-[${selectedTheme?.text}]`}
                      >
                        properties
                      </span>
                      <span onClick={() => setShowNodeProperty(false)}>
                        <IoCloseCircleOutline
                          size={20}
                          color={`${selectedTheme?.text}`}
                        />
                      </span>
                    </div>

                    <NewNodeInfoSidebar
                      sideBarData={nodePropertyData}
                      updatedNodeConfig={updatedNodeConfig}
                      currentDrawing={selectedFabric}
                      nodeInfoTabs={nodeInfoTabs}
                      changeProperty={changeNodeProperty}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        </>
      </div>
    </TorusModellerContext.Provider>
  );
}
