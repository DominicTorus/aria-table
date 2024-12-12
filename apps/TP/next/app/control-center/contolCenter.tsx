"use client";
import React, { useEffect, useState } from "react";
import {
  AppAppearanceIcon,
  ArrowHome,
  ContolCenterIcon,
  CreateTenantPlusIcon,
  DeleteIcon,
  HomeSvg,
  Management,
  Notification,
  Org,
  PlusIcon,
  ProfileIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  UserRoleIcon,
} from "../constants/svgApplications";
import DropDown from "../components/multiDropdownnew";
import ClientProfileInfo from "./clientProfileInfo";
import TenantCreationTable from "./tenantCreation";
import AccountDetails from "./accountDetails";
import TorusAppearance from "./torusAppearance";
import { Button, Input, ListBoxItem } from "react-aria-components";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosService } from "../../lib/utils/axiosService";
import {
  getCookie,
  setCookie,
  setCookieIfNotExist,
} from "../../lib/utils/cookiemgmt";
import { toast } from "react-toastify";
import TorusToast from "../components/torusComponents/torusToast";
import ClientUserManagement from "./clientUserMgmt";
import Avatar from "../components/torusComponents/avatarComponent";
import { RootState } from "../../lib/Store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  FontSize,
  setAccentColor,
  setFontSize,
  setLocale,
  setTenant,
  setTestTheme,
  Theme,
} from "../../lib/Store/Reducers/MainSlice";
import { IoIosCheckmark } from "react-icons/io";
import UserRole from "./userRole";
import DynamicModal from "../components/torusComponents/torusdelete";
import Notifications from "./notification";
import {
  getLanguage,
  getTheme,
  handleDelete,
  handleDeleteGroupAndMembers,
  hexWithOpacity,
} from "../../lib/utils/utility";

const ContolCenter = () => {
  const client = getCookie("tp_cc");
  const token = getCookie("tp_tk");
  const [userAccountDetails, setUserAccountDetails] = useState<any>({});
  const [clientProfileDetails, setClientProfileDetails] = useState<any>({
    coverimg: "",
    tagline: "",
    industryType: "",
    orgType: "",
    orgSize: "",
  });
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTeam] = useState(client.includes("CT") ? true : false);
  const router = useRouter();
  const [wordLength, setWordLength] = useState(0);
  const [selectedTenantObj, setSelectedTenantObj] = useState<any>({});
  const [appEnvData, setAppEnvData] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<
    "Tenants" | "Applications"
  >("Tenants");
  const [userProfileData, setUserProfileData] = useState([]);
  const [TenantList, setTenantList] = useState<any[]>([]);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    isTeam ? "profile" : "acc"
  );
  const searchParams = useSearchParams();
  const param = searchParams.get("tab");
  const [open, Setopen] = useState(true);
  const [roles, setRoles] = useState<any>([]);
  const [access, setAccess] = useState<"view" | "edit" | null>("view");
  const [tenantAccess, setTenantAccess] = useState<"view" | "edit" | null>(
    null
  );
  const [localTheme, setLocalTheme] = useState(
    getCookie("cfg_tm") ? getCookie("cfg_tm") : "daylight"
  );
  const [localAccentColor, setLocalAccentColor] = useState(
    getCookie("cfg_clr") ? getCookie("cfg_clr") : "#0736C4"
  );
  const [localLanguage, setLocalLanguage] = useState<
    Record<string, string> | undefined
  >(
    getCookie("cfg_lc")
      ? getLanguage(getCookie("cfg_lc"))
      : getLanguage("en-GB")
  );
  const [localLanguageCode, setLocalLanguageCode] = useState(
    getCookie("cfg_lc") ? getCookie("cfg_lc") : "en-GB"
  );
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [localThemeObj, setLocalThemeObj] = useState<
    undefined | Record<string, string>
  >(getCookie("cfg_tm") ? getTheme(getCookie("cfg_tm")) : getTheme("daylight"));

  const fontSizes = [
    { code: 0.9, name: "Small" },
    { code: 1, name: "Medium" },
    { code: 1.1, name: "Large" },
  ];

  const [selectedFontSize, setSelectedFontSize] = useState<any>(
    getCookie("cfg_fs")
      ? fontSizes.find((size) => size.code == parseFloat(getCookie("cfg_fs")))
      : fontSizes[1]
  );

  const getTenantEnv = async (client: string) => {
    try {
      const res = await AxiosService.get(`/api/getTenantEnv?code=${client}`);
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Fetching Tenant Application info";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Fetching Tenant",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const getAppEnvInfo = async (tenantParam: string) => {
    try {
      const res = await AxiosService.get(
        `/api/get-app-env?tenant=${tenantParam}`
      );
      if (res.status == 200) {
        setAppEnvData(res.data);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Fetching Application Environment info";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Fetching Application",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleSaveApp = async (isDeletion: boolean = false, data?: any) => {
    try {
      const res = await AxiosService.post(`/api/post-app-env`, {
        tenant: tenant,
        data: data ? data : appEnvData,
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
            text: `Application Data ${isDeletion ? "Deleted" : "Saved"} Successfully`,
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
            text: `Error Occured While ${isDeletion ? "Deleting" : "Saving"} Application Environment info`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Fetching Application Environment info";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Fetching Application",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const getTorusUserDetailsBasedOnClient = async (clientParam?: string) => {
    try {
      const res = await AxiosService.get(
        `/api/getUserList?client=${clientParam}&type=c`
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
          accessExpires: item?.accessExpires,
          lastActive: item?.lastActive ?? "September27 2024 00:00:00",
          dateAdded: item?.dateAdded ?? "September 27 2024",
          status: item?.status ?? "",
        }));
        setUserProfileData(result);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Fetching UserList";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Fetching UserList",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const getAccessProfile = async (token: string, accessProfiles: any[]) => {
    try {
      const res = await AxiosService.get("/api/myAccount-for-client", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        const userData = res.data;
        const { firstName, lastName, loginId, email, accessProfile, client, profile } =
          userData;
        setCookieIfNotExist("tp_lid", loginId);
        setCookieIfNotExist("tp_em", email);
        setCookieIfNotExist("tp_cc", client);
        setCookie(
          "tp_user",
          JSON.stringify({ firstName, lastName, loginId, email, accessProfile, profile })
        );
        if (userData.accessProfile && Array.isArray(userData.accessProfile)) {
          if (userData.accessProfile.includes("admin")) {
            setAccess("edit");
            setTenantAccess("edit");
          } else {
            const edit = [];
            const view = [];
            const tenantProfileEdit = [];
            const tenantProfileView = [];
            for (const role of userData.accessProfile) {
              const roleObj = accessProfiles.find((obj) => obj.role == role);
              const controlCenterAccessObj = roleObj.roleActions.find(
                (obj: any) => obj.code == "cc"
              );
              const tenantProfileAccessObj = roleObj.roleActions.find(
                (obj: any) => obj.code == "ts"
              );
              edit.push(controlCenterAccessObj.permissions.edit);
              view.push(controlCenterAccessObj.permissions.view);
              tenantProfileEdit.push(tenantProfileAccessObj.permissions.edit);
              tenantProfileView.push(tenantProfileAccessObj.permissions.view);
            }
            if (edit.includes(true)) {
              setAccess("edit");
            } else if (view.includes(true)) {
              setAccess("view");
            } else {
              setAccess(null);
              setSelectedMenuItem("acc");
            }
            if (tenantProfileEdit.includes(true)) {
              setTenantAccess("edit");
            } else if (tenantProfileView.includes(true)) {
              setTenantAccess("view");
            } else {
              setTenantAccess(null);
            }
          }
        }
      } else {
        setAccess("view");
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving User Details";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Occured in userdetails",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (param && typeof param == "string") {
        setSelectedMenuItem(param);
      }
      setIsLoading(false);
    }
    if (client) {
      getTenantEnv(client);
      getTorusUserDetailsBasedOnClient(client);
      fetchTenants(client);
      fetchUserRoles();
    }
    if (tenant) getAppEnvInfo(tenant);
  }, []);

  const postTenantEnv = async (
    isDeletion: boolean = false,
    tenantEnvData?: any
  ) => {
    try {
      const res = await AxiosService.post(`/api/postTenantEnv`, {
        client,
        data: tenantEnvData ? tenantEnvData : data,
      });
      if (res.status === 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Tenant ${isDeletion ? "Deleted" : "Saved"} successfully`,
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
            title: "Error Occured",
            text: `Error Occured While ${isDeletion ? "Deleting" : "Saving"} Tenant Environment info`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving Tenant Environment info";
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

  const postCompanyProfile = async () => {
    try {
      const res = await AxiosService.post(`/api/post-client-profile`, {
        clientCode: client,
        data: {
          ...clientProfileDetails,
        },
      });
      if (res.status === 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Client Profile Saved Successfully`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving Company Profile Info";
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

  const updateMyAccount = async () => {
    try {
      const res = await AxiosService.post(`/api/updateMyAccount`, {
        clientCode: client,
        data: {
          ...userAccountDetails,
        },
      });
      if (res.status === 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Account Profile Saved Successfully`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving User Accout Info";
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

  const handleUserDataSave = async (
    isDeletion: boolean = false,
    data?: any
  ) => {
    try {
      const res = await AxiosService.post(`/api/postUserList`, {
        tenant: client,
        data: data ? data : userProfileData,
        type: "c",
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
            text: `Error Occured While ${isDeletion ? "Deleting" : "Saving"} User List Info`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving User List Info";
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

  const menuItems = [
    {
      category: "Personal",
      items: [
        {
          name: "Company Profile",
          svg: (
            <Org
              fill={
                selectedMenuItem === "profile"
                  ? localAccentColor
                  : localThemeObj
                    ? localThemeObj["textOpacity/50"]
                    : torusTheme["textOpacity/50"]
              }
            />
          ),
          code: "profile",
        },

        {
          name: "My Account",
          svg: (
            <ProfileIcon
              fill={
                selectedMenuItem === "acc"
                  ? localAccentColor
                  : localThemeObj
                    ? localThemeObj["textOpacity/50"]
                    : torusTheme["textOpacity/50"]
              }
            />
          ),
          code: "acc",
        },
        {
          name: "Appearance",
          svg: (
            <AppAppearanceIcon
              fill={
                selectedMenuItem === "appearance"
                  ? localAccentColor
                  : localThemeObj
                    ? localThemeObj["textOpacity/50"]
                    : torusTheme["textOpacity/50"]
              }
            />
          ),
          code: "appearance",
        },
      ],
    },
    {
      category: "Configuration",
      items: [
        {
          name: "Tenant",
          svg: (
            <Org
              fill={
                selectedMenuItem === "tenant"
                  ? localAccentColor
                  : localThemeObj
                    ? localThemeObj["textOpacity/50"]
                    : torusTheme["textOpacity/50"]
              }
            />
          ),
          code: "tenant",
        },
        {
          name: "User Roles",
          svg: (
            <UserRoleIcon
              fill={
                selectedMenuItem === "role"
                  ? localAccentColor
                  : localThemeObj
                    ? localThemeObj["textOpacity/50"]
                    : torusTheme["textOpacity/50"]
              }
            />
          ),
          code: "role",
        },
        {
          name: "User Management",
          svg: (
            <Management
              fill={
                selectedMenuItem === "user"
                  ? localAccentColor
                  : localThemeObj
                    ? localThemeObj["textOpacity/50"]
                    : torusTheme["textOpacity/50"]
              }
            />
          ),
          code: "user",
        },
      ],
    },
    {
      category: "General",
      items: [
        {
          name: "Notification",
          svg: (
            <Notification
              fill={
                selectedMenuItem === "notify"
                  ? localAccentColor
                  : localThemeObj
                    ? localThemeObj["textOpacity/50"]
                    : torusTheme["textOpacity/50"]
              }
            />
          ),
          code: "notify",
        },
        // {
        //       name: "Billings",
        //       svg: (
        //         <Billing
        //           fill={`${selectedMenuItem === "billing" ? "#0736C4" : "black"}`}
        //         />
        //       ),
        //       code: "billing",
        // },
      ],
    },
  ];

  const handleMenuClick = (itemCode: string) => {
    setSelectedMenuItem(itemCode);
    setSelectedItems({});
    setSelectedRows(new Set());
    setLocalThemeObj(undefined);
    setLocalTheme(getCookie("cfg_tm") ? getCookie("cfg_tm") : "daylight");
    setLocalLanguage(locale);
    setLocalLanguageCode(getCookie("cfg_lc") ? getCookie("cfg_lc") : "en-GB");
    setLocalAccentColor(accentColor);
    setSelectedFontSize(undefined);
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
        if (token && Array.isArray(res.data) && res.data.length) {
          setRoles(res.data);
          getAccessProfile(token, res.data);
        } else if (token) {
          getAccessProfile(token, []);
        }
      } else if (token) {
        getAccessProfile(token, []);
        setRoles([]);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While fetching User Roles";
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

  const handleUserRoleSave = async (
    isDeletion: boolean = false,
    roleData?: any
  ) => {
    try {
      const res = await AxiosService.post("/api/post-client-user-roles", {
        clientCode: client,
        roles: roleData ? roleData : roles,
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
            text: `User Roles Data ${isDeletion ? "Deleted" : "Saved"} Successfully`,
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
            title: "Error Occured",
            text: `Error Occured While ${isDeletion ? "Deleting" : "Saving"} User Roles Info`,
            closeButton: false,
          } as any
        );
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

  const handlePlusButtonClick = () => {
    switch (selectedMenuItem) {
      case "tenant":
        document.getElementById("tenant-creation-btn")?.click();
        break;
      case "user":
        document.getElementById("user-creation-btn")?.click();
        break;
      case "role":
        document.getElementById("client-user-role-addition")?.click();
        break;
      default:
        break;
    }
  };

  const handleDeleteButtonClick = () => {
    let deletionResponse;
    switch (selectedMenuItem) {
      case "tenant":
        if (selectedOption == "Tenants") {
          deletionResponse = handleDeleteGroupAndMembers(
            data,
            selectedItems,
            setSelectedItems,
            setData,
            postTenantEnv
          );
          // if (totalPages != 1) {
          //   setCurrentPage(totalPages - 1);
          // } else {
          //   setCurrentPage(1);
          // }
        } else {
          deletionResponse = handleDeleteGroupAndMembers(
            appEnvData,
            selectedItems,
            setSelectedItems,
            setAppEnvData,
            handleSaveApp
          );
        }
        break;
      case "user":
        if (selectedRows.has("all")) {
          const updatedSelectedRows = new Set(
            userProfileData
              .map((item: any) => {
                if (item.accessProfile.includes("admin")) {
                  return null;
                } else {
                  return item.users;
                }
              })
              .filter(Boolean)
          );
          handleDelete(
            userProfileData,
            updatedSelectedRows,
            setSelectedRows,
            setUserProfileData,
            handleUserDataSave,
            "users"
          );
        } else {
          handleDelete(
            userProfileData,
            selectedRows,
            setSelectedRows,
            setUserProfileData,
            handleUserDataSave,
            "users"
          );
        }
        break;
      case "role":
        deletionResponse = handleDeleteGroupAndMembers(
          roles,
          selectedItems,
          setSelectedItems,
          setRoles,
          handleUserRoleSave
        );
        break;
      default:
        break;
    }
    // Setopen(false);
  };

  const handleConfirmAppearnaceChange = () => {
    dispatch(setAccentColor(localAccentColor));
    dispatch(setLocale(localLanguageCode));
    dispatch(setTestTheme(localTheme as Theme));
    if (selectedFontSize) {
      dispatch(setFontSize(selectedFontSize.code as FontSize));
    }
    toast(
      <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
      {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        title: "Success",
        text: `App Appearance Saved Successfully`,
        closeButton: false,
      } as any
    );
  };

  const handleSaveButtonClick = async () => {
    switch (selectedMenuItem) {
      case "tenant":
        if (selectedOption == "Tenants") {
          await postTenantEnv();
        } else {
          await handleSaveApp();
        }
        break;
      case "profile":
        await postCompanyProfile();
        break;
      case "acc":
        await updateMyAccount();
        break;
      case "user":
        await handleUserDataSave();
        break;
      case "role":
        await handleUserRoleSave();
        break;
      case "appearance":
        handleConfirmAppearnaceChange();
        break;
      default:
        break;
    }
    setTimeout(() => {
      if (client) {
        getTenantEnv(client);
        getTorusUserDetailsBasedOnClient(client);
        fetchTenants(client);
        fetchUserRoles();
      }
      // if (tenant) getAppEnvInfo(tenant);
    }, 2000);
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
          dispatch(setTenant(res.data[0].code));
          getAppEnvInfo(res.data[0].code);
          setSelectedTenantObj(res.data[0]);
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Tenant not found";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Fetching Tenant",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handletenantchange = (val: any) => {
    dispatch(setTenant(val.code));
    setSelectedTenantObj(val);
    getAppEnvInfo(val.code);
  };

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
      className="p-[0.29vw] cursor-pointer focus:outline-none flex justify-between items-center"
      style={{
        fontSize: `${selectedFontSize ? selectedFontSize.code * 0.6 : fontSize * 0.6}vw`,
        color: localThemeObj ? localThemeObj["text"] : torusTheme["text"],
        backgroundColor: selected
          ? localThemeObj
            ? localThemeObj["borderLine"]
            : torusTheme["borderLine"]
          : "",
      }}
    >
      <div className="flex items-center gap-[0.87vw] border-radius">
        <Avatar
          imageUrl={item.logo}
          size={"2vw"}
          name={`${item.name ?? item.code}`}
        />
        <div className="flex flex-col ">
          <span>{item.name}</span>
          <span
            style={{
              fontSize: `${selectedFontSize ? selectedFontSize.code * 0.5 : fontSize * 0.5}vw}`,
            }}
          >
            {item.code}
          </span>
        </div>
      </div>
      {selected && (
        <IoIosCheckmark
          size={12}
          fill={localAccentColor ? localAccentColor : accentColor}
        />
      )}
    </ListBoxItem>
  );

  const handletitle = () => {
    if (selectedMenuItem === "tenant") {
      if (selectedOption == "Tenants") {
        return "Delete tenant";
      } else {
        return "Delete Applications";
      }
    } else if (selectedMenuItem === "role") {
      return "Delete userole";
    } else if (selectedMenuItem === "user") {
      return "Delete usermanage";
    } else {
      return "Delete data";
    }
  };

  const handlecancelButton = () => {
    Setopen(true);
  };

  const handlemessage = () => {
    if (selectedMenuItem === "tenant") {
      if (selectedOption == "Tenants") {
        return "Are you sure you want to delete this tenant informations?";
      } else {
        return "Are you sure you want to delete this Application info?";
      }
    } else if (selectedMenuItem === "role") {
      return "Are you sure you want to delete selected user roles?";
    } else if (selectedMenuItem === "user") {
      return "Are you sure you want to delete the selcted users?";
    } else {
      return "Are you sure you want to delete this data?";
    }
  };

  const handlestatus = () => {
    if (selectedMenuItem === "tenant") {
      if (selectedOption == "Tenants") {
        return "Deleting the tenant will remove all associated environment details";
      } else {
        return "Deleting the Application will remove all associated environment details";
      }
    } else if (selectedMenuItem === "role") {
      return "Deleting the user role will remove the roles of the users who are assigned with this role";
    } else if (selectedMenuItem === "user") {
      return "Deleting the user will permanently remove the user from the list";
    } else {
      return "Data deleted successfully";
    }
  };

  return (
    isLoading === false && (
      <div
        style={{
          backgroundColor: localThemeObj
            ? localThemeObj["bg"]
            : torusTheme["bg"],
        }}
      >
        <div
          style={{
            backgroundColor: localThemeObj
              ? localThemeObj["bg"]
              : torusTheme["bg"],
          }}
          className={`flex flex-col w-full h-screen rounded-md`}
        >
          <div
            className="flex w-full h-[6.66vh] border-b px-[0.58vw] justify-between items-center"
            style={{
              borderBottomColor: localThemeObj
                ? localThemeObj["borderLine"]
                : torusTheme["borderLine"],
            }}
          >
            <h1
              className="flex gap-[0.87vw] items-center font-semibold leading-[2.22vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.93 : fontSize * 0.93}vw`,
              }}
            >
              <ContolCenterIcon
                fill={
                  localThemeObj ? localThemeObj["text"] : torusTheme["text"]
                }
              />
              {localLanguage
                ? localLanguage["Control Center"]
                : locale["Control Center"]}
            </h1>
            <div className="flex items-center pl-[10vw] gap-[0.58vw]">
              <Button
                onPress={() => router.push("/torus")}
                className="flex items-center gap-[0.29vw] outline-none rounded-md text-[0.72vw] leading-[1.11vh] px-[0.5vw] py-[0.92vh] focus:outline-none"
                style={{
                  backgroundColor: hexWithOpacity(localAccentColor, 0.15),
                  color: localAccentColor,
                }}
              >
                Go To Home
                <ArrowHome
                  width="1.3vw"
                  height="1.3vw"
                  fill={localAccentColor}
                />
              </Button>
              <div className="relative items-center w-[23.75vw] h-[4vh]">
                <span className="absolute inset-y-0 left-0 flex p-[0.58vw] h-[2.18vw] w-[2.18vw]">
                  <SearchIcon
                    fill={
                      localThemeObj ? localThemeObj["text"] : torusTheme["text"]
                    }
                    height="0.83vw"
                    width="0.83vw"
                  />
                </span>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    localLanguage ? localLanguage["Search"] : locale["Search"]
                  }
                  className={`w-full p-[0.29vw] h-[4vh] focus:outline-none border pl-[1.76vw] font-medium rounded-md`}
                  style={{
                    backgroundColor: localThemeObj
                      ? localThemeObj["bgCard"]
                      : torusTheme["bgCard"],
                    color: localThemeObj
                      ? localThemeObj["text"]
                      : torusTheme["text"],
                    borderColor: localThemeObj
                      ? localThemeObj["border"]
                      : torusTheme["border"],
                    fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = localAccentColor)
                  }
                  onBlur={(e) =>
                  (e.target.style.borderColor = localThemeObj
                    ? localThemeObj["border"]
                    : torusTheme["border"])
                  }
                />
              </div>
              {selectedMenuItem === "profile" ||
                selectedMenuItem === "acc" ||
                selectedMenuItem === "appearance" ? null : (
                <div className="flex gap-[0.58vw] items-center">
                  <Button
                    onPress={handlePlusButtonClick}
                    style={{ backgroundColor: `${localAccentColor}` }}
                    isDisabled={
                      isTeam ? access == "view" || access == null : false
                    }
                    className={`outline-none rounded-md px-[0.5vw] py-[0.92vh] `}
                  >
                    <PlusIcon fill="white" />
                  </Button>
                  <DynamicModal
                    open={open}
                    isDisabled={
                      selectedMenuItem === "user"
                        ? Array.from(selectedRows).filter(Boolean).length > 0
                          ? false
                          : true
                        : Object.keys(selectedItems).length > 0 &&
                          Object.values(selectedItems).includes(true)
                          ? isTeam
                            ? access == "view" || access == null
                            : false
                          : true
                    }
                    triggerButton={
                      <Button
                        className={`outline-none ${(selectedMenuItem == "user" && Array.from(selectedRows).filter(Boolean).length > 0) || (Object.keys(selectedItems).length > 0 && Object.values(selectedItems).includes(true)) ? "bg-[#F14336]" : "bg-[#F14336]/50"} rounded-md px-[0.5vw] py-[0.92vh]`}
                        isDisabled={
                          selectedMenuItem === "user"
                            ? Array.from(selectedRows).filter(Boolean).length >
                              0
                              ? false
                              : true
                            : Object.keys(selectedItems).length > 0 &&
                              Object.values(selectedItems).includes(true)
                              ? isTeam
                                ? access == "view" || access == null
                                : false
                              : true
                        }
                        onPress={() => Setopen(true)}
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
                    cancelLabel="Cancel"
                    deleteLabel="Delete"
                    onCancel={handlecancelButton}
                    onDelete={handleDeleteButtonClick}
                    localTheme={localTheme}
                  />
                </div>
              )}
              <Button
                onPress={handleSaveButtonClick}
                isDisabled={
                  isTeam
                    ? (access == "view" || access == null) &&
                    selectedMenuItem != "acc" &&
                    selectedMenuItem != "appearance" &&
                    selectedMenuItem != "notify"
                    : false
                }
                className={`outline-none bg-[#1C274C] rounded-md px-[0.5vw] py-[0.92vh] `}
              >
                <SaveIcon />
              </Button>
            </div>
            <div
              className="flex gap-0 rounded items-center"
              style={{
                backgroundColor: localThemeObj
                  ? localThemeObj["bgCard"]
                  : torusTheme["bgCard"],
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.8 : fontSize * 0.8}vw`,
              }}
            >
              <DropDown
                triggerButton={
                  <div className="flex w-[18.83vw] items-center border-radius gap-[1.46vw] rounded-md">
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
                          localAccentcolor={localAccentColor}
                        />
                      </Button>
                    ) : (
                      <div className="flex w-full justify-between">
                        <div className="flex gap-[0.58vw] items-center outline-none text-nowrap">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMenuItem("tenant");
                            }}
                          >
                            <CreateTenantPlusIcon
                              fill={
                                localThemeObj
                                  ? localThemeObj["text"]
                                  : torusTheme["text"]
                              }
                            />
                          </span>
                          Create a new Tenant
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center w-full">
                      <span
                        className="font-medium leading-[1.04vh] "
                        style={{
                          color: localThemeObj
                            ? localThemeObj["text"]
                            : torusTheme["text"],
                          fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
                        }}
                      >
                        {selectedTenantObj?.name}
                      </span>
                      {/* {selectedTenantObj &&
                      Object.keys(selectedTenantObj).length &&
                      tenantAccess ? (
                      <span
                        className={"outline-none"}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/settings");
                        }}
                      >
                        <SettingsIcon
                          fill={
                            localThemeObj
                              ? localThemeObj["text"]
                              : torusTheme["text"]
                          }
                          opacity="1"
                          width="2vw"
                          height="2vw"
                        />
                      </span>
                    ) : (
                      <span className="h-[2vw]"></span>
                    )} */}
                    </div>
                  </div>
                }
                selectedKeys={TenantList.find((item) => item.code === tenant)}
                setSelectedKeys={handletenantchange}
                items={TenantList}
                classNames={{
                  triggerButton: `w-[18.83vw] text-black rounded-md font-medium leading-[1.7vh] px-[0.5vw] py-[0.5vh]`,
                  popover: `w-[15.83vw] `,
                  listbox: ``,
                }}
                renderOption={renderOption}
                displaySelectedKeys={true}
                arrowFill={localAccentColor ? localAccentColor : accentColor}
                styles={{
                  triggerButton: {
                    backgroundColor: localThemeObj
                      ? localThemeObj["bgCard"]
                      : torusTheme["bgCard"],
                    color: localThemeObj
                      ? localThemeObj["text"]
                      : torusTheme["text"],
                    fontSize: `${selectedFontSize ? selectedFontSize.code * 0.8 : fontSize * 0.8}vw`,
                  },
                  popover: {
                    backgroundColor: localThemeObj
                      ? localThemeObj["bg"]
                      : torusTheme["bg"],
                    color: localThemeObj
                      ? localThemeObj["text"]
                      : torusTheme["text"],
                  },
                  listbox: {
                    borderColor: localThemeObj
                      ? localThemeObj["borderLine"]
                      : torusTheme["borderLine"],
                  },
                  listboxItem: {
                    backgroundColor: localThemeObj
                      ? localThemeObj["borderLine"]
                      : torusTheme["borderLine"],
                  },
                }}
              />
              {selectedTenantObj &&
                Object.keys(selectedTenantObj).length &&
                tenantAccess ? (
                <span
                  className={"outline-none cursor-pointer"}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/settings");
                  }}
                >
                  <SettingsIcon
                    fill={
                      localThemeObj ? localThemeObj["text"] : torusTheme["text"]
                    }
                    opacity="1"
                    width="2vw"
                    height="2vw"
                  />
                </span>
              ) : (
                <span className="h-[2vw]"></span>
              )}
            </div>
          </div>
          <div className="flex w-full h-[93.61vh]">
            <div className="flex flex-col px-[0.58vw] py-[1.24vh] gap-[1.24vh] w-[10.57vw] h-full">
              {menuItems.map((section) =>
                access == null && section.category == "Configuration" ? null : (
                  <div key={section.category} className={``}>
                    <h2
                      className="font-semibold leading-[1.04vw] mb-[1.24vh]"
                      style={{
                        color: localThemeObj
                          ? localThemeObj["text"]
                          : torusTheme["text"],
                        fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
                      }}
                    >
                      {localLanguage
                        ? localLanguage[section.category]
                        : locale[section.category]}
                    </h2>
                    <ul className="flex flex-col gap-[2vh] mt-[0.4vh]">
                      {section.items.map((item) =>
                        isTeam === false &&
                          (item.code === "profile" ||
                            item.code === "user" ||
                            item.code === "role") ? null : access == null &&
                              item.code == "profile" ? null : (
                          <li
                            key={item.code}
                            className={`cursor-pointer`}
                            style={{
                              color:
                                selectedMenuItem === item.code
                                  ? `${localAccentColor}`
                                  : "unset",
                            }}
                            onClick={() => handleMenuClick(item.code)}
                          >
                            <div
                              className="flex items-center leading-[1.04vw]"
                              style={{
                                color: localThemeObj
                                  ? localThemeObj["text"]
                                  : torusTheme["text"],
                                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
                              }}
                            >
                              <div className="mr-[0.58vw] ">{item.svg}</div>
                              <span
                                className={`text-nowrap`}
                                style={{
                                  color:
                                    selectedMenuItem === item.code
                                      ? localAccentColor
                                      : localThemeObj
                                        ? localThemeObj["textOpacity/50"]
                                        : torusTheme["textOpacity/50"],
                                }}
                              >
                                {localLanguage
                                  ? localLanguage[item.name]
                                  : locale[item.name]}
                              </span>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )
              )}
            </div>
            <hr
              className="h-full border"
              style={{
                borderColor: localThemeObj
                  ? localThemeObj["borderLine"]
                  : torusTheme["borderLine"],
              }}
            />

            {selectedMenuItem === "profile" && isTeam && (
              <ClientProfileInfo
                clientProfileDetails={clientProfileDetails}
                setClientProfileDetails={setClientProfileDetails}
                access={access}

              />
            )}
            {selectedMenuItem === "acc" && (
              <AccountDetails
                userAccountDetails={userAccountDetails}
                isTeam={isTeam}
                setUserAccountDetails={setUserAccountDetails}
                localAccentColor={localAccentColor}
                localTheme={localTheme}
                localLanguage={localLanguage}
              />
            )}
            {selectedMenuItem === "appearance" && (
              <TorusAppearance
                localTheme={localTheme}
                setLocalTheme={setLocalTheme}
                localAccentColor={localAccentColor}
                setLocalAccentColor={setLocalAccentColor}
                localLanguage={localLanguage}
                setLocalLanguage={setLocalLanguage}
                localLanguageCode={localLanguageCode}
                setLocalLanguageCode={setLocalLanguageCode}
                localThemeObj={localThemeObj}
                setLocalThemeObj={setLocalThemeObj}
                selectedFontSize={selectedFontSize}
                setSelectedFontSize={setSelectedFontSize}
                fontSizes={fontSizes}
              />
            )}
            {selectedMenuItem === "tenant" && (
              <TenantCreationTable
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                data={data}
                onUpdate={setData}
                appEnvData={appEnvData}
                setAppEnvData={setAppEnvData}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                access={access}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            )}
            {selectedMenuItem === "role" && (
              <UserRole
                roles={roles}
                setRoles={setRoles}
                access={access}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                searchTerm={searchTerm}
              />
            )}
            {selectedMenuItem === "notify" && <Notifications />}
            {selectedMenuItem === "user" && isTeam && (
              <ClientUserManagement
                data={userProfileData}
                setData={setUserProfileData}
                searchTerm={searchTerm}
                access={access}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ContolCenter;
