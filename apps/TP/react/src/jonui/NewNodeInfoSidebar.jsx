import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NodeInfoSidebarNodeInformation } from '../commonComponents/CommonSideBar/NodeInfoSidebarNodeInformation';
import { NodeInfoSidebarTabs } from '../commonComponents/CommonSideBar/NodeInfoSidebarTabs';
import { SideBarDebugandFlag } from '../commonComponents/CommonSideBar/SideBarDebugandFlag';
import { DarkmodeContext } from '../commonComponents/context/DarkmodeContext';
import {
  colorPolicy,
  controlPolicy,
  tableUIPolicy,
} from '../commonComponents/utils/util';
import { RenderJson } from './JsonUI';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { PiRowsPlusTopLight } from 'react-icons/pi';
import { SiGithubactions } from 'react-icons/si';
import { TorusModellerContext } from '../Layout';
import TableView from '../VPT_DJUI/Components/tableUi/TableView';
import TorusButton from '../torusComponents/TorusButton';
export const booleanContext = createContext(null);
const options = [
  { key: 'A', label: 'A' },
  { key: 'E', label: 'E' },
];
const emptyStatus = false;
const valueMsg = false;
const NewNodeInfoSidebar = ({
  sideBarData,
  currentDrawing,

  nodeInfoTabs,

  updatedNodeConfig,
  changeProperty,

  upIdKey,
  customCodeKey,
  changedatavalues,
  setSideT,
  status,
}) => {
  const [activeTab, setActiveTab] = useState('');

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [rendervalue, setRendervalue] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const identifier = useRef(null);

  const { selectedTheme } = useContext(TorusModellerContext);

  const [json, setJson] = useState({});
  const [currentModel, setCurrentModel] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [files, setFiles] = useState(null);
  const [helperjson, setHelperjson] = useState({});
  const [tabopen, seTabopen] = useState(1);

  const { darkMode } = useContext(DarkmodeContext);
  const [selectedIPC, setSelectedIPC] = useState('');
  const [err, setErr] = useState(false);
  const [request, setRequest] = useState({});
  const [response, setResponse] = useState(null);
  const [SIFlag, setSIFlag] = useState('');
  const [shownLength, setShownLength] = useState(5);

  const [sideResponse, setSideResponse] = useState(false);
  const [expandTableUi, setExpandTableUi] = useState(false);
  const [actionAllowed, setActionAllowed] = useState([]);
  const [actionDenied, setActionDenied] = useState([]);
  const [getDisplayNames, setGetDisplayNames] = useState([]);

  const [jsonUpdateCompleteAT, setJsonUpdateCompleteAT] = useState(false);
  const [jsonUpdateCompleteMT, setJsonUpdateCompleteMT] = useState(false);
  const [sideBarDataPrevID, setSideBarDataPrevID] = useState('');

  useGSAP(() => {
    gsap.fromTo(
      identifier.current,
      { height: 0, opacity: 0, duration: 0.3, ease: 'power1.inOut' },
      { height: 'auto', opacity: 1, duration: 0.5, ease: 'power1.inOut' },
    );
  }, [toggle]);

  const items = useMemo(
    () => [
      { key: '*', label: '*' },
      ...(getDisplayNames?.map((item) => ({ key: item, label: item })) || []),
    ],
    [getDisplayNames],
  );

  useEffect(() => {
    if (sideBarData.id !== sideBarDataPrevID) {
      setJson({});
      setSideBarDataPrevID(sideBarData.id);
    } else {
      if (
        currentDrawing == 'UF-UFM' ||
        currentDrawing == 'UF-UFW' ||
        currentDrawing == 'UF-UFD'
      ) {
        setJson(sideBarData?.data?.nodeProperty?.elementInfo);
      }
    }
  }, [sideBarData]);

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

  const handleOpen = (value) => {
    try {
      setActiveTab(value);
    } catch (error) {
      console.error(error);
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

  const handleJsonUpdate = (json, type) => {
    if (type === 'AT') {
      setJsonUpdateCompleteAT(true);
    }
    if (type === 'MT') {
      setJsonUpdateCompleteMT(true);
    }
  };
  const getNodeConfig = (jsons, toogle) => {
    try {
      if (toogle === 'AT') {
        setJson(
          (prev) => {
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
          },
          handleJsonUpdate(json, 'AT'),
        );
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
      }

      if (toogle === 'MT') {
        setJson(
          (prev) => {
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
          },
          handleJsonUpdate(json, 'MT'),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    try {
      if (jsonUpdateCompleteAT) {
        updatedNodeConfig(
          sideBarData?.id,
          {
            nodeId: sideBarData?.id,
            nodeName: sideBarData?.data?.label,
            nodeType: sideBarData?.type,
          },
          { ...json },
        );
        setJsonUpdateCompleteAT(false);
      }

      if (jsonUpdateCompleteMT) {
        updatedNodeConfig(
          sideBarData?.id,
          {
            nodeId: sideBarData?.id,
            nodeName: sideBarData?.data?.label,
            nodeType: sideBarData?.type,
          },
          { ...json },
        );
        setJsonUpdateCompleteMT(false);
      }
    } catch (error) {}
  }, [jsonUpdateCompleteAT, jsonUpdateCompleteMT, json]);
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
                      selectedValue:
                        item.QueryParams.selectedValue.length > 0
                          ? item.QueryParams.selectedValue.filter((value) =>
                              cname.includes(value),
                            )
                          : [],
                      selectionList: [...cname],
                    },
                    QueryConditions: {
                      ...item.QueryConditions,
                      selectedValue:
                        item.QueryConditions.selectedValue.length > 0
                          ? item.QueryConditions.selectedValue.filter((value) =>
                              getCname.includes(value),
                            )
                          : [],

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
                      selectedValue:
                        item.QueryConditions.selectedValue.length > 0
                          ? item.QueryConditions.selectedValue.filter((value) =>
                              getCname.includes(value),
                            )
                          : [],
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
                      selectedValue:
                        item.QueryParams.selectedValue.length > 0
                          ? item.QueryParams.selectedValue.filter((value) =>
                              cname.includes(value),
                            )
                          : [],
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

  const handleOpenModal = async (
    flowType,
    isDockey = false,
    flow,
    tabtoOpen,
  ) => {
    try {
      if (flowType !== 'entities') {
        setToggle(false);
      }
      setCurrentModel(flowType);
      if (flowType !== 'property') {
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
                        sideBarData?.data?.nodeProperty?.[flowType]
                          ?.attributes ?? [],
                        prev,
                      ),
                  },
                };
              else return prev;
            });

            setToggle(true);
          } else {
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
      }
    } catch (error) {
      console.error(error);
    }
  };
  const tabvisible = (index) => {
    try {
      seTabopen(index);
    } catch (error) {
      console.error(error);
    }
  };
  const handleNames = (e, key) => {
    try {
      if (key === 'name') {
        changeProperty({ [key]: e });
      } else changeProperty({ [key]: e });
    } catch (err) {
      console.error(err);
    }
  };

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
        ).then((response) => response.json());
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
        ).then((response) => response.json());
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

  useEffect(() => {
    setShownLength(5);
  }, [expandTableUi]);

  const hanldeFullscreen = () => {
    setExpandTableUi((prev) => !prev);
  };

  const handleAAlag = (e) => {
    try {
      const selectedItems = Array.from(e);
      const lastSelectedItem = selectedItems[selectedItems.length - 1];

      const firstSelectedItem = selectedItems[0];

      const filterItems = selectedItems.filter((item) => item === '*');

      if (
        lastSelectedItem === '*' ||
        firstSelectedItem === '*' ||
        filterItems.includes('*')
      ) {
        setActionAllowed(['*']);
      } else if (
        selectedItems.length == items.length - 1 &&
        !selectedItems.includes('*')
      ) {
        setActionAllowed(['*']);
      } else {
        setActionAllowed(selectedItems);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenders = (cm) => {
    switch (currentDrawing) {
      case 'DF-ERD':
        switch (cm) {
          case 'property':
            return (
              <>
                <div
                  className={`mt-[0.85vh] max-h-[78vh] w-[100%] overflow-y-scroll rounded-sm  px-[0.85vw] py-[1vh] pb-[1.85vh]`}
                  style={{
                    backgroundColor: `${selectedTheme?.bg}`,
                  }}
                >
                  <p
                    className="text-[0.72vw] font-[400] "
                    style={{
                      color: `${selectedTheme?.text}`,
                    }}
                  >
                    Node Information
                  </p>
                  <div>
                    <div className="w-[100%] pt-[1vh]">
                      <div
                        className="flex w-[100%] flex-col rounded-md  px-[0.55vw] py-[0.85vh]"
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                        }}
                      >
                        <h1
                          className={`${'mb-1 text-[0.62vw]  font-bold '} cursor-pointer `}
                          style={{
                            color: `${selectedTheme?.text}80`,
                          }}
                        >
                          Node Type :
                        </h1>

                        {sideBarData &&
                          Object.entries(sideBarData?.property).map(
                            ([key, value]) => (
                              <React.Fragment key={key}>
                                {key === 'nodeType' &&
                                  (value ? (
                                    <span
                                      className="block w-[98%] overflow-hidden text-ellipsis whitespace-nowrap text-black/80 dark:text-[#F4F4F5]"
                                      style={{
                                        fontSize: '0.62vw',
                                        fontWeight: 500,
                                        lineHeight: '2.22vh',
                                      }}
                                    >
                                      {value}
                                    </span>
                                  ) : (
                                    <span
                                      className="block w-[98%] whitespace-nowrap text-black/80 dark:text-[#F4F4F5]"
                                      style={{
                                        fontSize: '0.62vw',
                                        fontWeight: 500,
                                        lineHeight: '2.22vh',
                                      }}
                                    >
                                      There is no data on this field.
                                    </span>
                                  ))}
                              </React.Fragment>
                            ),
                          )}
                      </div>
                    </div>

                    <NodeInfoSidebarNodeInformation
                      sideBarData={sideBarData}
                      currentDrawing={currentDrawing}
                      handleNames={handleNames}
                      darkMode={darkMode}
                      changeProperty={changeProperty}
                      selectedIPC={selectedIPC}
                      handleIPCselection={handleIPCselection}
                      err={err}
                      selectedTheme={selectedTheme}
                    />
                  </div>
                </div>

                {sideBarData && currentDrawing === 'PF-PFD' && (
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
                )}
              </>
            );
          case 'entities':
            return (
              <DialogTrigger isOpen={toggle} onOpenChange={setToggle}>
                <ModalOverlay
                  className={({ isEntering, isExiting }) => `
				fixed inset-0 flex items-center justify-center overflow-y-auto text-center 
			${isEntering ? 'duration-300 ease-out animate-in fade-in' : ''}
			${isExiting ? 'duration-200 ease-in animate-out fade-out' : ''}
			${expandTableUi ? 'bg-black/50' : 'bg-black/50'}

			`}
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <Modal
                    className={` transition-all duration-300 ease-in-out ${expandTableUi ? 'mt-[3.25%]' : ''} ${expandTableUi ? 'ml-[5%]' : ''} rounded-md bg-white dark:bg-[#161616] ${expandTableUi ? 'h-[88vh] w-[94vw]' : 'h-[62.09vh] w-[62vw]'}`}
                  >
                    <Dialog className="h-[100%]">
                      {({ close }) => (
                        <div
                          className="flex h-full w-full flex-col items-center justify-center
                   gap-4 overflow-y-hidden border-none outline-none transition-all delay-100"
                        >
                          <booleanContext.Provider
                            value={{
                              expandTableUi,
                              setExpandTableUi,
                              shownLength,
                            }}
                          >
                            <TableView
                              methodProps={{
                                key: sideBarData?.id + 'MT',
                                uiPolicy: tableUIPolicy,
                                keys: 'MT',
                                defaultJSOn: json?.entities?.methods,
                                updatedNodeConfig: getNodeConfig,
                                nodeType: sideBarData?.type,
                                isAdmin: {
                                  canAdd: true,
                                  canDelete: true,
                                  canEdit: true,
                                },
                                controlPolicy: controlPolicy,
                                colorPolicy: colorPolicy,
                              }}
                              attributesProps={{
                                key: sideBarData?.id + 'AT',
                                uiPolicy: tableUIPolicy,
                                keys: 'AT',
                                defaultJSOn: json?.entities?.attributes || [],
                                updatedNodeConfig: getNodeConfig,
                                nodeType: sideBarData?.type,
                                isAdmin: {
                                  canAdd: true,
                                  canDelete: true,
                                  canEdit: true,
                                },
                                controlPolicy: controlPolicy,
                                colorPolicy: colorPolicy,
                              }}
                              json={json}
                              tabopen={tabopen}
                              tabvisible={tabvisible}
                              children={({ children }) => (
                                <div className="flex h-[6.66vh] w-full items-center justify-between border-b  border-[#E5E9EB]  dark:border-[#212121]">
                                  <div className="flex h-full flex-row items-center justify-start gap-3 rounded-t-md px-2 ">
                                    <div
                                      onClick={() => tabvisible(1)}
                                      className={`flex h-full w-full cursor-pointer flex-row items-center justify-center gap-2 text-[0.93vw] font-semibold
					${tabopen === 1 ? 'text-black dark:text-white ' : 'text-[#1A2024]/50 dark:text-gray-500'} `}
                                    >
                                      <SiGithubactions
                                        className={`${tabopen === 1 ? 'text-black dark:text-white' : 'text-[#1A2024]/50 dark:text-gray-500'} text-[0.93vw] font-semibold`}
                                      />
                                      Attributes
                                    </div>
                                    <div
                                      onClick={() => tabvisible(2)}
                                      className={`flex h-full w-full cursor-pointer flex-row items-center justify-center gap-2 text-[0.93vw] font-semibold
                                        ${tabopen === 2 ? 'text-black dark:text-white' : 'text-[#1A2024]/50 dark:text-gray-500'} `}
                                    >
                                      <PiRowsPlusTopLight
                                        className={`${tabopen === 2 ? 'text-black dark:text-white' : 'text-[#1A2024]/50 dark:text-gray-500'} text-[0.93vw] font-semibold`}
                                      />
                                      Methods
                                    </div>
                                  </div>
                                  {children &&
                                    typeof children == 'function' &&
                                    children({
                                      achildren: (
                                        <>
                                          <TorusButton
                                            onPress={() => hanldeFullscreen()}
                                            Children={
                                              <div className="flex h-full w-full items-center justify-center ">
                                                <CgArrowsExpandRight
                                                  className="text-black dark:text-white"
                                                  size={12}
                                                />
                                              </div>
                                            }
                                            buttonClassName="w-[2.37vw] h-[3.98vh] flex cursor-pointer items-center justify-center rounded-md bg-[#F4F5FA] dark:bg-[#0F0F0F]"
                                          />
                                          <TorusButton
                                            onPress={close}
                                            buttonClassName={`flex h-[2vw] w-[2vw] text-black dark:text-white cursor-pointer flex-row items-center justify-center gap-2 rounded-md text-[0.93vw] font-semibold`}
                                            Children={'X'}
                                          />
                                        </>
                                      ),
                                    })}
                                </div>
                              )}
                            />
                          </booleanContext.Provider>
                        </div>
                      )}
                    </Dialog>
                  </Modal>
                </ModalOverlay>
              </DialogTrigger>
            );
          default:
            return (
              <RenderJson
                json={json[cm]}
                setJson={setJson}
                nodedata={sideBarData}
                cm={cm}
                updatedNodeConfig={updatedNodeConfig}
                selectedTheme={selectedTheme}
              />
            );
        }

      case 'DF-DFD':
        switch (cm) {
          case 'property':
            return (
              <>
                <div
                  className="  mt-[0.85vh] max-h-[78vh] w-[100%]
overflow-y-scroll rounded-sm  px-[0.85vw] py-[1vh] pb-[1.85vh] "
                  style={{
                    backgroundColor: `${selectedTheme?.bg}`,
                  }}
                >
                  <p
                    className="text-[0.72vw] font-[400] "
                    style={{
                      color: `${selectedTheme?.text}`,
                    }}
                  >
                    Node Information
                  </p>
                  <div className={``}>
                    <div className="w-[100%] pt-[1vh]">
                      <div
                        className="flex w-[100%] flex-col rounded-md px-[0.55vw] py-[0.85vh] "
                        style={{
                          backgroundColor: `${selectedTheme?.bgCard}`,
                        }}
                      >
                        <h1
                          className={`${'mb-1 text-[0.62vw]  font-bold '} cursor-pointer `}
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Node Type :
                        </h1>

                        {sideBarData &&
                          Object.entries(sideBarData?.property).map(
                            ([key, value]) => (
                              <React.Fragment key={key}>
                                {key === 'nodeType' &&
                                  (value ? (
                                    <span
                                      className="block w-[98%] overflow-hidden text-ellipsis whitespace-nowrap"
                                      style={{
                                        fontSize: '0.62vw',
                                        fontWeight: 500,
                                        lineHeight: '2.22vh',
                                        color: `${selectedTheme?.text}`,
                                      }}
                                    >
                                      {value}
                                    </span>
                                  ) : (
                                    <span
                                      className="block w-[98%] whitespace-nowrap text-black/80 dark:text-[#F4F4F5]"
                                      style={{
                                        fontSize: '0.62vw',
                                        fontWeight: 500,
                                        lineHeight: '2.22vh',
                                      }}
                                    >
                                      There is no data on this field.
                                    </span>
                                  ))}
                              </React.Fragment>
                            ),
                          )}
                      </div>
                    </div>
                  </div>

                  <NodeInfoSidebarNodeInformation
                    sideBarData={sideBarData}
                    currentDrawing={currentDrawing}
                    handleNames={handleNames}
                    darkMode={darkMode}
                    changeProperty={changeProperty}
                    selectedIPC={selectedIPC}
                    handleIPCselection={handleIPCselection}
                    err={err}
                    selectedTheme={selectedTheme}
                  />
                </div>

                {sideBarData && currentDrawing === 'PF-PFD' && (
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
                )}
              </>
            );
          case 'entities':
            return (
              <DialogTrigger isOpen={toggle} onOpenChange={setToggle}>
                <ModalOverlay
                  className={({
                    isEntering,
                    isExiting,
                  }) => ` fixed inset-0 flex items-center justify-center overflow-y-auto text-center ${isEntering ? 'duration-300 ease-out animate-in fade-in' : ''} ${isExiting ? 'duration-200 ease-in animate-out fade-out' : ''}
				${expandTableUi ? 'bg-black/50' : 'bg-black/50'} `}
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <Modal
                    className={` transition-all duration-300 ease-in-out ${expandTableUi ? 'mt-[3.25%]' : ''} ${expandTableUi ? 'ml-[5%]' : ''} rounded-md bg-white dark:bg-[#161616] ${expandTableUi ? 'h-[88vh] w-[94vw]' : 'h-[62.09vh] w-[62vw]'}`}
                  >
                    <Dialog className="h-[100%]">
                      {({ close }) => (
                        <div
                          className="flex h-full w-full flex-col items-center justify-center
                   gap-4 overflow-y-hidden border-none outline-none transition-all delay-100"
                        >
                          <booleanContext.Provider
                            value={{
                              expandTableUi,
                              setExpandTableUi,
                              shownLength,
                            }}
                          >
                            <TableView
                              methodProps={{
                                key: sideBarData?.id + 'MT',
                                uiPolicy: tableUIPolicy,
                                keys: 'MT',
                                defaultJSOn: json?.entities?.methods,
                                updatedNodeConfig: getNodeConfig,
                                nodeType: sideBarData?.type,
                                isAdmin: {
                                  canAdd: true,
                                  canDelete: true,
                                  canEdit: true,
                                },
                                controlPolicy: controlPolicy,
                                colorPolicy: colorPolicy,
                              }}
                              attributesProps={{
                                key: sideBarData?.id + 'AT',
                                uiPolicy: tableUIPolicy,
                                keys: 'AT',
                                defaultJSOn: json?.entities?.attributes || [],
                                updatedNodeConfig: getNodeConfig,
                                nodeType: sideBarData?.type,
                                isAdmin: {
                                  canAdd: true,
                                  canDelete: true,
                                  canEdit: true,
                                },
                                controlPolicy: controlPolicy,
                                colorPolicy: colorPolicy,
                              }}
                              json={json}
                              tabopen={tabopen}
                              tabvisible={tabvisible}
                              children={({ children }) => (
                                <div className="flex h-[6.66vh] w-full items-center justify-between border-b  border-[#E5E9EB] pt-[0.5vw] dark:border-[#212121]">
                                  <div className="flex h-full flex-row items-center justify-start gap-3 rounded-t-md px-2 ">
                                    <div
                                      onClick={() => tabvisible(1)}
                                      className={`flex h-full w-full cursor-pointer flex-row items-center justify-center gap-2 text-[0.93vw] font-semibold
					${tabopen === 1 ? 'text-black dark:text-white ' : 'text-[#1A2024]/50 dark:text-gray-500'} `}
                                    >
                                      <SiGithubactions
                                        className={`${tabopen === 1 ? 'text-black dark:text-white' : 'text-[#1A2024]/50 dark:text-gray-500'} text-[0.93vw] font-semibold`}
                                      />
                                      {/* <Attributes className={`${tabopen === 1 ? "stroke-black dark:stroke-white" : "stroke-[#1A2024]/50 dark:  font-semibold`} /> */}
                                      Attributes
                                    </div>
                                    <div
                                      onClick={() => tabvisible(2)}
                                      className={`flex h-full w-full cursor-pointer flex-row items-center justify-center gap-2 text-[0.93vw] font-semibold
                                        ${tabopen === 2 ? 'text-black dark:text-white' : 'text-[#1A2024]/50 dark:text-gray-500'} `}
                                    >
                                      <PiRowsPlusTopLight
                                        className={`${tabopen === 2 ? 'text-black dark:text-white' : 'text-[#1A2024]/50 dark:text-gray-500'} text-[0.93vw] font-semibold`}
                                      />
                                      {/* <Methods className={`${tabopen === 2 ? "stroke-black dark:stroke-white" : "stroke-[#1A2024]/50 dark:stroke-gray-500"} w-[1.15w] h-[1.15w] font-semibold`} /> */}
                                      Methods
                                    </div>
                                  </div>
                                  {children &&
                                    typeof children == 'function' &&
                                    children({
                                      achildren: (
                                        <>
                                          <TorusButton
                                            onPress={() => hanldeFullscreen()}
                                            Children={
                                              <div className="flex h-full w-full items-center justify-center ">
                                                <CgArrowsExpandRight
                                                  className="text-black dark:text-white"
                                                  size={12}
                                                />
                                              </div>
                                            }
                                            buttonClassName="w-[2.37vw] h-[3.98vh] flex cursor-pointer items-center justify-center rounded-md bg-[#F4F5FA] dark:bg-[#0F0F0F]"
                                          />
                                          <TorusButton
                                            onPress={close}
                                            buttonClassName={`flex h-[2vw] w-[2vw] text-black dark:text-white cursor-pointer flex-row items-center justify-center gap-2 rounded-md text-[0.93vw] font-semibold`}
                                            Children={'X'}
                                          />
                                        </>
                                      ),
                                    })}
                                </div>
                              )}
                            />
                          </booleanContext.Provider>
                        </div>
                      )}
                    </Dialog>
                  </Modal>
                </ModalOverlay>
              </DialogTrigger>

              // <Dialog
              // className={darkMode ? "bg-[#242424]" : "bg-[#fff]"}
              // maximizable
              // zIndex={100000}
              // style={{ height: "70vh", width: "70vw" }}
              // visible={toggle}
              // onHide={() => {
              // setToggle(false);
              // }}
              // headerStyle={{
              // backgroundColor: darkMode ? "#242424" : "#fff",
              // color: darkMode ? "white" : "black",
              // }}
              // contentStyle={{
              // backgroundColor: darkMode ? "#242424" : "#fff",
              // }}
              // >
              // <div
              // className="flex h-full w-full flex-col items-center justify-center
              // gap-4 overflow-y-hidden transition-all delay-100 "
              // >
              // <div
              // className={` items-between flex h-[40px] w-[315px] flex-row justify-around gap-[0px] rounded-md py-[2px] text-base xl:py-[3px] ${darkMode ? "bg-[#363636]" : "bg-[#F1F3F9]"} `}
              // >
              // <div
              // onClick={() => tabvisible(1)}
              // className={`xl:text-md flex cursor-pointer select-none flex-row items-center gap-2
              // rounded-md px-[21px] py-[4px] text-center text-sm text-slate-600
              // transition-all xl:px-[25px] xl:py-[3px] text-${darkMode ? "white" : "black"}

              // ${tabopen === 1 && `border border-slate-500/50 font-bold `}`}
              // >
              // <AiOutlineDatabase className="text-xl" />
              // Attributes
              // </div>
              // <div
              // onClick={() => tabvisible(2)}
              // className={`xl:text-md flex cursor-pointer select-none flex-row items-center gap-1
              // rounded-md px-[21px] py-[4px] text-center
              // text-sm text-slate-600 transition-all xl:gap-2
              // xl:px-[28px] xl:py-[3px] text-${darkMode ? "white" : "black"}
              // ${tabopen === 2 && `border border-slate-500/50 font-bold `} `}
              // >
              // <VscSymbolMethod className="text-xl" />
              // Methods
              // </div>
              // </div>
              // <div className=" h-[80%] w-full rounded-xl shadow-black/40">
              // <div
              // className={
              // " h-full w-full  " +
              // (tabopen === 1
              // ? " flex items-center justify-center"
              // : " hidden")
              // }
              // >
              // <Builder
              // key={sideBarData?.id + "AT"}
              // uiPolicy={tableUIPolicy}
              // keys={"AT"}
              // defaultJSOn={json?.entities?.attributes || []}
              // updatedNodeConfig={getNodeConfig}
              // nodeType={sideBarData?.type}
              // isAdmin={{
              // canAdd: true,
              // canDelete: true,
              // canEdit: true,
              // }}
              // controlPolicy={controlPolicy}
              // colorPolicy={colorPolicy}
              // />
              // </div>
              // <div
              // className={
              // " h-full w-full  " +
              // (tabopen === 2
              // ? " flex items-center justify-center"
              // : " hidden")
              // }
              // >
              // {json?.entities?.methods &&
              // json?.entities?.methods?.length > 0 ? (
              // <Builder
              // key={sideBarData?.id + "MT"}
              // uiPolicy={tableUIPolicy}
              // keys={"MT"}
              // defaultJSOn={json?.entities?.methods}
              // updatedNodeConfig={getNodeConfig}
              // nodeType={sideBarData?.type}
              // isAdmin={{
              // canAdd: true,
              // canDelete: true,
              // canEdit: true,
              // }}
              // controlPolicy={controlPolicy}
              // colorPolicy={colorPolicy}
              // />
              // ) : (
              // <p className="text-center text-2xl text-white">
              // column found for this node
              // </p>
              // )}
              // </div>
              // </div>
              // </div>
              // </Dialog>
            );
          default:
            return (
              <RenderJson
                json={json[cm]}
                setJson={setJson}
                nodedata={sideBarData}
                cm={cm}
                updatedNodeConfig={updatedNodeConfig}
                selectedTheme={selectedTheme}
              />
            );
        }
      default:
        switch (cm) {
          case 'property':
            return (
              <>
                <div className="  w-[100%] ">
                  <div
                    className="  mt-[0.85vh] max-h-[78vh] w-[100%]
overflow-y-scroll rounded-sm  px-[0.85vw] py-[1vh] pb-[1.85vh] "
                    style={{
                      backgroundColor: selectedTheme?.bg,
                    }}
                  >
                    <p
                      className="text-[0.72vw] font-[400] "
                      style={{
                        color: `${selectedTheme?.text}`,
                      }}
                    >
                      Node Information
                    </p>
                    <div className={``}>
                      <div className="w-[100%] pt-[1vh]">
                        <div
                          className="flex w-[100%] flex-col rounded-md px-[0.55vw] py-[0.85vh] "
                          style={{
                            backgroundColor: `${selectedTheme?.bgCard}`,
                          }}
                        >
                          <h1
                            className={`${'mb-1 text-[0.62vw]  font-bold '} cursor-pointer `}
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            Node Type :
                          </h1>

                          <React.Fragment>
                            {sideBarData.type ? (
                              <span
                                className="block w-[98%] overflow-hidden text-ellipsis whitespace-nowrap"
                                style={{
                                  fontSize: '0.62vw',
                                  fontWeight: 500,
                                  lineHeight: '2.22vh',
                                  color: `${selectedTheme?.text}`,
                                }}
                              >
                                {sideBarData.type}
                              </span>
                            ) : (
                              <span
                                className="block w-[98%] whitespace-nowrap text-black/80 dark:text-[#F4F4F5]"
                                style={{
                                  fontSize: '0.62vw',
                                  fontWeight: 500,
                                  lineHeight: '2.22vh',
                                }}
                              >
                                There is no data on this field.
                              </span>
                            )}
                          </React.Fragment>
                        </div>
                      </div>
                    </div>

                    <NodeInfoSidebarNodeInformation
                      sideBarData={sideBarData}
                      currentDrawing={currentDrawing}
                      handleNames={handleNames}
                      darkMode={darkMode}
                      changeProperty={changeProperty}
                      selectedIPC={selectedIPC}
                      handleIPCselection={handleIPCselection}
                      err={err}
                      selectedTheme={selectedTheme}
                    />
                  </div>
                </div>

                {sideBarData && currentDrawing === 'PF-PFD' && (
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
                )}
              </>
            );
          default:
            return (
              <RenderJson
                json={json[cm]}
                setJson={setJson}
                nodedata={sideBarData}
                cm={cm}
                updatedNodeConfig={updatedNodeConfig}
                selectedTheme={selectedTheme}
              />
            );
        }
    }
  };

  const handleADlag = (e) => {
    try {
      const selectedItems = Array.from(e);
      const lastSelectedItem = selectedItems[selectedItems.length - 1];
      const firstSelectedItem = selectedItems[0];
      const filterItems = selectedItems.filter((item) => item === '*');

      if (
        lastSelectedItem === '*' ||
        firstSelectedItem === '*' ||
        filterItems.includes('*')
      ) {
        setActionDenied(['*']);
      } else if (
        selectedItems.length == items.length - 1 &&
        !selectedItems.includes('*')
      ) {
        setActionDenied(['*']);
      } else {
        setActionDenied(selectedItems);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    if (
      SIFlag.length > 0 &&
      actionAllowed.length > 0 &&
      actionDenied.length > 0
    ) {
      const newData = {
        SIFlag,
        actionAllowed,
        actionDenied,
      };

      if (newData) {
        changedatavalues(newData);
      }
    } else {
      alert('Please select all the fields');
    }
  };

  return (
    <div className="flex h-[90%] w-[100%]  flex-col ">
      <div className=" w-[100%] items-center justify-center bg-transparent">
        <div className="h-[90vh]   w-[100%]  overflow-hidden px-[0.5vw] py-1">
          {currentDrawing && nodeInfoTabs && nodeInfoTabs[currentDrawing] && (
            <NodeInfoSidebarTabs
              nodeInfoTabs={nodeInfoTabs}
              currentDrawing={currentDrawing}
              activeTab={activeTab}
              sideBarData={sideBarData}
              contextValue={rendervalue}
              handleContextMenu={handleContextMenu}
              handleOpen={handleOpen}
              handleOpenModal={handleOpenModal}
              setFiles={setFiles}
              setJson={setJson}
              contextMenuVisible={contextMenuVisible}
              contextMenuPosition={contextMenuPosition}
              handleRenders={handleRenders}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewNodeInfoSidebar;
