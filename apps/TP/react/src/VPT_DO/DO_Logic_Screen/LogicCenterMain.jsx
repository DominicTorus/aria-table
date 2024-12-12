import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FailureIcon, SuccessIcon } from '../../SVG_Application';
import { LogicCenter } from './LogicCenter';

import { TorusModellerContext } from '../../Layout';
import { isLightColor } from '../../asset/themes/useTheme';
import {
  getSubflow,
  saveSubflow,
} from '../../commonComponents/api/orchestratorApi';
import TorusButton from '../../torusComponents/TorusButton';
import { pendingToast, updateToast } from '../../utils/utils';

const LogicCenterMain = ({
  triggerSave,
  selectedLogic,
  setShowLogic,
  tenant,
  setLogicCenterData,
  client,
  redisKey,
  fabric,
}) => {
  const [currentDrawing, setCurrentDrawing] = useState('');
  const [subFlow, setSubFlow] = useState('DO');
  const [wordLength, setWordLength] = useState(0);
  const [sucessBtn, setSucessBtn] = useState(false);
  const [items, setItems] = useState({});
  const [failureBtn, setFailureBtn] = useState(false);

  const [mappedData, setMappedData] = useState({
    source: [],
    target: [],
  });

  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  const [securityData, setSecurityData] = useState({
    afk: '',
    accessProfile: [],
    securityTemplate: {},
  });

  const loadIntilalData = useCallback(async () => {
    try {
      let check = false;

      check =
        typeof triggerSave === 'function' ? await triggerSave(false) : true;
      if (!check) return;
      let otherKey = [
        'CK',
        'FNGK',
        'FNK',
        'CATK',
        'AFGK',
        'AFK',
        'AFVK',
        'AFSK',
      ];

      let key = selectedLogic?.path.split(':');
      key = key.filter((item) => !otherKey.includes(item));
      const currentFab = key[2];
      let currentsubFlow = subFlow;
      if (currentFab && currentFab.startsWith('DF')) {
        currentsubFlow = 'DO';
      }

      if (currentFab && currentFab.startsWith('UF')) {
        currentsubFlow = 'UO';
      }

      if (currentFab && currentFab.startsWith('PF')) {
        currentsubFlow = 'PO';
      }

      let result = await getSubflow(JSON.stringify(key), currentsubFlow);

      if (result && result.status && result.status === 200) {
        setMappedData(result?.data?.mappedData);
        setSecurityData({
          ...result?.data?.securityData,
          afk: selectedLogic?.path,
        });
        console.log(result?.data, 'result--->');
        if (currentFab === 'DF-DFD') setItems(result?.data?.sourceItems);
        else setItems(result?.data?.targetItems);
        setSubFlow(currentsubFlow);
        setCurrentDrawing(currentFab);
        setCurrentDrawing(currentFab);
      }
    } catch (error) {
      console.error(error);
    }
  }, [subFlow, selectedLogic]);

  useEffect(() => {
    loadIntilalData();
  }, [loadIntilalData]);

  const handleSave = async () => {
    let toastId;

    try {
      toastId = pendingToast(`Please wait for the saving of Logic Center`);
      let otherKey = [
        'CK',
        'FNGK',
        'FNK',
        'CATK',
        'AFGK',
        'AFK',
        'AFVK',
        'AFSK',
      ];
      let key = selectedLogic?.path.split(':');
      key = key.filter((item) => !otherKey.includes(item));
      await saveSubflow(
        {
          mappedData: mappedData,
          securityData: securityData,
        },
        key,
        subFlow,
      ).finally(() => {
        updateToast(toastId, 'success', 'Saved Successfully');
      });

      currentDrawing !== 'DF-DST' &&
        setLogicCenterData &&
        setLogicCenterData({
          mappedData: mappedData,
          securityData: securityData,
        });
    } catch (err) {
      console.log(err);
    }
  };

  console.log(fabric, 'cddon');

  return (
    <>
      <LogicCenter
        tenant={tenant}
        currentDrawing={currentDrawing}
        items={items}
        mappedData={mappedData}
        securityData={securityData}
        setMappedData={setMappedData}
        setSecurityData={setSecurityData}
        selectedLogic={selectedLogic}
        setShowLogic={setShowLogic}
        subFlow={subFlow}
        client={client}
        redisKey={redisKey}
      >
        <div>
          <TorusButton
            buttonClassName={`node-Update text-[white] font-[600] w-[5.36vw] h-[4.5vh] rounded-md text-[0.83vw]  flex justify-center items-center`}
            btncolor={`${selectedAccntColor}`}
            onPress={() => {
              handleSave();
            }}
            Children={
              <span
                style={{
                  color: `${isLightColor(selectedAccntColor) === 'light' ? '#000' : '#fff'}`,
                }}
              >
                Save
              </span>
            }
          />
        </div>
      </LogicCenter>
    </>
  );
};
export default LogicCenterMain;

const AnimatedButton = ({
  onClick,
  label,
  setBackShown,
  setSucessBtn,
  setFailureBtn,
  sucessBtn,
  failureBtn,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showFailuer, setShowFailuer] = useState(false);

  const handleClick = () => {
    try {
      setShowSuccess(false);
      setShowSpinner(true);

      onClick();
      setTimeout(() => {
        setShowSpinner(false);
        setShowSuccess(true);
        setSucessBtn(true);
        setTimeout(() => {
          setSucessBtn(false);
          setShowSuccess(true);
        }, 1500);
      }, 300);
    } catch (error) {
      console.log(error);
      setShowSuccess(false);
      setShowSpinner(true);

      onClick();
      setTimeout(() => {
        setShowSpinner(false);
        setShowFailuer(true);
        setFailureBtn(true);
        setTimeout(() => {
          setFailureBtn(false);
          setShowFailuer(true);
          setShowSuccess(true);
        }, 1500);
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '0.85vw 0.85vw',
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
      className={`bg-transparent `}
    >
      {showSuccess && !showSpinner && (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SuccessIcon
            className={`h-[0.93vw] w-[0.93vw] fill-[#000000] ${failureBtn || sucessBtn ? 'fill-white' : 'fill-black'} `}
          />
        </div>
      )}

      {showSpinner && !showSuccess && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SuccessIcon
            className={`h-[0.93vw] w-[0.93vw] fill-[#000000] ${failureBtn || sucessBtn ? 'fill-white' : 'fill-black'} `}
          />
        </div>
      )}

      {showFailuer && !showSpinner && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FailureIcon
            className={`h-[0.93vw] w-[0.93vw] fill-[#000000] ${failureBtn || sucessBtn ? 'fill-white' : 'fill-black'} `}
          />
        </div>
      )}

      {label && (
        <span
          className={` ${
            sucessBtn && !failureBtn
              ? 'text-white'
              : !sucessBtn && failureBtn
                ? 'text-white'
                : !sucessBtn && !failureBtn
                  ? 'text-black'
                  : ''
          } text-[0.83vw] font-[600]`}
        >
          {label}
        </span>
      )}
    </button>
  );
};
