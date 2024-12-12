"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Label } from "react-aria-components";
import { AxiosService } from "../../lib/utils/axiosService";
import { toast } from "react-toastify";
import TorusToast from "../components/torusComponents/torusToast";
import { getCookie } from "../../lib/utils/cookiemgmt";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";
import { Multiply } from "../constants/svgApplications";
import _ from "lodash";

interface ApplicationModalProps {
  parentPath: string;
  handleUpdateData: (content: any, path: string) => void;
  data: any;
  close: () => void;
}

const ApplicationModal = ({
  parentPath,
  handleUpdateData,
  data,
  close,
}: ApplicationModalProps) => {
  const [tenantEnvData, setTenantEnvdata] = useState([]);
  const [wordLength, setWordLength] = useState(0);
  const client = getCookie("tp_cc");
  const tenant = useSelector((state: RootState) => state.main.tenant);
  const [appData, setAppData] = useState<Record<string, string>>({});
  const accentColor = useSelector((state: RootState) => state.main.accentColor)
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const getTenantEnv = async (client: string) => {
    try {
      const res = await AxiosService.get(
        `/api/getTenantEnv?code=${client}`
      );
      if (res.status === 200) {
        // Should be deleted when tenant dynamically passed just temporary thing
        const foundTenantEnv = res.data.find(
          (tenantEnv: any) => tenantEnv.Code == "ABC"
        );
        if (foundTenantEnv) setTenantEnvdata(foundTenantEnv.ENV);
        // Should be deleted when tenant dynamically passed

        if (tenant) {
          const foundTenantEnv = res.data.find(
            (tenantEnv: any) => tenantEnv.Code == tenant
          );
          if (foundTenantEnv) setTenantEnvdata(foundTenantEnv.ENV);
        }
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ? error?.response?.data?.errorDetails :
          "Error Occured While Saving Tenant Info";
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

  useEffect(() => {
    if (client) {
      getTenantEnv(client);
    }
    if(_.get(data, parentPath)) {
      setAppData(_.get(data, parentPath));
    }
  }, []);

  const handleChangeApp = (e: any) => {
    const { name, value } = e.target;
    if (name == "appPath") {
      setAppData((prev) => ({
        ...prev,
        [name]: value,
        generatedUrl: `http://${appData.HostIP}:${appData.volumePath}`,
      }));
    } else {
      setAppData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectEnv = (env: any) => {
    Object.entries(env).forEach(([name, value]) => {
      if (typeof value == "string") {
        if (name == "code") {
          handleChangeApp({ target: { name: "env", value } });
        } else {
          handleChangeApp({ target: { name, value } });
        }
      }
    });
  };

  const handleSave = () => {
    try {
      if (Object.keys(appData).length < 2 || !appData.name || !appData.code) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "warning",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Warning",
            text: `Please fill all the application details to continue`,
            closeButton: false,
          } as any
        );
        return;
      }
      handleUpdateData(appData, parentPath);
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`border rounded-lg flex flex-col items-center p-5 w-[44.73vw]`}>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="leading-[1.04vw] font-semibold"
            style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}>
            {locale["Add App"]}
          </h2>
          <div className="cursor-pointer" onClick={close}>
            <Multiply width="1vw" height="1vw" fill={torusTheme["text"]} />
          </div>
        </div>
      </div>

      <hr className="w-full my-4"
        style={{ borderColor: torusTheme["border"] }} />
      <div className=" w-full">
        <div className="">
          <div className="flex flex-col p-3 gap-5">
            <div className="flex gap-5 items-center">
              <div className="flex flex-col gap-2">
                <Label className="leading-[1.04vh] font-semibold"
                  style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                  {locale["App Name"]}*
                </Label>
                <p className="leading-[1.04vh]"
                  style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                  {locale["Set the name of the application"]}
                </p>
              </div>
              <Input
                type="text"
                placeholder={locale["Enter App Name"]}
                name="name"
                value={appData?.name}
                onChange={handleChangeApp}
                onFocus={(e) => (e.target.style.borderColor = accentColor)}
                onBlur={(e) => (e.target.style.borderColor = "")}
                className={`border ml-auto w-[16vw] leading-[1.04vh] p-[0.58vw]  rounded-lg focus:outline-none`}
                style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw`, }}


              />
            </div>

            <div className="flex gap-5 items-center">
              <div className="flex flex-col gap-2">
                <Label className="leading-[1.04vh] font-semibold"
                  style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                  {locale["App Code"]}*
                </Label>
                <p className="leading-[1.04vh]"
                  style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                  {locale["Set the code of the application"]}
                </p>
              </div>
              <Input
                type="text"
                placeholder={locale["Enter App Code"]}
                name="code"
                value={appData?.code}
                onChange={handleChangeApp}
                onFocus={(e) => (e.target.style.borderColor = accentColor)}
                onBlur={(e) => (e.target.style.borderColor = "")}
                className={`border ml-auto w-[16vw] leading-[1.04vh] p-[0.58vw]  rounded-lg focus:outline-none`}
                style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
              />
            </div>
            {appData?.env ? (
              <div className="flex gap-5 items-center">
                <div className="flex flex-col gap-2">
                  <Label className="leading-[1.04vh]  font-semibold"
                    style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}>
                    {locale["Path Name"]}*
                  </Label>
                  <p className="leading-[1.04vh]"
                    style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.72}vw` }}>
                    {locale["Set the pathname of the application"]}
                  </p>
                </div>
                <Input
                  type="text"
                  placeholder={locale["Enter Application pathname"]}
                  name="appPath"
                  value={appData?.appPath}
                  onChange={handleChangeApp}
                  onFocus={(e) => (e.target.style.borderColor = accentColor)}
                  onBlur={(e) => (e.target.style.borderColor = "")}
                  className="border ml-auto w-[16vw] leading-[1.04vh] p-[0.58vw] rounded-lg focus:outline-none"
                  style={{ backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.72}vw`, }}
                />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-[1vw] h-[30vh] overflow-y-auto">
            {tenantEnvData.map((env: any, index) => {
              const isSelected = env.code == appData?.env;
              return (
                <div
                  key={index}
                  style={{ borderColor: isSelected ? accentColor : "", backgroundColor: torusTheme["bg"], color: torusTheme["text"] }}
                  className={`flex flex-col gap-[1.87vh] border w-[13.17vw] h-[11.9vh] p-3  rounded-md shadow hover:shadow-md border-b`}
                  onClick={() => handleSelectEnv(env)}
                >
                  <div className="flex flex-col ml-1 gap-[0.62vh]">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold leading-[1.04vh]"
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}>
                        {env.code}
                      </h3>
                      {isSelected &&
                        <input type="checkbox" className="w-[0.62vw]" style={{ accentColor }} readOnly checked />
                      }
                    </div>
                    <p className="font-medium leading-[0.72vh] "
                      style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.62}vw` }}>
                      {env.HostName}
                    </p>
                  </div>
                  <div className="flex gap-5 ml-1">
                    <div className="mt-2">
                      <p className="leading-[0.62vh]"
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.52}vw` }}>
                        {locale["Host IP"]}:
                      </p>
                      <h3 className="leading-[0.72vh] font-medium mt-[1vh]"
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }}>
                        {env.HostIP}
                      </h3>
                    </div>
                    <div className="mt-2">
                      <p className="leading-[0.62vh]"
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.52}vw` }}>
                        {locale["Volume Path"]}:
                      </p>
                      <h4 className="leading-[0.72vh] font-medium mt-[1vh]"
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }}>
                        {env.volumePath}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="w-full mt-[2vh]"
          style={{ borderColor: torusTheme["border"] }} />

        <div className="w-full flex gap-2 justify-end pt-[3vh]">
          <Button
            className="px-4 py-2 leading-[1.25vh] rounded-md outline-none"
            style={{ color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw`, }}
            onPress={close}
          >
            {locale["Cancel"]}
          </Button>
          <Button
            style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.83}vw`, }}
            className="px-4 py-[0.58vw] text-white leading-[1.25vh] rounded-lg outline-none"
            onPress={handleSave}
          >
            {locale["Save"]}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;