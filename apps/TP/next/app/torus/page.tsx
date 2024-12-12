"use server";
import React from "react";
import Torus from "./torus";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "../../auth";

const Page = async () => {
  if (!cookies().get("tp_tk")?.value) {
    signOut({ redirect: false });
    redirect("/login");
  }

  return <Torus />;
};

export default Page;
