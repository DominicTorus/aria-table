/* eslint-disable */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import LogicTargetAccordian from './LogicTargetAccordian';

import TorusRadio from '../../torusComponents/TorusRadio';

import TorusModularInput from '../../torusComponents/TorusModularInput';

import { IoFilterOutline } from 'react-icons/io5';

import TorusSearch from '../../torusComponents/TorusSearch';
import SecurityTable from '../DO_Table/securityTable';

import { CiShare1 } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { isLightColor } from '../../asset/themes/useTheme';
import {
  getInitialEvents,
  getSecurityAccessProfile,
} from '../../commonComponents/api/orchestratorApi';
import CodeiumEditors from '../../commonComponents/tabs/Codeium_Editor/CodeiumEditor';
import { Gorule } from '../../commonComponents/tabs/Gorule';
import { TorusModellerContext } from '../../Layout';
import {
  EventsEditor,
  ExpressionEditor,
  FilterIcon,
  NavbarBackward,
  OrchFilterIcon,
  RuleEngine,
} from '../../SVG_Application';
import TorusButton from '../../torusComponents/TorusButton';
import TorusDropDown from '../../torusComponents/TorusDropDown';
import TorusToast from '../../torusComponents/TorusToaster/TorusToast';
import { handlNestedObj } from '../../utils/utils';
import EventsMain from './events/EventsMain';
import TorusMultipleSelect from '../../torusComponents/TorusMultiSelection';
const tab = ['Actions', 'Security'];

const dropdownData = {
  1: [
    {
      key: 'AA',
      label: 'Allow All',
    },
    {
      key: 'BA',
      label: 'Block All',
    },
  ],
  2: [
    {
      key: 'AA',
      label: 'Allow All',
    },
    {
      key: 'BA',
      label: 'Block All',
    },
    {
      key: 'ATO',
      label: 'Allow this only',
    },
    {
      key: 'BTO',
      label: 'Block this only',
    },
  ],
  3: [
    {
      key: 'ATO',
      label: 'Allow this only',
    },
    {
      key: 'BTO',
      label: 'Block this only',
    },
  ],
};
export const LogicCenterContext = React.createContext({});
export const LogicCenter = ({
  subFlow,
  tenant,
  items,
  selectedLogic,
  currentDrawing,
  mappedData,
  setMappedData,
  securityData,
  setSecurityData,
  setShowLogic,
  children,
  client,
  redisKey,
}) => {
  const [controlJson, setControlJson] = useState({});
  const [selectedActionName, setSelectedActionName] = useState(
    [selectedLogic?.artifact] ?? [],
  );

  const [selectedAction, setSelectedAction] = useState();
  const [activeArtifact, setActiveArtifact] = useState('');
  const [securityMockData, setSecurityMockData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('Actions');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTemplateData, setSelectedTemplateData] = useState('');
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  const [searchValue, setSearchValue] = useState('');
  const [navigateTo, setNavigateTo] = useState('logicCenter');
  const [wordLength, setWordLength] = useState(0);
  const [securityColumn, setSecurityColumns] = useState([
    {
      key: 'accessProfile',
      label: 'accessProfile',
    },
    {
      key: 'orgGrp',
      label: 'orgGrp',
    },
    {
      key: 'Number of users',
      label: 'Number of users',
    },
    {
      key: 'Access Rules',
      label: 'Access Rules',
    },
  ]);
  const [visibleColumn, setVisibleColumn] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState([]);
  const handleTargetClick = (target, type) => {
    console.log(target, type, '<---target-->');
    setSelectedAction(type);
    setSelectedActionName(target);
  };

  const handleValue = (props) => {
    console.log(props, mappedData, 'props');
    try {
      if (props.selectedActionName && Array.isArray(props.selectedActionName)) {
        if (props?.type == 'lock') {
          if (props.selectedActionName.length == 1) {
            const timedata =
              mappedData?.artifact?.[props?.tabName]?.[props?.type]?.[
                props.key
              ];
            return timedata;
          }
          if (props.selectedActionName.length == 2) {
            const nodedata = mappedData?.artifact?.node.findIndex((item) => {
              if (item.nodeId === selectedActionName[1]) {
                return item;
              }
            });
            const timedata =
              mappedData?.artifact?.node[nodedata]?.[props?.tabName]?.[
                props?.type
              ]?.[props.key];
            return timedata;
          }

          if (props.selectedActionName.length == 3) {
            const nodedata = mappedData?.artifact?.node.findIndex((item) => {
              if (item.nodeId === selectedActionName[1]) {
                return item;
              }
            });
            const objdata = mappedData?.artifact?.node[
              nodedata
            ]?.objElements.findIndex((item) => {
              if (item.elementId === selectedActionName[2]) {
                return item;
              }
            });
            const timedata =
              mappedData?.artifact?.node[nodedata]?.objElements[objdata]?.[
                props?.tabName
              ]?.[props?.type]?.[props.key];
            return timedata;
          }
        }
        if (props?.type == 'stateTransition') {
          if (props.selectedActionName.length == 1) {
            const timedata =
              mappedData?.artifact?.[props?.tabName]?.[props?.type]?.[
                props.key
              ];
            return timedata;
          }
          if (props.selectedActionName.length == 2) {
            const nodedata = mappedData?.artifact?.node.findIndex((item) => {
              if (item.nodeId === selectedActionName[1]) {
                return item;
              }
            });
            const timedata =
              mappedData?.artifact?.node[nodedata]?.[props?.tabName]?.[
                props?.type
              ]?.[props.key];

            return timedata;
          }

          if (props.selectedActionName.length == 3) {
            const nodedata = mappedData?.artifact?.node.findIndex((item) => {
              if (item.nodeId === selectedActionName[1]) {
                return item;
              }
            });
            const objdata = mappedData?.artifact?.node[
              nodedata
            ]?.objElements.findIndex((item) => {
              if (item.elementId === selectedActionName[2]) {
                return item;
              }
            });
            const timedata =
              mappedData?.artifact?.node[nodedata]?.objElements[objdata]?.[
                props?.tabName
              ]?.[props?.type]?.[props.key];
            return timedata;
          }
        }
        if (props?.type == 'pagination') {
          if (props.selectedActionName.length == 1) {
            const timedata =
              mappedData?.artifact?.[props?.tabName]?.[props?.type]?.[
                props.key
              ];
            return timedata;
          }
          if (props.selectedActionName.length == 2) {
            const nodedata = mappedData?.artifact?.node.findIndex((item) => {
              if (item.nodeId === selectedActionName[1]) {
                return item;
              }
            });
            const timedata =
              mappedData?.artifact?.node[nodedata]?.[props?.tabName]?.[
                props?.type
              ]?.[props.key];

            return timedata;
          }

          if (props.selectedActionName.length == 3) {
            const nodedata = mappedData?.artifact?.node.findIndex((item) => {
              if (item.nodeId === selectedActionName[1]) {
                return item;
              }
            });
            const objdata = mappedData?.artifact?.node[
              nodedata
            ]?.objElements.findIndex((item) => {
              if (item.elementId === selectedActionName[2]) {
                return item;
              }
            });
            const timedata =
              mappedData?.artifact?.node[nodedata]?.objElements[objdata]?.[
                props?.tabName
              ]?.[props?.type]?.[props.key];
            return timedata;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = (props) => {
    console.log(props, 'change');

    setMappedData((prev) => {
      if (selectedActionName && Array.isArray(selectedActionName)) {
        if (selectedActionName.length == 1) {
          return {
            ...prev,
            artifact: {
              ...prev?.artifact,
              [props?.tabName]: {
                ...prev?.artifact?.[props?.tabName],
                [props?.type]: {
                  ...prev?.artifact?.[props?.tabName]?.[props?.type],
                  ...props?.value,
                },
              },
            },
          };
        }
        if (selectedActionName.length == 2) {
          const returnData = prev?.artifact?.node.map((item) => {
            if (item.nodeId === selectedActionName[1]) {
              return {
                ...item,
                [props?.tabName]: {
                  ...item?.[props?.tabName],
                  [props?.type]: {
                    ...item?.[props?.tabName]?.[props?.type],
                    ...props?.value,
                  },
                },
              };
            } else {
              return item;
            }
          });

          return {
            ...prev,
            artifact: {
              ...prev?.artifact,

              node: returnData,
            },
          };
        }
        if (selectedActionName.length == 3) {
          const returnData = prev?.artifact?.node.map((item) => {
            if (item.nodeId === selectedActionName[1]) {
              return {
                ...item,
                objElements: item?.objElements?.map((obj) => {
                  if (obj?.elementId === selectedActionName[2]) {
                    return {
                      ...obj,
                      [props?.tabName]: {
                        ...obj?.[props?.tabName],
                        [props?.type]: {
                          ...obj?.[props?.tabName]?.[props?.type],
                          ...props?.value,
                        },
                      },
                    };
                  }

                  return obj;
                }),
              };
            } else {
              return item;
            }
          });

          return {
            ...prev,
            artifact: {
              ...prev?.artifact,
              node: returnData,
            },
          };
        }
      } else return prev;
    });
  };

  const handleSecurityAccessRule = (result, selectedActionName) => {
    try {
      console.log(result, 'resultinSecurity');
      setSelectedTemplate(result.accessProfile);

      setSecurityData((prev) => {
        if (selectedActionName && Array.isArray(selectedActionName)) {
          const existingTemplate =
            prev?.accessProfile &&
            prev?.accessProfile.find(
              (item) => item.accessProfile === result.accessProfile,
            );
          if (existingTemplate) {
            if (selectedActionName.length == 1) {
              return {
                ...prev,
                accessProfile:
                  prev?.accessProfile &&
                  prev?.accessProfile.map((item) => {
                    if (item.accessProfile === result.accessProfile) {
                      return {
                        ...item,
                        security: {
                          artifact: {
                            ...item?.security?.artifact,
                            SIFlag: {
                              uiType: result.uiType,
                              selectedValue: result.selectedValue,
                              selectionList: result.selectionList,
                            },
                            node:
                              item?.security?.artifact?.node &&
                              item?.security?.artifact?.node.map((node) => {
                                return {
                                  ...node,
                                  SIFlag: {
                                    uiType: result.uiType,
                                    selectedValue: result.selectedValue,
                                    selectionList: ['AA', 'BA', 'ATO', 'BTO'],
                                  },
                                  objElements:
                                    node.objElements &&
                                    node.objElements.map((obj) => {
                                      return {
                                        ...obj,
                                        SIFlag: {
                                          uiType: result.uiType,
                                          selectedValue:
                                            result.selectedValue === 'BA'
                                              ? 'BTO'
                                              : 'ATO',
                                          selectionList: result.selectionList,
                                        },
                                      };
                                    }),
                                };
                              }),
                          },
                        },
                      };
                    }
                    return item;
                  }),
              };
            }

            if (selectedActionName.length == 2) {
              return {
                ...prev,
                accessProfile:
                  prev?.accessProfile &&
                  prev?.accessProfile.map((item) => {
                    if (item.accessProfile == result.accessProfile) {
                      const checknodeindex =
                        item?.security?.artifact?.node &&
                        item?.security?.artifact?.node.findIndex(
                          (node) => node.resourceID == selectedActionName[1],
                        );
                      if (checknodeindex == -1) {
                        item?.security?.artifact?.node.push({
                          resourceID: selectedActionName[1],
                          SIFlag: {
                            uiType: result.uiType,
                            selectedValue: result.selectedValue,
                            selectionList: result.selectionList,
                          },
                          objElements: [],
                        });
                      } else {
                        item.security.artifact.node[checknodeindex].SIFlag = {
                          uiType: result.uiType,
                          selectedValue: result.selectedValue,

                          selectionList: result.selectionList,
                        };
                        if (
                          result.selectedValue === 'BA' ||
                          result.selectedValue === 'BTO'
                        ) {
                          item?.security?.artifact?.node[checknodeindex]
                            ?.objElements &&
                            item?.security?.artifact?.node[
                              checknodeindex
                            ]?.objElements.map((objElement) => {
                              return (objElement.SIFlag = {
                                uiType: result.uiType,
                                selectedValue: 'BTO',
                                selectionList: result.selectionList,
                              });
                            });
                        }
                        if (
                          result.selectedValue === 'AA' ||
                          result.selectedValue === 'ATO'
                        ) {
                          item?.security?.artifact?.node[checknodeindex]
                            .objElements &&
                            item?.security?.artifact?.node[
                              checknodeindex
                            ]?.objElements.map((objElement) => {
                              return (objElement.SIFlag = {
                                uiType: result.uiType,
                                selectedValue: 'ATO',
                                selectionList: result.selectionList,
                              });
                            });
                        }
                      }
                    }

                    return item;
                  }),
              };
            }
            if (selectedActionName.length == 3) {
              return {
                ...prev,
                accessProfile:
                  prev?.accessProfile &&
                  prev?.accessProfile.map((item) => {
                    if (item?.accessProfile === result?.accessProfile) {
                      const checknodeindex =
                        item?.security?.artifact?.node.findIndex(
                          (node) => node.resourceID == selectedActionName[1],
                        );
                      if (checknodeindex != -1) {
                        const checkobjelementindex =
                          item?.security?.artifact?.node[
                            checknodeindex
                          ]?.objElements.findIndex(
                            (objElement) =>
                              objElement.resourceID == selectedActionName[2],
                          );
                        if (checkobjelementindex == -1) {
                          item?.security?.artifact?.node[
                            checknodeindex
                          ]?.objElements.push({
                            resourceID: selectedActionName[2],
                            SIFlag: {
                              uiType: result.uiType,
                              selectedValue: result.selectedValue,
                              selectionList: result.selectionList,
                            },
                          });
                        } else {
                          item.security.artifact.node[
                            checknodeindex
                          ].objElements[checkobjelementindex].SIFlag = {
                            uiType: result.uiType,
                            selectedValue: result.selectedValue,
                            selectionList: result.selectionList,
                          };
                        }
                      }
                    }
                    return item;
                  }),
              };
            }
          } else {
            if (selectedActionName.length == 1) {
              return {
                ...prev,
                accessProfile: [
                  ...prev?.accessProfile,
                  {
                    accessProfile: result.accessProfile,
                    security: {
                      artifact: {
                        resource: selectedActionName[0],
                        SIFlag: {
                          uiType: result.uiType,
                          selectedValue: result.selectedValue,
                          selectionList: result.selectionList,
                        },
                        node: prev?.securityTemplate?.security?.artifact?.node.map(
                          (item) => {
                            return {
                              ...item,
                              SIFlag: {
                                uiType: result.uiType,
                                selectedValue:
                                  result.selectedValue === 'BA' ? 'BA' : 'AA',
                                selectionList:
                                  result.selectedValue === 'BA'
                                    ? ['BTO']
                                    : ['AA', 'BA', 'ATO', 'BTO'],
                              },
                              objElements:
                                item.objElements &&
                                item.objElements.map((objElement) => {
                                  return {
                                    ...objElement,
                                    SIFlag: {
                                      uiType: result.uiType,
                                      selectedValue:
                                        result.selectedValue === 'BA'
                                          ? 'BTO'
                                          : 'ATO',
                                      selectionList:
                                        result.selectedValue === 'BA'
                                          ? ['BTO']
                                          : ['AA', 'BA', 'ATO', 'BTO'],
                                    },
                                  };
                                }),
                            };
                          },
                        ),
                      },
                    },
                  },
                ],
              };
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
                  title: 'warning',
                  text: `please give security for artifact at l1`,
                  closeButton: false,
                },
              );
            }
          }
        }
        return prev;
      });
    } catch (error) {
      console.error(error);
    }
  };

  console.log(mappedData, 'mappedthing');

  const handleSearchChange = (value) => {
    try {
      console.log(value, 'search');
      setSearchValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      if (selectedTemplate) {
        const checkexisitingdata = securityData?.accessProfile?.findIndex(
          (item) => item.accessProfile === selectedTemplate,
        );

        setSelectedTemplateData(checkexisitingdata);
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedTemplate]);

  const handleNagvigateTo = (value) => {
    if (value == 'events') {
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

      let key = selectedLogic?.path.split(':');
      key = key.filter((item) => !otherKey.includes(item));
      getInitialEvents(JSON.stringify(key)).then((res) => {
        if (res?.status == 200) {
          setControlJson(res?.data?.controlJson ?? {});
        }
      });
    }
    setNavigateTo(value);
  };

  const sendIntiateData = useMemo(() => {
    let searchKey = [];
    let searchValue = selectedActionName;
    if (selectedActionName && selectedActionName.length === 3) {
      searchKey = ['name', 'nodeId', 'elementId'];
    }

    if (selectedActionName && selectedActionName.length === 2) {
      searchKey = ['name', 'nodeId'];
    }

    if (selectedActionName && selectedActionName.length === 1) {
      searchKey = ['name'];
    }

    return handlNestedObj(
      'get',
      {},
      navigateTo,
      searchKey,
      searchValue,
      mappedData,
    );
  }, [mappedData, selectedActionName, navigateTo]);

  const sendIntiateDataTestcode = useMemo(() => {
    let searchKey = [];
    let searchValue = selectedActionName;
    if (selectedActionName && selectedActionName.length === 3) {
      searchKey = ['name', 'nodeId', 'elementId'];
    }

    if (selectedActionName && selectedActionName.length === 2) {
      searchKey = ['name', 'nodeId'];
    }

    if (selectedActionName && selectedActionName.length === 1) {
      searchKey = ['name'];
    }

    return handlNestedObj(
      'get',
      {},
      'testCode',
      searchKey,
      searchValue,
      mappedData,
    );
  }, [mappedData, selectedActionName, navigateTo]);

  const handleTabChange = (value) => {
    if (value === 'Security') {
      if (securityMockData.length == 0) {
        getSecurityAccessProfile(tenant).then((res) => {
          if (Array.isArray(res)) {
            setSecurityMockData(res);
          }
        });
      }
    }
    setSelectedItem(value);
  };

  const handleGoToTemplate = () => {
    const url = process.env.REACT_APP_REDIRECT_URL_ASSEMBLER;
    window.location.href = `${url}/settings?tab=st&tenant=${tenant}`;
  };
  const handleColumnSelection = (e) => {
    const rendercol = securityColumn
      ?.filter((item) => !e.includes(item.key))
      .map((item) => item.key);
    setSelectedColumn(e);

    setVisibleColumn(rendercol);
    console.log(e, rendercol, 'colarr');
  };
  console.log(visibleColumn, selectedColumn, 'colarrvisible');
  return (
    <LogicCenterContext.Provider
      value={{
        subFlow,
        controlJson,
        mappedData,
        setMappedData,
        securityData,
        setSecurityData,
        items,
        selectedLogic,
        client,
        redisKey,
        currentDrawing,
      }}
    >
      <div
        className={` 
				h-[100%] w-[99.5%] rounded-lg `}
        style={{
          backgroundColor: `${selectedTheme?.bg}`,
          border: `1px solid ${selectedTheme?.border}`,
        }}
      >
        {navigateTo == 'events' ? (
          <EventsMain
            mappedData={mappedData}
            initial={sendIntiateData}
            actionName={selectedActionName}
            setNavigateTo={handleNagvigateTo}
            currentDrawing={currentDrawing}
            selectedTheme={selectedTheme}
          />
        ) : navigateTo == 'code' ? (
          <CodeiumEditors
            testinitial={sendIntiateDataTestcode}
            initial={sendIntiateData}
            selectedAction={selectedAction}
            selectedActionName={selectedActionName}
            selectedFabric={currentDrawing}
            setNavigateTo={handleNagvigateTo}
          />
        ) : navigateTo == 'rule' ? (
          <Gorule
            initial={sendIntiateData}
            selectedActionName={selectedActionName}
            setNavigateTo={handleNagvigateTo}
          />
        ) : (
          <>
            <div
              className=" flex h-[8%] flex-row  items-center  border-b  py-[1vh] pr-[0.5vw]  font-medium "
              style={{
                borderColor: `${selectedTheme?.border}`,
                color: `${selectedTheme?.text}`,
              }}
            >
              <div className="flex w-full items-center justify-start  text-[1.10vw] ">
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    if (setShowLogic) {
                      setShowLogic();
                    }
                  }}
                >
                  <NavbarBackward
                    className={'h-[1.25vw] w-[2.31vw]'}
                    stroke={`${selectedTheme?.['textOpacity/50']}`}
                  />
                </span>
                <span
                  className="text-[1.10vw] font-bold"
                  style={{
                    color: `${selectedTheme?.text}`,
                  }}
                >
                  Logic Center
                </span>
              </div>
              <div
                className=" flex h-[100%] w-full items-center justify-end  "
                style={{}}
              >
                <div className="flex h-[100%] w-[56%] items-center justify-between ">
                  <nav
                    className="flex h-[4.5vh] w-[21.09vw] items-center gap-2 rounded border  px-[0.2vw] py-[0.1vh]  "
                    style={{
                      borderColor: `${selectedTheme?.border}`,
                      backgroundColor: `${selectedTheme?.bgCard}`,
                      color: `${selectedTheme?.text}`,
                    }}
                  >
                    {tab &&
                      tab.map((item, index) => (
                        <button
                          onClick={() => {
                            handleTabChange(item);
                          }}
                          key={index}
                          role="tab"
                          type="button"
                          className={` h-[4vh] w-[100%] rounded px-[0.5vw] py-[1.25vh] text-[0.65vw] font-medium leading-[1.85vh] ${item == selectedItem ? ' bg-[#FFFFFF]  text-black dark:bg-[#161616]' : ''} `}
                          style={{
                            backgroundColor: `${item == selectedItem ? `${selectedTheme?.bg}` : ''}`,
                            color: `${item == selectedItem ? `${selectedTheme?.text}` : ``}`,
                          }}
                        >
                          {item}
                        </button>
                      ))}
                  </nav>
                  {children && children}
                </div>
              </div>
            </div>

            <div className="  flex h-[91%] w-[100%] rounded-bl-md rounded-br-md  dark:bg-[#161616]">
              <div
                className=" w-[12%] border-r  px-[0.55vw] pt-[1.5vh] dark:border-[#212121]"
                style={{
                  borderColor: `${selectedTheme?.border}`,
                }}
              >
                <LogicTargetAccordian
                  data={mappedData}
                  selectedLogic={selectedLogic}
                  activeArtifact={activeArtifact}
                  setActiveArtifact={setActiveArtifact}
                  handleTargetClick={handleTargetClick}
                  selectedActionName={selectedActionName}
                />
              </div>
              {selectedItem == 'Actions' &&
              selectedActionName &&
              selectedActionName.length > 0 ? (
                <div className=" flex w-[88%] flex-col justify-between ">
                  <div className="">
                    <div
                      className="m-0 w-[100%] border-b"
                      style={{
                        borderColor: `${selectedTheme?.border}`,
                      }}
                    >
                      <div className="flex h-[60%] w-[100%] gap-[1.25vw] pl-[1.25vw] pt-[1.25vh]">
                        <div className="flex h-[100%] w-[26%] flex-col gap-[0.856vh]">
                          <div
                            className=" text-[0.72vw] font-semibold leading-[1.85vh] "
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            Lock
                          </div>
                          <div
                            className=" text-[0.72vw] font-medium "
                            style={{
                              color: `${selectedTheme?.text}70`,
                            }}
                          >
                            Security Level
                          </div>
                        </div>
                        <div className="h-full ">
                          <TorusRadio
                            value={
                              selectedActionName
                                ? handleValue({
                                    selectedActionName: selectedActionName,
                                    tabName: 'action',
                                    type: 'lock',
                                    key: 'lockMode',
                                  })
                                : ''
                            }
                            labelColor={`${selectedTheme?.text}70`}
                            valueColor={`${selectedTheme?.text}`}
                            onChange={(value) => {
                              handleOnChange({
                                tabName: 'action',
                                value: {
                                  lockMode: value ?? '',
                                },
                                type: 'lock',
                              });
                            }}
                            radioGrpClassName="h-full flex flex-col gap-[1.5vh]  "
                            orientation="vertical"
                            size="sm"
                            content={[
                              {
                                label: 'Individual Choice',
                                values: 'Single',
                              },
                              {
                                label: 'Choose Multiple',
                                values: 'Multi',
                              },
                              {
                                label: 'Skip Selection',
                                values: 'None',
                              },
                            ]}
                          />
                        </div>
                      </div>

                      <div className="flex h-[20%] w-[95%] pb-[2.25vh] pl-[1.25vw]">
                        <div className=" flex h-[100%] w-[28%] flex-col gap-[0.856vh]">
                          <div
                            className="   text-[0.72vw] font-semibold leading-[1.85vh]"
                            style={{
                              color: `${selectedTheme?.text}`,
                            }}
                          >
                            TTL(Time to live)
                          </div>
                          <div
                            className="   text-[0.72vw] font-medium leading-[1.85vh] "
                            style={{
                              color: `${selectedTheme?.text}70`,
                            }}
                          >
                            Session Duration
                          </div>
                        </div>

                        <div className="h-[50%] w-[60%]  ">
                          <div>
                            <span
                              className=" text-[0.72vw] font-medium leading-[1.85vh] "
                              style={{
                                color: `${selectedTheme?.text}70`,
                              }}
                            >
                              ms
                            </span>
                          </div>
                          <div className=" w-[13vw]">
                            <TorusModularInput
                              isRequired={true}
                              type="number"
                              value={
                                selectedActionName
                                  ? handleValue({
                                      selectedActionName: selectedActionName,
                                      tabName: 'action',
                                      type: 'lock',
                                      key: 'ttl',
                                    })
                                  : ''
                              }
                              placeholder={'Enter Number'}
                              bgColor={`${selectedTheme?.bgCard}`}
                              textColor={`text-[${selectedTheme?.text}]`}
                              labelColor="text-black dark:text-white/35 "
                              outlineColor="#cbd5e1"
                              labelSize={'text-[0.62vw] pl-[0.25vw]'}
                              radius="sm"
                              size=""
                              isReadOnly={false}
                              isDisabled={false}
                              errorShown={false}
                              isClearable={true}
                              backgroundColor={
                                'bg-gray-300/25 dark:bg-[#0F0F0F]'
                              }
                              onChange={(e) => {
                                handleOnChange({
                                  tabName: 'action',
                                  value: {
                                    ttl: e ?? 0,
                                  },
                                  type: 'lock',
                                });
                              }}
                              // defaultValue={value}
                              textSize={'text-[0.83vw]'}
                              inputClassName={'px-[0.25vw] py-[0.55vh]'}
                              wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="m-0 flex  w-[100%] justify-items-start pl-[1.25vw]">
                      <div className=" mt-3 flex h-[100%]  w-[26.5%] flex-col gap-[0.856vh]   ">
                        <div
                          className="  text-[0.72vw] font-semibold leading-[1.85vh]"
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Pagination
                        </div>
                        <div
                          className=" overflow-y-scroll text-[0.72vw] font-medium leading-[1.85vh]"
                          style={{
                            color: `${selectedTheme?.text}70`,
                          }}
                        >
                          Pagination Type
                        </div>
                      </div>
                      <div className="flex  h-[100%]  w-[62%]">
                        <div className=" flex flex-col gap-2   pb-[0.586vw]  pr-[0.586vw]">
                          <div>
                            <span
                              className="text-[0.72vw] font-medium leading-[1.85vh] "
                              style={{
                                color: `${selectedTheme?.text}70`,
                              }}
                            >
                              Page
                            </span>
                          </div>
                          <div className="h-[2vh] w-[13vw]">
                            <TorusModularInput
                              isRequired={true}
                              type="number"
                              placeholder="Enter Number"
                              bgColor={`${selectedTheme?.bgCard}`}
                              textColor={`text-[${selectedTheme?.text}]`}
                              labelColor="text-black dark:text-white/35 "
                              outlineColor="#cbd5e1"
                              labelSize={'text-[0.62vw] pl-[0.25vw]'}
                              radius="sm"
                              size=""
                              isReadOnly={false}
                              isDisabled={false}
                              errorShown={false}
                              isClearable={true}
                              backgroundColor={
                                'bg-gray-300/25 dark:bg-[#0F0F0F]'
                              }
                              onChange={(e) => {
                                handleOnChange({
                                  tabName: 'action',
                                  value: {
                                    page: e ?? 0,
                                  },
                                  type: 'pagination',
                                });
                              }}
                              value={
                                selectedActionName
                                  ? handleValue({
                                      selectedActionName: selectedActionName,
                                      tabName: 'action',
                                      type: 'pagination',
                                      key: 'page',
                                    })
                                  : ''
                              }
                              textSize={'text-[0.83vw]'}
                              inputClassName={'px-[0.25vw] py-[0.55vh]'}
                              wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                            />
                          </div>
                        </div>

                        <div className=" flex flex-col gap-2   pb-[0.586vw]  pr-[0.586vw]">
                          <div>
                            <span
                              className="text-[0.72vw] font-medium leading-[1.85vh] "
                              style={{
                                color: `${selectedTheme?.text}70`,
                              }}
                            >
                              Count
                            </span>
                          </div>
                          <div className="h-[2vh] w-[13vw]">
                            <TorusModularInput
                              isRequired={true}
                              type="number"
                              placeholder="Enter Number"
                              bgColor={`${selectedTheme?.bgCard}`}
                              textColor={`text-[${selectedTheme?.text}]`}
                              labelColor="text-black dark:text-white/35 "
                              outlineColor="#cbd5e1"
                              labelSize={'text-[0.62vw] pl-[0.25vw]'}
                              radius="sm"
                              size=""
                              isReadOnly={false}
                              isDisabled={false}
                              errorShown={false}
                              isClearable={true}
                              backgroundColor={
                                'bg-gray-300/25 dark:bg-[#0F0F0F]'
                              }
                              onChange={(e) => {
                                handleOnChange({
                                  tabName: 'action',
                                  value: {
                                    count: e ?? 0,
                                  },
                                  type: 'pagination',
                                });
                              }}
                              value={
                                selectedActionName
                                  ? handleValue({
                                      selectedActionName: selectedActionName,
                                      tabName: 'action',
                                      type: 'pagination',
                                      key: 'count',
                                    })
                                  : ''
                              }
                              // defaultValue={value}
                              textSize={'text-[0.83vw]'}
                              inputClassName={'px-[0.25vw] py-[0.55vh]'}
                              wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="m-0 h-[10%]  border-t bg-transparent pl-[1.25vw]"
                    style={{
                      borderColor: `${selectedTheme?.border}`,
                    }}
                  >
                    <div className=" flex h-[100%] items-center justify-start gap-[1vw] bg-transparent">
                      <div
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-[0.85vw] py-[0.85vh] `}
                        onClick={() => {
                          selectedActionName && handleNagvigateTo('events');
                        }}
                        style={{
                          backgroundColor: `${selectedAccntColor}`,
                          color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`,
                          borderColor: `${selectedTheme?.border}`,
                        }}
                      >
                        <span>
                          <EventsEditor
                            className={`h-[1.25vw] w-[1.25vw]`}
                            fill={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
                          />
                        </span>
                        <span
                          className="text-[0.72vw] font-medium leading-[1.85vh]"
                          style={{
                            color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`,
                          }}
                        >
                          Events
                        </span>
                      </div>

                      <div
                        className=" flex cursor-pointer  items-center gap-2 rounded-md  border  px-[0.85vw] py-[0.85vh] "
                        onClick={() => {
                          selectedActionName && handleNagvigateTo('rule');
                        }}
                        style={{
                          backgroundColor: `${selectedAccntColor}`,
                          color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`,
                          borderColor: `${selectedTheme?.border}`,
                        }}
                      >
                        <span>
                          <RuleEngine
                            className={`h-[1.25vw] w-[1.25vw]`}
                            fill={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
                          />
                        </span>
                        <span
                          className="text-[0.72vw] font-medium leading-[1.85vh]"
                          style={{
                            color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`,
                          }}
                        >
                          Rule Engine
                        </span>
                      </div>

                      <div
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-[0.85vw] py-[0.85vh]`}
                        onClick={() => {
                          selectedActionName && handleNagvigateTo('code');
                        }}
                        style={{
                          backgroundColor: `${selectedAccntColor}`,
                          color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`,
                          borderColor: `${selectedTheme?.border}`,
                        }}
                      >
                        <span>
                          <ExpressionEditor
                            className={`h-[1.25vw] w-[1.25vw]`}
                            stroke={`${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`}
                          />
                        </span>
                        <span
                          className="text-[0.72vw] font-medium leading-[1.85vh]"
                          style={{
                            color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000000' : '#ffffff'}`,
                          }}
                        >
                          Expression Editor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedItem == 'Security' &&
                selectedActionName &&
                selectedActionName.length > 0 ? (
                <div className=" h-[90%] w-[87%] ">
                  <div
                    className="m-1 h-[12%] w-[100%]  border-b "
                    style={{
                      borderColor: `${selectedTheme?.border}`,
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-between">
                      <div className="flex h-[100%] w-[40%] flex-col items-center justify-start gap-1 ">
                        <div
                          className="w-full text-start text-[1.25vw] font-bold "
                          style={{
                            color: `${selectedTheme?.text}`,
                          }}
                        >
                          Security
                        </div>
                        <div
                          className="w-full text-start text-[0.83vw] font-medium leading-[1.85vh] "
                          style={{
                            color: `${selectedTheme?.text}80`,
                          }}
                        >
                          Security is a critical part of any application. elit.
                        </div>
                      </div>

                      <div className=" flex h-[100%] w-[60%] items-center justify-end gap-2">
                        <div className="h-[5vh] w-[100%]">
                          <div className="flex h-[100%] w-[100%] items-center justify-end gap-[0.5vw]">
                            <div className="flex h-[3vh] w-[25vw] items-center justify-start">
                              <TorusSearch
                                height={'h-[4.30vh]'}
                                placeholder="Search"
                                radius="md"
                                textStyle={`text-[${selectedTheme?.text}] text-[0.83vw] font-normal leading-[2.22vh] tracking-normal pl-[0.5vw]`}
                                borderColor={`${selectedTheme?.border}`}
                                bgColor={`${selectedTheme?.bgCard}`}
                                strokeColor={`${selectedTheme?.text}`}
                                onChange={(e) => handleSearchChange(e)}
                              />
                            </div>

                            {/* <TorusButton
															buttonClassName="  flex   h-[3.98vh] w-[5vw] items-center justify-center bg-[#F4F5FA] dark:bg-[#0F0F0F] border border-[#00000026]   dark:border-[#212121]  rounded-md"
															Children={
																<div className="flex h-full w-full flex-row  items-center justify-center gap-2">
																	<span>
																		<IoFilterOutline
																			size={14}
																			className="font-bold text-black dark:text-white"
																		/>
																	</span>
																	<p className="text-[0.72vw] font-normal text-black dark:text-white">
																		Filter
																	</p>
																</div>
															}
															// borderColor={"1px solid #00000026"}
														/> */}
                            <div>
                              <TorusDropDown
                                title={
                                  <div className="flex w-[100%] items-center justify-center gap-[0.35vw]  ">
                                    <div className="flex items-center">
                                      <OrchFilterIcon
                                        className={'h-[1.25vw] w-[1.25vw]'}
                                        stroke={`${selectedTheme?.text}`}
                                      />
                                    </div>
                                    <div className="flex items-center">
                                      <p
                                        className="m-0 text-[0.72vw] font-normal leading-[1.85vh] "
                                        style={{
                                          color: `${selectedTheme?.text}`,
                                        }}
                                      >
                                        Filter
                                      </p>
                                    </div>
                                  </div>
                                }
                                items={securityColumn}
                                selectionMode="multiple"
                                selected={selectedColumn}
                                setSelected={(e) => handleColumnSelection(e)}
                                classNames={{
                                  buttonClassName:
                                    '  px-2 rounded-md  border border-[#00000026] flex justify-center items-center  h-[4.15vh] w-[100%] text-[0.72vw] font-medium text-[#101828]   bg-[#F4F5FA] text-start dark:text-white',
                                  popoverClassName:
                                    'flex item-center justify-center w-[14.27vw] text-[0.83vw]',
                                  listBoxClassName:
                                    'overflow-y-auto w-[100%] bg-white border border-[#F2F4F7] dark:border-[#212121] dark:bg-[#0F0F0F] ',
                                  listBoxItemClassName:
                                    'flex w-[100%] items-center  justify-center text-md',
                                }}
                                listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                                btncolor={`${selectedTheme?.bgCard}`}
                                listItemColor={`${selectedTheme && selectedTheme?.text}`}
                              />
                            </div>

                            <TorusButton
                              onPress={handleGoToTemplate}
                              buttonClassName="  dark:text-[#3063FF] text-[#0736C4] cursor-pointer  w-[8.12vw] h-[3.98vh] rounded-md text-[0.83vw]  flex justify-center items-center"
                              Children={
                                <div className="flex flex-row items-center justify-center gap-2">
                                  <p
                                    className="text-[0.72vw] font-normal "
                                    style={{
                                      color: `${selectedAccntColor && selectedAccntColor}`,
                                    }}
                                  >
                                    Go to Template
                                  </p>
                                  <span>
                                    <CiShare1
                                      size={14}
                                      className="font-bold "
                                      color={`${selectedAccntColor && selectedAccntColor}`}
                                    />
                                  </span>
                                </div>
                              }
                              btncolor={`${selectedAccntColor}30`}
                              color={`${selectedAccntColor && selectedAccntColor}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="m-1 flex  h-[95%] w-[100%]  ">
                    <SecurityTable
                      data={securityMockData}
                      visibleColumns={
                        visibleColumn && visibleColumn.length > 0
                          ? visibleColumn
                          : [
                              'accessProfile',
                              'orgGrp',
                              'Number of users',
                              'Access Rules',
                            ]
                      }
                      securityData={securityData}
                      searchValue={searchValue}
                      setSelectedDropDownValue={(
                        result,
                        selectedActionName,
                      ) => {
                        handleSecurityAccessRule(result, selectedActionName);
                      }}
                      selectedActionName={selectedActionName}
                      dropDownDownData={dropdownData[selectedActionName.length]}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex  h-[100%] w-[87%] items-center justify-center">
                  <div className="flex items-center justify-center">
                    please select artifact
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </LogicCenterContext.Provider>
  );
};
