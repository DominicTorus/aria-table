import React, { useEffect, useState } from "react";
import {
  Pagination,
  TorusColumn,
  TorusRow,
  TorusTable,
  TorusTableHeader,
} from "./torusTable";
import { Cell, TableBody } from "react-aria-components";
import { AxiosService } from "../../../lib/utils/axiosService";
import { toast } from "react-toastify";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import TorusToast from "./torusToast";
import { Clipboard } from "../../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { error } from "console";

const ExceptionLog = ({
  visibleColumns,
  searchValue,
  fabrics,
  users,
  startDate,
  endDate,
  appGrp,
  app,
  refetch,
}: {
  visibleColumns: string[];
  searchValue: string;
  fabrics: Set<string>;
  users: Set<string>;
  startDate: string | null;
  endDate: string | null;
  appGrp: string[];
  app: string[];
  refetch: boolean;
}) => {
  const [data, setData] = useState<any[]>([]);
  const [tabdata, setTabData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)

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
  const getTenantExceptionLogs = async () => {
    setLoading(true);
    setData([]);
    try {
      const res = await AxiosService.post("/api/tenantExceptionLog", {
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
        limit: 10,
        searchParam: searchValue
      });
      if (res.status == 201) {
        const result = res?.data?.data?.map((item: any) => {
          const artifact = item["AFK"];
          const grpDetails = `${item["CATK"]} > ${item["AFGK"]}`;
          const version = item["AFVK"];
          const fabric = item["FNK"];

          if (fabric === "UF-UFD") {
            const user: any[] = [];
            const timeStamp: any[] = [];
            const errorCode: any[] = [];
            const errorDescription: any[] = [];

            // Loop through logInfo array just once
            item["AFSK"].logInfo.forEach((nodeObj: any) => {
              const { sessionInfo, DateAndTime, errorDetails, processInfo } = nodeObj;
              const { T_ErrorCode, errorDetail } = errorDetails || {};

              user.push(sessionInfo);
              timeStamp.push(DateAndTime);
              errorCode.push(T_ErrorCode);
              errorDescription.push(errorDetail);
            });

            return {
              artifactName: {
                artifact,
                grpDetails,
              },
              version,
              user,
              timeStamp,
              errorCode,
              errorDescription,
            };
          } else {
            // Handle other cases when FNK is not "UF-UFD"
            const errorInfoArray = item["AFSK"].logInfo.map((nodeObj: any) => ({
              user: nodeObj["sessionInfo"],
              time: nodeObj["DateAndTime"],
              errorDetails: nodeObj["errorInfo"],
              nodeobj: {
                errorCode: nodeObj["errorInfo"]["T_ErrorCode"],
                errorDescription: nodeObj["errorInfo"]["errorDetail"],
              },
              processInfo: nodeObj["processInfo"],
            }));

            return {
              artifactName: {
                artifact: item["AFK"],
                grpDetails: `${item["CATK"]} > ${item["AFGK"]}`,
              },
              version: item["AFVK"],
              user: errorInfoArray.map((item: any) => item.user),
              timeStamp: errorInfoArray.map((item: any) => item.time),
              errorCode: errorInfoArray.map((item: any) => item?.nodeobj?.errorCode),
              errorDescription: errorInfoArray.map((item: any) => item?.nodeobj?.errorDescription),
              errorDetails: errorInfoArray.map((item: any) => ({
                nodeName: item.processInfo?.key,
                nodeId: item.processInfo?.key,
                mode: item.processInfo?.key,
                ...item.errorDetails,
              })),
            };
          }
        });
        setLoading(false);
        setData(result);
        setTotalPages(res?.data?.totalPages)
        setTabData(result[0]);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };
  console.log("currentPage", currentPage);
  useEffect(() => {
    getTenantExceptionLogs();
  }, [refetch, currentPage, searchValue]);




  const displaysessioninfo = (
    data: any,
    type: "user" | "time" | "errorCode" | "errorDescription"
  ) => {
    console.log(data, "data");

    switch (type) {
      case "user":
        return (
          <div>
            {Array.from(new Set(data.user.map((session: any) => session.user)))
              .map((user: any) =>
                data.user.find((session: any) => session.user === user)
              )
              .map((session: any, index: number) => (
                <div
                  key={index}
                  className="font-medium"
                  style={{ fontSize: `${fontSize * 0.83}vw` }}
                >
                  <div>{session.user || "NA"}</div>
                  <div>
                    {session.accessProfile && session.accessProfile.length > 0 ? (
                      session.accessProfile.map((t: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            color: torusTheme["textOpacity/35"],
                            fontSize: `${fontSize * 0.73}vw`,
                          }}
                        >
                          {t}
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
          </div>

        );

      case "time":
        return (
          <div
            className="flex flex-col items-center justify-center gap-[1vh] w-full h-full"
            style={{
              color: torusTheme["textOpacity/35"],
              fontSize: `${fontSize * 0.83}vw`,
            }}
          >
            {data.timeStamp.map((item: any, index: number) => (
              <div
                onClick={() => handleTimestampClick(index)}
                className="leading-[1.34vh] font-medium"
                style={{ fontSize: `${fontSize * 0.72}vw` }}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        );

      case "errorCode":
        return (
          <div
            className="flex flex-col items-center justify-center gap-[1vh] w-full h-full"
            style={{
              color: torusTheme["textOpacity/35"],
              fontSize: `${fontSize * 0.73}vw`,
            }}
          >
            {data.errorCode && data.errorCode.length > 0 ? (
              data.errorCode.map((item: any, index: number) => (
                <div key={index}>{item || "No error code available"}</div>
              ))
            ) : (
              <div>No error code available</div>
            )}
          </div>
        );

      case "errorDescription":
        return (
          <div
            className="flex flex-col items-center justify-center gap-[1vh] w-full h-full"
            style={{
              color: torusTheme["textOpacity/35"],
              fontSize: `${fontSize * 0.73}vw`,
            }}
          >
            {data.errorDescription && data.errorDescription.length > 0 ? (
              data.errorDescription.map((item: any, index: number) => (
                <div key={index}>{item || "No error description available"}</div>
              ))
            ) : (
              <div>No error description available</div>
            )}
          </div>
        );

      default:
        return <></>;
    }
  };



  const handleTimestampClick = (index: number) => {
    setTabData(data[index]);
  };


  const displayjobname = (datas: any) => {
    const { artifactName } = datas;
    const { artifact, grpDetails } = artifactName;

    return (
      <div className="flex flex-col gap-[0.29vw]">
        <div className="leading-[1.85vh]" style={{ fontSize: `${fontSize * 0.833}vw` }}>
          {artifact}
        </div>
        <div className="leading-[1.85vh]" style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.625}vw` }}>
          {grpDetails}
        </div>
      </div>
    );
  };


  const RenderTableCell = (item: any, column: any) => {
    switch (column?.id) {
      case "artifactName":
        return displayjobname(item);
      case "version":
        return <div style={{ fontSize: `${fontSize * 0.83}vw` }} className="font-medium">{item.version}</div>;
      case "user":
        return displaysessioninfo(item, "user");
      case "timeStamp":
        return displaysessioninfo(item, "time");
      case "errorCode":
        return displaysessioninfo(item, "errorCode");
      case "errorDescription":
        return displaysessioninfo(item, "errorDescription");
      default:
        return "none";
    }
  }


  const handleRowAction = (item: any) => {
    if (item.errorDetails) {
      setTabData(item);
    } else {
      console.log("Action not found");
    }
  };

  return (
    <div className="flex w-full h-full  gap-2">
      <div className="w-[100%] h-full ml-[0.58vw] ">
        <TorusTable
          primaryColumn="artifactName"
          tableData={data}
          visibleColumns={visibleColumns}
          rowsPerPage="10"
          isSkeleton={true}
          chwop={"67"}
          contentLessText={
            loading ? "Loading..." : "Torus log Details not available"
          }
          isPaginationRequired={false}
        >
          {({
            selectedKeys,
            filterColmns,
            sortedItems,
            primaryColumn,
          }: any) => (
            <>
              <TorusTableHeader
                className=""
                selectedKeys={selectedKeys}
                columns={[...filterColmns]}
                style={{ backgroundColor: torusTheme["bgCard"] }}
              >
                {({ columns }: any) => (
                  <>
                    {columns.map((column: any, i: number) => (
                      <TorusColumn
                        key={column.id}
                        id={column.id}
                        allowsSorting={column.allowsSorting}
                        isRowHeader={column.isRowHeader}
                        className={`leading-[2.22vh] font-medium cursor-pointer  ${i == 0 ? "rounded-tl-xl rounded-bl-xl" : ""
                          } ${i == filterColmns.length - 1
                            ? "rounded-tr-xl rounded-br-xl"
                            : ""
                          }`}
                        style={{
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                          fontSize: `${fontSize * 0.72}vw`,
                        }}
                      >
                        {column.name}
                      </TorusColumn>
                    ))}
                  </>
                )}
              </TorusTableHeader>
              <TableBody
                className={"overflow-y-auto  "}
              >
                {sortedItems.map((item: any, index: number) => (
                  <TorusRow
                    key={index}
                    item={item}
                    id={index}
                    index={item[primaryColumn]}
                    columns={[...filterColmns]}
                    selectedKeys={selectedKeys}
                    className={`${item.timeStamp == tabdata?.timeStamp}
                      ? "bg-red-300 rounded-full"
                      : ""
                      }hover:bg-[#F4F5F9] outline-none hover:cursor-pointer`}
                    onAction={handleRowAction}
                    style={{
                      backgroundColor: torusTheme["bg"],
                      color: torusTheme["text"],
                    }}
                  >
                    {({ columns, index, item }: any) => (
                      <>
                        {columns.map((column: any, i: number) => (
                          <Cell
                            key={i}
                            className={`border-b border-transparent ${item.timeStamp == tabdata?.timeStamp
                                ? i == 0
                                  ? " rounded-tl-2xl rounded-bl-2xl"
                                  : i == columns.length - 1
                                    ? "rounded-tr-2xl rounded-br-2xl"
                                    : ""
                                : ""
                              }`}
                            style={{
                              backgroundColor:
                                item.timeStamp == tabdata?.timeStamp
                                  ? torusTheme["bgCard"]
                                  : "",
                            }}
                          >
                            {
                              <div
                                className="w-full h-full flex flex-col items-center justify-center py-[1rem] leading-[1.85vh]"
                                style={{ fontSize: `${fontSize * 1}vw` }}
                              >
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
            </>
          )}
        </TorusTable>
      </div>
      <hr
        className="w-[1px] h-[95%]"
        style={{ borderColor: torusTheme["border"] }}
      />
      <div
        className="w-[28%] h-[90%] mt-[0.58vw] mr-[0.87vw] items-center rounded-lg "
        style={{ backgroundColor: torusTheme["bgCard"] }}
      >
        <p
          className="leading-[2.22vh] p-[0.87vw] font-semibold text-left"
          style={{
            color: torusTheme["text"],
            fontSize: `${fontSize * 0.93}vw`,
          }}
        >
          Error Details
        </p>
        <div className="w-full h-[85%] ml-4 overflow-scroll scrollbar-thin">
          {tabdata ? (
            <JsonView
              theme="atom"
              enableClipboard={false}
              src={tabdata.errorDetails ?? {data : 'data not available'}}
              style={{ fontSize: "0.833vw" }}
            // collapsed={true}
            // collapseObjectsAfterLength={2}
            />
          ) : (
            <p>No Data available</p>
          )}
        </div>
      </div>
      <div className="absolute flex items-center justify-center w-[90%] right-[10vw]  bottom-[4vh] ">

        {totalPages > 1 && <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />}
      </div>
    </div>
  );
};

export default ExceptionLog;
