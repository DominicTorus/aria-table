import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import {
  Documents,
  ElementInfo,
  Enities,
  Enumeration,
  SourceIcon,
} from '../asset/SvgsApplication';
import FabricsSideBar from '../sidebars/fabricsSideBar/FabricsSideBar';

const RenderObject = ({
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
}) => {
  return (
    <>
      {
        <FabricsSideBar
          obj={obj}
          handlejs={handlejs}
          OgJson={OgJson}
          showNodeProperty={showNodeProperty}
          sideBarData={sideBarData}
          currentDrawing={currentDrawing}
          setShowNodeProperty={setShowNodeProperty}
          setToggleReactflow={setToggleReactflow}
          nodeInfoTabs={nodeInfoTabs}
          setDupJson={setDupJson}
          handleAddjs={handleAddjs}
          handleDeletejs={handleDeletejs}
          renderFor={renderFor}
          selectedTheme={selectedTheme}
        />
      }
    </>
  );
};

export const nodeInfoTabs = {
  'PF-PFD': [
    {
      label: 'Data',
      icon: SourceIcon,
      modelOpen: 'data',
    },
    // {
    //   label: "Mapper",
    //   icon: <MapperIcon />,
    //   modelOpen: "mapper",
    // },
    // {
    //   label: "Rule",
    //   icon: <RulesIcon />,
    //   modelOpen: "rule",
    // },
    // {
    //   label: "CustomCode",
    //   icon: <CustomCode />,
    //   modelOpen: "customCode",
    // },
    // {
    //   label: "Events",
    //   icon: Validation,
    //   modelOpen: "events",
    // },
    // {
    //   label: "Security",
    //   icon: Security,
    //   modelOpen: "security",
    // },
    // {
    //   label: "Execution",
    //   icon: Execution,
    //   modelOpen: "execution",
    // },
    {
      label: 'Documents',
      icon: Documents,
      modelOpen: 'documents',
    },
  ],
  'UF-UFW': [
    {
      label: 'ElementInfo',
      icon: ElementInfo,
      modelOpen: 'elementInfo',
    },

    {
      label: 'Documents',
      icon: Documents,
      modelOpen: 'documents',
    },
  ],
  'UF-UFD': [
    {
      label: 'ElementInfo',
      icon: ElementInfo,
      modelOpen: 'elementInfo',
    },

    {
      label: 'Documents',
      icon: Documents,
      modelOpen: 'documents',
    },
  ],
  'UF-UFM': [
    {
      label: 'ElementInfo',
      icon: ElementInfo,
      modelOpen: 'elementInfo',
    },

    {
      label: 'Documents',
      icon: Documents,
      modelOpen: 'documents',
    },
  ],
  'DF-ERD': [
    {
      label: 'Entities',
      icon: Enities,
      modelOpen: 'entities',
    },
    // {
    //   label: "DataSource",
    //   icon: SourceIcon,
    //   modelOpen: "config",
    // },
    // {
    //   label: "Enum",
    //   icon: Enumeration,
    //   modelOpen: "mapper",
    // },
    // {
    //   label: "ProcessObjects",
    //   icon: ProcessObject,
    //   modelOpen: "processObj",
    // },
    // {
    //   label: "Validation",
    //   icon: Validation,
    //   modelOpen: "validation",
    // },
    // {
    //   label: "Security",
    //   icon: Security,
    //   modelOpen: "security",
    // },
    // {
    //   label: "Execution",
    //   icon: Execution,
    //   modelOpen: "execution",
    // },
    {
      label: 'Documents',
      icon: Documents,
      modelOpen: 'documents',
    },
  ],
  SF: [
    {
      label: 'PF',
      icon: Enities,
      modelOpen: 'pf',
    },
    {
      label: 'DF',
      icon: SourceIcon,
      modelOpen: 'df',
    },
    {
      label: 'UF',
      icon: Enumeration,
      modelOpen: 'uf',
    },
  ],
  events: [
    {
      label: 'StateTransition',
      icon: ElementInfo,
      modelOpen: 'StateTransition',
    },
    // {
    //   label: "StateTransitionTable",
    //   icon: SourceIcon,
    //   modelOpen: "STT",
    // },
    // {
    //   label: "StateTransitionStreams",
    //   icon: SourceIcon,
    //   modelOpen: "STS",
    // },
  ],
  'DF-DFD': [
    {
      label: 'Data',
      icon: SourceIcon,
      modelOpen: 'data',
    },
    // {
    //   label: "Mapper",
    //   icon: <MapperIcon />,
    //   modelOpen: "mapper",
    // },
    // {
    //   label: "Rule",
    //   icon: <RulesIcon />,
    //   modelOpen: "rule",
    // },
    // {
    //   label: "CustomCode",
    //   icon: <CustomCode />,
    //   modelOpen: "customCode",
    // },
    // {
    //   label: "Validation",
    //   icon: Validation,
    //   modelOpen: "validation",
    // },
    // {
    //   label: "Security",
    //   icon: Security,
    //   modelOpen: "security",
    // },
    // {
    //   label: "Execution",
    //   icon: Execution,
    //   modelOpen: "execution",
    // },
    {
      label: 'Documents',
      icon: Documents,
      modelOpen: 'documents',
    },
  ],
};

export const RenderJson = ({
  showNodeProperty,
  sideBarData,
  currentDrawing,
  setShowNodeProperty,
  setToggleReactflow,
  json,
  updatedNodeConfig,
  setJson,
  renderFor,
  nodedata,
  cm,
  setSFjson,
  selectedTheme,
}) => {
  const [dupJson, setDupJson] = useState(null);
  const [convertedJson, setConvertedJson] = useState(null);

  function convertJson(obj) {
    const converted = {};
    for (let key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        converted[key.replace(/\//g, '.')] = convertJson(obj[key]);
      } else if (Array.isArray(obj[key])) {
        converted[key.replace(/\//g, '.')] = obj[key];
      } else {
        converted[key.replace(/\//g, '.')] = obj[key];
      }
    }

    return converted;
  }

  function replaceKeys(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceKeys(item));
    } else if (typeof obj === 'object' && obj !== null) {
      let newObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let newKey = key.replace(/\//g, '.');
          newObj[newKey] = replaceKeys(obj[key]);
        }
      }
      return newObj;
    } else {
      return obj;
    }
  }

  function unflattenJson(flatJson) {
    try {
      function setNestedItem(obj, keys, value) {
        keys.reduce((acc, key, index) => {
          if (index === keys.length - 1) {
            acc[key] = value;
          } else {
            if (!acc[key]) {
              acc[key] = {};
            }
            return acc[key];
          }
        }, obj);
      }

      const unflattened = {};

      for (const [key, value] of Object.entries(flatJson)) {
        const keys = key.split('/');
        setNestedItem(unflattened, keys, value);
      }

      return unflattened;
    } catch (error) {}
  }

  const OgJson = useCallback(() => {
    try {
      const newjs = unflattenJson(dupJson);
      updatedNodeConfig(
        nodedata?.id,
        {
          nodeId: nodedata?.id,
          nodeName: nodedata?.data?.label,
          nodeType: nodedata?.type,
        },
        {
          [cm]: {
            ...newjs['root'],
          },
        },
      );
      setConvertedJson(newjs);

      setSFjson && setSFjson(newjs['root']);
      setJson &&
        setJson((prev) => {
          return {
            ...prev,
            [cm]: {
              ...newjs['root'],
            },
          };
        });
    } catch (error) {}
  }, [dupJson]);

  const handlejs = (e, i, key, type, jskey) => {
    try {
      if (type == 'obj') {
        setDupJson((prev) => {
          const newJson = structuredClone(prev);
          return {
            ...newJson,
            [i]: {
              ...newJson[i],
              [key]: e,
            },
          };
        });
      }

      if (type == 'arr-0' || type == 'arr-1' || type == 'arr') {
        if (i) {
          const js = structuredClone(dupJson);
          _.set(js, i, e);
          setDupJson(js);
        }
      }

      if (type == 'dropdown' || type == 'boolean') {
        if (i) {
          const js = structuredClone(dupJson);
          _.set(js, i, e);
          setDupJson(js);
        }
      }
    } catch (error) {}
  };

  const handleAddjs = (path, key, value, type, i, selectedType) => {
    try {
      if (type == 'obj' && selectedType === 'input') {
        setDupJson((prev) => {
          return {
            ...prev,
            [path]: {
              ...prev[path],
              [key]: value,
            },
          };
        });
      } else if (type == 'obj' && selectedType === 'boolean') {
        setDupJson((prev) => {
          return {
            ...prev,
            [path]: {
              ...prev[path],
              [key]: {
                label: key,
                type: 'boolean',
                selectedValue: false,
                selectionList: [true, false],
              },
            },
          };
        });
      } else if (type == 'obj' && selectedType === 'dropdown') {
        setDupJson((prev) => {
          return {
            ...prev,
            [path]: {
              ...prev[path],
              [key]: {
                label: key,
                type: 'dropdown',
                selectedValue: '',
                selectionList: value,
              },
            },
          };
        });
      } else if (type === 'arr-1' && selectedType === 'input') {
        setDupJson((prev) => {
          return {
            ...prev,
            [path]: prev[path].map((item, index) => {
              if (index === i) {
                return {
                  ...item,
                  [key]: value,
                };
              } else {
                return item;
              }
            }),
          };
        });
      } else if (type === 'arr-1' && selectedType === 'boolean') {
        setDupJson((prev) => {
          return {
            ...prev,
            [path]: prev[path].map((item, index) => {
              if (index === i) {
                return {
                  ...item,
                  [key]: {
                    label: key,
                    type: 'boolean',
                    selectedValue: false,
                    selectionList: [true, false],
                  },
                };
              } else {
                return item;
              }
            }),
          };
        });
      } else if (type == 'arr-1' && selectedType === 'dropdown') {
        setDupJson((prev) => {
          return {
            ...prev,
            [path]: prev[path].map((item, index) => {
              if (index === i) {
                return {
                  ...item,
                  [key]: {
                    label: key,
                    type: 'dropdown',
                    selectedValue: '',
                    selectionList: value,
                  },
                };
              } else {
                return item;
              }
            }),
          };
        });
      } else if (type === 'arr-0' && selectedType === 'object') {
        setDupJson((prev) => {
          return {
            ...prev,
            [path]: [
              ...prev[path],
              {
                label: key,
              },
            ],
          };
        });
      }
    } catch (error) {}
  };
  const handleDeletejs = (path, type, label) => {
    try {
      if (type === 'arr-1') {
        setDupJson((prev) => {
          const updatedObj = _.cloneDeep(prev);
          const events = _.get(updatedObj, path);
          _.remove(events, (event) => event.label === label);
          return updatedObj;
        });
      } else if (type === 'obj') {
        const js = _.cloneDeep(dupJson);
        _.unset(js, path);
        setDupJson(js);
      } else {
        const js = dupJson;
        const pathsToDelete = Object.keys(js).filter(
          (key) => key == path || key.startsWith(path + '/'),
        );
        pathsToDelete.forEach((key) => {
          _.unset(js, key);
        });
        setDupJson(js);
      }
    } catch (error) {}
  };
  function denormalizeJson(obj, prefix = '', result = {}, originalObj) {
    try {
      const copy = JSON.parse(JSON.stringify(obj));
      for (let key in copy) {
        if (copy.hasOwnProperty(key)) {
          if (key === 'root') {
            Object.keys(copy).forEach((key) => {
              if (
                typeof copy[key] !== 'object' ||
                copy[key].hasOwnProperty('type')
              ) {
                result[key] = copy[key];
              }
            });
          }
          let newKey = prefix ? `${prefix}/${key}` : key;
          if (
            typeof copy[key] === 'object' &&
            copy[key] !== null &&
            !Array.isArray(copy[key])
          ) {
            if (
              !(
                copy[key].hasOwnProperty('type') &&
                (copy[key].type === 'dropdown' || copy[key].type === 'boolean')
              )
            ) {
              if (copy[key] === originalObj) {
                return result; // Return early if the object being processed is the same as the original object
              }
              result[newKey] = copy[key];
              denormalizeJson(copy[key], newKey, result, originalObj);
              delete copy[key];
            }
          } else if (
            Array.isArray(copy[key]) &&
            typeof copy[key][0] === 'object'
          ) {
            result[newKey] = copy[key];
            copy[key].forEach((item, index) => {
              if (typeof item === 'object' && item !== null) {
                const nestedKey = `${newKey}/${index}`;
                denormalizeJson(item, nestedKey, result, originalObj);
              } else {
                result[newKey][index] = item;
              }
            });
            delete copy[key];
          } else {
            if (!prefix && key !== 'root') {
              result[copy['label']] = copy;
            }
          }
        }
      }
      return result;
    } catch (error) {}
  }

  const haandledenormalize = () => {
    try {
      if (json) {
        const denormalized = denormalizeJson({ root: json });
        setDupJson(structuredClone(denormalized));
      }
    } catch (error) {}
  };

  useEffect(() => {
    try {
      haandledenormalize();
    } catch (error) {}
  }, [json]);

  return (
    <div
      className={`${renderFor === 'events' ? 'h-[400px] w-[215px] overflow-y-scroll scrollbar-hide' : 'h-full w-full overflow-y-scroll scrollbar-hide'} `}
    >
      {dupJson && Object.keys(dupJson).length > 0 && (
        <div className="h-full w-full overflow-y-scroll scrollbar-hide ">
          {
            <>
              <RenderObject
                obj={dupJson}
                handlejs={handlejs}
                OgJson={OgJson}
                showNodeProperty={showNodeProperty}
                sideBarData={sideBarData}
                currentDrawing={currentDrawing}
                setShowNodeProperty={setShowNodeProperty}
                setToggleReactflow={setToggleReactflow}
                nodeInfoTabs={nodeInfoTabs}
                setDupJson={setDupJson}
                handleAddjs={handleAddjs}
                handleDeletejs={handleDeletejs}
                renderFor={renderFor}
                selectedTheme={selectedTheme}
              />
            </>
          }
        </div>
      )}
    </div>
  );
};
