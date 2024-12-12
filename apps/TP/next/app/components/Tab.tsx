"use client";
import { Input, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import type { TabPanelProps, TabProps } from "react-aria-components";
import React, { useEffect, useState } from "react";
import {
  DataFabric,
  // ProcessFabric,
  SearchIcon,
  UserFabric,
  // UserFabric,
} from "../constants/svgApplications";
import { AxiosService } from "../../lib/utils/axiosService";
import { toast } from "react-toastify";
import TorusToast from "./torusComponents/torusToast";
import { RootState } from "../../lib/Store/store";
import { useSelector } from "react-redux";

interface BuilderProps {
  tenant: string;
  appGrp: string;
  app: string;
  bldcData: any;
}

function FabricSelector({ tenant, appGrp, app, bldcData }: BuilderProps) {
  const [selectedTab, setSelectedTab] = useState("df");
  const [modelKeys, setModelKeys] = useState<any[]>([]);
  const [wordLength, setWordLength] = useState(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const tabs = [
    // {
    //   id: "df",
    //   label: "Data Fabric",
    //   icon: <DataFabric opacity="1" fill={accentColor} width="1.34vw" height="1.34vw" />,
    //   iconDefault: (
    //     <DataFabric
    //       width="1.34vw"
    //       height="1.34vw"
    //       fill={torusTheme["text"]}
    //       opacity="0.35"
    //     />
    //   ),
    // },
    {
      id: "uf",
      label: "UI Fabric",
      icon: <UserFabric opacity="1" fill={accentColor} width="1.34vw" height="1.34vw" />,
      iconDefault: (
        <UserFabric
          width="1.34vw"
          height="1.34vw"
          fill={torusTheme["text"]}
          opacity="0.35"
        />
      ),
    },
    // {
    //   id: "pf",
    //   label: "Process Fabric",
    //   icon: <ProcessFabric opacity="1" fill={accentColor} width="1.34vw" height="1.34vw" />,
    //   iconDefault: (
    //     <ProcessFabric
    //       width="1.34vw"
    //       height="1.34vw"
    //       fill={torusTheme["text"]}
    //       opacity="0.35"
    //     />
    //   ),
    // },
  ];

  const getAllApplicationList = async (fabric: string) => {
    if (tenant && appGrp && app) {
      const res = await AxiosService.post("/api/readkey", {
        SOURCE: "redis",
        TARGET: "redis",
        CK: "TGA",
        FNGK: fabric.toUpperCase(),
        FNK: "BUILD",
        CATK: [tenant],
        AFGK: [app],
        AFK: [],
        AFVK: [],
      });

      if (res.status == 201) {
        if (res.data) {
          const allKeys = [...res.data];
          allKeys.forEach((item: any) => {
            const structuredData = allKeys.flatMap((item) =>
              item.AFKList.flatMap((afkItem: any) =>
                afkItem.AFVKList.map((afvkItem: any) => ({
                  key: `CK:TGA:FNGK:${fabric.toUpperCase()}:FNK:BUILD:CATK:${tenant}:AFGK:${app}:AFK:${afkItem.AFK}:AFVK:${afvkItem.AFVK}`,
                  label: `${afkItem.AFK} ${afvkItem.AFVK}`,
                }))
              )
            );
            const val = new Set(structuredData);
            setModelKeys(Array.from(val));
          });
        } else {
          setModelKeys([]);
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error Fetching ModelKeys",
              text: `There is no ModelKey found for the application`,
              closeButton: false,
            } as any
          );
        }
      } else {
        setModelKeys([]);
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error Fetching ModelKeys",
            text: `Please select valid application`,
            closeButton: false,
          } as any
        );
      }
    } else {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Fetching ModelKeys",
          text: `Please select valid application`,
          closeButton: false,
        } as any
      );
    }
  };

  const handlegetModelkeys = async (id: string) => {
    if (bldcData.buildKey) {
      const result = new Map(); // Map ensures uniqueness based on 'key'

      bldcData.buildKey
        .filter((item: any) => item.buildKey.includes(`:${id}`))
        .forEach((item: any) => {
          const keyData = {
            key: item.buildKey,
            label: `${item.buildKey.split(":")[11]} ${item.buildKey.split(":")[13]}`,
          };

          result.set(keyData.key, keyData); // Use 'key' as the unique identifier
        });

      setModelKeys(Array.from(result.values())); // Get unique keyData objects
    }
  };


  const handleTabChange = (id: any) => {
    setSelectedTab(id);

    handlegetModelkeys(id.toUpperCase());
  };
  useEffect(() => {
    if (bldcData) {
      handlegetModelkeys(selectedTab.toUpperCase());
    }
  }, [bldcData]);

  const handleDragKey = (e: React.DragEvent<HTMLDivElement>, content: any) => {
    e.dataTransfer.setData("key", JSON.stringify({ [selectedTab]: content }));
  };

  return (
    <div className="flex flex-col w-[18.07vw] h-full">
      <Tabs
        style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"] }}
        className={`h-[70vh] rounded-lg`}
        onSelectionChange={handleTabChange}
      >
        <TabList
          aria-label="Feeds"
          style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"] }}
          className={`flex w-[16.92vw] rounded-lg p-[0.29vw] ml-[0.58vw] mt-[0.58vw]`}
        >
          {tabs.map(({ id, label, icon, iconDefault }) => (
            <MyTab key={id} id={id} label={label}>
              {selectedTab === id ? icon : iconDefault}
            </MyTab>
          ))}
        </TabList>
        <div className="relative mt-[0.87vw] ml-[0.58vw]">
          <span className="absolute inset-y-0 left-0 flex items-center p-[0.58vw] h-[2.04vw] w-[2.04vw] ">
            <SearchIcon
              width="0.83vw"
              height="0.83vw"
              fill={torusTheme["text"]}
            />
          </span>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Artifacts"
            onFocus={(e) => (e.target.style.borderColor = accentColor)}
            onBlur={(e) => (e.target.style.borderColor = "")}
            className={`w-[92%] leading-[2.22vh] p-[0.29vw] focus:outline-none border pl-[1.75vw] rounded-md`}
            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.72}vw` }}
          />
        </div>
        <div className="h-[85%] overflow-y-auto">
          {modelKeys
            .filter((key: any) =>
              key.label.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((key: any, index: number) => (
              <MyTabPanel key={index} id={selectedTab}>
                <div
                  draggable
                  onDragStart={(e) => handleDragKey(e, key.key)}
                  className={`w-[90%] border p-[0.29vw] ml-[0.58vw] leading-[2.22vh] rounded-md`}
                  style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` }}
                >
                  {key.label}
                </div>
              </MyTabPanel>
            ))}
        </div>
      </Tabs>
    </div>
  );
}

function MyTab({ id, children, label }: TabProps & { label: string }) {
  const locale = useSelector((state: RootState) => state.main.locale);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  return (
    <Tab
      id={id}
      className={({ isSelected }) => `
        w-full flex items-center justify-center leading-[1.48vh] font-medium cursor-pointer text-nowrap
        ${isSelected
          ? `transition duration-300 ease-in-out rounded-lg outline-none p-[0.29vw]`
          : ""
        }
      `}
      style={({ isSelected }) => ({
        backgroundColor: isSelected ? torusTheme["bgCard"] : "",
        color: isSelected ? torusTheme["text"] : "",
        fontSize: `${fontSize * 0.72}vw`
      })}
    >
      {({ isSelected }) => (
        <>
          {children}
          {isSelected && <span className="mx-[0.29vw]">{locale[label]}</span>}
        </>
      )}
    </Tab>
  );
}

function MyTabPanel(props: TabPanelProps) {
  return <TabPanel {...props} className="mt-[0.58vw]" />;
}

export default FabricSelector;
