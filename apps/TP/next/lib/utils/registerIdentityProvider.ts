"use server";
import { AxiosService } from "./axiosService";
import { cookies } from "next/headers";

export async function deleteServerCookies() {
  const cookieStore = cookies();
  for (const cookie of cookieStore.getAll()) {
    if(!cookie.name.includes('cfg')){
      cookieStore.delete(cookie.name);   
    }
  }
}


export async function registerIdentityProviderUser(user: any, account: any) {
  try {
    const res = await AxiosService.post("/api/auth-identityprovider", {
      user,
      account,
    });
    if (res.status == 201) {
      cookies().set("tp_tk", res.data?.token, );
      cookies().set("tp_cc", res.data?.client, );
      cookies().set("tp_em", res.data?.email, );
      cookies().set("tp_lid", res.data?.loginId, );
      return res.data;
    } else {
      throw new Error("error occured");
    }
  } catch (err) {
    return false;
  }
}
