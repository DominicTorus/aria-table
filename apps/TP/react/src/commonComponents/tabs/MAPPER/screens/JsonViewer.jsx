import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';
import { IoAdd } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { TiUpload } from 'react-icons/ti';
import Builder from '../../../../VPT_DJUI/builder';
import { cardUIPolicy, colorPolicy, controlPolicy } from '../../../utils/util';
import JsonNode from '../components/jsonNode';
import { Sym, dropValue, methods, paddingOption } from '../utils/methodsRules';
import {
  dateFrmSngQoutes,
  dateRpl,
  datefrmDblQoutes,
} from '../utils/regexPattern';
import {
  toasterMessage,
  toasterSummary,
  toasterType,
} from '../utils/toasterMsg';

const JsonViewer = ({ value, onChange, handleClick }) => {
  const [json, setJson] = useState({});
  const [sourceData, setSource] = useState([' ']);
  const [targetData, setTarget] = useState([' ']);
  const [sourceDraggable, setSourceDrag] = useState(false);
  const [targetDraggable, setTargetDrag] = useState(false);
  const [renderSource] = useState([]);

  const [schemaPath, setSchemaPath] = useState(['']);
  const [sourceIndex, setSourceIndex] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [jsonFunctionRule] = useState({});
  const [selectedTarget, setSelectedTarget] = useState({});
  const [sourceJsonSchema, setSourceJsonSchema] = useState({});
  const [targetJsonSchema, setTargetJsonSchema] = useState({});
  const [sideBar, setSideBar] = useState(false);
  const [defaultValues, setDefaultValue] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [keyValue, setKeyValue] = useState('');
  const [tooltip, setToolTip] = useState('');
  const [dragKeys, setDragKeys] = useState({ source: [], target: [] });
  const [operate, setOperate] = useState([]);
  const [operateRule, setOperateRule] = useState({});
  const [hardCodeFunction] = useState(methods);
  const [dropDownApi, setDropDownApi] = useState([]);
  const [dropDrownController, setDropDownController] = useState('');
  const [isFormatNeed, setIsFormatNeed] = useState({
    isNeed: false,
    operateIndex: null,
  });
  const [dateInputField, setDateInputFields] = useState('');
  const [isDefaultOperation, setIsDefaultOperation] = useState({
    isNeed: false,
    operateIndex: null,
  });
  const [isDefaultInput, setIsDefaultInput] = useState({
    newKey: '',
    value: '',
  });
  const [eachOperationRule, setEachOprationRule] = useState({});
  const [npcKeys, setNpcKeys] = useState([]);
  const [npcType, setNpcType] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);

  const updateBuilderJson = (js) => {
    setJson(js);
  };

  /* Hold the data for method operations */
  const [isSplitOperation, setSplitOperation] = useState({
    isNeed: false,
    operateIndex: null,
    target: [''],
    hoverIndex: null,
    source: '',
    hoverType: null,
  });
  const [isPaddinOperation, setPaddingOperation] = useState({
    isNeed: false,
    operateIndex: null,
  });
  const [isJoinOperation, setJoinOperation] = useState({
    isNeed: false,
    operateIndex: null,
    source: [''],
    hoverIndex: null,
  });
  const [splitHappened, setSplitHappened] = useState(1);
  const [isSubStringOperation, setSubStringOperation] = useState({
    isNeed: false,
    operateIndex: null,
    source: '',
    startingIndex: null,
    endingIndex: null,
  });

  const toast = useRef(null);

  // Methods DropDown
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPadding, setPadding] = useState(null);
  const [selectedJoin, setJoin] = useState(null);
  const [selectedSplit, setSplit] = useState(null);

  const [paddingDetails, setPaddingDetails] = useState({
    value: null,
    char: '',
    source: '',
  });

  // get Api call to load previous rule
  const loadSchema = useCallback(async (mapping) => {
    try {
      // Api call function
      // setIsLoading(true)
      // let schmeaRes = await loadJsonSchema(id);
      let schmeaRes = mapping;
      // setIsLoading(false)
      if (schmeaRes && schmeaRes.source && schmeaRes.target) {
        setSource(schmeaRes.source);
        setTarget(schmeaRes.target);
      }
      if (
        schmeaRes &&
        schmeaRes.resSource &&
        schmeaRes.resSource.schema_json &&
        schmeaRes.resTarget &&
        schmeaRes.resTarget.schema_json
      ) {
        // JSON for both Source and Target
        setSourceJsonSchema(JSON.parse(schmeaRes.resSource.schema_json));
        setTargetJsonSchema(JSON.parse(schmeaRes.resTarget.schema_json));
      }
      if (schmeaRes && schmeaRes.resDropDown) {
        const convertedDropDown = transformDropDownKeys(schmeaRes.resDropDown);
        setDropDownApi(convertedDropDown);
      }
      if (schmeaRes && schmeaRes.resMapping.mapping_json) {
        const mappingData = JSON.parse(schmeaRes.resMapping.mapping_json);
        const rule_json =
          schmeaRes.resMapping.rule_json &&
          JSON.parse(schmeaRes.resMapping.rule_json);
        setSource(mappingData.mappingJson.source);
        setTarget(mappingData.mappingJson.target);

        if (schmeaRes && schmeaRes.resMapping.rule_json) {
          let ruleData = JSON.parse(schmeaRes.resMapping.rule_json);
          setDefaultValue(ruleData.defaults);
        } else setDefaultValue({});

        if (mappingData.selectedTarget) {
          setSelectedTarget({ ...mappingData.selectedTarget });
        } else setSelectedTarget({});

        if (mappingData.mappingJson.eachOperationRule)
          setEachOprationRule({ ...mappingData.mappingJson.eachOperationRule });
        else setEachOprationRule({});

        if (schmeaRes && schmeaRes.resMapping.rule_json && rule_json.operate) {
          const Operate = transformOperate(rule_json.operate);
          setOperate(Operate);
        } else setOperate([]);

        if (
          mappingData.mappingJson.dragData &&
          mappingData.mappingJson.dragData.source.length !== 0 &&
          mappingData.mappingJson.dragData.target.length !== 0
        ) {
          setDragKeys(mappingData.mappingJson.dragData);
        } else {
          // if dragData not found we create a drag data from mappingJson source and mappingJson target
          if (
            mappingData.mappingJson.source &&
            mappingData.mappingJson.target
          ) {
            const source = mappingData.mappingJson.source;
            const target = mappingData.mappingJson.target;
            const sourceDrag = [];
            const targetDrag = [];
            for (let obj of source) {
              sourceDrag.push(Object.keys(obj)[0]);
            }
            for (let obj of target) {
              targetDrag.push(Object.keys(obj)[0]);
            }
            setDragKeys({ source: [...sourceDrag], target: [...targetDrag] });
          } else
          /* if mapping Json source or mapping JSON target
             is missed we set empty array for both source and target */
            setDragKeys({ source: [], target: [] });
        }

        if (mappingData.mappingJson.splitHappened)
          setSplitHappened(mappingData.mappingJson.splitHappened);
        else setSplitHappened(1);

        if (mappingData.mappingJson.operateRule) {
          const operateRule = convertSingleQuoteToDoubleSingleQuoute(
            mappingData.mappingJson.operateRule,
          );
          setOperateRule(operateRule);
        } else setOperateRule({});
      } else {
        setSource([' ']);
        setTarget([' ']);
      }
    } catch (error) {
      // setIsLoading(false);
      console.error(error);
    }
  }, []); // Add dependencies as necessary

  // convert the single quote to double single quote in operate params as array
  function transformOperate(operate) {
    const newOperate = [];
    for (let obj of operate) {
      const regex = /\('(.*?)'\)/;
      const match = regex.exec(obj.run);
      if (match) {
        const newRun = obj.run.replace(/\('([^']*)'\)/, `(''${match[1]}'')`);
        obj = { ...obj, run: newRun };
      }
      newOperate.push(obj);
    }
    return newOperate;
  }

  // // convert the single quote to double single quote in operateRule params as object
  function convertSingleQuoteToDoubleSingleQuoute(obj) {
    const objKeys = Object.keys(obj);

    for (let keys of objKeys) {
      if (obj[keys] && obj[keys].code) {
        const regex = /\('(.*?)'\)/;
        const match = regex.exec(obj[keys].code);
        if (match) {
          const newCode = obj[keys].code.replace(
            /getCURRENTDATE\('([^']*)'\)/,
            `getCURRENTDATE(''${match[1]}'')`,
          );
          obj[keys] = { ...obj[keys], code: newCode };
        }
      }
    }
    return obj;
  }

  /* Save api create rule for transformation and store the rule in DB  */
  const saveRule = async (type) => {
    if (type === 'save') {
      setIsLoading(true);
    }
    let item = {};
    const data =
      renderSource['$id'] &&
      renderSource['$schema'] &&
      renderSource['properties']
        ? [...schemaPath]
        : [...sourceData];
    data.pop();
    const map = [...targetData];
    map.pop();
    map.map((elem, i) => {
      Object.keys(elem) &&
        Object.keys(elem).length > 0 &&
        Object.keys(elem).map((elm) => {
          let values = Object.values(elem)[0].split('target.');
          // values.shift();
          if (values[0].includes('.')) {
            let resArray = values[0].split('.');
            let object = { ...item },
              copyObj = object;
            for (let ins = 0; ins < resArray.length; ins++) {
              if (ins === resArray.length - 1) {
                if (copyObj[resArray[ins]]) {
                  const arr = Array.isArray(copyObj[resArray[ins]])
                    ? [...copyObj[resArray[ins]]]
                    : [copyObj[resArray[ins]]];
                  arr.push(Object.values(data[i])[0]);
                  copyObj[resArray[ins]] = arr;
                } else {
                  copyObj = copyObj[resArray[ins]] = Object.values(data[i])[0];
                }
              } else if (copyObj[resArray[ins]]) {
                copyObj = copyObj[resArray[ins]] = {
                  ...copyObj[resArray[ins]],
                };
              } else {
                copyObj = copyObj[resArray[ins]] = {};
              }
            }
            item = { ...item, ...object };
          } else {
            if (item[elm]) {
              const arr = Array.isArray(item[elm])
                ? [...item[elm]]
                : [item[elm]];
              arr.push(Object.values(data[i])[0]);
              item[elm] = arr;
            } else {
              if (jsonFunctionRule[elm]) {
                item[elm] = jsonFunctionRule[elm].value;
              } else {
                item[elm] = Object.values(data[i])[0];
              }
            }
          }
          return item;
        });
      return item;
    });
    try {
      // const queryParameters = new URLSearchParams(window.location.search);
      // setIsLoading(true)
      // const id = queryParameters.get("id");

      const eachFunc = createEachOperation(eachOperationRule);
      const eachOperationItmRule = crtItmFrmEachOperationRule();
      // const saveRuleRes = await saveRuleJson(id, {
      //   item: { ...item, ...eachOperationItmRule },
      //   operate: [...operate],
      //   defaults: { ...defaultValues },
      //   each: eachFunc
      // },
      //   {
      //     mappingJson: {
      //       source: sourceData,
      //       target: targetData,
      //       dragData: dragKeys,
      //       operateRule: operateRule,
      //       selectedTarget: selectedTarget,
      //       eachOperationRule: eachOperationRule,
      //       splitHappened: splitHappened
      //     }
      //   });

      // if (saveRuleRes === "success") {
      // showSuccess(toasterType.success, toasterSummary.success, toasterMessage.jsonSaveSuccess);
      // const message = 'success';
      const mapper = {
        item: { ...item, ...eachOperationItmRule },
        operate: [...operate],
        defaults: { ...defaultValues },
        each: eachFunc,
      };
      const mappingJson = {
        source: sourceData,
        target: targetData,
        dragData: dragKeys,
        operateRule: operateRule,
        selectedTarget: selectedTarget,
        eachOperationRule: eachOperationRule,
        splitHappened: splitHappened,
      };

      onChange({
        ...json,
        [npcType]: {
          request: json[npcType].request,
          response: json[npcType].response,
          mapData: mapper,
          mapDesign: mappingJson,
        },
      });

      setTimeout(() => {
        if (type === 'save') {
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      showSuccess(
        toasterType.error,
        toasterSummary.failure,
        toasterMessage.jsonSaveFailure,
      );
    }
  };

  function crtItmFrmEachOperationRule() {
    try {
      const eachRule = Object.keys({ ...eachOperationRule });
      let item = {};
      for (let key of eachRule) {
        const sourceAddress = eachOperationRule[key].value.source;

        if (Array.isArray(sourceAddress)) {
          const newArr = [];
          for (let address of sourceAddress) {
            newArr.push(`source.${address}`);
          }
          const itemKey = key.split('.')[1];
          item = { ...item, [itemKey]: newArr };
        } else {
          const itemKey = key.split('.')[1];
          item = { ...item, [itemKey]: `source.${sourceAddress}` };
        }
      }

      return item;
    } catch (error) {
      console.error(error.message);
    }
  }

  // toaster for notification when api succss or failure
  const showSuccess = (severity, summary, detail) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 1000,
    });
  };

  useEffect(() => {
    try {
      if (json) {
        const npcT = npcType ? npcType : Object.keys(json)[0];
        setNpcKeys(Object.keys(json));
        !npcType && setNpcType(Object.keys(json)[0]);
        setSourceJsonSchema(json[npcT].request);
        setTargetJsonSchema(json[npcT].response);
        setDragKeys(
          json[npcT].mapDesign?.dragData || { source: [], target: [] },
        );
        loadSchema(json[npcT]?.mapDesign);
      }
    } catch (Err) {
      console.error(Err.message, 'errx');
    }
  }, [json, npcType, loadSchema]);

  useEffect(() => {
    if (value) {
      setJson(value);
    }
  }, [value]);

  /* This function use to convert all the method opration state to false
    (isSplitOperation, isJoinOperation, isPaddingOperation, isSubStringOperaion, selectedCity, sideBar) */

  // useEffect(() => {
  //   let target = { ...targetJsonSchema };
  //   let source = { ...sourceJsonSchema };
  //   if (target["$id"] || target["$schema"] || target["required"] || target["default"] ||
  //     target["type"] || target["title"] || target["examples"] || target["properties"]) {
  //     delete target["$id"];
  //     delete target["$schema"];
  //     delete target["required"];
  //     delete target["default"];
  //     delete target["type"];
  //     delete target["title"];
  //     delete target["examples"];
  //     if (target.properties) {
  //       const properties = { ...target.properties };
  //       delete target["properties"]
  //       target = { ...properties }
  //     }
  //     setRenderTarget({ target });
  //     localStorage.removeItem("renderSource");
  //     localStorage.removeItem("renderTarget");
  //     localStorage.removeItem("transformSource");
  //   };

  //   if (source["$id"] || source["$schema"] || source["required"] || source["default"] ||
  //     source["type"] || source["title"] || source["examples"] || source["properties"]) {
  //     delete source["$id"];
  //     delete source["$schema"];
  //     delete source["required"];
  //     delete source["default"];
  //     delete source["type"];
  //     delete source["title"];
  //     delete source["examples"];
  //     if (source.properties) {
  //       const properties = { ...source.properties };
  //       delete source["properties"]
  //       source = { ...properties }
  //     }
  //     setRenderSource({ source });
  //     localStorage.removeItem("renderSource");
  //     localStorage.removeItem("renderTarget");
  //     localStorage.removeItem("transformSource");
  //   }
  // }, [targetJsonSchema])

  /* Function call when JSON node end drag for both target and source JSON params for a function are 
  key-> which key of a JSON drag 
  value-> value for key in JSON 
  type-> value type in for key
  path-> path of drag key*/
  function drag(key, value, type, path) {
    if (!sideBar) {
      const copySource = [...sourceData];
      const copyTarget = [...targetData];
      const copyShema = [...schemaPath];
      path = path.replaceAll('.properties', '');
      path = path
        .replaceAll('.items', '')
        .replaceAll('.required', '')
        .replaceAll('.type', '');
      if (type === 'source') {
        if (
          copySource[sourceIndex] === ' ' &&
          copySource[copySource.length - 1] === ' '
        )
          copySource.pop();
        copyShema.pop();
        setDragKeys({ ...dragKeys, source: [...dragKeys.source, key] });

        // const x = updateJsonSchema(renderSource, key, "");
        if (
          renderSource['$id'] &&
          renderSource['$schema'] &&
          renderSource['properties']
        ) {
          copyShema.push({ [key]: path });
          copyShema.push(' ');
          setSchemaPath(copyShema);
          const splitPath = path.split('.');
          if (splitPath.length > 2) {
            splitPath.splice(1, 1);
            const joinPath = splitPath.join('.');
            copySource[sourceIndex] = { [key]: joinPath };
          } else {
            copySource[sourceIndex] = { [key]: path };
          }
          // copySource.push({ [key]: path });
        } else {
          // copySource.push({ [key]: path });
          const previoysData = copySource[sourceIndex];
          if (previoysData) {
            const previousKeys = Object.keys(copySource[sourceIndex])[0];
            const copyDraySource = [...dragKeys.source, key];
            const indexOfSource = copyDraySource.indexOf(previousKeys);
            if (indexOfSource > -1) {
              copyDraySource.splice(indexOfSource, 1);
              setDragKeys({ ...dragKeys, source: copyDraySource });
            }
            const targetData = copyTarget[sourceIndex];
            if (targetData !== ' ') {
              const copyDefault = { ...defaultValues };
              let removeKey = copyTarget[sourceIndex];
              removeKey = Object.values(removeKey);
              removeKey = removeKey[0].split('.');
              delete copyDefault[removeKey[removeKey.length - 1]];
              setDefaultValue(copyDefault);
            }
          }
          copySource[sourceIndex] = { [key]: path };
          if (copyTarget[sourceIndex] !== ' ') {
            const copyOperate = [...operate];
            const copyOperateRule = { ...operateRule };

            if (copySource.length !== copyTarget.length) copySource.push(' ');
            const targetKey = Object.keys(copyTarget[sourceIndex])[0];
            const copyDefault = { ...defaultValues };
            delete copyDefault[targetKey];
            const newOperate = [];
            // const deleteOperateRule = copyOperateRule[`target.${targetKey}`]
            delete copyOperateRule[`target.${targetKey}`];
            for (let obj of copyOperate) {
              if (obj.on !== targetKey) newOperate.push(obj);
            }
            setOperate([...newOperate]);
            setDefaultValue(copyDefault);
            setOperateRule({ ...copyOperateRule });
          }
        }
      } else {
        setDragKeys({ ...dragKeys, target: [...dragKeys.target, key] });
        if (copyTarget[targetIndex] === ' ') copyTarget.pop();

        const previoysData = copyTarget[targetIndex];
        if (previoysData) {
          const previousKeys = Object.keys(copyTarget[targetIndex])[0];
          const copyDefault = { ...defaultValues };
          const copyDrayTarget = [...dragKeys.target, key];
          const indexOfTarget = copyDrayTarget.indexOf(previousKeys);
          if (indexOfTarget > -1) {
            copyDrayTarget.splice(indexOfTarget, 1);
            setDragKeys({ ...dragKeys, target: copyDrayTarget });
          }
          delete copyDefault[previousKeys];
          setDefaultValue(copyDefault);
        }

        if (sourceData[sourceData.length - 1] !== ' ')
          copyTarget.splice(targetIndex, 1, { [key]: path });
        else if (sourceData[sourceData.length - 1] === ' ')
          copyTarget.splice(targetIndex, 1, { [key]: path });
      }

      if (
        copySource[copySource.length - 1] !== ' ' &&
        copyTarget[copyTarget.length - 1] !== ' '
      ) {
        copyTarget.push(' ');
        copySource.push(' ');
      }
      if (
        copySource[copySource.length - 1] === ' ' &&
        copyTarget[copyTarget.length - 1] !== ' '
      ) {
        copyTarget.push(' ');
        copySource.push(' ');
      }
      setSource(copySource);
      setTarget(copyTarget);
      // let arr = document.querySelector("#mainDiv")
      // arr.scrollTop = arr.scrollHeight;
      // window.scrollTo(0, arr.scrollHeight)
    } else {
      if (type === 'source' && isPaddinOperation.isNeed) {
        const dragSource = [...dragKeys.source];
        updateDragkeys(dragSource.indexOf(paddingDetails.source), type, key);
        setPaddingDetails({ ...paddingDetails, source: key });
      } else if (type === 'source' && isJoinOperation.isNeed) {
        const { hoverIndex, source } = isJoinOperation;
        if (hoverIndex !== null) {
          const dragSource = [...dragKeys.source];
          updateDragkeys(dragSource.indexOf(source[hoverIndex]), type, key);
          source.splice(hoverIndex, 1, key);
        }
        setJoinOperation({
          ...isJoinOperation,
          hoverIndex: null,
          source: source,
        });
      } else if (
        isSplitOperation.hoverType === 'target' &&
        type === 'target' &&
        isSplitOperation.isNeed
      ) {
        const { hoverIndex, target } = isSplitOperation;
        if (hoverIndex !== '0') {
          if (isSplitOperation.hoverIndex !== null) {
            const dragTarget = [...dragKeys.target];
            updateDragkeys(dragTarget.indexOf(target[hoverIndex]), type, key);
            target.splice(hoverIndex, 1, key);
          }
          setSplitOperation({
            ...isSplitOperation,
            hoverIndex: null,
            target: target,
            hoverType: null,
          });
        } else
          showSuccess(
            toasterType.warring,
            toasterSummary.dragNotAllow,
            toasterMessage.dragNotAllow,
          );
      } else if (
        isSplitOperation.hoverType === 'source' &&
        type === 'source' &&
        isSplitOperation.isNeed
      ) {
        const { hoverIndex, source } = isSplitOperation;
        const dragSource = [...dragKeys.source];
        updateDragkeys(dragSource.indexOf(source[hoverIndex]), type, key);
        setSplitOperation({
          ...isSplitOperation,
          source: key,
          hoverIndex: null,
          hoverType: null,
        });
      } else if (type === 'source' && isSubStringOperation.isNeed) {
        const dragSource = [...dragKeys.source];
        updateDragkeys(
          dragSource.indexOf(isSubStringOperation.source),
          type,
          key,
        );
        setSubStringOperation({ ...isSubStringOperation, source: key });
      }
    }
  }

  function updateDragkeys(index, type, newKey) {
    const { source, target } = dragKeys;
    if (type === 'source') {
      if (index > -1) source.splice(index, 1, newKey);
      else source.push(newKey);
    } else {
      if (index > -1) target.splice(index, 1, newKey);
      else target.push(newKey);
    }
    setDragKeys({ source: [...source], target: [...target] });
  }

  // remove node from  source array, target array, defaults, dragKey, operate rule and eachOperation
  function removeNode(index) {
    // copy the state
    const copySource = [...sourceData];
    const copyTarget = [...targetData];
    const copyDefault = { ...defaultValues };
    const copyDragKey = [...dragKeys.target];
    const copyDraySource = [...dragKeys.source];
    const copyOperate = [...operate];
    const copyOperateRule = { ...operateRule };
    const copyEachOperationRule = { ...eachOperationRule };

    // find the node value from copyTarget its array
    const targetValue = Object.values(copyTarget[index]);
    let removeKey = copyTarget[index];
    removeKey = Object.values(removeKey);
    removeKey = removeKey[0].split('.');
    const deletedOperate = copyOperateRule[targetValue];
    delete copyOperateRule[targetValue];

    // find the key from copySource its array
    let sourceKeys = copySource[index];
    sourceKeys = Object.keys(sourceKeys)[0];
    const keys = removeKey[1] ? removeKey[1] : removeKey[0];

    // delete each rule
    delete copyEachOperationRule[targetValue];

    if (deletedOperate && deletedOperate.code) {
      const newOperate = [];
      for (let obj of copyOperate) {
        if (obj.on !== keys && !obj.run.includes(deletedOperate.code)) {
          newOperate.push(obj);
        }
      }
      setOperate([...newOperate]);
    }

    /* find the index for source and target from copyDrag state its use for highlight the key 
    if its already drag
    */
    const indexOfDragKey = copyDragKey.indexOf(
      removeKey[1] ? removeKey[1] : removeKey[0],
    );
    const indexOfSource = copyDraySource.indexOf(sourceKeys);

    // if target is find remove from an array
    if (indexOfDragKey > -1) {
      copyDragKey.splice(indexOfDragKey, 1);
    }
    // if source is find remove from an array
    if (indexOfSource > -1) {
      copyDraySource.splice(indexOfSource, 1);
    }

    // store the update value in state
    setDragKeys({ source: copyDraySource, target: copyDragKey });

    // delete the node from the bothe copySource and copyTarget
    copySource.splice(index, 1);
    copyTarget.splice(index, 1);

    // store in state
    setSource(copySource);
    setTarget(copyTarget);

    // delete value if node has defaults and store in state
    delete copyDefault[removeKey[removeKey.length - 1]];
    setDefaultValue(copyDefault);
    setOperateRule({ ...copyOperateRule });
    setEachOprationRule({ ...copyEachOperationRule });
  }

  /* Function call when source JSON start drag to make sourceDrag state true and targetDrag state false */
  function isSourceDraggable() {
    setSourceDrag(true);
    setTargetDrag(false);
  }

  /* Function call when target JSON start drag to make sourceDrag state false and targetDrag state true */
  function isTargetDraggable() {
    setTargetDrag(true);
    setSourceDrag(false);
  }

  // Function call when tab was clicked in dialog box its update the state of active tab
  function toggleTab(index) {
    setActiveTab(index);
  }

  function toggleSideBar(elm, index) {
    if (evaluatePadding()) {
    } else if (evaluateJoin()) {
    } else if (evaluteSplit()) {
    } else if (evaluteSubString()) {
    } else if (inputEvaluation()) {
      removeEachOperation();
      setSideBar(!sideBar);
      setIsDefaultOperation({ isNeed: false, operateIndex: null });
      setDateInputFields('');

      if (elm) {
        const Keys = Object.values(elm);
        const keysPath = Keys[0].split('.');
        const lastKey = keysPath[keysPath.length - 1];
        const copyEacheOperationRule = { ...eachOperationRule };

        if (defaultValues[lastKey]) setKeyValue(defaultValues[lastKey]);
        else setKeyValue('');

        setSelectedTarget({ keys: Keys[0], index });
        setSelectedCity({ ...operateRule[Keys[0]] });

        if (
          operateRule[Keys[0]] &&
          operateRule[Keys[0]].code &&
          operateRule[Keys[0]].code.includes("'")
        ) {
          setIsFormatNeed({
            ...isFormatNeed,
            isNeed: true,
            operateIndex: index,
          });
          const copyOperate = [...operate];
          for (let obj of copyOperate) {
            if (obj.on === keysPath[1]) {
              const datePattern = extractDateFormat(datefrmDblQoutes, obj.run);
              if (datePattern !== 'format') setDateInputFields(datePattern);
              else {
                const datePattern = extractDateFormat(
                  dateFrmSngQoutes,
                  obj.run,
                );
                if (datePattern !== 'format') setDateInputFields(datePattern);
              }
            }
          }
        } else {
          if (
            operateRule[Keys[0]] &&
            operateRule[Keys[0]].code &&
            operateRule[Keys[0]].code === 'hardCode'
          ) {
            // to display previous value in input fields
            if (
              eachOperationRule[Keys[0]] &&
              typeof eachOperationRule[Keys[0]] !== 'object'
            ) {
              setIsDefaultInput({
                newKey: eachOperationRule[Keys[0]].newKey,
                value: eachOperationRule[Keys[0]].value,
              });
              setIsDefaultOperation({ isNeed: true, operateIndex: index });
            }
          }
          setIsFormatNeed({
            ...isFormatNeed,
            isNeed: false,
            operateIndex: null,
          });
        }
        const eachOperateKey = copyEacheOperationRule[Keys[0]];
        if (eachOperateKey && typeof eachOperateKey.value === 'object') {
          if (eachOperateKey.method === 'padding') {
            setSelectedCity({ name: 'Padding', code: 'hardCode' });
            setPaddingDetails({
              char: eachOperateKey.value.char,
              source: eachOperateKey.value.source,
              value: { name: eachOperateKey.value.length, code: '' },
            });
            setPadding(eachOperateKey.value.type);
            setPaddingOperation({ isNeed: true, operateIndex: index });
          } else if (eachOperateKey.method === 'join') {
            setSelectedCity({ name: 'Join', code: 'hardCode' });
            setJoinOperation({
              ...isJoinOperation,
              isNeed: true,
              source: [...eachOperateKey.value.source],
            });
            setJoin({ ...eachOperateKey.value.operator });
          } else if (eachOperateKey.method === 'split') {
            setSelectedCity({ name: 'Split', code: 'hardCode' });
            setSplitOperation({
              ...isSplitOperation,
              isNeed: true,
              source: eachOperateKey.value.source,
              target: eachOperateKey.value.target,
            });
            setSplit(eachOperateKey.value.operator);
          } else if (eachOperateKey.method === 'subString') {
            setSelectedCity({ name: 'Substring', code: 'hardCode' });
            setSubStringOperation({
              isNeed: true,
              operateIndex: index,
              endingIndex: eachOperateKey.value.endingIndex,
              startingIndex: eachOperateKey.value.startingIndex,
              source: eachOperateKey.value.source,
            });
          }
        }
      }
    }
  }

  /* This function call when Join option in selected in method dropDown from this we store the rule in eachOperationRule */
  function evaluateJoin() {
    if (isJoinOperation.isNeed) {
      const joinVal = selectedJoin && selectedJoin.name;
      const operation =
        isJoinOperation.source[isJoinOperation.source.length - 1] !== '';

      if (joinVal && operation) {
        const copyTarget = [...targetData];
        const copyEacheOperationRule = { ...eachOperationRule };
        const copySelectedTarget = { ...selectedTarget };
        const keys = Object.keys(copyTarget[copySelectedTarget.index])[0];
        delete copyEacheOperationRule[copySelectedTarget.keys];
        copyEacheOperationRule[copySelectedTarget.keys] = {
          newKey: keys,
          value: {
            operator: selectedJoin,
            source: isJoinOperation.source,
          },
          rule: {
            [`item.${keys}`]: `item.${keys}.join("${selectedJoin.name}")`,
          },
          method: 'join',
        };
        setEachOprationRule({
          ...copyEacheOperationRule,
        });
        setJoin(null);
        setJoinOperation({
          isNeed: false,
          operateIndex: null,
          hoverIndex: null,
          source: [],
        });
      } else {
        showSuccess(
          toasterType.error,
          toasterSummary.failure,
          toasterMessage.joinOperationFail,
        );
        setSideBar(true);
        return true;
      }
    }
  }
  /* This function call when padding option in selected in method dropDown from this we store the rule in eachOperationRule */
  function evaluatePadding() {
    if (isPaddinOperation.isNeed) {
      if (selectedPadding && paddingDetails.char && paddingDetails.value) {
        const copySelectedTarget = { ...selectedTarget };
        let paddingRule;
        const copyTarget = [...targetData];
        const keys = Object.keys(copyTarget[isPaddinOperation.operateIndex])[0];
        const copyEacheOperationRule = { ...eachOperationRule };
        if (selectedPadding.name === 'Padding Left')
          paddingRule = `item.${keys}.padStart(${paddingDetails.value.name}, "${paddingDetails.char}")`;
        else
          paddingRule = `item.${keys}.padEnd(${paddingDetails.value.name}, "${paddingDetails.char}")`;
        delete copyEacheOperationRule[copySelectedTarget.keys];
        copyEacheOperationRule[copySelectedTarget.keys] = {
          newKey: keys,
          value: {
            length: paddingDetails.value.name,
            char: paddingDetails.char,
            source: paddingDetails.source,
            type: selectedPadding,
          },
          rule: {
            [`item.${keys}`]: paddingRule,
          },
          method: 'padding',
        };
        setEachOprationRule({
          ...copyEacheOperationRule,
        });
        setPadding(null);
        setPaddingDetails({ value: null, char: '' });
        setPaddingOperation({ isNeed: false, operateIndex: null });
        setSideBar(!sideBar);
        return true;
      } else
        showSuccess(
          toasterType.error,
          toasterSummary.failure,
          toasterMessage.paddingOperationFail,
        );
      setSideBar(true);
      return true;
    }
    return false;
  }
  /* This function call when split option in selected in method dropDown from this we store the rule in eachOperationRule */
  function evaluteSplit() {
    if (isSplitOperation.isNeed) {
      // condition
      const splitVal = selectedSplit && selectedSplit.name;
      const operationVal =
        isSplitOperation.target.length > 0 &&
        isSplitOperation.source &&
        isSplitOperation.target[isSplitOperation.target.length - 1] !== '';

      if (splitVal && operationVal) {
        const copyEachOperationRule = { ...eachOperationRule };
        const copySelectedTarget = { ...selectedTarget };
        const copyTarget = [...targetData];
        const keys = Object.keys(copyTarget[copySelectedTarget.index])[0];
        const splitRule = {};

        for (let index in isSplitOperation.target) {
          const target = isSplitOperation.target[index];
          splitRule[`item.${target}`] = `split${splitHappened}[${index}]`;
        }

        delete copyEachOperationRule[copySelectedTarget.keys];
        copyEachOperationRule[copySelectedTarget.keys] = {
          newKey: keys,
          value: {
            operator: selectedSplit,
            type: selectedCity,
            source: isSplitOperation.source,
            target: isSplitOperation.target,
          },
          variable: {
            name: `split${splitHappened}`,
            value: `eval(item.${keys}.split("${selectedSplit.name}"))`,
          },
          rule: { ...splitRule },
          method: 'split',
        };

        setSplit(null);
        setSplitHappened(splitHappened + 1);
        setEachOprationRule({ ...copyEachOperationRule });
        setSplitOperation({
          isNeed: false,
          operateIndex: null,
          target: [''],
          hoverIndex: null,
          hoverType: null,
          source: '',
        });
        setSideBar(!sideBar);
        return true;
      } else {
        showSuccess(
          toasterType.error,
          toasterSummary.failure,
          toasterMessage.splitOperationFail,
        );
        setSplitOperation({ ...isSplitOperation, isNeed: false });
        setSideBar(true);
        return true;
      }
    }
    return false;
  }
  /* This function call when sub string option in selected in method dropDown from this we store the rule in eachOperationRule */
  function evaluteSubString() {
    if (isSubStringOperation.isNeed) {
      const operation =
        isSubStringOperation.source &&
        isSubStringOperation.startingIndex !== null &&
        isSubStringOperation.endingIndex;
      if (operation) {
        const copyEachOperationRule = { ...eachOperationRule };
        const copySelectedTarget = { ...selectedTarget };
        const copyTarget = [...targetData];
        const keys = Object.keys(copyTarget[copySelectedTarget.index])[0];

        delete copyEachOperationRule[copySelectedTarget.keys];
        copyEachOperationRule[copySelectedTarget.keys] = {
          newKey: keys,
          value: {
            source: isSubStringOperation.source,
            type: selectedCity,
            startingIndex: isSubStringOperation.startingIndex,
            endingIndex: isSubStringOperation.endingIndex,
          },
          rule: {
            [`item.${keys}`]: `item.${keys}.substr(${isSubStringOperation.startingIndex}, ${isSubStringOperation.endingIndex})`,
          },
          method: 'subString',
        };
        setSubStringOperation({
          isNeed: false,
          operateIndex: null,
          source: '',
          startingIndex: null,
          endingIndex: null,
        });
        setEachOprationRule({ ...copyEachOperationRule });
        setSideBar(!sideBar);
        return true;
      } else {
        setSideBar(true);
        showSuccess(
          toasterType.error,
          toasterSummary.failure,
          toasterMessage.subStringOperationFail,
        );
        return true;
      }
    }
    return false;
  }
  /* This function used to extract the date pattern which is already created by using of regex */
  function extractDateFormat(regexPattern, datePattern) {
    const match = regexPattern.exec(datePattern);
    if (match && match[1]) return match[1];
  }

  function handleDefaultValue(event) {
    const { value } = event.target;
    const key = selectedTarget.keys.split('.');
    setDefaultValue({ ...defaultValues, [key[key.length - 1]]: value });
  }

  // Show default value while hover plus icons in target rule
  function onHoverPlus(targetObj) {
    let targetPath = Object.values(targetObj)[0].split('.');
    const copyDefault = { ...defaultValues };
    const value = copyDefault[targetPath[targetPath.length - 1]];
    setToolTip(value);
  }

  // to create operate rule
  function createOperate(event) {
    try {
      // target node details index and path
      const { keys } = selectedTarget;
      // value return for drop down
      const { value } = event;
      if (dropDrownController === 'defaultValue' && activeTab === '0') {
        setIsDefaultOperation({ isNeed: false, operateIndex: null });
        // check corresponding source must not be empty
        const key = keys.split('.')[1];
        let isCreated = -1;
        const newOperateRule = {
          on: keys.split('.')[1],
          run: `fn = function(){return ${value.code}}`,
        };
        const copyOperate = [...operate];
        // check operate rule already created
        for (let index in operate) {
          if (operate[index].on === key) isCreated = index;
        }
        if (isCreated > -1) {
          copyOperate.splice(isCreated, 1, newOperateRule);
          if (value.code.includes("(''format'')"))
            setIsFormatNeed({ operateIndex: isCreated, isNeed: true });
          else setIsFormatNeed({ operateIndex: null, isNeed: false });
        } else {
          copyOperate.push(newOperateRule);
          if (value.code.includes("(''format'')"))
            setIsFormatNeed({ operateIndex: copyOperate.length, isNeed: true });
          else setIsFormatNeed({ operateIndex: null, isNeed: false });
        }
        setOperate(copyOperate);
        setOperateRule({
          ...operateRule,
          [keys]: value,
        });
      } else {
        let isCreated = -1;
        const key = keys.split('.')[1];
        const newOperateRule = {
          on: keys.split('.')[1],
          run: `fn = function(){}`,
        };
        const copyOperate = [...operate];
        // check operate rule already created
        for (let index in operate) {
          if (operate[index].on === key) isCreated = index;
        }
        if (isCreated > -1) {
          copyOperate.splice(isCreated, 1, newOperateRule);
          setIsDefaultOperation({ operateIndex: isCreated, isNeed: true });
        } else {
          copyOperate.push(newOperateRule);
          setIsDefaultOperation({
            operateIndex: copyOperate.length - 1,
            isNeed: true,
          });
        }
        setOperate(copyOperate);
        setOperateRule({
          ...operateRule,
          [keys]: value,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  /* This function call when method tab is clicked when dialog window open and update isNeed to true and operateIndex 
  which is get by selectedTarget. Params of function is event */
  function createMethod(event) {
    const { value } = event;
    const { index } = selectedTarget;
    const copyTarget = [...targetData];

    const targetKey = Object.keys(copyTarget[index])[0];
    // check operate rule already created

    if (value) {
      if (value.name === 'Split')
        setSplitOperation({
          ...isSplitOperation,
          isNeed: true,
          operateIndex: index,
          target: [targetKey],
        });
      else if (value.name === 'Padding')
        setPaddingOperation({ isNeed: true, operateIndex: index });
      else if (value.name === 'Join')
        setJoinOperation({
          ...isJoinOperation,
          isNeed: true,
          operateIndex: index,
        });
      else if (value.name === 'Substring')
        setSubStringOperation({
          ...isSubStringOperation,
          isNeed: true,
          operateIndex: index,
        });
    }
  }

  function transformDropDownKeys(arr) {
    try {
      if (Array.isArray(arr) && arr.length > 1) {
        const newArrr = [];
        for (let index = 0; index < arr.length; index++) {
          const newObj = {
            code: arr[index]['cd_code'],
            name: arr[index]['cd_description'],
          };
          newArrr.push(newObj);
        }
        return newArrr;
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  // call when date input got changed
  function handleDateFormate(event) {
    try {
      const { value } = event.target;
      const copyOperate = [...operate];
      const selOperRule = { ...selectedTarget };
      let currentIndex = -1;
      const key = selOperRule.keys.split('.')[1];
      for (let idx in copyOperate) {
        if (copyOperate[idx].on === key) currentIndex = idx;
      }
      const onFuction = { ...copyOperate[currentIndex] };
      onFuction.run = onFuction.run.replace(
        dateRpl,
        `getCURRENTDATE(''${value}'')`,
      );
      copyOperate.splice(currentIndex, 1, onFuction);
      setOperate([...copyOperate]);
      setDateInputFields(value);
    } catch (error) {
      console.error(error.message);
    }
  }

  function formDefaultOperation(event) {
    const { value, name } = event.target;
    if (name === 'newKey')
      setIsDefaultInput({ ...isDefaultInput, newKey: value });
    else setIsDefaultInput({ ...isDefaultInput, value: value });
  }

  function inputEvaluation() {
    if (
      (!isDefaultInput.newKey || !isDefaultInput.value) &&
      isDefaultOperation.isNeed &&
      typeof selectedCity === 'object'
    ) {
      showSuccess(
        toasterType.error,
        toasterSummary.failure,
        toasterMessage.createNewKey,
      );
      return false;
    } else if (isDefaultInput.newKey && isDefaultInput.value) {
      const copySelectedTarget = { ...selectedTarget };
      const { operateIndex } = { ...isDefaultOperation };
      setIsDefaultInput({ newKey: '', value: '' });
      const copyTarget = [...targetData];
      const keys = Object.keys(copyTarget[operateIndex])[0];
      if (selectedCity.name === 'Concat') {
        setEachOprationRule({
          ...eachOperationRule,
          [copySelectedTarget.keys]: {
            newKey: isDefaultInput.newKey,
            value: isDefaultInput.value,
            rule: {
              [`item.${isDefaultInput.newKey}`]: `item.${keys}.concat("${isDefaultInput.value}")`,
            },
          },
        });
      } else if (selectedCity.name === 'Split') {
        setEachOprationRule({
          ...eachOperationRule,
          [copySelectedTarget.keys]: {
            newKey: isDefaultInput.newKey,
            value: isDefaultInput.value,
            rule: {
              [`item.${isDefaultInput.newKey}`]: `item.${keys}.split("${isDefaultInput.value}")`,
            },
          },
        });
      } else if (selectedCity.name === 'Join') {
        setEachOprationRule({
          ...eachOperationRule,
          [copySelectedTarget.keys]: {
            newKey: isDefaultInput.newKey,
            value: isDefaultInput.value,
            rule: {
              [`item.${isDefaultInput.newKey}`]: `item.${keys}.join("${isDefaultInput.value}")`,
            },
          },
        });
      } else
        setEachOprationRule({
          ...eachOperationRule,
          [copySelectedTarget.keys]: {
            newKey: isDefaultInput.newKey,
            value: isDefaultInput.value,
            rule: {
              [`item.${isDefaultInput.newKey}`]: isDefaultInput.value,
            },
          },
        });
      return true;
    }
    return true;
  }

  /* This function allow as to remove rule from eachOperationRule state when cancel btn clicked in method selection drop down */
  function removeEachOperation() {
    if (!selectedCity && isDefaultInput.newKey && isDefaultInput.value) {
      const copyEachOperationRule = { ...eachOperationRule };
      delete copyEachOperationRule[selectedTarget.keys];
      setEachOprationRule({ ...copyEachOperationRule });
    }
  }

  /* This function allow as to create each function for transformation rule. Function create of a each operation rule we created before. 
  This function call at the last when save button click by UI  */
  function createEachOperation(eachOperationRule) {
    try {
      const eachOpertions = Object.values(eachOperationRule);
      let eachRule = '';
      let ruleVar = '';
      let eachFunction;
      for (let index in eachOpertions) {
        if (eachOpertions[index].rule) {
          const ruleKeys = Object.keys(eachOpertions[index].rule);
          for (let key of ruleKeys) {
            eachRule += `${key} = ${eachOpertions[index].rule[key]};`;
          }
        }
        if (
          eachOpertions[index] &&
          eachOpertions[index].variable &&
          eachOpertions[index].variable.name &&
          eachOpertions[index].variable.value
        ) {
          ruleVar += `const ${eachOpertions[index].variable.name} = ${eachOpertions[index].variable.value};`;
        }
      }
      if (ruleVar)
        eachFunction = `fn = function(item){${ruleVar}  ${eachRule} return item}`;
      else eachFunction = `fn = function(item){ ${eachRule} return item}`;
      return eachFunction;
    } catch (error) {
      console.error(error.message);
    }
  }

  /* This function used in two ways 
  1.To increase the number of input field for store the source key from source JSON 
  2.To remove the particular input field from source array by using index from the params 
  Its modified the isJoinOperation state.*/
  function modSrcInpuJoin(type, index) {
    const source = [...isJoinOperation.source];
    if (type === 'increment') source.push('');
    else if (type === 'remove') source.splice(index, 1);
    setJoinOperation({ ...isJoinOperation, source: source });
  }

  /* This function used in two ways 
  1.To increase the number of input field for store the target key from target JSON 
  2.To remove the particular input field from target array by using index from the params 
  Its modified the isSplitOperation state.*/
  function modTrgInpuSplit(type, index) {
    const target = [...isSplitOperation.target];
    if (type === 'increment') target.push('');
    else if (type === 'remove') target.splice(index, 1);
    setSplitOperation({ ...isSplitOperation, target: target });
  }

  return (
    <>
      <div
        className="flex h-screen w-full"
        style={{ backgroundColor: '#F0F0F0', color: 'B8B8B8' }}
      >
        <div
          className="scrollbar_hidden overflow-x-scroll overflow-y-scroll "
          style={{ width: '25%' }}
        >
          <div
            className="justify-content-evenly align-items-center border-bottom-1 border-bluegray-100 z-1 sticky top-0 flex w-full bg-white"
            style={{ width: 'max-content' }}
          >
            <div
              className="justify-content-around align-items-center flex"
              style={{ width: '65%' }}
            >
              <button onClick={() => handleClick()}>
                <RiArrowGoBackLine />
              </button>
              <h1 className="py-2 text-center text-xl text-blue-800">
                {'Source Data'}
              </h1>
            </div>
          </div>
          <div>
            {sourceJsonSchema ? (
              <JsonNode
                node={sourceJsonSchema}
                type="source"
                drag={drag}
                dragkeys={dragKeys.source}
                sourceDraggable={isSourceDraggable}
                targetDraggable={isTargetDraggable}
                path=""
              />
            ) : (
              <div className="justify-content-center align-items-center flex h-screen">
                {'No Source Data'}
              </div>
            )}
          </div>
        </div>
        <div
          className="flex-column border-bottom-1 border-bluegray-100 flex"
          style={{ width: '50%', backgroundColor: '#d9d7d7' }}
        >
          <div className="justify-content-center flex bg-white">
            <div
              className="justify-content-between flex w-10"
              style={{ padding: '6px 0' }}
            >
              <div className="w-4 text-center font-bold opacity-70">
                Mapping
              </div>
              <Dropdown
                value={npcType}
                onChange={(e) => {
                  setDragKeys({ source: [], target: [] });
                  saveRule();
                  setNpcType(e.value);
                }}
                options={npcKeys}
                placeholder="Select NpcType"
                className="md:w-8rem w-full"
                variant="filled"
              />
              <div className="justify-content-end bg flex w-4">
                <button
                  disabled={!sourceJsonSchema && !targetJsonSchema}
                  className=" border-round cursor-pointer p-1 text-white"
                  style={{ backgroundColor: '#1d80b0', width: '60px' }}
                  onClick={() => saveRule('save')}
                >
                  {!isLoading ? (
                    'Save'
                  ) : (
                    <ProgressSpinner
                      style={{ width: '40px', height: '15px' }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div
            className={'flex-column scrollbar_hidden flex overflow-y-scroll'}
          >
            {
              <div
                id="mainDiv"
                className="scrollbar_hidden flex overflow-y-scroll"
              >
                <div className="flex-column flex " style={{ width: '60%' }}>
                  {sourceData &&
                    sourceData.length > 0 &&
                    sourceData.map((elm, ind) => {
                      const word = typeof Object.values(elm)[0];
                      const firstLetter = word.charAt(0);
                      const firstLetterCap = firstLetter.toUpperCase();
                      const remainingLetters = word.slice(1);
                      const capitalizedWord = firstLetterCap + remainingLetters;
                      return (
                        <div
                          className="flex-column align-items-center justify-content-center flex "
                          style={{
                            minHeight: '100px',
                          }}
                          key={ind}
                        >
                          <div
                            className="flex-column flex"
                            style={{ width: '98%' }}
                          >
                            <div
                              className=" text-right"
                              style={{ width: '100%' }}
                            ></div>
                            <div
                              className="flex-column justify-content-between flex p-1"
                              style={{ height: '80%' }}
                            >
                              <p
                                className="justify-content-between flex font-semibold"
                                style={{
                                  width: '80%',
                                  marginLeft: '10%',
                                  marginBottom: '7px',
                                }}
                              >
                                <span className="opacity-50 ">
                                  {capitalizedWord}
                                </span>
                              </p>
                              <div className="justify-content-around align-items-center flex w-full">
                                <div
                                  className="h-3rem justify-content-center align-items-center border-round flex bg-white"
                                  style={{
                                    width: '60%',
                                    wordBreak: 'break-word',
                                  }}
                                  onDragOver={(e) => {
                                    if (sourceDraggable) e.preventDefault();
                                    setSourceIndex(ind);
                                  }}
                                >
                                  {elm === ' ' && (
                                    <p style={{ color: '	#B8B8B8' }}>
                                      Drag From Source Data
                                    </p>
                                  )}
                                  <p>{Object.values(elm)[0]}</p>
                                </div>
                                <div
                                  className=" justify-content-center align-items-center flex"
                                  style={{
                                    width: '40px',
                                    height: '30px',
                                    borderRadius: '30px',
                                    backgroundColor: '#3784ab',
                                  }}
                                >
                                  <HiArrowLongRight size={20} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="flex-column flex" style={{ width: '40%' }}>
                  {targetData &&
                    targetData.length > 0 &&
                    targetData.map((elm, index) => {
                      const word = typeof Object.values(elm)[0];
                      const firstLetter = word.charAt(0);
                      const firstLetterCap = firstLetter.toUpperCase();
                      const remainingLetters = word.slice(1);
                      const capitalizedWord = firstLetterCap + remainingLetters;
                      return (
                        <div
                          className="flex-column justify-content-center flex"
                          style={{
                            minHeight: '100px',
                          }}
                          key={index}
                        >
                          <div
                            className="flex-column flex"
                            style={{ width: '90%' }}
                          >
                            <div
                              className=" text-right"
                              style={{ width: '100%' }}
                            ></div>
                            <div
                              className="flex-column justify-content-between flex p-1"
                              style={{ height: '80%' }}
                            >
                              <p
                                className="justify-content-between align-items-center flex font-semibold"
                                style={{
                                  width: '80%',
                                  marginLeft: '10%',
                                  marginBottom: '7px',
                                }}
                              >
                                <span className="opacity-50 ">
                                  {capitalizedWord}
                                </span>
                                <div className="align-items-center flex">
                                  {sourceData[index] === ' ' &&
                                    targetData[index] !== ' ' && (
                                      <>
                                        <span
                                          style={{
                                            marginRight: '8px',
                                            width: '14px',
                                            height: '14px',
                                          }}
                                          onMouseEnter={() =>
                                            onHoverPlus(targetData[index])
                                          }
                                          className={`${
                                            sourceData[index] === ' ' &&
                                            targetData[index] !== ' '
                                              ? 'custom-tooltip-btn cursor-pointer'
                                              : 'cursor-pointer'
                                          }`}
                                          onClick={() => {
                                            toggleSideBar(
                                              targetData[index],
                                              index,
                                            );
                                            sourceData[index] === ' ' &&
                                            targetData[index] !== ' '
                                              ? setDropDownController(
                                                  'defaultValue',
                                                )
                                              : setDropDownController(
                                                  'hardCodeFunction',
                                                );
                                          }}
                                        >
                                          <IoAdd />
                                        </span>
                                        {sourceData[index] === ' ' &&
                                        targetData[index] !== ' ' &&
                                        tooltip ? (
                                          <Tooltip target=".custom-tooltip-btn">
                                            <p>{tooltip}</p>
                                          </Tooltip>
                                        ) : (
                                          ''
                                        )}
                                      </>
                                    )}
                                  {((sourceData[index] !== ' ' &&
                                    targetData[index] !== ' ') ||
                                    (sourceData[index] === ' ' &&
                                      targetData[index] !== ' ')) && (
                                    <span
                                      className="cursor-pointer"
                                      style={{ width: '14px', height: '14px' }}
                                      onClick={() => removeNode(index)}
                                    >
                                      <MdDelete />
                                    </span>
                                  )}
                                </div>
                              </p>
                              <div className="justify-content-around flex w-full">
                                <div
                                  className="h-3rem justify-content-center align-items-center border-round flex bg-white"
                                  style={{
                                    width: '90%',
                                    wordBreak: 'break-all',
                                  }}
                                  onDragOver={(e) => {
                                    if (targetDraggable) e.preventDefault();
                                    setTargetIndex(index);
                                  }}
                                >
                                  {elm === ' ' && (
                                    <p style={{ color: '	#B8B8B8' }}>
                                      Drag From Target Data
                                    </p>
                                  )}
                                  <p>{Object.values(elm)[0]}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            }
          </div>
        </div>
        <div
          className="scrollbar_hidden overflow-y-scroll"
          style={{ width: '25%' }}
        >
          <div className="justify-content-evenly align-items-center border-bottom-1 border-bluegray-100 z-1 sticky top-0 flex w-full bg-white">
            <div style={{ width: '85%' }}>
              <h1 className="py-2 text-center text-xl text-blue-800">
                {'Target Data'}
              </h1>
            </div>
            <button
              onClick={() => {
                alert('show builder');
                setShowBuilder(true);
              }}
            >
              <TiUpload />
            </button>
          </div>
          <div>
            {targetJsonSchema ? (
              <JsonNode
                node={targetJsonSchema}
                type="target"
                drag={drag}
                dragkeys={dragKeys.target}
                sourceDraggable={isSourceDraggable}
                targetDraggable={isTargetDraggable}
                path=""
              />
            ) : (
              <div className="justify-content-center align-items-center flex h-screen">
                {'No Target Data'}
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog
        modal={false}
        visible={sideBar}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        style={{ width: '35vw', minWidth: '250px', height: '60vh' }}
        onHide={toggleSideBar}
      >
        <div className="card">
          <TabView
            activeIndex={activeTab}
            onTabChange={(event) => toggleTab(event.index)}
          >
            {(sourceData[selectedTarget.index] !== ' ' ||
              sourceData[selectedTarget.index] === ' ') && (
              <TabPanel header="Function">
                <Dropdown
                  value={selectedCity}
                  onChange={(e, index) => {
                    setSelectedCity(e.value);
                    createOperate(e);
                  }}
                  options={
                    dropDrownController === 'hardCodeFunction'
                      ? hardCodeFunction
                      : dropDownApi
                  }
                  optionLabel="name"
                  showClear={
                    dropDrownController === 'hardCodeFunction' &&
                    isDefaultOperation.isNeed
                      ? true
                      : false
                  }
                  placeholder="Default Function"
                  className="md:w-14rem w-full"
                />
                {isFormatNeed.isNeed && (
                  <div className="flex-column flex gap-2 pt-4  ">
                    <label htmlFor="username">Date Format</label>
                    <InputText
                      className="p-inputtext-sm"
                      value={dateInputField}
                      placeholder="date format"
                      onChange={handleDateFormate}
                    />
                  </div>
                )}
                {isDefaultOperation.isNeed && selectedCity && (
                  <div className="flex-column flex gap-2 pt-4  ">
                    <label htmlFor="username">New Key</label>
                    <InputText
                      className="p-inputtext-sm"
                      name="newKey"
                      value={isDefaultInput.newKey}
                      placeholder=""
                      onChange={formDefaultOperation}
                    />
                    <label htmlFor="username">Value</label>
                    <InputText
                      className="p-inputtext-sm"
                      name="value"
                      value={isDefaultInput.value}
                      placeholder=""
                      onChange={formDefaultOperation}
                    />
                  </div>
                )}
              </TabPanel>
            )}
            {sourceData[selectedTarget.index] === ' ' && (
              <TabPanel header="Default Value">
                <input
                  type="text"
                  className="border-round border-2 border-blue-400"
                  defaultValue={keyValue}
                  onChange={handleDefaultValue}
                />
              </TabPanel>
            )}
            <TabPanel header="Methods">
              <Dropdown
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.value);
                  createMethod(e);
                }}
                options={hardCodeFunction}
                optionLabel="name"
                showClear={true}
                placeholder="Methods"
                className="md:w-14rem w-full"
              />
              {isPaddinOperation.isNeed && (
                <div className="flex-column flex gap-2 pt-4  ">
                  <label htmlFor="option">Padding Option</label>
                  <Dropdown
                    value={selectedPadding}
                    onChange={(event, index) => {
                      setPadding(event.value);
                    }}
                    options={paddingOption}
                    optionLabel="name"
                    name="option"
                    placeholder="Methods"
                    className="md:w-14rem w-full"
                  />

                  <label htmlFor="option">Padding Length</label>
                  <Dropdown
                    value={paddingDetails.value}
                    onChange={(event, index) => {
                      setPaddingDetails({
                        ...paddingDetails,
                        value: event.value,
                      });
                    }}
                    options={dropValue}
                    optionLabel="name"
                    name="option"
                    placeholder="Value"
                    className="md:w-14rem w-full"
                  />

                  <label htmlFor="character">Padding Character</label>
                  <InputText
                    className="p-inputtext-sm"
                    name="character"
                    value={paddingDetails.char}
                    placeholder="character"
                    onChange={(event) =>
                      setPaddingDetails({
                        ...paddingDetails,
                        char: event.target.value,
                      })
                    }
                  />

                  <label htmlFor="character">Source</label>
                  <InputText
                    className="p-inputtext-sm"
                    name="character"
                    value={paddingDetails.source}
                    placeholder="character"
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onChange={(event) =>
                      setPaddingDetails({
                        ...paddingDetails,
                        source: event.target.value,
                      })
                    }
                  />
                </div>
              )}
              {isJoinOperation.isNeed && (
                <div className="flex-column flex gap-2 pt-4  ">
                  <label htmlFor="option">Option</label>
                  <Dropdown
                    value={selectedJoin}
                    onChange={(event, index) => {
                      setJoin(event.value);
                    }}
                    options={Sym}
                    editable
                    optionLabel="name"
                    showClear={true}
                    name="option"
                    placeholder="Option"
                    className="md:w-14rem w-full"
                  />

                  <label htmlFor="character">
                    Source{' '}
                    <span
                      style={{ width: '14px', height: '14px' }}
                      onClick={() => modSrcInpuJoin('increment')}
                    >
                      <IoAdd />
                    </span>
                  </label>
                  {isJoinOperation &&
                    isJoinOperation.source.length > 0 &&
                    isJoinOperation.source.map((elm, index) => {
                      return (
                        <div className="justify-content-between align-items-center  flex flex-row">
                          <InputText
                            className="p-input w-10 text-sm"
                            name="character"
                            value={isJoinOperation.source[index]}
                            placeholder="character"
                            onDragOver={(e) => {
                              e.preventDefault();
                              setJoinOperation({
                                ...isJoinOperation,
                                hoverIndex: index,
                              });
                            }}
                          />
                          <span
                            style={{ width: '14px', height: '14px' }}
                            onClick={() => modSrcInpuJoin('remove', index)}
                          >
                            <MdDelete />
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
              {isSplitOperation.isNeed && (
                <div className="flex-column flex gap-2 pt-4  ">
                  <label htmlFor="option">Option</label>
                  <Dropdown
                    value={selectedSplit}
                    onChange={(event, index) => {
                      setSplit(event.value);
                    }}
                    options={Sym}
                    optionLabel="name"
                    name="option"
                    editable
                    placeholder="Option"
                    className="md:w-14rem w-full"
                  />

                  <label htmlFor="character">
                    target{' '}
                    <span
                      style={{ width: '14px', height: '14px' }}
                      onClick={() => modTrgInpuSplit('increment')}
                    >
                      <IoAdd />
                    </span>
                  </label>
                  {isSplitOperation.target &&
                    isSplitOperation.target.length > 0 &&
                    isSplitOperation.target.map((elm, index) => {
                      return (
                        <div className="justify-content-between align-items-center  flex flex-row">
                          <InputText
                            className="p-input w-10 text-sm"
                            name="character"
                            value={isSplitOperation.target[index]}
                            placeholder="target"
                            onDragOver={(e) => {
                              e.preventDefault();
                              setSplitOperation({
                                ...isSplitOperation,
                                hoverIndex: index,
                                hoverType: 'target',
                              });
                            }}
                          />
                          <span
                            style={{ width: '14px', height: '14px' }}
                            onClick={() => modTrgInpuSplit('remove', index)}
                          >
                            {' '}
                            <MdDelete />
                          </span>
                        </div>
                      );
                    })}
                  <label htmlFor="character">Source</label>
                  <InputText
                    className="p-inputtext-sm"
                    name="character"
                    value={isSplitOperation.source}
                    placeholder="source"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setSplitOperation({
                        ...isSplitOperation,
                        hoverType: 'source',
                      });
                    }}
                    onChange={(event) =>
                      setPaddingDetails({
                        ...paddingDetails,
                        source: event.target.value,
                      })
                    }
                  />
                </div>
              )}
              {isSubStringOperation.isNeed && (
                <div className="flex-column flex gap-2 pt-4  ">
                  <label htmlFor="character">Source</label>
                  <InputText
                    className="p-inputtext-sm"
                    name="character"
                    value={isSubStringOperation.source}
                    placeholder="source"
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                  />
                  <label htmlFor="character">Starting Index</label>
                  <InputNumber
                    className="p-inputtext-sm"
                    name="character"
                    value={isSubStringOperation.startingIndex}
                    placeholder="starting index"
                    useGrouping={false}
                    min={0}
                    onValueChange={(event) =>
                      setSubStringOperation({
                        ...isSubStringOperation,
                        startingIndex: event.target.value,
                      })
                    }
                  />
                  <label htmlFor="character">Ending Index</label>
                  <InputNumber
                    className="p-inputtext-sm"
                    name="character"
                    value={isSubStringOperation.endingIndex}
                    placeholder="ending index"
                    useGrouping={false}
                    min={0}
                    onValueChange={(event) =>
                      setSubStringOperation({
                        ...isSubStringOperation,
                        endingIndex: event.target.value,
                      })
                    }
                  />
                </div>
              )}
            </TabPanel>
          </TabView>
        </div>
      </Dialog>
      <Toast ref={toast} />
      <Dialog
        visible={showBuilder}
        style={{ width: '80%', height: '80vh' }}
        onHide={() => setShowBuilder(false)}
      >
        <Builder
          isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
          defaultJSOn={json}
          controlPolicy={controlPolicy}
          colorPolicy={colorPolicy}
          updatedNodeConfig={updateBuilderJson}
          uiPolicy={cardUIPolicy}
        />
      </Dialog>
    </>
  );
};
export default JsonViewer;
