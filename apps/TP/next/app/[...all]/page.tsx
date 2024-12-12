import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  if (!cookies().get("tp_tk")?.value) {
    redirect("/login");
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col">
        <p>The requested page is not exist</p>
      </div>
      <div>
        Please{" "}
        <Link href={"/torus"} className={`text-[#0736C4]`}>
          click here
        </Link>{" "}
        to navigate Home screen
      </div>
    </div>
  );
};

export default Page;
