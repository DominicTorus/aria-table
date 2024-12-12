"use client";
import React, { useState } from "react";
import DropDown from "../../components/multiDropdownnew";
import {
  DaylightTheme,
  EclipseTheme,
  FileGallery,
  MidnightTheme,
  SunriseTheme,
} from "../../constants/svgApplications";
import { Button, FileTrigger, Input } from "react-aria-components";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";

const Appearance = ({
  tenantProfileData,
  setTenantProfileData,
  tenantAccess,
}: {
  tenantProfileData: any;
  setTenantProfileData: any;
  tenantAccess: "view" | "edit" | null | undefined;
}) => {
  const [fileImage, setFileImage] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const languageOptions = ["English", "Spanish", "French"];

  const fontSizes = ["Small", "Medium", "Large"];

  const Theme = [
    {
      displayParam: "Daylight",
      icon: <DaylightTheme />,
    },
    {
      displayParam: "Midnight",
      icon: <MidnightTheme />,
    },
    {
      displayParam: "Sunrise",
      icon: <SunriseTheme />,
    },
    {
      displayParam: "Eclipse",
      icon: <EclipseTheme />,
    },
  ];

  const handleUpdateTenantProfile = (key: string, value: string) => {
    setTenantProfileData((prev:any)=> ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-[2.49vh] w-[86.93vw] h-full px-[0.83vw] py-[1.87vh]">
      <div className="flex flex-col">
        <h1
          style={{ color: torusTheme["text"], fontSize : `${fontSize * 1.25}vw` }}
          className=" leading-[1.04vw] font-semibold"
        >
          Tenant Profile
        </h1>
        <p
          style={{ color: torusTheme["textOpacity/50"], fontSize : `${fontSize * 0.83}vw` }}
          className=" leading-[1.04vw] mt-[0.29vw]"
        >
          {locale["Add your tenant related information here"]}
        </p>
      </div>

      <hr
        style={{ borderColor: torusTheme["borderLine"] }}
        className="w-[79.47vw]"
      />

      <div className="flex flex-col gap-[2.5vh]">
        <div className="flex items-center">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              style={{ color: torusTheme["text"], fontSize :`${fontSize * 0.72}vw` }}
              className="font-semibold  leading-[1.85vh]"
            >
              {locale["Language"]}
            </h1>
            <p
              style={{ color: torusTheme["textOpacity/50"], fontSize : `${fontSize * 0.72}vw` }}
              className=" leading-[1.85vh]"
            >
              {locale["Select the language of the application"]}.
            </p>
          </div>
          <DropDown
            triggerButton="English"
            selectedKeys={tenantProfileData?.language ? tenantProfileData?.language : "English"}
            setSelectedKeys={(lan)=>handleUpdateTenantProfile("language",lan)}
            items={languageOptions}
            classNames={{
              triggerButton: `w-[14.16vw] h-[4.07vh] leading-[2.22vh] font-medium`,
              popover: `w-[14.16vw] rounded-md `,
              listbox: `overflow-y-auto `,
              listboxItem:
                "flex leading-[2.22vh] justify-between",
            }}
            arrowFill={torusTheme["text"]}
            styles={{
              triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
              popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
              listboxItem: { fontSize: `${fontSize * 0.83}vw` },
              listbox: { borderColor: torusTheme["border"] },
            }}
           
           
          />
        </div>

        <hr
          style={{ borderColor: torusTheme["borderLine"] }}
          className="w-[79.47vw]"
        />

        <div className="flex flex-col gap-[2.49vh]">
          <div className="flex flex-col gap-[0.62vh]">
            <h1
              style={{ color: torusTheme["text"] , fontSize : `${fontSize * 0.72}vw`}}
              className="font-semibold  leading-[1.85vh]"
            >
              {locale["Interface Theme"]}
            </h1>
            <p
              style={{ color: torusTheme["textOpacity/50"], fontSize : `${fontSize * 0.72}vw` }}
              className=" leading-[1.85vh]"
            >
              {locale["Select the Theme of the application"]}.
            </p>
          </div>
          <div className="flex gap-[1.17vw]">
            {Theme.map((theme) => (
              <div
                className="flex flex-col gap-[2.25vh]"
                key={theme.displayParam}
              >
                <Button
                  onPress={() => handleUpdateTenantProfile("theme", theme.displayParam)}
                  style={{ borderColor: accentColor }}
                  className={`${tenantProfileData?.theme && tenantProfileData?.theme === theme.displayParam ? "border-4 rounded-tl-xl rounded-md" : "outline-none"} outline-none`}
                >
                  {theme.icon}
                </Button>
                <span
                  style={{ color: torusTheme["text"], fontSize : `${fontSize * 0.83}vw` }}
                  className="flex items-center justify-center font-medium  leading-[1.85vh]"
                >
                  {theme.displayParam}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr
          style={{ borderColor: torusTheme["borderLine"] }}
          className="w-[79.47vw]"
        />

        <div className="flex items-center">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              style={{ color: torusTheme["text"], fontSize : `${fontSize * 0.72}vw` }}
              className="font-semibold  leading-[1.85vh]"
            >
              {locale["Font Size"]}
            </h1>
            <p
              style={{ color: torusTheme["textOpacity/50"], fontSize : `${fontSize * 0.72}vw` }}
              className=" leading-[1.85vh]"
            >
              {locale["Select the font size of the application"]}.
            </p>
          </div>
          <DropDown
            triggerButton="Medium"
            selectedKeys={tenantProfileData?.fontSize ? tenantProfileData?.fontSize : "Medium"}
            setSelectedKeys={(size)=>handleUpdateTenantProfile("fontSize",size)}
            items={fontSizes}
            classNames={{
              triggerButton: `border  w-[14.16vw] h-[4.07vh]  leading-[2.22vh] font-medium`,
              popover: `w-[14.16vw] rounded-md `,
              listbox: `overflow-y-auto `,
              listboxItem:
                "flex  leading-[2.22vh] justify-between",
            }}
            styles={{
              triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
              popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
              listboxItem: { fontSize: `${fontSize * 0.83}vw` },
              listbox: { borderColor: torusTheme["border"] },
            }}
            arrowFill={torusTheme["text"]}
          />
        </div>

        <hr
          style={{ borderColor: torusTheme["borderLine"] }}
          className="w-[79.47vw]"
        />

        <div className="flex items-center">
          <div className="flex flex-col w-[20vw] gap-1">
            <h1
              style={{ color: torusTheme["text"], fontSize : `${fontSize * 0.72}vw` }}
              className="font-semibold  leading-[1.85vh]"
            >
              {locale["App Branding"]}
            </h1>
            <p
              style={{ color: torusTheme["textOpacity/50"], fontSize : `${fontSize * 0.72}vw` }}
              className=" leading-[1.85vh]"
            >
              {locale["Configure the theme of the application"]}.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-[0.29vw] items-center">
              <input
                type="text"
                value={file || "equity.css"}
                onChange={(e) => setFile(e.target.value)}
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  borderColor: torusTheme["border"],
                   fontSize : `${fontSize * 0.83}vw`
                }}
                className="outline-none border rounded-md px-2 py-1 w-[9.47vw] h-[4.07vh] "
              />
              <FileTrigger
                onSelect={(e) => {
                  if (!e || e.length === 0) return;
                  let files = Array.from(e as FileList);
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    setFileImage(reader.result as string);
                  };
                  reader.readAsDataURL(e[0]);
                  let filenames: any = files.map((file: any) => file.name);
                  setFile(filenames);
                }}
              >
                <Button
                  style={{ backgroundColor: accentColor, fontSize : `${fontSize * 0.83}vw` }}
                  className=" leading-[1.25vh] w-[9.47vw] text-white h-[4.07vh] outline-none rounded-md"
                >
                  {locale["Change Theme"]}
                </Button>
              </FileTrigger>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
