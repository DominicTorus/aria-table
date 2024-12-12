import React, { useState } from 'react';

import JsonSidebarDetail from '../../jonui/Sidebar/JsonSidebarDetail';
import { JsonSidebarIcon } from '../../jonui/Sidebar/JsonSidebarIcon';

export default function FabricsSideBar({
  obj,
  handlejs,
  OgJson,
  showNodeProperty,
  sideBarData,
  currentDrawing,
  setShowNodeProperty,
  setToggleReactflow,
  nodeInfoTabs,
  setDupJson,
  handleAddjs,
  handleDeletejs,
  renderFor,
  selectedTheme,
}) {
  const [showObj, setShowObj] = useState();
  const [label, setLabel] = useState(null);
  const [checkActivestatus, setCheckActivestatus] = useState(null);
  const [expandedItem, setExpandedItem] = useState([]);

  const [path, setPath] = useState(null);

  return (
    <div className="flex h-[100%]   w-full max-w-full flex-row overflow-hidden ">
      <div
        style={{
          height: 'inherit',
          backgroundColor: `${selectedTheme?.bg}`,
          borderColor: `${selectedTheme?.border}`,
        }}
        className={`${
          renderFor == 'events'
            ? 'relative h-[70%] w-[12%] overflow-y-scroll border-r pr-[0.4vw]  '
            : 'relative w-[10%] border-r  pr-[0.5vw]'
        } `}
      >
        <JsonSidebarIcon
          key={'iconBar'}
          showObj={showObj}
          setShowObj={setShowObj}
          obj={obj}
          setPath={setPath}
          setLabel={setLabel}
          setCheckActivestatus={setCheckActivestatus}
          checkActivestatus={checkActivestatus}
          setExpandedItem={setExpandedItem}
          selectedTheme={selectedTheme}
        />

        {/* <FabricsSideBarIconTab  color={color}/> */}
      </div>
      <div
        className={`${renderFor === 'events' ? 'w-[87%]  dark:bg-[#161616]' : 'w-[90%]  dark:bg-[#161616]'} `}
        style={{
          backgroundColor: `${selectedTheme?.bg}`,
        }}
      >
        <div className=" h-full w-full">
          <JsonSidebarDetail
            showObj={showObj}
            obj={obj}
            handlejs={handlejs}
            path={path}
            label={label}
            OgJson={OgJson}
            handleAddjs={handleAddjs}
            handleDeletejs={handleDeletejs}
            checkActivestatus={checkActivestatus}
            setExpandedItem={setExpandedItem}
            expandedItem={expandedItem}
            renderFor={renderFor}
            selectedTheme={selectedTheme}
          />
        </div>
        {/* <FabricsSideBarDetails /> */}
      </div>
    </div>
  );
}
