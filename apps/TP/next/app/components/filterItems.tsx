import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  ListBox,
  ListBoxItem,
} from "react-aria-components";
import { Checked, UnChecked, SearchIcon } from "../constants/svgApplications";
import { twMerge } from "tailwind-merge";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";

type ClassNameProps = {
  container?: string;
  listbox?: string;
  listboxItem?: string;
};

interface Props {
  title: string;
  items: any;
  selectedKeys: any;
  setSelectedKeys: any;
  isSearchNeeded?: boolean;
  classNames?: ClassNameProps;
  singleSelection?: boolean;
}

const FilterItems = ({
  title,
  items,
  selectedKeys,
  setSelectedKeys,
  isSearchNeeded = true,
  classNames,
  singleSelection = false,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Iterable<any>>(items);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  useEffect(() => {
    const filtered = (items as any).filter((item: any) => item.label.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredItems(filtered);
  }, [searchTerm, items])

  return (
    <div className={twMerge("w-full", classNames?.container)}>
      <div className="flex justify-between text-nowrap items-center">
        <h1 style={{ color: torusTheme["text"] , fontSize : `${fontSize * 0.62}vw` }} className="leading-[2.22vh] font-medium">{title.toUpperCase()}</h1>
        <Button
          onPress={() => setSelectedKeys(new Set([]))}
          className={`outline-none leading-[2.22vh] font-medium`}
          style={{ color: torusTheme["textOpacity/35"] , fontSize : `${fontSize * 0.52}vw` }}
        >
          {locale["Clear All"]}
        </Button>
      </div>
      {isSearchNeeded ? (
        <div className="relative px-[0.2vw] items-center w-full">
          <Input
            type="text"
            className={`w-full items-center leading-[1.5vh] p-[0.58vw] outline-none rounded group focus:ring-2 focus:px-0 ${searchTerm ? "px-0" : "px-[1.75vw]"}`}
            style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"] , fontSize : `${fontSize * 0.72}vw`} }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={locale["Search"]}
          />{" "}
          {!isFocused && !searchTerm ? (
            <span className="absolute items-center inset-y-0 left-0 flex p-[0.58vw] group-fous:hidden">
              <SearchIcon fill={torusTheme["text"]} width="0.83vw" height="0.83vw" />
            </span>
          ) : null}
        </div>
      ) : null}
      <ListBox
        aria-label="customized-filter-items"
        selectionBehavior="toggle"
        selectionMode={singleSelection ? "single" : "multiple"}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        items={filteredItems}
        style={{ color: torusTheme["text"] }}
        className={twMerge("w-[95%] mt-[0.29vw]", classNames?.listbox)}
        renderEmptyState={() => <div className="w-full h-full flex justify-center items-center">No data Available</div>}
      >
        {(item) => (
          <ListBoxItem
            key={item.key}
            className={twMerge(
              `cursor-pointer outline-none`,
              classNames?.listboxItem
            )}
            textValue={item.label}
          >
            {({ isSelected }) => (
              <div style={{fontSize : `${fontSize * 0.72}vw`}} className="w-full flex gap-[0.58vw] items-center leading-[1.94vh]">
                {isSelected ? <Checked fill={accentColor} /> : <UnChecked />}
                {item.label}
              </div>
            )}
          </ListBoxItem>
        )}
      </ListBox>
    </div>
  );
};

export default FilterItems;