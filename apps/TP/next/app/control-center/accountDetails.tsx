import React, { useEffect, useState } from "react";
import {
  CameraIcon,
  ClosePassword,
  Multiply,
} from "../constants/svgApplications";
import {
  Button,
  Dialog,
  DialogTrigger,
  FileTrigger,
  Input,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { AxiosService } from "../../lib/utils/axiosService";
import { getCookie } from "../../lib/utils/cookiemgmt";
import { toast } from "react-toastify";
import TorusToast from "../components/torusComponents/torusToast";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { PiEye } from "react-icons/pi";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";
import ImagePreviewModal from "./imagePreviewModal";

const AccountDetails = ({
  userAccountDetails,
  setUserAccountDetails,
  isTeam,
  localAccentColor,
  localLanguage
}: {
  userAccountDetails: any;
  setUserAccountDetails: (value: any) => void;
  isTeam: boolean;
  localAccentColor: string;
  localTheme: string;
  localLanguage: any
}) => {
  const [wordLength, setWordLength] = useState(0);
  const clientCode = getCookie("tp_cc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [passwordChange, setPasswordChange] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<string | null>(null);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const getMyAccountForClient = async () => {
    try {
      const res = await AxiosService.get(`/api/myAccount-for-client`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("tp_tk")}`,
        },
      });
      if (res.status === 200) {
        setUserAccountDetails(res.data);
      } else {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error",
            text: `Something went wrong`,
            closeButton: false,
          } as any
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Occured While Saving client Info";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Occured",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  useEffect(() => {
    getMyAccountForClient();
  }, []);

  const handleUploads = async (file: any, filename: string) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucketFolderame", "torus9x");
      data.append(
        "folderPath",
        `tp/clientAssets/${clientCode}/${userAccountDetails.loginId}`
      );

      if (userAccountDetails[filename]) {
        const deletionResponse = await AxiosService.delete(`/image/delete-asset`, {
          headers: {
            url: userAccountDetails[filename],
          },
        });
        if (deletionResponse.status == 200) {
          setUserAccountDetails((prev: any) => ({ ...prev, [filename]: "" }))
        }
      }

      if (file) {
        const res = await AxiosService.post("image/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            filename: file.name ? file.name.replace(/\.[^/.]+$/, "") : filename,
          },
        });
        if (res.status === 201) {
          const responseData = res.data.imageUrl;
          handleInputChange({
            target: { name: filename, value: responseData },
          });
        } else {
          toast(
            <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
            {
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error Occured",
              text: `File is not valid`,
              closeButton: false,
            } as any
          );
        }
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Occured While Saving Uploading images ";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error Occured",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserAccountDetails((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: any) => {
    setError("");
    const { name, value } = e.target;
    setPasswordChange((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (
      passwordChange.password === "" ||
      passwordChange.confirmPassword === ""
    ) {
      setError("Please enter password");
    } else if (
      !/[a-z]/.test(passwordChange.password) ||
      !/[A-Z]/.test(passwordChange.password) ||
      !/[0-9]/.test(passwordChange.password)
    ) {
      setError("Password doesn't meet the strength requirement");
    } else if (
      passwordChange.password !== passwordChange.confirmPassword ||
      passwordChange.password === "" ||
      passwordChange.confirmPassword === ""
    ) {
      setError("Password not matched");
    } else {
      try {
        const res = await AxiosService.post("/api/auth-resetPassword", {
          email: userAccountDetails.email,
          password: passwordChange.password,
          clientCode: clientCode,
        });
        if (res.status === 201) {
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
              text: `Password changed successfully`,
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
              type: "error",
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              title: "Error",
              text: `Failed to reset password. Please try again`,
              closeButton: false,
            } as any
          );
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.error ? error?.response?.data?.errorDetails :
            "Error Occured While reset password";
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "error",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Error Occured",
            text: `${message}`,
            closeButton: false,
          } as any
        );
      }

      setPasswordChange({ password: "", confirmPassword: "" });
      setIsModalOpen(false);
    }
  };

  const handlechange = () => {
    if (isPreviewModalOpen === "coverimg") {
      document.getElementById("previewImagebtncoverimgforacc")?.click();
    } else if (isPreviewModalOpen === "logo") {
      document.getElementById("previewImagebtnlogoforacc")?.click();
    } else if (isPreviewModalOpen === "profile") {
      document.getElementById("previewImagebtnprofileforacc")?.click();
    }
  };

  const handleFileSelect = (file: FileList, type: string) => {
    if (file.length > 0 && type == "logo") {
      setSelectedFile(file[0]);
      setIsPreviewModalOpen("logo");
    } else if (file.length > 0 && type == "coverimg") {
      setSelectedFile(file[0]);
      setIsPreviewModalOpen("coverimg");
    } else if (file.length > 0 && type == "profile") {
      setSelectedFile(file[0]);
      setIsPreviewModalOpen("profile");
    }
  };

  const passwordVisible = () => {
    setShowPassword(!showPassword);
  };

  const confirmPasswordVisible = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col gap-[2.49vh] w-[86.93vw] h-[93.61vh] px-[0.83vw] py-[1.8vh]">
      <div className="flex flex-col gap-[2vh]">
        <h1 className="font-semibold leading-[1.85vh] "
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}>
          {localLanguage["My Account"]}
        </h1>
        <hr className="w-full border"
          style={{ borderColor: torusTheme["borderLine"] }} />
      </div>
      <div className="flex flex-col gap-[3vh]">
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1 className="font-semibold leading-[1.85vh] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Profile Photo"]}*
            </h1>
            <p className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Fill in your company info"]}
            </p>
          </div>
          {isTeam === true ? (
            <FileTrigger
              acceptedFileTypes={["image/png", "image/jpeg", "image/x-icon"]}
              onSelect={(e) => e && handleFileSelect(e, "profile")}
            >
              <Button
                id="previewImagebtnprofileforacc"
                className={"outline-none flex cursor-pointer items-center justify-center rounded-full w-[8.1vw] h-[8.1vw]"}
              >
                {userAccountDetails.profile ? (
                  <Image
                    src={userAccountDetails.profile}
                    alt={userAccountDetails.profile}
                    className="w-[8.1vw] h-[8.1vw] rounded-full object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <span className="flex cursor-pointer items-center justify-center w-[8.1vw] h-[8.1vw] rounded-full"
                    style={{ backgroundColor: torusTheme["bgCard"] }}>
                    <CameraIcon fill={torusTheme["text"]} />
                  </span>
                )}
              </Button>
            </FileTrigger>
          ) : (
            <div className="h-[25vh] w-[40vw]">
              <div className="relative shadow rounded-lg border"
                style={{ borderColor: torusTheme["border"] }} >
                {/* <!-- Cover Image Section --> */}
                <FileTrigger
                  acceptedFileTypes={[
                    "image/png",
                    "image/jpeg",
                    "image/x-icon",
                  ]}
                  onSelect={(e) => e && handleFileSelect(e, "coverimg")}
                >
                  {userAccountDetails.coverimg ? (
                    <Image
                      src={userAccountDetails.coverimg}
                      alt={userAccountDetails.coverimg}
                      className="h-[17.47vh] rounded-t-lg w-[40vw] object-cover"
                      width={400}
                      height={200}
                    />
                  ) : (
                    <div
                      className="h-[17.47vh] rounded-t-lg"
                      style={{
                        backgroundColor: torusTheme["bgCard"],
                        // backgroundImage: userAccountDetails.coverimg
                        //   ? `url(${userAccountDetails.coverimg})`
                        //   : "none",
                        backgroundSize: "cover", // ensures the image covers the div area
                        backgroundPosition: "center", // centers the background image
                      }}
                    >
                    </div>
                  )}
                  {/* <!-- Edit Cover Button --> */}
                  <Button
                    id="previewImagebtnlogoforacc"
                    className="outline-none absolute bottom-[10.87vh] right-[0.87vw] bg-[#1C274C] text-white leading-[2.22vh] px-[1.5vw] py-[1.24vh] rounded-md"
                    style={{ fontSize: `${fontSize * 0.83}vw` }}
                  >
                    {localLanguage["Edit Cover"]}
                  </Button>
                </FileTrigger>

                {/* <!-- Profile Section --> */}
                <div className="flex items-center px-[1.75vw] py-[1.24vh]">
                  <FileTrigger
                    acceptedFileTypes={[
                      "image/png",
                      "image/jpeg",
                      "image/x-icon",
                    ]}
                    onSelect={(e) => {
                      e && handleFileSelect(e, "logo");
                    }}
                  >
                    <div className="relative">
                      {/* <!-- Profile Picture Placeholder --> */}
                      <div className="cursor-pointer w-[8.6vw] h-[8.6vw] rounded-full flex items-center justify-center border-[0.40vw] -mt-[12.48vh]"
                        style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["bg"] }}>
                        <Button className={"outline-none"}>
                          {userAccountDetails.logo ? (
                            <Image
                              src={userAccountDetails.logo}
                              alt={userAccountDetails.logo}
                              className="w-[8.1vw] h-[8.1vw] rounded-full object-cover"
                              width={90}
                              height={90}
                            />
                          ) : (
                            <div
                              id="previewImagebtncoverimgforacc"
                              className="outline-none w-[8.6vw] h-[8.6vw] rounded-full flex items-center justify-center border-[0.40vw]"
                              style={{
                                backgroundColor: torusTheme["bgCard"],
                                borderColor: torusTheme["bg"],
                              }}
                            >
                              <CameraIcon fill={torusTheme["text"]} />
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </FileTrigger>

                  <div className=" flex flex-col gap-[1.24vh] ml-[1.17vw]">
                    <h1 className="font-semibold leading-[1.39vh]"
                      style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.04}vw` }}>
                      {userAccountDetails?.firstName}{" "}
                      {userAccountDetails.lastName}
                    </h1>
                    <p className="leading-[1.39vh]"
                      style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.72}vw` }}>
                      {userAccountDetails?.loginId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ImagePreviewModal
            isOpen={isPreviewModalOpen}
            selectedFile={selectedFile}
            setIsOpen={setIsPreviewModalOpen}
            handleUploads={handleUploads}
            setSelectedFile={setSelectedFile}
            handlechange={handlechange}
          />
        </div>

        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1 className="font-semibold leading-[1.85vh]"
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Full Name"]}*
            </h1>
            <p className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Set your Firstname and Lastname"]}.
            </p>
          </div>
          <div className="flex gap-[0.58vw]">
            <Input
              id="firstName"
              defaultValue={userAccountDetails.firstName}
              onChange={handleInputChange}
              name="firstName"
              placeholder={localLanguage["firstName"]}
              className="w-[14.16vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
              style={{
                backgroundColor: torusTheme["bgCard"],
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.83}vw`
              }}
            />
            <Input
              id="lastName"
              defaultValue={userAccountDetails.lastName}
              onChange={handleInputChange}
              name="lastName"
              placeholder={localLanguage["lastName"]}
              className="w-[14.16vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
              style={{
                backgroundColor: torusTheme["bgCard"],
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.83}vw`
              }}
            />
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1 className="font-semibold leading-[1.85vh]"
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["UserName"]}*
            </h1>
            <p className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Set your Username"]}.
            </p>
          </div>
          <Input
            id="userName"
            defaultValue={userAccountDetails.loginId}
            name="userName"
            disabled
            placeholder="@roronoazoro"
            className="w-[14.16vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
            style={{
              backgroundColor: torusTheme["bgCard"],
              color: torusTheme["text"],
              fontSize: `${fontSize * 0.83}vw`
            }}
          />
        </div>
        {isTeam == false && (
          <div className="flex">
            <div className="flex flex-col w-[20vw] gap-[0.62vh]">
              <h1 className="font-semibold leading-[1.85vh] "
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                {localLanguage["Description"]}
              </h1>
              <p className="leading-[1.85vh]"
                style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
              >
                {localLanguage["Set your description to tell your story"]}.
              </p>
            </div>
            <Input
              id="description"
              defaultValue={userAccountDetails.description}
              name="description"
              onChange={handleInputChange}
              placeholder="ex: Write a short description."
              className="w-[40vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
              style={{
                backgroundColor: torusTheme["bgCard"],
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.83}vw`
              }}
            />
          </div>
        )}
        <hr className="w-[79.47vw] border-[0.15vh]"
          style={{ borderColor: torusTheme["borderLine"] }} />
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1 className="font-semibold leading-[1.85vh]"
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Email"]}*
            </h1>
            <p className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Change your email address"]}.
            </p>
          </div>
          <div className="flex items-center gap-[0.58vw]">
            <Input
              id="Email"
              name="Email"
              disabled
              defaultValue={userAccountDetails.email}
              placeholder="roronoazoro@donut.com"
              className="w-[14.16vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
              style={{
                backgroundColor: torusTheme["bgCard"],
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.83}vw`
              }}
            />
            <p
              style={{ color: localAccentColor || torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
              className="leading-[2.22vh]"
            >
              {localLanguage["To change email, contact your administrator"]}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1 className="font-semibold leading-[1.85vh] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Reset Password"]}*
            </h1>
            <p className="leading-[1.85vh] "
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Change your password of the application"]}.
            </p>
          </div>
          <DialogTrigger>
            <Button
              onPress={() => setIsModalOpen(true)}
              style={{ backgroundColor: localAccentColor, fontSize: `${fontSize * 0.83}vw` }}
              className="outline-none text-white leading-[2.22vh] rounded-md px-[0.58vw]"
            >
              {localLanguage["Reset Password"]}
            </Button>
            {isModalOpen && (
              <ModalOverlay
                isDismissable
                className={twMerge(
                  "fixed z-[100] top-0 left-0 w-screen h-screen bg-transparent/45 flex items-center justify-center outline-none"
                )}
              >
                <Modal isDismissable className={`outline-none w-[25vw]`}>
                  <Dialog className="p-6 rounded-lg outline-none"
                    style={{ backgroundColor: torusTheme["bg"] }} >
                    <div className="flex justify-between">
                      <h2 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }} className=" font-semibold">
                        {localLanguage["Reset Password"]}
                      </h2>

                      <p
                        onClick={() => setIsModalOpen(false)}
                        className="cursor-pointer"
                      >
                        <Multiply fill={torusTheme["text"]} width="10" height="10" />
                      </p>
                    </div>
                    <div className="mt-4">
                      <div style={{ backgroundColor: torusTheme["bgCard"] }} className="flex items-center border w-[21.5vw] mb-4 rounded">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={localLanguage["Password"]}
                          name="password"
                          className="w-[18vw] leading-[1.24vw] p-2 rounded outline-none"
                          style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                          onChange={handlePasswordInputChange}
                          value={passwordChange.password}
                        />
                        <span
                          className="cursor-pointer ml-4"
                          onClick={passwordVisible}
                        >
                          {showPassword ? <PiEye fill={torusTheme["text"]} /> : <ClosePassword fill={torusTheme["text"]} />}
                        </span>
                      </div>
                      <div style={{ backgroundColor: torusTheme["bgCard"] }} className="flex items-center border w-[21.5vw] mb-4 rounded">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={localLanguage["Confirm Password"]}
                          name="confirmPassword"
                          className="w-[18vw] leading-[1.24vw]  p-2 rounded outline-none"
                          style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                          onChange={handlePasswordInputChange}
                          value={passwordChange.confirmPassword}
                        />
                        <span
                          className="cursor-pointer ml-4"
                          onClick={confirmPasswordVisible}
                        >
                          {showConfirmPassword ? <PiEye fill={torusTheme["text"]} /> : <ClosePassword fill={torusTheme["text"]} />}
                        </span>
                      </div>
                      {error && (
                        <div className="text-red-500 text-xs  mb-2"
                          style={{ color: torusTheme["text"] }}>
                          {error}
                        </div>
                      )}
                      <div className="flex justify-end mt-6">
                        <Button
                          style={{
                            backgroundColor: localAccentColor,
                            fontSize: `${fontSize * 0.72}vw`
                          }}
                          className="text-white px-4 py-2 outline-none"
                          onPress={handlePasswordSubmit}
                        >
                          {localLanguage["Submit"]}
                        </Button>
                      </div>
                    </div>
                  </Dialog>
                </Modal>
              </ModalOverlay>
            )}
          </DialogTrigger>
        </div>
        <hr className="w-[79.47vw] border-[0.15vh]"
          style={{ borderColor: torusTheme["borderLine"] }} />
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1 className="font-semibold leading-[1.85vh] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Mobile Number"]}*
            </h1>
            <p className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
              {localLanguage["Change your Mobile Number"]}.
            </p>
          </div>
          <div className="flex items-center gap-[0.58vw]">
            <Input
              id="mobileNumber"
              defaultValue={userAccountDetails.mobile}
              disabled
              name="mobileNumber"
              placeholder={localLanguage["Mobile Number"]}
              className="w-[14.16vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
              style={{
                backgroundColor: torusTheme["bgCard"],
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.83}vw`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;