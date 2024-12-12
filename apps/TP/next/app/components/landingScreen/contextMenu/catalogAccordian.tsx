import React, { useEffect, useState } from "react";
import { DownArrow } from "../../../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../../../lib/Store/store";

const CatalogAccordian =
  ({
    items,
    onSelectionChange,
    selectedTkey,
    selectedProject,
    selectedArtifactGroup,
  }: any) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);

    const handleSelectionChange = (id: any) => {
      setSelectedItem(id);
      onSelectionChange(id);
    };

    return (
      <div className="flex flex-col gap-[0.14vw] p-[0.58vw]">
        {items &&
          items.map((item: any) => (
            <DisplayTkeys
              key={item.id}
              title={item.title}
              id={item.id}
              items={item.content}
              onSelectionChange={handleSelectionChange}
              selectedItem={selectedItem}
              selectedTkey={selectedTkey}
              selectedProject={selectedProject}
              selectedArtifactGroup={selectedArtifactGroup}
            />
          ))}
      </div>
    );
  }

const DisplayTkeys =
  ({
    title,
    id,
    items,
    onSelectionChange,
    selectedItem,
    selectedTkey,
    selectedProject,
    selectedArtifactGroup,
  }: any) => {
    const [open, setOpen] = useState(false);
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);

    useEffect(() => {
      if (selectedTkey === id) {
        setOpen(true);
      }
    }, [selectedTkey, id]);
    return (
      <div className="flex w-[100%] flex-col gap-[0.14vw] ">
        <div
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-start gap-[0.58vw]"
        >
          <span
            className={`transition duration-300 ease-in-out ${open && items.length > 0 ? "rotate-[0deg]" : "rotate-[-90deg]"
              }`}
          >
            <DownArrow fill={torusTheme["text"]} />
          </span>
          <span style={{ color: torusTheme["text"], fontSize : `${fontSize * 0.72}vw` }} className="cursor-pointer select-none  font-medium">
            {title}
          </span>
        </div>
        <div>
          <div className="mx-[0.58vw] flex flex-col gap-[0.58vw] border-l">
            {open &&
              items &&
              items.map((item: any) => (
                <DisplayCatalog
                  key={item.catalog}
                  title={item.catalog}
                  id={{ tKey: id, catalog: item.catalog }}
                  items={item.artifactGroupList}
                  onSelectionChange={onSelectionChange}
                  selectedItem={selectedItem}
                  selectedTkey={selectedTkey}
                  selectedProject={selectedProject}
                  selectedArtifactGroup={selectedArtifactGroup}

                />
              ))}
          </div>
        </div>
      </div>
    );
  }

const DisplayCatalog =
  ({ title, id, items, onSelectionChange, selectedItem, selectedTkey, selectedProject, selectedArtifactGroup }: any) => {
    const [open, setOpen] = useState(false);
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);

    useEffect(() => {
      if (selectedProject === id?.catalog && selectedTkey === id?.tKey) {
        setOpen(true);
      }
    }, [selectedProject, selectedTkey, id]);

    return (
      <div className="flex w-[100%] flex-col gap-[0.58vw] rounded-md  px-[0.29vw]">
        <div
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-start gap-[0.58vw]"
        >
          <span
            className={`transition duration-300 ease-in-out ${open ? "rotate-[0deg]" : "rotate-[-90deg]"
              }`}
          >
            <DownArrow fill={torusTheme["text"]} />
          </span>
          <span style={{ color: torusTheme["text"],fontSize : `${fontSize * 0.72}vw` }} className="cursor-pointer select-none  font-medium">
            {title}
          </span>
        </div>
        <div className="mx-[0.58vw] flex flex-col gap-[0.29vw] border-l">
          {open &&
            items &&
            items.map((item: any) => {
              return (
                <DisplayContent
                  key={item}
                  title={item}
                  id={{ ...id, artifactGroup: item }}
                  onSelectionChange={onSelectionChange}
                  isSelected={
                    selectedTkey == id?.tKey &&
                      selectedProject === id?.catalog &&
                      selectedArtifactGroup === item
                      ? true
                      : false
                  }
                />
              );
            })}
        </div>
      </div>
    );
  }


const DisplayContent =
  ({ title, id, onSelectionChange, isSelected }: any) => {
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);

    return (
      <div
        className={`fade-in-out flex w-[100%] cursor-pointer flex-col gap-[0.58vw] rounded-md font-medium transition-all duration-150`}
        style={{color: isSelected ? torusTheme["text"] : torusTheme["textOpacity/50"] }}
        onClick={() => onSelectionChange(id)}
      >
        <span
        style={{fontSize: `${fontSize * 0.72}vw`}}
          className={`transition-all duration-300 ease-in-out ${isSelected ? "px-[0.87vw]  " : "px-[0.87vw] "
            } `}
        >
          {title}
        </span>
      </div>
    );
  }

export default CatalogAccordian;