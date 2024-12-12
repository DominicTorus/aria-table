/* eslint-disable */
import { DecisionGraph, JdmConfigProvider } from '@gorules/jdm-editor';
import '@gorules/jdm-editor/dist/style.css';
import { useGSAP } from '@gsap/react';

import gsap from 'gsap';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  FailureIcon,
  NavbarBackward,
  Save,
  SuccessIcon,
} from '../../SVG_Application';
import { LogicCenterContext } from '../../VPT_DO/DO_Logic_Screen/LogicCenter';
import { TorusModellerContext } from '../../Layout';
import { set } from 'lodash';
import useApplyThemeStyles from './useApplyTheme';
import { isLightColor } from '../../asset/themes/useTheme';
import TorusToolTip from '../../torusComponents/TorusToolTip';
import TorusButton from '../../torusComponents/TorusButton';

gsap.registerPlugin(useGSAP);

export const Gorule = ({ selectedActionName, initial, setNavigateTo }) => {
  const [json, setJson] = useState(initial);

  const { setMappedData } = useContext(LogicCenterContext);
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  const spanRef = useRef(null);

  const [sucessBtn, setSucessBtn] = useState(false);
  const [failureBtn, setFailureBtn] = useState(false);
  const [TablePage, setTablePage] = useState(false);
  const [backShown, setBackShown] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      spanRef.current,
      { opacity: 0, x: -25, duration: 0.3, ease: 'power1.inOut' },
      { opacity: 1, x: 0, duration: 0.3, ease: 'power1.inOut' },
    );
  }, []);

  useApplyThemeStyles(selectedTheme, setTablePage);

  const handleDoSave = async (selectedActionName) => {
    try {
      setMappedData((prev) => {
        if (selectedActionName && Array.isArray(selectedActionName)) {
          const hasNodesOrEdges =
            json?.nodes?.length !== 0 || json?.edges?.length !== 0;

          if (selectedActionName.length === 1) {
            return {
              ...prev,
              artifact: {
                ...prev?.artifact,
                rule: hasNodesOrEdges ? json : {},
              },
            };
          }

          if (selectedActionName.length === 2) {
            const updatedNodes = Array.isArray(prev?.artifact?.node)
              ? prev?.artifact?.node?.map((item) =>
                  item.nodeId === selectedActionName[1]
                    ? { ...item, rule: json }
                    : item,
                )
              : prev?.artifact?.node;

            return {
              ...prev,
              artifact: {
                ...prev?.artifact,
                node: updatedNodes,
              },
            };
          }

          if (selectedActionName.length === 3) {
            const updatedNodes = Array.isArray(prev?.artifact?.node)
              ? prev?.artifact?.node?.map((item) =>
                  item.nodeId === selectedActionName[1]
                    ? {
                        ...item,
                        objElements: item?.objElements?.map((obj) =>
                          obj?.elementId === selectedActionName[2]
                            ? { ...obj, rule: json }
                            : obj,
                        ),
                      }
                    : item,
                )
              : prev?.artifact?.node;

            return {
              ...prev,
              artifact: {
                ...prev?.artifact,
                name: selectedActionName[0],
                node: updatedNodes,
              },
            };
          }
        }

        return prev;
      });

      // Success toast notification
    } catch (error) {
      // Error toast notification

      console.error(error); // Log error for debugging
    }
  };

  return (
    <div
      className=" h-[100%] w-[100%] rounded-lg"
      style={{
        backgroundColor: `${selectedTheme?.bg}`,
        border: `1px solid ${selectedTheme?.border}`,
      }}
    >
      <div
        className="  flex h-[8%] flex-row  items-center  border-b  py-[1vh] pr-[0.85vw]  font-medium "
        style={{
          borderColor: `${selectedTheme?.border}`,
          color: `${selectedTheme?.text}`,
        }}
      >
        <div
          className="flex h-[100%] w-[90%]  justify-between "
          style={{
            backgroundColor: `${selectedTheme?.bg}`,
          }}
        >
          <div className="flex cursor-pointer items-center justify-between">
            <span
              className={`cursor-pointer'`}
              onClick={() => {
                setNavigateTo('');
              }}
            >
              <NavbarBackward
                className={'h-[1.25vw] w-[2.31vw]'}
                stroke={`${selectedTheme?.['textOpacity/50']}`}
              />
            </span>

            <span
              className="text-[1.10vw] font-bold"
              style={{
                color: `${selectedTheme?.text}`,
              }}
            >
              Rule Engine
            </span>
          </div>
        </div>
        <div className="flex w-[10%] items-center justify-end">
          <div className=" z-50  mt-0 flex h-6  w-[25%] items-center rounded  text-white hover:cursor-pointer">
            {!sucessBtn && !failureBtn ? (
              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={'df_rule'}
                    buttonClassName={`flex items-center justify-center h-[4vh] w-[1.9vw]
					rounded `}
                    isIconOnly={true}
                    size=""
                    btncolor={selectedAccntColor}
                    Children={
                      <AnimatedButton
                        onClick={async () => {
                          await handleDoSave(selectedActionName);
                        }}
                        label={
                          <Save
                            className={`h-[1.16vw] w-[1.5vw]`}
                            stroke={`${isLightColor(selectedAccntColor) === 'light' ? '#000000' : '#ffffff'}`}
                          />
                        }
                        setBackShown={setBackShown}
                        setSucessBtn={setSucessBtn}
                        setFailureBtn={setFailureBtn}
                      />
                    }
                  />
                }
                color={'#ccc'}
                tooltipFor={'df_rule'}
                tooltipContent={'save'}
              />
            ) : !sucessBtn && failureBtn ? (
              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={'df_rule'}
                    buttonClassName={`h-[4vh]  w-[1.9vw] items-center justify-center  bg-[#F14336] rounded`}
                    isIconOnly={true}
                    size=""
                    Children={
                      <FailureIcon
                        className={'h-[0.93vw] w-[0.93vw] fill-[#ffffff] '}
                      />
                    }
                    isDisabled={true}
                  />
                }
                color={'#ccc'}
                tooltipFor={'df_rule'}
                tooltipContent={'save'}
              />
            ) : sucessBtn && !failureBtn ? (
              <TorusToolTip
                placement="top"
                triggerElement={
                  <TorusButton
                    id={'df_rule'}
                    buttonClassName={`flex h-[4vh]  w-[1.9vw] items-center justify-center rounded bg-[#4CAF50]`}
                    isIconOnly={true}
                    size=""
                    Children={
                      <SuccessIcon
                        className={'h-[0.93vw] w-[0.93vw] fill-[#ffffff] '}
                      />
                    }
                    isDisabled={true}
                  />
                }
                color={'#ccc'}
                tooltipFor={'df_rule'}
                tooltipContent={'save'}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="h-[92%] pb-[0.55vw] pr-[0.55vw]">
        {
          <JdmConfigProvider>
            <DecisionGraph value={json} onChange={(val) => setJson(val)} />
          </JdmConfigProvider>
        }
      </div>
    </div>
  );
};

const AnimatedButton = ({ onClick, label, setSucessBtn, setFailureBtn }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [labelShow, setlabelShow] = useState(false);

  const handleClick = () => {
    try {
      onClick();
      setlabelShow(false);
      setTimeout(() => {
        setSucessBtn(true);
        setTimeout(() => {
          setSucessBtn(false);
        }, 1500);
      }, 200);
    } catch (error) {
      console.log(error);

      setlabelShow(false);

      setTimeout(() => {
        setFailureBtn(true);
        setTimeout(() => {
          setFailureBtn(false);
        }, 1500);
      }, 200);
    }
  };

  useEffect(() => {
    if (!labelShow) {
      setlabelShow(true);
    }
  }, []);

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '0.85vw 0.85vw',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        width: 'auto',
        height: '1.5vw',
        gap: '0.5vw',
      }}
      className="bg-transparent"
    >
      {labelShow && (
        <span className="text-[0.83vw] font-[600] text-gray-700 transition-all duration-100 ease-soft-spring">
          {label}
        </span>
      )}
    </button>
  );
};
export default AnimatedButton;