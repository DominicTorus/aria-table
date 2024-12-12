import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Input,
  Popover,
  Tab,
  TabList,
  Tabs,
} from "react-aria-components";
import {
  DataFabric,
  FilterIcon,
  ProcessFabric,
  ThreeDots,
  UserFabric,
  LockIcon,
} from "../../constants/svgApplications";
import { AxiosService } from "../../../lib/utils/axiosService";
import { getCookie, getEncodedDetails } from "../../../lib/utils/cookiemgmt";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import TorusDialog from "../torusComponents/torusdialogmodal";
import FilterModal from "./filterModal";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";
import { sortingConditions } from "../../constants/MenuItemTree";
import ArtifactContextMenu from "./contextMenu/contextMenu";
import { TbPinFilled } from "react-icons/tb";
import { calculateRecentlyWorkingDetails, capitalize, hexWithOpacity } from "../../../lib/utils/utility";
import ProgressButton from "../progressbar";


const Tabcard = ({ searchTerm }: { searchTerm: string }) => {
  const [artifactType, setArtifactType] = useState<any>("AF");
  const [artifactList, setArtifactList] = useState<any>([]);
  const [fabricList, setFabricList] = useState<Set<string>>(
    new Set(["DF", "PF", "UF"])
  );
  const [catalogs, setCatalogs] = useState<Set<string>>(new Set());
  const [catalogList, setCatalogList] = useState([]);
  const [artifactGrps, setArtifactGrps] = useState<Set<string>>(new Set());
  const [artifactGrpList, setArtifactGrpList] = useState([]);
  const client = getCookie("tp_cc");
  const loginId = getCookie("tp_lid");
  const [wordLength, setWordLength] = useState(0);
  const [isArtifactMoved, setIsArtifactMoved] = useState(false);
  const [selectedSortButton, setSelectedSortButton] =
    useState<sortingConditions>("Newest");
  const [isInput, setInput] = useState<{
    id: number | undefined;
    name: string;
  }>({ id: undefined, name: "" });
  const [refetchOnContextMenu, setRefetchOnContextMenu] = useState<any>(false);
  const url = process.env.NEXT_PUBLIC_MODELLER_URL;
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const locale = useSelector((state: RootState) => state.main.locale);
  const [isLoading, setLoading] = useState(true);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const suffixes: any = {
    DF: ["DFD", "ERD"],
    UF: ["UFD"],
    PF: ["PFD"],
  };

  const getArtifact = async (fabric?: string) => {
    setLoading(true);
    setArtifactList([]);
    try {
      const res = await AxiosService.post(`/api/getArtifactDetail`, {
        client: client,
        loginId: loginId,
        fabric: fabricList.size
          ? Array.from(fabricList).flatMap((prefix: any) =>
            suffixes[prefix].map((suffix: any) => `${prefix}-${suffix}`)
          )
          : ["DF-DFD", "DF-ERD", "PF-PFD", "UF-UFD"],
        catalog: catalogs.size ? Array.from(catalogs) : undefined,
        artifactGrp: artifactGrps.size ? Array.from(artifactGrps) : undefined,
        sortOrder: selectedSortButton ? selectedSortButton : "Newest",
        artifactType,
      });
      if (res.status === 201) {
        setArtifactList(res.data);
        setIsArtifactMoved(false);
        setLoading(false);
      } else {
        setLoading(false);
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error Fetching Artifacts",
            text: `Something went wrong`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Fetching Artifacts";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error ",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  useEffect(() => {
    getArtifact();
  }, [
    artifactType,
    fabricList,
    catalogs,
    artifactGrps,
    selectedSortButton,
    refetchOnContextMenu,
  ]);

  const getFabricIcon = (fab: string) => {
    switch (fab) {
      case "DF-DFD":
        return (
          <DataFabric
            opacity="1"
            fill={accentColor}
            width="1.04vw"
            height="1.04vw"
          />
        );
      case "DF-ERD":
        return (
          <DataFabric
            opacity="1"
            fill={accentColor}
            width="1.04vw"
            height="1.04vw"
          />
        );
      case "PF-PFD":
        return (
          <ProcessFabric
            opacity="1"
            fill={accentColor}
            width="1.04vw"
            height="1.04vw"
          />
        );
      case "UF-UFD":
        return (
          <UserFabric
            opacity="1"
            fill={accentColor}
            width="1.04vw"
            height="1.04vw"
          />
        );
      default:
        return (
          <DataFabric
            opacity="1"
            fill={accentColor}
            width="1.04vw"
            height="1.04vw"
          />
        );
    }
  };


  const getAllCatalogs = async () => {
    try {
      const res = await AxiosService.post(`/api/getAllCatalogs`, {
        client: client,
      });
      setCatalogList(res.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Fetching Catalogs";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Fetching Catalogs",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleNavigateToModeller = (item: any) => {
    const { artifactName, version, fabric, catalog, artifactGrp } = item;
    const enCodedDetails = getEncodedDetails(
      fabric,
      artifactType,
      catalog,
      artifactGrp,
      artifactName,
      version,
      tenant
    );
    window.location.href = `${url}?tk=${enCodedDetails}`;
  };

  useEffect(() => {
    getAllCatalogs();
    getAllArtifactGrp();
  }, [artifactType]);

  const getAllArtifactGrp = async () => {
    try {
      const res = await AxiosService.post(`/api/getAllArtifactGrp`, {
        client: client,
      });
      setArtifactGrpList(res.data.filter(Boolean));
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Fetching Artifact Groups";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Occured",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleChangeArtifactName = async (item: any) => {
    try {
      if (item.artifactName == isInput.name) {
        setInput({ id: undefined, name: "" });
        return;
      }
      const res = await AxiosService.post(`/api/renamekey`, {
        oldKey: `CK:${client}:FNGK:AF:FNK:${item.fabric}:CATK:${item.catalog}:AFGK:${item.artifactGrp}:AFK:${item.artifactName}`,
        newKey: `CK:${client}:FNGK:AF:FNK:${item.fabric}:CATK:${item.catalog}:AFGK:${item.artifactGrp}:AFK:${isInput.name}`,
      });
      if (res.status === 201) {
        setInput({ id: undefined, name: "" });
        getArtifact();
      } else {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error Fetching Artifacts",
            text: `${res.data}`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Renaming Artifact";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Occured",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const getUserByArtifact = (item: any) => {
    if (item.updatedBy) {
      return capitalize(item.updatedBy);
    } else if (item.createdBy) {
      return capitalize(item.createdBy);
    } else {
      return capitalize(loginId);
    }
  };

  const handleContextMenuOpen = (index: number) => {
    if (index == currentIndex) {
      setCurrentIndex(null);
    } else {
      setCurrentIndex(index);
    }
  }

  return (
    <div style={{ backgroundColor: torusTheme["bg"], borderColor: torusTheme["border"] }} className={`flex flex-col w-full h-full border p-[0.87vw] rounded-md`}>
      <div className="flex items-center justify-between">
        <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.93}vw` }} className={`font-semibold leading-[2vh] py-[0.58vw]`}>
          {locale["My Library"]}
        </h1>
        <TorusDialog
          triggerElement={
            <Button
              style={{ color: torusTheme["text"], background: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.69}vw` }}
              className={`outline-none flex items-center gap-[0.29vw] leading-[2.22vh] border rounded-md px-[0.8vw] py-[0.1vw] cursor-pointer`}>
              {locale["Filter"]}
              <FilterIcon fill={torusTheme["text"]} />
            </Button>
          }
          classNames={{
            modalClassName: "justify-end pr-[1.46vw] pt-[6.9vw]",
            dialogClassName:
              `border rounded p-[0.58vw] h-[81.18vh] w-[14.89vw] outline-none `,
          }}
          styles={{ backgroundColor: torusTheme["bg"], borderColor: torusTheme["border"], color: torusTheme["text"] }}
        >
          <FilterModal
            fabrics={fabricList}
            setFabrics={setFabricList}
            catalogs={catalogs}
            setCatalogs={setCatalogs}
            artifactGrps={artifactGrps}
            setArtifactGrps={setArtifactGrps}
            catalogList={catalogList}
            artifactGrpList={artifactGrpList}
            selectedSortButton={selectedSortButton}
            setSelectedSortButton={setSelectedSortButton}
          />
        </TorusDialog>
      </div>
      <div className="flex flex-col pl-[0.58vw] h-[70.37vh]">
        <Tabs
          className={"pt-[0.58vw]"}
          selectedKey={artifactType}
          onSelectionChange={setArtifactType}
        >
          <TabList
            style={{ color: torusTheme["text"], background: torusTheme["bgCard"], borderColor: torusTheme["border"] }}
            className={`flex w-[26.3vw] text-nowrap rounded-lg p-[0.29vw] items-center`}
            aria-label="Tabs"
          >
            <Tab
              id={"AF"}
              className={({ isSelected }) =>
                `${isSelected
                  ? `transition duration-300 ease-in-out rounded-md p-[0.55vw] font-bold`
                  : "font-semibold"
                } cursor-pointer outline-none w-[8.67vw] text-center leading-[1.85vh]`
              }
              style={({ isSelected }) => ({
                backgroundColor: isSelected ? torusTheme["bg"] : "",
                color: isSelected ? torusTheme["text"] : "",
                borderColor: isSelected ? torusTheme["border"] : "",
                fontSize: `${fontSize * 0.67}vw`
              })}
            >
              {" "}
              {locale["My Artifacts"]}
            </Tab>
            <Tab
              id={"TFRK"}
              className={({ isSelected }) =>
                `${isSelected
                  ? `transition duration-300 ease-in-out rounded-md p-[0.55vw] font-bold`
                  : "font-semibold"
                } cursor-pointer outline-none w-[8.67vw] text-center leading-[1.85vh]`
              }
              style={({ isSelected }) => ({
                backgroundColor: isSelected ? torusTheme["bg"] : "",
                color: isSelected ? torusTheme["text"] : "",
                borderColor: isSelected ? torusTheme["border"] : "",
                fontSize: `${fontSize * 0.67}vw`
              })}
            >
              {locale["Shared with Me"]}
            </Tab>
            <Tab
              id={"AFR"}
              className={({ isSelected }) =>
                `${isSelected
                  ? `transition duration-300 ease-in-out rounded-md p-[0.55vw] font-bold`
                  : "font-semibold"
                } cursor-pointer outline-none w-[8.67vw] text-center leading-[1.85vh]`
              }
              style={({ isSelected }) => ({
                backgroundColor: isSelected ? torusTheme["bg"] : "",
                color: isSelected ? torusTheme["text"] : "",
                borderColor: isSelected ? torusTheme["border"] : "",
                fontSize: `${fontSize * 0.67}vw`
              })}
            >
              {locale["Purchased"]}
            </Tab>
          </TabList>
        </Tabs>
        <div style={{ color: torusTheme["text"] }} className={`pt-[1.17vw] h-full w-full grid sm:grid-cols-2 xl:grid-cols-3 gap-[1.46vw] overflow-y-auto pr-[0.58vw]`}>
          {artifactList.length == 0 ? (
            <div className="flex items-center justify-center col-span-full h-full ">
              <p style={{ fontSize: `${fontSize * 0.93}vw` }} className="font-medium leading-[2.31vh]  ">
                {isLoading ? (
                  <ProgressButton isIndeterminate />
                ) : (
                  locale["Your library is empty. Once you create or import artifacts, they will appear here."]
                )}


              </p>
            </div>
          ) : (
            artifactList
              .filter(
                (ele: any) =>
                  ele.artifactName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  ele.catalog
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  ele.artifactGrp
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
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
                        <DialogTrigger isOpen={currentIndex == index} onOpenChange={() => handleContextMenuOpen(index)}>
                          <Button
                            style={{ backgroundColor: currentIndex == index ? torusTheme["borderLine"] : "" }}
                            className={`p-[0.38vw] rounded items-center outline-none`}
                            onHoverStart={(e) => e.target.style.backgroundColor = torusTheme["borderLine"]}
                            onHoverEnd={(e) => { if (currentIndex != index) e.target.style.backgroundColor = "" }}
                          >
                            <ThreeDots fill={torusTheme["text"]} />
                          </Button>
                          <Popover
                            placement="bottom right"
                            style={{ zIndex: 10 }}
                          >
                            <Dialog className="outline-none">
                              {({ close }) => (
                                <ArtifactContextMenu
                                  artifactName={item.artifactName}
                                  artifactType={item.artifactType}
                                  artifactGrp={item.artifactGrp}
                                  catalog={item.catalog}
                                  isLocked={item.isLocked}
                                  version={item.version}
                                  fabric={item.fabric}
                                  index={index}
                                  close={close}
                                  setInput={setInput}
                                  setRefetchOnContextMenu={
                                    setRefetchOnContextMenu
                                  }
                                  artifactDetails={item}
                                  isArtifactMoved={isArtifactMoved}
                                  setIsArtifactMoved={false}
                                  setArtifactList={setArtifactList}
                                  getArtifact={getArtifact}
                                />
                              )}
                            </Dialog>
                          </Popover>
                        </DialogTrigger>
                      </div>
                    </div>
                    <div
                      style={{ color: torusTheme["text"] }}
                      className={`flex w-full items-center justify-between cursor-pointer`}
                      onClick={() => {
                        if (index == isInput.id) return;
                        handleNavigateToModeller(item);
                      }}
                    >
                      {isInput.id === index ? (
                        <Input
                          defaultValue={item.artifactName}
                          onChange={handleInputChange}
                          onBlur={() => handleChangeArtifactName(item)}
                          onKeyDown={(e) => {
                            if (e.key == "Enter")
                              handleChangeArtifactName(item);
                          }}
                          style={{ color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` }}
                          className={`w-[80%] leading-[1.7vh] font-semibold focus:outline-none rounded-md`}
                        />
                      ) : (
                        <h3 style={{ fontSize: `${fontSize * 0.83}vw` }} className="leading-[1.7vh] font-semibold whitespace-nowrap">
                          {item.artifactName.charAt(0).toUpperCase() +
                            item.artifactName.slice(1)}
                        </h3>
                      )}
                      <div style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.72}vw` }} className={`leading-[1.29vh] pr-[0.58vw] font-medium`}>
                        {item.version}
                      </div>
                    </div>
                    <div
                      className="flex w-full cursor-pointer"
                      onClick={() => handleNavigateToModeller(item)}
                    >
                      <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.58}vw` }} className={`pt-[0.29vw] leading-[1.34vh] font-medium whitespace-nowrap`}>
                        {item.catalog} - {item.artifactGrp}
                      </p>
                    </div>
                  </div>

                  <div style={{ borderColor: torusTheme["borderLine"] }} className={`w-full border-b`}></div>

                  <div className="w-full p-[0.58vw]">
                    <div style={{ fontSize: `${fontSize * 0.83}vw` }} className="flex w-full whitespace-nowrap justify-between">
                      <div style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.55}vw` }} className={`flex flex-col gap-[0.58vh] leading-[1.66vh] font-medium`}>
                        {locale["Last edited"]}{" "}
                        {calculateRecentlyWorkingDetails(item.recentlyWorking, getCookie('cfg_lc') ? getCookie('cfg_lc') : "en-GB")}
                        <span style={{ color: accentColor, fontSize: `${fontSize * 0.62}vw` }} className="leading-[1.66vh] font-medium">
                          {getUserByArtifact(item)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabcard;
