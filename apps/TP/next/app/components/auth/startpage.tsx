"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-aria-components";
import { Button } from "react-aria-components";
import { Input, Label } from "react-aria-components";
import { toast } from "react-toastify";
import { login, socialLogin } from "../../../lib/utils/login";
import {
  Gitbutton,
  Googlebutton,
  TorusLogo,
} from "../../constants/svgApplications";
import { BsEyeFill, BsEyeSlash } from "react-icons/bs";
import { AxiosService } from "../../../lib/utils/axiosService";
import ProgressButton from "../progressbar";
import TorusToast from "../torusComponents/torusToast";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { useRouter } from "next/navigation";
import { setCookie } from "../../../lib/utils/cookiemgmt";
import { deleteServerCookies } from "../../../lib/utils/registerIdentityProvider";

interface LoginFormProps {
  variant?: "TP" | "CG";
}

function LoginForm({ variant = "TP" }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    client: "",
  });
  const [selectedOption, setSelectedOption] = useState<"Individual" | "Teams">(
    "Individual"
  );
  const [wordLength, setWordLength] = useState(0);
  const router = useRouter();
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleFormSubmit = async () => {
    deleteServerCookies();
    const { username, password, client } = formData;
    if (selectedOption == "Teams") {
      try {
        setLoading(true);
        if (client && username && password) {
          const res = await login({
            client: client.trim(),
            username: username.trim(),
            password: password.trim(),
          });
          if (res?.error) {
            const errorObj = typeof res.error == "string" ? JSON.parse(res.error) : {};
            setLoading(false);
            toast(
              <TorusToast
                setWordLength={setWordLength}
                wordLength={wordLength}
              />,
              {
                type: "error",
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                title: "Error",
                text: errorObj?.message ?? `Failed to login, check credentials`,
                closeButton: false,
              } as any
            );
          } else {
            toast(
              <TorusToast
                setWordLength={setWordLength}
                wordLength={wordLength}
              />,
              {
                type: "success",
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                title: "Success",
                text: `Logged in successfully`,
                closeButton: false,
              } as any
            );
            setLoading(false);
          }
        } else {
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "warning",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Warning",
              text: `Please fill all the fields`,
              closeButton: false,
            } as any
          );
          setLoading(false);
        }
      } catch (error) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error",
            text: `Failed to login, check credentials`,
            closeButton: false,
          } as any
        );
      }
    } else if (selectedOption == "Individual") {
      if (!username || !password) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "warning",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Warning",
            text: `Please fill all the fields`,
            closeButton: false,
          } as any
        );
        setLoading(false);
        return;
      } else {
        try {
          setLoading(true);
          const res = await AxiosService.post("/api/auth-individualSignin", {
            username: username.trim(),
            password: password.trim(),
          });
          if (res.status == 201) {
            toast(
              <TorusToast
                setWordLength={setWordLength}
                wordLength={wordLength}
              />,
              {
                type: "success",
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                title: "Success",
                text: `Logged in successfully`,
                closeButton: false,
              } as any
            );
            const token = res.data.token;
            setCookie("tp_tk", token);
            setCookie("tp_lid", res.data.loginId);
            setCookie("tp_em", res.data.email);
            setCookie("tp_cc", res.data.client);
            router.push("/control-center");
          } else {
            setLoading(false);
            toast(
              <TorusToast
                setWordLength={setWordLength}
                wordLength={wordLength}
              />,
              {
                type: "error",
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                title: "Error",
                text: `Failed to login, check credentials`,
                closeButton: false,
              } as any
            );
          }
        } catch (error) {
          setLoading(false);
          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error",
              text: `Failed to login, check credentials`,
              closeButton: false,
            } as any
          );
        }
      }
    }
  };

  const passwordvisible = () => {
    setShowPassword(!showPassword);
  };

  const handlesociallogin = async (social: "google" | "github") => {
    const res = await socialLogin(social);
  };

  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      style={{ backgroundColor: torusTheme["bg"] }}
      className="h-screen w-full flex flex-col gap-[3.51vw] justify-betweenn py-[0.62vh] border-none"
    >
      <h2
        style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}
        className="flex leading-[2.6vh] px-[0.87vw] py-[1.87vh] items-center font-medium transition-transform duration-700 ease-in-out"
      >
        <TorusLogo /> TORUS
      </h2>
      <div className="flex w-full px-[4.09vw]">
        <div className="flex flex-col h-[82.16vh] w-[21.23vw] gap-[3.36vh]">
          <div className="flex flex-col">
            <h1
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 2}vw` }}
              className="leading-[4.4vh] font-semibold"
            >
              Log in
            </h1>
            <p
              style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.8}vw` }}
              className="pt-[1.24vh] leading-[1.7vh]"
            >
              Enter your details to get started
            </p>
          </div>

          <div
            style={{ backgroundColor: torusTheme["bgCard"] }}
            className="flex w-full rounded-lg px-[0.29vw] py-[0.62vh]"
          >
            <Button
              onPress={() => setSelectedOption("Individual")}
              style={{
                backgroundColor:
                  selectedOption === "Individual"
                    ? torusTheme["bg"]
                    : "inherit",
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.8}vw`,
              }}
              className={`py-[1.24vh] w-1/2 transition-colors duration-700 ease-in-out leading-[1.8vh] rounded-md
                             ${selectedOption === "Individual"
                  ? "outline-none font-semibold"
                  : "outline-none font-medium"
                } outline-none`}
            >
              Individual
            </Button>
            <Button
              onPress={() => setSelectedOption("Teams")}
              style={{
                backgroundColor:
                  selectedOption === "Teams" ? torusTheme["bg"] : "inherit",
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.8}vw`,
              }}
              className={`py-[1.24vh] w-1/2 transition-colors duration-700 ease-in-out leading-[1.8vh] rounded-md
                            ${selectedOption === "Teams"
                  ? "outline-none font-semibold"
                  : "outline-none font-medium"
                } outline-none`}
            >
              Team
            </Button>
          </div>
          <Form className="flex flex-col transition-all duration-700 ease-in-out gap-[2.18vh]">
            <div
              className={`flex flex-col transition-[visibility]animate-fadeOut duration-300 ${selectedOption == "Individual" ? "invisible" : ""}`}
            >
              <Label
                htmlFor="client"
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                className="mb-[0.62vh] font-medium leading-[1.7vh]"
              >
                Client
              </Label>
              <Input
                id="client"
                name="client"
                type="text"
                autoComplete="off"
                onChange={handleFormDataChange}
                placeholder="Enter your Client Code"
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.8}vw`,
                }}
                className="font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[2.18vh] rounded-md w-full "
              />
            </div>
            <div className="flex flex-col focus:outline-none">
              <Label
                htmlFor="Email or Username"
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                className="mb-[1.24vh] font-medium leading-[1.7vh]"
              >
                Email or Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                onChange={handleFormDataChange}
                placeholder="eg:support@torus.com"
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.8}vw`,
                }}
                className="font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[2.18vh] rounded-md w-full "
              />
            </div>
            <div className="flex flex-col relative">
              <Label
                htmlFor="Password"
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                className="mb-[1.24vh] font-medium leading-[1.7vh]"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                autoComplete="off"
                onChange={handleFormDataChange}
                type={showPassword ? "text" : "password"}
                onKeyUp={(e) => e.key === "Enter" && handleFormSubmit()}
                placeholder="Enter Password"
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.8}vw`,
                }}
                className="pl-[0.87vw] outline-none font-medium leading-[1.7vh] py-[2.18vh] rounded-md w-full"
              />
              <span
                className="absolute bottom-[5.5vh] right-[1.25vw] cursor-pointer"
                onClick={passwordvisible}
              >
                {showPassword ? (
                  <BsEyeFill fill={torusTheme["text"]} />
                ) : (
                  <BsEyeSlash fill={torusTheme["text"]} />
                )}
              </span>
              <Button
                onPress={() =>
                  router.push(`/forgotpassword?t=${selectedOption}`)
                }
                style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.8}vw` }}
                className="outline-none self-start font-medium leading-[1.7vh] mt-[1.87vh]"
              >
                Forgot Password?
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                onPress={handleFormSubmit}
                isDisabled={loading}
                style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.8}vw` }}
                className={`w-full flex justify-center text-white ${loading ? "py-[0.93vh]" : "py-[2.18vh]"
                  } font-semibold leading-[1.7vh] focus:outline-none rounded-lg`}
              >
                {loading ? <ProgressButton isIndeterminate /> : "Sign In"}
              </Button>
            </div>
          </Form>
          <div
            className={`flex flex-col gap-[2.18vh] transition-[visibility] animate-fadeOut duration-300 ${selectedOption == "Teams" ? "invisible" : ""}`}
          >
            <div className="flex items-center justify-center w-full">
              <span
                style={{ backgroundColor: torusTheme["textOpacity/15"] }}
                className="h-[0.15vh] w-[50%] "
              ></span>
              <span
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                className="px-[0.58vw] leading-[1.7vh]"
              >
                Or
              </span>
              <span
                style={{ backgroundColor: torusTheme["textOpacity/15"] }}
                className="h-[0.15vh] w-[50%]"
              ></span>
            </div>

            <div className="flex w-full justify-between gap-[0.5vw]">
              <Button
                onPress={() => handlesociallogin("github")}
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.8}vw`,
                }}
                className="w-full py-[2.18vh] font-medium leading-[1.7vh] px-[1.75vw] flex items-center justify-center focus:outline-none rounded-lg"
              >
                <Gitbutton fill={torusTheme["text"]} />
                GitHub
              </Button>
              <Button
                onPress={() => handlesociallogin("google")}
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.8}vw`,
                }}
                className="w-full py-[2.18vh] font-medium leading-[1.7vh] px-[1.75vw] flex items-center justify-center focus:outline-none rounded-lg"
              >
                <Googlebutton />
                Google
              </Button>
            </div>
          </div>
          <div style={{ fontSize: `${fontSize * 0.8}vw`, }} className="flex h-[25vh] items-end justify-center leading-[1.7vh]">
            <p style={{ color: torusTheme["textOpacity/35"] }}>
              Don&apos;t have an account?{" "}
              <a
                onClick={() => router.push("/register")}
                style={{ color: torusTheme["text"] }}
                className="cursor-pointer font-bold"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
