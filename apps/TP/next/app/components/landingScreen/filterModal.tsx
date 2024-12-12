"use client";
import React, { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { CloseIcon, FilterIcon } from "../../constants/svgApplications";
import FilterItems from "../filterItems";
import { sortingConditions } from "../../constants/MenuItemTree";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";

interface FilteringModalProps {
  fabrics: Set<string>;
  setFabrics: (fabric: Set<string>) => void;
  catalogs: Set<string>;
  setCatalogs: (fabric: Set<string>) => void;
  artifactGrps: Set<string>;
  setArtifactGrps: (fabric: Set<string>) => void;
  catalogList: string[];
  artifactGrpList: string[];
  selectedSortButton: sortingConditions;
  setSelectedSortButton: (selectedSortButton: sortingConditions) => void
}

const FilterModal = (
  { fabrics, setFabrics, catalogs, setCatalogs,
    artifactGrps, setArtifactGrps, catalogList, artifactGrpList,
    selectedSortButton, setSelectedSortButton }: FilteringModalProps
) => {
  // OverAll FilterState just for displaying purpose
  const [filteredItems, setFilteredItems] = React.useState(
    new Set([
      ...Array.from(fabrics),
      ...Array.from(catalogs),
      ...Array.from(artifactGrps),
    ])
  );
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  // List Options subjected to change
  const fabricList = [
    { key: "DF", label: locale["Data Fabric"] },
    { key: "UF", label: locale["UI Fabric"] },
    { key: "PF", label: locale["Process Fabric"] },
  ];

  //Overall conditions to map
  const mappingCondtions = [
    {
      selectedKeys: fabrics,
      setSelectedKeys: setFabrics,
      items: fabricList,
      title: locale["Fabrics"],
    },
    {
      selectedKeys: catalogs,
      setSelectedKeys: setCatalogs,
      items: catalogList,
      title: locale["Catalog"],
    },
    {
      selectedKeys: artifactGrps,
      setSelectedKeys: setArtifactGrps,
      items: artifactGrpList,
      title: locale["Artifact Group"],
    },
  ];

  useEffect(() => {
    setFilteredItems(
      new Set([...Array.from(fabrics), ...Array.from(catalogs), ...Array.from(artifactGrps)])
    );
  }, [fabrics, catalogs, artifactGrps]);

  const removeItemFromAllStates = (ele: any) => {
    const selectedCatalogs = new Set(catalogs);
    const selectedArtifactGrps = new Set(artifactGrps);

    selectedCatalogs.delete(ele);
    selectedArtifactGrps.delete(ele);

    setCatalogs(selectedCatalogs);
    setArtifactGrps(selectedArtifactGrps);
  };

  const handleRemoveItem = (ele: any) => {
    removeItemFromAllStates(ele);
    const RemovedArray = Array.from(filteredItems).filter(
      (item) => item !== ele
    );
    setFilteredItems(new Set(RemovedArray));
  };

  const handleResetAllFilters = () => {
    setFilteredItems(new Set([]));
    setArtifactGrps(new Set([]));
    setCatalogs(new Set([]));
    setFabrics(new Set([]));
    setSelectedSortButton("")
  };

  const sortbutton: sortingConditions[] = [
    "Newest",
    "Oldest",
    "Recently Modified",
    "Recently Created",
  ]

  const getListBoxClassNames = (title: string) => {
    switch (title) {
      case "Fabrics":
        return "h-[8.75vh]"
      case "Catalog":
        return "h-[16vh] overflow-y-scroll"
      default:
        return "h-[12.05vh] overflow-y-scroll"
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between items-center py-[0.29vw]">
        <span style={{fontSize : `${fontSize * 0.83}vw`}} className="flex items-center gap-[0.29vw] leading-[2.22vh] font-medium">
          <FilterIcon fill={torusTheme["text"]} width="1.25vw" height="1.25vw" /> {locale["Filter"]}
        </span>
        <Button
          onPress={handleResetAllFilters}
          style={{ color: torusTheme["textOpacity/35"] , fontSize: `${fontSize * 0.62}vw`}}
          className={`outline-none leading-[2.22vh] font-medium`}
        >
          {locale["Clear All"]}
        </Button>
      </div>
      <div className="h-[73.6vh] overflow-y-scroll scrollbar-hide">
        <div className="flex flex-wrap">
          {Array.from(filteredItems).map((ele, index) => (
            <div
              style={{ backgroundColor: torusTheme["bg"] }}
              className={`m-[0.29vw] flex gap-[0.29vw] rounded-xl p-[0.29vw] px-[0.58vw]`}
              key={index}
            >
              <span style={{ fontSize: `${fontSize * 0.62}vw` }} key={index} className="leading-[2.22vh]">
                {ele}
              </span>
              <Button
                onPress={() => handleRemoveItem(ele)}
                className={`outline-none`}
              >
                <CloseIcon fill={torusTheme["text"]} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[0.58vw]">
          <h1 style={{ fontSize: `${fontSize * 0.62}vw` }} className="leading-[2.22vh] font-semibold">{locale["SORT BY"]}</h1>
          <div className="flex gap-[0.58vw] flex-wrap text-nowrap">
            {sortbutton.map((item) => (
              <Button
                onPress={() => setSelectedSortButton(item)}
                key={item}
                style={{ backgroundColor: selectedSortButton == item ? accentColor : torusTheme["bg"] , fontSize: `${fontSize * 0.62}vw`}}
                className={`flex outline-none p-1 leading-[2.22vh] border border-black/15
              rounded-lg ${selectedSortButton == item ? "text-white" : ""}`}
              >
                {locale[item]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[1.17vw] mt-[0.58vw]">
          {mappingCondtions.map((state, index) => (
            <FilterItems
              key={index}
              items={
                index == 0
                  ? state.items
                  : state.items.map((item) => ({ key: item, label: item }))
              }
              selectedKeys={state.selectedKeys}
              setSelectedKeys={state.setSelectedKeys}
              title={state.title}
              isSearchNeeded={index == 0 ? false : true}
              classNames={{
                listbox: getListBoxClassNames(state.title),
                listboxItem: "p-[0.29vw]",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
