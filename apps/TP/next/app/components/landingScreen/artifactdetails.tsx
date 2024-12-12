import React, { useState } from "react";
import { Tabs } from "react-aria-components";
import { Tab, TabList, TabPanel } from "react-aria-components";
import JsonView from "react18-json-view";
import { FaClipboardCheck } from "react-icons/fa";
import { Clipboard, Node } from "../../constants/svgApplications";
import "react18-json-view/src/style.css";
import { RootState } from "../../../lib/Store/store";
import { useSelector } from "react-redux";

const Artifactdetails = ({ nodeData }: any) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<any>("");
  const [selectedNode, setSelectedNode] = useState<any>(nodeData?.node?.[0]);
  const { artifact, version, processId, status, time } = nodeData;
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [processingTime, setProcessingTime] = useState<string>("");
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);

  const handleNodeClick = (node: any) => {
    if (JSON.stringify(node) !== JSON.stringify(selectedNode)) {
      setSelectedNode(node);
    }
  };

  const determineStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return {
          color: "#22c55e", // text-green-500
          backgroundColor: "#d1fae5", // bg-green-100
          border: "1px solid #bbf7d0", // border border-green-200
          width: "100%", // w-full
          height: "15%", // h-[15%]
        }; // Green for success
      case "failed":
        return {
          color: "#ef4444", // text-red-500
          backgroundColor: "#fee2e2", // bg-red-100
          border: "1px solid #fecaca", // border border-red-200
          width: "100%", // w-full
          height: "15%", // h-[15%]
        }; // Red for failed
      default:
        return {
          color: "#6b7280", // text-gray-500
        }; // Default gray for other statuses
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processId);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  function formatDate(inputDateStr: string) {
    // Create a Date object from the input string
    const dateObj = new Date(inputDateStr);

    // Get the day, month, year, hours, minutes, and seconds
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();
    const milliseconds = dateObj.getMilliseconds();
    // Format the date and time components
    const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}:${milliseconds}`;

    return formattedDate;
  }

  const handleGetFinishingTime = (nodeTime: string) => {
    const currentIndex = (time as string[]).findIndex(
      (item: string) => item === nodeTime
    );
    if (currentIndex !== -1 && time[currentIndex + 1]) {
      const timeDifference =
        new Date(time[currentIndex + 1]).getMilliseconds() -
        new Date(nodeTime).getMilliseconds();
      return {
        endTime: formatDate(time[currentIndex + 1]),
        processingTime: `Processing Time : ${timeDifference}ms`,
      };
    } else {
      return status.toLowerCase() == "success"
        ? {
          endTime: formatDate(time[time.length - 1]),
          processingTime: "Process completed successfully",
        }
        : {
          endTime: "process not finished",
          processingTime: "Process not finished",
        };
    }
  };

  return (
    <div className="flex w-full gap-5 h-full overflow-hidden">
      <div style={{ color: torusTheme["text"], backgroundColor: torusTheme["bg"], borderColor: torusTheme["border"] }} className="flex flex-col h-full w-[15%] border rounded-lg">
        <div style={{ borderColor: torusTheme["borderLine"] }} className="flex flex-col border-b">
          <div className="flex justify-between p-[0.87vw]">
            <h1
              style={{ fontSize: `${fontSize * 0.83}vw`, color: torusTheme["text"] }}
              className=" leading-[1.25vw] mx-[0.29vw] font-semibold"
            >
              {artifact.toUpperCase()}
            </h1>
            <p
              style={{
                backgroundColor: `${accentColor}`,
                fontSize: `${fontSize * 0.52}vw`,
              }}
              className="text-white leading-[1.25vw] rounded-xl px-[0.87vw]"
            >
              {version}
            </p>
          </div>
          <div style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"] }} className="flex mx-[1.17vw] mb-[0.58vw] justify-between border py-[0.29vw] px-[0.58vw] rounded-full">
            <h2 style={{ color: torusTheme["text"] }} className="text-xs">
              <span
                onClick={handleCopyToClipboard}
                style={{ fontSize: `${fontSize * 0.62}vw` }}
                className="text-nowrap leading-[1.04vw] cursor-pointer gap-[0.87vw] flex items-center"
              >
                UID: {processId}
                {copied ? (
                  <FaClipboardCheck className="text-green-500" />
                ) : (
                  <Clipboard width="0.83vw" height="0.83vw" fill={torusTheme["text"]} />
                )}
              </span>
            </h2>
          </div>
        </div>
        <div style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"] }} className="flex flex-col mt-[1.17vw]">
          {nodeData.node.map((item: any, index: number) => (
            <div
              key={index}
              onMouseEnter={(e) => (e.target as HTMLDivElement).style.backgroundColor = torusTheme["bgCard"]}
              onMouseLeave={(e) => (e.target as HTMLDivElement).style.backgroundColor = ""}
              style={{ color: torusTheme["text"], backgroundColor: selectedNode === item ? torusTheme["bgCard"] : "" }}
              className={`p-[0.87vw] cursor-pointer rounded mx-[0.2vw] transition-colors duration-300 ease-in-out`}
              onClick={() => handleNodeClick(item)}
            >
              <div style={{ color: torusTheme["text"] }} className="flex items-center gap-[0.87vw]">
                <Node />
                <span
                  style={{ fontSize: `${fontSize * 0.72}vw` }}
                  className="leading-[1.25vw]"
                >
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: torusTheme["bg"], borderColor: torusTheme["border"] }} className="flex flex-col w-[85%] h-full border rounded-lg">
        <hr style={{ borderColor: torusTheme["border"] }} className="w-full" />

        <div style={{ color: torusTheme["text"], backgroundColor: torusTheme["bg"] }} className="flex w-full h-[98%] rounded-lg">
          <div className="flex flex-col p-[0.58vw] gap-[0.87vw] w-[70%] h-full">
            <div style={{ color: torusTheme["text"], backgroundColor: torusTheme["bgCard"] }} className="flex w-full p-[1.46vw] gap-[0.58vw] rounded-lg">
              <div style={{ color: torusTheme["textOpacity/35"] }} className="flex gap-[0.87vw]">
                <div className="flex flex-col gap-[1.46vw] mt-[3vh]">
                  <div style={{ color: torusTheme["textOpacity/35"] }} className="flex flex-col gap-[0.58vw]">
                    <p
                      style={{ fontSize: `${fontSize * 0.62}vw`, color: torusTheme["textOpacity/35"] }}
                      className="text-end font-medium leading-[0.26vw]"
                    >
                      Process started at
                    </p>
                    <p
                      style={{ fontSize: `${fontSize * 0.62}vw`, color: torusTheme["textOpacity/35"] }}
                      className="text-nowrap font-medium leading-[0.26vw]"
                    >
                      {formatDate(selectedNode?.time)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[0.58vw] py-[1.25vw]">
                    <p
                      style={{ fontSize: `${fontSize * 0.62}vw`, color: torusTheme["textOpacity/35"] }}
                      className="text-end font-medium leading-[0.26vw]"
                    >
                      Finished at
                    </p>
                    <p
                      style={{ fontSize: `${fontSize * 0.62}vw`, color: torusTheme["textOpacity/35"] }}
                      className="text-nowrap font-medium leading-[0.26vw]"
                    >
                      {handleGetFinishingTime(selectedNode?.time).endTime}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center relative ">
                  <div style={{ backgroundColor: torusTheme["border"] }} className="absolute h-full w-px"></div>
                  <div className="flex flex-col">
                    <div className="flex items-center ">
                      <div style={{ backgroundColor: torusTheme["border"] }} className="h-[0.58vw] w-[0.58vw] rounded-full"></div>
                      <div className="h-[4.09vw]"></div>
                    </div>
                    <div className="flex items-center ">
                      <div style={{ backgroundColor: torusTheme["border"] }} className="h-[0.58vw] w-[0.58vw] rounded-full"></div>
                      <div className="h-[4.09vw]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-between ">
                <div>
                  <p
                    style={{ fontSize: `${fontSize * 0.83}vw`, color: torusTheme["text"] }}
                    className="font-medium text-nowrap leading-[1.04vw]"
                  >
                    {handleGetFinishingTime(selectedNode?.time).processingTime}
                  </p>
                </div>
                <div className="flex gap-[0.87vw] text-center">
                  <p
                    style={{
                      ...determineStatusColorClass(selectedNode?.status),
                      fontSize: `${fontSize * 0.62}vw`,
                    }}
                    className={`flex font-semibold text-center items-center leading-[1.04vw] px-2 rounded-full `}
                  >
                    {selectedNode ? selectedNode.status : status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: torusTheme["border"] }} className="w-[1px] h-full border" />

          <div
            style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"] }}
            className={`flex text-center p-[1.46vw] w-[45%] h-[98%]`}
          >
            <Tabs
              style={{ backgroundColor: torusTheme["bgCard"] }}
              className="w-full"
              selectedKey={activeTab}
              onSelectionChange={setActiveTab}
            >
              <TabList style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], color: torusTheme["text"] }} className="flex w-full border gap-[0.58vw] items-center rounded-md">
                <Tab
                  id="request"
                  style={{ fontSize: `${fontSize * 0.67}vw`, backgroundColor: activeTab === "request" ? torusTheme["bg"] : "" }}
                  className={`py-[0.58vw] w-1/3 text-center outline-none leading-[1.04vw] font-medium rounded-md`}
                >
                  Request
                </Tab>
                <Tab
                  id="response"
                  style={{ fontSize: `${fontSize * 0.67}vw`, backgroundColor: activeTab === "response" ? torusTheme["bg"] : "" }}
                  className={`py-[0.60vw] w-1/3 outline-none leading-[1.04vw] font-medium rounded-md`}
                >
                  Response
                </Tab>
                <Tab
                  id="exception"
                  style={{ fontSize: `${fontSize * 0.67}vw`, backgroundColor: activeTab === "exception" ? torusTheme["bg"] : "" }}
                  className={`py-[0.60vw] w-1/3 outline-none leading-[1.04vw] font-medium rounded-md`}
                >
                  Exception
                </Tab>
              </TabList>

              <div className="h-full overflow-scroll scrollbar-thin pt-[3vh] pl-[0.58vw]">
                {["request", "response", "exception"].map((tabId) => (
                  <TabPanel style={{ fontSize: `${fontSize * 1}vw` }} key={tabId} id={tabId}>
                    <JsonView
                      src={
                        selectedNode?.[tabId] ?? {
                          data: `no ${tabId} data available`,
                        }
                      }
                      theme="atom"
                      enableClipboard={false}
                      style={{ fill: "#1A2024" }}
                    />
                  </TabPanel>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artifactdetails;
