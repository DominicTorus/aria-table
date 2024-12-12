import React, { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { RiBankFill } from "react-icons/ri";
import {
  AppArrow,
  DataFabric,
  HomeSvg,
  LockIcon,
  PlusIcon,
  ProcessFabric,
  ThreeDots,
  UserFabric,
} from "../../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { Breadcrumbs, Breadcrumb } from "react-aria-components";
import { AxiosService } from "../../../lib/utils/axiosService";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";
import { getCookie, getEncodedDetails } from "../../../lib/utils/cookiemgmt";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { TbPinFilled } from "react-icons/tb";
import { calculateRecentlyWorkingDetails, hexWithOpacity } from "../../../lib/utils/utility";
import { useRouter } from "next/navigation";

const Card = ({ searchTerm }: { searchTerm: string }) => {
  const [mappingAppGrp, setMappingAppGrp] = useState<any[]>([]);
  const [selectAppGroup, setSelectAppGroup] = useState("");
  const [selectedApp, setSelectApp] = useState("");
  const [appList, setAppList] = useState<any[]>([]);
  const [artifactList, setArtifactList] = useState<any[]>([]);
  const [wordLength, setWordLength] = useState(0);
  const [watchHistory, setWatchHistory] = useState<{
    t: string;
    ag: string;
    app: string;
  }>({ t: "", ag: "", app: "" });
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(
    tenant || null
  );
  const url = process.env.NEXT_PUBLIC_MODELLER_URL;
  const loginId = getCookie('tp_lid')
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const router = useRouter()
  const locale = useSelector((state: RootState) => state.main.locale);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  useEffect(() => {
    if (tenant) {
      fetchAppGroup(tenant);
    } else {
      fetchAppGroup();
    }
  }, [tenant]);

  const fetchAppGroup = async (tenant?: string) => {
    try {
      const givenTenant = tenant ? tenant : "ABC";
      const res = await AxiosService.get(
        `/api/getappgrouplist?tenant=${givenTenant}`
      );
      if (res.status === 200) {
        if (res.data.filter((ele: any) => ele !== "").length) {
          const result = res.data
            .filter((ele: any) => ele !== "")
            .map((grpData: any, index: number) => ({
              tenant: givenTenant,
              name: grpData,
              icon: <RiBankFill />,
            }));
          setMappingAppGrp(result);
        } else {
          setMappingAppGrp([]);
        }
      }
    } catch (error) {
      console.error("Error fetching app groups:", error);
    }
  };

  const fetchAppList = async (tenant: string, appGroup: string) => {
    try {
      const res = await AxiosService.get(
        `/api/getapplist?tenant=${tenant}&appGroup=${appGroup}`
      );
      if (res.status === 200) {
        setAppList(res.data);
      }
    } catch (error) {
      console.error("Error fetching apps:", error);
    }
  };

  const getArtifactRelatedToBuild = async (app: string) => {
    try {
      setArtifactList([]);
      const res = await AxiosService.post(`/api/getArtifactRelatedToBuild`, {
        tenant: tenant,
        appGrp: selectAppGroup,
        app: app,
      });
      if (res.status === 201) {
        setArtifactList(res.data);
      } else {
        setArtifactList([])
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Occured While Fetching Artifacts";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleCardClick = (item: { tenant: string; name: string }) => {
    setSelectedTenant(item.tenant);
    setSelectAppGroup(item.name);
    setSelectApp("");
    setWatchHistory((prev) => {
      if (prev.t === item.tenant) {
        return prev;
      }
      if (prev.ag === item.name) {
        return prev;
      } else {
        return { t: item.tenant, ag: item.name, app: "" };
      }
    });
    fetchAppList(item.tenant, item.name);
  };

  const handleBreadcrumbClick = (level: string) => {
    if (level === "tenant") {
      setSelectedTenant("");
      setSelectAppGroup("");
      setSelectApp("");
    } else if (level === "appGroup") {
      setSelectApp("");
    }
    // else if (level === "next") {
    //   if (!selectAppGroup) {
    //     setSelectAppGroup("");
    //   } else if (!selectedApp) {
    //     setSelectApp("");
    //   }
    // }
  };

  const handleAppClick = (app: string) => {
    setSelectApp(app);
    setWatchHistory((prev) => ({ ...prev, app: app }));
    getArtifactRelatedToBuild(app);
  };

  const handleNavigateToModeller = (item: any) => {
    const { artifactName, version, fabric, catalog, artifactGrp } = item;
    const enCodedDetails = getEncodedDetails(
      fabric,
      "AF",
      catalog,
      artifactGrp,
      artifactName,
      version,
      tenant
    );
    window.location.href = `${url}?tk=${enCodedDetails}`;
  };

  const filteredAppGroups = mappingAppGrp.filter((ele) =>
    ele.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFabricIcon = (fab: string) => {
    switch (fab) {
      case "df":
        return <DataFabric opacity="1" fill={accentColor} />;
      case "pf":
        return <ProcessFabric opacity="1" fill={accentColor} />;
      case "uf":
        return <UserFabric opacity="1" fill={accentColor} />;
      default:
        return <DataFabric opacity="1" fill={accentColor} />;
    }
  };


  const handleForwardBackward = ({
    type,
  }: {
    type: "forward" | "backward";
  }) => {
    switch (type) {
      case "forward":
        if (watchHistory.app) {
          handleAppClick(watchHistory.app);
        } else if (watchHistory.ag) {
          handleCardClick({ tenant: watchHistory.t, name: watchHistory.ag });
        } else if (watchHistory.t) {
          // setSelectedTenant(watchHistory.t);
          fetchAppList(watchHistory.t, watchHistory.ag);
        }
        break;
      case "backward":
        if (watchHistory.app) {
          setSelectApp("");
        } else if (watchHistory.ag) {
          setSelectApp("");
          setSelectAppGroup("");
        } else if (watchHistory.t) {
          setSelectedTenant("");
          setSelectAppGroup("");
          setSelectApp("");
        }
        break;
      default:
        break;
    }
  };


  return (
    <div style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], borderColor: torusTheme["border"] }} className={`flex flex-col gap-[0.87vw] border px-[0.87vw] py-[1.87vh] w-full h-[59.51vh] rounded-md`}>
      <div className="flex justify-between items-center mb-4">
        <h1 style={{fontSize : `${fontSize * 0.83}vw`}} className="font-semibold leading-[1.13vh]">
          {locale[selectedApp ? "Artifacts" : selectAppGroup ? "Apps" : "AppGroups"]}
        </h1>
        {(!tenant || !filteredAppGroups.length) && (
          <Button
            style={{ backgroundColor: accentColor , fontSize : `${fontSize * 0.72}vw`}}
            onPress={() => router.push('/control-center')}
            className="outline-none p-[0.58vw] leading-[1.04vh] text-white w-[6.71vw] h-[3.98vh] flex items-center gap-[0.29vw] ml-auto rounded-md">
            <PlusIcon fill="white" />
            {locale["App Group"]}
          </Button>
        )}
      </div>

      {!tenant || !filteredAppGroups.length ? (
        <div style={{ color: torusTheme["text"] , fontSize: `${fontSize * 0.93}vw`}} className={`flex justify-center items-center h-full leading-[2.31vh] font-medium`}>
          {locale["you havent created any app groups yet  Start by clicking Add App Group button to create  your first app group"]}
        </div>
      ) : selectAppGroup ? (
        <>
          <div
            className={`${selectAppGroup ? "flex w-full justify-between items-center" : ""}`}
          >
            <Breadcrumbs className="flex gap-[0.29vw] items-center">
              <Breadcrumb className="flex items-center gap-[0.29vw] cursor-pointer">
                <Button
                  onPress={() => handleBreadcrumbClick("tenant")}
                  style={{fontSize : `${fontSize * 0.72}vw`}}
                  className="outline-none text-[#a8a9ae] leading-[1.04vh] "
                >
                  <div className="flex gap-[0.58vw] items-center">
                    <HomeSvg fill={accentColor} /> <span>{selectedTenant}</span>
                  </div>
                </Button>
              </Breadcrumb>

              {selectAppGroup && (
                <Breadcrumb className="flex items-center gap-[0.29vw] cursor-pointer">
                  <Button
                    onPress={() => handleBreadcrumbClick("appGroup")}
                    style={{fontSize : `${fontSize * 0.72}vw`}}
                    className="outline-none leading-[1.04vh] text-[#a8a9ae]"
                  >
                    <div className="flex items-center gap-[0.58vw]">
                      <AppArrow fill={accentColor} />
                      <span>{selectAppGroup.toUpperCase()}</span>
                    </div>
                  </Button>
                </Breadcrumb>
              )}

              {selectedApp && (
                <Breadcrumb className="flex items-center gap-[0.29vw] cursor-pointer">
                  <Button style={{fontSize : `${fontSize * 0.72}vw`}} className="outline-none leading-[1.04vh] text-[#a8a9ae]">
                    <div className="flex items-center gap-[0.58vw]">
                      <AppArrow fill={accentColor} /><span>{selectedApp.toUpperCase()}</span>
                    </div>
                  </Button>
                </Breadcrumb>
              )}
            </Breadcrumbs>
            {selectAppGroup && (
              <div className="flex gap-[0.87vw] self-end ">
                <Button className="outline-none">
                  <GoArrowLeft
                    onClick={() => handleForwardBackward({ type: "backward" })}
                    style={{ color: selectedApp && selectAppGroup ? torusTheme["text"] : torusTheme["textOpacity/35"] }}
                  />
                </Button>
                <Button className="outline-none">
                  <GoArrowRight
                    onClick={() => handleForwardBackward({ type: "forward" })}
                    style={{ color: selectAppGroup && !selectedApp ? torusTheme["text"] : torusTheme["textOpacity/35"] }}
                  />
                </Button>
              </div>
            )}
          </div>
          <div>
            {selectedApp ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-2 h-[44vh] w-full gap-[1.46vw] overflow-y-auto pr-[0.58vw]">
                {artifactList.length !== 0 ? (
                  artifactList.filter(
                    (ele: any) =>
                      ele.artifactName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      ele.catalog.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      ele.artifactGrp.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"] }}
                        className={`w-[15.15vw] h-[9.5vw] border flex flex-col items-center justify-center rounded-md`}
                      >
                        <div className="w-full p-[0.58vw]">
                          <div className="flex w-full justify-between">
                            <div style={{ backgroundColor: hexWithOpacity(accentColor, 0.15) }} className="self-start rounded-md mb-[0.87vw] w-[2.18vw] h-[2.18vw]">
                              <div className="w-full h-full flex items-center justify-center">
                                {getFabricIcon(item.fabric)}
                              </div>
                            </div>
                            <div className="flex items-center gap-[0.29vw] pb-[1.75vw]">
                              {item.isUserPinned ? (
                                <TbPinFilled fill={accentColor} />
                              ) : null}
                              {item.isLocked ? <LockIcon /> : null}
                            </div>
                          </div>
                          <div
                            style={{ color: torusTheme["text"] }}
                            className={`flex w-full items-center justify-between cursor-pointer`}
                          >
                            <h3 style={{fontSize : `${fontSize * 0.83}vw`}} className="leading-[1.7vh] font-semibold whitespace-nowrap">
                              {item.artifactName.charAt(0).toUpperCase() +
                                item.artifactName.slice(1)}
                            </h3>
                            <div style={{ color: torusTheme["textOpacity/35"] , fontSize : `${fontSize * 0.72}vw` }} className={`leading-[1.29vh] pr-[0.58vw] font-medium`}>
                              {item.version}
                            </div>
                          </div>
                          <div
                            className="flex w-full cursor-pointer"
                            onClick={() => handleNavigateToModeller(item)}
                          >
                            <p style={{ color: torusTheme["textOpacity/35"] , fontSize : `${fontSize * 0.58}vw`}} className={`pt-[0.29vw] leading-[1.34vh] font-medium whitespace-nowrap`}>
                              {item.catalog} - {item.artifactGrp}
                            </p>
                          </div>
                        </div>

                        <div style={{ borderColor: torusTheme["border"] }} className={`w-full border-b`}></div>

                        <div className="w-full p-[0.58vw]">
                          <div style={{fontSize : `${fontSize * 0.83}vw`}} className="flex w-full whitespace-nowrap justify-between">
                            <div style={{ color: torusTheme["textOpacity/35"] , fontSize : `${fontSize * 0.55}vw` }} className={`flex flex-col gap-[0.58vh] leading-[1.66vh] font-medium`}>
                              {locale["Last edited"]}{" "}
                              {calculateRecentlyWorkingDetails(item.recentlyWorking, getCookie("cfg_lc") ?? "en-GB")}
                              <span style={{ color: accentColor , fontSize : `${fontSize * 0.62}vw`}} className="leading-[1.66vh] font-medium">
                                {loginId.charAt(0).toUpperCase() + loginId.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div style={{ color: torusTheme["text"] }} className={`w-full h-full flex items-center justify-center`}>{locale["you havent created any app groups yet  Start by clicking Add App Group button to create  your first app group"]}</div>
                )}
              </div>
            ) : (
              <div style={{fontSize : `${fontSize * 0.83}vw`}} className="grid grid-cols-2 grid-rows-5 gap-[0.87vw] rounded-md">
                {appList.map((app, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"] }}
                    className={`flex flex-col p-[0.58vw] border rounded-md`}
                  >
                    <Button
                      className="flex ml-[0.6vw] focus:outline-none"
                      onPress={() => handleAppClick(app)}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex gap-[0.87vw] items-center">
                          <div style={{ color: accentColor, backgroundColor: torusTheme["bg"] }} className={`px-[0.58vw] py-[1.24vh] rounded-md`}>
                            <RiBankFill fill={accentColor} width="0.72vw" height="0.72vw" />
                          </div>
                          <div className="flex flex-col">
                            <h3 style={{fontSize : `${fontSize * 0.83}vw`}} className="rounded-md font-medium">
                              {app}
                            </h3>
                          </div>
                        </div>
                        <div className="mr-[0.58vw]">
                          <ThreeDots fill={torusTheme["text"]} />
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ fontSize : `${fontSize * 0.83}vw`}} className="grid grid-cols-2 pt-[0.87vh] grid-rows-5 gap-[0.87vw] h-[90%] rounded-md">
          {filteredAppGroups.map((item, index) => (
            <div
              key={index}
              style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"] }}
              className={`flex flex-col border justify-center rounded-md`}
            >
              <Button
                className="flex ml-[1.17vw] focus:outline-none"
                onPress={() => handleCardClick(item)}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-[0.87vw] items-center">
                    <div style={{ color: accentColor, backgroundColor: torusTheme["bg"] }} className={`px-[0.58vw] py-[1.24vh] rounded-md`}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <h3 style={{fontSize : `${fontSize * 0.83}vw`}} className="rounded-md font-medium">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <div className="mr-[0.58vw]">
                    <ThreeDots fill={torusTheme["text"]} />
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
