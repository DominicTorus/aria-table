"use client";
import React, { useEffect, useState } from "react";
import { Button, FileTrigger, Input } from "react-aria-components";
import { CameraIcon, Clipboard, Multiply } from "../constants/svgApplications";
import DropDown from "../components/multiDropdownnew";
import { industryList, organizationSize } from "../constants/MenuItemTree";
import { toast } from "react-toastify";
import TorusToast from "../components/torusComponents/torusToast";
import { getCookie } from "../../lib/utils/cookiemgmt";
import { AxiosService } from "../../lib/utils/axiosService";
import { FaClipboardCheck } from "react-icons/fa";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";
import ImagePreviewModal from "./imagePreviewModal";

const ClientProfileInfo = ({
  clientProfileDetails,
  setClientProfileDetails,
  access,
}: {
  clientProfileDetails: any;
  setClientProfileDetails: (val: any) => void;
  access: "view" | "edit" | null;
}) => {
  const [copied, setCopied] = useState(false);
  const [wordLength, setWordLength] = useState(0);
  const clientCode = getCookie("tp_cc");
  const [organizationOptions, setOrganizationOptions] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<string | null>(null)
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const getClientProfile = async () => {
    try {
      const res = await AxiosService.get(
        `/api/get-client-profile?clientCode=${clientCode}`
      );
      if (res.status === 200) {
        setClientProfileDetails(res.data);
        setOrganizationOptions(industryList[res.data["industryType"] as keyof typeof industryList] ? industryList[res.data["industryType"]  as keyof typeof industryList] : [])
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving Client code Info";
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
    getClientProfile();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setClientProfileDetails({ ...clientProfileDetails, [name]: value });
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(clientProfileDetails.code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDropDownChange = (value: string, name: string) => {
    if (name == "industryType") {
      setOrganizationOptions(industryList[value as keyof typeof industryList] ? industryList[value as keyof typeof industryList] : []);
      setClientProfileDetails({ ...clientProfileDetails, orgType: "" });
    }
    setClientProfileDetails({ ...clientProfileDetails, [name]: value });
  };

  const handleUploads = async (file: any, filename: string) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucketFolderame", "torus9x");
      data.append("folderPath", `tp/clientAssets/${clientCode}`);

      if (clientProfileDetails[filename]) {
        const deletionResponse = await AxiosService.delete(`/image/delete-asset`, {
          headers: {
            url: clientProfileDetails[filename],
          },
        });
        if (deletionResponse.status == 200) {
          setClientProfileDetails((prev: any) => ({ ...prev, [filename]: "" }))
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
          handleDropDownChange(responseData, filename);
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
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error Occured While Saving Uploading images";
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

  const handleFileSelect = (file: FileList, type: string) => {
    if (file.length > 0 && type == "coverimg") {
      setSelectedFile(file[0]);
      setIsPreviewModalOpen("coverimg");
    } else if (file.length > 0 && type == "logo") {
      setSelectedFile(file[0]);
      setIsPreviewModalOpen("logo");
    }
  };

  const handlechange = () => {
    if (isPreviewModalOpen === "logo") {
      document.getElementById("previewImagebtnlogo")?.click();
      return
    } else if (isPreviewModalOpen === "coverimg") {
      document.getElementById("previewImagebtncoverimg")?.click();
      return
    }
    setIsPreviewModalOpen(null);
  };

  return (
    <div className="flex flex-col gap-[2.49vh] w-[86.93vw] h-[93.61vh] px-[0.83vw] py-[1.87vh]">
      <div className="flex flex-col gap-[2vh]">
        <h1
          className="font-semibold leading-[1.85vh]"
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}
        >
          {locale["Company Profile"]}
        </h1>
        <hr
          className="w-[79.47vw] border-[0.15vh]"
          style={{ borderColor: torusTheme["borderLine"] }}
        />
      </div>
      <div className="flex flex-col gap-[2.5vh]">
        <div className="flex h-[25.74vh]">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh]"
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Company Info"]}*
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Fill in your company info"]}.
            </p>
          </div>

          <div className="h-[39vh] w-[40vw]">
            <div style={{ borderColor: torusTheme["border"] }} className="relative shadow rounded-lg border">
              {/* Cover Image Section */}
              <FileTrigger
                acceptedFileTypes={["image/png", "image/jpeg", "image/x-icon"]}
                onSelect={(e) => {
                  if (e) {
                    handleFileSelect(e, "coverimg");
                  }
                }}
              >
                {clientProfileDetails.coverimg ? (
                  <Image
                    src={clientProfileDetails.coverimg}
                    alt={clientProfileDetails.coverimg}
                    className="h-[17.47vh] rounded-t-lg w-[40vw] object-cover"
                    width={400}
                    height={200}
                  />
                ) : (
                  <div
                    className="h-[17.47vh] rounded-t-lg"
                    style={{
                      backgroundColor: torusTheme["bgCard"],
                      // backgroundImage: clientProfileDetails.coverimg
                      //   ? `url(${clientProfileDetails.coverimg})`
                      //   : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* <div>
                      <Button
                        id="previewImagebtncoverimg"
                        className="outline-none absolute bg-[#1C274C] text-white bottom-[1.87vh] right-[0.87vw] leading-[2.22vh] px-[1.5vw] py-[1.24vh] rounded-md"
                        style={{
                          fontSize: `${fontSize * 0.83}vw`
                        }}
                        isDisabled={access != "edit"}
                      >
                        {locale["Edit Cover"]}
                      </Button>
                    </div> */}
                  </div>
                )}
                {/* Edit Cover Button */}
                <Button
                  id="previewImagebtncoverimg"
                  className="outline-none absolute bg-[#1C274C] text-white bottom-[10.87vh] right-[0.87vw] leading-[2.22vh] px-[1.5vw] py-[1.24vh] rounded-md"
                  style={{
                    fontSize: `${fontSize * 0.83}vw`
                  }}
                  isDisabled={access != "edit"}
                >
                  {locale["Edit Cover"]}
                </Button>
              </FileTrigger>

              {/* Profile Section */}
              <div
                className="flex items-center px-[1.75vw] py-[1.24vh]"
                style={{ backgroundColor: torusTheme["bg"] }}
              >
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
                    {/* Profile Picture Placeholder */}
                    <div
                      className="cursor-pointer rounded-full flex items-center justify-center border-[0.40vw] -mt-[12.48vh]"
                      style={{
                        backgroundColor: torusTheme["bgCard"],
                        borderColor: torusTheme["bg"],
                      }}
                    >
                      <Button
                        id="previewImagebtnlogo"
                        className="outline-none"
                        isDisabled={access != "edit"}
                      >
                        {clientProfileDetails.logo ? (
                          <Image
                            src={clientProfileDetails.logo}
                            alt={clientProfileDetails.logo}
                            className="w-[8.1vw] h-[8.1vw] rounded-full object-cover"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <Button
                            id="previewImagebtnlogo"
                            className="outline-none w-[8.1vw] h-[8.1vw] rounded-full flex items-center justify-center border"
                            style={{
                              backgroundColor: torusTheme["bgCard"],
                              borderColor: torusTheme["bg"],
                            }}
                            isDisabled={access != "edit"}
                          >
                            <CameraIcon fill={torusTheme["text"]} />
                          </Button>
                        )}
                      </Button>
                    </div>
                  </div>
                </FileTrigger>

                <div className="flex flex-col gap-[1.24vh] ml-[1.17vw]">
                  <h1
                    className="font-semibold leading-[1.39vh]"
                    style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.04}vw` }}
                  >
                    {clientProfileDetails?.clientName}
                  </h1>
                  <p
                    className="leading-[1.39vh]"
                    style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.72}vw` }}
                  >
                    {clientProfileDetails?.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ImagePreviewModal
              isOpen={isPreviewModalOpen}
              selectedFile={selectedFile}
              setIsOpen={setIsPreviewModalOpen}
              handleUploads={handleUploads}
              setSelectedFile={setSelectedFile}
              handlechange={handlechange}
            />
          </div>
        </div>

        <div className="flex">
          <div
            className="flex flex-col w-[20vw] gap-[0.62vh]"
            style={{ color: torusTheme["text"] }}
          >
            <h1
              className="font-semibold leading-[1.85vh]"
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Company Name"]}*
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Set the Name of the Company"]}.
            </p>
          </div>
          <Input
            id="clientName"
            defaultValue={clientProfileDetails?.clientName}
            onChange={handleInputChange}
            disabled={access !== "edit"}
            name="clientName"
            placeholder="Enter Your Company Name"
            className="w-[40vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
            style={{
              backgroundColor: torusTheme["bgCard"],
              color: torusTheme["text"],
              fontSize: `${fontSize * 0.83}vw`
            }}
          />
        </div>
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Tagline"]}
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Set the Tagline of the Company"]}.
            </p>
          </div>
          <Input
            id="tagline"
            name="tagline"
            defaultValue={clientProfileDetails?.tagline}
            onChange={handleInputChange}
            disabled={access != "edit"}
            placeholder={
              locale[
              "ex: A software company that helps to build apps for business."
              ]
            }
            className="w-[40vw] outline-none rounded-md leading-[2.22vh] px-[0.58vw] py-[1.24vh]"
            style={{
              backgroundColor: torusTheme["bgCard"],
              color: torusTheme["text"],
              fontSize: `${fontSize * 0.83}vw`
            }}
          />
        </div>
        <div className="flex items-center">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Company Code"]}*
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Code Identifier of the Company"]}.
            </p>
          </div>
          <div
            className="flex items-center justify-between w-[14.16vw] px-[0.58vw] py-[1.24vh] rounded-md leading-[2.22vh]"
            style={{
              backgroundColor: torusTheme["bgCard"],
              color: torusTheme["text"],
              fontSize: `${fontSize * 0.83}vw`
            }}
          >
            {clientProfileDetails?.code}
            <span onClick={handleCopyToClipboard} className="cursor-pointer">
              {copied ? (
                <FaClipboardCheck
                  className="text-green-500"
                />
              ) : (
                <Clipboard
                  fill={torusTheme["text"]}
                  width="0.83vw"
                  height="0.83vw"
                />
              )}
            </span>
          </div>
        </div>
        <hr
          className="w-[79.47vw] border-[0.15vh]"
          style={{ borderColor: torusTheme["borderLine"] }}
        />
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh]"
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Industry"]}*
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Select the Type of the Industry"]}.
            </p>
          </div>
          <DropDown
            triggerButton={locale["Select Industry"]}
            selectedKeys={clientProfileDetails?.industryType}
            setSelectedKeys={(e) => handleDropDownChange(e, "industryType")}
            items={Object.keys(industryList)}
            classNames={{
              triggerButton: `w-[14.16vw] rounded-md font-medium leading-[1.7vh] px-[0.58vw] py-[1.5vh]`,
              popover: `w-[14.16vw] ${Object.keys(industryList).length > 5 ? "h-[22vh] overflow-y-auto scrollbar-hide" : ""}`,
              listboxItem: `text-center leading-[1.7vh]`,
            }}
            styles={{
              triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
              popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
              listboxItem: { fontSize: `${fontSize * 0.83}vw` },
              listbox: { borderColor: torusTheme["border"] },
            }}
            isDisabled={access != "edit"}
            arrowFill={torusTheme["text"]}
          />
        </div>
        <hr
          className="w-[79.47vw] border-[0.15vh]"
          style={{ borderColor: torusTheme["borderLine"] }}
        />
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Organization Type"]}*
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Select the Type of the Organization"]}.
            </p>
          </div>
          <DropDown
            triggerButton={locale["Select Organization"]}
            selectedKeys={clientProfileDetails?.orgType}
            setSelectedKeys={(e) => handleDropDownChange(e, "orgType")}
            items={organizationOptions}
            classNames={{
              triggerButton: `w-[14.16vw] rounded-md font-medium leading-[1.7vh] px-[0.58vw] py-[1.5vh]`,
              popover: `w-[14.16vw] ${organizationOptions.length > 5 ? "h-[22vh] overflow-y-auto scrollbar-hide" : ""}`,
              listboxItem: "text-center leading-[1.7vh]",
            }}
            styles={{
              triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
              popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
              listboxItem: { fontSize: `${fontSize * 0.83}vw` },
              listbox: { borderColor: torusTheme["border"] }
            }}
            isDisabled={access != "edit"}
            arrowFill={torusTheme["text"]}
          />
        </div>
        <hr
          className="w-[79.47vw] border-[0.15vh]"
          style={{ borderColor: torusTheme["borderLine"] }}
        />
        <div className="flex">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh] "
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Organization Size"]}*
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            >
              {locale["Select the Size of the Organization"]}.
            </p>
          </div>
          <DropDown
            triggerButton={locale["Select Organization Size"]}
            selectedKeys={clientProfileDetails?.orgSize}
            setSelectedKeys={(e) => handleDropDownChange(e, "orgSize")}
            items={organizationSize}
            classNames={{
              triggerButton: `w-[14.16vw] rounded-md font-medium leading-[1.7vh] py-[1.5vh] px-[0.58vw]`,
              popover: `w-[14.16vw] ${organizationSize.length > 5 ? "h-[22vh] overflow-y-auto scrollbar-hide" : ""}`,
              listboxItem: "leading-[1.7vh] text-center",
            }}
            styles={{
              triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
              popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
              listboxItem: { fontSize: `${fontSize * 0.83}vw` },
              listbox: { borderColor: torusTheme["border"] }
            }}
            isDisabled={access != "edit"}
            arrowFill={torusTheme["text"]}
          />
        </div>
      </div>
    </div >
  );
};

export default ClientProfileInfo;