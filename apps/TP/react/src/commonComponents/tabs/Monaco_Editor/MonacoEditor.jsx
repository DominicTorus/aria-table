import React, { useEffect, useState } from 'react';
import { TiArrowBackOutline } from 'react-icons/ti';
import CodeEditor from './components/CodeEditor';
import { codeObject } from './utils/api';

function MonacoEditor({
  fabricsKey,
  sideBarData,
  nodeConfig,
  updatedNodeConfig,
  setToggleReactflow,
}) {
  const [json, setJson] = useState('');
  const [myObj, setObj] = useState(null);
  useEffect(() => {
    try {
      if (sideBarData) {
        if (sideBarData) {
          if (sideBarData?.data.nodeProperty.hasOwnProperty('customCode')) {
            setJson(sideBarData?.data.nodeProperty['customCode']?.request.code);
          } else {
            setJson(
              sideBarData?.data.nodeProperty['customCode']?.request.code || '',
            );
          }
        } else {
          if (sideBarData?.defaults?.['customCode']) {
            setJson(sideBarData?.defaults['customCode']?.request.code || '');
          } else {
            setJson('');
          }
        }
      }
      if (sideBarData && fabricsKey) {
        codeObject(fabricsKey, sideBarData.data.label)
          .then((res) => {
            setObj(res);
          })
          .catch((err) => {
            throw err;
          });
      }
    } catch (error) {
      console.error(error);
    }
  }, [sideBarData, fabricsKey, nodeConfig]);

  const handleClick = () => {
    updatedNodeConfig(
      sideBarData.id,

      {
        nodeId: sideBarData.id,
        nodeName: sideBarData.data.label,
        nodeType: sideBarData.type,
      },

      {
        customCode: {
          request: {
            code: json,
          },
        },
      },
    );

    setToggleReactflow('fabrics');
  };

  return (
    <div className="h-[100%] w-[100%] bg-[#0f0a19] text-gray-500">
      <div className="h-[2%]">
        <p
          className=" z-50 ml-4 mt-2 w-[33px] rounded bg-[#4095FD]  p-2  text-center text-white hover:cursor-pointer"
          onClick={handleClick}
        >
          <TiArrowBackOutline />
        </p>
      </div>
      <div className="h-[98%]">
        <CodeEditor
          object={myObj}
          customCode={json}
          onChange={(val) => setJson(val)}
          fabricsKey={fabricsKey}
          nodeName={sideBarData?.data?.label}
        />
      </div>
    </div>
  );
}

export default MonacoEditor;
