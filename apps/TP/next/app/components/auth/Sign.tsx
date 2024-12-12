"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import DashBoard from "../../constants/Image.png";
import DarkModeDashboard from "../../constants/darkDashboard.png";
import LoginForm from "../../components/auth/startpage";
import { ArrowForward } from "../../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";

const Login = () => {
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false)
    }
  }, [])

  return (
    !loading ? (
      <div style={{ backgroundColor: torusTheme["bgCard"] }} className="flex justify-between w-full h-screen overflow-hidden transition-colors duration-700 ease">
        <div className="w-[30%] flex items-center justify-center">
          <LoginForm />
        </div>
        <div
          className={`flex flex-col justify-between w-[66%] h-[100%] pt-[3vw] gap-[2vw]`}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between mr-8">
              <div className="flex gap-1 items-center">
                <span className="w-[.46vw] h-[.46vw] rounded-full" style={{ backgroundColor: `${accentColor}` }}></span>
                <p style={{ color: accentColor, fontSize: `${fontSize * 0.93}vw` }} className="leading-[2vh] font-bold">
                  What&apos;s New
                </p>
              </div>
              <p style={{ color: accentColor, fontSize: `${fontSize * 0.72}vw` }} className="flex items-center font-medium leading-[1.5vh]">
                View all changes <ArrowForward fill={accentColor} />
              </p>
            </div>

            <p style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.8}vw` }} className="flex pt-3 font-bold leading-[3.92vh]">
              Discover the New Torus 9
            </p>
            <p style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.93}vw` }} className="leading-[2.31vh] w-[75%] mt-4">
              Experience the all new Torus9 with an enhanced UI Intuitive
              appflow,newscreens a refreshed home and our newbrand new marketplace
              and templates Log in into Explore the nextlevel of productivity and
              innovations
            </p>
          </div>
          <Image
            className="w-[100%] mr-auto rounded-tl-[3.5%]  "
            src={torusTheme["bgCard"] == "#0F0F0F" || torusTheme["bgCard"] == "#050C24" ? DarkModeDashboard : DashBoard}
            alt="bankmaster"
          />
        </div>
      </div>) : null
  );
};

export default Login;
