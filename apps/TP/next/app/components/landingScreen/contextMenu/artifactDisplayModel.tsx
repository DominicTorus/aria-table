import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input } from "react-aria-components";
import { Breadcrumbs, Breadcrumb, Link } from "react-aria-components";
import { IoCloseOutline } from "react-icons/io5";
import CatalogAccordian from "./catalogAccordian";
import TorusToast from "../../torusComponents/torusToast";
import { toast } from "react-toastify";
import {
  DataFabric,
  MoveToIcon,
  Multiply,
  ProcessFabric,
  SecurityFabric,
  UserFabric,
} from "../../../constants/svgApplications";
import { RiHome5Line } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { AxiosService } from "../../../../lib/utils/axiosService";

import TorusPopOver from "../../torusComponents/torusPopover";
import { getCookie } from "../../../../lib/utils/cookiemgmt";
import { useSelector } from "react-redux";
import { RootState } from "../../../../lib/Store/store";
import DropDown from "../../multiDropdownnew";

const ArtifactDisplayModal = ({
  fabric = "df",
  sourceKeyPrefix,
  version,
  artifactName,
  isArtifactMoved,
  closeParent,
  setIsArtifactMoved,
  setArtifactList,
  getArtifact
}: any) => {
  const [projectCollectionName, setProjectCollectionName] = useState(null);
  const [artifactCollectionName, setArtifactCollectionName] = useState(null);
  const [newArtifactValue, setNewArtifactValue] = useState("Untitled 1");
  const [isLoading, setIsLoading] = useState(false);
  const [newArtifactNameValidation, setNewArtifactNameValidation] =
    useState(false);
  const [newArtifact, setNewArtifact] = useState(false);
  const [selectedTkey, setSelectedTkey] = useState("AFR");
  const [selectedArtifactGroup, setSelectedArtifactGroup] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [wordLength, setWordLength] = useState(0);
  const [artifactsList, setArtifactsList] = useState([]);
  const [search, setSearch] = useState("");
  const [inputchange, setInputchange] = useState<null | any>(null);
  const [selectedArtifact, setSelectedArtifact] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const torusTheme = useSelector((state: RootState) => state.main.testTheme)
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [cataLogListWithArtifactGroup, setCataLogListWithArtifactGroup] =
    useState({
      AF: [],
      AFR: [],
      TFRK: [],
    });
  const client = getCookie('tp_cc')
  const accentColor = useSelector((state: RootState) => state.main.accentColor)
  const locale = useSelector((state: RootState) => state.main.locale)

  const accordionItems = useMemo(() => {
    return [
      {
        title: "My Artifacts",
        type: "categery",
        id: "AF",
        content: cataLogListWithArtifactGroup?.["AF"] ?? [],
      },
      {
        title: "Shared with me",
        type: "categery",
        id: "TFRK",
        content: cataLogListWithArtifactGroup?.["TFRK"] ?? [],
      },
      {
        title: "Purchased",
        type: "categery",
        id: "AFR",
        content: cataLogListWithArtifactGroup?.["AFR"] ?? [],
      },
    ];
  }, [cataLogListWithArtifactGroup]);

  const getAllCatalogWithArtifactGroup = async (fabric: string) => {
    try {
      const BASE_URL = `http://localhost:3002/tm/catkwithafgk`;
      let res = await fetch(`${BASE_URL}/?fabric=${fabric}&clientCode=${client}`, {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleCatalogWithArtifactGroup = useCallback(async (fabric: string) => {
  //   return await getAllCatalogWithArtifactGroup(fabric).then((res) => res.data);
  // }, []);

  // useEffect(() => {
  //   handleCatalogWithArtifactGroup(fabric.toUpperCase()).then((data) => {
  //     setCataLogListWithArtifactGroup(data);
  //   });
  // }, []);

  const handleCatalogWithArtifactGroup = useCallback(async (fabric: string) => {
    return await getAllCatalogWithArtifactGroup(fabric).then((res) => {
      if (res && res.data) {
        return res.data;
      } else {
        console.error("Response is undefined or does not contain 'data'", res);
        return [];
      }
    });
  }, []);

  useEffect(() => {
    handleCatalogWithArtifactGroup(fabric.toUpperCase())
      .then((data) => {
        setCataLogListWithArtifactGroup(data);
      })
      .catch((error) => {
        console.error("Error fetching catalog with artifact group", error);
      });
  }, []);

  const artifactList = async (
    tKey: string,
    client: string,
    project: string,
    fabrics: string,
    saveKey: string,
    wantVersionList = false
  ) => {
    try {
      const BASE_URL = `http://localhost:3002/modeller`;
      const response = await fetch(
        `${BASE_URL}/${wantVersionList ? "afkwithafvk" : "afk"
        }?redisKey=${saveKey}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      // toast.dismiss(loadingToastId);
      if (response.ok && data) {
        return data;
      } else {
        //throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleIntialLoad = async (
    selectedTkey: string,
    client: string,
    selectedFabric: string,
    applications: string,
    selectedArtifactGroup: string
  ) => {
    try {
      const response = await artifactList(
        selectedTkey,
        client,
        applications,
        selectedFabric,
        JSON.stringify([
          client,
          selectedTkey,
          selectedFabric.toUpperCase(),
          applications,
          selectedArtifactGroup,
        ]),
        true
      );
      if (response && response?.status === 200) {
        setArtifactsList(response.data);
      }
    } catch (error) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `Cannot get artifacts details`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleApplicationName = async (item: any) => {
    try {
      setSelectedArtifact("");
      setSelectedVersion("");
      setSelectedTkey(item?.tKey);
      setSelectedProject(item?.catalog);
      setSelectedArtifactGroup(item?.artifactGroup);
      handleIntialLoad(
        item?.tKey,
        client,
        fabric,
        item?.catalog,
        item?.artifactGroup
      ).catch((err: any) => {
        throw err;
      });
    } catch (err) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `Cannot set selected Application`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleAccordionContentToggle = (item: any) => {
    // if (selectedVersion) handleArtifactLock(false);
    handleApplicationName(item);
    setProjectCollectionName(item);
    setArtifactCollectionName(null);
  };

  const handleMoveArtifact = async () => {
    try {
      const res = await AxiosService.post(`/api/transferData`, {
        "sourceKey": sourceKeyPrefix,
        "destinationKey": `CK:${client}:FNGK:AF:FNK:${fabric.toUpperCase()}:CATK:${selectedProject}:AFGK:${selectedArtifactGroup}:AFK:${artifactName}:AFVK:${version}`,
        "action": "MOVE"
      })
      if (res.status === 201) {

        handleIntialLoad(
          selectedTkey,
          client,
          fabric,
          selectedProject,
          selectedArtifactGroup,
        );
        await getArtifact(fabric)
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Artifact moved successfully`,
            closeButton: false,
          } as any
        );
      } else {
        setIsArtifactMoved(true)
        // setArtifactList([])
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error",
            text: `Something went wrong`,
            closeButton: false,
          } as any
        );
      }
    } catch (error) {
      // setIsArtifactMoved(false)
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `Cannot move artifact`,
          closeButton: false,
        } as any
      );
    }
  };

  const fabrics = [
    {
      name: "DF-ERD",
      icon: (
        <DataFabric
          fill={torusTheme["text"]}
          // isOpacityNeeded={fabric == "DF" ? false : true}
          width="1.25vw"
          height="1.25vw"
        />
      ),
    },
    {
      name: "DF-DFD",
      icon: (
        <DataFabric
          fill={torusTheme["text"]}
          // isOpacityNeeded={fabric == "DF" ? false : true}
          width="1.25vw"
          height="1.25vw"
        />
      ),
    },
    {
      name: "UF-UFD",
      icon: (
        <UserFabric
          fill={torusTheme["text"]}
          // isOpacityNeeded={fabric == "UF" ? false : true}
          width="1.25vw"
          height="1.25vw"
        />
      ),
    },
    {
      name: "PF-PFD",
      icon: (
        <ProcessFabric
          fill={torusTheme["text"]}
          // isOpacityNeeded={fabric == "PF" ? false : true}
          width="1.25vw"
          height="1.25vw"
        />
      ),
    },
  ];

  return (
    <div>
      {fabric && (
        <>
          <TorusPopOver
            parentHeading={
              <Button
                style={{ fontSize: `${fontSize * 0.72}vw` }}
                className={"outline-none flex gap-[0.5vw] items-center z-50 w-full hover:p-[0.2vw] rounded"}
                onHoverStart={(e) => e.target.style.backgroundColor = torusTheme["border"]}
                onHoverEnd={(e) => e.target.style.backgroundColor = ""}
              >
                <MoveToIcon fill={torusTheme["text"]} /> {locale["Move to"]}
              </Button>
            }
            dialogClassName={
              "fixed z-[100] top-0 left-0 w-screen h-screen bg-transparent/45 flex items-center justify-center"
            }
          >
            {({ close }: any) => {
              // closeParent();
              return (
                <div
                  style={{ backgroundColor: torusTheme["bg"], borderColor: torusTheme["border"] }}
                  className={`
                  h-[65.50vh]  w-[40vw] flex flex-col justify-between rounded-lg border 2xl:h-[580px] 2xl:w-[700px]`}
                >
                  {fabric !== "events" ? (
                    <>
                      <div style={{ borderColor: torusTheme["border"] }} className="flex h-[5.74vh] w-[100%] flex-row border-b px-[0.58vw] py-[0.58vh]">
                        <div className="flex w-full items-center justify-start">
                          <p style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.87}vw` }} className="px-[0.58VW] text-start  font-semibold">
                            {locale["Library"]}
                          </p>
                        </div>

                        <div className="flex w-full items-center justify-center gap-[0.58vw]">
                          <Input
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.72}vw` }}
                            className={"flex h-[3.148vh] w-[21.56vw] items-center justify-center outline-none px-[0.4vw]  rounded-md border"}
                          />
                        </div>

                        <div className="flex w-full flex-row  items-center justify-end gap-[0.58vw] ">
                          <span
                            className="flex cursor-pointer items-center justify-center rounded-md  transition-all duration-200  "
                            onClick={() => {
                              close();
                              setProjectCollectionName(null);
                              setArtifactCollectionName(null);
                              setNewArtifactValue("");
                              setNewArtifactNameValidation(
                                !newArtifactNameValidation
                              );
                            }}
                          >
                            <Multiply fill={torusTheme["text"]} width="0.72vw" height="0.72vw" />
                          </span>
                        </div>
                      </div>

                      <div className="flex h-[52.03vh] w-full items-center justify-center">
                        {/* <div className="flex h-full w-1/3 flex-col items-center justify-center gap-[0.29vh] border-r border-[#E5E9EB] dark:border-[#212121]"> */}
                        <div className="flex h-[50vh] w-[45%] overflow-y-scroll">
                          <div className="flex flex-col px-[0.58vw] pt-[0.29vh] gap-[1vh] items-center">
                            {fabrics.map((fab) => (
                              <div
                                key={fab.name}
                                style={{ backgroundColor: fabric == fab.name ? torusTheme["bgCard"] : "" }}
                                className={`${fabric == fab.name
                                  ? "rounded-md"
                                  : ""
                                  } px-[0.58vw] py-[0.58vh]`}
                              >
                                {fab.icon}
                              </div>
                            ))}
                          </div>
                          <hr style={{ backgroundColor: torusTheme["borderLine"] }} className="w-[1px] h-[50vh]" />
                          <div>
                            <CatalogAccordian
                              items={accordionItems}
                              onSelectionChange={handleAccordionContentToggle}
                              selectedTkey={selectedTkey}
                              selectedProject={selectedProject}
                              selectedArtifactGroup={selectedArtifactGroup}
                              search={search}
                            />
                          </div>
                        </div>
                        {/* </div> */}

                        <div className="flex h-[100%] w-2/3 scroll-m-1 flex-col items-center justify-center gap-[0.29vh]">
                          {/* Breadcrumbs need to bring again */}
                          <div className="flex h-[2.22vh] w-full items-center justify-start px-[0.58vw] py-[0.58vh]">
                            <Breadcrumbs
                              style={{ fontSize: `${fontSize * 1.02}vw` }}
                              isDisabled
                              className="flex flex-row gap-[0.58vw] "
                            >
                              {client && (
                                <>
                                  <Breadcrumb>
                                    <Link style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className="flex flex-row items-center justify-center gap-[0.29vw] ">
                                      <RiHome5Line size={14} />
                                      {client}
                                      <IoIosArrowForward />
                                    </Link>
                                  </Breadcrumb>

                                  {selectedProject && (
                                    <>
                                      <Breadcrumb>
                                        <Link style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className="flex flex-row items-center justify-center gap-[0.29vw] ">
                                          {selectedProject}

                                          <IoIosArrowForward />
                                        </Link>
                                      </Breadcrumb>

                                      <Breadcrumb>
                                        <Link style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className="flex  flex-row items-center justify-center gap-[0.29vw] ">
                                          {selectedArtifactGroup}

                                          <IoIosArrowForward />
                                        </Link>
                                      </Breadcrumb>

                                      {selectedArtifact && (
                                        <Breadcrumb>
                                          <Link style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className="flex  flex-row items-center justify-center gap-[0.29vw] ">
                                            {selectedArtifact}
                                          </Link>
                                        </Breadcrumb>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </Breadcrumbs>
                          </div>

                          <div className="flex h-[290px] w-full flex-col items-center justify-center  transition-all duration-300 ">
                            {newArtifact === true ? (
                              <div className="flex h-[26%] w-full flex-col items-center justify-center border-b border-t border-[#E5E9EB] px-[0.87vw] py-[0.87vh]">
                                <div className="flex w-full flex-row items-start justify-center gap-[0.58vw] ">
                                  <div className="flex h-full w-[65%] items-center justify-center ">
                                    <Input
                                      defaultValue={newArtifactValue}
                                      placeholder="Enter artifact name"
                                      className="flex h-[29.33px] w-[199.34px] items-center justify-center rounded-md px-[0.58vw] py-[0.58vh] "
                                      style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 1}vw` }}
                                      onChange={(e) => {
                                        setNewArtifactValue(e.target.value);

                                        newArtifactNameValidation &&
                                          setNewArtifactNameValidation(false);
                                      }}
                                    />
                                  </div>

                                  {/* <div className="flex h-full w-[25%] items-center justify-center">
                                    <TorusButton
                                      buttonClassName="text-black w-[80px] dark:text-white bg-[#F4F5FA] hover:bg-[#e1e2e8]  transition-all duration-200 dark:bg-[#0F0F0F]  h-[30px] rounded-md  text-xs  flex justify-center items-center"
                                      onPress={() =>
                                        handleNewArtifactValidation()
                                      }
                                      Children={"Create"}
                                    />
                                  </div> */}
                                </div>

                                {/* <div className="flex h-full w-full items-end justify-center">
                                  <small
                                    className={`${
                                      newArtifactsNameValidation && "text-red-500"
                                    } flex w-[90%] items-center justify-start text-xs`}
                                  >
                                    {newArtifactsNameValidation &&
                                      "Entered artifact name already exists"}
                                  </small>
                                </div> */}
                              </div>
                            ) : null}

                            <div
                              className={`${newArtifact ? "h-[75%]" : "h-[100%]"
                                } flex  w-[100%] flex-col items-center justify-start overflow-y-scroll scroll-smooth scrollbar-default `}
                            >
                              {artifactsList && artifactsList.length > 0 ? (
                                <div className="w-full px-[1.5vh]">
                                  {artifactsList.filter((obj: any) => obj?.artifact.toLowerCase().includes(search.toLowerCase())).map(
                                    (obj: any, index: number) => {
                                      return (
                                        <div
                                          key={index}
                                          className={`flex justify-center h-[${artifactsList.length / 100
                                            }%] w-[100%] items-center`}
                                        >
                                          <div className="flex h-full w-full flex-row items-center justify-center py-[1vh] pr-[0.5vw]">
                                            <>
                                              {inputchange !== index ? (
                                                <div
                                                  // onClick={() =>
                                                  //   handleArtifactsChange(
                                                  //     obj?.artifact
                                                  //   )
                                                  // }
                                                  className="flex  h-[1.77vw] w-[15.10vw] flex-row items-center justify-between rounded-sm p-[0.35rem]"
                                                  style={{ backgroundColor: torusTheme["bgCard"] }}
                                                >
                                                  <div style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.74}vw` }} className="flex h-full w-full items-center justify-start truncate ">
                                                    {obj?.artifact}
                                                  </div>

                                                  <div className="w- flex items-center justify-end gap-[0.58vw]">
                                                    <span
                                                      className="cursor-pointer"
                                                      onClick={() =>
                                                        setInputchange(index)
                                                      }
                                                    >
                                                      {/* <FiEdit2
                                                          className="text-black dark:text-white"
                                                          size={13}
                                                        /> */}
                                                    </span>

                                                    {/* <TorusModel
                                                    body="Are you sure you want to delete Artifact Name?"
                                                    title={
                                                      <div className="flex w-[50%] justify-around gap-[0.525rem]">
                                                        <div className="flex w-[10%] items-center justify-end">
                                                          <BsTrash3
                                                            color="red"
                                                            size={13}
                                                          />
                                                        </div>
  
                                                        <div className="flex w-[90%] items-center justify-start">
                                                          Delete Artifacts
                                                        </div>
                                                      </div>
                                                    }
                                                    triggerButton={
                                                      <BsTrash3
                                                        color="red"
                                                        size={13}
                                                      />
                                                    }
                                                    triggerButtonStyle={
                                                      "cursor-pointer bg=transparent"
                                                    }
                                                    titleStyle="text-red-500"
                                                    confirmButtonStyle={
                                                      "pressed:bg-red-600 cursor-pointer bg-[#F14336] text-white hover:border-red-600"
                                                    }
                                                  /> */}
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="w-full">
                                                  <Input
                                                    style={{ fontSize: `${fontSize * 0.74}vw`, backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] }}
                                                    defaultValue={obj?.artifact}
                                                    placeholder="Enter text"
                                                    className="flex h-[1.77vw] w-[15.10vw] items-center justify-center rounded-md px-[0.58vw] py-[0.58vh]"
                                                  // onKeyDown={(e) => {
                                                  //   if (e.key === "Enter") {
                                                  //     handleArtifactsNameChange(
                                                  //       obj?.artifact,

                                                  //       e.target.value
                                                  //     );
                                                  //   }
                                                  // }}
                                                  // onChange={(e) => {
                                                  //   setInputValue(e.target.value);
                                                  // }}
                                                  />
                                                </div>
                                              )}
                                            </>
                                          </div>

                                          <div style={{ fontSize: `${fontSize * 0.74}vw` }} className="flex h-full w-full items-center justify-center ">

                                            <DropDown
                                              triggerButton={selectedVersion && selectedArtifact === obj?.artifact ? selectedVersion : "Version"}
                                              selectedKeys={selectedVersion && selectedArtifact === obj?.artifact ? new Set([selectedVersion]) : new Set([])}
                                              setSelectedKeys={(e: any) => {

                                                setArtifactCollectionName(obj?.artifact);
                                              }}
                                              items={obj?.versionList?.map((item: any) => item)}



                                              classNames={{
                                                triggerButton: `rounded-sm flex items-center justify-center w-[100%]  h-[1.77vw]    `,
                                                popover: `w-[4.27vw]  border-none`,
                                                listboxItem: ` min-h-[35px]  leading-[1.7vh] text-center`,
                                              }}
                                              styles={{
                                                triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.74}vw` },
                                                popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
                                                listboxItem: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
                                                listbox: { borderColor: torusTheme["border"] },
                                              }}



                                              arrowFill={torusTheme["text"]}
                                            />
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <div style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.87}vw` }} className="flex h-full w-full items-center justify-center ">
                                  No Artifacts
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex h-[7.31vh] w-[100%] flex-row items-center justify-center border-t border-gray-300 px-[0.58vw] py-[0.58vh] dark:border-[#212121] ">
                        <div className="flex w-1/3 items-center justify-start">
                          {/* <TorusButton
                            btncolor={"primary"}
                            onPress={() => {
                              handleNewArtifact(),
                                setNewArtifactNameValidation(false);
                            }}
                            buttonClassName={`${
                              newArtifact
                                ? "bg-red-200 dark:bg-red-500/30 w-[7.70vw] h-[4.07vh] text-red-500 dark:text-red-400"
                                : "text-black dark:text-white bg-[#F4F5FA] dark:bg-[#0F0F0F] w-[98.67px] h-[4.07vh] "
                            }   rounded-md flex justify-center items-center`}
                            Children={
                              <div className="flex h-full w-[100%] flex-row items-center justify-center gap-1">
                                {newArtifact ? (
                                  <></>
                                ) : (
                                  <ArtifactLogo className="stroke-black dark:stroke-white" />
                                )}
  
                                <p className="text-[0.72vw]  ">
                                  {newArtifact ? "Cancel" : "New Artifact"}
                                </p>
                              </div>
                            }
                          /> */}
                        </div>

                        <div className="flex  w-2/3 items-center justify-end gap-[0.58vw]">
                          {/* <TorusButton
                            isDisabled={newArtifact ? true : false}
                            buttonClassName={`${
                              newArtifact
                                ? "bg-[#F4F5FA] text-gray-500 cursor-not-allowed"
                                : "bg-[#4CAF50]/15 text-[#4CAF50] cursor-pointer"
                            }   w-[6.40vw] h-[4.07vh] rounded-md text-[10.66px]  flex justify-center items-center`}
                            onPress={() =>
                              saveProcessFlow(
                                "update",
  
                                selectedProject,
  
                                selectedArtifact,
  
                                selectedVersion,
  
                                getDataFromFabrics
                              )
                            }
                            Children={"Update"}
                          /> */}

                          {/* <TorusButton
                            isDisabled={newArtifact ? true : false}
                            buttonClassName={`${
                              newArtifact
                                ? "bg-[#F4F5FA] text-gray-500 cursor-not-allowed"
                                : "bg-[#0736C4]/15 dark:text-[#3063FF] text-[#0736C4] cursor-pointer"
                            }   w-[5.36vw] h-[4.07vh] rounded-md text-[10.66px]  flex justify-center items-center`}
                            onPress={() => {
                              saveProcessFlow(
                                "create",
  
                                selectedProject,
  
                                selectedArtifact,
  
                                selectedVersion,
  
                                getDataFromFabrics
                              );
                            }}
                            Children={"Save"}
                          /> */}

                          <Button
                            isDisabled={
                              selectedProject && selectedArtifactGroup
                                ? false
                                : true
                            }
                            style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.74}vw` }}
                            className={`outline-none disabled:bg-[rgb(95,130,236)] text-white w-[6.61vw] h-[4.07vh] rounded-md  font-normal  flex justify-center items-center`}
                            onPress={() => {
                              handleMoveArtifact();

                            }}
                          >
                            {locale["Move here"]}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-[12%] w-[100%] flex-row border-b border-[#E5E9EB] px-[0.58vw] py-[0.58vh] dark:border-[#212121]">
                        <div className="flex w-full items-center justify-start">
                          <p style={{ fontSize: `${fontSize * 1.02}vw` }} className="px-[0.58vw] text-start  font-medium text-black dark:text-white">
                            Events
                          </p>
                        </div>

                        <span
                          className="flex h-[27px] w-[27px] cursor-pointer items-center justify-center rounded-md p-[5px] transition-all duration-200 hover:border hover:border-red-400 hover:bg-red-200"
                          onClick={() => {
                            close(), setNewArtifact(false);
                          }}
                        >
                          <IoCloseOutline className="text-black dark:text-white" />
                        </span>
                      </div>

                      {/* <div className="flex h-[87%] w-[100%]">
                        <EventNavbar
                          getDataFromFabrics={getDataFromFabrics}
                          sendDataToFabrics={sendDataToFabrics}
                        />
                      </div> */}
                    </>
                  )}
                </div>
              );
            }}
          </TorusPopOver>

          {/* {selectedVersion && (
              <TorusButton
                onPress={() => {
                  handleArtifactLock(!artifactLockToggle);
                }}
                Children={
                  artifactLockToggle ? (
                    <FaLock size={10} />
                  ) : (
                    <FaLockOpen size={10} />
                  )
                }
                buttonClassName="flex w-[27px] cursor-pointer items-center justify-center rounded-md  p-[5px]"
              />
            )} */}

          {/* {selectedFabric === "events" && (
              <TorusButton
                onPress={() => {
                  selectedFabric === "events" && handleTabChange("UF");
                }}
                Children={<ArtifactOpen />}
                buttonClassName="flex h-[27px] w-[27px] cursor-pointer items-center justify-center rounded-md bg-[#0736C4] p-[5px]"
              />
            )} */}
        </>
      )}
    </div>
  );
};

export default ArtifactDisplayModal;