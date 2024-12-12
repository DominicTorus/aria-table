import '@gorules/jdm-editor/dist/style.css';
import { Sidebar } from 'primereact/sidebar';
import React, { useContext, useEffect, useState } from 'react';
import Builder from '../../VPT_DJUI/builder';
import { AccordianWindow } from '../PropertyWIndow/AccordianWindow';
import ListWindow from '../PropertyWIndow/ListWindow';
import { DarkmodeContext } from '../context/DarkmodeContext';
import {
  cardUIPolicy,
  colorPolicy,
  controlPolicy,
  nodeInfoTabs,
} from '../utils/util';
import { NodeInfoSidebarNodeInformation } from './NodeInfoSidebarNodeInformation';
import { NodeInfoSidebarTabs } from './NodeInfoSidebarTabs';
import { RenderData } from './RenderData';
import { SideBarDebugandFlag } from './SideBarDebugandFlag';

export default function NodeInfoSidebar({
  upIdKey,
  setToggleReactflow,
  nodeConfig,
  updatedNodeConfig,
  customCodeKey,
  visiblity,
  setVisiblity,
  sideBarData,
  currentDrawing,
  changeProperty,
  uniqueNames,
  tenant,
  group,
  application,
  changedatavalues,
  status,
  setStatus,
  nodes,
}) {
  const [err, setErr] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [request, setRequest] = useState({});
  const [response, setResponse] = useState(null);
  const [json, setJson] = useState({});
  const [toggle, setToggle] = useState(false);
  const [sidet, setSideT] = useState(false);
  const [sideResponse, setSideResponse] = useState(false);
  const [getDisplayNames, setGetDisplayNames] = useState([]);
  const [files, setFiles] = useState(null);
  const [helperjson, setHelperjson] = useState({});
  const [attributes] = useState([]);
  const [methods] = useState([]);
  const selectedproperty = sideBarData?.defaults?.pw?.property_Window_UI;
  const [tabopen, seTabopen] = useState(1);
  const { darkMode } = useContext(DarkmodeContext);
  const [activeTab, setActiveTab] = useState('');
  const [selectedIPC, setSelectedIPC] = useState('');
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [decider, setDecider] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [SIFlag, setSIFlag] = useState('');
  const [actionAllowed, setActionAllowed] = useState([]);
  const [actionDenied, setActionDenied] = useState([]);
  const [rendervalue, setRendervalue] = useState(null);
  const updateResponse = (e, s) => {
    setResponse(e);
  };
  const [sendFabrics, setSendFabrics] = useState(null);
  const emptyStatus = false;
  const valueMsg = false;

  const handleOpen = (value) => {
    try {
      setActiveTab(value);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      if (files) {
        setJson((prev) => ({
          ...prev,
          [rendervalue]: JSON.parse(files),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    files,
    rendervalue,
    sideBarData?.data?.label,
    sideBarData?.id,
    sideBarData?.type,
    updatedNodeConfig,
    getDisplayNames,
  ]);

  const handleNames = (e, key) => {
    try {
      if (key === 'name') {
        if (uniqueNames.includes(e.toLowerCase())) {
          if (e.toLowerCase() === sideBarData.property.name.toLowerCase()) {
            return;
          }
          setErr(true);
        } else {
          setErr(false);
          changeProperty({ [key]: e });
        }
      } else changeProperty({ [key]: e });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMethod = (attri, json) => {
    try {
      let MT = [];
      if (
        attri.length > 0 &&
        attri[0].hasOwnProperty('cname') &&
        attri[0].cname !== ''
      ) {
        let cname = [];
        attri &&
          attri.map((item) => {
            if (item.cname) cname.push(item.cname);
            return item;
          });

        let getCname = [];

        attri &&
          attri.forEach((item) => {
            if (
              item?.constraints.includes('@unique') ||
              item?.constraints.includes('@id')
            ) {
              if (item.cname) getCname.push(item.cname);
            }
          });

        if (!json?.entities?.methods || json?.entities?.methods?.length === 0) {
          MT.push(
            {
              isActive: {
                value: true,
                type: 'checkbox',
              },
              methodName: 'Get',

              QueryParams: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...cname],
              },
              QueryConditions: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...getCname],
              },
            },
            {
              isActive: {
                value: true,
                type: 'checkbox',
              },
              methodName: 'GetALL',
              QueryParams: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...cname],
              },
            },

            {
              isActive: {
                value: true,
                type: 'checkbox',
              },
              methodName: 'Post',
              QueryParams: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...cname],
              },
            },
            {
              isActive: {
                value: true,
                type: 'checkbox',
              },
              methodName: 'Put',
              QueryParams: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...cname],
              },
              QueryConditions: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...getCname],
              },
            },
            {
              isActive: {
                value: true,
                type: 'checkbox',
              },
              methodName: 'Delete',
              QueryParams: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...cname],
              },
              QueryConditions: {
                selectedValue: [],
                type: 'multipleSelect',
                selectionList: [...getCname],
              },
            },
          );
        } else {
          MT =
            (json?.entities?.methods &&
              json?.entities?.methods.map((item) => {
                if (
                  item.hasOwnProperty('QueryConditions') &&
                  item.hasOwnProperty('QueryParams')
                ) {
                  return {
                    ...item,
                    QueryParams: {
                      ...item.QueryParams,

                      selectionList: [...cname],
                    },
                    QueryConditions: {
                      ...item.QueryConditions,

                      selectionList: [...getCname],
                    },
                  };
                }
                if (
                  item.hasOwnProperty('QueryConditions') &&
                  !item.hasOwnProperty('QueryParams')
                ) {
                  return {
                    ...item,
                    QueryConditions: {
                      ...item.QueryConditions,

                      selectionList: [...getCname],
                    },
                  };
                }
                if (
                  !item.hasOwnProperty('QueryConditions') &&
                  item.hasOwnProperty('QueryParams')
                ) {
                  return {
                    ...item,
                    QueryParams: {
                      ...item.QueryParams,

                      selectionList: [...cname],
                    },
                  };
                }
                return item;
              })) ||
            [];
        }
      }

      return MT;
    } catch (err) {
      console.error(err);
    }
  };

  const getNodeConfig = (jsons, toogle) => {
    try {
      if (toogle === 'AT') {
        setJson((prev) => {
          if (prev?.entities)
            return {
              ...prev,
              entities: {
                ...prev.entities,
                attributes: jsons,
                methods: handleMethod(jsons, prev),
              },
            };
          else
            return {
              ...prev,
              entities: {
                attributes: jsons,
                methods: handleMethod(jsons, prev),
              },
            };
        });
      }
      if (toogle === 'MT') {
        setJson((prev) => {
          if (prev?.entities)
            return {
              ...prev,
              entities: {
                ...prev.entities,
                methods: jsons,
              },
            };
          else
            return {
              ...prev,
              entities: {
                methods: jsons,
              },
            };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIPCselection = (e) => {
    try {
      setSelectedIPC(e);
      changeProperty({ IPC_flag: Array.from(e)[0] });
    } catch (error) {
      console.error(error);
    }
  };

  const updatejson = (js) => {
    try {
      setJson((prev) => ({
        ...prev,
        [currentModel]: js,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  const updatejson2 = (js) => {
    try {
      setRequest(js);
    } catch (err) {
      console.error(err);
    }
  };

  const tabvisible = (index) => {
    try {
      seTabopen(index);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = async (flowType, isDockey = false, flow) => {
    console.log(flowType, isDockey, flow, 'flow');
    try {
      setCurrentModel(flowType);
      if (currentDrawing === 'DF-ERD') {
        if (flowType === 'entities') {
          setJson((prev) => {
            if (prev && !prev?.entities)
              return {
                ...prev,
                [flowType]: {
                  attributes: sideBarData?.data?.nodeProperty?.[flowType]
                    ?.attributes ?? [
                    {
                      isRequired: {
                        value: true,
                        type: 'checkbox',
                      },
                      cname: '',
                      dataType: {
                        selectedValue: '',
                        type: 'singleSelect',
                        selectionList: [
                          'Int',
                          'String',
                          'Float',
                          'Boolean',
                          'DateTime',
                          'Json',
                        ],
                      },
                      constraints: '',
                      length: '',
                    },
                  ],
                  methods:
                    sideBarData?.data?.nodeProperty?.[flowType]?.methods ??
                    handleMethod(
                      sideBarData?.data?.nodeProperty?.[flowType]?.attributes ??
                        [],
                      prev,
                    ),
                },
              };
            else return prev;
          });

          setToggle(!toggle);
        } else {
          setToggle(!toggle);
          setJson((prev) => ({
            ...prev,
            [flowType]: sideBarData?.data?.nodeProperty?.[flowType] ?? {},
          }));
          setHelperjson((prev) => ({
            ...prev,
            [flowType + '.helper']:
              sideBarData?.data?.nodeProperty?.[flowType + '.helper'] ?? {},
          }));
        }
      } else {
        setToggle(!toggle);
        setJson((prev) => ({
          ...prev,
          [flowType]:
            prev?.[flowType] ??
            sideBarData?.data?.nodeProperty?.[flowType] ??
            {},
        }));
        setHelperjson((prev) => ({
          ...prev,
          [flowType + '.helper']:
            prev?.[flowType + '.helper'] ??
            sideBarData?.data?.nodeProperty?.[flowType + '.helper'] ??
            {},
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentDrawing === 'SF' && sideBarData) {
      if (sideBarData.data?.hasOwnProperty('children')) {
        if (nodes && nodes.length > 0) {
          const displayNames = nodes
            ?.filter((node) => sideBarData?.data?.children.includes(node.id))
            ?.map((node) => node?.data?.code);

          setGetDisplayNames((prevDisplayNames) => [
            ...prevDisplayNames,
            ...displayNames,
          ]);
        }
      }
    }
    return () => {
      setGetDisplayNames([]);
    };
  }, [sideBarData, nodes, currentDrawing]);

  const options = [
    { key: 'A', label: 'A' },
    { key: 'E', label: 'E' },
  ];

  const items = [
    { key: '*', label: '*' },
    ...(getDisplayNames?.map((item) => ({ key: item, label: item })) || []),
  ];

  const handleRender = (propw, js) => {
    try {
      let pw = sideBarData?.data?.nodeProperty?.[propw];
      let ConfigToRender;
      if (pw) {
        switch (pw) {
          case 'm1':
            ConfigToRender = (
              <Builder
                isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
                defaultJSOn={js?.[currentModel] ?? {}}
                controlPolicy={controlPolicy}
                colorPolicy={colorPolicy}
                updatedNodeConfig={updatejson}
                uiPolicy={cardUIPolicy}
                helperJson={
                  sideBarData?.data?.nodeProperty?.[currentModel + '.helper'] ??
                  {}
                }
              />
            );
            break;
          case 'm2':
            ConfigToRender = (
              <AccordianWindow
                sideBarData={js?.[currentModel] ?? {}}
                helperJson={
                  sideBarData?.data?.nodeProperty?.[currentModel + '.helper'] ??
                  {}
                }
                setSidebarData={updatejson}
              />
            );
            break;
          case 'm3':
            ConfigToRender = (
              <ListWindow
                sideBarData={js?.[currentModel] ?? {}}
                helperJson={
                  sideBarData?.data?.nodeProperty?.[currentModel + '.helper'] ??
                  {}
                }
                setSidebarData={updatejson}
              />
            );
            break;
          case 'm4':
            ConfigToRender = (
              <Builder
                decider={decider}
                setDecider={setDecider}
                isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
                defaultJSOn={js?.[currentModel] ?? {}}
                controlPolicy={controlPolicy}
                colorPolicy={colorPolicy}
                updatedNodeConfig={updatejson}
                uiPolicy={cardUIPolicy}
                helperJson={
                  sideBarData?.data?.nodeProperty?.[currentModel] ?? {}
                }
              />
            );
            break;
          default:
            ConfigToRender = null;
        }
      } else {
        ConfigToRender = (
          <Builder
            isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
            defaultJSOn={js?.[currentModel] ?? {}}
            controlPolicy={controlPolicy}
            colorPolicy={colorPolicy}
            updatedNodeConfig={updatejson}
            uiPolicy={cardUIPolicy}
            helperJson={
              sideBarData?.data?.nodeProperty?.[currentModel + '.helper'] ?? {}
            }
          />
        );
      }
      return ConfigToRender;
    } catch (error) {
      console.error(error);
    }
  };

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
      e.preventDefault();

      setRendervalue(value);

      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setContextMenuVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDebug = async () => {
    try {
      if (upIdKey) {
        await fetch(`${process.env.REACT_APP_API_URL}pe/debughtrequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            role: 'Admin',
          },

          body: JSON.stringify({
            key: customCodeKey,
            upId: upIdKey,
            nodeName: sideBarData?.data?.label,
            nodeType: sideBarData?.type,
            nodeId: sideBarData?.id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.hasOwnProperty('request')) {
              window.open(
                `${data.request}?key=${customCodeKey}&upId=${upIdKey}&nodeName=${sideBarData?.data?.label}&nodeType=${sideBarData?.type}&nodeId=${sideBarData?.id}&mode=${data.mode}`,
                '_blank',
              );
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    const newData = {
      SIFlag,
      actionAllowed,
      actionDenied,
    };

    if (newData) {
      changedatavalues(newData);
    }
  };

  const handleRequest = async () => {
    try {
      if (upIdKey) {
        const responses = await fetch(
          `${process.env.REACT_APP_API_URL}pe/debugrequest`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              role: 'Admin',
            },
            body: JSON.stringify({
              key: customCodeKey,
              upId: upIdKey,
              nodeName: sideBarData.data.label,
              nodeType: sideBarData.type,
              nodeId: sideBarData.id,
            }),
          },
        )
          .then((response) => response.json())
          .catch((error) => console.error(error));
        setRequest(responses);
        setSideT(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (upIdKey) {
        const responses = await fetch(
          `${process.env.REACT_APP_API_URL}pe/debugnode`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              role: 'Admin',
            },
            body: JSON.stringify({
              key: customCodeKey,
              upId: upIdKey,
              nodeName: sideBarData.data.label,
              nodeType: sideBarData.type,
              nodeId: sideBarData.id,
              params: request,
            }),
          },
        )
          .then((response) => response.json())
          .catch((error) => console.error(error));
        setResponse(responses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSIFlagselection = (e) => {
    try {
      if (Array.from(e)[0]) {
        setSIFlag(Array.from(e)[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAAlag = (e) => {
    try {
      const selectedItems = Array.from(e);

      setActionAllowed(selectedItems);
    } catch (err) {
      console.error(err);
    }
  };

  const handleADlag = (e) => {
    try {
      const selectedItems = Array.from(e);
      const lastSelectedItem = selectedItems[selectedItems.length - 1]; // Get the last item in the array
      const firstSelectedItem = selectedItems[0]; // Get the first item in the array

      const filterItems = selectedItems.filter((item) => item === '*');

      if (
        lastSelectedItem === '*' ||
        firstSelectedItem === '*' ||
        filterItems.includes('*')
      ) {
        // If the last selected item is "*", set actionDenied to include only "*"
        setActionDenied(['*']);
      } else {
        // Otherwise, set actionDenied to include all selected items
        setActionDenied(selectedItems);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const callOnHide = () => {
    updatedNodeConfig(
      sideBarData?.id,
      {
        nodeId: sideBarData?.id,
        nodeName: sideBarData?.data?.label,
        nodeType: sideBarData?.type,
      },
      {
        ...json,
      },
    );
    setJson({});
    setVisiblity();
    setSelectedIPC('');
    setSIFlag('');
    setActionAllowed([]);
    setActionDenied([]);
  };

  return (
    <>
      {sideBarData && Object.keys(sideBarData).length && (
        <div className="nodeInfoSideBar_wrapper">
          <Sidebar
            className={`${darkMode ? 'bg-[#242424]' : 'bg-white'} 
            ${currentDrawing === 'UF-UFW' || currentDrawing === 'UF-UFM' || currentDrawing === 'UF-UFD' ? 'w-[24%]' : 'w-[27%]'}`}
            visible={visiblity}
            position="right"
            onHide={callOnHide}
            style={{
              overflow: 'hidden !important',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <div className=" flex w-[100%] flex-col items-start justify-start">
              {currentDrawing &&
                nodeInfoTabs &&
                nodeInfoTabs[currentDrawing] &&
                sideBarData.type !== 'orgGrp' &&
                sideBarData.type !== 'roleGrp' &&
                sideBarData.type !== 'org' &&
                sideBarData.type !== 'roles' && (
                  <div className="h-[70px] w-full">
                    <div
                      className={
                        darkMode
                          ? 'flex   w-full justify-between gap-1 rounded-md bg-zinc-700 px-2 py-2  text-zinc-200 transition-all'
                          : 'flex   w-full justify-between gap-1 rounded-md bg-[#a5a7aa] px-2 py-2  text-slate-800 transition-all'
                      }
                    >
                      <NodeInfoSidebarTabs
                        nodeInfoTabs={nodeInfoTabs}
                        currentDrawing={currentDrawing}
                        activeTab={activeTab}
                        handleContextMenu={handleContextMenu}
                        setSendFabrics={setSendFabrics}
                        handleOpen={handleOpen}
                        handleOpenModal={handleOpenModal}
                        setToggleReactflow={setToggleReactflow}
                        setFiles={setFiles}
                        darkMode={darkMode}
                        contextMenuVisible={contextMenuVisible}
                        contextMenuPosition={contextMenuPosition}
                      />
                    </div>
                  </div>
                )}

              {sideBarData && (
                <>
                  <div className="grid  w-[100%] grid-cols-4 gap-2 ">
                    <div
                      className={` flex items-start rounded-[0.52vw] ${
                        darkMode
                          ? 'col-span-4 mt-3 flex flex-col items-start justify-between bg-[#242424] px-2 py-2 '
                          : 'col-span-4 mt-3 flex flex-col items-start justify-between bg-[#f1f4f8] px-2 py-2'
                      } `}
                    >
                      <h1
                        className={`${
                          darkMode
                            ? 'mb-2  font-bold text-[#F4F4F5]'
                            : 'mb-2  font-bold text-black/80'
                        }   cursor-pointer  `}
                      >
                        nodeID :
                      </h1>

                      {sideBarData?.id ? (
                        <div
                          className={`${
                            darkMode
                              ? 'whitespace-nowrap text-xs font-medium text-[#F4F4F5]'
                              : 'whitespace-nowrap text-xs font-medium text-black/80'
                          }`}
                        >
                          {sideBarData?.id}
                        </div>
                      ) : (
                        <p
                          className={`${
                            darkMode
                              ? 'text-sm font-medium text-[#F4F4F5] '
                              : 'text-sm font-medium text-black'
                          }`}
                        >
                          there is no value in this field
                        </p>
                      )}

                      <div className="mt-4 flex w-full items-center justify-start">
                        <h1
                          className={`${
                            darkMode
                              ? 'mb-2  font-bold text-[#F4F4F5]'
                              : 'mb-2  font-bold text-black/80'
                          }cursor-pointer  `}
                        >
                          Node Name :{' '}
                        </h1>

                        {sideBarData?.data?.label ? (
                          <div
                            className={`${
                              darkMode
                                ? 'whitespace-nowrap pl-3 text-xs font-medium text-[#F4F4F5]'
                                : 'whitespace-nowrap pl-3 text-xs font-medium text-black/80'
                            }`}
                          >
                            {sideBarData?.data?.label}
                          </div>
                        ) : (
                          <p
                            className={`${
                              darkMode
                                ? 'pl-3 text-sm font-medium text-[#F4F4F5]'
                                : 'pl-3 text-sm font-medium text-black'
                            }`}
                          >
                            there is no value in this field
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-4 w-[100%]">
                      {sideBarData &&
                        Object.entries(sideBarData?.property).map(
                          ([key, value]) => (
                            <React.Fragment>
                              {key === 'nodeType' && (
                                <div className="mt-0 w-[100%] px-2 py-2">
                                  <div className="flex flex-row ">
                                    <h1
                                      className={`${darkMode ? 'text-white' : 'text-black/80'} font-bold`}
                                    >
                                      nodeType :
                                    </h1>
                                    <span
                                      className={`${darkMode ? 'text-white' : 'text-black/80'} ml-[5px] font-normal`}
                                    >
                                      {value && value}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ),
                        )}
                    </div>

                    <div className="col-span-4 w-[100%]">
                      {currentDrawing !== 'SF' && (
                        <>
                          <NodeInfoSidebarNodeInformation
                            sideBarData={sideBarData}
                            currentDrawing={currentDrawing}
                            handleNames={handleNames}
                            darkMode={darkMode}
                            changeProperty={changeProperty}
                            selectedIPC={selectedIPC}
                            handleIPCselection={handleIPCselection}
                            err={err}
                          />
                        </>
                      )}

                      {sideBarData && currentDrawing === 'SF' && (
                        <>
                          <SideBarDebugandFlag
                            upIdKey={upIdKey}
                            activeTab={activeTab}
                            handleDebug={handleDebug}
                            handleRequest={handleRequest}
                            handleSubmit={handleSubmit}
                            setSideResponse={setSideResponse}
                            sideResponse={sideResponse}
                            currentDrawing={currentDrawing}
                            sideBarData={sideBarData}
                            darkMode={darkMode}
                            SIFlag={SIFlag}
                            handleSIFlagselection={handleSIFlagselection}
                            actionAllowed={actionAllowed}
                            setActionAllowed={setActionAllowed}
                            handleAAlag={handleAAlag}
                            actionDenied={actionDenied}
                            setActionDenied={setActionDenied}
                            handleADlag={handleADlag}
                            handleSave={handleSave}
                            status={status}
                            emptyStatus={emptyStatus}
                            valueMsg={valueMsg}
                            options={options}
                            items={items}
                          />
                        </>
                      )}

                      {sideBarData && currentDrawing === 'PF-PFD' && (
                        <>
                          <SideBarDebugandFlag
                            upIdKey={upIdKey}
                            activeTab={activeTab}
                            handleDebug={handleDebug}
                            handleRequest={handleRequest}
                            handleSubmit={handleSubmit}
                            setSideResponse={setSideResponse}
                            sideResponse={sideResponse}
                            currentDrawing={currentDrawing}
                            sideBarData={sideBarData}
                            darkMode={darkMode}
                            SIFlag={SIFlag}
                            handleSIFlagselection={handleSIFlagselection}
                            actionAllowed={actionAllowed}
                            setActionAllowed={setActionAllowed}
                            handleAAlag={handleAAlag}
                            actionDenied={actionDenied}
                            setActionDenied={setActionDenied}
                            handleADlag={handleADlag}
                            handleSave={handleSave}
                            status={status}
                            emptyStatus={emptyStatus}
                            valueMsg={valueMsg}
                            options={options}
                            items={items}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Sidebar>

          {request && (
            <Sidebar
              position="right"
              visible={sidet}
              onHide={async () => {
                setSideT(false);
                setStatus(false);
              }}
            >
              <Builder
                isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
                defaultJSOn={request}
                controlPolicy={controlPolicy}
                colorPolicy={colorPolicy}
                updatedNodeConfig={updatejson2}
                uiPolicy={cardUIPolicy}
                helperJson={helperjson}
              />
            </Sidebar>
          )}
          {response && (
            <Sidebar
              position="right"
              visible={sideResponse}
              onHide={async () => {
                setSideResponse(false);
              }}
            >
              <Builder
                isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
                defaultJSOn={response}
                controlPolicy={controlPolicy}
                colorPolicy={colorPolicy}
                updatedNodeConfig={updateResponse}
                uiPolicy={cardUIPolicy}
                helperJson={helperjson}
              />
            </Sidebar>
          )}

          <RenderData
            sideBarData={sideBarData}
            currentModel={currentModel}
            currentDrawing={currentDrawing}
            json={json}
            setJson={setJson}
            setToggle={setToggle}
            toggle={toggle}
            handleRender={handleRender}
            tabvisible={tabvisible}
            tabopen={tabopen}
            attributes={attributes}
            methods={methods}
            getNodeConfig={getNodeConfig}
            sendFabrics={sendFabrics}
            tenant={tenant}
            group={group}
            application={application}
            selectedproperty={selectedproperty}
            darkMode={darkMode}
            updatedNodeConfig={updatedNodeConfig}
            helperJson={helperjson}
          />
        </div>
      )}
    </>
  );
}
