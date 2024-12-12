import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import {
  DeleteIcon,
  DownArrow,
  PlusIcon,
  SixDotsSvg,
  UpArrow,
} from "../../constants/svgApplications";
import { Button, Input } from "react-aria-components";
import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import { orpMatrixTemplate } from "../../constants/MenuItemTree";
import { findPath, hexWithOpacity } from "../../../lib/utils/utility";

type ProductService = {
  psCode: string;
  psName: string;
};

type ProductServiceGroup = {
  psGrpCode: string;
  psGrpName: string;
  ps: ProductService[];
};

type Role = {
  roleCode: string;
  roleName: string;
  psGrp: ProductServiceGroup[];
};

type RoleGroup = {
  roleGrpName: string;
  roleGrpCode: string;
  roles: Role[];
};

type Organization = {
  orgCode: string;
  orgName: string;
  roleGrp: RoleGroup[];
};

type OrganizationGroup = {
  orgGrpName: string;
  orgGrpCode: string;
  org: Organization[];
};

interface OrgMatrixProps {
  data: OrganizationGroup[];
  setData: React.Dispatch<React.SetStateAction<OrganizationGroup[]>>;
  focusedPath: null | string;
  setFocusedPath: React.Dispatch<React.SetStateAction<null | string>>;
}

interface OrgMatrixType {
  isInput: null | string;
  setIsInput: React.Dispatch<React.SetStateAction<null | string>>;
  focusedPath: null | string;
  setFocusedPath: React.Dispatch<React.SetStateAction<null | string>>;
  updateData: (path: string, value: any) => void;
  deleteItems: (path: string, isCalledfromNav?: boolean) => void;
  getDataFromSrcObj: (path: string) => any;
}

export const OrgMatrixContext = React.createContext<OrgMatrixType | null>(null);

const RenderMembers = ({
  code,
  name,
  keyOfName,
  expanded,
  setExpanded,
  path,
  chilldArrayKeyName,
  parentCode,
}: {
  code: string;
  name: string;
  keyOfName: string;
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  path: string;
  chilldArrayKeyName?: string;
  parentCode: string;
}) => {
  const {
    testTheme: torusTheme,
    fontSize,
    accentColor,
  } = useSelector((state: RootState) => state.main);
  const {
    isInput,
    setIsInput,
    focusedPath,
    setFocusedPath,
    updateData,
    deleteItems,
    getDataFromSrcObj,
  } = React.useContext(OrgMatrixContext) as OrgMatrixType;

  const updatedParentCode = parentCode ? `${parentCode}-` : "";
  const isFocused = focusedPath == `${path}.${chilldArrayKeyName}`;

  const transformObj = (
    obj: Record<string, any>,
    oldParentCode: string,
    newParentCode: string
  ): Record<string, any> => {
    const newObj: Record<string, any> = {};

    for (const key in obj) {
      if (typeof obj[key] === "string") {
        // Replace the string values containing oldParentCode with newParentCode
        newObj[key] = obj[key].replace(oldParentCode, newParentCode);
      } else if (Array.isArray(obj[key])) {
        // If the value is an array, map over it and transform each element
        newObj[key] = obj[key].map((item: any) =>
          transformObj(item, oldParentCode, newParentCode)
        );
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        // If the value is an object, recursively transform it
        newObj[key] = transformObj(obj[key], oldParentCode, newParentCode);
      } else {
        // For other data types, copy as is
        newObj[key] = obj[key];
      }
    }

    return newObj;
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const pathOfSrcNode = e.dataTransfer.getData("pathOfSrcNode");
    const parentCodeOfSrcNode = e.dataTransfer.getData("parentCodeOfSrcNode");
    const pathOfTargetNode = `${path}.${chilldArrayKeyName}`;
    const parentPathOfSrcNode = pathOfSrcNode.split(".").slice(0, -1).join(".");
    const indexToModify = parseInt(
      pathOfSrcNode.split(".")[pathOfSrcNode.split(".").length - 1]
    );

    const lengthOfPathOfSrcNode = pathOfSrcNode.split(".").length;
    const lengthOfPathOfTargetNode = pathOfTargetNode.split(".").length;

    if (lengthOfPathOfSrcNode !== lengthOfPathOfTargetNode + 1 || !code) {
      return alert("Cannot drop here");
    }

    const dataToBeMoved = getDataFromSrcObj(pathOfSrcNode);
    const destinationData = getDataFromSrcObj(pathOfTargetNode);
    const parentOfSrcNode = getDataFromSrcObj(parentPathOfSrcNode);

    const convertedSrcObj = transformObj(dataToBeMoved, parentCodeOfSrcNode, `${code}-`);

    parentOfSrcNode.splice(indexToModify, 1);
    destinationData.push(convertedSrcObj);

    updateData(pathOfTargetNode, destinationData);
    updateData(parentPathOfSrcNode, parentOfSrcNode);
  };

  return (
    <div
      draggable
      className={`flex w-full p-[0.58vw] mr-1 items-center border rounded flex-[0_0_23%] group relative cursor-pointer`}
      style={{
        backgroundColor:
          keyOfName == "orgName" ? "transparent" : torusTheme["bgCard"],
        color: torusTheme["text"],
        width: `${keyOfName === "orgName" ? "18vw" : keyOfName === "roleGrpName" ? "17vw" :
          keyOfName === "roleName" ? "16.5vw" : keyOfName === "psGrpName" ? "16vw" : "15.5vw"}`,
        borderColor:
          isFocused
            ? accentColor
            : keyOfName == "orgName"
              ? "transparent"
              : torusTheme["border"],
        margin: expanded && keyOfName === "orgName" ? "0.3vw 0.3vw 0.6vw" : "0.2vw 0.2vw 0.3vw 0.2vw"
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragStart={(e) => {
        e.dataTransfer.setData("pathOfSrcNode", `${path}`);
        e.dataTransfer.setData("parentCodeOfSrcNode", updatedParentCode);
      }}
      onDrop={(e) => {
        handleDrop(e);
      }}
      onClick={() =>
        keyOfName != "psName" && setFocusedPath(`${path}.${chilldArrayKeyName}`)
      }
    >
      <SixDotsSvg fill={torusTheme["text"]} />
      {
        <span
          className="leading-[2.22vh] flex flex-col"
          style={{ fontSize: `${fontSize * 0.83}vw` }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsInput(`${path}.${keyOfName}`);
          }}
        >
          {isInput == `${path}.${keyOfName}` || !name ? (
            <Input
              className={`outline-none bg-transparent`}
              defaultValue={name}
              placeholder={`Enter ${keyOfName} here`}
              onBlur={(e) => updateData(`${path}.${keyOfName}`, e.target.value)}
              onKeyDown={(e: any) =>
                e.key === "Enter"
                  ? updateData(`${path}.${keyOfName}`, e.target.value)
                  : null
              }
            />
          ) : (
            <span>{name}</span>
          )}
          {code.replace(updatedParentCode, "") ? (
            <span className="text-[0.63vw]">
              {code.replace(updatedParentCode, "")}
            </span>
          ) : (
            <Input
              className={`outline-none bg-transparent`}
              defaultValue={code.replace(updatedParentCode, "")}
              placeholder={`Enter ${keyOfName.replace("Name", "Code")} here`}
              onBlur={(e) =>
                updateData(
                  `${path}.${keyOfName.replace("Name", "Code")}`,
                  `${updatedParentCode}${e.target.value}`
                )
              }
              onKeyDown={(e: any) =>
                e.key === "Enter"
                  ? updateData(
                    `${path}.${keyOfName.replace("Name", "Code")}`,
                    `${updatedParentCode}${e.target.value}`
                  )
                  : null
              }
            />
          )}
        </span>
      }
      <Button
        onPress={() =>
          deleteItems(path, keyOfName == "orgGrpName" ? true : undefined)
        }
        className="ml-auto mr-[0.58vw] focus:outline-none h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <DeleteIcon fill="#EF4444" />
      </Button>
      {setExpanded && (
        <Button
          className="p-[0.58vw] transition-all duration-300 ease-in-out focus:outline-none"
          onPress={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <UpArrow fill={torusTheme["text"]} />
          ) : (
            <DownArrow fill={torusTheme["text"]} />
          )}
        </Button>
      )}
    </div>
  );
};

const RenderPSGrp = ({
  psGrpCode,
  psGrpName,
  ps,
  path,
  parentCode,
}: ProductServiceGroup & { path: string; parentCode: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <RenderMembers
        code={psGrpCode}
        name={psGrpName}
        keyOfName="psGrpName"
        expanded={expanded}
        setExpanded={setExpanded}
        path={path}
        chilldArrayKeyName="ps"
        parentCode={parentCode}
      />
      <AnimatePresence>
        <div className="ml-2">
          {expanded
            ? ps.map(({ psCode, psName }: any, index) => (
              <RenderMembers
                code={psCode}
                name={psName}
                keyOfName="psName"
                key={index}
                parentCode={psGrpCode}
                path={`${path}.ps.${index}`}
              />
            ))
            : null}
        </div>
      </AnimatePresence>
    </div>
  );
};

const RenderRole = ({
  psGrp,
  roleCode,
  roleName,
  path,
  parentCode,
}: Role & { path: string; parentCode: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <RenderMembers
        code={roleCode}
        name={roleName}
        keyOfName="roleName"
        expanded={expanded}
        setExpanded={setExpanded}
        path={path}
        chilldArrayKeyName="psGrp"
        parentCode={parentCode}
      />
      <AnimatePresence>
        <div className="ml-2 flex flex-col gap-[1vh]">
          {expanded
            ? psGrp.map((psG: any, index: number) => (
              <RenderPSGrp
                ps={psG.ps}
                psGrpCode={psG.psGrpCode}
                psGrpName={psG.psGrpName}
                path={`${path}.psGrp.${index}`}
                parentCode={roleCode}
                key={index}
              />
            ))
            : null}
        </div>
      </AnimatePresence>
    </div>
  );
};

const RenderRoleGroup = ({
  roleGrpCode,
  roleGrpName,
  roles,
  path,
  parentCode,
}: RoleGroup & { path: string; parentCode: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <RenderMembers
        code={roleGrpCode}
        name={roleGrpName}
        keyOfName="roleGrpName"
        expanded={expanded}
        setExpanded={setExpanded}
        path={path}
        chilldArrayKeyName="roles"
        parentCode={parentCode}
      />
      <AnimatePresence>
        <div className="ml-2 flex flex-col gap-[1vh]">
          {expanded
            ? roles.map((role: any, index: number) => (
              <RenderRole
                psGrp={role.psGrp}
                roleCode={role.roleCode}
                roleName={role.roleName}
                path={`${path}.roles.${index}`}
                parentCode={roleGrpCode}
                key={index}
              />
            ))
            : null}
        </div>
      </AnimatePresence>
    </div>
  );
};

const RenderOrg = ({
  orgCode,
  orgName,
  roleGrp,
  path,
  parentCode,
}: Organization & { path: string; parentCode: string }) => {
  const { testTheme: torusTheme, fontSize } = useSelector(
    (state: RootState) => state.main
  );
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        color: torusTheme["text"],
        borderColor: torusTheme["border"],
      }}
      className="flex justify-end"
    >
      <div style={{ borderColor: torusTheme["border"] }} className="pb-2 border rounded cursor-pointer">
        <RenderMembers
          code={orgCode}
          name={orgName}
          keyOfName="orgName"
          path={path}
          expanded={expanded}
          setExpanded={setExpanded}
          chilldArrayKeyName="roleGrp"
          parentCode={parentCode}
        />
        <AnimatePresence>
          <div className="flex flex-col gap-[1vh] ml-2">
            {expanded
              ? roleGrp.map((rGrp: any, index: number) => (
                <RenderRoleGroup
                  roleGrpCode={rGrp.roleGrpCode}
                  roleGrpName={rGrp.roleGrpName}
                  roles={rGrp.roles}
                  path={`${path}.roleGrp.${index}`}
                  parentCode={orgCode}
                  key={index}
                />
              ))
              : null}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const OrgMatrix = ({ data, setData, focusedPath, setFocusedPath }: OrgMatrixProps) => {
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const {
    testTheme: torusTheme,
    locale,
    fontSize,
    accentColor,
  } = useSelector((state: RootState) => state.main);
  const [isInput, setIsInput] = useState<string | null>(null);

  const updateOrgMatrixData = (path: string, value: any) => {
    const copyOfOrgMatrixData = structuredClone(data);
    if (path) {
      _.set(copyOfOrgMatrixData, path, value);
      setData(copyOfOrgMatrixData);
    }
  };

  const deleteItems = (path: string, isCalledfromNav?: boolean) => {
    const copyOfOrgMatrixData = structuredClone(data);
    if (isCalledfromNav) {
      const indexToDelete = parseInt(path);
      copyOfOrgMatrixData.splice(indexToDelete, 1);
      setData(copyOfOrgMatrixData);
    } else {
      const parentPath = path.split(".").slice(0, -1).join(".");
      const indexToDelete = parseInt(
        path.split(".")[path.split(".").length - 1]
      );
      const parentData: any = _.get(copyOfOrgMatrixData, parentPath);
      parentData.splice(indexToDelete, 1);
      updateOrgMatrixData(parentPath, parentData);
    }
  };

  const addTopLevelOrganization = () => {
    if (findPath(data, orpMatrixTemplate[0])) {
      alert("already group created");
    } else {
      setData((prev) => [...prev, orpMatrixTemplate[0]]);
    }
  };

  const handleAddValue = () => {
    if (focusedPath) {
      const pathInTemplate = focusedPath
        ?.split(".") // Split by dot
        .map((segment) => (isNaN(Number(segment)) ? segment : "0")) // Replace numbers with "0"
        .join(".");
      const dataToAdd = _.get(orpMatrixTemplate, `${pathInTemplate}.0`);
      const focusedData = _.get(data, focusedPath);
      if (
        focusedData &&
        Array.isArray(focusedData) &&
        !findPath(focusedData, dataToAdd)
      ) {
        focusedData.push(dataToAdd);
        updateOrgMatrixData(focusedPath, focusedData);
      } else {
        alert("already member created");
      }
    }
  };

  const getDataFromSrcObj = (path: string) => {
    if (path) {
      return _.get(data, path);
    }
  };

  const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    target.scrollLeft = source.scrollLeft;
  };

  useEffect(() => {
    const headerSection = headerSectionRef.current;
    const contentSection = contentSectionRef.current;

    if (headerSection && contentSection) {
      const handleHeaderScroll = () =>
        syncScroll(headerSection, contentSection);
      const handleContentScroll = () =>
        syncScroll(contentSection, headerSection);

      headerSection.addEventListener("scroll", handleHeaderScroll);
      contentSection.addEventListener("scroll", handleContentScroll);

      return () => {
        headerSection.removeEventListener("scroll", handleHeaderScroll);
        contentSection.removeEventListener("scroll", handleContentScroll);
      };
    }
  }, []);

  return (
    <OrgMatrixContext.Provider
      value={{
        isInput,
        setIsInput,
        focusedPath,
        setFocusedPath,
        updateData: updateOrgMatrixData,
        deleteItems,
        getDataFromSrcObj,
      }}
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col ">
          <h1
            style={{
              color: torusTheme["text"],
              fontSize: `${fontSize * 1.25}vw`,
            }}
            className=" leading-[1.04vw] font-semibold"
          >
            {locale["Organization Matrix"]}
          </h1>
          <p
            style={{
              color: torusTheme["textOpacity/50"],
              fontSize: `${fontSize * 0.83}vw`,
            }}
            className=" leading-[1.04vw] mt-[0.29vw]"
          >
            {locale["Add your tenant related information here"]}
          </p>
        </div>
        <Button
          id="orpsAdditionBtnWithFocus"
          className={`hidden`}
          onPress={handleAddValue}
        >
          <PlusIcon fill="white" width={"1.04vw"} height={"1.04vw"} />
        </Button>
      </div>
      <div className="flex justify-between items-center rounded-xl px-3"
        style={{
          backgroundColor: torusTheme["bgCard"],
          color: torusTheme["text"],
          borderColor: torusTheme["border"],
        }}
      >
        <div
          ref={headerSectionRef}
          className="flex w-full p-[0.29vw] overflow-x-auto gap-[0.88vw] scrollbar-hide"
        >
          {data.map((node: any, id: number) => (
            <RenderMembers
              code={node.orgGrpCode}
              name={node.orgGrpName}
              keyOfName="orgGrpName"
              path={`${id}`}
              chilldArrayKeyName="org"
              key={id}
              parentCode=""
            />
          ))}
        </div>
        <Button
          className="flex focus:outline-none px-[0.58vw] py-[1vh] mr-[0.29vw] items-center rounded"
          onPress={addTopLevelOrganization}
          style={{
            borderColor: torusTheme["border"],
            backgroundColor: accentColor,
          }}
        >
          <PlusIcon fill="white" />
        </Button>
      </div>
      <div
        ref={contentSectionRef}
        className="mt-2 flex h-[80%] w-[95%] overflow-x-auto scrollbar-thin"
      >
        {data.map((node: any, id: number) => (
          <div className="flex flex-col gap-[1vh] flex-[0_0_24.5%]" key={id}>
            {node.org.map((org: any, index: number) => {
              return (
                <RenderOrg
                  key={index}
                  orgCode={org.orgCode}
                  orgName={org.orgName}
                  roleGrp={org.roleGrp}
                  path={`${id}.org.${index}`}
                  parentCode={node.orgGrpCode}
                />
              );
            })}
          </div>
        ))}
      </div>
    </OrgMatrixContext.Provider>
  );
};

export default OrgMatrix;
