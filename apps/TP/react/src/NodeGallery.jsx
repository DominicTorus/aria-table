/* eslint-disable */
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useContext, useRef } from 'react';
import { Header } from 'react-aria-components';
import { MdOutlineEmojiEvents } from 'react-icons/md';
import { Panel } from 'reactflow';
import { DarkmodeContext } from './commonComponents/context/DarkmodeContext';
import { EnvSideData } from './commonComponents/layout/SideBar/SidebarData';
import FrkNodeGallery from './FrkNodeGallery';
import { TorusModellerContext } from './Layout';
import { Back } from './SVG_Application';
import TorusButton from './torusComponents/TorusButton';
import OrpsSidebar from './VPT_SF/Components/layout/sidebar';
gsap.registerPlugin(useGSAP);

export default function NodeGallery({
  color,
  showFabricSideBar,
  handleSidebarToggle,

  showNodeProperty,
}) {
  const {
    selectedFabric,

    selectedTheme,
    selectedAccntColor,
  } = useContext(TorusModellerContext);
  const divRef = useRef(null);
  useGSAP(() => {
    gsap.fromTo(
      divRef.current,
      { opacity: 0, x: -25, duration: 0.5, ease: 'power1.inOut' },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power1.inOut' },
    );
  }, []);
  return (
    <Panel
      position="top-left"
      style={{
        left: `${showNodeProperty ? '5.5%' : '4.5%'} `,
        transition: 'left 0.5s ease-in-out',
        backgroundColor: `${selectedTheme?.bg}`,
        borderColor: `${selectedTheme?.border}`,
      }}
      className={` 
    ${
      showFabricSideBar
        ? ` h-[95%]  rounded-md  border
        ${showNodeProperty ? 'w-[11.15vw]' : 'w-[10.72vw] '}  
        `
        : 'hidden'
    }
    ${selectedFabric === 'SF' ? ' w-[15.15vw] ' : ''}
    `}
    >
      <div
        className={`flex w-full items-center justify-between border-b  font-medium  `}
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        <div className="felx-col flex w-[100%] justify-between px-[5px] py-[6px]">
          <div className="flex w-[70%] items-center justify-start">
            <Header
              className={` text-[0.83vw] text-[${selectedTheme?.text}] font-semibold leading-[16px] tracking-normal transition-opacity  duration-1000 ease-in-out`}
            >
              Node Gallery
            </Header>
          </div>
          <div
            className={`flex items-center justify-end ${
              !showFabricSideBar ? 'w-[100%]' : 'w-[30%]'
            }`}
          >
            <div className="flex items-center justify-end">
              <TorusButton
                buttonClassName={`flex justify-center items-center   border-l-transparent   transition-transform ease-in-out duration-300 w-[100%] ${selectedTheme?.bgCard && `bg-[${selectedTheme?.bgCard}]`} `}
                width={showFabricSideBar ? 'sm' : 'none'}
                onPress={handleSidebarToggle}
                Children={
                  <Back
                    className={`h-[1.25vw] w-[1.25vw]`}
                    stroke={`${selectedTheme?.text}`}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`  flex h-[93.75%] w-[100%] flex-col justify-between transition-opacity duration-700 ease-in-out`}
      >
        <div
          ref={divRef}
          className="item-start flex  max-h-[78%] w-full justify-center "
        >
          <Loop color={color} />
        </div>

        <div className="flex h-[20%] w-full items-end justify-center ">
          <div
            className={`flex w-[92%] flex-col gap-[0.5vh] rounded-lg bg-[${selectedTheme?.bgCard}] px-[0.25vw] py-[0.5vh] pr-[1vw]  dark:text-white `}
          >
            <div className="flex flex-col items-baseline justify-center ">
              <span
                className={` mt-2 text-[0.72vw] text-[${selectedTheme?.text}] font-[700] leading-[1.5vh]`}
              >
                Upgrade to unlock
                <br />
                more features
              </span>
            </div>

            <p
              slot="description"
              className={`text-[0.62vw] text-[${selectedTheme?.text}] leading-[1.34vh]`}
            >
              Enjoy unlimited space for fabrics, applets, extra security
              features & more.
            </p>

            <div className="flex w-[55%] items-center justify-start ">
              <TorusButton
                buttonClassName={'text-white'}
                Children="Upgrade"
                width={'sm'}
                radius="full"
                color={'white'}
                size={'sm'}
                marginT={'mt-2'}
                btncolor={`${selectedAccntColor}`}
                fontStyle={
                  'text-[0.62vw] font-bold leading-[1.34vh] text-center py-[6px] px-[10px] tracking-normal'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

const Loop = ({ color }) => {
  const {
    selectedFabric,

    selectedTkey,
    selectedTheme,
    selectedAccntColor,
  } = useContext(TorusModellerContext);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div
      className={`${selectedFabric === 'DF-DFD' ? 'justify-start gap-[0.25rem]' : ''}
          flex  h-full w-full flex-col  items-start overflow-y-scroll p-1`}
    >
      {selectedTkey == 'AF' ? (
        <FrkNodeGallery />
      ) : (
        <>
          {selectedTkey &&
          selectedTkey === 'AFR' &&
          EnvSideData[selectedFabric] ? (
            EnvSideData[selectedFabric].map((item, index) => (
              <div
                key={index}
                className="flex w-full cursor-grab  items-center justify-start gap-1 rounded px-[0.58vw] py-[0.80vh] hover:bg-[#F4F5FA] dark:text-white dark:hover:bg-[#0F0F0F] "
                draggable
                onDragStart={(event) => onDragStart(event, item.nodeType)}
              >
                <div
                  className={` flex  h-[1.25vw]  w-[1.25vw] cursor-grab items-center justify-center rounded border`}
                  style={{
                    backgroundColor: `${selectedAccntColor}50`,
                    borderColor: `${selectedAccntColor}70`,
                  }}
                >
                  {React.createElement(item.icon, {
                    color: color ? color : `${selectedAccntColor}`,
                    size: '0.83vw',
                    selectedFabric: selectedFabric,
                  })}
                </div>
                <div
                  className=" cursor-grab text-[0.72vw] font-normal leading-[2.22vh] tracking-normal"
                  style={{
                    color: `${selectedTheme?.text}`,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))
          ) : (
            <div
              className="flex min-h-full w-full items-center justify-center text-center text-[0.73vw] italic"
              style={{
                color: `${selectedTheme?.text}80`,
              }}
            >
              No artifact resource found
            </div>
          )}
        </>
      )}
    </div>
  );
};
export const EventScreen = ({ selectedControlEvents }) => {
  const onDragStart = (event, eventName, parentNode) => {
    event.dataTransfer.setData(
      'application/parentNode',
      JSON.stringify(parentNode),
    );
    event.dataTransfer.setData('application/eventName', eventName);
    event.dataTransfer.effectAllowed = 'move';
  };

  const { selectedTheme } = useContext(TorusModellerContext);

  return (
    <>
      {selectedControlEvents && (
        <div className="flex w-full  flex-col  items-start justify-start">
          <div className="flex h-[30%] w-full flex-row items-center justify-between p-2">
            <div
              className={`text-[0.72vw] font-medium `}
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              {selectedControlEvents?.nodeName ||
                selectedControlEvents?.nodeType}
            </div>
          </div>
          {selectedControlEvents?.events &&
            selectedControlEvents?.events.length > 0 &&
            selectedControlEvents?.events.map((item) => {
              return (
                <div
                  className="flex w-full cursor-grab items-center gap-1 rounded px-[0.50rem] py-[0.25rem] hover:bg-[#F4F5FA] dark:text-white dark:hover:bg-[#0F0F0F]"
                  onDragStart={(event) =>
                    onDragStart(event, item.name, selectedControlEvents)
                  }
                  draggable
                >
                  <div
                    className={`  flex h-[93.75%] w-[100%] flex-col justify-between transition-opacity duration-700 ease-in-out`}
                  >
                    <div className="item-start flex  h-[100%] w-[100%] justify-start gap-2 ">
                      <span className=" flex h-[1.25vw] w-[1.25vw] items-center justify-center rounded bg-[#0736C4]/15 ">
                        <MdOutlineEmojiEvents color="#0736C4" size={12} />
                      </span>

                      <div className=" cursor-grab text-[0.72vw] font-normal leading-[2.22vh] tracking-normal">
                        {item.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};
