import React, { useEffect, useState } from "react";
import { Button, Cell, Input, TableBody } from "react-aria-components";
import {
  TorusColumn,
  TorusRow,
  TorusTable,
  TorusTableHeader,
} from "../torusComponents/torusTable";
import CustomGrpMemberDropdown from "../customGrpMemberDropdown";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";
import { AxiosService } from "../../../lib/utils/axiosService";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { capitalize } from "../../../lib/utils/utility";

function buildSelectedMembers(
  master: any[],
  selectedSecondLevel: any[],
  selectedThirdLevel: any[]
) {
  // Helper function to find an object by code
  const findByCode = (arr: any[], code: string, key: string) =>
    arr.find((item) => item[key] === code);

  // Create a result array
  const result: any[] = [];

  // Iterate over each selected second-level member
  selectedSecondLevel.forEach((secondLevel) => {
    const { orgGrpCode, orgCode, roleGrpCode, roles } = secondLevel;

    // Find the corresponding orgGrp in the master
    const orgGrp = findByCode(master, orgGrpCode, "orgGrpCode");
    if (!orgGrp) return;

    // Find the corresponding org in the orgGrp
    const org = findByCode(orgGrp.org, orgCode, "orgCode");
    if (!org) return;

    // Find the corresponding roleGrp in the org
    const roleGrp = findByCode(org.roleGrp, roleGrpCode, "roleGrpCode");
    if (!roleGrp) return;

    // Filter roles within the roleGrp based on the selection
    const filteredRoles = roles
      .map((role: any) => {
        const selectedRole = findByCode(
          roleGrp.roles,
          role.roleCode,
          "roleCode"
        );
        if (!selectedRole) return null;

        // Filter psGrps within the role based on the third-level selection
        const filteredPsGrps = role.psGrp
          .map((psGrp: any) => {
            const selectedPsGrp = findByCode(
              selectedRole.psGrp,
              psGrp.psGrpCode,
              "psGrpCode"
            );
            if (!selectedPsGrp) return null;

            // Filter ps within the psGrp based on the third-level selection
            const psInThirdLevel = findByCode(
              selectedThirdLevel,
              selectedPsGrp.psGrpCode,
              "psGrpCode"
            );
            if (psInThirdLevel) {
              return {
                ...selectedPsGrp,
                ps: selectedPsGrp.ps.filter((ps: any) =>
                  psInThirdLevel.ps.some(
                    (selPs: any) => selPs.psCode === ps.psCode
                  )
                ),
              };
            } else {
              return selectedPsGrp;
            }
          })
          .filter((psGrp: any) => psGrp !== null);

        return {
          ...selectedRole,
          psGrp: filteredPsGrps,
        };
      })
      .filter((role: any) => role !== null);

    // Build the result object for this second-level selection
    const existingOrgGrp = result.find((res) => res.orgGrpCode === orgGrpCode);

    if (existingOrgGrp) {
      const existingOrg = existingOrgGrp.org.find(
        (o: any) => o.orgCode === orgCode
      );

      if (existingOrg) {
        const existingRoleGrp = existingOrg.roleGrp.find(
          (rg: any) => rg.roleGrpCode === roleGrpCode
        );

        if (existingRoleGrp) {
          existingRoleGrp.roles.push(...filteredRoles);
        } else {
          existingOrg.roleGrp.push({
            ...roleGrp,
            roles: filteredRoles,
          });
        }
      } else {
        existingOrgGrp.org.push({
          ...org,
          roleGrp: [
            {
              ...roleGrp,
              roles: filteredRoles,
            },
          ],
        });
      }
    } else {
      result.push({
        ...orgGrp,
        org: [
          {
            ...org,
            roleGrp: [
              {
                ...roleGrp,
                roles: filteredRoles,
              },
            ],
          },
        ],
      });
    }
  });

  return result;
}

const TableCell = ({
  item,
  column,
  indexOfRow,
  handleEdit,
  editingCell,
  handleChangeValue,
  allOptions,
  selectedOptions,
  handleOrgSelection,
  handleRoleSelection,
  handlePsSelection,
  organizationMatrix,
  tenantAccess,
}: any) => {
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  switch (column.key) {
    case "accessProfile":
      return (
        <div
          onDoubleClick={() => handleEdit(`${indexOfRow}.accessProfile`)}
          style={{
            backgroundColor: torusTheme["bgCard"],
            color: torusTheme["text"],
          }}
          className="w-[12.29vw] p-2 ml-3"
        >
          {editingCell && editingCell === `${indexOfRow}.accessProfile` ? (
            <Input
              type="text"
              autoFocus
              defaultValue={item?.accessProfile}
              onFocus={() => handleEdit(`${indexOfRow}.accessProfile`)}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  handleChangeValue(item, `accessProfile`, e.target.value);
                  handleEdit(null);
                }
              }}
              onBlur={(e) => {
                handleChangeValue(item, `accessProfile`, e.target.value);
                handleEdit(null);
              }}
              className={"outline-none"}
              style={{
                backgroundColor: torusTheme["bgCard"],
                color: torusTheme["text"],
              }}
              disabled={tenantAccess === "view"}
            />
          ) : (
            item.accessProfile
          )}
        </div>
      );
    case "organization":
      return (
        <div className="w-[15.33vw] ml-4">
          <CustomGrpMemberDropdown
            data={organizationMatrix}
            groupKey="orgGrp"
            memberKey="org"
            memberCodeKey="orgCode"
            memberNameKey="orgName"
            groupCodeKey="orgGrpCode"
            groupNameKey="orgGrpName"
            selected={selectedOptions[item?.createdOn]?.selectedOrg ?? []}
            setSelected={handleOrgSelection}
            isDisabled={tenantAccess === "view"}
          />
        </div>
      );
    case "roles":
      return (
        <div className="w-[12.52vw]">
          <CustomGrpMemberDropdown
            data={allOptions[item?.createdOn]?.roleOptions ?? []}
            groupKey="roleGrp"
            memberKey="roles"
            memberCodeKey="roleCode"
            memberNameKey="roleName"
            groupCodeKey="roleGrpCode"
            groupNameKey="roleGrpName"
            selected={selectedOptions[item?.createdOn]?.selectedRg ?? []}
            setSelected={handleRoleSelection}
            isDisabled={
              tenantAccess === "view"
                ? true
                : false || selectedOptions[item?.createdOn]?.selectedOrg?.length
                  ? false
                  : true
            }
            parentKey="orgCode"
          />
        </div>
      );
    case "products/Services":
      return (
        <div className="w-[16vw]">
          <CustomGrpMemberDropdown
            data={allOptions[item?.createdOn]?.psOptions ?? []}
            groupKey="psGrp"
            memberKey="ps"
            memberCodeKey="psCode"
            memberNameKey="psName"
            groupCodeKey="psGrpCode"
            groupNameKey="psGrpName"
            selected={selectedOptions[item?.createdOn]?.selectedPsg ?? []}
            setSelected={handlePsSelection}
            isDisabled={
              tenantAccess === "view"
                ? true
                : false || selectedOptions[item?.createdOn]?.selectedRg.length
                  ? false
                  : true
            }
            parentKey="roleCode"
          />
        </div>
      );
    case "no.ofusers":
      return (
        <div style={{ color: torusTheme["text"] }} className="w-[5.16vw]">
          {item["no.ofusers"]}
        </div>
      );
    case "createdOn":
      return (
        <div
          style={{ color: torusTheme["text"], fontSize : `${fontSize * 0.62}vw` }}
          className=" leading-[1.85vh] text-nowrap w-[7.23vw]"
        >
          {item.createdOn}
        </div>
      );
  }
};

const RenderTableRow = ({
  item,
  index: indexOfRow,
  filterColmns,
  selectedKeys,
  primaryColumn,
  handleEdit,
  editingCell,
  handleChangeValue,
  allOptions,
  setAllOptions,
  setSelectedOptions,
  selectedOptions,
  getRoleOptions,
  getPsOptions,
  updateValuesInSource,
  organizationMatrix,
  tenantAccess,
}: any) => {
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const updateRolePsOptions = (
    key: string,
    assetType: "role" | "ps",
    asset: any[]
  ) => {
    const copyOfAllOptions = structuredClone(allOptions);
    switch (assetType) {
      case "role":
        const roleOptions = getRoleOptions(asset);
        copyOfAllOptions[key].roleOptions = roleOptions;
        setAllOptions(copyOfAllOptions);
        break;

      default:
        const psOptions = getPsOptions(asset);
        copyOfAllOptions[key].psOptions = psOptions;
        setAllOptions(copyOfAllOptions);
        break;
    }
  };
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);

  const handleOrgSelection = (org: any) => {
    const copyOfSelectedOptions = structuredClone(selectedOptions);
    copyOfSelectedOptions[item.createdOn].selectedOrg = org;
    updateRolePsOptions(item.createdOn, "role", org);
    setSelectedOptions(copyOfSelectedOptions);
  };

  const handleRoleSelection = (role: any) => {
    const copyOfSelectedOptions = structuredClone(selectedOptions);
    copyOfSelectedOptions[item.createdOn].selectedRg = role;
    updateRolePsOptions(item.createdOn, "ps", role);
    setSelectedOptions(copyOfSelectedOptions);
  };

  const handlePsSelection = (ps: any) => {
    const copyOfSelectedOptions = structuredClone(selectedOptions);
    copyOfSelectedOptions[item.createdOn].selectedPsg = ps;
    const { selectedOrg, selectedRg } = copyOfSelectedOptions[item.createdOn];
    const res = buildSelectedMembers(selectedOrg, selectedRg, ps);
    updateValuesInSource(item, "orgGrp", res, [selectedOrg, selectedRg, ps]);
    setSelectedOptions(copyOfSelectedOptions);
  };

  return (
    <>
      {
        <TorusRow
          key={indexOfRow}
          item={item}
          id={item?.createdOn ?? []}
          index={item[primaryColumn]}
          columns={[...filterColmns]}
          selectedKeys={selectedKeys}
          className={`flex  pl-1.5 items-center  leading-[1.04vw] dark:hover:text-[${torusTheme["text"]}] outline-none hover:cursor-pointer border-b-[${torusTheme["border"]}] border-t-transparent border-l-transparent border-r-transparent dark:text-[${torusTheme["text"]}]`}
          style={{
            fontSize : `${fontSize * 0.72}vw`
           }}
         
        >
          {({ columns, index, item }: any) => (
            <>
              {columns.map((column: any, i: number) => (
                <Cell key={i} className="flex">
                  <div className="w-full flex flex-col items-center">
                    <TableCell
                      item={item}
                      column={column}
                      indexOfRow={indexOfRow}
                      handleEdit={handleEdit}
                      editingCell={editingCell}
                      handleChangeValue={handleChangeValue}
                      allOptions={allOptions}
                      selectedOptions={selectedOptions}
                      handleOrgSelection={handleOrgSelection}
                      handleRoleSelection={handleRoleSelection}
                      handlePsSelection={handlePsSelection}
                      organizationMatrix={organizationMatrix}
                      tenantAccess={tenantAccess}
                    />
                  </div>
                </Cell>
              ))}
            </>
          )}
        </TorusRow>
      }
    </>
  );
};

const SecurityTemplate = ({
  securityData,
  onUpdateSecurityData,
  tenantAccess,
  selectedRows,
  setSelectedRows,
}: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState([]);
  const [wordLength, setWordLength] = useState(0);
  const [editingCell, setEditingCell] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [allOptions, setAllOptions] = useState<any>({});
  const [organizationMatrix, setOrganizationMatrix] = useState<any[]>([]);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const getRoleOptions = (organization: any) => {
    const initialRoleOptions: any[] = [];
    if (organization?.length) {
      organization.forEach((grpOrg: any) => {
        grpOrg.org.forEach((org: any) => {
          org.roleGrp.forEach((roleGrp: any) => {
            initialRoleOptions.push({
              ...roleGrp,
              orgGrpCode: grpOrg.orgGrpCode,
              orgCode: org.orgCode,
            });
          });
        });
      });
    }
    return initialRoleOptions;
  };

  const getPsOptions = (roles: any) => {
    const initialProductServiceOptions: any[] = [];
    if (roles?.length) {
      roles.forEach((grpRG: any) => {
        grpRG.roles.forEach((role: any) => {
          role.psGrp.forEach((psGrp: any) => {
            initialProductServiceOptions.push({
              ...psGrp,
              roleGrpCode: grpRG.roleGrpCode,
              roleCode: role.roleCode,
            });
          });
        });
      });
    }
    return initialProductServiceOptions;
  };

  const formattedDate = new Date()
    .toLocaleString("en-US", {
      month: "long", // Full month name
      day: "2-digit", // Two-digit day
      year: "numeric", // Full year
      hour: "2-digit", // Two-digit hour
      minute: "2-digit", // Two-digit minute
      second: "2-digit", // Two-digit second
      hour12: false, // 24-hour format
    })
    .replace(`at`, `|`);

  const getSecurityTemplate = async (tenant?: string) => {
    try {
      const res = await AxiosService.get(
        `/api/getSecurityTemplateData?tenant=${tenant ? tenant : "ABC"}`
      );
      if (res.status === 200) {
        const result: any[] = res.data.map((item: any) => {
          return {
            accessProfile: item.accessProfile,
            organization: item.organization ?? [],
            roles: item.roles ?? [],
            orgGrp: item.orgGrp ?? [],
            "products/Services": item["products/Services"] ?? [],
            "no.ofusers": item["no.ofusers"],
            createdOn: item.createdOn,
          };
        });
        onUpdateSecurityData(result);
        result.forEach((item: any) => {
          setSelectedOptions((prevState: any) => ({
            ...prevState,
            [item.createdOn]: {
              selectedOrg: item.organization,
              selectedRg: item.roles,
              selectedPsg: item["products/Services"],
            },
          }));
          setAllOptions((prevState: any) => ({
            ...prevState,
            [item.createdOn]: {
              roleOptions: getRoleOptions(item?.organization ?? []),
              psOptions: getPsOptions(item?.roles ?? []),
            },
          }));
        });
      } else {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error Occured",
            text: `Something Went Wrong`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Fetching Security Template Data";
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

  const getOrganizationMatrix = async (tenant?: string) => {
    try {
      const response = await AxiosService.get(
        `/api/get-tenant-organization-matrix?tenant=${tenant ? tenant : "ABC"}`
      );
      if (response.status == 200) {
        setOrganizationMatrix(response.data);
      } else {
        throw new Error("error occured calling Api");
      }
    } catch (error) {
      console.log("error occured " + error);
    }
  };

  useEffect(() => {
    if (tenant) {
      getSecurityTemplate(tenant);
      getOrganizationMatrix(tenant);
    } else {
      getSecurityTemplate();
      getOrganizationMatrix();
    }
  }, [tenant]);

  const columns = [
    "accessProfile",
    "organization",
    "roles",
    "products/Services",
    "no.ofusers",
    "createdOn",
  ];

  const handleAddNewTemplate = () => {
    const newTemplate = {
      accessProfile: `Template ${securityData.length + 1}`,
      organization: [],
      roles: [],
      "products/Services": [],
      "no.ofusers": "0",
      createdOn: formattedDate,
    };
    setSelectedOptions((prev: any) => ({
      ...prev,
      [formattedDate]: {
        selectedOrg: [],
        selectedRg: [],
        selectedPsg: [],
      },
    }));
    setAllOptions((prev: any) => ({
      ...prev,
      [formattedDate]: {
        roleOptions: [],
        psOptions: [],
      },
    }));
    onUpdateSecurityData([...securityData, newTemplate]);
  };

  const handleEdit = (item: any) => {
    setEditingCell(item);
  };

  const handleChangeValue = (item: any, key: string, value: string) => {
    const copyOfDisplayedData = structuredClone(securityData);
    const foundIndex = copyOfDisplayedData.findIndex(
      (obj: any) => obj.createdOn === item.createdOn
    );
    if (
      securityData.find((item: any) => item.accessProfile === value) &&
      key == "accessProfile"
    ) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "warning",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Occured",
          text: `Please provide unique access template name`,
          closeButton: false,
        } as any
      );
      return;
    }
    copyOfDisplayedData[foundIndex][key] = value;
    onUpdateSecurityData(copyOfDisplayedData);
  };

  const updateValuesInSource = (
    item: any,
    key: string,
    value: any,
    resourceArray?: any[]
  ) => {
    if (resourceArray?.length) {
      const [organization, roles, ps] = resourceArray;
      const copyOfDisplayedData = structuredClone(securityData);
      const indexTobeModifiled = copyOfDisplayedData.findIndex(
        (obj: any) => obj.createdOn === item.createdOn
      );
      copyOfDisplayedData[indexTobeModifiled][key] = value;
      copyOfDisplayedData[indexTobeModifiled]["organization"] = organization;
      copyOfDisplayedData[indexTobeModifiled]["roles"] = roles;
      copyOfDisplayedData[indexTobeModifiled]["products/Services"] = ps;
      onUpdateSecurityData(copyOfDisplayedData);
    }
  };

  function camelCaseToParagraphCase(str: string) {
    // Step 1: Insert spaces before capital letters
    let result = str.replace(/([A-Z])/g, " $1");

    result = result
      .split(" ")
      .map((word) => capitalize(word))
      .join(" ");

    return result;
  }

  return (
    <div className="flex flex-col w-[87.18vw] h-full gap-[0.58vw]">
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col gap-[0.58vw]">
          <h1
            style={{ color: torusTheme["text"],fontSize : `${fontSize * 1.25}vw` }}
            className=" leading-[1.85vh] font-semibold"
          >
            {locale["Access Template"]}
          </h1>
        </div>
        <Button
          id="st-creation-btn"
          onPress={() => handleAddNewTemplate()}
          className={"hidden"}
        ></Button>
      </div>
      <div className="flex w-[87.18vw] h-[100%]">
        <TorusTable
          allowsSorting={false}
          primaryColumn="accessProfile"
          tableData={securityData}
          visibleColumns={columns}
          isSkeleton={true}
          searchValue={searchTerm}
          rowsPerPage={9}
          selectionBehavior={tenantAccess === "view" ? "" : "toggle"}
          selectionMode="multiple"
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          isFixedWidth={false}
          chwp="90"
          chwop="92"
        >
          {({
            selectedKeys,
            filterColmns,
            sortedItems,
            primaryColumn,
          }: any) => (
            <>
              <TorusTableHeader
                className="flex w-full rounded-l"
                style={{ backgroundColor: torusTheme["bgCard"] }}
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
                        className={`w-[87.18vw]  leading-[1.04vw] font-semibold  rounded-r cursor-pointer ${i == 0 ? "" : ""
                          } ${i == filterColmns.length - 1 ? "" : ""} ${column.name == "accessProfile"
                            ? "w-[12vw] pr-10"
                            : column.name == "organization"
                              ? "w-[13.33vw]"
                              : column.name == "roles"
                                ? "w-[14.52vw]"
                                : column.name == "products/Services"
                                  ? "w-[15.50vw]"
                                  : column.name == "no.ofusers"
                                    ? "w-[2.16vw]"
                                    : column.name == "createdOn"
                                      ? "w-[23vw] pr-20"
                                      : ""
                          } text-nowrap`}
                          style={{ color: torusTheme["text"],backgroundColor: torusTheme["bgCard"],fontSize : `${fontSize * 0.72}vw`  }}
                      >
                        {column.name == "accessProfile"
                          ? locale["Access Template"]
                          : locale[camelCaseToParagraphCase(column.name)]}
                      </TorusColumn>
                    ))}
                  </>
                )}
              </TorusTableHeader>
              <TableBody
                className={" w-full h-[56.66vh] overflow-hidden"}
                renderEmptyState={() => (
                  <div className="text-center">No detail found</div>
                )}
              >
                {sortedItems.map((item: any, index: number) => (
                  <RenderTableRow
                    key={index}
                    item={item}
                    index={index}
                    filterColmns={filterColmns}
                    primaryColumn={primaryColumn}
                    selectedKeys={selectedKeys}
                    handleEdit={handleEdit}
                    editingCell={editingCell}
                    handleChangeValue={handleChangeValue}
                    allOptions={allOptions}
                    setAllOptions={setAllOptions}
                    setSelectedOptions={setSelectedOptions}
                    selectedOptions={selectedOptions}
                    getRoleOptions={getRoleOptions}
                    getPsOptions={getPsOptions}
                    updateValuesInSource={updateValuesInSource}
                    organizationMatrix={organizationMatrix}
                    tenantAccess={tenantAccess}
                  />
                ))}
              </TableBody>
            </>
          )}
        </TorusTable>
      </div>
    </div>
  );
};

export default SecurityTemplate;
