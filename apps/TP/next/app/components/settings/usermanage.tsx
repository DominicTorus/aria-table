import React, { useEffect, useState } from "react";
import {
  Button,
  Cell,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  TableBody,
} from "react-aria-components";
import DropDown from "../multiDropdownnew";
import {
  TorusColumn,
  TorusRow,
  TorusTable,
  TorusTableHeader,
} from "../torusComponents/torusTable";
import TorusAvatar from "../Avatar";
import { AxiosService } from "../../../lib/utils/axiosService";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";
import { capitalize } from "../../../lib/utils/utility";
import { getCookie } from "../../../lib/utils/cookiemgmt";
import UserModal from "../../control-center/userModal";

const TableCell = ({
  item,
  accessProfiles,
  column,
  handleAccessProfile,
  handledatechange,
  tenantAccess,
}: {
  item: any;
  column: any;
  handleAccessProfile: (
    accessProfile: string | any,
    itemToBeUpdated?: any
  ) => void;
  handledatechange: (date: string, itemToBeUpdated?: any) => void;
  accessProfiles: string[];
  tenantAccess: "view" | "edit" | null | undefined;
}) => {
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const localeFromCookie = getCookie("cfg_lc") ? getCookie("cfg_lc") : "en-GB";
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(localeFromCookie, options);
    const time = date.toLocaleTimeString(localeFromCookie, { hour12: false }); // 24-hour format HH:MM:SS
    if(isNaN(date.getTime())){
      return "NA"
    }
    return `${formattedDate} | ${time}`;
  };

  const formattedDate = new Date(item.dateAdded).toLocaleString(
    localeFromCookie,
    {
      month: "long", // Full month name
      day: "2-digit", // Two-digit day
      year: "numeric", // Full year
    }
  );

  const handleSelection = (selectedKeys: any) => {
    handleAccessProfile(selectedKeys, item);
  };

  switch (column.key) {
    case "users":
      return (
        <div className="flex w-[10.95vw] gap-[0.58vw] items-center">
          <TorusAvatar radius="full" size="w-[1.66vw] h-[1.66vw]" />
          <div className="flex flex-col text-nowrap">
            <h1
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
              className=" leading-[1.04vw]"
            >
              {item.users}
            </h1>
            <h6
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
              className=" leading-[1.04vw]"
            >
              {item.email}
            </h6>
          </div>
        </div>
      );
    case "accessProfile":
      return (
        <DropDown
          multiple
          triggerButton={
            item?.accessProfile?.length
              ? item?.accessProfile?.length == 1
                ? item?.accessProfile[0]
                : "Multiple Templates"
              : "Select accessTemplate"
          }
          selectedKeys={item?.accessProfile ?? []}
          isDisabled={tenantAccess === "view"}
          setSelectedKeys={handleSelection}
          displaySelectedKeys={false}
          items={Object.keys(accessProfiles)}
          classNames={{
            triggerButton: `w-[7.42vw] h-[4vh] pressed:animate-torusButtonActive rounded-lg  leading-[1.04vh] mt-[0.58vw] `,
            popover: "w-[9.42vw]",
            listbox: "overflow-y-auto",
            listboxItem: "flex  leading-[2.22vh] justify-between",
          }}
          styles={{
            triggerButton: { backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.72}vw` },
            popover: { backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] , fontSize: `${fontSize * 0.72}vw` },
            listboxItem: { fontSize: `${fontSize * 0.83}vw` },
          }}
        />
      );
    case "noOfProductsService":
      return (
        <div
          style={{ fontSize: `${fontSize * 0.72}vw` }} className=" w-[8.48vw] leading-[1.04vw] items-center flex h-full justify-center">
          {item.noOfProductsService}
        </div>
      );
    case "accessExpires":
      return (
        <div className="flex flex-col w-[11.03vw] items-center">
          <div
            style={{ fontSize: `${fontSize * 0.72}vw`, backgroundColor: torusTheme["bgCard"] }}
            className={`flex  leading-[1.04vw] px-[1.17vw] py-[0.58vw] rounded-md mt-[0.58vw]`}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                style={{ backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.72}vw` }}
                className="cursor-pointer "

                type="date"
                
                defaultValue={item.accessExpires}

                disabled={
                  
                  tenantAccess != "edit"
                    ? true
                    : item.accessProfile &&
                    Array.isArray(item.accessProfile) &&
                    item.accessProfile.includes("admin")
                }
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => handledatechange(e.target.value, item)}
              />
            </form>
          </div>
        </div>
      );
    case "lastActive":
      return (
        <div
          style={{ fontSize: `${fontSize * 0.62}vw` }}
          className={`w-[9.23vw]  leading-[1.85vh] items-center flex h-full ${item.lastActive ? "justify-center" : "pl-[2vw]"} `}
        >
          {item.lastActive ? formatDate(item.lastActive) ?? "NA" : "NA"}
        </div>
      );
    case "dateAdded":
      return (
        <div
          style={{ fontSize: `${fontSize * 0.62}vw` }} className="w-[7.06vw]  leading-[1.85vh] items-center flex h-full justify-center">
          {formattedDate}
        </div>
      );
    default:
      return <div>{item[column.key]}</div>;
  }
};

const RenderTableRow = ({
  item,
  index,
  filterColmns,
  selectedKeys,
  primaryColumn,
  userProfileData,
  updateValuesInSource,
  accessProfiles,
  tenantAccess,
}: {
  item: any;
  index: number;
  filterColmns: any;
  selectedKeys: any;
  primaryColumn: any;
  userProfileData: any;
  updateValuesInSource: any;
  accessProfiles: string[];
  tenantAccess: "view" | "edit" | null | undefined;
}) => {
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const handleAccessProfile = (
    accessProfile: string,
    itemToBeUpdated?: any
  ) => {
    const foundIndex = userProfileData.findIndex(
      (obj: any) => obj.email === itemToBeUpdated.email
    );
    updateValuesInSource(foundIndex, "accessProfile", accessProfile, true);
  };
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);

  const handledatechange = (date: string, itemToBeUpdated?: any) => {
    const foundIndex = userProfileData.findIndex(
      (obj: any) => obj.email === itemToBeUpdated.email
    );
    updateValuesInSource(foundIndex, "accessExpires", date);
  };

  
  return (
    <>
      <TorusRow
        key={index}
        item={item}
        index={item[primaryColumn]}
        columns={[...filterColmns]}
        selectedKeys={selectedKeys}
        className={`flex  pl-1.5 leading-[1.04vw] dark:hover:text-[${torusTheme["text"]}] outline-none hover:cursor-pointer border-b-[${torusTheme["border"]}] text-[${torusTheme["text"]}] overflow-y-auto border-t-transparent border-l-transparent border-r-transparent ${index == 0 ? "mt-[0.58vw]" : ""}`}
        style={{
          fontSize: `${fontSize * 0.72}vw`
        }}
      >
        {({ columns, index, item }: any) => (
          <>
            {columns.map((column: any, i: number) => (
              <Cell key={i}>
                <div className="w-full h-full flex flex-col items-center ">
                  <TableCell
                    accessProfiles={accessProfiles}
                    column={column}
                    handleAccessProfile={handleAccessProfile}
                    handledatechange={handledatechange}
                    item={item}
                    key={JSON.stringify(item)}
                    tenantAccess={tenantAccess}
                  />
                </div>
              </Cell>
            ))}
          </>
        )}
      </TorusRow>
    </>
  );
};

const UserManage = ({
  userProfileData,
  setUserProfileData,
  tenantAccess,
  selectedRows,
  setSelectedRows,
}: {
  userProfileData: any[];
  setUserProfileData: (data: any) => void;
  tenantAccess: "view" | "edit" | null | undefined;
  selectedRows: Set<any>;
  setSelectedRows(value: any): void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    users: "",
    email: "",
    password: "",
    
  });
  const [accessProfiles, setAccessProfiles] = useState([]);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const [wordLength, setWordLength] = useState(0);

  const getUserDetailsBasedOnTenant = async (tenantParam?: string) => {
    try {
      setUserProfileData([]);
      const givenTenant = tenantParam ? tenantParam : tenant ? tenant : "ABC";
      const res = await AxiosService.get(
        `/api/getUserList?client=${givenTenant}`
        // `/tp/getUserList?client=${givenTenant}`
      );
      if (res.status === 200) {
        const result = res.data.map((item: any, i: number) => ({
          users:
            item.firstName && item.lastName
              ? item.firstName + " " + item.lastName
              : item.loginId
                ? item.loginId
                : "",
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          loginId: item.loginId,
          mobile: item.mobile,
          accessProfile: item?.accessProfile ?? [],
          noOfProductsService: item?.noOfProductsService || 0,
          accessExpires: item?.accessExpires,
          lastActive: item?.lastActive ?? "NA",
          dateAdded: item?.dateAdded ?? "",
        }));
        setUserProfileData(result);
      }
    } catch (error: any) {
      setUserProfileData([])
    }
  };

  const getAccessProfiles = async (tenant?: string) => {
    try {
      const givenTenant = tenant ? tenant : "ABC";
      const res = await AxiosService.get(
        `/api/getAccessProfiles?tenant=${givenTenant}`
      );
      if (res.status === 200) {
        setAccessProfiles(res.data);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Fetching Access Profiles";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  useEffect(() => {
    if (tenant) {
      getUserDetailsBasedOnTenant(tenant);
      getAccessProfiles(tenant);
    } else {
      getUserDetailsBasedOnTenant();
      getAccessProfiles();
    }
  }, [tenant]);

  const updateValuesInSource = (
    indexTobeModifiled: number,
    key: string,
    value: any,
    isAccessProfile?: boolean
  ) => {
    const copyOfDisplayedData = structuredClone(userProfileData);
    copyOfDisplayedData[indexTobeModifiled][key] = value;
    if (isAccessProfile) {
      var noOfProd = 0;
      value.forEach((item: any) => {
        noOfProd += accessProfiles[item];
      });
      copyOfDisplayedData[indexTobeModifiled]["noOfProductsService"] = noOfProd;
    }
    setUserProfileData(copyOfDisplayedData);
  };

  const Columnchange = [
    "users",
    "accessProfile",
    "noOfProductsService",
    "accessExpires",
    "lastActive",
    "dateAdded",
  ];

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
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center mb-[0.58vw]">
        <h1
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}
          className=" leading-[1.04vw] font-semibold"
        >
          {locale["User Management"]}
        </h1>
        <DialogTrigger>
        <Button
          id="user-creation-btn"
          onPress={() => setIsModalOpen(true)}
          className={"hidden"}
        ></Button>
        {isModalOpen && (
          <ModalOverlay
            isDismissable
            className={`fixed z-[100] top-0 left-0 w-screen h-screen bg-transparent/45 flex items-center justify-center outline-none 
             `}
          >
            <Modal isDismissable className={`outline-none w-[44.73vw]`}>
              <Dialog
                style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"] }}
                className={`rounded-lg outline-none`}
              >
                <UserModal
                  setIsModalOpen={setIsModalOpen}
                  newUser={newUser}
                  setNewUser={setNewUser}
                  accessProfiles={Object.keys(accessProfiles)}
                  data={userProfileData}
                  setData={setUserProfileData}
                  isTenantUser={true}
                />
               
              </Dialog>
            </Modal>
          </ModalOverlay>
        )}
      </DialogTrigger>
      </div>

      <div className="w-full h-[84.98vh] relative">
        <TorusTable
          allowsSorting={false}
          primaryColumn="users"
          tableData={userProfileData}
          visibleColumns={Columnchange}
          rowsPerPage={9}
          isSkeleton={true}
          searchValue={searchTerm}
          selectionBehavior={tenantAccess === "view" ? "" : "toggle"}
          selectionMode="multiple"
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
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
                className={"flex w-full ] rounded-l z-50"}
                style={{ backgroundColor: torusTheme["bgCard"] }}
                selectedKeys={selectedKeys}
                columns={[...filterColmns]}
              >
                {({ columns }: any) => (
                  <>
                    {columns.map((column: any, i: number) => (
                      <TorusColumn
                        key={column.id}
                        leftalign={true}
                        id={column.id}
                        allowsSorting={column.allowsSorting}
                        isRowHeader={column.isRowHeader}
                        className={` leading-[1.04vw] font-semibold  rounded-r  cursor-pointer ${i == 0 ? "" : ""
                          } ${i == filterColmns.length - 1 ? "" : ""} 
                        ${column.name == "users"
                            ? "w-[9.95vw] "
                            : column.name == "accessProfile"
                              ? "w-[8.42vw]"
                              : column.name == "noOfProductsService"
                                ? "w-[3.48vw]"
                                : column.name == "accessExpires"
                                  ? "w-[9.03vw]"
                                  : column.name == "lastActive"
                                    ? "ml-[1vw] w-[8.73vw]"
                                    : column.name == "dateAdded"
                                      ? "w-[4.06vw] pr-[33vw]"
                                      : ""
                          } text-nowrap`}
                        style={{ color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.72}vw` }}
                      >
                        {
                          locale[
                          column.name == "accessProfile"
                            ? "Access Template"
                            : camelCaseToParagraphCase(column.name)
                          ]
                        }
                      </TorusColumn>
                    ))}
                  </>
                )}
              </TorusTableHeader>
              {/* <Separator className="dark:border-[#212121] border border-black" /> */}
              <TableBody
                className={"w-full overflow-y-auto flex flex-col gap-[0.2vw]"}
                renderEmptyState={() => (
                  <div
                    style={{ color: torusTheme["text"] }}
                    className="text-center"
                  >
                    No User details found
                  </div>
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
                    updateValuesInSource={updateValuesInSource}
                    userProfileData={userProfileData}
                    accessProfiles={accessProfiles}
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

export default UserManage;
