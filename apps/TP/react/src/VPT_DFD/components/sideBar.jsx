import React, { useEffect, useState } from 'react';
import { useNodesState } from 'reactflow';
import NodeInfoSidebar from '../../../../commonComponents/NodeInfoSidebar';
import { getPropertyWindow } from '../api/index';

const SideBar = ({
  defaults,
  nodeConfig,
  customCodeKey,
  updatedNodeConfig,
  toogle,
  sideBarData,
  setSidebarData,
  currentDrawing,
  sideT,
  changeProperty,
  uniqueNames,
  setSidesJson,
}) => {
  const [err, setErr] = useState(false);
  const [propertywindow, setPropertywindow] = useState(false);
  const [nodeData, setNodeData] = useState(null);
  const [dupjson, setDupjson] = useState([]);
  const [nodes, setNodes] = useNodesState([]);

  useEffect(() => {
    try {
      return () => {
        setErr(false);
      };
    } catch (error) {
      console.error(error);
    }
  }, [sideBarData]);

  /**
   * Asynchronously handles the given node by retrieving its property window and updating the state.
   *
   * @param {type} node - description of the node parameter
   * @return {type} description of the return value
   */
  const handleFabrics = async (node) => {
    try {
      const propertyjson = await getPropertyWindow(node.type);
      setPropertywindow(propertyjson.propertyType);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *  Updates the JSON data and updates the state variables `dupjson`, `nodeData`, and `nodes`.
   *
   * @param {Object} json - The JSON data to be updated.
   * @return {void} This function does not return anything.
   */
  const updatejson = (json) => {
    try {
      setDupjson(structuredClone(json));
      setNodeData(structuredClone(json));

      let up = nodes.map((node) => {
        if (node.id === nodeData.id) {
          return { ...nodeData };
        }
        return node;
      });

      setNodes(up);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <NodeInfoSidebar
        defaults={defaults}
        customCodeKey={customCodeKey}
        nodeConfig={nodeConfig}
        updatedNodeConfig={updatedNodeConfig}
        currentDrawing={currentDrawing}
        visiblity={toogle}
        setSidesJson={setSidesJson}
        setVisiblity={sideT}
        handleFabrics={handleFabrics}
        propertywindow={propertywindow}
        sideT={sideT}
        sideBarData={sideBarData}
        setSidebarData={setSidebarData}
        funcNodedata={setNodeData}
        uniqueNames={uniqueNames}
        nodeData={sideBarData}
        jsonupdateFn={updatejson}
        setPropertywindow={setPropertywindow}
        changeProperty={changeProperty}
      />
    </React.Fragment>
  );
};

export default SideBar;
