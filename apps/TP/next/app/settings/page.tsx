"use server";
import React from "react";
import SetupScreen from "../components/settings/setup";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AxiosService } from "../../lib/utils/axiosService";
import { signOut } from "../../auth";

const getAccessProfile = async (token: string, accessProfiles: any[]) => {
  try {
    const res = await AxiosService.get("/api/myAccount-for-client", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200) {
      const userData = res.data;
      if (userData.accessProfile && Array.isArray(userData.accessProfile)) {
        if (userData.accessProfile.includes("admin")) {
          return "edit";
        } else {
          const tenantProfileEdit = [];
          const tenantProfileView = [];
          for (const role of userData.accessProfile) {
            const roleObj = accessProfiles.find((obj) => obj.role == role);
            const tenantProfileAccessObj = roleObj.roleActions.find(
              (obj: any) => obj.code == "ts"
            );
            tenantProfileEdit.push(tenantProfileAccessObj.permissions.edit);
            tenantProfileView.push(tenantProfileAccessObj.permissions.view);
          }
          if (tenantProfileEdit.includes(true)) {
            return "edit";
          } else if (tenantProfileView.includes(true)) {
            return "view";
          } else {
            return null;
          }
        }
      } else {
        return "view";
      }
    } else {
      return "view";
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchUserRoles = async (client: string, token: string) => {
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
        return await getAccessProfile(token, res.data);
      } else if (token) {
        return await getAccessProfile(token, []);
      } else {
        return "view";
      }
    } else if (token) {
      return await getAccessProfile(token, []);
    } else {
      return "view";
    }
  } catch (error) {
    console.log(error);
  }
};

const page = async () => {
  const token = cookies().get("tp_tk")?.value;
  const client = cookies().get("tp_cc")?.value;
  if (!token) {
    signOut({ redirect: false });
    redirect("/login");
  }

  if (!client) {
  } else {
    const tenantAccess = await fetchUserRoles(client, token);
    if (!tenantAccess) {
      redirect("/control-center");
    }
    return (
      <div className="flex w-full h-screen rounded-md">
        <SetupScreen tenantAccess={tenantAccess} />
      </div>
    );
  }
};

export default page;
