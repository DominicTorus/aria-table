import { memo, useState } from 'react';
import { GoLink } from 'react-icons/go';
import { LiaCreditCardSolid } from 'react-icons/lia';
import { LuDatabase } from 'react-icons/lu';
import {
  MdBackupTable,
  MdDataObject,
  MdOutlineDataArray,
} from 'react-icons/md';
import { PiCodepenLogoLight } from 'react-icons/pi';
import { SiDatabricks } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { TfiRulerPencil } from 'react-icons/tfi';

const iconArray = [
  MdDataObject,
  MdOutlineDataArray,
  MdBackupTable,
  LuDatabase,
  SiDatabricks,
  TfiRulerPencil,
  PiCodepenLogoLight,
  GoLink,
  LiaCreditCardSolid,
  SlSocialDropbox,
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const RenderJsonArraySidebarIcon = memo(
  ({
    obj,
    setShowObj,
    setPath,
    fg,
    activeTab,
    setActiveTab,
    setLabel,
    shuffledIcons,
    setCheckActivestatus,
    setExpandedItem,
    selectedTheme
  }) => {
    return (
      <>
        <div
          title={obj[0]?.groupLabel ?? fg}
          onClick={() => {
            setShowObj(fg);
            setActiveTab(fg);
            setPath(fg);
            setLabel(obj[0]?.groupLabel ?? fg);
            setCheckActivestatus(obj);
            setExpandedItem([]);
          }}
          className={
            ' flex w-[100%] cursor-pointer items-center justify-center gap-4 rounded-sm   duration-100 ease-in-out transition-background' +
            (activeTab == fg
              ? 'cursor-pointer  bg-[#a8a8ac]/45 px-[0.25vw] py-[0.25vw] text-xs text-white dark:bg-[#09254D]'
              : ' cursor-pointer px-[0.25vw] py-[0.25vw] text-gray-800')
          }
        >
          {console.log(obj, 'arr', fg, obj[0]?.groupLabel)}
          <MdOutlineDataArray
            size={15}
            color={`${selectedTheme?.text}`}
          />
          {/* <TorusToolTip
            hoverContent={
            }
            tooltipFor="arr"
            tooltipContent={fg} // obj.map((ele) => ele?.label ? ele?.label : fg
            // color={activeTab == fg ? "#6600ff" : "#09254D"}
            setShowObj={setShowObj}
            setActiveTab={setActiveTab}
            setPath={setPath}
            fg={fg}
            placement="left"
            obj={obj}
            setLabel={setLabel}
            setCheckActivestatus={setCheckActivestatus}
            setExpandedItem={setExpandedItem}
          /> */}
        </div>
      </>
    );
  },
);

export const JsonSidebarIcon = memo(
  ({
    obj,
    setShowObj,
    setPath,
    setLabel,
    checkActivestatus,
    setCheckActivestatus,
    setExpandedItem,
    selectedTheme
  }) => {
    const [activeTab, setActiveTab] = useState(null);

    return (
      <>
        <div className="scrollbar-none  relative mb-5 flex h-full   max-h-[80vh] min-h-[80vh] max-w-full flex-col  overflow-y-scroll "
        style={{
          backgroundColor:`${selectedTheme?.bg}`,
        }}
        >
          {obj &&
            Object.keys(obj).map((ele, i) => {
              if (typeof obj[ele] == 'object' && !Array.isArray(obj[ele])) {
                return (
                  <div
                    title={obj[ele].groupLabel ?? ele}
                    key={i + ele}
                    className="px[0.5vw]  cursor-pointer py-[0.5vw]"
                    onClick={() => {
                      setShowObj(ele);
                      setPath(ele);
                      setLabel(obj[ele].groupLabel ?? ele);
                      setActiveTab(ele);
                      setCheckActivestatus(obj[activeTab]);
                    }}
                  >
                    <span
                      className={
                        ' flex w-[100%] items-center justify-center gap-4 rounded-sm   duration-100 ease-in-out transition-background ' +
                        (activeTab == ele
                          ? 'cursor-pointer bg-[#a8a8ac]/45 px-[0.25vw]   py-[0.25vw] text-xs text-white  dark:bg-[#09254D]'
                          : ' cursor-pointer px-[0.25vw] py-[0.25vw] text-gray-800')
                      }
                    >
                      <MdDataObject
                        size={15}
                        color={`${selectedTheme?.text}`}
                      />
                      {/* <TorusToolTip
                        hoverContent={
                        }
                        tooltipFor="obj"
                        tooltipContent={ele} // obj.map((ele) => ele?.label ? ele?.label : fg
                        color={activeTab == ele ? "#6600ff" : "#09254D"}
                        setShowObj={setShowObj}
                        placement="left"
                        setActiveTab={setActiveTab}
                        setPath={setPath}
                        ele={ele}
                        setLabel={setLabel}
                      /> */}
                    </span>
                  </div>
                );
              }
              if (Array.isArray(obj[ele])) {
                return (
                  <div className="px[0.5vw]  cursor-pointer py-[0.5vw]">
                    <RenderJsonArraySidebarIcon
                      key={i + ele}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      obj={obj[ele]}
                      fg={ele}
                      setShowObj={setShowObj}
                      setPath={setPath}
                      setLabel={setLabel}
                      shuffledIcons={iconArray}
                      setCheckActivestatus={setCheckActivestatus}
                      setExpandedItem={setExpandedItem}
                      selectedTheme={selectedTheme}
                    />
                  </div>
                );
              }
            })}
        </div>
      </>
    );
  },
);
