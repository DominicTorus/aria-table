"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Input,
  Modal,
  ModalOverlay,
  Popover,
  Tab,
  TabList,
  Tabs,
} from "react-aria-components";
import { Separator } from "react-aria-components";
import FabricSelector from "./components/Tab";
import MenuItemAccordian from "./components/builderScreen/MenuItemAccordian";
import { AxiosService } from "../lib/utils/axiosService";
import { toast } from "react-toastify";
import DropDown from "./components/multiDropdownnew";
import {
  LogHubIcon,
  AssemblerIcon,
  SearchIcon,
  FilterIcon,
} from "./constants/svgApplications";
import { menuItems, TreeNode } from "./constants/MenuItemTree";
import BuilderTopNav from "./components/builderScreen/BuilderTopNav";
import BuilderSideNav from "./components/builderScreen/BuilderSideNav";
import ProcessLogs from "./components/torusComponents/processLog";
import ExceptionLog from "./components/torusComponents/ExceptionLog";
import Artifactdetails from "./components/landingScreen/artifactdetails";
import ProgressButton from "./components/progressbar";
import TorusToast from "./components/torusComponents/torusToast";
import { useSelector } from "react-redux";
import { RootState } from "../lib/Store/store";
import { hexWithOpacity } from "../lib/utils/utility";
import { getCookie, setCookieIfNotExist } from "../lib/utils/cookiemgmt";
import LogsFilteration from "./components/builderScreen/logsFilteration";
import { useSearchParams } from "next/navigation";

const Builder = () => {
  const [selectedAssemblerButton, setSelectedAssemblerButton] = useState(true);
  const [selectedLogsButton, setSelectedLogsButton] = useState(false);
  const [selectAppGroup, setSelectAppGroup] = useState<string>("");
  const [selectApp, setSelectApp] = useState<string>("");
  const [appGrpList, setAppGrpList] = useState<string[]>([]);
  const [appList, setAppList] = useState<string[]>([]);
  const [menuItemData, setMenuItemData] = useState<TreeNode[]>(menuItems);
  const [versionList, setVersionList] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [logsTabList, setLogTabList] = useState<"exception" | "log" | any>(
    "log"
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [bldcData, setbldcData] = useState<any>({});
  const [users, setUsers] = useState<Set<string>>(new Set([]));
  const [fabrics, setFabrics] = useState<Set<string>>(new Set([]));
  const [logsAppGrp, setLogsAppGrp] = useState<any>([]);
  const [logsApp, setLogsApp] = useState<any>([]);
  const [range, setRange] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const [refetch, setRefetch] = useState(false);
  const searchParams = useSearchParams();

  const suffixes: any = {
    DF: ["DFD", "ERD"],
    UF: ["UFD"],
    PF: ["PFD"],
  };

  const allProcessLogColumns = [
    "artifactName",
    "version",
    "fabric",
    "jobType",
    "status",
    "node",
    "time",
  ];

  const allExceptionLogColumns = [
    "artifactName",
    "version",
    "user",
    "timeStamp",
    "errorCode",
    "errorDescription",
  ];
  const [visibleColumns, setVisibleColumns] =
    useState<any>(allProcessLogColumns);
  const [showNodeData, setShowNodeData] = useState<null | any>(null);
  const [isLoading, setLoading] = useState(true);
  const [wordLength, setWordLength] = useState(0);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const [isRole, setIsRole] = useState<any>(null);
  const token = getCookie("tp_tk");

  const getExceptionLogs = async () => {
    try {
      const res = await AxiosService.get("/api/expLog");
    } catch (error: any) {}
  };
  const getProcessLogs = async () => {
    try {
      const res = await AxiosService.get("/api/prcLog");
    } catch (error: any) {}
  };

  const getAccessRoles = async () => {
    try {
      const res = await AxiosService.get("/api/getroles", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        setIsRole(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuildButtonSelect = () => {
    setSelectedAssemblerButton(true);
    setSelectedLogsButton(false);
  };
  const handleHistoryButtonSelect = () => {
    getExceptionLogs();
    getProcessLogs();

    setSelectedLogsButton(true);
    setSelectedAssemblerButton(false);
  };

  const handleAppGroupselect = (e: any, tenant: string) => {
    setAppList([]);
    setVersionList([]);
    setSelectedVersion("");
    setSelectAppGroup(e);
    setSelectApp("");
    fetchApp(tenant, e);
  };

  const handleAppselect = (e: any) => {
    setSelectedVersion("");
    setSelectApp(e);
    getAssemblerVersion(e);
  };

  const handleVersionselect = (e: any) => {
    setSelectedVersion(e);
    getAssemblerData(e);
  };

  const fetchAppGroup = async (tenant: string) => {
    try {
      const res = await AxiosService.get(
        `/api/getappgrouplist?tenant=${tenant}`
      );
      console.log(res,"resposible---->>>");
      if ( res.status == 200) {
        setAppGrpList(res.data);
        if (searchParams.size && !selectAppGroup) {
          const appGroup = searchParams.get("ag");
          (res.data as any[]).includes(appGroup) &&
            handleAppGroupselect(appGroup, tenant);
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Fetching App Groups";
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

  const fetchApp = async (tenant: string, appGroup: string) => {
    try {
      const res = await AxiosService.get(
        `/api/getapplist?tenant=${tenant}&appGroup=${appGroup}`
      );
      if (res.status == 200) {
        setAppList(res.data);
        if (searchParams.size && !selectApp) {
          const appInQuery = searchParams.get("app");
          (res.data as any[]).includes(appInQuery) &&
            handleAppselect(appInQuery);
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Fetching Applications";
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

  const fetchAppForLogs = async (agArray: any) => {
    try {
      setAppList([]);
      for (const ag of agArray) {
        const res = await AxiosService.get(
          `/api/getapplist?tenant=${tenant}&appGroup=${ag}`
        );
        if (res.status == 200) {
          setAppList((prev: any) => [...prev, ...res.data]);
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Fetching Applications";
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

  const handleLogsAppGrp = (e: any) => {
    setLogsAppGrp(e);
    fetchAppForLogs(e);
    setLogsApp([]);
  };

  const getUserInfo = async () => {
    if (getCookie("tp_user")) return;
    try {
      const res = await AxiosService.get("/api/myAccount-for-client", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        const userData = res.data;
        const {
          firstName,
          lastName,
          loginId,
          email,
          accessProfile,
          client,
          profile,
        } = userData;
        setCookieIfNotExist("tp_lid", loginId);
        setCookieIfNotExist("tp_em", email);
        setCookieIfNotExist("tp_cc", client);
        setCookieIfNotExist(
          "tp_user",
          JSON.stringify({
            firstName,
            lastName,
            loginId,
            email,
            accessProfile,
            profile,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (logsTabList == "exception") {
      setVisibleColumns(allExceptionLogColumns);
    } else if (logsTabList == "log") {
      setVisibleColumns(allProcessLogColumns);
    }
    if (typeof window !== "undefined") {
      if (token) {
        getUserInfo();
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (tenant) {
      getAccessRoles();
      setAppGrpList([]);
      setSelectAppGroup("");
      setSelectApp("");
      setSelectedVersion("");
      setVersionList([]);
      fetchAppGroup(tenant);
      setLogsAppGrp([]);
      setLogsApp([]);
    }
  }, [tenant]);

  const getAssemblerVersion = async (
    app: string,
    getVersionFlag: boolean = false
  ) => {
    try {
      const res = await AxiosService.get(
        `/api/getAssemblerVersion?key=CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${selectAppGroup}:AFK:${app}`
      );

      if (res.status == 200 && Array.isArray(res.data)) {
        setVersionList(
          res.data.sort(
            (a: any, b: any) =>
              parseInt(b.replace("v", "")) - parseInt(a.replace("v", ""))
          )
        );
        if (getVersionFlag) {
          const currentVersion = res.data.sort(
            (a: any, b: any) =>
              parseInt(b.replace("v", "")) - parseInt(a.replace("v", ""))
          )[0];
          setSelectedVersion(currentVersion);
          getAssemblerData(currentVersion);
        }
      }
    } catch (err) {
      setVersionList([]);
    }
  };

  const getAssemblerData = async (version: string) => {
    try {
      const res = await AxiosService.post("/api/readkey", {
        SOURCE: "redis",
        TARGET: "redis",
        CK: "TGA",
        FNGK: "BLDC",
        FNK: "DEV",
        CATK: tenant,
        AFGK: selectAppGroup,
        AFK: selectApp,
        AFVK: version,
        AFSK: "bldc",
      });
      if (res.status == 201) {
        setMenuItemData(res.data.artifactList);
        setbldcData(res.data);
      } else {
        setMenuItemData([]);
      }
    } catch (error) {
      setMenuItemData([]);
    }
  };

  const handleSaveBuild = async () => {
    try {
      const res = await AxiosService.post("/api/saveAssemblerData", {
        key: `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${selectAppGroup}:AFK:${selectApp}`,
        data: menuItemData,
      });
      if (res.status == 201) {
        getAssemblerVersion(selectApp, true);
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Build saved successfully`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving Build";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error saving build",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleUpdateBuild = async () => {
    try {
      const res = await AxiosService.post("/api/updatekey", {
        SOURCE: "redis",
        TARGET: "redis",
        CK: "TGA",
        FNGK: "BLDC",
        FNK: "DEV",
        CATK: tenant,
        AFGK: selectAppGroup,
        AFK: selectApp,
        AFVK: selectedVersion,
        AFSK: { bldc: { ...bldcData, artifactList: menuItemData } },
      });
      if (res.status == 201) {
        getAssemblerData(selectedVersion);
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Build saved successfully`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Updating Build Data";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error updating build",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleGenerateBuild = async () => {
    try {
      if (!selectAppGroup || !selectApp || !selectedVersion || !token) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "warning",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Warning",
            text: `Either build key is not selected or has invalid data`,
            closeButton: false,
          } as any
        );
        return;
      }
      const res = await AxiosService.post(
        "/codeGeneration",
        {
          key: `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${selectAppGroup}:AFK:${selectApp}:AFVK:${selectedVersion}:bldc`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status == 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Build processed successfully, Code generated`,
            closeButton: false,
          } as any
        );
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
          text: `Code generation failed , please check the build key data`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleLogTab = (e: typeof logsTabList) => {
    setLogTabList(e);
    setUsers(new Set([]));
    setFabrics(new Set([]));
    setRange({ start: null, end: null });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ProgressButton isIndeterminate size={"xl"} />{" "}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-full h-screen`}
      style={{ backgroundColor: torusTheme["bgCard"] }}
    >
      <BuilderTopNav
        showNodeData={showNodeData}
        setShowNodeData={setShowNodeData}
      />
      <div className="flex justify-between w-full h-[89.07vh]">
        <BuilderSideNav isRole={isRole} />
        {showNodeData ? (
          <div className="flex flex-col w-[94%] h-[99%] mt-[1vw] mr-[0.87vw] rounded-md">
            <Artifactdetails nodeData={showNodeData} />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: torusTheme["bg"],
              borderColor: torusTheme["border"],
            }}
            className={`flex flex-col w-[94%] h-full border mt-[2vh] overflow-y-hidden rounded-md mr-[0.87vw] scrollbar-hide`}
          >
            <div className="flex w-full h-[6.66vh] items-center justify-between">
              <div className="flex items-center gap-[1.46vw] pt-[0.58vw] pl-[1.17vw]">
                <Button
                  style={{
                    color: selectedAssemblerButton
                      ? torusTheme["text"]
                      : torusTheme["textOpacity/35"],
                    fontSize: `${fontSize * 0.93}vw`,
                  }}
                  className={`flex leading-[2.22vh] font-semibold items-center gap-[0.87vw] rounded-lg border-none outline-none`}
                  onPress={handleBuildButtonSelect}
                >
                  <AssemblerIcon
                    fill={
                      !selectedAssemblerButton
                        ? torusTheme["textOpacity/35"]
                        : torusTheme["text"]
                    }
                  />
                  {locale["Assembler"]}
                </Button>
                <Button
                  style={{
                    color: selectedLogsButton
                      ? torusTheme["text"]
                      : torusTheme["textOpacity/35"],
                    fontSize: `${fontSize * 0.93}vw`,
                  }}
                  className={`flex leading-[2.22vh] font-semibold items-center gap-[0.87vw] rounded-lg border-none outline-none`}
                  onPress={handleHistoryButtonSelect}
                >
                  {" "}
                  <LogHubIcon
                    fill={
                      !selectedLogsButton
                        ? torusTheme["textOpacity/35"]
                        : torusTheme["text"]
                    }
                  />
                  {locale["Logs Hub"]}
                </Button>
              </div>
              {selectedAssemblerButton && (
                <div className="flex pt-[0.58vw] pr-[0.87vw] gap-[0.58vw] items-center">
                  <Button
                    onPress={handleUpdateBuild}
                    isDisabled={!selectedVersion}
                    className={`leading-[2.22vh] rounded-md border-none text-[#4CAF50] disabled:cursor-not-allowed bg-[#4CAF50]/15 px-[1.46vw] py-[0.58vw] outline-none`}
                    style={{ fontSize: `${fontSize * 0.83}vw` }}
                  >
                    {locale["Update"]}
                  </Button>
                  <Button
                    onPress={handleSaveBuild}
                    isDisabled={!selectApp}
                    style={{
                      color: accentColor,
                      backgroundColor: hexWithOpacity(accentColor, 0.15),
                      fontSize: `${fontSize * 0.83}vw`,
                    }}
                    className={`leading-[2.22vh] rounded-md border-none disabled:cursor-not-allowed px-[1.46vw] py-[0.58vw] outline-none`}
                  >
                    {locale["Save"]}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: accentColor,
                      fontSize: `${fontSize * 0.83}vw`,
                    }}
                    className={
                      "leading-[2.22vh] rounded-md border-none text-white disabled:cursor-not-allowed px-[1.46vw] py-[0.58vw] outline-none"
                    }
                    onPress={handleGenerateBuild}
                  >
                    {locale["Build"]}
                  </Button>
                </div>
              )}
              {selectedLogsButton && (
                <div className="flex gap-[0.58vw] items-center justify-between w-[70%]">
                  <div className="flex w-full gap-[0.58vw] items-center pt-[0.58vw]">
                    <div className="relative w-[60%] h-[4vh] ">
                      <span className="absolute inset-y-0 left-0 flex items-center p-[0.58vw] h-[2.18vw] w-[2.18vw]">
                        <SearchIcon
                          fill={torusTheme["text"]}
                          height="0.83vw"
                          width="0.83vw"
                        />
                      </span>
                      <Input
                        value={searchValue}
                        style={{
                          backgroundColor: torusTheme["bg"],
                          color: torusTheme["text"],
                          borderColor: torusTheme["border"],
                          fontSize: `${fontSize * 0.72}vw`,
                        }}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search"
                        className={`w-full p-[0.29vw] h-[4vh] focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 border pl-[1.76vw] font-medium rounded-md `}
                      />
                    </div>
                    {/* <DropDown
                      classNames={{
                        popover: "w-[10vw] h-[25vh] overflow-y-auto",
                        triggerButton:
                          "w-[5.5vw] h-[4vh] border rounded-lg",
                      }}
                      styles={{
                        triggerButton: { borderColor: torusTheme["border"], color: torusTheme["text"], backgroundColor: torusTheme["bgCard"] },
                      }}
                      triggerButton={
                        <div
                          className="flex font-medium items-center gap-[0.29vw]"
                          style={{ fontSize: `${fontSize * 0.72}vw`, color: torusTheme["text"], backgroundColor: torusTheme["bg"] }}
                        >
                          <ColumnIcon
                            fill={torusTheme["text"]}
                            height="0.83vw"
                            width="0.83vw"
                          />{" "}
                          {locale["Columns"]}
                        </div>
                      }
                      items={
                        logsTabList == "exception"
                          ? allExceptionLogColumns
                          : allProcessLogColumns
                      }
                      selectedKeys={visibleColumns}
                      setSelectedKeys={setVisibleColumns}
                      multiple
                      displaySelectedKeys={false}
                    /> */}
                    <DialogTrigger>
                      <Button
                        className="outline-none flex items-center gap-[0.29vw] leading-[2.22vh] border rounded-md px-[0.8vw] py-[0.1vw] cursor-pointer"
                        style={{
                          backgroundColor: torusTheme["bg"],
                          color: torusTheme["text"],
                          borderColor: torusTheme["border"],
                          fontSize: `${fontSize * 0.69}vw`,
                        }}
                      >
                        {locale["Filter"]}
                        <FilterIcon fill={torusTheme["text"]} />
                      </Button>

                      <ModalOverlay
                        isDismissable
                        className={
                          "fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center bg-transparent/45"
                        }
                      >
                        <Modal className="w-[30.57vw] h-[85vh] items-center justify-center">
                          <Dialog
                            style={{
                              backgroundColor: torusTheme["bg"],
                              borderColor: torusTheme["border"],
                            }}
                            className="flex focus:outline-none border rounded-md shadow-md mt-3"
                          >
                            {({ close }) => (
                              <LogsFilteration
                                closeModal={close}
                                range={range}
                                setRange={setRange}
                                fabrics={fabrics}
                                setFabrics={setFabrics}
                                users={users}
                                setUsers={setUsers}
                                setRefetch={setRefetch}
                                logsAppGrp={logsAppGrp}
                                handleLogsAppGrp={handleLogsAppGrp}
                                appGrpList={appGrpList}
                                logsApp={logsApp}
                                setLogsApp={setLogsApp}
                                appList={appList}
                                selectAppGroup={selectAppGroup}
                              />
                            )}
                          </Dialog>
                        </Modal>
                      </ModalOverlay>
                    </DialogTrigger>
                  </div>
                  <div>
                    <Tabs
                      className={"pt-[0.58vw] pr-[0.58vw]"}
                      selectedKey={logsTabList}
                      onSelectionChange={handleLogTab}
                    >
                      <TabList
                        className="flex w-full p-[0.29vw] gap-[0.58vw] items-center text-nowrap rounded-md "
                        style={{
                          color: torusTheme["text"],
                          background: torusTheme["bgCard"],
                          borderColor: torusTheme["border"],
                        }}
                      >
                        <Tab
                          id="log"
                          className="p-[0.58vw] outline-none rounded-md font-semibold cursor-pointer "
                          style={({ isSelected }) => ({
                            backgroundColor: isSelected ? torusTheme["bg"] : "",
                            color: isSelected ? torusTheme["text"] : "",
                            borderColor: isSelected ? torusTheme["border"] : "",
                            fontSize: `${fontSize * 0.72}vw`,
                          })}
                        >
                          {locale["Process Logs"]}
                        </Tab>
                        <Tab
                          id="exception"
                          className="p-[0.58vw] outline-none rounded-md font-semibold cursor-pointer"
                          style={({ isSelected }) => ({
                            backgroundColor: isSelected ? torusTheme["bg"] : "",
                            color: isSelected ? torusTheme["text"] : "",
                            borderColor: isSelected ? torusTheme["border"] : "",
                            fontSize: `${fontSize * 0.72}vw`,
                          })}
                        >
                          {locale["Torus Logs"]}
                        </Tab>
                      </TabList>
                    </Tabs>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-[0.58vw]">
              <Separator style={{ borderColor: torusTheme["borderLine"] }} />
            </div>
            {selectedAssemblerButton && (
              <div>
                <div className="flex w-full justify-between items-center">
                  <div className="flex outline-none gap-[1.46vw] pl-[1.17vw]">
                    <DropDown
                      triggerButton={locale["App Group"]}
                      selectedKeys={selectAppGroup}
                      setSelectedKeys={(e) =>
                        handleAppGroupselect(e, tenant as string)
                      }
                      items={appGrpList}
                      classNames={{
                        triggerButton: `text-nowrap ${
                          tenant
                            ? `min-w-48 pressed:animate-torusButtonActive rounded-lg leading-[2.22vh] mt-[0.58vw]`
                            : `backdrop-blur-3xl min-w-48 rounded-lg mt-[0.58vw]`
                        }`,
                        popover: `w-40 ${appGrpList.length > 4 ? "h-[20%]" : ""} overflow-y-auto`,
                        listboxItem: "flex leading-[2.22vh] justify-between",
                      }}
                      styles={{
                        triggerButton: {
                          fontSize: `${fontSize * 0.83}vw`,
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                        },
                        listbox: {
                          backgroundColor: torusTheme["bg"],
                          color: torusTheme["text"],
                          borderColor: torusTheme["border"],
                        },
                        listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                      }}
                    />

                    <DropDown
                      triggerButton={locale["App"]}
                      selectedKeys={selectApp}
                      setSelectedKeys={handleAppselect}
                      items={appList}
                      classNames={{
                        triggerButton: `text-nowrap ${
                          selectAppGroup
                            ? `min-w-40 pressed:animate-torusButtonActive rounded-lg leading-[2.22vh] mt-[0.58vw]`
                            : `backdrop-blur-3xl min-w-40 rounded-lg mt-[0.58vw]`
                        }`,
                        popover: `w-40 ${appList.length > 4 ? "h-[20%]" : ""} overflow-y-auto`,
                        listboxItem: `flex leading-[2.22vh] justify-between`,
                      }}
                      styles={{
                        triggerButton: {
                          fontSize: `${fontSize * 0.83}vw`,
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                        },
                        listbox: {
                          backgroundColor: torusTheme["bg"],
                          color: torusTheme["text"],
                          borderColor: torusTheme["border"],
                        },
                        listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                      }}
                    />

                    <DropDown
                      triggerButton={locale["version"]}
                      selectedKeys={selectedVersion}
                      setSelectedKeys={handleVersionselect}
                      items={versionList}
                      classNames={{
                        triggerButton: `text-nowrap ${
                          selectApp
                            ? `min-w-20 pressed:animate-torusButtonActive rounded-lg leading-[2.22vh] mt-[0.58vw]`
                            : `backdrop-blur-3xl min-w-20 rounded-lg mt-[0.58vw]`
                        }`,
                        popover: `w-20 ${versionList.length > 4 ? "h-[20%]" : ""} overflow-y-auto`,
                        listboxItem: "flex leading-[2.22vh] justify-between",
                      }}
                      styles={{
                        triggerButton: {
                          fontSize: `${fontSize * 0.83}vw`,
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                        },
                        listbox: {
                          backgroundColor: torusTheme["bg"],
                          color: torusTheme["text"],
                          borderColor: torusTheme["border"],
                        },
                        listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                      }}
                      isDisabled={versionList.length === 0}
                    />
                  </div>
                  <div className="flex gap-[0.58vw] justify-end mr-[0.87vw] mt-[0.58vw]">
                    <Button
                      className={`leading-[1.85vh] font-medium outline-none rounded-md text-[#EF4444] px-[1.75vw] py-[0.73vw] bg-[#EF4444]/15`}
                      style={{ fontSize: `${fontSize * 0.72}vw` }}
                      onPress={() => {
                        document
                          .getElementById("triggerClearKeyFunctionality")
                          ?.click();
                      }}
                    >
                      {locale["Clear"]}
                    </Button>
                    <DialogTrigger>
                      <Button
                        style={{
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                          fontSize: `${fontSize * 0.72}vw`,
                        }}
                        className={`leading-[1.85vh] font-medium outline-none rounded-md px-[1.17vw] py-[0.73vw]`}
                      >
                        {locale["Clear All"]}
                      </Button>
                      <Popover placement="bottom" className={`w-[20vw]`}>
                        <Dialog
                          style={{
                            backgroundColor: torusTheme["bg"],
                            borderColor: torusTheme["border"],
                            color: torusTheme["text"],
                          }}
                          className={`border focus:outline-none rounded-lg`}
                        >
                          {({ close }) => (
                            <div className="p-[1.17vw] rounded-[1.17vw] flex flex-col gap-[0.58vw]">
                              <div
                                className="leading-[1.85vh] font-medium p-[0.58vw]"
                                style={{ fontSize: `${fontSize * 0.72}vw` }}
                              >
                                {
                                  locale[
                                    "Are you sure you want to clear all Menu Items?"
                                  ]
                                }
                              </div>
                              <Button
                                className={`outline-none px-[0.58vw] py-[0.29vw] leading-[1.85vh] font-medium self-end rounded text-white bg-[#EF4444]`}
                                onPress={() => {
                                  setMenuItemData([]);
                                  close();
                                }}
                                style={{ fontSize: `${fontSize * 0.72}vw` }}
                              >
                                {locale["delete"]}
                              </Button>
                            </div>
                          )}
                        </Dialog>
                      </Popover>
                    </DialogTrigger>
                  </div>
                </div>
                <div>
                  <Separator
                    style={{ borderColor: torusTheme["borderLine"] }}
                    className={`mt-[0.58vw]`}
                  />
                </div>
                <div className="flex w-full gap-[1.17vw] h-full">
                  <div className="w-[20%] pt-[0.87vw] pl-[1.17vw] rounded-lg">
                    <FabricSelector
                      tenant={tenant as string}
                      appGrp={selectAppGroup}
                      app={selectApp}
                      bldcData={bldcData}
                    />
                  </div>
                  <div className="w-[80%] pt-[0.87vw] pr-[0.58vw]">
                    <MenuItemAccordian
                      data={menuItemData}
                      setData={setMenuItemData}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedLogsButton && (
              <div className="w-full h-full">
                {/* <div className=" ml-[1vw] flex gap-[2vw]">
                  <DropDown
                    triggerButton={locale["App Group"]}
                    selectedKeys={logsAppGrp}
                    multiple
                    setSelectedKeys={handleLogsAppGrp}
                    items={appGrpList}
                    classNames={{
                      triggerButton: `text-nowrap w-48 ${
                        tenant
                          ? `min-w-48 pressed:animate-torusButtonActive rounded-lg leading-[2.22vh] mt-[0.58vw]`
                          : `backdrop-blur-3xl min-w-48 rounded-lg mt-[0.58vw]`
                      }`,
                      popover: `w-40 ${appGrpList.length > 4 ? "h-[20%]" : ""} overflow-y-auto`,
                      listboxItem: "flex leading-[2.22vh] justify-between",
                    }}
                    displaySelectedKeys={logsAppGrp?.length > 1 ? false : true}
                    styles={{
                      triggerButton: {
                        fontSize: `${fontSize * 0.83}vw`,
                        backgroundColor: torusTheme["bgCard"],
                        color: torusTheme["text"],
                      },
                      listbox: {
                        backgroundColor: torusTheme["bg"],
                        color: torusTheme["text"],
                        borderColor: torusTheme["border"],
                      },
                      listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                    }}
                  />

                  <DropDown
                    triggerButton={locale["App"]}
                    selectedKeys={logsApp}
                    setSelectedKeys={setLogsApp}
                    items={appList}
                    multiple
                    classNames={{
                      triggerButton: `text-nowrap w-40 ${
                        selectAppGroup
                          ? `min-w-40 pressed:animate-torusButtonActive rounded-lg leading-[2.22vh] mt-[0.58vw]`
                          : `backdrop-blur-3xl min-w-40 rounded-lg mt-[0.58vw]`
                      }`,
                      popover: `w-40 ${appList.length > 4 ? "h-[20%]" : ""} overflow-y-auto`,
                      listboxItem: `flex leading-[2.22vh] justify-between`,
                    }}
                    displaySelectedKeys={logsApp?.length > 1 ? false : true}
                    styles={{
                      triggerButton: {
                        fontSize: `${fontSize * 0.83}vw`,
                        backgroundColor: torusTheme["bgCard"],
                        color: torusTheme["text"],
                      },
                      listbox: {
                        backgroundColor: torusTheme["bg"],
                        color: torusTheme["text"],
                        borderColor: torusTheme["border"],
                      },
                      listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                    }}
                  />
                </div> */}
                {logsTabList == "log" ? (
                  <div className="w-[98%] ml-[0.58vw] h-full">
                    <ProcessLogs
                      visibleColumns={visibleColumns}
                      searchValue={searchValue}
                      setShowNodeData={setShowNodeData}
                      showNodeData={showNodeData}
                      startDate={range.start}
                      endDate={range.end}
                      fabrics={fabrics}
                      users={users}
                      appGrp={logsAppGrp}
                      app={logsApp}
                      refetch={refetch}
                    />
                  </div>
                ) : (
                  logsTabList == "exception" && (
                    <ExceptionLog
                      visibleColumns={allExceptionLogColumns}
                      searchValue={searchValue}
                      startDate={range.start}
                      endDate={range.end}
                      fabrics={fabrics}
                      users={users}
                      appGrp={logsAppGrp}
                      app={logsApp}
                      refetch={refetch}
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Builder;
