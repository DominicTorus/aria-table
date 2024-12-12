import React, { useState } from 'react';

import { useEffect } from 'react';
import JsonViewer from './MAPPER/screens/JsonViewer';

export const Mapper = ({
  sideBarData,
  nodeConfig,
  updatedNodeConfig,
  setToggleReactflow,
}) => {
  const [json, setJson] = useState(null);
  useEffect(() => {
    if (sideBarData) {
      let id = sideBarData.id;
      if (sideBarData) {
        if (sideBarData?.data?.nodeProperty.hasOwnProperty('mapper')) {
          setJson(sideBarData.data.nodeProperty['mapper'] || {});
        } else {
          setJson(sideBarData.data.nodeProperty['mapper'] || {});
        }
      } else {
        if (sideBarData?.defaults?.['mapper']) {
          setJson(sideBarData?.defaults['mapper'] || nodeConfig[id]['data']);
        } else {
          setJson();
        }
      }
    }
  }, [sideBarData, nodeConfig]);

  const handleClick = () => {
    updatedNodeConfig(
      sideBarData.id,

      {
        nodeId: sideBarData.id,
        nodeName: sideBarData.data.label,
        nodeType: sideBarData.type,
      },
      {
        mapper: json,
      },
    );

    setToggleReactflow('fabrics');
  };

  return (
    <div>
      {
        <div>
          <JsonViewer
            value={json}
            handleClick={handleClick}
            onChange={(val) => setJson(val)}
            setToggleReactflow={setToggleReactflow}
          />
        </div>
      }
    </div>
  );
};
