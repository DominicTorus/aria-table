"use client";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { ShareIcon } from "../../constants/svgApplications";
import { getCookie } from "../../../lib/utils/cookiemgmt";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { useRouter } from "next/navigation";
import { hexWithOpacity } from "../../../lib/utils/utility";

const formatDate = (date: Date, locale: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 16) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

const DateandTime = () => {
  const [formattedDate, setFormattedDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const loginId = getCookie("tp_lid");
  const router = useRouter();
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  useEffect(() => {
    const localeFormat = getCookie('cfg_lc') ? getCookie('cfg_lc') : 'en-GB';
    const currentDate = new Date();
    const formatted = formatDate(currentDate, localeFormat);
    setFormattedDate(formatted);
  }, []);

  useEffect(() => {
    const currentGreeting = getGreeting();
    setGreeting(currentGreeting);
  }, []);

  if (!greeting) {
    return null;
  }

  const quickLinks = [{
    label : "Tenant Setup",
    key : "tenantSetup",
    routes : "/control-center?tab=tenant",
  } , {
    label : "App Setup",
    key : "appSetup",
    routes : "/control-center?tab=tenant",
  },
  {
    label : "Build",
    key : "build",
    routes : "/",
  }
]

  return (
    <div className="flex items-center justify-between pt-[0.87vw]">
      <div className="flex flex-col gap-1 pl-[1.46vw]">
        <h1
        style={{color: torusTheme["text"] , fontSize : `${fontSize * 1.25}vw`}}
          className={`font-semibold leading-[2.22vh]`}
        >
          {locale[greeting]},{loginId.charAt(0).toUpperCase() + loginId.slice(1)}!
        </h1>
        <p
          style={{color: torusTheme["textOpacity/50"] , fontSize : `${fontSize * 0.72}vw`}}
          className={`leading-[2.22vh]`}
        >
          {formattedDate}
        </p>
      </div>
      <div className="flex gap-[0.29vw] self-end">
        {
          quickLinks.map(({label , key , routes}) => (
            <Button
            style={{
              backgroundColor: hexWithOpacity(accentColor, 0.15),
              color: accentColor,
              fontSize : `${fontSize * 0.72}vw`
            }}
            className="flex outline-none items-center gap-[0.58vw] px-[0.58vw] h-[2.04vw] font-medium rounded-3xl leading-[2.22vh]"
            key={key}
            onPress={() => router.push(routes)}
          >
            {locale[label]}
            <ShareIcon fill={accentColor} />
          </Button>
          ))
        }
      </div>
    </div>
  );
};

export default DateandTime;
