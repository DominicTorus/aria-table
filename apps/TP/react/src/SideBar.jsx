/* eslint-disable */
import React, { forwardRef, useContext, useEffect } from 'react';
import { Panel } from 'reactflow';
import {
  AIFabric,
  AssemblerScreenIcon,
  Connect,
  Data,
  FabricBar,
  Faq,
  Home,
  NodeGallerIcon,
  SettingsIcon,
  Support,
  TorusModelClose,
  VerticalLine,
  Wire,
  WithNotification,
  AiIcon,
  HorizontalLine,
} from './SVG_Application';
import TorusAvatar from './torusComponents/TorusAvatar';
import TorusTab from './torusComponents/TorusTab';

import { getClientTenantsData } from './commonComponents/api/tennantProfile';
import { TorusModellerContext } from './Layout';
import { TenantAvatar, TenantList, TenantSelector } from './tennantSelector';
import TorusPopOver from './torusComponents/TorusPopOver';

const colors = {
  Home: { dark: '#008080', light: '#008080' },
  DF: {
    dark: '#2257f7',
    light: '#244DCB',
  },
  UF: {
    dark: '#33CCFF',
    light: '#00BFFF',
  },
  PF: { dark: '#2AE38F', light: '#13CC78' },

  SF: { dark: '#FFc723', light: '#FFBE00' },
};

const transparent =
  'torus-selected:border-r-transparent torus-selected:border-t-transparent torus-selected:border-b-transparent';
const focusBLcolor = {
  DF: {
    dark: `torus-selected:border-2 torus-selected:border-l-[#2257f7] ${transparent}`,
    light: `torus-selected:border-2 torus-selected:border-l-[#244DCB] ${transparent}`,
  },
  UF: {
    dark: `torus-selected:border-2 torus-selected:border-l-[#33CCFF] ${transparent}`,
    light: `torus-selected:border-2 torus-selected:border-l-[#00BFFF] ${transparent}`,
  },
  PF: {
    dark: `torus-selected:border-2 torus-selected:border-l-[#2AE38F] ${transparent}`,
    light: `torus-selected:border-2 torus-selected:border-l-[#13CC78] ${transparent}`,
  },

  SF: {
    dark: `torus-selected:border-2 torus-selected:border-l-[#FFc723] ${transparent}`,
    light: `torus-selected:border-2 torus-selected:border-l-[#FFBE00] ${transparent}`,
  },
};

export default function SideBar({
  isAppOrArtifact,
  client,
  clientLoginId,
  profileImg,
  selectedTenantObj,
  setSelectedTenantObj
}) {
  const {
    mainFabric,
    selectedFabric,
    handleMainFabricChange,
    selectedTenant,
    setSelectedTenant,
    selectedSubFlow,
    selectedTheme,
    selectedAccntColor,
  } = useContext(TorusModellerContext);

  const [clientTenants, setClientTenants] = React.useState([]);

  const clientTenant = async (clientCode, close) => {
    const res = await getClientTenantsData(clientCode);

    if (res && res.length > 0) {
      return res;
    }
  };

  useEffect(() => {
    if (isAppOrArtifact === 'artifacts') {
      clientTenant(client)
        .then((tenants) => {
          setClientTenants(tenants);
          if(Array.isArray(tenants) && tenants.length > 0 && selectedTenant){
            if(tenants.find((tenant) => tenant.code === selectedTenant).length){
              setSelectedTenantObj(tenants.find((tenant) => tenant.code === selectedTenant))
            }else{
              setSelectedTenantObj(tenants[0])
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching client tenants:', error);
        });
    }
  }, [isAppOrArtifact]);

  // const findingOne = () => {
  //   if (
  //     clientTenants &&
  //     Array.isArray(clientTenants) &&
  //     clientTenants.length > 0
  //   ) {
  //     const findselectedOne = clientTenants?.filter((tenant) => {
  //       return tenant.code === selectedTenant;
  //     });

  //     return findselectedOne;
  //   }
  // };

  // useEffect(() => {
  //   const findselectedOne = findingOne();
  //   if (findselectedOne?.length > 0 && !selectedTenantObj) {
  //     setSelectedTenantObj(findselectedOne);
  //   }
  // }, [clientTenants, selectedTenant]);


  const borderLeftReturn = (accnt) => {
    return `torus-selected:border-2 torus-selected:border-l-[${accnt}]`;
  };

  return (
    <>
      <Panel
        position="top-left"
        className={`m-[0.87vw] flex h-[95%] w-[3.59vw] flex-col items-center justify-between rounded-md border   
             py-2
          `}
        style={{
          backgroundColor: `${selectedTheme?.bg}`,
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        <div className="flex h-[80%] flex-col items-center justify-start">
          <div className="flex h-[2.39vw] w-[2.39vw] cursor-pointer items-center justify-center rounded-md ">
            <TorusPopOver
              parentHeading={
                <TenantSelector
                  clientTenants={clientTenants}
                  selectedTenantObj={selectedTenantObj}
                  selectedTenant={selectedTenant}
                />
              }
              popbuttonClassNames={'w-[100%]'}
              children={({ close }) => (
                <div
                  className={`flex h-[25vh] flex-col items-center justify-start rounded-lg border `}
                  style={{
                    backgroundColor: `${selectedTheme?.bg}`,
                    borderColor: `${selectedTheme?.border}`,
                  }}
                >
                  {/* <div className="flex w-[100%] items-center justify-center border-b border-slate-300 py-[0.85vh] dark:border-[#212121]">
                    <div className="flex w-[90%] items-center justify-between">
                      <div className="font-inter  p-2 text-[0.83vw]  font-semibold  leading-[2.22vh]  tracking-normal transition-opacity duration-1000 ease-in-out    ">
                        <span className="text-[0.83vw] font-semibold leading-[16px] tracking-normal transition-opacity  duration-1000 ease-in-out">
                          Select Tenant
                        </span>
                      </div>
                      <div
                        className="flex w-[20%] items-center justify-center"
                        onClick={() => {
                          close();
                        }}
                      >
                        <TorusModelClose className={'h-[0.85vw] w-[0.85vw]'} />
                      </div>
                    </div>
                  </div> */}
                  <div
                    className={`${clientTenants?.length > 0 ? 'max-h-[22vh] w-[15vw] overflow-scroll ' : 'max-h-[25vh] w-[15vw] '}`}
                  >
                    <TenantList
                      clientTenants={clientTenants}
                      close={close}
                      setSelectedTenant={setSelectedTenant}
                      selectedTenant={selectedTenant}
                      selectedTenantObj={selectedTenantObj}
                      setSelectedTenantObj={setSelectedTenantObj}
                    />
                  </div>
                </div>
              )}
            />
          </div>
          <div className="flex h-[49%] w-[100%]  flex-col  items-center justify-start ">
            <TorusTab
              isDisabled={
                selectedSubFlow === 'UO' ||
                selectedSubFlow === 'PO' ||
                selectedSubFlow === 'DO'
              }
              selectedId={mainFabric}
              borderColor={`${selectedAccntColor}`}
              defaultSelectedKey={mainFabric}
              key="TorusTab"
              orientation="vertical"
              classNames={{
                tabs: 'cursor-pointer ',
                tabList: 'w-full h-[100%]  flex justify-center items-center',
                tab: ` px-[0.45vw] h-full w-full flex justify-center items-center torus-pressed:outline-none torus-focus:outline-none border-2 border-transparent 
                ${selectedFabric === 'events' ? 'UF' : `${borderLeftReturn(selectedAccntColor)}`}`,
              }}
              tabs={[
                {
                  id: 'Home',
                  content: ({ isSelected }) => (
                    <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                      <Home
                        className={'h-[1.25vw] w-[1.25vw]'}
                        strokeColor={!isSelected ? '#A59E92' : 'teal'}
                      />
                    </div>
                  ),
                },
                {
                  id: 'DF',
                  content: ({ isSelected }) => (
                    <div
                      className={`${selectedSubFlow ? 'cursor-not-allowed' : 'cursor-pointer'} flex h-[2.35vw]  w-[2.35vw] items-center justify-center `}
                    >
                      <div>
                        <Data
                          className={'h-[1.25vw] w-[1.25vw]'}
                          strokeColor={
                            !isSelected ? '#A59E92' : `${selectedAccntColor}`
                          }
                        />
                      </div>
                    </div>
                  ),
                },

                {
                  id: 'UF',
                  content: ({ isSelected }) => (
                    <div
                      className={`${selectedSubFlow ? 'cursor-not-allowed' : 'cursor-pointer'} flex h-[2.35vw]  w-[2.35vw] items-center justify-center `}
                    >
                      <Wire
                        className={'h-[1.25vw] w-[1.25vw]'}
                        strokeColor={
                          !isSelected ? '#A59E92' : `${selectedAccntColor}`
                        }
                      />
                    </div>
                  ),
                },
                {
                  id: 'PF',
                  content: ({ isSelected }) => (
                    <div
                      className={`${selectedSubFlow ? 'cursor-not-allowed' : 'cursor-pointer'} flex h-[2.35vw]  w-[2.35vw] items-center justify-center `}
                    >
                      <Connect
                        className={'h-[1.25vw] w-[1.25vw]'}
                        strokeColor={
                          !isSelected ? '#A59E92' : `${selectedAccntColor}`
                        }
                      />
                    </div>
                  ),
                },

                {
                  id: 'AIF',
                  content: ({ isSelected }) => (
                    <div
                      className={`${selectedSubFlow ? 'cursor-not-allowed' : 'cursor-pointer'} flex h-[2.35vw]  w-[2.35vw] items-center justify-center `}
                    >
                      <AIFabric
                        className={'h-[1.35vw] w-[1.35vw]'}
                        fill={!isSelected ? '#A59E92' : `${selectedAccntColor}`}
                      />
                    </div>
                  ),
                },
                {
                  id: 'ASSEMBLER',
                  content: ({ isSelected }) => (
                    <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                      <AssemblerScreenIcon
                        className={'h-[1.35vw] w-[1.35vw]'}
                        fill={!isSelected ? '#A59E92' : `${selectedAccntColor}`}
                      />
                    </div>
                  ),
                },
              ]}
              onSelectionChange={handleMainFabricChange}
            />
          </div>

          <div className=" flex h-[5%] w-full items-center justify-center ">
            <span className="flex w-[100%] items-center justify-center">
              <HorizontalLine
                className={
                  'h-[1.31vw] w-[2.55vw] stroke-[#A59E92] dark:stroke-white'
                }
              />
            </span>
          </div>

          <div className="    flex h-[50%] w-[100%] cursor-pointer flex-col items-center justify-start">
            <div className=" flex h-[50%] w-full flex-col  items-center gap-0  px-[0.25vw] py-[0.25vh]">
              <div className="flex h-[2.35vw]  w-[100%] items-center justify-center px-[0.45vw] ">
                <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                  <FabricBar className="h-[1.25vw] w-[1.25vw] stroke-[#A6A6A6] dark:stroke-[#686868]" />
                </div>
              </div>

              <div className="flex h-[2.35vw]  w-[100%] items-center justify-center px-[0.45vw] ">
                <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                  <Faq className="h-[1.25vw] w-[1.25vw] stroke-[#A6A6A6] dark:stroke-[#686868]" />
                </div>
              </div>

              <div className="flex h-[2.35vw]  w-[100%] items-center justify-center px-[0.45vw] ">
                <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                  <Support className="h-[1.25vw] w-[1.25vw] stroke-[#A6A6A6] dark:stroke-[#686868]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[20%] flex-col items-center  justify-end gap-3">
          {/* <div
            className="cursor-pointer"
            onClick={() => toggleDarkMode(!darkMode)}
          >
           {darkMode ? (
              <BiSun color={"#A59E92"} className="h-[1.25vw] w-[1.25vw]" />
            ) : (
              <BiMoon color={"#A59E92"} className="h-[1.25vw] w-[1.25vw]" />
            )}
          </div> */}

          <div className="flex flex-col items-center justify-between gap-[1vh] px-[0.25vw] py-[0.25vh]">
            <div className=" flex h-[100%] w-full flex-col  items-center  justify-center gap-0  px-[0.25vw] py-[0.25vh]">
              <div className="flex h-[2.5vw] w-[2.5vw] items-center justify-center ">
                {/* <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                  <NodeGallerIcon className="h-[1.25vw] w-[1.25vw] fill-[#A6A6A6] dark:fill-[#A59E92]" />
                </div> */}
              </div>

              <div className="flex h-[2.5vw] w-[2.5vw] items-center justify-center ">
                <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                  <WithNotification
                    className="h-[1.25vw] w-[1.25vw]"
                    stroke={'#A59E92'}
                  />
                </div>
              </div>

              <div className="flex h-[2.5vw] w-[2.5vw] items-center justify-center ">
                <div className="flex h-[2.35vw]  w-[2.35vw] items-center justify-center ">
                  <SettingsIcon
                    className="h-[1.25vw] w-[1.25vw]"
                    stroke={'#A59E92'}
                  />
                </div>
              </div>
            </div>

            <div className="">
              <SidebarAvatar
                imageUrl={profileImg}
                name={clientLoginId}
                size={'2vw'}
              />
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}

const SidebarAvatar = forwardRef(({ imageUrl, name, size }, ref) => {
  const initials = name ? name[0].toUpperCase() : '';

  const { selectedAccntColor } = useContext(TorusModellerContext);

  const calculateFontSize = (size) => {
    if (typeof size === 'number') {
      return `${size / 2.5}px`;
    }

    const numericValue = parseFloat(size);
    if (size.includes('vw') || size.includes('vh')) {
      return `${numericValue / 2.5}vw`;
    } else {
      return `${numericValue / 2.5}px`;
    }
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: calculateFontSize(size),
    backgroundColor: `${imageUrl ? 'transparent' : `${selectedAccntColor}`}`,
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    textTransform: 'uppercase',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '50%',
  };

  return (
    <div style={avatarStyle} ref={ref}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} style={imageStyle} />
      ) : (
        <span style={{ fontWeight: 'bold' }}>{initials}</span>
      )}
    </div>
  );
});
