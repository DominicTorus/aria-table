/* eslint-disable */
import React, { useContext, useEffect, useState, version } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'react-toastify';
import {
  getAppData,
  getAppGroupData,
  getTenantsData,
  getVersionData,
  postDataPushToBuild,
} from './commonComponents/api/pushToBuildApi';
import { TorusModellerContext } from './Layout';
import {
  PushToBuild,
  TorusPushToBuildFail,
  TorusPushToBuildSucess,
} from './SVG_Application';
import TorusAvatar from './torusComponents/TorusAvatar';
import TorusButton from './torusComponents/TorusButton';
import TorusDropDown from './torusComponents/TorusDropDown';
import TorusTab from './torusComponents/TorusTab';
import TorusToast from './torusComponents/TorusToaster/TorusToast';
import _, { set } from 'lodash';
import { pendingToast, updateToast } from './utils/utils';

export default function Builder({ mappedTeamItems, clientLoginId, close }) {
  const {
    selectedArtifactGroup,
    selectedTkey,
    selectedFabric,
    selectedArtifact,
    selectedProject,
    client,
    selectedVersion: selectedV,
    selectedTenant,
    selectedTheme,
    selectedAccntColor,
  } = useContext(TorusModellerContext);

  const [selectedTab, setSelectedTab] = useState('me');
  const [pushToBuildData, setPushToBuildData] = useState(null);

  const [tenants, setTenants] = useState(null);
  const [selectedAppGroup, setSelectedAppGroup] = useState('');
  const [appGroups, setAppGroups] = useState(null);
  const [apps, setApps] = useState(null);
  const [selectedApp, setSelectedApp] = useState('');
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [wordLength, setWordLength] = useState(0);
  const [sucessBtn, setSucessBtn] = useState(false);
  const [failureBtn, setFailureBtn] = useState(false);
  const [versions, setVersions] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  const normalizeFn = (data) => {
    return data?.map((item) => ({
      key: item,
      label: item,
    }));
  };

  const getAppGroups = (data, tenant) => {
    const tenantData = data?.find((item) => item.name === tenant);
    if (tenantData) {
      return tenantData?.appGroups?.map((item) => ({
        key: item.name,
        label: item.name,
      }));
    }
  };

  const getApps = (data, tenant, appGroup) => {
    const tenantData = data?.find((item) => item.name === tenant);
    if (tenantData) {
      const appGroupData = tenantData?.appGroups?.find(
        (item) => item.name === appGroup,
      );
      if (appGroupData) {
        return appGroupData?.apps?.map((item) => ({
          key: item.name,
          label: item.name,
        }));
      }
    }
  };

  function denormalizeFn1(data) {
    return (
      data?.map(
        ({
          artifactKeyPrefix,
          buildKeyPrefix,
          artifactName,
          timestamp,
          version,
          loginId,
        }) => {
          const [, , fabrics] = artifactKeyPrefix.split(':');
          const [, , , tennant, app] = buildKeyPrefix.split(':');

          const pathArr = [tennant, app];

          const fabricsNameFn = (fab) => {
            switch (fab) {
              case 'PF-PFD':
                return 'PROCESS FABRIC';
              case 'UF-UFW':
              case 'UF-UFM':
              case 'UF-UFD':
                return 'USER FABRIC';
              case 'SF':
                return 'SECURITY FABRIC';
              case 'DF-ERD':
                return 'DATA FABRIC';
              default:
                return fab;
            }
          };

          const versionFn = (ver) => `${ver}.0`;

          const dateConverter = (ver) => {
            const date = new Date(ver);

            const options = {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            };

            let dateTime = date.toLocaleString('en-US', options);

            var timeStamp = dateTime.replace('at', ' ');

            return timeStamp;
          };

          const firstLetterUpperCase = (str) => {
            const firstLetter = str.charAt(0).toUpperCase() + str.slice(1);
            return firstLetter;
          };

          return {
            artifactsName: artifactName,
            artifactsKeyArr: artifactKeyPrefix.split(':'),
            fabrics,
            fabricsName: fabricsNameFn(fabrics),
            buildKeyPrefixArr: buildKeyPrefix.split(':'),
            tennant,
            app,
            timeStamp: dateConverter(timestamp),
            loginId,
            updatedVersion: versionFn(version),
            text: pathArr.join(' > '),
            heading: `${firstLetterUpperCase(loginId)} pushed the ${fabricsNameFn(fabrics).toLowerCase()} of ${tennant} ${versionFn(version)}`,
          };
        },
      ) || []
    );
  }

  useEffect(() => {
    // handlePushToBuild();

    if (mappedTeamItems && mappedTeamItems.length > 0) {
      setNotificationDetails(denormalizeFn1(mappedTeamItems));
    }
  }, [mappedTeamItems]);

  const handelbuldPush = async () => {
    let toastId;
    const message =
      !selectedTenant || !selectedAppGroup || !selectedApp || !selectedVersion
        ? 'Please select all the fields'
        : 'Cannot push to build';
    try {
      toastId = pendingToast(
        'Please wait for few seconds for Pushing to Build',
      );
      let payout = {
        artifactKeyPrefix: `CK:${client}:FNGK:${selectedTkey}:FNK:${selectedFabric}:CATK:${selectedProject}:AFGK:${selectedArtifactGroup}:AFK:${selectedArtifact}:AFVK:${selectedV}`,
        loginId: clientLoginId,
        tenant: selectedTenant,
        appGrp: selectedAppGroup,
        app: selectedApp,
        client: client,
      };
      setButtonIsDisabled(true);
      if (selectedVersion) {
        payout = {
          ...payout,
          version: selectedVersion,
        };
      }
      const res = await postDataPushToBuild(payout);

      if (res === 'error') {
        updateToast(toastId, 'error', message);
        setFailureBtn(true);
        setButtonIsDisabled(true);
        setTimeout(() => {
          setFailureBtn(false);
          setButtonIsDisabled(false);
        }, 3000);
      } else {
        updateToast(toastId, 'success', 'Pushed to build successfully');
        setSucessBtn(true);
        setButtonIsDisabled(true);
        setTimeout(() => {
          setSucessBtn(false);
          setButtonIsDisabled(false);
          close();
        }, 3000);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedTenant) {
      getAppGroupData(selectedTenant).then((result) => {
        if (Array.isArray(result)) {
          result = result.filter(Boolean);
        }
        if (result && result.length > 0) {
          console.log(result, 'getAppGroupData resolved value');
          setAppGroups(normalizeFn(result));
        } else {
          setAppGroups(null);

          toast(
            <TorusToast
              setWordLength={setWordLength}
              wordLength={wordLength}
            />,
            {
              type: 'error',
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: true,
              title: 'Error',
              text: `No app groups found for ${selectedTenant}`,
              closeButton: false,
            },
          );
        }
      });
      setApps(null);
      setVersions(null);
      setSelectedAppGroup('');
      setSelectedApp('');
      setSelectedVersion('');
    } else {
      setAppGroups([]);
      setApps([]);
      setVersions([]);
      setSelectedAppGroup('');
      setSelectedApp('');
      setSelectedVersion('');
    }
  }, [selectedTenant]);

  console.log(tenants, 'pbdatatenants');
  console.log(selectedTenant, 'pbdataselectedTenant');
  console.log(appGroups, 'pbdataappGroups');
  console.log(selectedAppGroup, 'pbdataselectedAppGroup');
  console.log(apps, 'pbdataapps');
  console.log(pushToBuildData, 'pbdatapushToBuildData');
  console.log(appGroups, 'pbdataappGroups');
  // console.log(selectedVersion,"pbdataSelectedVersion");
  console.log(selectedTenant, appGroups, 'isittrue');
  const finalValue = () => {
    if (selectedTenant && selectedAppGroup && selectedApp && selectedVersion) {
    } else {
      console.log('Please select all the fields');
    }
  };

  console.log({ selectedTenant, selectedAppGroup, selectedApp }, 'fields');
  console.log(selectedTenant, '<<--selectedTenant--->>push');

  const handleAppGroupChange = (appGroup) => {
    try {
      setSelectedAppGroup(appGroup);
      if (appGroup) {
        getAppData(selectedTenant, appGroup).then((result) => {
          if (result && result.length > 0) {
            setApps(normalizeFn(result));
          } else {
            toast(
              <TorusToast
                setWordLength={setWordLength}
                wordLength={wordLength}
              />,
              {
                type: 'error',
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: true,
                title: 'Error',
                text: `No apps found for ${appGroup}`,
                closeButton: false,
              },
            );
          }
        });
      } else {
        setApps([]);
      }
      setSelectedApp('');
      setSelectedVersion('');
      setVersions([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAppChange = (app) => {
    try {
      setSelectedApp(app);
      if (app) {
        var getVersions = getVersionData(selectedTenant, selectedAppGroup, app);
        getVersions.then((result) => {
          if (result && result.length > 0) {
            setVersions(normalizeFn(result));
          } else {
            setVersions([]);
          }
        });
      } else {
        setVersions([]);
      }
      setSelectedVersion('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex h-[6.66vh] w-[100%] flex-row px-[0.55vw] py-[0.25vh] ">
        <div className="flex w-[8.07vw] items-center justify-start">
          <div className="flex w-[95%] items-center justify-start">
            <div className="flex w-[20%] items-center justify-start">
              <PushToBuild
                className={'h-[1.25vw] w-[1.25vw] '}
                stroke={`${selectedTheme?.text}`}
              />
            </div>
            <div className="flex w-[80%] items-center justify-start ">
              <p
                className="whitespace-nowrap px-2 text-start text-[0.93vw] font-[600] leading-[2.22vh] "
                style={{ color: `${selectedTheme?.text}` }}
              >
                Push to Build
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row  items-center justify-end gap-2 ">
          <div className="flex w-[60%] items-center justify-end">
            {!sucessBtn && !failureBtn ? (
              <TorusButton
                Children="Push Artifact"
                size={'md'}
                btncolor={`${selectedAccntColor}`}
                outlineColor="torus-hover:ring-blue-500/50"
                radius={'lg'}
                color={'white'}
                onPress={() => {
                  handelbuldPush();
                }}
                isDisabled={buttonIsDisabled ? true : false}
                fontStyle={
                  'font-inter text-white text-[0.83vw] leading-[2.22vh] font-[400] tracking-tighter items-center  '
                }
                buttonClassName={
                  'w-[8.54vw] h-[4.29vh] px-[0.55vw] py-[0.25vh]'
                }
              />
            ) : sucessBtn && !failureBtn ? (
              <>
                <TorusButton
                  Children="Sucess"
                  btncolor={'#4CAF50'}
                  outlineColor="torus-hover:ring-[#4CAF50]/50"
                  radius={'lg'}
                  fontStyle={
                    'font-inter text-white text-[0.83vw] leading-[2.22vh] font-[400] tracking-tighter items-center  '
                  }
                  buttonClassName={
                    'w-[8.54vw] h-[4.29vh] px-[0.55vw] py-[0.25vh]'
                  }
                  color={'white'}
                  startContent={
                    <TorusPushToBuildSucess className={'fill-[#FFFFFF]'} />
                  }
                  isDisabled={true}
                />
              </>
            ) : !sucessBtn && failureBtn ? (
              <>
                <TorusButton
                  Children="Failed"
                  btncolor={'#F14336'}
                  outlineColor="torus-hover:ring-[#F14336]/50"
                  radius={'lg'}
                  fontStyle={
                    'font-inter text-white text-[0.83vw] leading-[2.22vh] font-[400] tracking-tighter items-center '
                  }
                  buttonClassName={
                    'w-[8.54vw] h-[4.29vh] px-[0.55vw] py-[0.25vh]'
                  }
                  color={'white'}
                  startContent={
                    <TorusPushToBuildFail className={'fill-[#FFFFFF]'} />
                  }
                  isDisabled={true}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className=" flex h-[38.7vh] w-full items-center  justify-center border-t "
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        <div
          className="flex h-[100%] w-[100%] scroll-m-1 flex-col items-center  justify-center border-0"
          style={{
            border: 'none',
          }}
        >
          <div className="mt-[1.75vh] flex h-[13%] w-[100%] items-center justify-start ">
            <div className="mt-[1.75vh] grid h-[4.7vh] w-[100%] grid-cols-9 gap-[0.25vw] px-[0.5vw]">
              <div className={`col-span-3  `}>
                <TorusDropDown
                  onPress={() => {
                    setSelectedAppGroup('');
                    setSelectedApp(null);
                  }}
                  title={
                    <div className="flex w-[100%] items-center justify-between ">
                      <div
                        style={{
                          color: `${selectedTheme?.text}`,
                        }}
                      >
                        {selectedAppGroup ? selectedAppGroup : 'App Group'}
                      </div>
                      <div>
                        <IoIosArrowDown
                          color={`${selectedTheme?.text}`}
                          size={'0.83vw'}
                        />
                      </div>
                    </div>
                  }
                  btncolor={`${selectedTheme?.bgCard}`}
                  isDisabled={!selectedTenant || !appGroups ? true : false}
                  fontStyle={'w-[100%] text-[0.83vw] font-[400] px-[1vw]'}
                  selectionMode="single"
                  selected={
                    selectedAppGroup ? new Set([selectedAppGroup]) : new Set([])
                  }
                  setSelected={(e) => {
                    handleAppGroupChange(Array.from(e)[0]);
                  }}
                  items={appGroups && appGroups.length > 0 && appGroups}
                  classNames={{
                    buttonClassName:
                      'rounded-lg w-[100%] flex justify-center items-center text-[0.83vw] h-[4.7vh] font-[400] bg-[#F4F5FA] dark:bg-[#0F0F0F] text-center dark:text-white',

                    popoverClassName:
                      'w-[9.63vw] max-h-[9.25vh] min-h-[9.05vh]',
                    listBoxClassName:
                      ' min-h-[35px] max-h-[100px] overflow-y-auto max-w-[10vw] min-w-[8vw] absolute right-0 bg-white dark:bg-[#161616]',
                    listBoxItemClassName: 'flex text-sm justify-between',
                  }}
                />
              </div>
              <div className={`col-span-3  `}>
                <TorusDropDown
                  onPress={() => {
                    setSelectedVersion(null);
                  }}
                  title={
                    <div className="flex w-[100%] items-center justify-between ">
                      <div
                        style={{
                          color: `${selectedTheme?.text}`,
                        }}
                      >
                        {selectedApp ? selectedApp : 'App'}
                      </div>
                      <div>
                        <IoIosArrowDown
                          color={`${selectedTheme?.text}`}
                          size={'0.83vw'}
                        />
                      </div>
                    </div>
                  }
                  btncolor={`${selectedTheme?.bgCard}`}
                  isDisabled={
                    !selectedTenant || !selectedAppGroup ? true : false
                  }
                  fontStyle={'w-[100%] text-[0.83vw] font-[400] px-[1vw]'}
                  selectionMode="single"
                  selected={selectedApp ? new Set([selectedApp]) : new Set([])}
                  setSelected={(e) => {
                    handleAppChange(Array.from(e)[0]);
                  }}
                  items={apps && apps.length > 0 && apps}
                  classNames={{
                    buttonClassName:
                      'rounded-lg w-[100%] flex justify-center items-center text-[0.83vw] h-[4.7vh] font-[400] bg-[#F4F5FA] dark:bg-[#0F0F0F] text-center dark:text-white',

                    popoverClassName:
                      'w-[9.63vw] max-h-[9.25vh] min-h-[9.05vh]',
                    listBoxClassName:
                      ' min-h-[35px] max-h-[100px] overflow-y-auto max-w-[10vw] min-w-[8vw] absolute right-0 bg-white dark:bg-[#161616]',
                    listBoxItemClassName: 'flex text-sm justify-between',
                  }}
                />
              </div>
              <div className={`col-span-3  `}>
                {/* <TorusDropDown
                  title={selectedApp ? selectedApp : "App"}
                  selectionMode="single"
                  selected={""}
                  setSelected={(e) => {
                    setSelectedApp(Array.from(e)[0]);
                    finalValue();
                  }}
                  isDisabled={
                    !selectedTenant || !selectedAppGroup ? true : false
                  }
                  classNames={{
                    buttonClassName: ` rounded-lg w-[100%] flex justify-center items-center text-[0.83vw] h-[4.7h] font-[400] bg-[#F4F5FA] dark:bg-[#0F0F0F] text-center dark:text-white`,

                    popoverClassName:
                      "w-[3.63vw] max-h-[9.25vh] min-h-[9.05vh]",
                    listBoxClassName:
                      " min-h-[35px] max-h-[100px] overflow-y-auto max-w-[9rem] min-w-[6.8rem] absolute right-0",
                    listBoxItemClassName: "flex text-sm justify-between",
                  }}
                  isDropDown={true}
                  items={apps}
                /> */}

                <TorusDropDown
                  onPress={() => {
                    // setSelectedVersion(null);
                  }}
                  btncolor={`${selectedTheme?.bgCard}`}
                  title={
                    <div className="flex w-[100%] items-center justify-between ">
                      <div
                        style={{
                          color: `${selectedTheme?.text}`,
                        }}
                      >
                        {selectedVersion ? selectedVersion : 'Version'}
                      </div>
                      <div>
                        <IoIosArrowDown
                          color={`${selectedTheme?.text}`}
                          size={'0.83vw'}
                        />
                      </div>
                    </div>
                  }
                  isDisabled={
                    !selectedTenant || !selectedAppGroup || !selectedApp
                      ? true
                      : false
                  }
                  fontStyle={'w-[100%] text-[0.83vw] font-[400] px-[1vw]'}
                  selectionMode="single"
                  selected={
                    selectedVersion ? new Set([selectedVersion]) : new Set([])
                  }
                  setSelected={(e) => {
                    setSelectedVersion(Array.from(e)[0]);
                    finalValue();
                  }}
                  items={versions && versions.length > 0 && versions}
                  classNames={{
                    buttonClassName:
                      'rounded-lg w-[100%] flex justify-center items-center text-[0.83vw] h-[4.7vh] font-[400] bg-[#F4F5FA] dark:bg-[#0F0F0F] text-center dark:text-white',

                    popoverClassName:
                      'w-[9.63vw] max-h-[9.25vh] min-h-[9.05vh]',
                    listBoxClassName:
                      ' min-h-[35px] max-h-[100px] overflow-y-auto max-w-[10vw] min-w-[8vw] absolute right-0 bg-white dark:bg-[#161616]',
                    listBoxItemClassName: 'flex text-sm justify-between',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex h-[90%] w-full flex-col justify-center pt-2">
            <div className="flex h-[2.97vh] w-full items-center justify-start pl-[0.55vw] ">
              <p className="flex h-[100%] w-[50%] items-center justify-start text-[0.62vw] font-[600] leading-[1.66vh] tracking-[0.05vw] text-[#84919A]">
                DEVELOPMENT HISTORY
              </p>
            </div>
            <div className="flex h-[85%] w-full flex-col items-center gap-[0.5rem]">
              <div className="h-[4.98vh] w-[100%] px-[0.8rem]">
                <TorusTab
                  defaultSelectedKey={selectedTab}
                  key="TorusTab"
                  orientation="horizontal"
                  onSelectionChange={(e) => setSelectedTab(e)}
                  tabsbgcolor={`${selectedTheme?.bgCard}`}
                  classNames={{
                    tabs: 'cursor-pointer h-[4.98vh] w-[100%] rounded-lg dark:bg-[#0F0F0F]',
                    tabList:
                      'w-full h-[100%]  flex justify-center items-center rounded-lg',
                    tab: `rounded-lg h-full w-full flex justify-center items-center 
                    torus-pressed:outline-none torus-focus:outline-none torus-pressed:ring-0 torus-focus:ring-0  border-2 border-transparent  text-center  text-xs font-semibold tracking-[0.45px]`,
                  }}
                  tabs={[
                    {
                      id: 'Me',
                      content: ({ isSelected }) => (
                        <div
                          className={` flex h-[100%] w-[100%]  items-center justify-center rounded-lg py-[0.55vh] text-[0.72vw] font-[500] text-black torus-focus:outline-none   torus-focus:ring-0 torus-pressed:ring-0 dark:text-[#FFFFFF]
                                                 
                                                  `}
                          style={{
                            backgroundColor: `${isSelected ? selectedTheme?.bg : ''}`,
                            color: `${isSelected ? selectedTheme?.text : '#A59E92'}`,
                          }}
                        >
                          Me
                        </div>
                      ),
                    },
                    {
                      id: 'Teams',
                      content: ({ isSelected }) => (
                        <div
                          className={`  flex h-[100%] w-[100%]  items-center justify-center rounded-lg py-[0.55vh] text-[0.72vw] font-[500]  text-black torus-focus:outline-none    torus-focus:ring-0 torus-pressed:ring-0 dark:text-[#FFFFFF]
                                                
                                                  `}
                          style={{
                            backgroundColor: `${isSelected ? selectedTheme?.bg : ''}`,
                            color: `${isSelected ? selectedTheme?.text : '#A59E92'}`,
                          }}
                        >
                          Teams
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
              <div className="h-[70%] w-[100%] overflow-y-scroll px-[1vw] ">
                {notificationDetails &&
                  notificationDetails?.map((obj) => (
                    <TeamsNotificationComponent
                      // src={obj.src}
                      heading={obj.heading}
                      text={obj.text}
                      timeStamp={obj.timeStamp}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const TeamsNotificationComponent = ({ src, heading, text, timeStamp }) => {
  return (
    <div className="grid w-[100%] grid-cols-12 pt-4">
      <div className="col-span-1 flex w-[100%] items-center justify-center">
        <div className="flex w-[100%] justify-start">
          <TorusAvatar
            // src={src}
            color={'#0736C4'}
            borderColor={'#0736C4'}
            radius={'full'}
            size={'w-[2.0vw] h-[2.0vw]'}
          />
        </div>
      </div>
      <div className="col-span-11">
        <div className="flex w-[100%] flex-col">
          <div className="grid grid-cols-8">
            <div className="col-span-6">
              <p className="text-[0.65vw] font-[500] text-[#344054] dark:text-[#FFFFFF]">
                {heading}
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex w-[100%] items-center justify-end">
                <p className="whitespace-nowrap text-[0.55vw] font-normal text-[#667085] dark:text-[#FFFFFF59]">
                  {timeStamp}
                </p>
              </div>
            </div>
          </div>
          <div className="w-[100%]">
            <p className="text-[0.65vw] font-[400] text-[#667085]">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
