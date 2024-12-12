/* eslint-disable*/
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { handleErrorLog } from '../../../commonComponents/api/errorlogApi';
import {
  applicationLists,
  artifactList,
  getNodeList,
  versionList,
} from '../../../commonComponents/api/fabricsApi';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import ReusableDropDown from '../../../commonComponents/reusableComponents/ReusableDropDown';
import { RenderJson } from '../../../jonui/JsonUI';
import { TorusModellerContext } from '../../../Layout';
const js = {
  orgGrp: [
    {
      grouplabel: 'Organization Group1',
      label: 'Organization Group',
      orgGrpName: 'orgGrp1',
      orgGrpCode: 'OG1',
      SIFlag: {
        label: 'SI Flag',
        type: 'boolean',
        selectedValue: false,
        selectionList: [true, false],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['O1', 'O2'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['O3', 'O4'],
      },
    },
    {
      grouplabel: 'Organization Group2',
      label: 'Organization Group2',
      orgGrpName: 'orgGrp2',
      orgGrpCode: 'OG2',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: [],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['O1', 'O2'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['O3', 'O4'],
      },
    },
  ],
  'orgGrp/0/org': [
    {
      grouplabel: 'Organization1',
      label: 'Organization',
      orgCode: 'O1',
      orgName: 'Org1',
    },
  ],
  'orgGrp/0/org/0/roleGrp': [
    {
      grouplabel: 'Role Group1',
      label: 'Role Group',
      roleGrpCode: 'RG1',
      roleGrpName: 'roleGrp1',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['A', 'E'],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['R1', 'R2'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['R3', 'R4'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/nodeType': { label: 'Node Type', value: 'roleGrp' },
  'orgGrp/0/org/0/roleGrp/0/roles': [
    {
      grouplabel: 'Role',
      label: 'Role',
      roleCode: 'R1',
      roleName: 'role1',
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp': [
    {
      grouplabel: 'Permission Set Group1',
      label: 'Permission Set Group',
      psGrpCode: 'PSG1',
      psGrpName: 'PSGrp1',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['A', 'E'],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['ps1', 'ps2'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['ps3', 'ps4'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps': [
    {
      grouplabel: 'Permission Set1',
      label: 'Permission Set',
      psCode: 'ps1',
      psName: 'PS1',
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/pf': [
    {
      grouplabel: 'Process Flow1',
      label: 'Process Flow',
      resourceType: 'ProcessFlow',
      resource: 'ABC:CG:ME:bankmaster:v1',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['A', 'E'],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['*', 'ManualInput'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['*', 'ManualInput'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/pf/0/nodeDetails': [
    {
      grouplabel: 'Node Details1',
      label: 'Node Details',
      id: '3e43a200-c58d-461e-8e7f-13365ded730d',
      resourceType: 'ProcessFlow',
      resource: 'ManualInput',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['A', 'E'],
      },
    },
    {
      grouplabel: 'Node Details2',
      label: 'Node Detailsdsff',
      id: '3e43a200-c58d-461e-8e7f-13365ded730d',
      resourceType: 'ProcessFlow',
      resource: 'ManualInput',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['A', 'E'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/pf/0/nodeDetails/0/actionAllowed':
    {
      label: 'Allowed Actions',
      type: 'multipleSelect',
      selectedValue: [],
      selectionList: ['*', 'Read', 'Execute', 'Debug'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/pf/0/nodeDetails/0/actionDenied':
    {
      label: 'Denied Actions',
      type: 'multipleSelect',
      selectedValue: [],
      selectionList: ['*', 'Read', 'Execute', 'Debug'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df': [
    {
      grouplabel: 'Data Flow1',
      label: 'Data Flow',
      resourceType: 'tables',
      resource: 'ABC:CG:ME:cg:v1',
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/tableDetails': [
    {
      grouplabel: 'Table Details1',
      label: 'Table Details',
      id: '38828038-b6a6-4da9-9931-7d1a71344fe1',
      resourceType: 'tables',
      resource: 'test_banks',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['A', 'E'],
      },
    },
    {
      label: 'Table Details',
      id: '115066c7-1363-4920-9710-d939739873ce',
      resourceType: 'tables',
      resource: 'psmv_banks',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: [],
        selectionList: ['A', 'E'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/tableDetails/0/actionAllowed':
    {
      label: 'Allowed Actions',
      type: 'multipleSelect',
      selectedValue: [],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/tableDetails/0/actionDenied':
    {
      label: 'Denied Actions',
      type: 'multipleSelect',
      selectedValue: [],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/tableDetails/1/actionAllowed':
    {
      label: 'Allowed Actions',
      type: 'multipleSelect',
      selectedValue: [],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/tableDetails/1/actionDenied':
    {
      label: 'Denied Actions',
      type: 'multipleSelect',
      selectedValue: [],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/apiDetails': [
    {
      grouplabel: 'API Details1',
      label: 'API Details',
      id: '38828038-b6a6-4da9-9931-7d1a71344fe1',
      resourceType: 'tables',
      resource: 'test_banks',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: 'A',
        selectionList: ['A', 'E'],
      },
    },
    {
      label: 'API Details',
      id: '115066c7-1363-4920-9710-d939739873ce',
      resourceType: 'tables',
      resource: 'psmv_banks',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: 'A',
        selectionList: ['A', 'E'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/apiDetails/0/actionAllowed':
    {
      label: 'Allowed Actions',
      type: 'multipleSelect',
      selectedValue: [],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/apiDetails/0/actionDenied':
    {
      label: 'Denied Actions',
      type: 'multipleSelect',
      selectedValue: ['*'],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/apiDetails/1/actionAllowed':
    {
      label: 'Allowed Actions',
      type: 'multipleSelect',
      selectedValue: ['*'],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/apiDetails/1/actionDenied':
    {
      label: 'Denied Actions',
      type: 'multipleSelect',
      selectedValue: ['*'],
      selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
    },
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/uf': [
    {
      grouplabel: 'User Functions1',
      label: 'User Functions',
      resourceType: 'Page',
      resource: 'ABC:CG:ME:branchmaster:v1',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: 'A',
        selectionList: ['A', 'E'],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: ['*'],
        selectionList: ['*', '', 'nav1'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: ['*'],
        selectionList: ['*', '', 'nav1'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/uf/0/componentDetails': [
    {
      grouplabel: 'Component Details1',
      label: 'Component Details',
      id: '2970d268-4425-40ae-969d-2ee9676adcf8',
      resourceType: 'Component',
      resource: 'masterForm',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: 'A',
        selectionList: ['A', 'E'],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: ['*'],
        selectionList: ['*', 'title', 'save', 'sub'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: ['*'],
        selectionList: ['*', 'title', 'save', 'sub'],
      },
    },
    {
      label: 'Component Details',
      id: '69f5e666-3699-4083-ac59-39adb61b586d',
      resourceType: 'Component',
      resource: 'nav1',
      SIFlag: {
        label: 'SI Flag',
        type: 'dropdown',
        selectedValue: 'A',
        selectionList: ['A', 'E'],
      },
      actionAllowed: {
        label: 'Allowed Actions',
        type: 'dropdown',
        selectedValue: ['*'],
        selectionList: ['*', 'masterNavbar'],
      },
      actionDenied: {
        label: 'Denied Actions',
        type: 'dropdown',
        selectedValue: ['*'],
        selectionList: ['*', 'masterNavbar'],
      },
    },
  ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/uf/0/componentDetails/0/controlDetails':
    [
      {
        grouplabel: 'Control Details1',
        label: 'Control Details',
        resourceType: 'controls',
        resource: 'title',
        SIFlag: {
          label: 'SI Flag',
          type: 'dropdown',
          selectedValue: 'A',
          selectionList: ['A', 'E'],
        },
        actionAllowed: {
          label: 'Allowed Actions',
          type: 'dropdown',
          selectedValue: 'Y',
          selectionList: ['*', 'Y', 'N'],
        },
        actionDenied: {
          label: 'Denied Actions',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Y', 'N'],
        },
      },
      {
        label: 'Control Detailsadws',
        resourceType: 'controls',
        resource: 'save',
        SIFlag: {
          label: 'SI Flag',
          type: 'dropdown',
          selectedValue: 'A',
          selectionList: ['A', 'E'],
        },
        actionAllowed: {
          label: 'Allowed Actions',
          type: 'dropdown',
          selectedValue: 'Y',
          selectionList: ['*', 'Y', 'N'],
        },
        actionDenied: {
          label: 'Denied Actions',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Y', 'N'],
        },
      },
      {
        label: 'Control Detailasd',
        resourceType: 'controls',
        resource: 'sub',
        SIFlag: {
          label: 'SI Flag',
          type: 'dropdown',
          selectedValue: 'A',
          selectionList: ['A', 'E'],
        },
        actionAllowed: {
          label: 'Allowed Actions',
          type: 'dropdown',
          selectedValue: 'Y',
          selectionList: ['*', 'Y', 'N'],
        },
        actionDenied: {
          label: 'Denied Actions',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Y', 'N'],
        },
      },
    ],
  'orgGrp/0/org/0/roleGrp/0/roles/0/psGrp/0/ps/0/df/0/uf/0/componentDetails/1/controlDetails':
    [
      {
        grouplabel: 'Control Details1',
        label: 'Control Details',
        resourceType: 'controls',
        resource: 'navbar',
        SIFlag: {
          label: 'SI Flag',
          type: 'dropdown',
          selectedValue: 'A',
          selectionList: ['A', 'E'],
        },
        actionAllowed: {
          label: 'Allowed Actions',
          type: 'dropdown',
          selectedValue: 'Y',
          selectionList: ['*', 'Y', 'N'],
        },
        actionDenied: {
          label: 'Denied Actions',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Y', 'N'],
        },
      },
    ],
};

const SFSidebar = ({
  updatedNodeConfig,
  setJson,
  currentModel,
  json,
  sendFabrics,
  sidebarVisible,
  tenant,
  group,
  application,
  updateconfig,
  sideBarData,
  cm,
}) => {
  const { darkMode } = useContext(DarkmodeContext);
  const [artifactsList, setArtifactsList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [versionsList, setVersionList] = useState([]);
  const [selectedJson, setSelectedJson] = useState({});
  const [selectedArtifacts, setSelectedArtifacts] = useState(null);
  const [selectedapplication, setSelectedApplication] = useState(null);
  const [selectedVerison, setSelectedVerison] = useState(null);
  const [gettingNodes, setGettingNodes] = useState([]);
  const [selectionNodeId, setSelectionNodeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [fabricsOptions, setFabricsOptions] = useState({});
  const [fabricsList, setFabricsList] = useState(null);

  const {
    client,
    selectedTkey,
    setSelectedTkey,
    handleTabChange,
    selectedFabric,
    selectedArtifact,
    setSelectedArtifact,
    selectedVersion,
    setSelectedVersion,
    selectedProject,
    setSelectedProject,
  } = useContext(TorusModellerContext);
  {
    console.log(json, 'sd');
  }

  /**
   * Updates the selected JSON object based on the provided event and name.
   *
   * @param {Object} e - The event object.
   * @param {string} name - The name of the JSON object.
   * @return {void} This function does not return a value.
   */
  const updateselectedJson = (e) => {
    try {
      console.log(e, '--josnui=');
      if (Object.keys(e).length > 0) {
        setSelectedJson(e);
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(selectedJson, '-<--sdfsf---->');
  const getArtifacts = async (selectedApplicationss) => {
    try {
      const response = await artifactList(
        sendFabrics,
        JSON.stringify([
          client,
          selectedTkey,
          sendFabrics,
          selectedApplicationss,
          'pgrp',
        ]),
        false,
      );
      if (response && response?.status === 200) {
        setArtifactsList(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Retrieves a list of versions for the given artifacts.
   *
   * @param {Array} selectedArtifacts - The list of selected artifacts.
   * @return {Promise<void>} A Promise that resolves when the versions are retrieved.
   */
  const getVersions = async (selectedArtifacts) => {
    try {
      const response = await versionList(
        selectedArtifacts,
        sendFabrics,
        JSON.stringify([
          client,
          selectedTkey,
          sendFabrics,
          Array.from(selectedapplication)[0],
          'pgrp',
        ]),
      );
      if (response && response.data) {
        setVersionList(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Updates the fabric options based on the provided details and type.
   *
   * @param {Object} js - The fabric options object.
   * @param {Array} details - The details of the fabric options.
   * @param {string} type - The type of fabric options.
   * @return {Object} The updated fabric options object.
   */
  const handleFabricsOptions = (js, details, type) => {
    try {
      if (details && details.length > 0) {
        if (
          js.hasOwnProperty('actionAllowed') &&
          js.hasOwnProperty('actionDenied')
        ) {
          return {
            ...js,
            actionAllowed: {
              ...js?.actionAllowed,
              label: 'Allowed Actions',
              type: 'dropdown',
              selectionList: ['*', ...details?.map((item) => item.resource)],
            },
            actionDenied: {
              ...js?.actionDenied,
              label: 'Denied Actions',
              type: 'dropdown',
              selectionList: ['*', ...details?.map((item) => item.resource)],
            },
            [type]: details,
          };
        } else {
          return {
            ...js,
            actionAllowed: {
              label: 'Allowed Actions',
              type: 'dropdown',
              selectedValue: ['*'],
              selectionList: ['*', ...details?.map((item) => item.resource)],
            },
            actionDenied: {
              label: 'Denied Actions',
              type: 'dropdown',
              selectedValue: ['*'],
              selectionList: ['*', ...details?.map((item) => item.resource)],
            },
            [type]: details,
          };
        }
      } else {
        return {
          ...js,
          ...fabricsOptions,
          [type]: details,
        };
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Retrieves the nodes based on selected version, artifacts, application, tenant, group, and fabric details.
   *
   * @return {void} Sets the retrieved nodes using setGettingNodes.
   */
  const getNodes = useCallback(() => {
    try {
      getNodeList(
        sendFabrics,
        JSON.stringify([
          client,
          selectedTkey,
          sendFabrics,
          Array.from(selectedapplication)[0],
          'pgrp',
          Array.from(selectedArtifacts)[0],
          Array.from(selectedVerison)[0],
        ]),
        sendFabrics,
      )
        .then((response) => {
          if (response && response.data) {
            setGettingNodes(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [
    selectedapplication,
    selectedVerison,
    selectedArtifacts,
    tenant,
    group,
    sendFabrics,
  ]);

  /**
   * Generates an array of control objects based on the provided control array.
   *
   * @param {Array} control - The array of control objects.
   * @return {Array} An array of control objects with the following properties:
   *   - resourceType: The resource type of the control.
   *   - resource: The resource name of the control.
   *   - SIFlag: An object with the following properties:
   *     - type: The type of the dropdown.
   *     - selectedValue: The selected value of the dropdown.
   *     - selectionList: The list of available selection values.
   *   - actionAllowed: An object with the following properties:
   *     - type: The type of the dropdown.
   *     - selectedValue: The selected value of the dropdown.
   *     - selectionList: The list of available selection values.
   *   - actionDenied: An object with the following properties:
   *     - type: The type of the dropdown.
   *     - selectedValue: The selected value of the dropdown.
   *     - selectionList: The list of available selection values.
   * If the control array is empty, an empty array is returned.
   */
  const handleControl = (control) => {
    if (control && control.length > 0) {
      return (
        control &&
        control.map((item) => {
          return {
            label: 'controls',
            resourceType: 'controls',
            resource: item.nodeName || '',
            // SIFlag: {
            //   label:"SI Flag",
            //   type: "dropdown",
            //   selectedValue: "A",
            //   selectionList: ["A", "E"],
            // },
            // actionAllowed: {
            //   label: "Allowed Actions",
            //   type: "dropdown",
            //   selectedValue: ["*"],
            //   selectionList: ["*", "Y", "N"],
            // },
            // actionDenied: {
            //   label: "Denied Actions",
            //   type: "dropdown",
            //   selectedValue: ["*"],
            //   selectionList: ["*", "Y", "N"],
            // },
          };
        })
      );
    } else return [];
  };

  /**
   * Handles the selection of nodes based on the value of `sendFabrics`.
   * If `sendFabrics` is "pf" or "PF", it filters the selected nodes from `selectionNodeId` and updates the `selectedJson` object accordingly.
   * If `sendFabrics` is "df" or "DF", it filters the selected nodes from `selectionNodeId` and updates the `selectedJson` object for `tableDetails` and `apiDetails`.
   * If `sendFabrics` is "uf" or "UF", it filters the selected nodes from `selectionNodeId` and updates the `selectedJson` object for `componentDetails`.
   *
   * @return {void} This function does not return anything.
   */
  const handleNodeSelection = useCallback(() => {
    try {
      if (sendFabrics === 'pf' || sendFabrics === 'PF') {
        let nodeIds = Array.from(selectionNodeId);

        let js = selectedJson;
        if (nodeIds && nodeIds.length > 0) {
          if (js.nodeDetails.length > 0) {
            js.nodeDetails = js.nodeDetails.filter((item) =>
              nodeIds.includes(item.id),
            );
            if (js.nodeDetails.length !== nodeIds.length) {
              let jsIds = js?.nodeDetails?.forEach((item) => item.id);
              let diff = nodeIds.filter((x) => !jsIds.includes(x));
              if (diff.length > 0) {
                let selectedN = gettingNodes.filter((item) => {
                  return diff && diff.includes(item.nodeId);
                });
                let ds = selectedN.map((item) => {
                  return {
                    label: 'Process Flow',
                    id: item.nodeId,
                    resourceType: 'ProcessFlow',
                    resource: item.nodeName || item?.data?.label || '',
                    SIFlag: {
                      label: 'SI Flag',
                      type: 'dropdown',
                      selectedValue: 'A',
                      selectionList: ['A', 'E'],
                    },
                    ...fabricsOptions,
                    nodeDetails: [],
                  };
                });
                js = {
                  ...handleFabricsOptions(
                    js,
                    [...js.nodeDetails, ...ds],
                    'nodeDetails',
                  ),
                };
              }
            } else {
              js = {
                ...handleFabricsOptions(
                  js,
                  js.nodeDetails || [],
                  'nodeDetails',
                ),
              };
            }
          } else {
            let selectedN = gettingNodes.filter((item) => {
              return nodeIds && nodeIds.includes(item.nodeId);
            });
            let ds = selectedN.map((item) => {
              return {
                label: 'Process Flow',
                id: item.nodeId,
                resourceType: 'ProcessFlow',
                resource: item.nodeName || item?.data?.label || '',

                SIFlag: {
                  label: 'SI Flag',
                  type: 'dropdown',
                  selectedValue: 'A',
                  selectionList: ['A', 'E'],
                },
                ...fabricsOptions,
              };
            });

            js = {
              ...handleFabricsOptions(js, ds, 'nodeDetails'),
            };
          }
        } else {
          js = {
            ...handleFabricsOptions(js, [], 'nodeDetails'),
          };
        }
        updateselectedJson(js, 'nodeDetails');
      }
      if (sendFabrics === 'df' || sendFabrics === 'DF') {
        let nodeIds = Array.from(selectionNodeId);
        let js = selectedJson;

        if (nodeIds && nodeIds.length > 0) {
          if (js.tableDetails.length > 0 || js.apiDetails.length > 0) {
            js.tableDetails = js.tableDetails.filter((item) =>
              nodeIds.includes(item.id),
            );
            js.apiDetails = js.apiDetails.filter((item) =>
              nodeIds.includes(item.id),
            );
            if (
              js.tableDetails.length !== nodeIds.length ||
              js.apiDetails.length !== nodeIds.length
            ) {
              let jsIds = js.tableDetails?.map((item) => item.id);
              let diff = nodeIds.filter((x) => !jsIds.includes(x));
              if (diff.length > 0) {
                let selectedN = gettingNodes.filter((item) => {
                  return diff && diff.includes(item.nodeId);
                });
                let ds = selectedN?.map((item) => {
                  return {
                    label: 'Tables',
                    id: item.nodeId,
                    resourceType: 'tables',
                    resource: item.nodeName || item?.data?.label || '',
                    SIFlag: {
                      label: 'SI Flag',
                      type: 'dropdown',
                      selectedValue: 'A',
                      selectionList: ['A', 'E'],
                    },
                    ...fabricsOptions,
                  };
                });
                js = {
                  ...handleFabricsOptions(
                    js,
                    [...js.tableDetails, ...ds],
                    'tableDetails',
                  ),
                };
                js = {
                  ...handleFabricsOptions(
                    js,
                    [...js.apiDetails, ...ds],
                    'apiDetails',
                  ),
                };
              }
            } else {
              js = {
                ...js,
                tableDetails: [...(js.tableDetails || [])],
                apiDetails: [...(js.apiDetails || [])],
              };
            }
          } else {
            let selectedN = gettingNodes.filter((item) => {
              return nodeIds && nodeIds.includes(item.nodeId);
            });
            let ds = selectedN?.map((item) => {
              return {
                label: 'Tables',
                id: item.nodeId,
                resourceType: 'tables',
                resource: item.nodeName || item?.data?.label || '',
                SIFlag: {
                  label: 'SI Flag',
                  type: 'dropdown',
                  selectedValue: 'A',
                  selectionList: ['A', 'E'],
                },
                ...fabricsOptions,
              };
            });

            js = {
              ...handleFabricsOptions(
                js,
                [...js.tableDetails, ...ds],
                'tableDetails',
              ),
            };
            js = {
              ...handleFabricsOptions(
                js,
                [...js.apiDetails, ...ds],
                'apiDetails',
              ),
            };
          }
        } else {
          js = {
            ...js,
            tableDetails: [],
            apiDetails: [],
          };
        }

        updateselectedJson(js, 'nodeDetails');
      }
      if (sendFabrics === 'uf' || sendFabrics === 'UF') {
        let nodeIds = Array.from(selectionNodeId);
        let js = selectedJson;
        if (nodeIds && nodeIds.length > 0) {
          if (js.componentDetails.length > 0) {
            js.componentDetails = js.componentDetails.filter((item) =>
              nodeIds.includes(item.id),
            );
            if (js.componentDetails.length !== nodeIds.length) {
              let jsIds = js.componentDetails?.map((item) => item.id);
              let diff = nodeIds.filter((x) => !jsIds.includes(x));
              if (diff.length > 0) {
                let selectedN = gettingNodes.filter((item) => {
                  return diff && diff.includes(item.nodeId);
                });

                let dts = selectedN?.map((item) => {
                  return {
                    ...handleFabricsOptions(
                      {
                        label: 'Components',
                        id: item.nodeId,
                        resourceType: 'Component',
                        resource:
                          item.nodeName || item?.data?.label || item.nodeType,
                        SIFlag: {
                          label: 'SI Flag',
                          type: 'dropdown',
                          selectedValue: 'A',
                          selectionList: ['A', 'E'],
                        },
                      },
                      handleControl(item.control),
                      'controlDetails',
                    ),
                  };
                });
                js = {
                  ...handleFabricsOptions(
                    js,
                    [...js.componentDetails, ...dts],
                    'componentDetails',
                  ),
                };
              }
            } else {
              js = {
                ...handleFabricsOptions(
                  js,
                  js?.componentDetails,
                  'componentDetails',
                ),
              };
            }
          } else {
            let selectedN = gettingNodes.filter((item) => {
              return nodeIds && nodeIds.includes(item.nodeId);
            });
            let dts = selectedN?.map((item) => {
              return {
                ...handleFabricsOptions(
                  {
                    label: 'Components',
                    id: item.nodeId,
                    resourceType: 'Component',
                    resource:
                      item.nodeName || item?.data?.label || item.nodeType,
                    SIFlag: {
                      label: 'SI Flag',
                      type: 'dropdown',
                      selectedValue: 'A',
                      selectionList: ['A', 'E'],
                    },
                  },
                  handleControl(item.control),
                  'controlDetails',
                ),
              };
            });
            js = {
              ...handleFabricsOptions(
                js,
                [...js.componentDetails, ...dts],
                'componentDetails',
              ),
            };
          }
        } else {
          js = {
            ...handleFabricsOptions(js, [], 'componentDetails'),
          };
        }
        updateselectedJson(js, 'nodeDetails');
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    selectionNodeId,
    sendFabrics,
    gettingNodes,
    handleControl,
    handleFabricsOptions,
    updateselectedJson,
  ]);

  useEffect(() => {
    if (selectionNodeId) {
      handleNodeSelection();
    }
  }, [selectionNodeId]);

  console.log(json, 'nodeid');

  //this function for change the structure of json
  useEffect(() => {
    try {
      getNodes();
      if (
        selectedVerison &&
        json?.[currentModel] &&
        json?.[currentModel].length > 0
      ) {
        let filterJson = json?.[currentModel].filter((item) => {
          return (
            item.resource ===
            client +
              ':' +
              selectedTkey +
              ':' +
              sendFabrics +
              ':' +
              Array.from(selectedapplication)[0] +
              ':' +
              'pgrp' +
              ':' +
              Array.from(selectedArtifacts)[0] +
              ':' +
              Array.from(selectedVerison)[0]
          );
        });

        if (filterJson && filterJson.length > 0) {
          let selectedJsons;
          if (sendFabrics === 'pf' || sendFabrics === 'PF') {
            selectedJsons = filterJson[0]?.nodeDetails;
          }
          if (sendFabrics === 'df' || sendFabrics === 'DF') {
            selectedJsons = filterJson[0]?.tableDetails;
          }
          if (sendFabrics === 'uf' || sendFabrics === 'UF') {
            selectedJsons = filterJson[0]?.componentDetails;
          }

          updateselectedJson(filterJson[0]);
          if (selectedJsons && selectedJsons.length > 0) {
            setSelectionNodeId(
              new Set(
                selectedJsons?.map((item) => {
                  return item.id;
                }),
              ),
            );
          }
        } else {
          if (sendFabrics === 'pf' || sendFabrics === 'PF') {
            updateselectedJson({
              label: 'ProcessFlow',
              resourceType: 'ProcessFlow',
              resource:
                client +
                ':' +
                selectedTkey +
                ':' +
                sendFabrics +
                ':' +
                Array.from(selectedapplication)[0] +
                ':' +
                'pgrp' +
                ':' +
                Array.from(selectedArtifacts)[0] +
                ':' +
                Array.from(selectedVerison)[0],
              SIFlag: {
                label: 'SI Flag',
                type: 'dropdown',
                selectedValue: 'A',
                selectionList: ['A', 'E'],
              },
              ...fabricsOptions,
              nodeDetails: [],
            });
          }
          if (sendFabrics === 'df' || sendFabrics === 'DF') {
            updateselectedJson({
              label: 'tables',
              resourceType: 'tables',
              resource:
                client +
                ':' +
                selectedTkey +
                ':' +
                sendFabrics +
                ':' +
                Array.from(selectedapplication)[0] +
                ':' +
                'pgrp' +
                ':' +
                Array.from(selectedArtifacts)[0] +
                ':' +
                Array.from(selectedVerison)[0],

              tableDetails: [],
              apiDetails: [],
            });
          }
          if (sendFabrics === 'uf' || sendFabrics === 'UF') {
            updateselectedJson({
              label: 'Page',
              resourceType: 'Page',
              resource:
                client +
                ':' +
                selectedTkey +
                ':' +
                sendFabrics +
                ':' +
                Array.from(selectedapplication)[0] +
                ':' +
                'pgrp' +
                ':' +
                Array.from(selectedArtifacts)[0] +
                ':' +
                Array.from(selectedVerison)[0],
              SIFlag: {
                label: 'SI Flag',
                type: 'dropdown',
                selectedValue: 'A',
                selectionList: ['A', 'E'],
              },
              ...fabricsOptions,
              componentDetails: [],
            });
          }
        }
      } else if (selectedVerison) {
        if (sendFabrics === 'pf' || sendFabrics === 'PF') {
          updateselectedJson({
            label: 'roote',
            resourceType: 'ProcessFlow',
            resource:
              client +
              ':' +
              selectedTkey +
              ':' +
              sendFabrics +
              ':' +
              Array.from(selectedapplication)[0] +
              ':' +
              'pgrp' +
              ':' +
              Array.from(selectedArtifacts)[0] +
              ':' +
              Array.from(selectedVerison)[0],

            SIFlag: {
              label: 'SI Flag',
              type: 'dropdown',
              selectedValue: ['A'],
              selectionList: ['A', 'E'],
            },
            ...fabricsOptions,
            nodeDetails: [],
          });
        }
        if (sendFabrics === 'df' || sendFabrics === 'DF') {
          updateselectedJson({
            label: 'tables',
            resourceType: 'tables',
            resource:
              client +
              ':' +
              selectedTkey +
              ':' +
              sendFabrics +
              ':' +
              Array.from(selectedapplication)[0] +
              ':' +
              'pgrp' +
              ':' +
              Array.from(selectedArtifacts)[0] +
              ':' +
              Array.from(selectedVerison)[0],
            tableDetails: [],
            apiDetails: [],
          });
        }
        if (sendFabrics === 'uf' || sendFabrics === 'UF') {
          updateselectedJson({
            label: 'Page',
            resourceType: 'Page',
            resource:
              client +
              ':' +
              selectedTkey +
              ':' +
              sendFabrics +
              ':' +
              Array.from(selectedapplication)[0] +
              ':' +
              'pgrp' +
              ':' +
              Array.from(selectedArtifacts)[0] +
              ':' +
              Array.from(selectedVerison)[0],
            SIFlag: {
              label: 'SI Flag',
              type: 'dropdown',
              selectedValue: 'A',
              selectionList: ['A', 'E'],
            },
            ...fabricsOptions,
            componentDetails: [],
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    selectedVerison,
    sendFabrics,
    selectedapplication,
    fabricsOptions,

    selectedArtifacts,
    tenant,
    group,
    json,
  ]);

  console.log(json[currentModel], 'jsoncg');
  useEffect(() => {
    try {
      let options = {
        actionAllowed: [],
        actionDenied: [],
      };

      if (sendFabrics === 'pf' || sendFabrics === 'PF') {
        options.actionAllowed = {
          label: 'optionsAllowed',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Read', 'Execute', 'Debug'],
        };
        options.actionDenied = {
          label: 'optionsDenied',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Read', 'Execute', 'Debug'],
        };
      }
      if (sendFabrics === 'df' || sendFabrics === 'DF') {
        options.actionAllowed = {
          label: 'optionsAllowed',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
        };
        options.actionDenied = {
          label: 'optionsDenied',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'GET', 'GETBYONE', 'POST', 'UPDATE', 'DELETE'],
        };
      }
      if (sendFabrics === 'uf' || sendFabrics === 'UF') {
        options.actionAllowed = {
          label: 'optionsAllowed',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Y', 'N'],
        };
        options.actionDenied = {
          label: 'optionsDenied',
          type: 'dropdown',
          selectedValue: ['*'],
          selectionList: ['*', 'Y', 'N'],
        };
      }
      setFabricsOptions(options);
    } catch (error) {
      console.error(error);
    }
  }, [sendFabrics]);

  // Add dependencies if necessary
  const getapplicationList = async () => {
    try {
      const response = await applicationLists(
        JSON.stringify([client, selectedTkey, selectedFabric]),
      );

      if (response && response.status === 200) {
        setApplicationList(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      getapplicationList();
    } catch (error) {
      const errObj = {
        tname: 'TM',
        errGrp: 'Technical',
        fabrics: 'SF',
        errType: 'Fatal',
        errCode: 'TM005',
      };
      const Token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoidGVzdCIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsIjJGQUZsYWciOiJZIiwicm9sZSI6InNlbmlvcmRldiIsImNsaWVudCI6IkFCQyIsImlhdCI6MTcxOTU1NDIyOX0.1Gk5Lpf14W9twZEYxov1pik1vYunYP5CwKEoG2YEKG4';

      const key = `${tenant}:${group}:${applicationList}:${'SF'}:"":""`;

      const errorMessage = 'Cannot load Flow details';
      const statusCode = '400';

      handleErrorLog(errObj, Token, key, errorMessage, statusCode)
        .then((res) => {
          console.log(res, 'res');
        })
        .catch((err) => {
          console.error(err);
        });

      console.error(error);
    }

    return () => {
      setArtifactsList([]);
      setVersionList([]);
      setSelectedArtifacts(null);
      setSelectedVerison(null);
      setSelectedNode(null);
    };
  }, [tenant, group, sendFabrics]);

  const handleApplicationChange = (e) => {
    try {
      setSelectedArtifacts(null);
      if (Array.from(e)[0]) {
        getArtifacts(Array.from(e)[0]);
      } else {
        setArtifactsList([]);
      }
      setSelectedApplication(e);
    } catch (err) {
      console.error(err);
    }
  };

  // Add dependencies if necessar
  const handleArtifactsChange = (e) => {
    try {
      setSelectedVerison(null);
      if (Array.from(e)[0]) {
        getVersions(Array.from(e)[0]);
      } else {
        setVersionList([]);
      }
      setSelectedArtifacts(e);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-70  w-full dark:bg-[#161616]  ">
      {/**Artifacts & Version Secetions based on the seleceted fabric  */}
      <div className="mb-2">
        <Button
          variant="outline"
          className={`${
            !darkMode
              ? 'w-15 left-2 top-2 rounded-md  border border-slate-600  bg-[#368289] px-2 text-[#F4F4F5] '
              : ' w-15 left-2 top-2 rounded-md  border-slate-400/30 bg-[#023F8A] px-2 text-white '
          }`}
          size="sm"
          onClick={() => {
            setJson((prev) => {
              const currentModelData = Array.isArray(prev?.[currentModel])
                ? prev?.[currentModel]
                : [];
              updateconfig(
                sideBarData?.id,
                {
                  nodeId: sideBarData?.id,
                  nodeName: sideBarData?.data?.label,
                  nodeType: sideBarData?.type,
                },
                {
                  [currentModel]: [
                    ...currentModelData.filter(
                      (item) => item.resource !== selectedJson.resource,
                    ),
                    selectedJson,
                  ],
                },
              );
              return {
                ...prev,
                [currentModel]: [
                  ...currentModelData.filter(
                    (item) => item.resource !== selectedJson.resource,
                  ),
                  selectedJson,
                ],
              };
            });

            toast.success('Data saved successfully!', {
              position: 'bottom-right',
              theme: darkMode ? 'dark' : 'light',
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }}
        >
          Save Data
        </Button>
      </div>

      <div className=" grid h-[20%] w-full grid-cols-6 gap-1 px-2 py-2">
        <div className="col-span-3">
          {/** Application Secetions based on the seleceted fabrics  */}
          <ReusableDropDown
            isDisabled={
              applicationList && applicationList.length < 0 ? true : false
            }
            darkMode={darkMode}
            key={'sfApplication'}
            title={
              (selectedapplication && Array.from(selectedapplication)[0]) ||
              'Application'
            }
            selectedKey={selectedapplication}
            DropdownMenuClassName={
              applicationList && applicationList.length > 6
                ? 'h-56 overflow-y-scroll'
                : ''
            }
            handleSelectedKey={handleApplicationChange}
            items={
              applicationList &&
              applicationList?.map((item, index) => {
                return {
                  key: item,
                  label: item,
                };
              })
            }
          />

          {applicationList && applicationList.length > 0 && (
            <div>
              {applicationList.length > 0 && (
                <div className="flex items-center justify-center text-xs text-gray-400">
                  {applicationList &&
                    applicationList.length > 0 &&
                    applicationList?.forEach((obj) => {
                      <p>{obj}</p>;
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-span-3">
          {/** Artifacts Secetions based on the seleceted fabrics  */}
          <ReusableDropDown
            isDisabled={
              artifactsList && artifactsList.length < 0 ? true : false
            }
            darkMode={darkMode}
            key={'sfArtifact'}
            title={
              (selectedArtifacts && Array.from(selectedArtifacts)[0]) ||
              'Artifacts'
            }
            selectedKey={selectedArtifacts}
            DropdownMenuClassName={
              artifactsList && artifactsList.length > 6
                ? 'h-56 overflow-y-scroll'
                : ''
            }
            handleSelectedKey={handleArtifactsChange}
            items={
              artifactsList &&
              artifactsList?.map((item, index) => {
                return {
                  key: item,
                  label: item,
                };
              })
            }
          />

          {artifactsList && artifactsList.length > 0 && (
            <div>
              {artifactsList.length > 0 && (
                <div className="flex items-center justify-center text-xs text-gray-400">
                  {artifactsList &&
                    artifactsList.length > 0 &&
                    artifactsList?.forEach((obj) => {
                      <p>{obj}</p>;
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-span-3">
          {/** Versions Secetions based on the seleceted fabrics  */}
          <ReusableDropDown
            darkMode={darkMode}
            key={'sfversion'}
            title={
              (selectedVerison && Array.from(selectedVerison)[0]) || 'Version'
            }
            selectedKey={selectedVerison}
            DropdownMenuClassName={
              versionsList && versionsList.length > 6
                ? 'h-30 overflow-y-scroll  '
                : ''
            }
            handleSelectedKey={setSelectedVerison}
            items={
              versionsList &&
              versionsList?.map((item, index) => {
                return {
                  key: item,
                  label: item,
                };
              })
            }
          />
        </div>

        {console.log(gettingNodes, 'get')}
        {/*Node name and node id have to dispaly on this Selection*/}
        <div className="col-span-3">
          <Dropdown
            classNames={{
              base: 'w-full',
              content: 'w-full p-1 ',
            }}
          >
            <DropdownTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={`${
                  darkMode
                    ? 'w-full border border-slate-400/30 text-[#F4F4F5] '
                    : 'w-full border border-slate-400/30 text-black '
                }`}
              >
                <span
                  className="truncate "
                  title={
                    (selectedNode && Array.from(selectedNode).join(',')) ||
                    'Node'
                  }
                >
                  {(selectedNode && Array.from(selectedNode).join(',')) ||
                    'Node'}
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              className={
                gettingNodes && gettingNodes.length > 6
                  ? 'h-30 overflow-y-scroll  '
                  : ''
              }
              itemClasses={{
                base: [
                  'rounded-md',
                  'text-white font-bold',
                  'transition-opacity',
                  'data-[hover=true]:text-pink-500 font-bold',
                  'data-[hover=true]:bg-gray-600/40 ',
                  'dark:data-[hover=true]:bg-[#1E1E1E]',
                  'data-[selectable=true]:focus:bg-gray-600/40',
                  'data-[pressed=true]:opacity-70',
                  'data-[focus-visible=true]:ring-default-500',
                ],
                selectedIcon: 'w-1 h-1 flex items-center',
              }}
              classNames={{
                base: 'bg-[#1E1E1E] text-white font-bold p-[5px] rounded-lg ',
              }}
              closeOnSelect={false}
              selectionMode="multiple"
              selectedKeys={selectionNodeId}
              onSelectionChange={(key) => {
                setSelectionNodeId(key);
              }}
              items={
                gettingNodes &&
                gettingNodes?.map((obj, index) => {
                  return {
                    key: obj.nodeId,
                    label: obj.nodeName || obj.nodeType,
                    type: obj.nodeType,
                  };
                })
              }
            >
              {(item, index) => (
                <DropdownItem
                  key={item.key}
                  color={item.key === 'delete' ? 'danger' : 'default'}
                  className={item.key === 'delete' ? 'text-danger' : ''}
                >
                  <div className="flex w-[100%] items-center gap-2">
                    <Avatar
                      alt={item.label}
                      className="w-[20%] flex-shrink-0"
                      size="sm"
                      name={item.type}
                    />
                    <div className="flex w-[80%] flex-col">
                      <span className="text-small text-slate-200">
                        {item.label === ''
                          ? 'Node name is not available'
                          : item.label}
                      </span>
                      <span className="text-tiny text-slate-400">
                        {item.key}
                      </span>
                    </div>
                  </div>
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* SI Flag selction */}
      </div>
      {console.log(selectedJson, 'sdelectedJson')}
      {selectedJson && (
        <div className="h-96 overflow-y-scroll  dark:bg-[#161616]">
          <RenderJson
            json={selectedJson}
            setSFjson={updateselectedJson}
            updatedNodeConfig={setFabricsList}
          />
        </div>
      )}
    </div>
  );
};

export default SFSidebar;
