"use client";
import React, { useEffect, useState } from "react";
import Fabrics from "../components/landingScreen/Fabrics";
import Topbar from "../components/landingScreen/TopNavBar";
import DateandTime from "../components/landingScreen/DayandDate";
import Card from "../components/landingScreen/card";
import Tabcard from "../components/landingScreen/Tabcard";
import ProgressButton from "../components/progressbar";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";
import BuilderSideNav from "../components/builderScreen/BuilderSideNav";
import { getCookie, setCookieIfNotExist } from "../../lib/utils/cookiemgmt";
import { AxiosService } from "../../lib/utils/axiosService";

const Torus = () => {
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isRole, setIsRole] = useState< Record<string, any> |Record<"result" , string> | null>(null)
  const token = getCookie("tp_tk");


  const getUserInfo = async () => {
    if(getCookie('tp_user')) return
    try {
      const res = await AxiosService.get("/api/myAccount-for-client", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        const userData = res.data;
        const {
          firstName,
          lastName,
          loginId,
          email,
          accessProfile,
          client,
          profile,
        } = userData;
        setCookieIfNotExist("tp_lid", loginId);
        setCookieIfNotExist("tp_em", email);
        setCookieIfNotExist("tp_cc", client);
        setCookieIfNotExist(
          "tp_user",
          JSON.stringify({
            firstName,
            lastName,
            loginId,
            email,
            accessProfile,
            profile,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
 const getAccessRoles = async () => {
    try {
      const res = await AxiosService.get("/api/getroles", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status == 200) {
        setIsRole(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (token) {
        getUserInfo();
        setLoading(false);
      }
      getAccessRoles();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ProgressButton isIndeterminate size={"xl"} />{" "}
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: torusTheme["bgCard"] }}
      className={`flex flex-col w-full h-screen`}
    >
      <Topbar setSearchTerm={setSearchTerm} />
      <div className="flex h-[89.07vh]">
        <BuilderSideNav  isTorus />
        <div className="flex flex-col h-[91.07vh]">
          <DateandTime />
          <div className="flex justify-between w-full pt-[1.46vw] gap-[1.46vw] h-[84.37vh]">
            <div className="flex flex-col gap-[1.46vw] pl-[1.46vw] w-[37.18vw]">
              <Fabrics isRole={isRole} />
              <Card searchTerm={searchTerm} />
            </div>
            <div className="flex flex-col w-[53.64vw] h-full">
              <Tabcard searchTerm={searchTerm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Torus;
