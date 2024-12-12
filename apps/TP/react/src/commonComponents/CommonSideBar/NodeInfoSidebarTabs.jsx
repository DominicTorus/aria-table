import { Tooltip } from '@nextui-org/react';

import React, { useContext } from 'react';
import { TorusModellerContext } from '../../Layout';
import { PropertyIcon } from '../../SVG_Application';
import TorusTab from '../../torusComponents/TorusTab';
import { Upload } from '../Model/UploadJson';

export const NodeInfoSidebarTabs = ({
  nodeInfoTabs,
  currentDrawing,
  activeTab,
  contextValue,
  handleContextMenu,

  handleOpen,
  handleOpenModal,
  setFiles,
  darkMode,
  contextMenuVisible,
  handleRenders,
  sideBarData,
}) => {
  const { selectedTheme } = useContext(TorusModellerContext);

  return (
    <TorusTab
      tabsbgcolor={`${selectedTheme?.bgCard}`}
      aria-label="Options"
      variant="solid"
      classNames={{
        tabList:
          currentDrawing == 'DF-ERD'
            ? `items-center justify-center  h-[4vh]  max-w-[18.68vw] overflow-x-scroll  gap-0 border-none outline-none rounded-sm flex items-center justify-center`
            : `items-center justify-center UF-Tab  h-[4vh] max-w-[18.68vw] overflow-x-scroll rounded-md  gap-0 border-none outline-none flex items-center justify-center`,

        tab: !darkMode
          ? '  text-white font-semibold border-none outline-none   '
          : ' flex justify-center items-center text-black font-semibold border-none outline-none  ',
        tabContent: !darkMode
          ? ' border-none rounded outline-none '
          : ' border-none rounded outline-none  ',
        cursor:
          'border-none  rounded torus-focus:outline-none outline-none torus-focus-within:outline-none',
      }}
      defaultSelectedKey={''}
      orientation="horizontal"
      onSelectionChange={(data) => {
        let value = JSON.parse(data);

        handleOpen(value.label);
        if (currentDrawing === 'events') {
          if (value.label === 'StateTransition') {
            handleOpenModal(value.modelOpen, false, '', 'StateTransition');
          }
        }

        if (
          value.label !== 'Mapper' &&
          value.label !== 'Events' &&
          value.label !== 'Rule' &&
          value.label !== 'CustomCode' &&
          currentDrawing !== 'SF'
        )
          handleOpenModal(value.modelOpen, false, '');
      }}
      tabs={
        nodeInfoTabs[currentDrawing] &&
        sideBarData.type !== 'orgGrp' &&
        sideBarData.type !== 'roleGrp' &&
        sideBarData.type !== 'org' &&
        sideBarData.type !== 'roles' &&
        sideBarData.type !== 'psGrp' &&
        currentDrawing !== 'events'
          ? [
              {
                id: JSON.stringify({
                  label: 'Property',
                  modelOpen: 'property',
                }),
                content: (
                  <Tooltip content={'Property'} color={'secondary'}>
                    <span
                      className={`flex h-[0.83vw]  w-[0.83vw] cursor-pointer items-center justify-center `}
                    >
                      <PropertyIcon
                        className={`h-[0.83vw] w-[0.83vw] ${activeTab === 'Property' ? 'stroke-[#00bfff]' : 'stroke-0.5 stroke-[#353636]'}`}
                      />
                    </span>
                  </Tooltip>
                ),
              },
              ...Object.entries(nodeInfoTabs[currentDrawing]).map(
                ([key, value]) => {
                  return {
                    id: JSON.stringify({
                      label: value.label,
                      modelOpen: value.modelOpen,
                    }),
                    content: (
                      <div>
                        <Tooltip content={value.label} color={'secondary'}>
                          <span
                            className={
                              'flex h-[0.83vw]  w-[0.83vw] cursor-pointer items-center justify-center '
                            }
                            onContextMenu={(e) =>
                              handleContextMenu(e, value.modelOpen)
                            }
                          >
                            {React.createElement(value.icon, {
                              className: `h-[0.83vw] w-[0.83vw] ${activeTab === value.label ? 'stroke-[#00bfff] fill-[#00bfff] ' : 'stroke-0.5 stroke-[#717272]'}`,
                            })}
                          </span>
                        </Tooltip>
                        <div
                          className="App"
                          id="sideBar-contextMenu"
                          style={{
                            display:
                              contextMenuVisible &&
                              contextValue === value.modelOpen
                                ? 'block'
                                : 'none',
                          }}
                        >
                          <div
                            style={{
                              zIndex: 9999,
                              backgroundColor: 'rgb(109 96 96 / 13%)',
                              width: '2.5vw',
                              height: '2.5vw',
                              display:
                                contextMenuVisible &&
                                contextValue === value.modelOpen
                                  ? 'flex'
                                  : 'none',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '0.25rem',
                              top: '40px',
                              left: '99px',
                              position: 'absolute',
                            }}
                            className="ring-2 ring-[#00BFFF] ring-offset-2 "
                          >
                            <div className=" px-[0.5vw] py-[0.5vh]">
                              <Upload id={value.label} setFiles={setFiles} />
                            </div>
                          </div>
                        </div>
                        {/* <div
                              className="App fixed rounded-md"
                              style={{
                                zIndex: 9999,
                                display: contextMenuVisible ? "block" : "none",
                                top: contextMenuPosition.y,
                                left: contextMenuPosition.x,
                                backgroundColor: darkMode ? "#242424" : "white",
                              }}
                            >
                              <div className="px-3 py-3">
                                <Upload
                                  id={value.label}
                                  setFiles={setFiles}
                                />
                              </div>
                            </div> */}
                      </div>
                    ),
                  };
                },
              ),
            ]
          : [
              {
                id: JSON.stringify({
                  label: 'Property',
                  modelOpen: 'property',
                }),
                content: (
                  <Tooltip content={'Property'} color={'secondary'}>
                    <span
                      className={
                        darkMode
                          ? `h-[0.83vw] w-[0.83vw]                                   ${activeTab === 'Property' ? '' : ''} flex cursor-pointer items-center justify-center `
                          : `h-[0.83vw] w-[0.83vw]  rounded-md ${activeTab === 'Property' ? ' ' : ''}  
                                    flex cursor-pointer items-center justify-center `
                      }
                    >
                      <PropertyIcon
                        className={`h-[0.83vw] w-[0.83vw] ${activeTab === 'Property' ? 'stroke-[#00bfff]' : 'stroke-0.5 stroke-[#717272]'}`}
                      />
                    </span>
                  </Tooltip>
                ),
              },
            ]
      }
      panels={
        nodeInfoTabs[currentDrawing] &&
        nodeInfoTabs[currentDrawing] &&
        (sideBarData.type !== 'orgGrp' &&
        sideBarData.type !== 'roleGrp' &&
        sideBarData.type !== 'org' &&
        sideBarData.type !== 'roles' &&
        sideBarData.type !== 'psGrp'
          ? [
              {
                id: JSON.stringify({
                  label: 'Property',
                  modelOpen: 'property',
                }),
                content: handleRenders('property'),
              },

              ...Object.entries(nodeInfoTabs[currentDrawing]).map(
                ([key, value]) => {
                  return {
                    id: JSON.stringify({
                      label: value.label,
                      modelOpen: value.modelOpen,
                    }),
                    content: handleRenders(value.modelOpen),
                  };
                },
              ),
            ]
          : [
              {
                id: JSON.stringify({
                  label: 'Property',
                  modelOpen: 'property',
                }),
                content: handleRenders('property'),
              },
            ])
      }
    />
  );
};
