import React, { useState, useRef, ChangeEvent } from "react";
import { Button, Input } from "react-aria-components";
import { DownArrow, SearchIcon } from "../constants/svgApplications";
import useClickOutside from "../../lib/utils/useClickOutsideRef";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";

const CustomGrpMemberDropdown = ({
  data,
  groupKey,
  memberKey,
  memberCodeKey,
  memberNameKey,
  groupCodeKey,
  groupNameKey,
  selected,
  setSelected,
  isDisabled = false,
  parentKey = null,
}: any) => {
  const [isOpen, setOpen] = useState(false);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const customDropDownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  useClickOutside(customDropDownRef, () => setOpen(false));
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const filteredData = Object.entries(data)
    .filter(([key, value]) => {
      const hasNonEmptyValue: any = (val: any) => {
        if (typeof val === "string") {
          return (
            val.trim() !== "" &&
            val.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else if (Array.isArray(val)) {
          return val.some((role) => {
            return Object.values(role).some((v) => {
              return (
                typeof v === "string" &&
                v.trim() !== "" &&
                v.toLowerCase().includes(searchTerm.toLowerCase())
              );
            });
          });
        }
        return Object.values(val).some((v) => {
          return hasNonEmptyValue(v);
        });
      };

      if (typeof value === "string") {
        return (
          value.trim() !== "" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (Array.isArray(value)) {
        return value.some((role) => {
          return Object.values(role).some((val) => {
            return (
              typeof val === "string" &&
              val.trim() !== "" &&
              val.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
        });
      } else {
        return Object.values(value as any).some((val) => hasNonEmptyValue(val));
      }
    })
    .map(([key, value]: any) => ({ ...value, originalIndex: key }));

  const handleSelectGrp = (grp: any) => {
    if (
      selected.some((item: any) => item[groupCodeKey] === grp[groupCodeKey])
    ) {
      setSelected(
        selected.filter((item: any) => item[groupCodeKey] !== grp[groupCodeKey])
      );
    } else {
      setSelected([...selected, grp]);
    }
  };

  const handleSelectMember = (
    grpCode: any,
    member: any,
    isGrpSelected: boolean
  ) => {
    const copyOfSelected = structuredClone(selected);
    if (isGrpSelected) {
      const indexOfSelectedGrp = copyOfSelected.findIndex(
        (grp: any) => grp[groupCodeKey] === grpCode
      );
      const indexOfMemberToBeRemoved = copyOfSelected[indexOfSelectedGrp][
        memberKey
      ].findIndex(
        (memberItem: any) => memberItem[memberCodeKey] === member[memberCodeKey]
      );
      if (copyOfSelected[indexOfSelectedGrp][memberKey].length === 1) {
        copyOfSelected.splice(indexOfSelectedGrp, 1);
      } else {
        copyOfSelected[indexOfSelectedGrp][memberKey].splice(
          indexOfMemberToBeRemoved,
          1
        );
      }
    } else {
      const existingIndexOfGrp = copyOfSelected.findIndex(
        (grp: any) => grp[groupCodeKey] === grpCode
      );
      if (existingIndexOfGrp != -1) {
        const existingMemberInGrpIndex = copyOfSelected[existingIndexOfGrp][
          memberKey
        ].findIndex((m: any) => m[memberCodeKey] === member[memberCodeKey]);
        if (existingMemberInGrpIndex != -1) {
          if (copyOfSelected[existingIndexOfGrp][memberKey].length === 1) {
            copyOfSelected.splice(existingIndexOfGrp, 1);
          } else {
            copyOfSelected[existingIndexOfGrp][memberKey].splice(
              existingMemberInGrpIndex,
              1
            );
          }
        } else {
          copyOfSelected[existingIndexOfGrp][memberKey].push(member);
        }
      } else {
        const grpData = data.find((grp: any) => grp[groupCodeKey] === grpCode);
        const memberData = grpData[memberKey].find(
          (m: any) => m[memberCodeKey] === member[memberCodeKey]
        );
        copyOfSelected.push({ ...grpData, [memberKey]: [memberData] });
      }
    }
    setSelected(copyOfSelected);
    // setOpen(false);
  };

  const handleParentHierarchy = (grp: any) => {
    if (parentKey) {
      return <span style={{ color: accentColor, fontSize: `${fontSize * 0.62}vw` }}>{grp[parentKey]}</span>;
    }
  };

  const handleMouseDown = () => {
    if (searchInputRef.current) {
      (searchInputRef.current as any).focus();
    }
  };

  return (
    <div className="relative m-2" ref={customDropDownRef}>
      <Button
        style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] }}
        className={`p-2 outline-none ${groupKey == "orgGrp" ? "w-[13.33vw]" : groupKey == "roleGrp" ? "w-[10.52vw]" : groupKey == "psGrp" ? "w-[12.18vw]" : "w-[40vw]"} flex justify-between items-center rounded disabled:bg-[${torusTheme["border"]}]`}
        onPress={() => setOpen(!isOpen)}
        isDisabled={isDisabled}
      >
        <span>Select {groupKey}</span>
        <span>
          <DownArrow fill={torusTheme["text"]} />
        </span>
      </Button>
      {isOpen && (
        <div
          style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"] }}
          className={` flex flex-col gap-1 absolute mt-[0.5vw] z-20 ${filteredData.length > 2 ? "h-[20.83vh] overflow-y-auto" : ""} ${groupKey == "orgGrp" ? "w-[13.33vw]" : groupKey == "roleGrp" ? "w-[10.52vw]" : groupKey == "psGrp" ? "w-[12.18vw]" : ""} p-[0.5vw] rounded border`}
        >
          <div
            className="relative items-center h-[4vh]"
            onClick={handleMouseDown}
          >
            <span className="absolute inset-y-0 left-0 flex p-[0.58vw] h-[2.18vw] w-[2.18vw] ">
              <SearchIcon fill={torusTheme["text"]} height="0.83vw" width="0.83vw" />
            </span>
            <Input
              autoFocus
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              onFocus={(e) => (e.target.style.borderColor = accentColor)}
              onBlur={(e) => (e.target.style.borderColor = "")}
              style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
              className={`${groupKey == "orgGrp" ? "w-[12.33vw]" : groupKey == "roleGrp" ? "w-[9.52vw]" : groupKey == "psGrp" ? "w-[11.18vw]" : ""} p-[0.29vw] h-[4vh] focus:outline-none border pl-[1.76vw] font-medium rounded-md`}
            />
          </div>
          {Array.isArray(filteredData) &&
            filteredData.map((grp: any, index: number) => {
              const isParentSelected = selected.some(
                (item: any) => JSON.stringify(item) === JSON.stringify(grp)
              );

              return (
                <div className="flex flex-col gap-1" key={index}>
                  <Button
                    className="flex gap-[0.5vw] items-center outline-none"
                    key={grp[groupCodeKey]}
                    onPress={() => handleSelectGrp(grp)}
                  >
                    <input
                      className="w-[0.72vw] h-[0.72vw]"
                      type="checkbox"
                      style={{ accentColor }}
                      checked={isParentSelected}
                      readOnly
                    />
                    <span>{grp[groupNameKey]}</span>
                    <span className="w-full text-end">{handleParentHierarchy(grp)}</span>
                  </Button>
                  <div className="flex flex-col gap-1 ml-[1.5vw]">
                    {grp[memberKey].map((member: any, memberIndex: number) => {
                      const existingGrp = selected.find(
                        (grpdata: any) =>
                          grpdata[groupCodeKey] === grp[groupCodeKey]
                      );
                      const isMemberSelected = existingGrp
                        ? existingGrp[memberKey].some(
                          (item: any) =>
                            item[memberCodeKey] === member[memberCodeKey]
                        )
                        : false;

                      return (
                        <Button
                          key={memberIndex}
                          className={`flex gap-1 items-center outline-none`}
                          onPress={() =>
                            handleSelectMember(
                              grp[groupCodeKey],
                              member,
                              isParentSelected
                            )
                          }
                          aria-label={member[memberCodeKey]}
                        >
                          <input
                            className="w-[0.72vw] h-[0.72vw]"
                            type="checkbox"
                            style={{ accentColor }}
                            checked={isMemberSelected}
                            readOnly
                          />
                          <span>{member[memberNameKey]}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CustomGrpMemberDropdown;
