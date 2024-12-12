import React from "react";
import Login from "../../components/auth/Sign";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "../../../auth";

const page = () => {
  if (cookies().get("tp_tk")?.value) {
    redirect("/torus");
  }else{
    signOut({redirect: false});
  }
  return (
    <div>
      <Login />
    </div>
  );
};

export default page;
