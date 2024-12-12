import React from "react";
import { Button } from "react-aria-components";
import {
  AIFabric,
  DataFabric,
  ProcessFabric,
  UserFabric,
} from "../../constants/svgApplications";
import { getEncodedDetails } from "../../../lib/utils/cookiemgmt";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";

interface FabricsProps {
  isRole: any | null;
}

const Fabrics: React.FC<FabricsProps> = ({ isRole }) => {
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const url = process.env.NEXT_PUBLIC_MODELLER_URL ;
  const locale = useSelector((state: RootState) => state.main.locale);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleFabricChange = (fabricKey: string) => {
    const encodedDetails = getEncodedDetails(
      fabricKey,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      tenant
    );
    window.location.href = `${url}?tk=${encodedDetails}`;
  };

  const isFabricDisabled = (fabricKey: string) => {
    if(isRole && isRole?.[fabricKey]){
      const fabric = isRole?.[fabricKey];
      return !fabric || (!fabric.map && !fabric.orch);
    }else{
      return false
    }
  };

  const fabricData = [
    {
      fabric: "DF-ERD",
      displayParam: "Data Fabric",
      icon: (
        <DataFabric opacity="1" fill={accentColor} width="2.5vw" height="2.5vw" />
      ),
      roleKey: "DF",
    },
    {
      fabric: "UF-UFD",
      displayParam: "UI Fabric",
      icon: (
        <UserFabric opacity="1" fill={accentColor} width="2.5vw" height="2.5vw" />
      ),
      roleKey: "UF",
    },
    {
      fabric: "PF-PFD",
      displayParam: "Process Fabric",
      icon: (
        <ProcessFabric opacity="1" fill={accentColor} width="2.5vw" height="2.5vw" />
      ),
      roleKey: "PF",
    },
    {
      fabric: "AIF-AIFD",
      displayParam: "AI Fabric",
      icon: (
        <AIFabric opacity="1" fill={accentColor} width="2.5vw" height="2.5vw" />
      ),
      roleKey: "AF",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: torusTheme["bg"],
        borderColor: torusTheme["border"],
      }}
      className={`flex flex-col gap-[1.46vw] p-[1.17vw] border w-full h-[20.79vh] rounded-md`}
    >
      <h2
        style={{
          color: torusTheme["text"],
          fontSize: `${fontSize * 0.93}vw`,
        }}
        className={`font-semibold leading-[1.13vh]`}
      >
        {locale["Fabrics"]}
      </h2>
      <div className="flex gap-[0.58vw]">
  {fabricData.map((fab) => {
  const isDisabled = isRole?.result == "admin" ? false : isFabricDisabled(fab.roleKey)


    return (
      <Button
        onPress={() => !isDisabled && handleFabricChange(fab.fabric)}
        key={fab.fabric}
        style={{
          backgroundColor: torusTheme["bgCard"],
          color: torusTheme["text"],
          fontSize: `${fontSize * 0.72}vw`,
        }}
        className={`flex flex-col gap-[0.87vw] outline-none w-[7.6vw] h-[9.53vh] p-[0.58vw] leading-[1.5vh] font-medium rounded-md text-nowrap mt-[0.29vw] ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        isDisabled={isDisabled}
      >
        {fab.icon}
        <span className="w-full text-wrap text-left">
          {locale[fab.displayParam]}
        </span>
      </Button>
    );
  })}
</div>

</div>
  );
};

export default Fabrics;



