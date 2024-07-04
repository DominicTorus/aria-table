// import Vmsp_banksTable from '@/app/bankMaster/Vmsp_banksTable'
"use client";
import React from "react";
import Vmsp_banksTable from "./Vmsp_banksTable";

// async function getUsers(): Promise<User[]> {
//   const res = await fetch('http://192.168.2.18:3004/user')
//   const data = await res.json()
//   return data
// }

export default async function Vmsp_banks() {
  // const users = await getUsers()
  return (
    <section className="py-5 w-[90%]">
      <div className="container">
        <Vmsp_banksTable />
      </div>
    </section>
  );
}
