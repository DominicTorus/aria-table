// import Vmsp_banksTable from '@/app/bankMaster/Vmsp_banksTable'
"use client";
import React from "react";
import Vmsp_banksTable from "./Vmsp_banksTable";

export default async function Vmsp_banks() {
  // const users = await getUsers()
  return (
    <div className="w-full h-screen">
      <Vmsp_banksTable />
    </div>
  );
}
