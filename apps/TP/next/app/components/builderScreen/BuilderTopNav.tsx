import React from "react";
import { Button, Separator } from "react-aria-components";
import { Preview, BuilderShareIcon, TorusLogo, BackwardIcon, LogScreenIcon, CodeGrpIcon, GlitterIcon } from "../../constants/svgApplications";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";

const BuilderTopNav = ({ showNodeData, setShowNodeData, hideAdditionalIcons }: { showNodeData?: any, setShowNodeData?: any, hideAdditionalIcons?: boolean }) => {
    const accentColor = useSelector((state: RootState) => state.main.accentColor);
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);

    return (
        <nav
            aria-label="Navbar"
            style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"], borderColor: torusTheme["border"] }}
            className={`w-full h-[6.98vh] flex flex-col justify-center items-center border transition-colors duration-700 ease-in-out`}
        >
            <div className="flex w-full h-full justify-between items-center">
                <div className="flex gap-[1.17vw]">
                    <div className="flex items-center">
                        <TorusLogo />
                        <h2 style={{ fontSize: `${fontSize * 1.25}vw` }} className="leading-[2.66vh] font-medium">TORUS</h2>
                    </div>
                    {showNodeData ? <div className="flex items-center">
                        <Button className={"outline-none "} onPress={() => setShowNodeData(null)}><BackwardIcon fill={torusTheme["text"]} /></Button>
                    </div> : null}
                </div>
                {/* {hideAdditionalIcons ? null :
                    <div className="flex h-full gap-[0.87vw] items-center pr-[0.58vw]">
                        <CodeGrpIcon className={`cursor-pointer border rounded p-[0.29vw] border-[${torusTheme["border"]}]`} width="2vw" height="2vw" opacity="1" fill={torusTheme["text"]} />
                        <GlitterIcon className={`cursor-pointer border rounded p-[0.29vw] border-[${torusTheme["border"]}]`} width="2vw" height="2vw" opacity="1" fill={torusTheme["text"]} />
                        <LogScreenIcon className={`cursor-pointer border rounded p-[0.29vw] border-[${torusTheme["border"]}]`} width="2vw" height="2vw" opacity="1" fill={torusTheme["text"]} />
                        <Button style={{ backgroundColor: torusTheme["bgCard"] }} className={`outline-none cursor-pointer rounded-md`}>
                            <Preview fill={torusTheme["text"]} />
                        </Button>
                        <Button style={{ backgroundColor: accentColor }} className={"outline-none rounded"}>
                            <BuilderShareIcon className={`cursor-pointer rounded`} />
                        </Button>
                    </div>} */}
            </div>
            <Separator style={{ borderColor: torusTheme["border"] }} />
        </nav>
    );
};

export default BuilderTopNav;