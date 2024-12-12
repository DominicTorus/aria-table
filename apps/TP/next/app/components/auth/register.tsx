"use client";
import React, { useEffect, useState } from "react";
import {
  CurvedBackground,
  Management,
  Tenant,
  TorusLogo,
} from "../../constants/svgApplications";
import { Button } from "react-aria-components";
import { useRouter } from "next/navigation";
import RegistrationForm from "./registrationForm";
import dashboardImage from "../../constants/dashboardImage.png"
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { hexWithOpacity } from "../../../lib/utils/utility";

const Register = () => {
  const [individual, setIndividual] = useState(false);
  const [individualRegister, setIndividualRegister] = useState(false);
  const [team, setTeam] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamRegister, setTeamRegister] = useState(false);
  const router = useRouter();
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleClick = () => {
    if (individual) {
      setIndividualRegister(true);
    } else if (team) {
      setTeamRegister(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
    }
  }, []);

  return (
    !loading && (
      <div style={{ backgroundColor: torusTheme["bg"] }} className="flex gap-7 w-full h-screen">
        <div className="flex flex-col gap-7">
          <h2
            style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}
            className="flex gap-[0.29vw] leading-[2.66vh] p-[1.46vw] pr-2 font-medium font-['Neue_Montreal',_sans-serif]">
            <TorusLogo /> TORUS
          </h2>

          {individualRegister ? (
            <div>
              <RegistrationForm
                individualRegister={individualRegister}
                teamRegister={teamRegister}
              />
            </div>
          ) : teamRegister ? (
            <div>
              <RegistrationForm
                individualRegister={individualRegister}
                teamRegister={teamRegister}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5 ml-16 h-[82.16vh] w-[25vw]">
              <div className="flex flex-col gap-2">
                <h6 style={{ color: torusTheme["text"], fontSize: `${fontSize * 2}vw` }} className="font-semibold text-nowrap leading-[4.48vh]">
                  Select your Torus journey.
                </h6>
                <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.83}vw` }} className="leading-[1.7vh]">
                  Get started by selecting your preferred mode.
                </p>
              </div>
              <div
                onClick={() => {
                  setIndividual(true), setTeam(false);
                }}
                style={{ borderColor: `${individual ? accentColor : torusTheme["border"]}`, backgroundColor: torusTheme["bgCard"] }}
                className={`flex flex-col cursor-pointer border-2 h-[20vh] gap-1 rounded-md items-center justify-center`}
              >
                <Management width="4.16vw" height="4.16vw" fill={`${accentColor}`} />
                <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.04}vw` }} className="font-semibold leading-[2.22vh]">
                  I&apos;m a Individual
                </h1>
                <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.72}vw` }} className="leading-[1.5vh]">
                  Sign up as an individual user for personal use.
                </p>
              </div>
              <div
                onClick={() => {
                  setTeam(true), setIndividual(false);
                }}
                style={{ borderColor: `${team ? accentColor : torusTheme["border"]}`, backgroundColor: torusTheme["bgCard"] }}
                className={`flex flex-col cursor-pointer border-2 h-[20vh] gap-1 rounded-md items-center justify-center`}
              >
                <Tenant width="4.16vw" height="4.16vw" fill={`${accentColor}`} />
                <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.04}vw` }} className="font-semibold leading-[2.22vh]">
                  I&apos;m a part of a Team
                </h1>
                <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.72}vw` }} className="leading-[1.5vh]">
                  Collaborate with your team and work together.
                </p>
              </div>
              <Button
                onPress={handleClick}
                style={{ backgroundColor: `${individual || team ? accentColor : hexWithOpacity(accentColor, 0.35)}`, fontSize: `${fontSize * 0.83}vw` }}
                className={`font-semibold outline-none leading-[1.7vh] text-white rounded-md p-3`}
              >
                Continue
              </Button>
              <div className="flex h-[18vh] items-end justify-center leading-[1.7vh]">
                <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.8}vw` }}>
                  Already have an account?{" "}
                  <a
                    onClick={() => router.push("/login")}
                    style={{ color: torusTheme["text"] }}
                    className="cursor-pointer font-bold"
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="relative w-3/4 h-screen">
          <div className="absolute w-full h-full z-10">
            <CurvedBackground height="100%" width="100%" />
          </div>
          <div className={`absolute w-full h-full z-20 bg-gradient-to-r from-${torusTheme["bg"]} to-transparent`}></div>
          <div className="absolute w-full h-full z-30 flex justify-end items-center">
            <Image
              className="h-[73.62vh] w-[58vw] "
              src={dashboardImage}
              alt="torusDashboard"
            />
          </div>
        </div>
      </div>
    )
  );
};

export default Register;
