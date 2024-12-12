import React from "react";
import Register from "../../components/auth/register";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = () => {
  if (cookies().get("tp_tk")?.value) {
    redirect("/torus");
  }
  return (
    <div>
      <Register />
    </div>
  );
};

export default page;
