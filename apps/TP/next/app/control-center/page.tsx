import React from "react";
import ContolCenter from "./contolCenter";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "../../auth";

const page = () => {
  if (!cookies().get("tp_tk")?.value) {
    signOut({ redirect: false });
    redirect("/login");
  }
  return <ContolCenter />;
};

export default page;
