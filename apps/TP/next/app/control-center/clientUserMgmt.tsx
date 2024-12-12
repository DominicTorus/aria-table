import React, { useEffect, useState } from "react";
import {
  TorusColumn,
  TorusRow,
  TorusTable,
  TorusTableHeader,
} from "../components/torusComponents/torusTable";
import {
  Button,
  Cell,
  Dialog,
  DialogTrigger,
  Input,
  Modal,
  ModalOverlay,
  TableBody,
} from "react-aria-components";
import DropDown from "../components/multiDropdownnew";
import TorusAvatar from "../components/Avatar";
import { AxiosService } from "../../lib/utils/axiosService";
import { getCookie } from "../../lib/utils/cookiemgmt";
import { ClosePassword, Multiply } from "../constants/svgApplications";
import { PiEye } from "react-icons/pi";
import { capitalize } from "../../lib/utils/utility";
import TorusToast from "../components/torusComponents/torusToast";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";
import UserModal from "./userModal";

const TableCell = ({
  item,
  accessProfiles,
  column,
  handleAccessProfile,
  handledatechange,
  access,
}: {
  item: any;
  column: any;
  handleAccessProfile: (
    accessProfile: string | any,
    itemToBeUpdated?: any,
    isAccessProfile?: boolean
  ) => void;
  handledatechange: (date: string, itemToBeUpdated?: any) => void;
  accessProfiles: string[];
  access: "view" | "edit" | null;
}) => {
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const time = date.toLocaleTimeString("en-US", { hour12: false }); // 24-hour format HH:MM:SS
    return `${formattedDate} | ${time}`;
  };

  const formattedDate = new Date(item.dateAdded).toLocaleString("en-US", {
    month: "long", // Full month name
    day: "2-digit", // Two-digit day
    year: "numeric", // Full year
  });

  const handleSelection = (selectedKeys: any) => {
    handleAccessProfile(selectedKeys, item, true);
  };

  const handleStatusSelection = (selectedKeys: any) => {
    handleAccessProfile(selectedKeys, item, false);
  };

  switch (column.key) {
    case "users":
      return (
        <div className="flex w-[10.95vw] gap-2 items-center">
          <TorusAvatar radius="full" size="w-[1.66vw] h-[1.66vw]" />
          <div className="flex flex-col text-nowrap">
            <h1 className="leading-[1.04vw] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
              {item.users}
            </h1>
            <h6 className="leading-[1.04vw]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
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
                : locale["Multiple Roles"]
              : locale["Select Role"]
          }
          selectedKeys={item?.accessProfile ?? []}
          setSelectedKeys={handleSelection}
          displaySelectedKeys={false}
          items={accessProfiles}
          classNames={{
            triggerButton: `w-[7.42vw] h-[4vh] pressed:animate-torusButtonActive rounded-lg leading-[1.04vh] mt-2`,
            popover: `w-[9.42vw]`,
            listbox: `overflow-y-auto`,
            listboxItem: "flex leading-[2.22vh] justify-between",
          }}
          styles={{
            triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.72}vw` },
            popover: { backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] },
            listbox: { borderColor: torusTheme["border"] },
            listboxItem: { fontSize: `${fontSize * 0.83}vw` },
          }}
          isDisabled={
            access != "edit"
              ? true
              : item.accessProfile &&
              Array.isArray(item.accessProfile) &&
              item.accessProfile.includes("admin")
          }
        />
      );
    case "noOfProductsService":
      return (
        <div className="w-[8.48vw] leading-[1.04vw] items-center flex h-full justify-center"
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
          {item.noOfProductsService}
        </div>
      );
    case "accessExpires":
      return (
        <div className="flex flex-col w-[11.03vw] items-center">
          <div className="flex leading-[1.04vw] px-4 py-2 rounded-md mt-[0.58vh]"
            style={{ backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.72}vw` }}>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="cursor-pointer disabled:cursor-default"
                autoComplete="off"
                style={{ backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.72}vw` }}
                type="date"
                defaultValue={item.accessExpires}
                min={new Date().toISOString().split("T")[0]}
                disabled={
                  access != "edit"
                    ? true
                    : item.accessProfile &&
                    Array.isArray(item.accessProfile) &&
                    item.accessProfile.includes("admin")
                }
                onChange={(e) => handledatechange(e.target.value, item)}
              />
            </form>
          </div>
        </div>
      );
    case "lastActive":
      return (
        <div className="w-[9.23vw] leading-[1.85vh]  items-center flex h-full justify-center"
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }}>
          {item.lastActive ? formatDate(item.lastActive) : "NA"}
        </div>
      );
    case "dateAdded":
      return (
        <div className="w-[8.06vw] leading-[1.85vh] items-center flex h-full justify-center"
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }}>
          {formattedDate}
        </div>
      );
    case "status":
      return (
        <DropDown
          triggerButton={item?.status ? item.status : "Select Status"}
          selectedKeys={item?.status ?? ""}
          setSelectedKeys={handleStatusSelection}
          displaySelectedKeys={false}
          items={["active", "inactive", "suspended"]}
          classNames={{
            triggerButton: `w-[7.42vw] h-[4vh] pressed:animate-torusButtonActive rounded-lg leading-[1.04vh] mt-2 ml-2`,
            popover: `w-[9.42vw]`,
            listbox: `overflow-y-auto`,
            listboxItem: "flex leading-[2.22vh] justify-between",
          }}
          styles={{
            triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.72}vw` },
            popover: { backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] },
            listbox: { borderColor: torusTheme["border"] },
            listboxItem: { fontSize: `${fontSize * 0.83}vw` },
          }}
          isDisabled={
            access != "edit"
              ? true
              : item.accessProfile &&
              Array.isArray(item.accessProfile) &&
              item.accessProfile.includes("admin")
          }
        />
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
  access,
}: {
  item: any;
  index: number;
  filterColmns: any;
  selectedKeys: any;
  primaryColumn: any;
  userProfileData: any;
  updateValuesInSource: any;
  accessProfiles: string[];
  access: "view" | "edit" | null;
}) => {
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleAccessProfile = (
    value: string,
    itemToBeUpdated?: any,
    isAccessProfile: boolean = true
  ) => {
    const foundIndex = userProfileData.findIndex(
      (obj: any) => obj.email === itemToBeUpdated.email
    );
    if (isAccessProfile) {
      updateValuesInSource(foundIndex, "accessProfile", value);
    } else {
      updateValuesInSource(foundIndex, "status", value, true);
    }
  };

  const handledatechange = (date: string, itemToBeUpdated?: any) => {
    const foundIndex = userProfileData.findIndex(
      (obj: any) => obj.email === itemToBeUpdated.email
    );
    updateValuesInSource(foundIndex, "accessExpires", date);
  };
  return (
    <>
      <TorusRow
        key={JSON.stringify(item)}
        item={item}
        index={item[primaryColumn]}
        columns={[...filterColmns]}
        selectedKeys={selectedKeys}
        className={`flex pl-1.5 leading-[1.04vw] outline-none hover:cursor-pointer border-b-slate-800 border-t-transparent border-l-transparent border-r-transparent  ${index == 0 ? "mt-[0.58vw]" : ""}`}
        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
        disableSelection={item?.accessProfile?.includes("admin") ? true : false}
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
                    access={access}
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

const ClientUserManagement = ({
  data,
  setData,
  searchTerm,
  access,
  selectedRows,
  setSelectedRows
}: {
  data: any;
  setData: (value: any) => void;
  searchTerm: string;
  access: "view" | "edit" | null;
  selectedRows: Set<any>;
  setSelectedRows: (value: any) => void;
}) => {
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const Columnchange = [
    "users",
    "accessProfile",
    "accessExpires",
    "lastActive",
    "dateAdded",
    "status",
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Record<string, any>>({
    firstName: "",
    lastName: "",
    loginId: "",
    email: "",
    mobile: "",
    password: "",
    status: true,
    accessProfile: [],
    accessExpires: "",
    dateAdded: new Date(),
    profile: ""
  });
  const client = getCookie("tp_cc");
  const [accessProfiles, setAccessProfiles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [wordLength, setWordLength] = useState(0);

  const updateValuesInSource = (
    indexTobeModifiled: number,
    key: string,
    value: any
  ) => {
    const copyOfDisplayedData = structuredClone(data);
    copyOfDisplayedData[indexTobeModifiled][key] = value;
    setData(copyOfDisplayedData);
  };

  const fetchUserRoles = async () => {
    try {
      const res = await AxiosService.post("/api/readkey", {
        SOURCE: "redis",
        TARGET: "redis",
        CK: "TGA",
        FNGK: "SETUP",
        FNK: "SF",
        CATK: "CLIENT",
        AFGK: `${client}`,
        AFK: "PROFILE",
        AFVK: "v1",
        AFSK: "userRoles",
      });
      if (res.status == 201) {
        if (res.data.length) {
          setAccessProfiles(res.data.map((roleObj: any) => roleObj.role));
        }
      } else {
        setAccessProfiles([]);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving User Roles Info";
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

  useEffect(() => {
    fetchUserRoles();
  }, []);

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
    <div className="flex flex-col gap-[2.49vh] h-[93.61vh] w-[86.93vw] px-[0.83vw] py-[1.87vh]">
      <div className="flex flex-col gap-[2vh]">
        <h1 className="font-semibold leading-[1.85vh]"
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}>
          {locale["User Management"]}
        </h1>
      </div>
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
                  accessProfiles={accessProfiles}
                  data={data}
                  setData={setData}
                />
              </Dialog>
            </Modal>
          </ModalOverlay>
        )}
      </DialogTrigger>
      <div className="flex flex-col w-[86.92vw] h-[85.8vh]">
        <TorusTable
          allowsSorting={false}
          primaryColumn="users"
          tableData={data}
          rowsPerPage={9}
          visibleColumns={Columnchange}
          isSkeleton={true}
          searchValue={searchTerm}
          // selectionBehavior={access != "edit" ? null : "toggle"}
          selectionBehavior="toggle"
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
                className="flex w-full rounded-l h-14 z-50"
                style={{ backgroundColor: torusTheme["bgCard"] }}
                selectedKeys={selectedKeys}
                columns={[...filterColmns]}
              >
                {({ columns }: any) => (
                  <>
                    {columns.map((column: any, i: number) => (
                      <TorusColumn
                        key={i}
                        leftalign={true}
                        id={column.id}
                        allowsSorting={column.allowsSorting}
                        isRowHeader={column.isRowHeader}
                        className={`leading-[1.04vw] rounded-r cursor-pointer font-semibold
                          ${i == 0 ? "" : ""
                          } ${i == filterColmns.length - 1 ? "" : ""} 
                        ${column.name == "users"
                            ? "w-[8.95vw]"
                            : column.name == "accessProfile"
                              ? "w-[9.42vw]"
                              : column.name == "accessExpires"
                                ? "w-[11.03vw]"
                                : column.name == "lastActive"
                                  ? "w-[8.73vw]"
                                  : column.name == "dateAdded"
                                    ? "w-[8.06vw]"
                                    : column.name == "status"
                                      ? "w-[4.06vw] pr-[33vw]"
                                      : ""
                          } text-nowrap`}
                        style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                      >
                        {
                          locale[
                          column.name == "accessProfile"
                            ? "User Roles"
                            : camelCaseToParagraphCase(column.name)
                          ]
                        }
                      </TorusColumn>
                    ))}
                  </>
                )}
              </TorusTableHeader>
              <TableBody
                className={
                  "w-full h-[74vh] overflow-y-auto flex flex-col gap-[0.2vw]"
                }
                renderEmptyState={() => (
                  <div className="text-center "
                    style={{ color: torusTheme["text"] }}>
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
                    userProfileData={data}
                    accessProfiles={accessProfiles}
                    access={access}
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

export default ClientUserManagement;
