import React, { useState } from "react";
import { Button, FileTrigger, Input } from "react-aria-components";
import DropDown from "../multiDropdownnew";
import Image from "next/image";
import { FileGallery } from "../../constants/svgApplications";
import { AxiosService } from "../../../lib/utils/axiosService";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";
import ImagePreviewModal from "../../control-center/imagePreviewModal";

const Tenantselection = ({
  tenantProfileData,
  setTenantProfileData,
  tenantAccess,
}: {
  tenantProfileData: any;
  setTenantProfileData: any;
  tenantAccess: "view" | "edit" | null | undefined;
}) => {
  const [language, setLanguage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const languageOptions = ["English", "Spanish", "French"];
  const locale = useSelector((state: RootState) => state.main.locale);
  const [wordLength, setWordLength] = useState(0);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleProfileInputChange = (key: string, value: string) => {
    setTenantProfileData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleUploads = async (file: any, filename: string) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucketFolderame", "torus9x");
      data.append("folderPath", `tp/tenantasset/${tenant}`);

      if (tenantProfileData[filename]) {
        const deletionResponse = await AxiosService.delete(`/image/delete-asset`, {
          headers: {
            url: tenantProfileData[filename],
          },
        });
        if (deletionResponse.status == 200) {
          setTenantProfileData((prev: any) => ({ ...prev, [filename]: "" }))
        }
      }

      const res = await AxiosService.post("image/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          filename: file.name ? file.name.replace(/\.[^/.]+$/, "") : filename,
        },
      });

      if (res.status === 201) {
        const responseData = res.data.imageUrl;
        setFileUrl(responseData);
        handleProfileInputChange(filename, responseData);
      } else {
        throw new Error("File upload failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Error uploading file";
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `${message}`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleFileSelect = (file: FileList, type: string) => {
    if (file.length > 0 && type == "Logo") {
      setSelectedFile(file[0]);
      setIsPreviewModalOpen("Logo");
    } else if (file.length > 0 && type == "Favicon") {
      setSelectedFile(file[0]);
      setIsPreviewModalOpen("Favicon");
    }
  };

  const handlechange = () => {
    if (isPreviewModalOpen === "Logo") {
      document.getElementById("previewImagebtnLogofortenant")?.click();
      return
    } else if (isPreviewModalOpen === "Favicon") {
      document.getElementById("previewImagebtnFaviconfortenant")?.click();
      return
    }
    setIsPreviewModalOpen(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col">
        <h1
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}
          className=" leading-[1.04vw] font-semibold"
        >
          {locale["Tenant Profile"]}
        </h1>
        <p
          style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.83}vw` }}
          className=" leading-[1.04vw] mt-[0.29vw]"
        >
          {locale["Add your tenant related information here"]}
        </p>
      </div>
      <hr
        style={{ borderColor: torusTheme["borderLine"] }}
        className="my-[0.59vw] w-full"
      />

      <div className="flex flex-col w-[80.47vw] h-[67.87vh] gap-[0.29vw] items justify-between">
        <div className="flex flex-col gap-[3.5vh]">
          <div className="flex h-[19.16vh]">
            <div>
              <h2
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                className=" leading-[1.04vh] font-semibold mb-[0.58vw]"
              >
                {locale["Logo"]}
              </h2>
              <p
                style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.83}vw` }}
                className=" leading-[1.04vh] mb-[0.58vw]"
              >
                {locale["Upload the logo of the application"]}
              </p>
            </div>
            <div className="flex flex-col items-center ml-[10.54vw]">
              <div>
                {tenantProfileData?.Logo ? (
                  <Image
                    src={tenantProfileData?.Logo}
                    alt="Uploaded image"
                    className="w-[6vw] h-[6vw] object-cover rounded border"
                    width={100}
                    height={100}
                  />
                ) : (
                  <FileGallery
                    fill={torusTheme["text"]}
                    width="7.7vw"
                    height="9.62vh"
                  />
                )}
              </div>

              <div
                style={{ backgroundColor: torusTheme["bgCard"] }}
                className="flex flex-col mt-4 items-center rounded-md"
              >
                <FileTrigger
                  acceptedFileTypes={["image/png", "image/jpeg", "image/x-icon"]}
                  onSelect={(e) => {
                    e && handleFileSelect(e, "Logo");
                  }}
                >
                  <Button
                    id="previewImagebtnLogofortenant"
                    style={{
                      backgroundColor: torusTheme["bgCard"],
                      color: torusTheme["text"],
                      fontSize: `${fontSize * 0.83}vw`
                    }}
                    className=" leading-[1.25vh] px-[0.58vw] py-[0.58vw] outline-none rounded-md"
                    isDisabled={tenantAccess != "edit"}
                  >
                    {locale["Change Image"]}
                  </Button>
                </FileTrigger>
              </div>
            </div>
          </div>

          <hr
            style={{ borderColor: torusTheme["borderLine"] }}
            className="w-full"
          />
          <div className="flex justify-between ">
            <div>
              <h2
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                className="leading-[1.04vh] font-semibold mb-[0.58vw]"
              >
                {locale["Favicon"]}
              </h2>
              <p
                style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.83}vw` }}
                className=" leading-[1.04vh] mb-[0.58vw]"
              >
                {locale["Upload the favicon of the application"]}
              </p>
            </div>

            <div
              className="flex gap-3 items-center mr-auto ml-[9.37vw]"
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
            >
              <div className="flex flex-col items-center rounded-md">
                <div>
                  {tenantProfileData.Favicon ? (
                    <Image
                      src={tenantProfileData.Favicon}
                      alt={"Favicon"}
                      className="w-[3vw] h-[3vw] object-cover rounded border"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <FileGallery
                      fill={torusTheme["text"]}
                      width="3.17vw"
                      height="4.07vh"
                    />
                  )}
                </div>
              </div>
              <FileTrigger
                onSelect={(e) => {
                  e && handleFileSelect(e, "Favicon");
                }}
              >
                <div className="">
                  <Button
                    id="previewImagebtnFaviconfortenant"
                    style={{
                      backgroundColor: torusTheme["bgCard"],
                      color: torusTheme["text"],
                      fontSize: `${fontSize * 0.83}vw`
                    }}
                    className=" leading-[1.25vh] p-[0.58vw] outline-none rounded-md"
                    isDisabled={tenantAccess != "edit"}
                  >
                    {locale["Change Image"]}
                  </Button>
                </div>
              </FileTrigger>
            </div>

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

        <hr
          style={{ borderColor: torusTheme["borderLine"] }}
          className="w-full"
        />

        <div className="flex">
          <div className="flex flex-col">
            <h2
              style={{
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.72}vw`
              }}
              className=" leading-[1.04vh] font-semibold mb-[0.58vw]"
            >
              {locale["Company Name"]}
            </h2>
            <p
              style={{
                color: torusTheme["textOpacity/50"],
                fontSize: `${fontSize * 0.72}vw`
              }}
              className=" leading-[1.04vh] mb-[0.58vw]"
            >
              {locale["Fill in your company name"]}
            </p>
          </div>
          <Input
            className=" outline-none leading-[1.25vh] w-[14.16vw] h-[4.07vh] ml-[14.05vw] rounded-md pt-[0.58vw] p-[0.58vw]"
            style={{
              backgroundColor: torusTheme["bgCard"],
              color: torusTheme["text"],

              fontSize: `${fontSize * 0.83}vw`
            }}
            type="text"
            placeholder="Enter your company name"
            value={tenantProfileData?.Name ?? ""}
            onChange={(e) => handleProfileInputChange("Name", e.target.value)}
            disabled={tenantAccess != "edit"}
          />
          {/* <Input
            className="text-[0.83vw] outline-none leading-[1.25vh] bg-[#F4F5FA] w-[14.16vw] h-[4.07vh] ml-[14.05vw] rounded-md pt-[0.58vw] p-[0.58vw]"
            type="text"
            placeholder="Enter your company code"
            maxLength={4}
            value={tenantProfileData?.Code ?? ""}
            onChange={(e) => handleProfileInputChange("Code", e.target.value)}
            readOnly
          /> */}
        </div>
        <hr
          style={{ borderColor: torusTheme["borderLine"] }}
          className="w-full"
        />

        <div className="flex flex-col invisible">
          <div className="flex items-center">
            <h2
              style={{
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.72}vw`
              }}
              className=" leading-[1.04vh] font-semibold mb-[0.58vw]"
            >
              {locale["Language"]}
            </h2>
            <div className="ml-[19vw] ">
              <DropDown
                triggerButton="English"
                selectedKeys={tenantProfileData?.language ?? language}
                setSelectedKeys={(event) =>
                  handleProfileInputChange("language", event)
                }
                items={languageOptions}
                classNames={{
                  triggerButton: ` w-[14.16vw] h-[4.07vh]  leading-[2.22vh] font-medium`,
                  popover: `w-[14.16vw] rounded-lg `,
                  listbox: `overflow-y-auto `,
                  listboxItem:
                    "flex leading-[2.22vh] justify-between",
                }}
                styles={{
                  triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
                  popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
                  listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                  listbox: { borderColor: torusTheme["border"] },
                }}
                isDisabled={tenantAccess != "edit"}
                arrowFill={torusTheme["text"]}
              />
            </div>
          </div>
          <p
            style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}
            className=" leading-[1.04vh] mb-[0.58vw]"
          >
            {locale["Set the language of the application"]}
          </p>
        </div>
        <hr
          style={{ borderColor: torusTheme["borderLine"] }}
          className="w-full invisible"
        />
      </div>
    </div>
  );
};

export default Tenantselection;
