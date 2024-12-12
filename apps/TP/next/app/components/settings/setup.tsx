"use client";
import React, { useEffect, useState } from "react";
import {
  App,
  CreateTenantPlusIcon,
  DeleteIcon,
  Management,
  Org,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  Security,
  Tenant,
} from "../../constants/svgApplications";
import { AxiosService } from "../../../lib/utils/axiosService";
import { Button, Input, ListBoxItem } from "react-aria-components";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";
import Tenantselection from "../../components/settings/tenant";
import UserManage from "../../components/settings/usermanage";
import SecurityTemplate from "./securityTemplate";
import DynamicGroupMemberAccordion from "./orpsAccordion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import DropDown from "../multiDropdownnew";
import { useRouter, useSearchParams } from "next/navigation";
import Appearance from "./appGroupTable";
import { setTenant } from "../../../lib/Store/Reducers/MainSlice";
import { getCookie } from "../../../lib/utils/cookiemgmt";
import { IoIosCheckmark } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";
import Avatar from "../torusComponents/avatarComponent";
import DynamicModal from "../torusComponents/torusdelete";
import {
  findPath,
  handleDelete,
  handleDeleteGroupAndMembers,
  hexWithOpacity,
} from "../../../lib/utils/utility";
import OrgMatrix from "./orgMatrix";

type SettingTabs = "profile" | "appearance" | "org" | "st" | "user";

const SetupScreen = ({
  tenantAccess,
}: {
  tenantAccess: "view" | "edit" | null | undefined;
}) => {
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<SettingTabs>("profile");
  const [orgGrpData, setOrgGrpData] = useState<any>([]);
  const [tenantProfileData, setTenantProfileData] = useState<any>({});
  const [securityData, setSecurityData] = useState<any>([]);
  const [wordLength, setWordLength] = useState(0);
  const [userProfileData, setUserProfileData] = useState<any>([]);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const router = useRouter();
  const [TenantList, setTenantList] = useState<any[]>([]);
  const dispatch = useDispatch();
  const client = getCookie("tp_cc");
  const [selectedTenantObj, setSelectedTenantObj] = useState<any>({});
  const [SearchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const [open, Setopen] = useState(false);
  const [actionType, setActionType] = useState("");
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [focusedPath, setFocusedPath] = useState<string | null>(null);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const searchParams = useSearchParams();

  const onUpdateSecurityData = (updatedData: any[]) => {
    setSecurityData(updatedData);
  };

  const getTenantProfile = async (tenant: string) => {
    try {
      const response = await AxiosService.get(
        `/api/getTenantInfo?tenant=${tenant}`
      );
      if (response.status === 200) {
        setOrgGrpData(response.data.orgGrp);
        Object.entries(response.data).forEach(([key, value]) => {
          if (typeof value == "string") {
            setTenantProfileData((prev: any) => ({ ...prev, [key]: value }));
          }
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Fetching Tenant Profile";
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

  const isSettingTab = (value: string) => {
    const tabs = ["profile", "appearance", "org", "st", "user"]
    return tabs.includes(value);
  }

  useEffect(() => {
    if (tenant) {
      getTenantProfile(tenant);
    }
    if (typeof tenant === "string") {
      setLoading(false);
    }
    const tab = searchParams.get("tab");
    if (tab && isSettingTab(tab)) {
      setSelectedMenuItem(tab as SettingTabs);
    }
  }, [tenant]);

  const menuItems = [
    {
      items: [
        {
          name: "Tenant Profile",
          svg: (
            <Tenant
              opacity="1"
              fill={`${selectedMenuItem === "profile" ? accentColor : torusTheme["text"]}`}
            />
          ),
          code: "profile",
        },
        {
          name: "Appearance",
          svg: (
            <App
              fill={`${selectedMenuItem === "appearance" ? accentColor : torusTheme["text"]}`}
            />
          ),
          code: "appearance",
        },
        {
          name: "Organizational Matrix",
          svg: (
            <Org
              fill={`${selectedMenuItem === "org" ? accentColor : torusTheme["text"]}`}
            />
          ),
          code: "org",
        },
        {
          name: "Access Template",
          svg: (
            <Security
              fill={`${selectedMenuItem === "st" ? accentColor : torusTheme["text"]}`}
            />
          ),
          code: "st",
        },
        {
          name: "User Management",
          svg: (
            <Management
              fill={`${selectedMenuItem === "user" ? accentColor : torusTheme["text"]}`}
            />
          ),
          code: "user",
        },
      ],
    },
  ];

  const handleMenuClick = (itemCode: SettingTabs) => {
    setSelectedMenuItem(itemCode);
    setSelectedItems({});
    setSelectedRows(new Set());
  };

  const masterSave = async (isDeletion: boolean = false, data?: any) => {
    if (!isDeletion) {
      if (selectedMenuItem == "org") {
        if (findPath(orgGrpData, "")) {
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "warning",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Warning",
              text: `Please fill all the fields to save organization matrix`,
              closeButton: false,
            } as any
          );
          return;
        }
      }
    }
    try {
      const res = await AxiosService.post(`/api/post-tenant-resource`, {
        tenant: tenant,
        data:
          selectedMenuItem == "appearance"
            ? tenantProfileData
            : selectedMenuItem == "org"
              ? data
                ? data
                : orgGrpData
              : selectedMenuItem == "profile"
                ? tenantProfileData
                : [],
        resourceType:
          selectedMenuItem == "appearance" ? "profile" : selectedMenuItem,
      });
      if (res.status == 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Data ${isDeletion ? "Deleted" : "Saved"} Successfully`,
            closeButton: false,
          } as any
        );
      } else {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error",
            text: `Something went wrong`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Something went wrong";
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

  const handleUserDataSave = async (
    isDeletion: boolean = false,
    data?: any
  ) => {
    const givenTenant = tenant ? tenant : "";
    try {
      const res = await AxiosService.post(`/api/postUserList`, {
        tenant: givenTenant,
        data: data ? data : userProfileData,
      });
      if (res.status == 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Data ${isDeletion ? "Deleted" : "Saved"} Successfully`,
            closeButton: false,
          } as any
        );
      }
    } catch (error) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Network error",
          text: `Error saving user details`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleSecurityDataSave = async (
    isDeletion: boolean = false,
    data?: any
  ) => {
    try {
      const res = await AxiosService.post(`/api/postSecurityTemplateData`, {
        tenant: tenant,
        data: data ? data : securityData,
      });
      if (res.status == 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Data ${isDeletion ? "Deleted" : "Saved"} Successfully`,
            closeButton: false,
          } as any
        );
      } else {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error",
            text: `Data ${isDeletion ? "Deletion" : "Saving"} Failed`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Posting security Template Data";
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

  const handleSaveButtonClick = async () => {
    switch (selectedMenuItem) {
      case "st":
        handleSecurityDataSave();
        break;
      case "user":
        handleUserDataSave();
        break;
      default:
        masterSave();
        break;
    }
  };

  const handleUpdate = (val: any) => {
    setOrgGrpData(val);
  };

  const handletenantchange = (val: any) => {
    dispatch(setTenant(val.code));
    setSelectedTenantObj(val);
  };

  const fetchTenants = async (client: string) => {
    try {
      const res = await AxiosService.get(`/api/getClient?clientCode=${client}`);
      if (res.status === 200) {
        setTenantList(res.data);
        if (tenant) {
          setSelectedTenantObj(
            res.data.find((item: any) => item.code === tenant)
          );
        } else if (res.data.length > 0) {
          const tenantQuery = searchParams.get("tenant");
          if (tenantQuery) {
            const tenantQueryExistInList = res.data.find(
              (item: any) => item.code === tenantQuery
            );
            if (tenantQueryExistInList) {
              setSelectedTenantObj(tenantQueryExistInList);
              dispatch(setTenant(tenantQueryExistInList.code));
            } else {
              dispatch(setTenant(res.data[0].code));
              setSelectedTenantObj(res.data[0]);
            }
          } else {
            dispatch(setTenant(res.data[0].code));
            setSelectedTenantObj(res.data[0]);
          }
        } else {
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error Fetching Tenant",
              text: `No tenant found please setup tenant`,
              closeButton: false,
            } as any
          );
          router.push("/control-center");
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Fetching Tenant";
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
    if (client) {
      fetchTenants(client);
    }
  }, []);

  const renderOption = (
    item: any,
    close: () => void,
    handleSelectionChange: (selectedItem: any, close: () => void) => void,
    setOpen: (open: boolean) => void,
    selected: boolean | any
  ) => (
    <ListBoxItem
      key={item.code}
      textValue={item.name}
      onAction={() => handleSelectionChange(item, close)}
      style={{ fontSize: `${fontSize * 0.6}vw` }}
      className={`p-[0.29vw] cursor-pointer focus:outline-none flex justify-between items-center`}
    >
      <div className="flex items-center gap-[0.87vw] border-radius">
        <Avatar
          imageUrl={item.logo}
          size={"2vw"}
          name={`${item.name ?? item.code}`}
        />
        <div className="flex flex-col ">
          <span>{item.name}</span>
          <span style={{ fontSize: `${fontSize * 0.5}vw` }}>{item.code}</span>
        </div>
      </div>
      {selected && <IoIosCheckmark size={10} fill="blue" />}
    </ListBoxItem>
  );

  const handlePlusButtonClick = () => {
    switch (selectedMenuItem) {
      case "org":
        document.getElementById("orpsAdditionBtnWithFocus")?.click();
        break;
      case "st":
        document.getElementById("st-creation-btn")?.click();
        break;
      case "user":
        document.getElementById("user-creation-btn")?.click();
        break;
      default:
        break;
    }
  };

  const handleDeleteButtonClick = () => {
    switch (selectedMenuItem) {
      case "org":
        if (orgGrpData.length === 1) {
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error",
              text: `You can't delete the last organization matrix`,
              closeButton: false,
            } as any
          );
          return;
        }
        const deleteResponse = handleDeleteGroupAndMembers(
          orgGrpData,
          selectedItems,
          setSelectedItems,
          setOrgGrpData,
          masterSave
        );
        if (deleteResponse.success) {
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "success",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Success",
              text: `ORP Deleted Successfully`,
              closeButton: false,
            } as any
          );
        } else {
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error",
              text: `${"ORP Deletion Failed"}`,
              closeButton: false,
            } as any
          );
        }
        break;
      case "st":
        handleDelete(
          securityData,
          selectedRows,
          setSelectedRows,
          onUpdateSecurityData,
          handleSecurityDataSave,
          "accessProfile"
        );
        break;
      case "user":
        handleDelete(
          userProfileData,
          selectedRows,
          setSelectedRows,
          setUserProfileData,
          handleUserDataSave,
          "users"
        );
        break;
      default:
        break;
    }
    Setopen(false);
  };

  const handletitle = () => {
    if (selectedMenuItem === "st") {
      return "Delete accesstemplate";
    } else if (selectedMenuItem === "org") {
      return "Delete orgmatrix";
    } else if (selectedMenuItem === "user") {
      return "Delete user";
    } else {
      return "";
    }
  };

  const handleopenmodal = (type: any) => {
    setActionType(type);
    Setopen(true);
  };

  const handlemessage = () => {
    if (selectedMenuItem === "st") {
      return "Are you sure you want to delete this template?";
    } else if (selectedMenuItem === "org") {
      return "Are you sure you want to delete this org?";
    } else if (selectedMenuItem === "user") {
      return "Are you sure you want to delete this user?";
    } else {
      return "Are you sure you want to delete this data?";
    }
  };

  const handlestatus = () => {
    if (selectedMenuItem === "st") {
      return "Deleting the template will remove all associated";
    } else if (selectedMenuItem === "org") {
      return "Deleting the org will remove all associated";
    } else if (selectedMenuItem === "user") {
      return "Deleting the user will remove all associated";
    } else {
      return "Data deleted successfully";
    }
  };

  return (
    <>
      {!loading ? (
        <div
          style={{ backgroundColor: torusTheme["bg"] }}
          className="flex flex-col w-full h-full"
        >
          <div className="flex justify-between items-center h-[6.66vh] px-[0.58vw] ">
            <div
              style={{
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.93}vw`,
              }}
              className="flex gap-[0.58vw] items-center leading-[2.22vh] font-semibold"
            >
              <span
                className="cursor-pointer"
                onClick={() => router.push("/control-center")}
              >
                <GoArrowLeft />
              </span>
              {locale["Tenant Settings"]}
            </div>
            <div className="flex justify-center items-center gap-[0.75vw]">
              <div
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                }}
                className="relative items-center w-[23.75vw] h-[4vh]"
              >
                <span className="absolute inset-y-0 left-0 flex p-[0.58vw] h-[2.18vw] w-[2.18vw] ">
                  <SearchIcon
                    fill={torusTheme["text"]}
                    height="0.83vw"
                    width="0.83vw"
                  />
                </span>
                <Input
                  value={SearchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={locale["Search"]}
                  onFocus={(e) => (e.target.style.borderColor = accentColor)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = torusTheme["border"])
                  }
                  style={{
                    backgroundColor: torusTheme["bgCard"],
                    color: torusTheme["text"],
                    borderColor: torusTheme["border"],
                    fontSize: `${fontSize * 0.72}vw`,
                  }}
                  className={`w-full p-[0.29vw]  h-[4vh] focus:outline-none border pl-[1.76vw] font-medium rounded-md`}
                />
              </div>

              {["st", "user", "org"].includes(selectedMenuItem) && (
                <div className="flex gap-[0.29vw] items-center">
                  <Button
                    onPress={handlePlusButtonClick}
                    style={{ backgroundColor: selectedMenuItem === "org" && !focusedPath ? hexWithOpacity(accentColor, 0.5) : accentColor }}
                    className={`outline-none rounded-md px-[0.5vw] py-[0.92vh]`}
                    isDisabled={tenantAccess != "edit" || selectedMenuItem === "org" && !focusedPath}
                  >
                    <PlusIcon fill="white" />
                  </Button>

                  <DynamicModal
                    open={open}
                    isDisabled={
                      selectedMenuItem === "st" || selectedMenuItem === "user"
                        ? Array.from(selectedRows).filter(Boolean).length > 0
                          ? false
                          : true
                        : Object.keys(selectedItems).length > 0 &&
                          Object.values(selectedItems).includes(true)
                          ? tenantAccess != "edit"
                            ? true
                            : false
                          : true
                    }
                    triggerButton={
                      <Button
                        className={`${selectedMenuItem === "org" ? "hidden" : ""} outline-none ${((selectedMenuItem === "st" || selectedMenuItem === "user") && Array.from(selectedRows).filter(Boolean).length > 0) || (Object.keys(selectedItems).length > 0 && Object.values(selectedItems).includes(true)) ? "bg-[#F14336]" : "bg-[#F14336]/50"} rounded-md px-[0.5vw] py-[0.92vh]`}
                        onPress={() => handleopenmodal(actionType)}
                        isDisabled={
                          selectedMenuItem === "st" ||
                            selectedMenuItem === "user"
                            ? Array.from(selectedRows).filter(Boolean).length >
                              0
                              ? false
                              : true
                            : Object.keys(selectedItems).length > 0 &&
                              Object.values(selectedItems).includes(true)
                              ? tenantAccess != "edit"
                                ? true
                                : false
                              : true
                        }
                      >
                        <DeleteIcon
                          fill="white"
                          height="1.25vw"
                          width="1.25vw"
                        />
                      </Button>
                    }
                    title={handletitle()}
                    message={handlemessage()}
                    status={handlestatus()}
                    cancelLabel={actionType === "delete" ? "Cancel" : "Cancel"}
                    deleteLabel={actionType === "delete" ? "Delete" : "Delete"}
                    onCancel={() => console.log("Cancel button clicked")}
                    onDelete={handleDeleteButtonClick}
                  />
                  <Button
                    onPress={handleSaveButtonClick}
                    className={`outline-none bg-[#1C274C] rounded-md px-[0.5vw] py-[0.92vh]`}
                    isDisabled={tenantAccess != "edit"}
                  >
                    <SaveIcon />
                  </Button>
                </div>
              )}

              {["profile", "appearance"].includes(selectedMenuItem) && (
                <Button
                  onPress={handleSaveButtonClick}
                  className={`outline-none bg-[#1C274C] rounded-md px-[0.5vw] py-[0.92vh]`}
                  isDisabled={tenantAccess != "edit"}
                >
                  <SaveIcon />
                </Button>
              )}
            </div>
            {(selectedMenuItem === "profile" ||
              selectedMenuItem === "user" ||
              selectedMenuItem === "appearance" ||
              selectedMenuItem === "st" ||
              selectedMenuItem === "org") && (
                <DropDown
                  triggerButton={
                    <div className="flex w-[20.83vw] items-center border-radius gap-[1.46vw] rounded-md">
                      {selectedTenantObj &&
                        Object.keys(selectedTenantObj).length ? (
                        <Button className="outline-none">
                          <Avatar
                            name={
                              selectedTenantObj?.name ?? selectedTenantObj?.code
                            }
                            size={"1.8vw"}
                            imageUrl={
                              TenantList.find((t: any) => t.code === tenant)?.logo
                            }
                          />
                        </Button>
                      ) : (
                        <div className="flex w-full justify-between">
                          <div className="flex gap-[0.58vw] items-center outline-none text-nowrap">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push("/control-center");
                                // setSelectedMenuItem("tenant");
                              }}
                            >
                              <CreateTenantPlusIcon fill={torusTheme["text"]} />
                            </span>
                            {locale["Create a new Tenant"]}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col ">
                        <span
                          style={{ fontSize: `${fontSize * 0.72}vw` }}
                          className="font-medium leading-[1.04vh]"
                        >
                          {selectedTenantObj?.name}
                        </span>
                      </div>
                    </div>
                  }
                  selectedKeys={TenantList.find((item) => item.code === tenant)}
                  setSelectedKeys={handletenantchange}
                  items={TenantList}
                  classNames={{
                    triggerButton: `w-[20.83vw]    font-medium leading-[1.7vh] py-[0.5vh]`,
                    popover: `w-[15.83vw] rounded-md h-[17%] overflow-y-auto `,
                    listbox: ``,
                    listboxItem: " text-center",
                  }}
                  styles={{
                    triggerButton: {
                      color: torusTheme["text"],
                      backgroundColor: torusTheme["bgCard"],
                      fontSize: `${fontSize * 0.83}vw`,
                    },
                    popover: {
                      color: torusTheme["text"],
                      backgroundColor: torusTheme["bgCard"],
                      fontSize: `${fontSize * 0.83}vw`,
                    },
                    listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                    listbox: { borderColor: torusTheme["border"] },
                  }}
                  renderOption={renderOption}
                  displaySelectedKeys={true}
                  arrowFill={torusTheme["text"]}
                />
              )}
          </div>
          <hr
            style={{ borderColor: torusTheme["borderLine"] }}
            className=" w-full"
          ></hr>
          <div
            style={{ backgroundColor: torusTheme["bg"] }}
            className="flex h-[92.8vh]"
          >
            <div
              style={{ borderRight: `1px solid ${torusTheme["borderLine"]}` }}
              className="flex flex-col h-[92.8vh] w-[10.57vw] p-[0.83vw] gap-[3vh]"
            >
              {menuItems.map((section, index) => (
                <ul className="flex flex-col gap-[2vh]" key={index}>
                  {section.items.map((item) => (
                    <li
                      key={item.code}
                      style={{
                        color:
                          selectedMenuItem === item.code
                            ? accentColor
                            : torusTheme["text"],
                      }}
                      className={`cursor-pointer`}
                      onClick={() => handleMenuClick(item.code as SettingTabs)}
                    >
                      <div
                        style={{ fontSize: `${fontSize * 0.72}vw` }}
                        className="flex items-center  leading-[1.04vw]"
                      >
                        <div className="mr-[0.58vw]">{item.svg}</div>
                        <span className="text-nowrap">{locale[item.name]}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <div className="flex w-full h-full px-[1.20vw] py-[1.25vh] relative" style={{ overflow: selectedMenuItem == "org" ? "auto" : "" }}>
              {selectedMenuItem === "user" && (
                <UserManage
                  setUserProfileData={setUserProfileData}
                  userProfileData={userProfileData}
                  tenantAccess={tenantAccess}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              )}
              {selectedMenuItem === "profile" ? (
                <Tenantselection
                  tenantProfileData={tenantProfileData}
                  setTenantProfileData={setTenantProfileData}
                  tenantAccess={tenantAccess}
                />
              ) : (
                <></>
              )}
              {selectedMenuItem === "appearance" && (
                <Appearance
                  tenantProfileData={tenantProfileData}
                  setTenantProfileData={setTenantProfileData}
                  tenantAccess={tenantAccess}
                />
              )}
              {selectedMenuItem === "org" && (
                <div className="w-full">
                  <OrgMatrix
                    data={orgGrpData}
                    setData={setOrgGrpData}
                    focusedPath={focusedPath}
                    setFocusedPath={setFocusedPath}
                  />
                </div>
                // <DynamicGroupMemberAccordion
                //   data={orgGrpData}
                //   assetType="org"
                //   headerFields={["code", "name"]}
                //   groupFields={["orgGrpCode", "orgGrpName"]}
                //   memberFields={["orgCode", "orgName"]}
                //   onUpdate={handleUpdate}
                //   tenantAccess={tenantAccess}
                //   selectedItems={selectedItems}
                //   setSelectedItems={setSelectedItems}
                // />
              )}
              {selectedMenuItem === "st" && (
                <SecurityTemplate
                  securityData={securityData}
                  onUpdateSecurityData={onUpdateSecurityData}
                  tenantAccess={tenantAccess}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SetupScreen;