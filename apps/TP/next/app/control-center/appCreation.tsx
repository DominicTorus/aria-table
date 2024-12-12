import _ from "lodash";
import React, { useMemo, useState } from "react";
import { Button, Input } from "react-aria-components";
import {
  BuilderShareIcon,
  Clipboard,
  PlusIcon,
  RenameIcon,
} from "../constants/svgApplications";
import { toast } from "react-toastify";
import TorusToast from "../components/torusComponents/torusToast";
import { Pagination } from "../components/torusComponents/torusTable";
import { FaClipboardCheck } from "react-icons/fa";
import TorusDialog from "../components/torusComponents/torusdialogmodal";
import ApplicationModal from "./addApplicationModal";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";
import { handleSelectGroupandMembers } from "../../lib/utils/utility";
import {  useRouter } from "next/navigation";

const AppCreationTable = ({
  data,
  onUpdate,
  assetType = "APPS",
  appsPerPage = 2,
  searchTerm,
  access,
  selectedItems,
  setSelectedItems
}: {
  data: any[];
  onUpdate: any;
  assetType?: string;
  appsPerPage?: number;
  searchTerm: string;
  access: "view" | "edit" | null;
  selectedItems: Record<string, boolean>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState<null | string>(null);
  const [wordLength, setWordLength] = useState(0);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [copyState, setCopyState] = useState({});
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const [hoveredApp  , setHoveredApp] = useState<string | null>(null);
 

  const columns = [
    {
      header: "Status",
      key: "status",
      className: "w-[6.28vw]",
      childclassName: "w-[6.28vw] ml-[0.29vw]",
    },
    {
      header: "Apps",
      key: "apps",
      className: "w-[10vw]",
      childclassName: "w-[10vw] ml-[0.58vw]",
    },
    {
      header: "App Path",
      key: "appPath",
      className: "w-[4.68vw]",
      childclassName: "w-[4.68vw] ml-[0.83vw] truncate group/appPath",
    },
    {
      header: "Environment",
      key: "env",
      className: "w-[6vw]",
      childclassName: "w-[6vw] ml-[0.58vw]",
    },
    {
      header: "Hostname Server",
      key: "HostName",
      className: "w-[8vw] text-nowrap",
      childclassName: "w-[8vw]",
    },
    {
      header: "Host IP",
      key: "HostIP",
      className: "w-[6.145vw]",
      childclassName: "w-[6.145vw] ",
    },
    {
      header: "Volume Path",
      key: "volumePath",
      className: "w-[7.61vw] ",
      childclassName: "w-[7.61vw] ml-[0.58vw] ",
    },
    {
      header: "Access URL",
      key: "accessUrl",
      className: "w-[11.61vw]",
      childclassName: "w-[11.61vw] ml-[0.29vw]",
    },
  ];

  

  const filteredData = Object.entries(data)
    .filter(([key, value]) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (Array.isArray(value)) {
        return value.some((role) => {
          return Object.values(role).some((val) => {
            return (
              typeof val === "string" &&
              val.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
        });
      } else {
        return Object.values(value).some((val) => {
          if (typeof val === "string") {
            return val.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (Array.isArray(val)) {
            return val.some((role) => {
              return Object.values(role).some((v) => {
                return (
                  typeof v === "string" &&
                  v.toLowerCase().includes(searchTerm.toLowerCase())
                );
              });
            });
          }
        });
      }
    })
    .map(([key, value], index) => ({ ...value, originalIndex: key }));

  const currentGroups = useMemo(() => {
    const indexOfLastGroup = currentPage * appsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - appsPerPage;

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup);
  }, [data, filteredData, currentPage, onUpdate, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / appsPerPage);
  }, [data, filteredData, currentPage, appsPerPage]);

  

  const handleSetEditingCell = (path: string) => {
    setEditingCell(path);
  };

  const handleValueChange = (path: string, value: string) => {
    handleUpdateData(value, path);
    setEditingCell(null);
  };

  const handleUpdateData = (newContent: any, path: any) => {
    if (path) {
      const js = structuredClone(data);
      _.set(js as any, path, newContent);
      onUpdate(js);
    }
  };

  const handleAddAppGroup = () => {
    const newAG = { code: "", name: "", APPS: [] };
    if (data.length) {
      if (data.find((ag) => JSON.stringify(ag) == JSON.stringify(newAG))) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "warning",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Warning",
            text: `App Group already created`,
            closeButton: false,
          } as any
        );
        return;
      }
      handleUpdateData(newAG, data.length);
      if(currentGroups.length == appsPerPage){
        setCurrentPage((prev) => prev + 1);
      }
    } else {
      onUpdate([newAG]);
    }
  };

  const handleSelect = (path: string, isParent: boolean = false) => {
    handleSelectGroupandMembers(path, isParent, assetType, setSelectedItems, data)
  };

  const handleCopyState = async (path: string, value: string) => {
    setCopyState({ [path]: true });
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      setCopyState({ [path]: true });
    }, 1000);
  };

  const RenderColumns = (
    app: any,
    field: (typeof columns)[0],
    copyState: Record<string, boolean>,
    handleCopyState: (path: string, value: string) => void,
    parentPath: string,
    ag: any
  
  ) => {
    switch (field.key) {
      case "status":
        if (app[field.key] && app[field.key].toLowerCase() == "active") {
          return (
            <div className="bg-[#00CE7D] rounded  text-white  text-center w-3/4 px-[0.29vw] py-[0.29vw]">
              {app[field.key]}
            </div>
          );
        } else {
          return (
            <div className="bg-[#F14336] rounded-full  text-white text-center w-3/4 px-[0.29vw] py-[0.29vw]">
              {app[field.key] ?? "inactive"}
            </div>
          );
        }
      case "apps":
        return (
          <div className="flex flex-col w-full ">
            <span>{app["name"]}</span>
            <span style={{ color: torusTheme["textOpacity/50"] }}>
              {app["code"]} | {app["version"] ?? "v1"}
            </span>
          </div>
        );
      case "accessUrl":
        if (app["accessUrl"]) {
          return (
            <div className="flex gap-[0.29vw] bg-[F4F5F9]">
              <span>{app["accessUrl"]}</span>
              <span
                onClick={() =>
                  handleCopyState(parentPath + ".accessUrl", app["accessUrl"])
                }
              >
                {copyState[parentPath + ".accessUrl"] ? (
                  <FaClipboardCheck className="text-green-500 " />
                ) : (
                  <Clipboard width="0.83vw" height="0.83vw" />
                )}
              </span>
            </div>
          );
        } else {
          return (
            <Button
              style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.62}vw` }}
              className={`text-white  rounded  flex items-center outline-none px-[0.4vw] py-[0.62vh]`}
            >
              <span onClick={() => router.push(`/?ag=${ag}&app=${app['code']}`)}>{locale["Go to Build"]}</span>{" "}
              <BuilderShareIcon className="w-[1vw] h-[1vw] " />
            </Button>
          );
        }
      case "appPath":
        return (
          <div className="flex flex-col">
            {app["appPath"] && app["appPath"]?.length > 8 ? <span className="absolute z-50 bottom-[3.5vh] group-hover/appPath:opacity-100 opacity-0 border p-[0.2vw] flex items-center rounded" style={{width : "max-content"}}>{app["appPath"]}</span> : null}
            <span className="max-w-[80px] truncate">{app["appPath"]}</span>
          </div>
      )  
      default:
        return <div>{app[field.key]}</div>;
    }
  };

  return (
    <div>
      <button
        id="add-appGrp"
        onClick={handleAddAppGroup}
        className="hidden"
      ></button>
      <div>
        {currentGroups.map((ag: any) => (
          <div key={ag.code} className="w-[84.73vw]">
            <div className="flex justify-between items-center group">
              <div className="flex gap-[0.83vw] my-[2.07vh] items-center h-[4.07vh]">
                <input
                  type="checkbox"
                  style={{ accentColor }}
                  className="w-[0.85vw] ml-[0.53vw] h-[1.04vw] rounded-[0.3vw]"
                  checked={!!selectedItems[`${ag.originalIndex}`]}
                  onChange={() => handleSelect(`${ag.originalIndex}`, true)}
                  aria-labelledby={`ag-${ag.code}`}
                  disabled={access != "edit"}
                />
                {["name", "code"].map((field, index) => {
                  return (
                    <div
                      key={field + index}
                      className={`${field == "code" ? "w-[15.65vw]" : "w-[29.63vw]"} h-full flex items-center px-[0.29vw]`}
                      style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                      onDoubleClick={() => {
                        if (field === "name") {
                          handleSetEditingCell(`${ag.originalIndex}.${field}`);
                        }
                      }}
                    >
                      {(editingCell &&
                        editingCell == `${ag.originalIndex}.${field}`) ||
                        !(ag as any)[field] ? (
                        <Input
                          type="text"
                          defaultValue={(ag as any)[field]}
                          placeholder={locale[`Enter application group ${field} here`]}
                          onFocus={() =>
                            handleSetEditingCell(`${ag.originalIndex}.${field}`)
                          }
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              handleValueChange(
                                `${ag.originalIndex}.${field}`,
                                e.target.value
                              );
                            }
                          }}
                          onBlur={(e) => {
                            handleValueChange(
                              `${ag.originalIndex}.${field}`,
                              e.target.value
                            );
                          }}
                          className="outline-none w-full"
                          style={{ backgroundColor: torusTheme["bgCard"] }}

                          disabled={access != "edit"}
                        />
                      ) : (
                        (ag as any)[field]
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex w-[84.73vw]  justify-between group"
              style={{ backgroundColor: torusTheme["bgCard"] }}>
              <div
                className="flex gap-[0.87vw]  rounded-md items-center h-[4.85vh] "
                role="row"
              >
                <div className="w-[0.8vw] ml-[0.58vw]" role="columnheader">
                  <input
                    type="checkbox"
                    style={{ accentColor }}
                    className="w-[0.8vw] h-[1.04vw] rounded-[0.3vw] "
                    checked={!!selectedItems[`${ag.originalIndex}.${assetType}`]}
                    onChange={() => handleSelect(`${ag.originalIndex}.${assetType}`, true)}
                    aria-labelledby={`ag-${ag.code}`}
                    disabled={access != "edit"}
                  />
                </div>
                {columns.map((field, index) => (
                  <div
                    key={field.key + index}
                    className={`font-semibold hover:bg-[#F4F5F9] leading-[1.85vh] p-[0.58vw] ${field.className}`}
                    style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                    role="columnheader"
                  >
                    {locale[field.header]}
                  </div>
                ))}
              </div>
              <TorusDialog
                classNames={{ dialogClassName: `focus:outline-none border rounded` }}
                styles={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], borderColor: torusTheme["border"] }}
                triggerElement={
                  <Button
                    style={{ backgroundColor: accentColor }}
                    className={
                      `outline-none px-[0.4vw]  py-[0.29vw] rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-default`

                    }
                    isDisabled={!ag.code ? true : access != 'edit'}
                  >
                    <PlusIcon fill="white" width="1.25vw" height="1.25vw" />
                  </Button>
                }
              >
                {({ close }: any) => (
                  <ApplicationModal
                    parentPath={`${ag.originalIndex}.${assetType}.${ag[assetType].length}`}
                    data={data}
                    handleUpdateData={handleUpdateData}
                    close={close}
                  />
                )}
              </TorusDialog>
            </div>
            <div style={{height : ag[assetType].length > 2 ? "23vh" : undefined  , overflowY : ag[assetType].length > 2 ? "scroll" : undefined}}>
              {(ag[assetType] as any).map((app: any, memberIndex: number) => {
                const parentPath = `${ag.originalIndex}.${assetType}.${memberIndex}`;
                return (
                  <div className="flex flex-col rounded" style={{ backgroundColor: hoveredApp == parentPath ? torusTheme["bgCard"] : undefined }} onMouseEnter={() => setHoveredApp(parentPath)} onMouseLeave={() => setHoveredApp(null)} key={parentPath}>
                    <div
                      key={memberIndex}
                      className="flex w-full items-center gap-[0.58vw] p-[0.58vw] leading-[1.77vh] group relative"
                      style={{color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                      role="row"
                    >
                      <div className="w-[0.8vw] " role="cell">
                        <input
                          type="checkbox"
                          style={{ accentColor }}
                          className="w-[0.8vw] h-[1.04vw] rounded-[0.3vw]"
                          checked={!!selectedItems[`${parentPath}`]}
                          onChange={() => handleSelect(`${parentPath}`)}
                          disabled={access != "edit"}
                        />
                      </div>

                      {columns.map((field) => (
                        <div
                          key={field.key}
                          className={field.childclassName}
                          role="cell"
                        >
                          {RenderColumns(
                            app,
                            field,
                            copyState,
                            handleCopyState,
                            parentPath,
                            ag['code']
                          )}
                        </div>
                      ))}
                      <TorusDialog
                        classNames={{ dialogClassName: `focus:outline-none border rounded ` }}
                        styles={{ color: torusTheme["text"], borderColor: torusTheme["border"] }}
                        triggerElement={
                          <Button
                            className=
                              "outline-none px-[0.4vw] py-[0.29vw] rounded-md   opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-default"
                            
                            isDisabled={!ag.code ? true : access != 'edit'}
                          >
                            <RenameIcon fill={torusTheme["text"]} />
                          </Button>
                        }
                      >
                        {({ close }: any) => (
                          <ApplicationModal
                            parentPath={`${ag.originalIndex}.${assetType}.${memberIndex}`}
                            data={data}
                            handleUpdateData={handleUpdateData}
                            close={close}
                          />
                        )}
                      </TorusDialog>
                    </div>
                    <span className="font-medium  pl-[9.5vw]"
                      style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
                      {locale["Generated URL"]}: {(app as any)["generatedUrl"]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className={` absolute bottom-[5vh] left-[48%]`}>
        {totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        ) : null}
      </div>
    </div>
  );
};

export default AppCreationTable;



