import React from "react";
import { Input } from "react-aria-components";
import { SearchIcon, TorusLogo } from "../../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";

const Topbar = ({
  setSearchTerm,
}: {
  setSearchTerm: (searchTerm: string) => void;
}) => {
  const locale = useSelector((state: RootState) => state.main.locale);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  return (
    <nav aria-label="Navbar" className="flex w-full p-[0.58vw] pt-[0.87vw]">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center">
          <TorusLogo />
          <h2 style={{ color: torusTheme["text"] , fontSize : `${fontSize * 1.25}vw`}} className={`leading-[2.66vh] font-medium`}>TORUS</h2>
        </div>
        <div className={`flex w-[25%] relative items-center`}>
          <span className="absolute inset-y-0 left-0 p-[0.58vw]">
            <SearchIcon fill={torusTheme["text"]} width="0.65vw" height="0.65vw" />
          </span>
          <Input
            placeholder={locale["Search"]}
            style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], borderColor: torusTheme["border"] , fontSize : `${fontSize * 0.72}vw`}}
            className={`w-full p-[0.29vw] focus:outline-none focus:border-blue-400 border pl-[1.46vw] leading-[2.22vh] rounded-md`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex">
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
