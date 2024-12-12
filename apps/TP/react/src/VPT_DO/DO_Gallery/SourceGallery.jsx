/* eslint-disable */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Breadcrumb, Breadcrumbs, Header, Link } from 'react-aria-components';
import { Panel } from 'reactflow';
import {
  Close,
  Connect,
  Data,
  LogicCenterSVG,
  NavbarBackward,
  Wire,
} from '../../SVG_Application';
import TorusButton from '../../torusComponents/TorusButton';

import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';
import { TorusModellerContext } from '../../Layout';

import { IoIosAdd, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import CatalogAccordian from '../../CatalogAccordian';
import TorusDialog from '../../torusComponents/TorusDialog';
import TorusDropDown from '../../torusComponents/TorusDropDown';
import TorusSearch from '../../torusComponents/TorusSearch';

import { IoCloseOutline } from 'react-icons/io5';
import {
  artifactList,
  getAllCatalogWithArtifactGroup,
} from '../../commonComponents/api/fabricsApi';

import { toast } from 'react-toastify';
import TorusToast from '../../torusComponents/TorusToaster/TorusToast';
import { OrchestratorContext } from '../App';
import SourceGalleryDropDown from './SourceGalleryDropDown';
import TorusTab from '../../torusComponents/TorusTab';

export default function SourceGallery({
  allNodes,
  setAllNodes,
  handleArtifactSelectionLogicCenter,
  setSingleSelectedSource,
  selectedArtifactForLogic,
  setNodes,
  nodes,
  currentArtifact,
  setCurrentArtifact,
}) {
  const {
    source,
    setSource,
    target,
    setTarget,
    setSourceItems,
    setSelectedTarget,
    setTargetItems,
    setEdges,
    selectedSource,
    setSelectedSource,
  } = useContext(OrchestratorContext);
  const {
    selectedFabric: fabric,
    selectedSubFlow,
    setSelectedSubFlow,
    setFromSubFlow,
    client,
    selectedTheme,
    selectedAccntColor,
  } = useContext(TorusModellerContext);
  const [wordLength, setWordLength] = useState(0);

  const [cataLogListWithArtifactGroup, setCataLogListWithArtifactGroup] =
    useState({});
  const [currentSelecedCatalogandGroup, setCurrentSelecedCatalogandGroup] =
    useState({});
  const [currentSelectedSource, setCurrentSelectedSource] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState('');
  const [artifactsList, setArtifactsList] = useState([]);
  const handleCatalogWithArtifactGroup = useCallback(async (fabric, client) => {
    return await getAllCatalogWithArtifactGroup(fabric, client)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
      });
  });
  const [searchedValue, setSearchedValue] = useState('');
  const handleSearchChange = (value) => {
    try {
      setSearchedValue(value);
    } catch (error) {
      console.error(error);
    }
  };
  const filteredArtifactList = useMemo(() => {
    try {
      if (
        artifactsList &&
        Array.isArray(artifactsList) &&
        artifactsList?.length > 0
      ) {
        if (!searchedValue) return artifactsList;
        return artifactsList.filter((item) => {
          return item?.artifact
            ?.toLowerCase()
            .includes(searchedValue.toLowerCase());
        });
      } else return [];
    } catch (error) {
      console.error(error);
    }
  }, [artifactsList, searchedValue]);
  const { darkMode } = useContext(DarkmodeContext);
  const handleArtifactChange = (value) => {
    try {
      handleCatalogWithArtifactGroup(value, client)
        .then((res) => {
          setCataLogListWithArtifactGroup(res);
        })
        .catch((err) => {
          console.error(err);
        });

      setSelectedFabric(value);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (fabric === 'UF-UFW' || fabric === 'UF-UFM') {
  //     handleArtifactChange('DF-DFD', client);
  //   } else if (fabric === 'PF-PFD') {
  //     handleArtifactChange('UF-UFW', client);
  //   }
  // }, [fabric]);

  const handleAccordionContentToggle = async (value) => {
    try {
      if (
        value?.tKey &&
        selectedFabric &&
        value?.catalog &&
        value?.artifactGroup
      ) {
        let res = await artifactList(
          selectedFabric,
          JSON.stringify([
            client,
            value?.tKey,
            selectedFabric,
            value?.catalog,
            value?.artifactGroup,
          ]),
          true,
        )
          .then((res) => res.data)
          .catch((err) => {
            console.error(err);
          });
        setArtifactsList(res);
        setCurrentSelecedCatalogandGroup(value);
      }
    } catch (error) {
      // console.log(error);
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: 'error',
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          title: 'Error',
          text: `Error getting data for ${value?.tKey}`,
          closeButton: false,
        },
      );
    }
  };

  const artiFactSelection = (catalogAndGroup, artifactAndVersion) => {
    try {
      let redisKey =
        'CK:' +
        client +
        ':FNGK:' +
        catalogAndGroup?.tKey +
        ':FNK:' +
        selectedFabric +
        ':CATK:' +
        catalogAndGroup?.catalog +
        ':AFGK:' +
        catalogAndGroup?.artifactGroup +
        ':AFK:' +
        artifactAndVersion?.artifact +
        ':AFVK:' +
        artifactAndVersion?.version;
      console.log(catalogAndGroup, redisKey, 'itt');
      console.log(artifactAndVersion, target, selectedFabric, 'itt-->');

      setCurrentSelectedSource((prev) => {
        let index = prev.findIndex((item) => {
          return item.tKey === redisKey;
        });

        if (
          index === -1 &&
          artifactAndVersion?.version !== undefined &&
          artifactAndVersion?.version !== null &&
          artifactAndVersion?.version !== ''
        ) {
          return [
            ...prev,
            {
              ...catalogAndGroup,
              ...artifactAndVersion,
              fabric: selectedFabric,
              path: redisKey,
            },
          ];
        } else {
          return prev.filter((item) => item.path !== redisKey);
        }
      });
      setSource((prev) => {
        if (!prev) return prev;
        if (!artifactAndVersion) return prev;
        if (redisKey.includes('undefined')) return prev;
        const exists = prev.some((item) => {
          return (
            item.dfdKey === redisKey &&
            item.fabric === selectedFabric &&
            item.dfoType === catalogAndGroup?.artifactGroup &&
            item.dfoName === artifactAndVersion?.artifact
          );
        });

        if (exists) {
          return prev.map((item) => {
            if (
              item.dfdKey === redisKey &&
              item.fabric === selectedFabric &&
              item.dfoType === catalogAndGroup?.artifactGroup &&
              item.dfoName === artifactAndVersion?.artifact
            ) {
              return {
                dfdKey: redisKey,
                fabric: selectedFabric,
                dfoType: catalogAndGroup?.artifactGroup,
                dfoName: artifactAndVersion?.artifact,
              };
            }
            return item;
          });
        } else {
          return [
            ...prev,
            {
              dfdKey: redisKey,
              fabric: selectedFabric,
              dfoType: catalogAndGroup?.artifactGroup,
              dfoName: artifactAndVersion?.artifact,
            },
          ];
        }
      });
      // setSource((prev) => {
      // 	if (!prev) return prev;
      // 	if (!artifactAndVersion) return prev;

      // 	const isSameSource = prev.some(
      // 		(item) =>
      // 			item.dfdKey === redisKey &&
      // 			item.fabric === selectedFabric &&
      // 			item.dfoType === catalogAndGroup?.artifactGroup &&
      // 			item.dfoName === artifactAndVersion?.artifact,
      // 	);

      // 	if (isSameSource) return prev;

      // 	const newSource = {
      // 		dfdKey: redisKey,
      // 		dfokey: '',
      // 		fabric: selectedFabric,
      // 		dfoName: artifactAndVersion?.artifact,
      // 		dfoType: catalogAndGroup?.artifactGroup,
      // 		targetkey: target,
      // 	};

      // 	const uniqueSources = [...prev];
      // 	const existingIndex = uniqueSources.findIndex(
      // 		(item) =>
      // 			item.dfdKey === newSource.dfdKey &&
      // 			item.fabric === newSource.fabric &&
      // 			item.dfoType === newSource.dfoType &&
      // 			item.dfoName === newSource.dfoName,
      // 	);

      // 	if (existingIndex !== -1) {
      // 		uniqueSources[existingIndex] = newSource;
      // 	} else {
      // 		uniqueSources.push(newSource);
      // 	}

      // 	return uniqueSources;
      // });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(source, currentSelectedSource, '<<---source--->>');

  const accordionItems = useMemo(() => {
    return [
      {
        title: 'My Artifacts',
        type: 'categery',
        id: 'AF',
        content: cataLogListWithArtifactGroup?.['AF'] ?? [],
      },
    ];
  }, [cataLogListWithArtifactGroup]);

  const showSelectedVersion = (catalogAndGroup, artifact) => {
    try {
      let redisKey =
        'CK:' +
        client +
        ':FNGK:' +
        catalogAndGroup?.tKey +
        ':FNK:' +
        selectedFabric +
        ':CATK:' +
        catalogAndGroup?.catalog +
        ':AFGK:' +
        catalogAndGroup?.artifactGroup +
        ':AFK:' +
        artifact;

      let item = currentSelectedSource.filter((item) => {
        return (
          item?.path.startsWith(redisKey) &&
          item.fabric === selectedFabric &&
          item.artifact === artifact
        );
      });

      if (item && item.length > 0) {
        let versionSet = new Set([]);
        item.forEach((item) => {
          versionSet.add(item.version);
        });
        return versionSet;
      }
      {
        return new Set(['v']);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirm = (currentSource, close) => {
    try {
      setSelectedSource((prev) => {
        const uniqueCurrentSource = [
          ...new Map(currentSource.map((item) => [item.path, item])).values(),
        ].filter((item) => item.version !== undefined);
        const mergedSource = [
          ...new Map(
            [...prev, ...uniqueCurrentSource].map((item) => [item.path, item]),
          ).values(),
        ];
        console.log(mergedSource, 'mergedSource');
        return mergedSource;
      });

      close();
      setCurrentSelectedSource([]);
      setCurrentSelecedCatalogandGroup({});
      setArtifactsList([]);
    } catch (error) {
      console.log(error);
    }
  };

  // const resetMappedData = () => {
  // if(selectedSubFlow!=="DO"){

  // const emptyValues = Object.keys(mappedData).reduce((acc, key) => {
  // acc[key] = Array.isArray(mappedData[key]) ? [] : {};
  // return acc;
  // }, {});
  // setMappedData(emptyValues);
  // }
  // };
  console.log(selectedSource, source, 'sc');

  const fabricsTabList = useMemo(() => {
    if (fabric === 'PF-PFD') {
      return [
        {
          id: 'UF-UFW',
          content: ({ isSelected }) => (
            <div
              className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? 'bg-[#F4F5FA] dark:bg-[#252525]' : ''} `}
            >
              <Data
                className={'h-[1.25vw] w-[1.25vw]'}
                strokeColor={!isSelected ? '#A59E92' : '#000000'}
              />
            </div>
          ),
        },

        {
          id: 'UF-UFM',
          content: ({ isSelected }) => (
            <div
              className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? 'bg-[#F4F5FA] dark:bg-[#252525]' : ''} `}
            >
              <Wire
                className={'h-[1.25vw] w-[1.25vw]'}
                strokeColor={!isSelected ? '#A59E92' : '#000000'}
              />
            </div>
          ),
        },
        {
          id: 'UF-UFD',
          content: ({ isSelected }) => (
            <div
              className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? 'bg-[#F4F5FA] dark:bg-[#252525]' : ''} `}
            >
              <Wire
                className={'h-[1.25vw] w-[1.25vw]'}
                strokeColor={!isSelected ? '#A59E92' : '#000000'}
              />
            </div>
          ),
        },
      ];
    }
    if (fabric === 'UF-UFW' || fabric === 'UF-UFM' || fabric === 'UF-UFD') {
      return [
        {
          id: 'DF-DFD',
          content: ({ isSelected }) => (
            <div
              className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? 'bg-[#F4F5FA] dark:bg-[#252525]' : ''} `}
            >
              <Data
                className={'h-[1.25vw] w-[1.25vw]'}
                strokeColor={!isSelected ? '#A59E92' : '#000000'}
              />
            </div>
          ),
        },
      ];
    }
  }, [fabric]);

  return (
    <Panel
      style={{
        pointerEvents: 'all',
        backgroundColor: `${selectedTheme?.bg}`,
        border: `0.3px solid ${selectedTheme && selectedTheme?.border}`,
      }}
      className={`h-[90vh] w-[12%] rounded-[0.5vw] border`}
    >
      <Header
        className={`font-inter border border-b  pb-2 pl-0 pr-2 pt-2 text-[0.83vw] font-semibold leading-[2.22vh] tracking-normal transition-opacity duration-1000 ease-in-out`}
        style={{
          backgroundColor: `transparent`,
          borderColor: `${selectedTheme?.['border']}`,
          borderTop: `0`,
          borderLeft: `0`,
          borderRight: `0`,
        }}
      >
        <div className="flex items-center">
          <button
            onClick={() => {
              setSelectedTarget({});
              setTarget([' ']);
              setTargetItems([]);
              setSourceItems([]);
              setNodes((prev) =>
                prev.filter((node) => node.type !== 'customSourceItems'),
              );
              setSelectedSource([]);
              // resetMappedData();
              setNodes((prev) =>
                prev.filter((node) => node.type !== 'customTargetItems'),
              );
              setEdges([]);
              setAllNodes((prev) => {
                if (!prev) return {};
                let data = {};
                Object.keys(prev).forEach((key) => {
                  if (prev[key].type !== 'customTargetItems') {
                    data = {
                      ...data,
                      [key]: prev[key],
                    };
                  }
                });
                return data;
              });
              setSelectedSubFlow(null);
              setFromSubFlow(true);
            }}
          >
            <NavbarBackward
              className={'h-[1.25vw] w-[2.31vw] cursor-pointer'}
              stroke={selectedTheme && selectedTheme?.['textOpacity/50']}
            />
          </button>
          <span
            style={{
              color: `${selectedTheme?.['textOpacity/50']}`,
            }}
          >
            Source
          </span>
        </div>
      </Header>
      <div
        style={{ pointerEvents: 'all', zIndex: 10 }}
        className="flex h-[94%] w-full flex-col p-2  "
      >
        {/* <div className=" w-5/12 border-r border-slate-300 p-2 dark:border-[#212121]"> */}
        <DisplaySource
          handleArtifactSelectionLogicCenter={
            handleArtifactSelectionLogicCenter
          }
          selectedArtifactForLogic={selectedArtifactForLogic}
          allNodes={allNodes}
          setAllNodes={setAllNodes}
          setSingleSelectedSource={setSingleSelectedSource}
          setNodes={setNodes}
          nodes={nodes}
          currentArtifact={currentArtifact}
          setCurrentArtifact={setCurrentArtifact}
          fabric={fabric}
        />

        {selectedSubFlow === 'DO' ? (
          ''
        ) : (
          <div
            className=" flex h-[6.5vh]  items-center justify-center border border-dashed px-2 py-2"
            style={{
              borderColor: `${selectedTheme?.['textOpacity/50']}`,
            }}
          >
            <span className="flex  justify-center ">
              <TorusDialog
                key={'AddSource'}
                triggerElement={
                  <TorusButton
                    size={'md'}
                    radius={'lg'}
                    isIconOnly={true}
                    height={'md'}
                    Children={
                      <IoIosAdd color={`${selectedTheme?.text}`} size={18} />
                    }
                    fontStyle={'text-sm font-medium text-[#FFFFFF]'}
                  />
                }
                classNames={{
                  modalOverlayClassName:
                    ' pt-[4.5%] items-start focus:outline-none focus:ring-0 focus:border-0',
                  modalClassName:
                    ' h-[65.27vh]  w-[35vw] flex  justify-center items-center ',
                  dialogClassName:
                    ' w-full h-full   rounded-lg flex-col bg-white focus:outline-none focus:ring-0 focus:border-0',
                }}
                title={'Add'}
                message={'Edit'}
              >
                {({ close }) => (
                  <div
                    className={` flex h-full w-full flex-col justify-between rounded-lg  focus:border-transparent focus:outline-transparent focus:ring-transparent  `}
                    style={{
                      backgroundColor: `${selectedTheme?.bg}`,
                      borderColor: `${selectedTheme?.border}`,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    <div
                      className={`flex h-[10%] w-[100%] flex-row  p-2`}
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: `${selectedTheme?.border}`,
                        borderBottomWidth: '1px',
                        borderBottomStyle: 'solid',
                      }}
                    >
                      <div className="flex  items-center justify-start">
                        <p
                          className="px-2 text-start text-[12px] font-semibold"
                          style={{
                            color: `${selectedTheme?.['textOpacity/50']}`,
                          }}
                        >
                          Library
                        </p>
                      </div>
                      <div className="flex w-full items-center justify-center">
                        <div className="flex w-[21.56vw] items-center justify-center">
                          <TorusSearch
                            height="sm"
                            placeholder="Search"
                            radius="sm"
                            textStyle={`text-[${selectedTheme?.text}]  text-[0.83vw] font-normal leading-[2.22vh] tracking-normal pl-[0.5vw]`}
                            borderColor={`${selectedTheme?.border}`}
                            bgColor={`${selectedTheme?.bgCard}`}
                            strokeColor={`${selectedTheme?.text}`}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </div>
                      <div className="flex  flex-row  items-center justify-end gap-2 ">
                        <span
                          className="flex cursor-pointer items-center justify-center rounded-md  transition-all duration-200  "
                          onClick={() => {
                            close();
                            setCurrentSelectedSource([]);
                            setCurrentSelecedCatalogandGroup({});
                            setArtifactsList([]);
                          }}
                        >
                          <IoCloseOutline
                            size={18}
                            color={`${selectedTheme?.['textOpacity/50']}`}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="flex h-[52.03vh] flex-row justify-center">
                      <div className="h-full  w-[3.33vw] ">
                        <div className="flex h-[97%] w-[97%] flex-col items-center justify-start gap-1">
                          <div className="flex h-full w-[100%] flex-col items-center  justify-start  pt-1 ">
                            <TorusTab
                              defaultSelectedKey={selectedFabric}
                              key="TorusTab"
                              orientation="vertical"
                              classNames={{
                                tabs: 'cursor-pointer ',
                                tabList:
                                  'w-full h-[100%]  flex justify-center items-center gap-[0.85vh] transition-all duration-200',
                                tab: `h-full w-full flex justify-center items-center torus-pressed:outline-none torus-focus:outline-none `,
                              }}
                              tabs={fabricsTabList}
                              onSelectionChange={handleArtifactChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex h-full w-full items-center justify-center  px-[1.25vw]">
                        <div
                          className="flex h-full w-1/3 flex-col items-start justify-start
                             gap-1 border-r  dark:border-[#212121]"
                          style={{
                            borderColor: `${selectedTheme?.border}`,
                          }}
                        >
                          <CatalogAccordian
                            items={accordionItems}
                            onSelectionChange={(data) => {
                              handleAccordionContentToggle(data);
                            }}
                          />
                        </div>

                        <div className="flex h-[51.5vh] w-2/3 scroll-m-1  flex-col items-center justify-center gap-1 px-[1.55vh] pt-[0.85vh]">
                          <div className="flex h-full w-full flex-col items-center justify-center transition-all duration-300 ">
                            <div
                              className={` flex h-[100%] w-full flex-col items-center justify-start overflow-y-scroll scroll-smooth scrollbar-default `}
                            >
                              {filteredArtifactList &&
                              filteredArtifactList.length > 0 ? (
                                <>
                                  {filteredArtifactList.map((obj, index) => {
                                    return (
                                      <div
                                        className={`flex justify-between h-[${filteredArtifactList.length / 100}%] w-full items-center gap-[0.25vw] py-[0.5vh]`}
                                      >
                                        <div
                                          className={`
                                          ${
                                            currentSelectedSource &&
                                            currentSelectedSource.length > 0
                                              ? currentSelectedSource.findIndex(
                                                  (item) =>
                                                    item.artifact ===
                                                      obj?.artifact &&
                                                    currentSelecedCatalogandGroup.artifactGroup ===
                                                      item.artifactGroup,
                                                ) > -1
                                                ? 'border'
                                                : ''
                                              : ''
                                          } 
                                        flex  h-[3.14vh] w-[15.10vw]  flex-row items-center justify-between rounded px-[0.5vw] py-[0.5vh]
                                        `}
                                          style={{
                                            backgroundColor: `${
                                              selectedTheme &&
                                              selectedTheme?.bgCard
                                            }`,
                                            color: `${
                                              selectedTheme &&
                                              selectedTheme?.['textOpacity/50']
                                            }`,
                                            borderColor: `${
                                              selectedAccntColor
                                            }50`,
                                          }}
                                        >
                                          <>
                                            <div className="flex h-full w-[80%] flex-row items-center justify-start">
                                              <div className="flex h-full w-full items-center justify-start truncate  text-[0.72vw] font-medium ">
                                                {obj?.artifact}
                                              </div>
                                            </div>
                                          </>
                                        </div>
                                        <div className="flex  h-[1.77vw] w-[6vw] items-center justify-end ">
                                          <TorusDropDown
                                            key={index}
                                            title={
                                              <div className="flex w-[100%] items-center justify-between">
                                                <div
                                                  style={{
                                                    color: `${
                                                      currentSelectedSource &&
                                                      currentSelecedCatalogandGroup &&
                                                      currentSelectedSource.length >
                                                        0
                                                        ? `${selectedTheme && selectedTheme?.text}`
                                                        : `${selectedTheme && selectedTheme?.['textOpacity/50']}`
                                                    }`,
                                                  }}
                                                >
                                                  {currentSelectedSource &&
                                                  currentSelectedSource.length >
                                                    0
                                                    ? showSelectedVersion(
                                                        currentSelecedCatalogandGroup,
                                                        obj?.artifact,
                                                      )
                                                    : 'v'}
                                                </div>
                                                <div>
                                                  <IoIosArrowDown
                                                    color={
                                                      selectedTheme[
                                                        'textOpacity/50'
                                                      ]
                                                    }
                                                    size={'0.83vw'}
                                                  />
                                                </div>
                                              </div>
                                            }
                                            listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                                            btncolor={`${selectedTheme?.bgCard}`}
                                            listItemColor={`${selectedTheme && selectedTheme?.text}`}
                                            selectionMode="single"
                                            selected={
                                              currentSelectedSource &&
                                              showSelectedVersion(
                                                currentSelecedCatalogandGroup,
                                                obj?.artifact,
                                              )
                                            }
                                            setSelected={(e) => {
                                              artiFactSelection(
                                                currentSelecedCatalogandGroup,
                                                {
                                                  artifact: obj?.artifact,
                                                  version: Array.from(e)[0],
                                                },
                                              );
                                            }}
                                            items={
                                              obj?.versionList &&
                                              obj?.versionList?.map((item) => ({
                                                label: item,
                                                key: item,
                                              }))
                                            }
                                            classNames={{
                                              buttonClassName: `rounded border-none px-2 border border-pink-600 outline-none  h-[3.14vh] w-[4.27vw] text-[0.72vw] font-medium text-[#101828]   bg-[#F4F5FA] dark:bg-[#0F0F0F] text-start dark:text-white`,
                                              popoverClassName:
                                                'flex item-center justify-center w-[4.27vw] text-[0.72vw]',
                                              listBoxClassName:
                                                'overflow-y-auto bg-white border border-[#F2F4F7] dark:bg-[#0F0F0F] ',
                                              listBoxItemClassName:
                                                'flex  justify-between text-md',
                                            }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : (
                                <div className="flex h-[100%] w-full items-center justify-center text-[12px]">
                                  no artifacts
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex h-[10%] w-full flex-row  border-t p-2 "
                      style={{
                        borderColor: `${selectedTheme?.border}`,
                      }}
                    >
                      <div className="flex w-full items-center justify-end gap-2">
                        <TorusButton
                          onPress={() => {
                            handleConfirm(currentSelectedSource, close);
                          }}
                          buttonClassName={` text-[0.72vw] bg-[#0736C4]  text-white cursor-pointer"  w-[84.67px] h-[29.33px] rounded-md  font-normal  flex justify-center items-center`}
                          Children={'Confirm'}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </TorusDialog>
            </span>
          </div>
        )}
      </div>
    </Panel>
  );
}

const DisplaySource = ({
  allNodes,
  selectedArtifactForLogic,
  setAllNodes,
  setNodes,
  currentArtifact,

  setCurrentArtifact,
  fabric,
  handleArtifactSelectionLogicCenter,
}) => {
  const { selectedTheme, selectedAccntColor, selectedSubFlow } =
    useContext(TorusModellerContext);

  const {
    source,
    selectedSource,
    setSelectedSource,

    setSource,

    nodes,
    mappedData,
    setMappedData,
    edges,
    setEdges,
  } = useContext(OrchestratorContext);

  console.log(currentArtifact, 'cass');
  const handleClose = (path) => {
    console.log(path, source, 'detail');
    try {
      if (mappedData && path) {
        setMappedData((prev) => {
          console.log(prev, 'spdsf');
          return {
            ...prev,
            artifact: {
              ...prev.artifact,
              node: prev?.artifact?.node.map((item) => {
                return {
                  ...item,
                  objElements:
                    item?.objElements &&
                    item?.objElements.map((objElement) => {
                      console.log(objElement, 'objElement0');
                      return {
                        ...objElement,
                        mapper: objElement.mapper
                          ? objElement.mapper.map((mapperItem) => {
                              return {
                                ...mapperItem,
                                sourceKey: mapperItem.sourceKey.filter(
                                  (key) => !key.startsWith(path),
                                ),
                              };
                            })
                          : [],
                      };
                    }),
                };
              }),
            },
          };
        });
      }

      const filteredEdges = edges.filter((edge) => {
        return !edge.sourceHandle.startsWith(path);
      });

      setEdges(filteredEdges);

      const filteredSource = selectedSource.filter(
        (item, index) => item.artifact !== path,
      );
      const filterSource = source.filter((item, index) => item.dfdKey !== path);
      console.log(filterSource, 'filteredSource');
      setSelectedSource(filteredSource);

      setSource(filterSource);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(selectedSource, 'selectedSource');
  return (
    <div className="justify-space-evenly z-30  flex max-h-[90%] w-full    flex-col items-center gap-[0.25vh] overflow-scroll scrollbar-hide">
      {selectedSubFlow === 'DO' ? (
        <>
          {selectedSource?.path && (
            <div
              className={`mb-[0.85vh] mt-[0.55vh] flex  w-full flex-col items-start gap-[0.85vh] rounded-md border p-2 duration-100 ease-in-out transition-background `}
              style={{
                backgroundColor: `${
                  selectedSource?.path == selectedArtifactForLogic?.path
                    ? selectedSource?.path == currentArtifact
                      ? `${selectedTheme?.bg}`
                      : `${selectedAccntColor}50`
                    : selectedSource?.path == currentArtifact
                      ? `${selectedTheme?.bg}80`
                      : `${selectedTheme?.bg}80`
                }`,

                borderColor: `${
                  selectedSource?.path == selectedArtifactForLogic?.path
                    ? `${selectedAccntColor}`
                    : selectedSource?.path == currentArtifact
                      ? 'transparent'
                      : `${selectedTheme?.border}`
                }`,
              }}
            >
              {/* DFD DO  */}
              <div className="flex h-[1vh] w-full items-center justify-between">
                <Breadcrumbs isDisabled className="flex flex-row gap-2 text-xs">
                  <Breadcrumb>
                    <Link
                      className="white-space-nowrap flex max-w-12 flex-row items-center justify-center gap-1 truncate text-[0.52vw] font-normal  leading-[2.22vh]"
                      style={{
                        color: `${
                          selectedSource?.path == selectedArtifactForLogic?.path
                            ? selectedSource?.path == currentArtifact
                              ? `${selectedTheme?.text}`
                              : `${selectedTheme?.bg}`
                            : selectedSource?.path == currentArtifact
                              ? `${selectedTheme?.text}`
                              : `${selectedTheme?.text}90`
                        }`,
                      }}
                    >
                      {selectedSource?.catalog}
                      <IoIosArrowForward />
                    </Link>
                  </Breadcrumb>

                  <Breadcrumb>
                    <Link
                      className="white-space-nowrap flex max-w-12 flex-row items-center justify-center gap-1 truncate text-[0.52vw] font-normal  leading-[2.22vh]"
                      style={{
                        color: `${
                          selectedSource?.path == selectedArtifactForLogic?.path
                            ? selectedSource?.path == currentArtifact
                              ? `${selectedTheme?.text}`
                              : `${selectedTheme?.bg}`
                            : selectedSource?.path == currentArtifact
                              ? `${selectedTheme?.text}`
                              : `${selectedTheme?.text}90`
                        }`,
                      }}
                    >
                      {selectedSource?.artifactGroup}
                    </Link>
                  </Breadcrumb>
                </Breadcrumbs>
                <div
                  onClick={() => {
                    if (
                      selectedArtifactForLogic?.path === selectedSource?.path
                    ) {
                      handleArtifactSelectionLogicCenter(null);
                    } else handleArtifactSelectionLogicCenter(selectedSource);
                  }}
                  className="cursor-pointer"
                >
                  <LogicCenterSVG
                    fill={
                      selectedSource?.path == selectedArtifactForLogic?.path
                        ? `${selectedAccntColor}`
                        : `${selectedTheme?.text}80`
                    }
                    size="0.72vw"
                  />
                </div>
              </div>

              <div className="flex h-[3vh] w-[100%] items-center justify-center">
                <span
                  className="w-[85%] truncate text-[0.83vw] font-medium  "
                  style={{
                    color: `${
                      selectedSource?.path == selectedArtifactForLogic?.path
                        ? `${selectedTheme?.bg}80`
                        : selectedSource?.path == currentArtifact
                          ? `${selectedTheme?.text}`
                          : `${selectedTheme?.text}80`
                    }`,
                  }}
                >
                  {selectedSource?.artifact}
                </span>
                <span
                  className="flex h-[1.85vh] w-[1.25vw] items-center justify-center rounded-lg px-1 text-[0.52vw] font-medium  leading-[2.22vh] text-white"
                  style={{
                    backgroundColor: `${
                      selectedSource?.path == currentArtifact
                        ? selectedSource?.path == selectedArtifactForLogic?.path
                          ? `${selectedAccntColor}80`
                          : `${selectedAccntColor}50`
                        : selectedSource?.path == selectedArtifactForLogic?.path
                          ? `${selectedAccntColor}80`
                          : `${selectedTheme?.text}20`
                    }`,
                    color: `${
                      selectedSource?.path == selectedArtifactForLogic?.path
                        ? selectedSource?.path == currentArtifact
                          ? `${selectedTheme?.text}`
                          : `${selectedTheme?.bg}`
                        : selectedSource?.path == currentArtifact
                          ? `${selectedTheme?.text}`
                          : `${selectedTheme?.text}90`
                    }`,
                  }}
                >
                  {selectedSource?.version}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {selectedSource &&
            selectedSource.length > 0 &&
            selectedSource.map((item, ind) => {
              return (
                <div
                  className={`mb-[0.85vh] mt-[0.55vh] flex  w-full flex-col items-start gap-[0.85vh] rounded-md border p-2 duration-100 ease-in-out transition-background `}
                  style={{
                    backgroundColor: `${
                      item?.path == currentArtifact
                        ? item?.path == selectedArtifactForLogic?.path
                          ? `${selectedAccntColor}50`
                          : `${selectedAccntColor}50`
                        : item?.path == selectedArtifactForLogic?.path
                          ? `${selectedAccntColor}50`
                          : `${selectedTheme?.bgCard}80`
                    }`,
                    borderColor: `${
                      item?.path == currentArtifact
                        ? item?.path == selectedArtifactForLogic?.path
                          ? `${selectedAccntColor}`
                          : 'transparent'
                        : item?.path == selectedArtifactForLogic?.path
                          ? `${selectedAccntColor}`
                          : `${selectedTheme?.border}`
                    }`,
                  }}
                >
                  {/* UO and UF */}
                  <div className="flex h-[1vh] w-full items-center justify-between">
                    <Breadcrumbs
                      isDisabled
                      className="flex w-[70%] flex-row gap-2 text-xs "
                    >
                      <Breadcrumb>
                        <Link
                          className="white-space-nowrap flex max-w-12 flex-row items-center justify-center gap-1 truncate text-[0.52vw] font-normal  leading-[2.22vh]"
                          style={{
                            color: `${
                              item?.path == selectedArtifactForLogic?.path
                                ? item?.path == currentArtifact
                                  ? `${selectedTheme?.text}`
                                  : `${selectedTheme?.bg}`
                                : item?.path == currentArtifact
                                  ? `${selectedTheme?.text}`
                                  : `${selectedTheme?.text}90`
                            }`,
                          }}
                        >
                          {item?.catalog}
                          <IoIosArrowForward />
                        </Link>
                      </Breadcrumb>

                      <Breadcrumb
                        className="white-space-nowrap flex max-w-10 flex-row items-center justify-start  gap-1 truncate whitespace-nowrap text-[0.52vw] font-normal  leading-[2.22vh] "
                        style={{
                          color: `${
                            item?.path == selectedArtifactForLogic?.path
                              ? item?.path == currentArtifact
                                ? `${selectedTheme?.text}`
                                : `${selectedTheme?.bg}`
                              : item?.path == currentArtifact
                                ? `${selectedTheme?.text}`
                                : `${selectedTheme?.text}90`
                          }`,
                        }}
                      >
                        {item?.artifactGroup}
                      </Breadcrumb>
                    </Breadcrumbs>
                    <div
                      onClick={() => {
                        if (selectedArtifactForLogic?.path === item?.path) {
                          handleArtifactSelectionLogicCenter(null);
                        } else handleArtifactSelectionLogicCenter(item);
                      }}
                      className="cursor-pointer "
                      title="Logic Center"
                    >
                      <LogicCenterSVG
                        fill={
                          item?.path == selectedArtifactForLogic?.path
                            ? `${selectedAccntColor}`
                            : `${selectedTheme?.text}80`
                        }
                        size="0.72vw"
                      />
                    </div>

                    <div title="Delete" className="cursor-pointer">
                      <Close
                        props={{
                          onClick: () => {
                            handleClose(item?.path);

                            const canDelete = source.some((elem) => {
                              if (elem.dfdKey === item?.path) {
                                return true;
                              }
                              return false;
                            });
                            if (canDelete) {
                              setSelectedSource((prev) => {
                                return prev.filter(
                                  (i) => i.path !== item?.path,
                                );
                              });
                            } else {
                              alert('Source Used');
                            }
                            const newAllNodes = { ...allNodes };

                            delete newAllNodes[item?.path];
                            setAllNodes(newAllNodes);
                            setNodes((prev) =>
                              prev.filter(
                                (node) => node.type !== 'customSourceItems',
                              ),
                            );
                            setEdges((prev) => {
                              return prev.filter((edge) => {
                                return !edge.source.includes(item?.path);
                              });
                            });

                            console.log(
                              nodes,
                              edges,
                              item?.path,
                              source,
                              selectedSource,
                              allNodes,
                              'nxxx',
                            );
                          },
                        }}
                        size="0.52vw"
                        stroke={`${
                          item?.path == selectedArtifactForLogic?.path
                            ? item?.path == currentArtifact
                              ? `${selectedTheme?.text}`
                              : `${selectedTheme?.bg}`
                            : item?.path == currentArtifact
                              ? `${selectedTheme?.text}`
                              : `${selectedTheme?.text}90`
                        }`}
                      />
                    </div>
                  </div>

                  <SourceGalleryDropDown
                    path={item?.path}
                    key={ind}
                    allNodes={allNodes}
                    setAllNodes={setAllNodes}
                    currentArtifact={currentArtifact}
                    setCurrentArtifact={setCurrentArtifact}
                    fabric={fabric}
                    pathData={item}
                    ddvalidate={item.path == currentArtifact ? true : false}
                  >
                    <div className="flex w-full  items-center justify-between">
                      <span
                        className="w-[85%] truncate text-start text-[0.83vw] font-medium  leading-[1.7vh] "
                        style={{
                          color: `${
                            item?.path == selectedArtifactForLogic?.path
                              ? item?.path == currentArtifact
                                ? `${selectedTheme?.text}`
                                : `${selectedTheme?.bg}`
                              : item?.path == currentArtifact
                                ? `${selectedTheme?.text}`
                                : `${selectedTheme?.text}90`
                          }`,
                        }}
                      >
                        {item?.artifact}
                      </span>
                      <span
                        className="flex h-[1.85vh] w-[1.25vw] items-center justify-center rounded-lg px-1 text-[0.52vw] font-medium  leading-[2.22vh]"
                        style={{
                          backgroundColor: `${
                            item?.path == currentArtifact
                              ? item?.path == selectedArtifactForLogic?.path
                                ? `${selectedAccntColor}80`
                                : `${selectedAccntColor}50`
                              : item?.path == selectedArtifactForLogic?.path
                                ? `${selectedAccntColor}80`
                                : `${selectedTheme?.text}20`
                          }`,
                          color: `${
                            item?.path == selectedArtifactForLogic?.path
                              ? item?.path == currentArtifact
                                ? `${selectedTheme?.text}`
                                : `${selectedTheme?.bg}`
                              : item?.path == currentArtifact
                                ? `${selectedTheme?.text}`
                                : `${selectedTheme?.text}90`
                          }`,
                        }}
                      >
                        {item?.version}
                      </span>
                    </div>
                  </SourceGalleryDropDown>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};
