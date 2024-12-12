import React, { useEffect, useState } from "react";
import {
  CallChatSvg,
  DataFabric,
  HomeSvg,
  ProcessFabric,
  QuestionSvg,
  ShopSvg,
  UserFabric,
  AssemblerScreenIcon,
  LogoutSvg,
  BellIcon,
  ConnectSupportIcon,
  TickIcon,
  ContolCenterIcon,
  AIFabric,
} from "../../constants/svgApplications";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import TorusAvatar from "../Avatar";
import { usePathname, useRouter } from "next/navigation";
import {
  deleteAllCookies,
  getCookie,
  getEncodedDetails,
} from "../../../lib/utils/cookiemgmt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import Avatar from "../torusComponents/avatarComponent";
import { setTenant } from "../../../lib/Store/Reducers/MainSlice";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";
import { AxiosService } from "../../../lib/utils/axiosService";
import { signOut } from "next-auth/react";
interface BuilderSideNavProps {
  isTorus?: boolean;
  isRole?: any;
}

const BuilderSideNav: React.FC<BuilderSideNavProps> = ({ isTorus = false, isRole }) => {
  const [fillIndex, setFillIndex] = useState<number | any>();
  const tenantInRedux = useSelector((state: RootState) => state.main.tenant);
  const [tenantList, setTenantList] = useState<any[]>([]);
  const [wordLength, setWordLength] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const UserName = getCookie("tp_lid");
  const UserEmail = getCookie("tp_em");
  const client = getCookie("tp_cc");
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const url = process.env.NEXT_PUBLIC_MODELLER_URL;
  const userObj = getCookie("tp_user") ? JSON.parse(getCookie("tp_user")) : {};

  const actionIcons = [
    { Icon: HomeSvg, route: "/torus" },
    {
      Icon: DataFabric,
      fab: "DF-ERD",
      roleKey: "DF",
    },
    { Icon: UserFabric, fab: "UF-UFD", roleKey: "UF", },
    { Icon: ProcessFabric, fab: "PF-PFD", roleKey: "PF", },
    { Icon: AIFabric, fab: "AIF-AIFD", roleKey: "AI", },
    { Icon: AssemblerScreenIcon, route: "/" },
    { Icon: ShopSvg },
    { Icon: QuestionSvg },
    { Icon: CallChatSvg },
  ];

  const handleFabricChange = (fab: string) => {
    console.log(fab)
    const enCodedDetails = getEncodedDetails(
      fab,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      tenantInRedux
    );
    window.location.href = `${url}?tk=${enCodedDetails}`;
  };

  const isFabricDisabled = (fabricKey: string) => {
    if (isRole && isRole?.[fabricKey]) {
      const fabric = isRole?.[fabricKey];
      return !fabric || (!fabric.map && !fabric.orch);
    } else {
      return false
    }
  };

  const handleRoutes = (
    index: number,
    route: string | undefined,
    fab: string | undefined,

  ) => {
    if (route) {
      router.push(route);
    }
    if (fab) {
      handleFabricChange(fab);
    }
    setFillIndex(index);
  };

  useEffect(() => {
    switch (pathName) {
      case "/":
        setFillIndex(5);
        break;
      case "/torus":
        setFillIndex(0);
        break;
      default:
        break;
    }
  }, [pathName]);

  const handleLogout = (close: any) => {
    deleteAllCookies();
    signOut({ redirect: false });
    router.push("/login");
  };

  const fetchTenants = async () => {
    try {
      const res = await AxiosService.get(`/api/getClient?clientCode=${client}`);
      if (res.status === 200) {
        setTenantList(res.data);
        if (!tenantInRedux) {
          if (res.data.length > 0) {
            dispatch(setTenant(res.data[0].code));
          }
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Registering Client";
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

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleTenantChange = (tenantCode: string, close: () => void) => {
    dispatch(setTenant(tenantCode));
    close();
  };


  return (
    <aside
      aria-label="Sidebar"
      style={{
        backgroundColor: torusTheme["bg"],
        color: torusTheme["text"],
        borderColor: torusTheme["border"],
      }}
      className={`w-[3.59vw] h-[89.07vh] mt-[2vh] flex ml-[0.87vw] flex-col items-center justify-between rounded-md border`}
    >
      <section className="flex flex-col items-center justify-center w-full">
        <section
          aria-label="Actions"
          className="flex flex-col w-full items-center justify-center mt-[0.29vw] gap-[0.5vh]"
        >
          <DialogTrigger>
            <Button className={`outline-none mt-[0.8vh] mb-[0.5vh]`}>
              <Avatar
                name={
                  tenantInRedux
                    ? tenantList.find((t: any) => t.code === tenantInRedux)
                      ?.name
                    : ""
                }
                size={`${fontSize * 2}vw`}
                imageUrl={
                  tenantList.find((t: any) => t.code === tenantInRedux)?.logo
                }
              />
            </Button>
            <Popover placement="bottom start">
              <Dialog className="flex bg-transparent focus:outline-none">
                {({ close }) => (
                  <div
                    style={{
                      backgroundColor: torusTheme["bgCard"],
                      borderColor: torusTheme["border"],
                    }}
                    className="w-[15vw] mb-7 rounded-md border"
                  >
                    {tenantList.length ? (
                      tenantList.map((tenant: any) => (
                        <Button
                          className="flex w-full items-center justify-between gap-[0.29vw] p-[0.58vw] cursor-pointer outline-none"
                          key={tenant.code}
                          onPress={() => handleTenantChange(tenant.code, close)}
                          onHoverStart={(e) =>
                          (e.target.style.backgroundColor =
                            torusTheme["border"])
                          }
                          onHoverEnd={(e) =>
                            (e.target.style.backgroundColor = "")
                          }
                        >
                          <div className="flex gap-[0.29vw] items-center">
                            <Avatar
                              name={tenant.name ?? tenant.code}
                              imageUrl={tenant.logo}
                              size={`${fontSize * 2}vw`}
                            />
                            <div>
                              <p
                                style={{
                                  color: torusTheme["text"],
                                  fontSize: `${fontSize * 0.73}vw`,
                                }}
                                className="font-bold"
                              >
                                {tenant.name}
                              </p>
                              <p
                                style={{
                                  color: torusTheme["textOpacity/50"],
                                  fontSize: `${fontSize * 0.52}vw`,
                                }}
                                className="text-left"
                              >
                                {tenant.code}
                              </p>
                            </div>
                          </div>
                          <span
                            style={{
                              backgroundColor: accentColor,
                              width: `${fontSize * 0.52}vw`,
                              height: `${fontSize * 0.52}vw`,
                            }}
                            className={`rounded-full ${tenantInRedux == tenant.code ? "" : "opacity-0"}`}
                          ></span>
                        </Button>
                      ))
                    ) : (
                      <div className="p-[0.58vw] rounded flex flex-col justify-center">
                        {" "}
                        <p style={{ color: torusTheme["text"] }}>
                          {locale["No tenants available"]}
                        </p>{" "}
                        <Button
                          onPress={() => router.push("/control-center")}
                          style={{ backgroundColor: accentColor }}
                          className={`outline-none text-white rounded`}
                        >
                          {locale["Create Tenant"]}
                        </Button>{" "}
                      </div>
                    )}
                  </div>
                )}
              </Dialog>
            </Popover>
          </DialogTrigger>
          {(isTorus ? actionIcons.toSpliced(1, 4) : actionIcons).map(
            ({ Icon, route, fab, roleKey }, index) => {
              const isDisabled = isRole?.result === 'admin' ? false : roleKey ? isFabricDisabled(roleKey) : false;

              return (
                <Button
                  key={index}
                  style={{
                    borderLeftColor: `${accentColor}`,
                    borderBottomColor: index === 5 && !isTorus ? torusTheme["border"] : "",
                  }}
                  className={`p-[0.58vw] items-center justify-center focus:outline-none ${index === fillIndex ? "flex border-l-[0.15vw] w-full" : ""} ${!isTorus && index === 5 ? "border-b-2" : ""}`}
                  onPress={() => !isDisabled && handleRoutes(index, route, fab)}
                  isDisabled={isDisabled}
                >
                  <Icon
                    width="1.25vw"
                    height="1.25vw"
                    key={index}
                    fill={index === fillIndex ? accentColor : torusTheme["text"]}
                    opacity={index === fillIndex ? "" : torusTheme["opacity"]}
                  />
                </Button>
              );
            }
          )}




        </section>
      </section>
      <div className="flex flex-col gap-[1vh] items-center justify-center mb-[1.5vh]">
        <Button className="outline-none">
          <BellIcon opacity={torusTheme["opacity"]} fill={torusTheme["text"]} />
        </Button>
        <Button
          className="outline-none mb-[0.29vw]"
          onPress={() => router.push("/control-center")}
        >
          <ContolCenterIcon
            opacity={torusTheme["opacity"]}
            fill={torusTheme["text"]}
          />
        </Button>
        <DialogTrigger>
          <Button className={`outline-none mr-[0.29vw] mb-[0.29vw]`}>
            <Avatar imageUrl={userObj?.profile ?? ""} name={UserName.charAt(0)} size={`${fontSize * 2}vw`} isRounded />
          </Button>
          <Popover placement="right" className="ml-3">
            <Dialog className="flex bg-transparent focus:outline-none">
              {({ close }) => (
                <div
                  style={{
                    backgroundColor: torusTheme["bgCard"],
                    color: torusTheme["text"],
                    borderColor: torusTheme["border"],
                  }}
                  className={`mb-[2.04vw] rounded-md border w-[12.5vw] h-[22.7vh]`}
                >
                  <div className="flex flex-col h-[7.4vh] mb-[0.5vh]">
                    <div className="flex items-center p-[0.29vw] gap-[0.58vw]">
                      <div>
                        <Avatar imageUrl={userObj?.profile ?? ""} name={UserName.charAt(0)} size={`${fontSize * 2}vw`} isRounded />
                      </div>
                      <div
                        style={{ fontSize: `${fontSize * 0.72}vw` }}
                        className="flex flex-col leading-[1.85vh] gap-[0.29vw]"
                      >
                        <p className="font-medium">
                          {UserName.charAt(0).toUpperCase() + UserName.slice(1)}
                        </p>
                        <p style={{ color: torusTheme["textOpacity/50"] }}>
                          {UserEmail}
                        </p>
                      </div>
                    </div>
                    <p
                      style={{ fontSize: `${fontSize * 0.5}vw`, lineHeight: 0 }}
                      onClick={() => router.push("/control-center?tab=acc")}
                      className="flex cursor-pointer justify-center"
                    >
                      {locale["VIEW PROFILE"]}
                    </p>
                  </div>
                  <hr
                    style={{ borderColor: torusTheme["borderLine"] }}
                    className="w-full my-[0.43vw]"
                  />
                  <div className="ml-[0.43vw]">
                    <p
                      style={{
                        backgroundColor: torusTheme["bgCard"],
                        fontSize: `${fontSize * 0.72}vw`,
                      }}
                      className={`flex w-[11.8vw] items-center gap-[0.58vw] pl-[0.73vw] py-[0.23vw] rounded-md leading-[1.85vh]`}
                    >
                      <TickIcon />
                      {locale["Change Your Status"]}
                    </p>
                  </div>
                  <hr
                    style={{ borderColor: torusTheme["borderLine"] }}
                    className="w-full my-[0.58vw]"
                  />
                  <div className="flex flex-col gap-[0.87vw]">
                    <p
                      style={{ fontSize: `${fontSize * 0.72}vw` }}
                      className="flex items-center pl-[1.17vw] gap-[0.58vw] leading-[1.85vh]"
                    >
                      <ConnectSupportIcon
                        clipPathFill={torusTheme["clipPathText"]}
                        fill={torusTheme["text"]}
                      />
                      {locale["Connect Support"]}
                    </p>
                    <Button
                      style={{ fontSize: `${fontSize * 0.72}vw` }}
                      className={`flex pl-[1.17vw] items-center gap-[0.58vw] leading-[1.85vh] outline-none`}
                      onPress={() => handleLogout(close)}
                    >
                      <LogoutSvg fill={torusTheme["text"]} />
                      {locale["Log out"]}
                    </Button>
                  </div>
                </div>
              )}
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
    </aside>
  );
};

export default BuilderSideNav;
