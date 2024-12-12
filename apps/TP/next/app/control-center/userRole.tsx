import React, { useMemo, useState } from "react";
import _ from "lodash";
import { Input } from "react-aria-components";
import { EditIcon } from "../constants/svgApplications";
import { capitalize } from "../../lib/utils/utility";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";
import { Pagination } from "../components/torusComponents/torusTable";

const UserRole = ({
  roles,
  setRoles,
  access,
  selectedItems,
  setSelectedItems,
  searchTerm
}: {
  roles: any;
  setRoles: (roles: any) => void;
  access: "view" | "edit" | null;
  selectedItems: Record<string, boolean>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  searchTerm: string;
}) => {

  const locale = useSelector((state: RootState) => state.main.locale);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const roleActions = [
    {
      title: "DATA FABRIC",
      code: "DF",
      type: "group",
      items: [
        {
          title: "Mapper",
          type: "item",
          code: "map",
          permissions: { edit: false, view: false },
        },
        {
          title: "Orchestrator",
          type: "item",
          code: "orch",
          permissions: { edit: false, view: false },
        },
      ],
    },
    {
      title: "UI FABRIC",
      code: "UF",
      type: "group",
      items: [
        {
          title: "Mapper",
          code: "map",
          type: "item",
          permissions: { edit: false, view: false },
        },
        {
          title: "Orchestrator",
          code: "orch",
          type: "item",
          permissions: { edit: false, view: false },
        },
      ],
    },
    {
      title: "PROCESS FABRIC",
      code: "PF",
      type: "group",
      items: [
        {
          title: "Mapper",
          code: "map",
          type: "item",
          permissions: { edit: false, view: false },
        },
        {
          title: "Orchestrator",
          code: "orch",
          type: "item",
          permissions: { edit: false, view: false },
        },
      ],
    },
    {
      title: "Control Center",
      code: "cc",
      type: "item",
      permissions: { edit: false, view: false },
    },
    {
      title: "Tenant Setup",
      code: "ts",
      type: "item",
      permissions: { edit: false, view: false },
    },
  ];
  const [editingCell, setEditingCell] = useState<null | any>(null);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 8;

  const filteredRoles = Object.entries(roles)
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
        return Object.values(value as any).some((val) => {
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
    .map(([key, value], index) => ({ ...value as any, originalIndex: key }));


  const currentGroups = useMemo(() => {
    const indexOfLastGroup = currentPage * rolesPerPage;
    const indexOfFirstGroup = indexOfLastGroup - rolesPerPage;

    return filteredRoles.slice(indexOfFirstGroup, indexOfLastGroup);
  }, [roles, filteredRoles, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredRoles.length / rolesPerPage);
  }, [roles, filteredRoles, currentPage, rolesPerPage]);

  const handlePermissionControl = (path: string, value: any) => {
    if (path) {
      const copiedRoleState = structuredClone(roles);
      if (path.endsWith("view") && value == false) {
        const parentPath = path.replace(".view", "");
        _.set(copiedRoleState, parentPath, { view: false, edit: false });
      } else if (path.endsWith("edit") && value == true) {
        const parentPath = path.replace(".edit", "");
        _.set(copiedRoleState, parentPath, { view: true, edit: true });
      } else {
        _.set(copiedRoleState, path, value);
      }
      setRoles(copiedRoleState);
    }
  };

  const handleAddRole = () => {
    setRoles((prev: any) => [
      ...prev,
      { role: `role ${roles.length + 1}`, roleActions },
    ]);
  };

  const handleChangeTitle = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    path: string
  ) => {
    if (e.target?.value) {
      handlePermissionControl(path, e.target.value);
      setEditingCell(false);
    }
  };

  const handleSelectRoles = (path: string) => {
    setSelectedItems((prev) => {
      const updatedItems = { ...prev };
      updatedItems[path] = !prev[path];
      return updatedItems;
    })
  }

  return (
    <div className="flex flex-col gap-[2.49vh] w-[90vw] h-[93.61vh] px-[0.83vw] py-[1.8vh]">
      <h1 className="font-semibold leading-[1.85vh]"
        style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}>
        {locale["Security"]}
      </h1>
      <button
        className="hidden"
        id="client-user-role-addition"
        onClick={handleAddRole}
      >
        add
      </button>

      <div className="flex w-[87.39vw] gap-[1vw] rounded-md py-[1.24vh] mt-[2vh]"
        style={{ backgroundColor: torusTheme["bgCard"] }}>
        <div className="w-[15.5vw] pl-[0.83vw] leading-[1.85vh] font-semibold"
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
          {locale["Actions"]}
        </div>
        {currentGroups &&
          currentGroups.map((role: any, index: number) => (
            <div key={index} className="w-[7vw]">
              {editingCell && editingCell == `${role.originalIndex}.role` ? (
                <Input
                  defaultValue={role.role}
                  className={`flex w-full ml-[2.34vw] items-center outline-none leading-[1.85vh] font-medium`}
                  style={{ color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.72}vw` }}
                  onKeyDown={(e) =>
                    e.key === "Enter"
                      ? handleChangeTitle(e, `${role.originalIndex}.role`)
                      : null
                  }
                  onBlur={(e) => handleChangeTitle(e, `${role.originalIndex}.role`)}
                />
              ) : (
                <div className="flex justify-center items-center gap-[0.35vw] leading-[1.85vh] font-medium group"
                  style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                  <input
                    type="checkbox"
                    className={`checked:opacity-100 scale-[65%] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${access != "edit" ? "hidden" : ""}`}
                    onChange={() => handleSelectRoles(`${role.originalIndex}`)}
                    checked={selectedItems[`${role.originalIndex}`]}
                    style={{ accentColor }}
                  />
                  {role.role}
                  <span
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${access != "edit" ? "hidden" : ""}`}
                    onClick={() => setEditingCell(`${role.originalIndex}.role`)}
                  >
                    {" "}
                    <EditIcon width="0.72vw" height="0.72vw" />
                  </span>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="flex h-[80vh] gap-[1vw] overflow-y-auto">
        <div className="flex flex-col w-[15.5vw] h-full gap-[2.49vh]">
          {roles &&
            roleActions.map((action) => {
              if (action.type === "group") {
                return (
                  <div key={action.code} className="flex flex-col gap-[0.90vh] ">
                    <h1 className="font-[700] leading-[1.85vh]"
                      style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                      {locale[action.title]}
                    </h1>
                    <div className="flex flex-col gap-[1.24vh]">
                      {action.items?.map((item) => {
                        return (
                          <div
                            key={item.code}
                            className="flex flex-col gap-[0.62vh]"
                          >
                            <h1 className="font-[600] leading-[1.85vh]"
                              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                              {locale[item.title]}
                            </h1>
                            {Object.keys(item.permissions).map((permission) => (
                              <div
                                key={permission}
                                className="flex flex-col gap-[1.24vh]"
                              >
                                <p
                                  className={`font-[500] ${item.title === "Orchestrator" && permission === "view" ? "border-b w-[87vw]" : ""} leading-[1.85vh]`}
                                  style={{
                                    color: torusTheme["text"],
                                    borderColor: item.title === "Orchestrator" && permission === "view" ? torusTheme["border"] : undefined,
                                    fontSize: `${fontSize * 0.72}vw`
                                  }}
                                >
                                  {locale[capitalize(permission)]}
                                </p>

                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={action.code} className="flex flex-col gap-[0.62vh]">
                    <h1 className="font-[700] leading-[1.85vh]"
                      style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                      {locale[action.title]}
                    </h1>
                    {action.permissions &&
                      Object.keys(action.permissions).map((permission) => (
                        <div
                          key={permission}
                          className="flex flex-col gap-[1.24vh]"
                        >
                          <p className={`font-[500] ${permission === "view" ? "border-b  w-[87vw]" : ""} leading-[1.85vh] `}
                            style={{ color: torusTheme["text"], borderColor: permission === "view" ? torusTheme["border"] : undefined, fontSize: `${fontSize * 0.72}vw` }}>
                            {locale[capitalize(permission)]}
                          </p>
                        </div>
                      ))}
                  </div>
                );
              }
            })}
        </div>
        {currentGroups &&
          currentGroups.map((role: any, roleIndex: number) => (
            <div
              key={role.role}
              className="flex flex-col h-full gap-[2vh] w-[7vw] items-center"
            >
              {role.roleActions.map((group: any, groupIndex: number) => {
                const path = `${role.originalIndex}.roleActions.${groupIndex}`;
                return (
                  <div className="flex flex-col gap-[0.62vh]" key={group.code}>
                    <h3 className="invisible font-[700] leading-[1.85vh]"
                      style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                      {group?.title ?? group?.title.slice(0, 2)}
                    </h3>
                    {group.items ? (
                      group.items.map((item: any, itemIndex: number) => (
                        <div
                          className="flex flex-col gap-[1vh] items-center"
                          key={item.code}
                        >
                          <h4 className="invisible font-[600] leading-[1.85vh]"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                            {item.title ?? item.title.slice(0, 2)}
                          </h4>
                          <div className="flex flex-col gap-[0.62vh]">
                            <label className="leading-[1.85vh]"
                              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                              <input
                                type="checkbox"
                                style={{ accentColor }}
                                className="cursor-pointer w-[0.6vw] h-[0.6vw]"
                                checked={item.permissions.edit}
                                onChange={() =>
                                  handlePermissionControl(
                                    `${path}.items.${itemIndex}.permissions.edit`,
                                    !item.permissions.edit
                                  )
                                }
                                disabled={access != "edit"}
                              />
                              {/* Edit */}
                            </label>
                            <label className="leading-[1.85vh] "
                              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                              <input
                                type="checkbox"
                                style={{ accentColor }}
                                className="cursor-pointer w-[0.6vw] h-[0.6vw]"
                                checked={item.permissions.view}
                                onChange={() =>
                                  handlePermissionControl(
                                    `${path}.items.${itemIndex}.permissions.view`,
                                    !item.permissions.view
                                  )
                                }
                                disabled={access != "edit"}
                              />
                              {/* View Only */}
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="flex flex-col gap-[0.62vh] items-center"
                        key={group.code}
                      >
                        {/* <h4>{group.title}</h4> */}
                        <div className="flex flex-col gap-[0.62vh]">
                          <label className="leading-[1.85vh] "
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                            <input
                              type="checkbox"
                              style={{ accentColor }}
                              className="cursor-pointer w-[0.6vw] h-[0.6vw]"
                              checked={group.permissions.edit}
                              onChange={() => {
                                handlePermissionControl(
                                  `${path}.permissions.edit`,
                                  !group.permissions.edit
                                );
                              }}
                              disabled={access != "edit"}
                            />
                            {/* Edit */}
                          </label>
                          <label className="leading-[1.85vh]"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                            <input
                              type="checkbox"
                              style={{ accentColor }}
                              className="cursor-pointer w-[0.6vw] h-[0.6vw]"
                              checked={group.permissions.view}
                              onChange={() =>
                                handlePermissionControl(
                                  `${path}.permissions.view`,
                                  !group.permissions.view
                                )
                              }
                              disabled={access != "edit"}
                            />
                            {/* View Only */}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
      {totalPages > 1 && <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />}
    </div>
  );
};

export default UserRole;
