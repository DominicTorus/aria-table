import React, { useState } from "react";
import { Button, Separator } from "react-aria-components";
import {
  ArtifactPinIcon,
  ArtifactShareIcon,
  MoveToIcon,
  PostToMarketArrowIcon,
  PostToMarketIcon,
  RenameIcon,
  TrashIcon,
} from "../../../constants/svgApplications";
import ArtifactDisplayModal from "./artifactDisplayModel";
import { AxiosService } from "../../../../lib/utils/axiosService";
import { getCookie } from "../../../../lib/utils/cookiemgmt";
import { toast } from "react-toastify";
import TorusPopOver from "../../torusComponents/torusPopover";
import ArtifactSharingModal from "./shareArtifactModal";
import TorusToast from "../../torusComponents/torusToast";
import { useSelector } from "react-redux";
import { RootState } from "../../../../lib/Store/store";

interface contextMenuProps {
  artifactName: string;
  artifactType: string;
  catalog: string;
  artifactGrp: string;
  version: string;
  fabric: string;
  index: number;
  isLocked: any;
  close: () => void;
  setInput: React.Dispatch<
    React.SetStateAction<{ id: number | undefined; name: string }>
  >;
  setRefetchOnContextMenu: any;
  artifactDetails: any;
  isArtifactMoved: boolean;
  setIsArtifactMoved: boolean;
  setArtifactList: any;
  getArtifact: any;
}

const ArtifactContextMenu = ({
  artifactName,
  artifactGrp,
  catalog,
  isLocked,
  version,
  fabric,
  index,
  close,
  setInput,
  setRefetchOnContextMenu,
  artifactDetails,
  isArtifactMoved,
  setIsArtifactMoved,
  setArtifactList,
  getArtifact,
}: contextMenuProps) => {
  const [wordLength, setWordLength] = useState(0);
  const client = getCookie("tp_cc");
  const locale = useSelector((state: RootState) => state.main.locale);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleEdit = (e: any) => {
    setInput({ id: index, name: artifactName });
    close();
  };

  const handleDeleteArtifact = async () => {
    try {
      const response = await AxiosService.post("/api/deleteArtifact", {
        loginId: getCookie("tp_lid"),
        functionGroup: "AF",
        fabric,
        catalog,
        artifactGrp,
        artifactName,
        version,
        client,
      });

      if (response.status === 201) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: `Artifact deleted successfully`,
            closeButton: false,
          } as any
        );
        setRefetchOnContextMenu((prev: any) => !prev);
        close();
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
          "Can't delete the selected Artifact";
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

  const handlePinningOfArtifacts = async () => {
    try {
      const artifactKey = `CK:${client}:FNGK:AF:FNK:${fabric.toUpperCase()}:CATK:${catalog}:AFGK:${artifactGrp}:AFK:${artifactName}:AFVK:${version}:AFI`;
      const ApiLink = artifactDetails.isUserPinned
        ? "unPinArtifact"
        : "pinArtifact";
      const response = await AxiosService.post(
        // `/tp/${ApiLink}`
        `/api/${ApiLink}`,
        {
          artifactKey,
          loginId: getCookie("tp_lid"),
        }
      );
      if (response.status == 201) {
        setRefetchOnContextMenu((prev: any) => !prev);
        close();
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
          text: `Network error occured`,
          closeButton: false,
        } as any
      );
    }
  };

  return (
    <div style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"] }} className="w-[11vw] rounded-[0.42vw] P-[1vw]">
      <h2 style={{ fontSize: `${fontSize * 1.04}vw` }} className={`px-[1vw] py-[0.4vw]  leading-[2.22vh] font-medium`}>
        {artifactName.charAt(0).toUpperCase() + artifactName.slice(1)}
      </h2>
      <Separator style={{ borderColor: torusTheme["border"] }} orientation="horizontal" />
      <div className="flex flex-col justify-around px-[0.6vw] h-[6.25vw]">
        <Button
        style={{ fontSize: `${fontSize * 0.72}vw` }}
          onPress={handleEdit}
          className={"outline-none w-full flex gap-[0.5vw] items-center  hover:p-[0.2vw] rounded"}
          onHoverStart={(e) => e.target.style.backgroundColor = torusTheme["border"]}
          onHoverEnd={(e) => e.target.style.backgroundColor = ""}
        >
          <RenameIcon fill={torusTheme["text"]} /> {locale["Rename"]}
        </Button>
        <TorusPopOver
          parentHeading={
            <Button
            style={{ fontSize: `${fontSize * 0.72}vw` }}
              className={"outline-none w-full flex gap-[0.5vw] items-center  hover:p-[0.2vw] rounded"}
              onHoverStart={(e) => e.target.style.backgroundColor = torusTheme["border"]}
              onHoverEnd={(e) => e.target.style.backgroundColor = ""}
            >
              <ArtifactShareIcon fill={torusTheme["text"]} /> {locale["Share to"]}
            </Button>
          }
          dialogClassName={
            "fixed z-[100] top-0 left-0 w-screen h-screen bg-transparent/45 flex items-center justify-center"
          }
        >
          {({ close }: any) => (
            <ArtifactSharingModal
              close={close}
              artifactDetails={artifactDetails}
            />
          )}
        </TorusPopOver>

        <ArtifactDisplayModal
          fabric={fabric}
          sourceKeyPrefix={`CK:${client}:FNGK:AF:FNK:${fabric.toUpperCase()}:CATK:${catalog}:AFGK:${artifactGrp}:AFK:${artifactName}:AFVK:${version}`}
          version={version}
          artifactName={artifactName}
          closeParent={close}
          isArtifactMoved={isArtifactMoved}
          setIsArtifactMoved={false}
          setArtifactList={setArtifactList}
          getArtifact={getArtifact}
        />
      </div>
      <Separator style={{ borderColor: torusTheme["border"] }} orientation="horizontal" />
      <div className="flex flex-col px-[0.6vw] justify-around h-[6.25vw]">
        <Button
        style={{ fontSize: `${fontSize * 0.72}vw` }}
          className={"w-full outline-none flex gap-[0.5vw] items-center  hover:p-[0.2vw] rounded"}
          onHoverStart={(e) => e.target.style.backgroundColor = torusTheme["border"]}
          onHoverEnd={(e) => e.target.style.backgroundColor = ""}
          onPress={handlePinningOfArtifacts}
        >
          <ArtifactPinIcon fill={torusTheme["text"]} />{" "}
          {locale[artifactDetails?.isUserPinned ? "Unpin" : "Pin to Top"]}
        </Button>

        <Button
        style={{fontSize: `${fontSize * 0.72}vw`}}
          className={"w-full outline-none flex gap-[0.5vw] items-center justify-between hover:p-[0.2vw] rounded"}
          onHoverStart={(e) => e.target.style.backgroundColor = torusTheme["border"]}
          onHoverEnd={(e) => e.target.style.backgroundColor = ""}
        >
          <div className="flex gap-[0.5vw]">
            <PostToMarketIcon fill={torusTheme["text"]} /> {locale["Post to Market"]}
          </div>
          <PostToMarketArrowIcon fill={torusTheme["text"]} />
        </Button>
        <Button
        style={{ fontSize: `${fontSize * 0.72}vw` }}
          className={"w-full outline-none flex gap-[0.5vw] items-center  hover:p-[0.2vw] rounded"}
          onHoverStart={(e) => e.target.style.backgroundColor = torusTheme["border"]}
          onHoverEnd={(e) => e.target.style.backgroundColor = ""}
          onPress={handleDeleteArtifact}
        >
          <TrashIcon /> {locale["Move to Trash"]}
        </Button>
      </div>
    </div>
  );
};

export default ArtifactContextMenu;
