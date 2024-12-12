"use client";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { Button, Input } from "react-aria-components";
import { toast } from "react-toastify";
import { DownArrow, PlusIcon } from "../../constants/svgApplications";
import { Pagination } from "../torusComponents/torusTable";
import TorusToast from "../torusComponents/torusToast";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";

interface Org {
  orgCode: string;
  orgName: string;
}

interface OrgGrp {
  orgGrpCode: string;
  orgGrpName: string;
  org: Org[];
}

interface Role {
  roleCode: string;
  roleName: string;
}

interface RoleGrp {
  roleGrpCode: string;
  roleGrpName: string;
  roles: Role[];
}

interface Ps {
  psCode: string;
  psName: string;
}

interface PsGrp {
  psGrpCode: string;
  psGrpName: string;
  ps: Ps[];
}

interface DynamicGroupMemberTableProps {
  data: OrgGrp[] | RoleGrp[] | PsGrp[];
  onUpdate: (updatedData: OrgGrp[] | RoleGrp[] | PsGrp[]) => void;
  assetType: "org" | "roles" | "ps";
  groupsPerPage?: number;
  groupFields: string[];
  memberFields: string[];
  headerFields: string[];
  tenantAccess?: "view" | "edit" | null | undefined;
  selectedItems: Record<string, boolean>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

interface DynamicGroupAccordionProps
  extends Omit<
    DynamicGroupMemberTableProps,
    "onUpdate" | "headerFields" | "data" | "selectedItems" | "setSelectedItems"
  > {
  editingCell: string | null;
  handleSetEditingCell: (value: string) => void;
  subMember: "roleGrp" | "psGrp" | null;
  group: any;
  handleValueChange: (path: string, value: string) => void;
  selectedItems: Record<string, boolean>;
  handleSelect: (path: string, isSelected: boolean) => void;
  handleAddNewEntity: (path?: string, length?: number) => void;
  path?: string;
  code?: string;
}

const RenderGroupAccordion = ({
  group,
  groupFields,
  editingCell,
  handleSetEditingCell,
  assetType,
  memberFields,
  handleValueChange,
  selectedItems,
  handleSelect,
  subMember,
  handleAddNewEntity,
  tenantAccess,
  path,
  code = "",
}: DynamicGroupAccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleItemClick = (path: string) => {
    const isSelected = !!selectedItems[path];
    handleSelect(path, !isSelected);
  };

  return (
    <div className="flex flex-col gap-[1.17vw] pb-[0.58vw]">
      <div
        key={`${subMember}`}
        style={{ borderColor: torusTheme["border"] }}
        className={`rounded mx-[0.58vw] ${subMember ? (subMember == "roleGrp" ? "w-[85.58vw]" : "w-[79.58vw]") : "w-[73.58vw]"}  border`}
        role="rowgroup"
      >
        {/* Group Row */}
        <div
          style={{ backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.62}vw` }}
          className="flex gap-3 justify-between items-center group rounded-sm leading-[1.77vh] "
        >
          <div
            style={{ backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.62}vw` }}
            className="flex gap-3 items-center rounded-sm p-2 leading-[1.77vh]"
            role="row"
          >
            <div className="w-[1vw]" role="cell">
              <input
                className="w-[0.83vw] cursor-pointer h-[0.83vw]"
                disabled={tenantAccess === "view"}
                type="checkbox"
                style={{ accentColor }}
                checked={!!selectedItems[path as string]}
                onChange={() => handleItemClick(path as string)}
              />
            </div>

            {groupFields.map((field) => {
              const isCodeField = field.toLowerCase().endsWith("code");

              return (
                <div
                  key={field}
                  style={{
                    backgroundColor: torusTheme["bg"],
                    color: torusTheme["text"],
                  }}
                  className={`${field.toLowerCase().endsWith("code") ? "w-[10.52vw] p-2" : "w-[15.52vw] p-2"}`}
                  role="cell"
                  onDoubleClick={() => {
                    if (!isCodeField) {
                      handleSetEditingCell(`${path}.${field}`);
                    }
                  }}
                >
                  {(editingCell && editingCell == `${path}.${field}`) ||
                    !(group as any)[field] ? (
                    <Input
                      type="text"
                      style={{
                        backgroundColor: torusTheme["bg"],
                        color: torusTheme["text"],
                      }}
                      disabled={tenantAccess === "view"}
                      defaultValue={
                        isCodeField
                          ? (group as any)[field].replace(code, "")
                          : (group as any)[field]
                      }
                      placeholder={locale[`Enter ${field} here`]}
                      onFocus={() => handleSetEditingCell(`${path}.${field}`)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          if (e.target.value.length > 0) {
                            handleValueChange(
                              `${path}.${field}`,
                              isCodeField
                                ? `${code}${e.target.value}`
                                : e.target.value
                            );
                          }
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value.length > 0) {
                          handleValueChange(
                            `${path}.${field}`,
                            isCodeField
                              ? `${code}${e.target.value}`
                              : e.target.value
                          );
                        }
                      }}
                      className={"outline-none"}
                    />
                  ) : field.toLowerCase().endsWith("code") && code ? (
                    (group as any)[field].replace(code, "")
                  ) : (
                    (group as any)[field]
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-[0.58vw]">
            <Button
              style={{ backgroundColor: accentColor }}
              className={
                "outline-none p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              }
              onPress={() =>
                handleAddNewEntity(
                  `${path}.${assetType}`,
                  group[assetType].length
                )
              }
              isDisabled={tenantAccess === "view"}
            >
              <PlusIcon fill="white" width="1.25vw" height="1.25vw" />
            </Button>
            <Button
              onPress={() => setExpanded(!expanded)}
              className={`${expanded ? "rotate-180" : ""} mr-3 cursor-pointer outline-none`}
            >
              <DownArrow fill={torusTheme["text"]} />
            </Button>
          </div>
        </div>

        {/* App Rows */}
        {expanded &&
          (group[assetType] as any).map((app: any, memberIndex: number) => {
            const parentPath = `${path}.${assetType}`;
            const grpCode: any = groupFields.find((field) =>
              field.toLowerCase().endsWith("code")
            );
            const parentCode = `${group[grpCode]}-`;
            const memberCodeField: any = memberFields.find((field) =>
              field.toLowerCase().endsWith("code")
            );
            const memberCode = `${(app as any)[memberCodeField]}-`;

            return (
              <div key={memberIndex}>
                <div
                  key={memberIndex}
                  style={{ backgroundColor: torusTheme["bg"], fontSize: `${fontSize * 0.62}vw` }}
                  className="flex w-full items-center gap-3 p-[0.58vw] leading-[1.77vh] group"
                  role="row"
                >
                  <div className="w-[1vw]" role="cell">
                    <input
                      className="w-[0.8vw] h-[0.8vw]"
                      disabled={tenantAccess === "view"}
                      type="checkbox"
                      style={{ accentColor }}
                      checked={!!selectedItems[`${parentPath}.${memberIndex}`]}
                      onChange={() =>
                        handleItemClick(`${parentPath}.${memberIndex}`)
                      }
                    />
                  </div>

                  {memberFields.map((field) => {
                    const isCodeField = field.toLowerCase().endsWith("code");
                    return (
                      <div
                        key={field}
                        style={{
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                        }}
                        className={`${field.toLowerCase().endsWith("code") ? "w-[10.52vw] p-[0.58vw]" : "w-[15.52vw] p-[0.58vw]"}`}
                        role="cell"
                        onDoubleClick={() => {
                          if (!isCodeField) {
                            handleSetEditingCell(
                              `${parentPath}.${memberIndex}.${field}`
                            );
                          }
                        }}
                      >
                        {(editingCell &&
                          editingCell ==
                          `${parentPath}.${memberIndex}.${field}`) ||
                          !(app as any)[field] ? (
                          <Input
                            type="text"
                            disabled={tenantAccess === "view"}
                            defaultValue={
                              isCodeField
                                ? (app as any)[field].replace(parentCode, "")
                                : (app as any)[field]
                            }
                            placeholder={locale[`Enter ${field} here`]}
                            onFocus={() =>
                              handleSetEditingCell(
                                `${parentPath}.${memberIndex}.${field}`
                              )
                            }
                            onKeyDown={(e: any) => {
                              if (e.key === "Enter") {
                                if (e.target.value.length) {
                                  handleValueChange(
                                    `${parentPath}.${memberIndex}.${field}`,
                                    isCodeField
                                      ? `${parentCode}${e.target.value}`
                                      : e.target.value
                                  );
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value.length) {
                                handleValueChange(
                                  `${parentPath}.${memberIndex}.${field}`,
                                  isCodeField
                                    ? `${parentCode}${e.target.value}`
                                    : e.target.value
                                );
                              }
                            }}
                            className={"outline-none"}
                            style={{
                              backgroundColor: torusTheme["bgCard"],
                              color: torusTheme["text"],
                            }}
                          />
                        ) : isCodeField ? (
                          (app as any)[field].replace(parentCode, "")
                        ) : (
                          (app as any)[field]
                        )}
                      </div>
                    );
                  })}
                  {subMember ? (
                    <Button
                      style={{ backgroundColor: accentColor }}
                      isDisabled={tenantAccess === "view"}
                      className={`outline-none p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity`}
                      onPress={() =>
                        handleAddNewEntity(
                          `${path}.${assetType}.${memberIndex}.${subMember}`,
                          app[subMember].length
                        )
                      }
                    >
                      <PlusIcon fill="white" width="1.25vw" height="1.25vw" />
                    </Button>
                  ) : null}
                </div>
                <div className="ml-[2vw]">
                  {subMember && app[subMember] && Array.isArray(app[subMember])
                    ? app[subMember].map(
                      (subGrpData: any, indexOfSubGrp: number) => (
                        <RenderGroupAccordion
                          key={indexOfSubGrp}
                          assetType={subMember == "roleGrp" ? "roles" : "ps"}
                          group={subGrpData}
                          groupFields={
                            subMember == "roleGrp"
                              ? ["roleGrpCode", "roleGrpName"]
                              : ["psGrpCode", "psGrpName"]
                          }
                          memberFields={
                            subMember == "roleGrp"
                              ? ["roleCode", "roleName"]
                              : ["psCode", "psName"]
                          }
                          editingCell={editingCell}
                          handleSetEditingCell={handleSetEditingCell}
                          handleValueChange={handleValueChange}
                          subMember={subMember == "roleGrp" ? "psGrp" : null}
                          path={`${path}.${assetType}.${memberIndex}.${subMember}.${indexOfSubGrp}`}
                          handleSelect={handleSelect}
                          selectedItems={selectedItems}
                          handleAddNewEntity={handleAddNewEntity}
                          code={memberCode}
                          tenantAccess={tenantAccess}
                        />
                      )
                    )
                    : null}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const DynamicGroupMemberAccordion: React.FC<DynamicGroupMemberTableProps> = ({
  data,
  onUpdate,
  assetType,
  groupsPerPage = 2,
  groupFields,
  memberFields,
  headerFields,
  tenantAccess,
  selectedItems,
  setSelectedItems,
}) => {
  const [editingCell, setEditingCell] = useState<null | string>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [wordLength, setWordLength] = useState(0);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

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
    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;

    return filteredData.slice(indexOfFirstGroup, indexOfLastGroup);
  }, [data, filteredData, currentPage, onUpdate, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / groupsPerPage);
  }, [data, filteredData, currentPage, groupsPerPage]);

  function getAllPaths(data: any, path: string = "") {
    let paths: string[] = [];

    for (let key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: number) => {
          const newPath = `${path}${key}.${index}`;
          paths.push(newPath); // Include current path
          paths = paths.concat(getAllPaths(item, `${newPath}.`)); // Recurse for deeper levels
        });
      } else if (typeof data[key] === "object") {
        const newPath = `${path}${key}`;
        paths.push(newPath); // Include current path
        paths = paths.concat(getAllPaths(data[key], `${newPath}.`)); // Recurse for deeper levels
      }
    }

    return paths;
  }

  const handleSelect = (path: string, isSelected: boolean) => {
    const allPaths = getAllPaths(data);
    setSelectedItems((prevSelectedItems) => {
      const updatedSelection = { ...prevSelectedItems };

      // Helper function to mark sub-items
      const toggleSubItems = (basePath: string, select: boolean) => {
        allPaths.forEach((key) => {
          if (key.startsWith(basePath)) {
            updatedSelection[key] = select;
          }
        });
      };

      if (isSelected) {
        // If selecting, mark all sub-items
        updatedSelection[path] = true;
        toggleSubItems(path, true);
      } else {
        // If deselecting, remove the selection from parent path and keep siblings' states intact
        updatedSelection[path] = false;
        toggleSubItems(path, false);

        // Check if any sibling is still selected
        const pathSegments = path.split(".");
        pathSegments.pop();
        const parentPath = pathSegments.join(".");

        if (
          allPaths.some(
            (key) =>
              key.startsWith(parentPath) &&
              key !== path &&
              updatedSelection[key]
          )
        ) {
          // If any sibling is selected, do not deselect the parent
          updatedSelection[parentPath] = false;
        } else {
          // Otherwise, clear the parent selection
          delete updatedSelection[parentPath];
        }
      }

      return updatedSelection;
    });
  };

  const transformObject: any = (obj: any) => {
    if (typeof obj === "string") {
      return "";
    }

    if (Array.isArray(obj)) {
      return [transformObject(obj[0])];
    }

    if (typeof obj === "object" && obj !== null) {
      const newObj: any = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = transformObject(obj[key]);
        }
      }
      return newObj;
    }
    return obj; // Return the value if it's not an object, array, or string
  };

  const handlejs = (newContent: any, path: any) => {
    if (path) {
      const js = structuredClone(data);
      _.set(js as any, path, newContent);
      onUpdate(js);
    }
  };

  const handleAddNewEntity = (path?: string, length?: number) => {
    var currentData: any[] = data;
    if (path) {
      currentData = _.get(data, path);
    }
    const transformedData = transformObject(currentData[0]);
    const isExists = findPath(currentData, transformedData);
    if (isExists) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "warning",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Warning",
          text: `Already ${path ? "member" : "group"} created`,
          closeButton: false,
        } as any
      );
      return;
    }
    if (path) {
      handlejs(transformedData, `${path}.${length}`);
    } else {
      handlejs(transformedData, `${length}`);
    }
  };

  const handleValueChange = (path: string, value: string) => {
    handlejs(value, path);
    setEditingCell(null);
  };

  const handleSetEditingCell = (path: string) => {
    setEditingCell(path);
  };

  const handleAddMember = () => {
    const groupKeys = new Set();
    Object.entries(selectedItems).forEach(([key, value]) => {
      if (value && key.split(".").length === 1) {
        groupKeys.add(key);
      }
    });
    if (groupKeys.size == 0) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `Please select an application group`,
          closeButton: false,
        } as any
      );
      return;
    }
    if (groupKeys.size > 1) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `Please select only one application group`,
          closeButton: false,
        } as any
      );
      return;
    }

    const groupKey = Array.from(groupKeys)[0];
    const group = _.get(data, `${groupKey}`);
    Object.entries(group).forEach(([key, value]) => {
      if (typeof value === "object" && Array.isArray(value)) {
        handleAddNewEntity(`${groupKey}.${key}`, value.length);
      }
    });
  };

  function findPath(obj: any, searchValue: any, path = "") {
    if (typeof obj === "object") {
      for (const key in obj) {
        if (JSON.stringify(obj[key]) === JSON.stringify(searchValue)) {
          return path + key;
        } else if (Array.isArray(obj[key])) {
          for (let i = 0; i < obj[key].length; i++) {
            const result: any = findPath(
              obj[key][i],
              searchValue,
              path + key + "." + i + "."
            );
            if (result) {
              return result;
            }
          }
        } else if (typeof obj[key] === "object") {
          const result: any = findPath(obj[key], searchValue, path + key + ".");
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  return (
    <div
      className="w-full h-[88.8vh] flex flex-col gap-[0.87vw]"
      role="table"
      aria-label="Application Groups"
    >
      <div className="flex justify-between items-center w-full px-[0.58vw]">
        <div className="flex flex-col gap-[0.58vw]">
          <div
            style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}
            className=" leading-[1.85vh] font-semibold"
          >
            {assetType === "org"
              ? locale[`Organizational Matrix`]
              : assetType === "roles"
                ? `Roles & Groups`
                : `Product & Services`}
          </div>
        </div>
        <div className="flex items-center gap-[0.58vw] w-[43.17vw]">
          <Button
            id="org-creation-btn"
            style={{ backgroundColor: accentColor }}
            className={` hidden `}
            onPress={() => handleAddNewEntity(undefined, data.length)}
          >
            <PlusIcon fill="white" width={"1.04vw"} height={"1.04vw"} />
          </Button>
        </div>
      </div>

      <div className="mx-2 mt-3">
        {/* Group Header */}
        <div
          style={{
            backgroundColor: torusTheme["bgCard"],
            color: torusTheme["text"],
          }}
          className="flex w-[85.53vw] gap-[0.58vw] rounded-md items-center p-3"
          role="row"
        >
          <div className="w-16 ml-[0.58vw]" role="columnheader">
          </div>
          {headerFields.map((field, index) => (
            <div

              style={{ fontSize: `${fontSize * 0.72}vw` }}
              key={index}
              className={`${field.toLowerCase().endsWith("code") ? "w-[10.52vw] font-medium  leading-[1.85vh]" : "w-[15.46vw] font-medium  leading-[1.85vh]"}`}
              role="columnheader"
            >
              {locale[field]}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col mt-3 gap-3 h-[90%] overflow-y-auto">
        {currentGroups.map((group, index) => {
          return (
            <RenderGroupAccordion
              key={index}
              group={group}
              assetType={assetType}
              editingCell={editingCell}
              handleSetEditingCell={handleSetEditingCell}
              handleValueChange={handleValueChange}
              groupFields={groupFields}
              memberFields={memberFields}
              subMember="roleGrp"
              path={`${group.originalIndex}`}
              selectedItems={selectedItems}
              handleSelect={handleSelect}
              handleAddNewEntity={handleAddNewEntity}
              tenantAccess={tenantAccess}
            />
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default DynamicGroupMemberAccordion;
