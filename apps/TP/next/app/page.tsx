"use server";
import React from "react";
import Builder from "./builder";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "../auth";

const Page = () => {
  if (!cookies().get("tp_tk")?.value) {
    signOut({redirect: false});
    redirect("/login");
  }
  return <Builder />;
};

export default Page;
