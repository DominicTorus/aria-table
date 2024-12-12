import _ from "lodash";
import React, { ChangeEvent, useMemo, useState } from "react";
import { Button, FileTrigger, Input } from "react-aria-components";
import { Pagination } from "../components/torusComponents/torusTable";
import { FileGallery, PlusIcon } from "../constants/svgApplications";
import { findPath, handleSelectGroupandMembers } from "../../lib/utils/utility";
import { toast } from "react-toastify";
import TorusToast from "../components/torusComponents/torusToast";
import Image from "next/image";
import { AxiosService } from "../../lib/utils/axiosService";
import AppCreationTable from "../control-center/appCreation";
import { getCookie } from "../../lib/utils/cookiemgmt";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";

const TenantCreationTable = ({
  data,
  onUpdate,
  assetType = "ENV",
  tenantsPerPage = 2,
  searchTerm,
  setSearchTerm,
  appEnvData,
  selectedOption,
  setAppEnvData,
  setSelectedOption,
  access,
  selectedItems,
  setSelectedItems
}: {
  data: any[];
  onUpdate: any;
  assetType?: string;
  tenantsPerPage?: number;
  searchTerm: any;
  setSearchTerm: any;
  selectedOption: "Tenants" | "Applications";
  setSelectedOption: (value: "Tenants" | "Applications") => void;
  appEnvData: any[];
  setAppEnvData: (value: any[]) => void;
  access: "view" | "edit" | null;
  selectedItems: Record<string, boolean>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [editingCell, setEditingCell] = useState<null | string>(null);
  const [wordLength, setWordLength] = useState(0);
  const client = getCookie("tp_cc");

  const columns = [
    { header: "Code", key: "code", className: "w-[13.69vw]" },
    { header: "Host Name", key: "HostName", className: "w-[15.68vw]" },
    { header: "Host IP", key: "HostIP", className: "w-[15.42vw]" },
    { header: "Volume", key: "volumePath", className: "w-[12.92vw]" },
  ];

  const tenantStructure = {
    "Code": "",
    "Name": "",
    "Logo": "",
    "ENV": [
      {
        "code": "",
        "HostName": "",
        "HostIP": "",
        "volumePath": "",
        "APPS": []
      }
    ]
  }

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
    const indexOfLastGroup = currentPage * tenantsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - tenantsPerPage;

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup);
  }, [data, filteredData, currentPage, onUpdate, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / tenantsPerPage);
  }, [data, filteredData, currentPage, tenantsPerPage]);

  const handleSetEditingCell = (path: string) => {
    setEditingCell(path);
  };

  const handleGetTenantCode = async (path: string, tenantName: string) => {
    if (!tenantName) { return }
    try {
      const res = await AxiosService.post("/api/get-dynamic-tenantcode", {
        clientCode: client,
        tenantName,
      });
      if (res.status == 201) {
        const tenantData = _.get(data, path.replace(".Name", ""));
        handleUpdateData(
          { ...tenantData, Name: tenantName, Code: res.data },
          path.replace(".Name", "")
        );
        setEditingCell(null);
      }
    }
    catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Occured While Saving tenant code";
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
  }


  const handleValueChange = (
    path: string,
    value: string,
    isTenant: boolean = false
  ) => {
    if (isTenant) {
      const isTenantCodeExist = _.get(data, path.replace(".Name", ".Code"));
      if (!isTenantCodeExist) {
        handleGetTenantCode(path, value);
        return;
      }
    }
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

  const handleSelect = (path: string, isParent: boolean = false) => {
    handleSelectGroupandMembers(path, isParent, assetType, setSelectedItems, data)
  };

  const handleUploads = async (e: any, path: string, filename: string) => {
    const file = e[0];
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucketFolderame", "torus9x");
      data.append("folderPath", "tp/tenantAssets");

      if (file) {
        const res = await AxiosService.post("image/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            filename: filename,
          },
        });

        if (res.status === 201) {
          const responseData = res.data.imageUrl;
          handleUpdateData(responseData, path);
        } else {
          toast(
            <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
            {
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error Occured",
              text: `File is not valid`,
              closeButton: false,
            } as any
          );
        }
      }
    }
    catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Occured While Saving uploading images";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Uploading Image",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleAddNewTenant = (path: string | undefined) => {
    const parentPath = path ? path.split(".").slice(0, -1).join(".") : "";
    const parentData = parentPath ? _.get(data, parentPath) : null;
    const isExists = path ? findPath(parentData, tenantStructure.ENV[0]) : findPath(data, tenantStructure);
    if (isExists) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "warning",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Warning",
          text: `Already ${path ? "Environment" : "Tenant"} created`,
          closeButton: false,
        } as any
      );
      return;
    }
    if (path) {
      handleUpdateData(tenantStructure.ENV[0], `${path}`);
    } else {
      handleUpdateData(tenantStructure, `${data.length}`);
      if (currentGroups.length == tenantsPerPage) {
        setCurrentPage((prev) => prev + 1)
      }
    }

  }

  const handleTenantOrAppCreation = () => {
    if (selectedOption == "Tenants") {
      handleAddNewTenant(undefined)
    } else {
      const btnElement = document.getElementById("add-appGrp");
      if (btnElement) btnElement.click();
    }
  };

  const formatIpAddress = (value: string) => {
    // Remove any characters that are not numbers or dots
    value = value.replace(/[^0-9.]/g, "");

    // Split the input by dots
    let octets = value.split(".");

    // Restrict each octet to a maximum of 3 digits
    octets = octets.map((octet) => octet.slice(0, 3));

    // Join octets back with dots, limiting to 3 octets and 3 dots
    return octets.slice(0, 4).join(".");
  };

  const handleEnvFieldKeyChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    let inputValue = e.target.value;

    switch (key) {
      case "HostIP": {
        // Format the input value to allow only valid IP characters
        inputValue = formatIpAddress(inputValue);
        e.target.value = inputValue; // Set the formatted value back
        break;
      }
      case "volumePath": {
        // Remove any non-numeric characters
        inputValue = inputValue.replace(/[^a-zA-Z/]/g, "");
        e.target.value = inputValue;
        break;
      }
      default:
        // Do nothing
        break;
    }
  };

  return (
    <div className="flex flex-col gap-[1vh] w-[86.93vw] h-[93.61vh] px-[0.83vw] py-[1.87vh]"
      style={{ backgroundColor: torusTheme["bg"] }}>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-semibold leading-[1.85vh] "
            style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}>
            {(selectedOption === "Tenants" && locale["Tenants"]) ||
              (selectedOption === "Applications" && locale["Applications"])}
          </h1>
        </div>
        <div className="flex w-[21.09vw] rounded-lg px-[0.29vw] py-[0.62vh] border"
          style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"] }} >
          <Button
            onPress={() => {
              setSelectedOption("Tenants")
              setSelectedItems({});
            }}
            className={`py-[1.24vh] w-1/2 transition-colors duration-700 ease-in-out leading-[1.8vh] rounded-md
                             ${selectedOption === "Tenants"
                ? `outline-none font-semibold`
                : " bg-inherit font-medium"
              }  outline-none`}
            style={{
              color: torusTheme["text"],
              fontSize: `${fontSize * 0.8}vw`,
              backgroundColor: selectedOption === "Tenants" ? torusTheme["bg"] : "",
            }}
          >
            {locale["Tenants"]}
          </Button>
          <Button
            onPress={() => {
              setSelectedItems({});
              setSelectedOption("Applications")
            }}
            className={`py-[1.24vh] w-1/2 transition-colors duration-700 ease-in-out leading-[1.8vh] rounded-md
                            ${selectedOption === "Applications"
                ? `style={{ backgroundColor: torusTheme["bg"] }} font-semibold`
                : " bg-inherit outline-none font-medium"
              }  outline-none`}
            style={{
              color: torusTheme["text"],
              backgroundColor: selectedOption === "Applications" ? torusTheme["bg"] : "inherit",
              fontSize: `${fontSize * 0.8}vw`
            }}
          >
            {locale["Applications"]}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-[0.58vw] ">
        <Button
          id="tenant-creation-btn"
          className={`hidden`}
          onPress={handleTenantOrAppCreation}
        >
          <PlusIcon fill="white" width={"1.04vw"} height={"1.04vw"} />
          New Tenant
        </Button>
      </div>
      {selectedOption === "Tenants" && (
        <div>
          <div>
            {currentGroups.map((tenant: any, index) => (
              <div key={tenant.Code + index} className="w-[84.73vw]">
                <div className="flex justify-between items-center group">
                  <div className="flex gap-[0.58vw] my-[2.07vh] items-center h-[4.07vh] ">
                    <div className="w-[1vw] ml-[0.58vw]" role="columnheader">
                      <input
                        type="checkbox"
                        style={{ accentColor }}
                        className="w-[0.8vw] h-[1.04vw] rounded-[0.3vw]"
                        checked={!!selectedItems[`${tenant.originalIndex}`]}
                        disabled={access != "edit"}
                        onChange={() =>
                          handleSelect(`${tenant.originalIndex}`, true)
                        }
                        aria-labelledby={`tenant-${tenant.code}`}
                      />
                    </div>
                    {["Logo", "Name", "Code"].map((field, index) => {
                      if (field == "Logo") {
                        return (
                          <div
                            key={index}
                            className="flex mb-[0.6vh] justify-center w-[2.29vw]"
                          >
                            <FileTrigger
                              acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                                "image/x-icon",
                              ]}
                              onSelect={(e) => {
                                handleUploads(
                                  e,
                                  tenant.originalIndex + "." + field,
                                  tenant.Code
                                    ? tenant.Code
                                    : new Date().getTime()
                                );
                              }}
                            >
                              <div className="flex flex-col items-center rounded-md">
                                <Button
                                  className="outline-none"
                                  style={{ backgroundColor: torusTheme["bg"] }}
                                  isDisabled={access != "edit"}
                                >
                                  {tenant.Logo ? (
                                    <Image
                                      src={tenant.Logo}
                                      alt={tenant.Logo}
                                      width={40}
                                      height={40}
                                    />
                                  ) : (
                                    <FileGallery
                                      fill={torusTheme["text"]}
                                      width="1.25vw"
                                      height="2.22vh"
                                    />
                                  )}
                                </Button>
                              </div>
                            </FileTrigger>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={index}
                            className={`${field == "Code" ? "w-[15.65vw]" : "w-[29.63vw]"} h-full flex items-center px-[0.29vw]`}
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                            onDoubleClick={() => {
                              if (field === "Name") {
                                handleSetEditingCell(
                                  `${tenant.originalIndex}.${field}`
                                );
                              }
                            }}
                          >
                            {(editingCell &&
                              editingCell ==
                              `${tenant.originalIndex}.${field}`) ||
                              (!(tenant as any)[field] && field != "Code") ? (
                              <Input
                                type="text"
                                placeholder={locale[`Enter tenant ${field} here`]}
                                defaultValue={(tenant as any)[field]}
                                onFocus={() =>
                                  handleSetEditingCell(
                                    `${tenant.originalIndex}.${field}`
                                  )
                                }
                                onKeyDown={(e: any) => {
                                  if (e.key === "Enter") {
                                    handleValueChange(
                                      `${tenant.originalIndex}.${field}`,
                                      e.target.value,
                                      true
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  handleValueChange(
                                    `${tenant.originalIndex}.${field}`,
                                    e.target.value,
                                    true
                                  );
                                }}
                                disabled={access != "edit"}
                                className="outline-none"
                                style={{ backgroundColor: torusTheme["bgCard"] }}
                              />
                            ) : (tenant as any)[field] ? (
                              (tenant as any)[field]
                            ) : (
                              <span style={{ color: torusTheme["text"] }}>
                                {locale["tenantCode"]}
                              </span>
                            )}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                <div className="flex w-[84.73vw] justify-between group"
                  style={{ backgroundColor: torusTheme["bgCard"] }}>
                  <div
                    className="flex gap-[0.87vw] rounded-md items-center ml-[0.6vw] h-[4.85vh]"
                    role="row"
                  >
                    <div className="w-[1vw]" role="columnheader">
                      <input
                        type="checkbox"
                        style={{ accentColor }}
                        className="w-[0.8vw] h-[1.04vw] rounded-[0.3vw]"
                        checked={!!selectedItems[`${tenant.originalIndex}.ENV`]}
                        disabled={access != "edit"}
                        onChange={() =>
                          handleSelect(`${tenant.originalIndex}.ENV`, true)
                        }
                        aria-labelledby={`tenant-${tenant.Code}`}
                      />
                    </div>
                    {columns.map((field, index) => (
                      <div
                        key={index}
                        className={`font-semibold leading-[1.85vh] ${field.className}`}
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                        role="columnheader"
                      >
                        {locale[field.header]}
                      </div>
                    ))}
                  </div>
                  <Button
                    style={{ backgroundColor: accentColor }}
                    className={
                      "outline-none px-[0.4vw] py-[0.29vw] rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    }
                    onPress={() =>
                      handleAddNewTenant(`${tenant.originalIndex}.${assetType}.${tenant[assetType].length}`)
                    }
                    isDisabled={access != "edit"}
                  >
                    <PlusIcon fill="white" width="1.25vw" height="1.25vw" />
                  </Button>
                </div>
                <div style={{height : tenant[assetType].length >= 3 ? "23vh" : undefined  , overflowY : tenant[assetType].length >= 3 ? "scroll" : undefined}}>
                  {(tenant[assetType] as any).map(
                    (app: any, memberIndex: number) => {
                      const parentPath = `${tenant.originalIndex}.${assetType}.${memberIndex}`;
                      return (
                        <div
                          key={memberIndex}
                          className="flex w-full items-center gap-[0.87vw] p-[0.58vw] leading-[1.77vh]"
                          style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }}
                          role="row"
                        >
                          <div className="w-[0.8vw]" role="cell">
                            <input
                              type="checkbox"
                              style={{ accentColor }}
                              disabled={access != "edit"}
                              className="w-[0.8vw] h-[1.04vw] rounded-[0.3vw]"
                              checked={!!selectedItems[`${parentPath}`]}
                              onChange={() => handleSelect(`${parentPath}`)}
                            />
                          </div>

                          {columns.map((field) => (
                            <div
                              key={field.key}
                              className={`p-[0.58vw] ml-[0.1vw] ${field.className}`}
                              style={{ backgroundColor: torusTheme["bgCard"] }}
                              role="cell"
                              onDoubleClick={() =>
                                handleSetEditingCell(
                                  `${parentPath}.${field.key}`
                                )
                              }
                            >
                              {(editingCell &&
                                editingCell == `${parentPath}.${field.key}`) ||
                                !(app as any)[field.key] ? (
                                <Input
                                  type="text"
                                  placeholder={`Enter env ${field.key} here`}
                                  defaultValue={(app as any)[field.key]}
                                  disabled={
                                    !tenant.Code ? true : access != "edit"
                                  }
                                  onFocus={() =>
                                    handleSetEditingCell(
                                      `${parentPath}.${field.key}`
                                    )
                                  }
                                  onChange={(e) =>
                                    handleEnvFieldKeyChange(e, `${field.key}`)
                                  }
                                  onKeyDown={(e: any) => {
                                    if (e.key === "Enter") {
                                      handleValueChange(
                                        `${parentPath}.${field.key}`,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  onBlur={(e) => {
                                    handleValueChange(
                                      `${parentPath}.${field.key}`,
                                      e.target.value
                                    );
                                  }}
                                  className={`outline-none`}
                                  style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] }}
                                />
                              ) : (
                                (app as any)[field.key]
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={` absolute bottom-[5vh] left-[48%]`}>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}

      {selectedOption == "Applications" && (
        <div>
          <AppCreationTable
            data={appEnvData}
            onUpdate={setAppEnvData}
            assetType="APPS"
            searchTerm={searchTerm}
            access={access}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
      )}
    </div>
  );
};

export default TenantCreationTable;
