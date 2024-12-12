import React, { useEffect, useState } from "react";
import { AxiosService } from "../../../lib/utils/axiosService";
import {
  Pagination,
  TorusColumn,
  TorusRow,
  TorusTable,
  TorusTableHeader,
} from "./torusTable";
import { Button, Cell, Separator, TableBody } from "react-aria-components";
import { Clipboard } from "../../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { SiTicktick } from "react-icons/si";
import { capitalize } from "../../../lib/utils/utility";


const ProcessLogs = ({
  visibleColumns,
  searchValue,
  showNodeData,
  setShowNodeData,
  startDate,
  endDate,
  fabrics,
  users,
  appGrp,
  app,
  refetch
}: {
  visibleColumns: string[];
  searchValue: string;
  showNodeData: any;
  setShowNodeData: any;
  startDate: string | null;
  endDate: string | null;
  fabrics: Set<string>;
  users: Set<string>;
  appGrp: string[];
  app: string[];
  refetch: boolean
}) => {
  const [data, setData] = useState<any>([]);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const [ currentPage , setCurrentPage ] = useState(1);
  const [totalPages , setTotalPages] = useState(1)

  const suffixes: any = {
    DF: ["DFD", "ERD"],
    UF: ["UFD"],
    PF: ["PFD"],
  };
  function formatDate(dateString: string | null) {
    if (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      return undefined;
    }
  }

  function formatTableDate(dateString: string) {
    const date = new Date(dateString);

    const options = {
      month: "long", // Full month name
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    return new Intl.DateTimeFormat("en-US", options as any).format(date);
  }

  // const getProcessLogs = async () => {
  //   setLoading(true);
  //   setData([]);
  //   try {
  //     const res = await AxiosService.post("/api/clientProcessLog", {
  //       client: clientCode,
  //       fabric: fabrics.size
  //         ? Array.from(fabrics).flatMap((prefix: any) =>
  //             suffixes[prefix].map((suffix: any) => `${prefix}-${suffix}`)
  //           )
  //         : ["DF-DFD", "DF-ERD", "PF-PFD", "UF-UFD"],
  //       user: users.size ? Array.from(users) : ["test"],
  //       FromDate: formatDate(startDate),
  //       ToDate: formatDate(endDate),
  //     });
  //     if (res.status == 201) {
  //       const result = res.data.map((item: any) => {
  //         const nodeDetails = (Object.values(item["AFSK"])[0] as any).map(
  //           (nodeObj: any) => ({
  //             nodeName: nodeObj["processInfo"]["nodeName"],
  //             status: nodeObj["processInfo"]["status"],
  //             time: nodeObj["DateAndTime"],
  //           })
  //         );

  //         return {
  //           jobName: {
  //             artifact: item["AFK"],
  //             grpDetails: `${item["CATK"]} > ${item["AFGK"]}`,
  //             processId: Object.keys(item["AFSK"])[0],
  //           },
  //           fabric: item["FNK"].includes("PF")
  //             ? "PROCESS"
  //             : item["FNK"].includes("DF")
  //               ? "DATA"
  //               : "UI",
  //           jobType: "PROCESS",
  //           version: item["AFVK"],
  //           status: nodeDetails
  //             .map((node: any) => node.status)
  //             .includes("Failed")
  //             ? "Failed"
  //             : "Success",
  //           node: nodeDetails.map((node: any) => node.nodeName),
  //           time: nodeDetails.map((node: any) => node.time),
  //         };
  //       });
  //       setData(result);
  //     } else {
  //       setLoading(false);
  //     }
  //   } catch (error: any) {
  //     setLoading(false);
  //     const message = error?.response?.data?.error
  //       ? error?.response?.data?.errorDetails
  //       : "Error Fetching Process Logs Data";
  //     toast(
  //       <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
  //       {
  //         type: "error",
  //         position: "bottom-right",
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //         title: "Error",
  //         text: `${message}`,
  //         closeButton: false,
  //       } as any
  //     );
  //   }
  // };

  const getTenantProcessLogs = async () => {
    setLoading(true);
    setData([]);
    try {
      const res = await AxiosService.post("/api/tenantProcessLog", {
        fabric: fabrics.size
          ? Array.from(fabrics).flatMap((prefix: any) =>
            suffixes[prefix].map((suffix: any) => `${prefix}-${suffix}`)
          )
          : ["DF-DFD", "DF-ERD", "PF-PFD", "UF-UFD"],
        tenant: tenant,
        appGroup: appGrp.length ? appGrp : [],
        app: app.length ? app : [],
        user: users.size ? Array.from(users) : undefined,
        FromDate: formatDate(startDate),
        ToDate: formatDate(endDate),
        page: currentPage,
        limit : 10,
        searchParam: searchValue
      });

      if (res.status == 201) {
        // const result = res?.data?.data?.map((item: any) => {
          
        //   const nodeDetails = (Object.values(item["AFSK"])[0] as any).map(
        //     (nodeObj: any) => ({
        //       nodeData: {
        //         name: nodeObj["processInfo"]["nodeName"],
        //         request: nodeObj["processInfo"]["request"],
        //         response: nodeObj["processInfo"]["response"],
        //         time: nodeObj["DateAndTime"],
        //         status: nodeObj["processInfo"]["status"],
        //         exception: nodeObj["errorDetails"],
        //       },
        //       status: nodeObj["processInfo"]["status"],
        //       time: nodeObj["DateAndTime"],
        //       processId: Object.keys(item["AFSK"])[0],


        //     })
        //   );

        //   return {
        //     artifactName: {
        //       artifact: item["AFK"],
        //       grpDetails: `${item["CATK"]} > ${item["AFGK"]}`,
        //       processId: Object.keys(item["AFSK"])[0],
        //     },
        //     fabric: item["FNK"].includes("PF")
        //       ? "PROCESS"
        //       : item["FNK"].includes("DF")
        //         ? "DATA"
        //         : "UI",
        //     jobType: "PROCESS",
        //     version: item["AFVK"],
        //     status: nodeDetails.some((node: any) => node.status === "Failed")
        //       ? "Failed"
        //       : "Success",
        //     node: nodeDetails.map((node: any) => node.nodeData),
        //     time: nodeDetails.map((node: any) => node.time),
        //     processId: Object.keys(item["AFSK"])[0],
        //     artifact: item["AFK"],
        //     grpDetails: `${item["CATK"]} > ${item["AFGK"]}`,
        //   };
        // });

        const result = res?.data?.data?.map((item: any) => {
          const processId = Object.keys(item["AFSK"])[0];
          const nodes = item["AFSK"][processId];
          const artifact = item["AFK"];
          const grpDetails = `${item["CATK"]} > ${item["AFGK"]}`;
          const fabric = item["FNK"].includes("PF") ? "PROCESS" : item["FNK"].includes("DF") ? "DATA" : "UI";
          let overallStatus = "Success";
        
          // Map nodes and check status in a single pass
          const nodeDetails = nodes.map((nodeObj: any) => {
            const { processInfo, DateAndTime, errorDetails } = nodeObj;
            const nodeStatus = processInfo.status;
        
            // Update the overall status if any node fails
            if (nodeStatus === "Failed") overallStatus = "Failed";
        
            return {
              nodeData: {
                name: processInfo.nodeName,
                request: processInfo.request,
                response: processInfo.response,
                time: DateAndTime,
                status: nodeStatus,
                exception: errorDetails,
              },
              status: nodeStatus,
              time: DateAndTime,
              processId,
            };
          });
        
          return {
            artifactName: {
              artifact,
              grpDetails,
              processId,
            },
            fabric,
            jobType: "PROCESS",
            version: item["AFVK"],
            status: overallStatus,
            node: nodeDetails.map((node: any) => node.nodeData),
            time: nodeDetails.map((node: any) => node.time),
            processId,
            artifact,
            grpDetails,
          };
        });
        
        
   
        setData(result);
        setTotalPages(res?.data?.totalPages)
        setLoading(false);
       
      }


      else {
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  console.log( "currentPage" , currentPage);
  

  useEffect(() => {
    getTenantProcessLogs();
  }, [refetch , currentPage, searchValue]);

  const displayNodeData = (data: any, type: "node" | "time" | "status") => {
    switch (type) {
      case "node":
        return (
          <div className="flex flex-col items-center justify-center gap-[0.5vh] w-full h-full">
            {data.node.map((item: any) => (
              <div
                key={item}
                className="leading-[1.34vh] font-medium"
                style={{ fontSize: `${fontSize * 0.72}vw` }}
              >
                {item.name}
              </div>
            ))}
          </div>
        );
      case "time":
        return (
          <div className="flex flex-col items-center justify-center gap-[0.5vh] w-full h-full">
            {data.time.map((item: any) => (
              <div
                key={item}
                className="leading-[1.34vh] font-medium"
                style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.72}vw` }}
              >
                {formatTableDate(item)}
              </div>
            ))}
          </div>
        );
      case "status":
        if (data.status == "Failed") {
          return (
            <div
              className={`px-[0.87vw] py-[0.29vw] text-center rounded-full text-white bg-red-500`}
              style={{ fontSize: `${fontSize * 0.625}vw` }}
            >
              Failed
            </div>
          );
        } else {
          return (
            <div
              className={`px-[0.87vw] py-[0.29vw] text-center rounded-full text-white bg-green-500`}
              style={{ fontSize: `${fontSize * 0.625}vw` }}
            >
              Success
            </div>
          );
        }
      default:
        return <></>;
    }
  };

  const displayArtifactName = (datas: any) => {
    const { artifactName } = datas;
    const { artifact, grpDetails, processId } = artifactName;

    const handleCopyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(processId);
        setCopied(processId);
        setTimeout(() => {
          setCopied(null);
        }, 1000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    };

    return (
      <div
        onClick={() => setShowNodeData(datas)}
        className="flex flex-col gap-[0.29vw]"
      >
        <div className="leading-[1.85vh] font-bold"
          style={{ fontSize: `${fontSize * 0.833}vw` }}
        >
          {capitalize(artifact)}
        </div>
        <div className="leading-[1.85vh]"
          style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.625}vw` }}>
          {grpDetails}
        </div>
        {processId && (
          <div className="flex items-center gap-1 leading-[1.85vh] font-medium border rounded-full p-1"
            style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.625}vw` }}>
            UID: {processId}
            <Button className={"outline-none"} onPress={handleCopyToClipboard}>
              {copied && copied === processId ? (
                <SiTicktick size={8} className="text-green-500" />
              ) : (
                <Clipboard fill={torusTheme["text"]} />
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const RenderTableCell = (item: any, column: any) => {
    switch (column?.id) {
      case "artifactName":
        return displayArtifactName(item);
      case "version":
        return (
          <div className="leading-[1.34vh] font-medium" style={{ fontSize: `${fontSize * 0.72}vw` }}>
            {item.version}
          </div>
        );
      case "fabric":
        return (
          <div className="leading-[1.34vh] font-medium" style={{ fontSize: `${fontSize * 0.72}vw` }}>
            {item.fabric}
          </div>
        );
      case "jobType":
        return (
          <div className="leading-[1.34vh] font-medium" style={{ fontSize: `${fontSize * 0.72}vw` }}>
            {item.jobType}
          </div>
        );
      case "status":
        return displayNodeData(item, "status");
      case "node":
        return displayNodeData(item, "node");
      case "time":
        return displayNodeData(item, "time");
      default:
        return "none";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TorusTable
        primaryColumn="artifactName"
        tableData={data}
        visibleColumns={visibleColumns}
        isSkeleton={true}
        searchValue={searchValue}
        rowsPerPage="10"
        loading={loading}
        chwop={`${totalPages > 1 ? 70 : totalPages < 1 ? 74 : 68}`}
        chwp="68"
        contentLessText={loading ? "Loading..." : "Process log Details not found"}
        isPaginationRequired={false}
      >
        {({ selectedKeys, filterColmns, sortedItems, primaryColumn, styles }: any) => (
          <>
            <TorusTableHeader
              selectedKeys={selectedKeys}
              columns={[...filterColmns]}
            >
              {({ columns }: any) => (
                <>
                  {columns.map((column: any, i: number) => (
                    <TorusColumn
                      key={column.id}
                      id={column.id}
                      allowsSorting={column.allowsSorting}
                      isRowHeader={column.isRowHeader}
                      className={`leading-[2.22vh] font-medium cursor-pointer ${i == 0 ? "rounded-tl-xl rounded-bl-xl" : ""
                        } ${i == filterColmns.length - 1
                          ? "rounded-tr-xl rounded-br-xl"
                          : ""
                        }`}
                      style={{
                        backgroundColor: torusTheme["bgCard"],
                        color: torusTheme["text"],
                        fontSize: `${fontSize * 0.72}vw`
                      }}
                    >
                      {column.name}
                    </TorusColumn>
                  ))}
                </>
              )}
            </TorusTableHeader>
            <Separator className="dark:border-[#212121] border border-black" />
            {/* <span className="h-[500px] overflow-y-scroll"> */}
           
            <TableBody>
              {sortedItems.map((item: any, index: number) => (
                <TorusRow
                  key={index}
                  item={item}
                  id={index}
                  index={item[primaryColumn]}
                  columns={[...filterColmns]}
                  selectedKeys={selectedKeys}
                  className=
                  "border-1 outline-none hover:cursor-pointer border-b-slate-800 overflow-y-auto border-t-transparent border-l-transparent border-r-transparent"
                  onHoverStart={(e: any) => e.target.style.backgroundColor = torusTheme["bgCard"]}
                  onHoverEnd={(e: any) => e.target.style.backgroundColor = ""}
                >
                  {({ columns, index, item }: any) => (
                    <>
                      {columns.map((column: any, i: number) => (
                        <Cell
                          key={i}
                          className={"border-b border-transparent "}
                        >
                          {
                            <div className="w-full h-full flex flex-col items-center justify-center py-[1rem]">
                              {RenderTableCell(item, column)}
                            </div>
                          }
                        </Cell>
                      ))}
                    </>
                  )}
                </TorusRow>
              ))}
            </TableBody>
            
            {/* </span> */}
          </>
        )}
      </TorusTable>
      <div className="absolute flex items-center justify-center w-[90%] bottom-[4vh]">
     {totalPages > 1 && <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />}
      </div>
    </div>
  );
};

export default ProcessLogs;
