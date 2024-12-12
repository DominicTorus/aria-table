/* eslint-disable */
import { Spinner } from '@nextui-org/react';
import _ from 'lodash';
import React, {
  Suspense,
  createContext,
  lazy,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MdExpand } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainpageLoader, TickIcon } from '../asset/SvgsApplication';
import { DarkmodeContext } from '../commonComponents/context/DarkmodeContext';
import { Upload } from '../commonComponents/Model/UploadJson';
import { booleanContext } from '../jonui/NewNodeInfoSidebar';
import TorusButton from '../torusComponents/TorusButton';
import './djui.css';
import { checkForNull } from './utils/utils';

const UiDecider = lazy(() => import('./Components/UiDecider'));

export const BuilderContext = createContext();
export default function Builder({
  keys,
  defaultJSOn,
  updatedNodeConfig,
  isAdmin,
  controlPolicy,
  colorPolicy,
  uiPolicy,
  helperJson,
  type = '',
  height,
  children,
}) {
  const [totalOptions, setTotalOptions] = useState([]);
  const { darkMode } = useContext(DarkmodeContext);
  const { expandTableUi, setExpandTableUi } = useContext(booleanContext);

  const [json, setJson] = useState({});
  const [dupJson, setDupJson] = useState({});

  const [collapse, setCollapse] = useState(false);
  const [editedValues, setEditedValues] = useState({});
  const [totalColors, setTotalColors] = useState([]);
  const [keyJson, setKeyJson] = useState({});
  const [decider, setDecider] = useState('');

  const settJson = (js) => {
    try {
      const copiedObject = _.cloneDeep(js);
      setJson(copiedObject);
      setDupJson(copiedObject);
      console.log('json', copiedObject);
      // if (
      //   !_.isEqual(defaultJSOn, copiedObject) &&
      //   uiPolicy["Level1"] == "table"
      // ) {
      //   updatedNodeConfig(copiedObject, keys);
      // }
    } catch (err) {
      showErrorss(err);
    }
  };

  const handleSave = async (data, mainJson) => {
    try {
      let finalData = mainJson;

      if (data && Object.keys(data).length > 0) {
        setDecider('');
        Object.keys(data).forEach((key) => {
          finalData = functionality('update', key, {
            key: key.split('.')[key.split('.').length - 1],
            value: data[key],
          });
        });
      }
      await updatedNodeConfig(finalData, keys);
      setDecider('loading');
      setTimeout(() => {
        setDecider('tick');
        setTimeout(() => {
          setDecider('');
        }, 1000);
      }, 1250);
      console.log(finalData, 'Data clicked');
    } catch (err) {
      console.error(err);
      toast.error('Error in saving data', {
        position: 'bottom-right',
        autoClose: 1250,
      });
    }
  };

  const functionality = (func, path, value = null) => {
    try {
      if (path !== '') {
        let result;
        result = path.split('.');
        result.shift();
        result = result.join('.');

        if (func == 'add') {
          let js = json;
          const upjs = _.set(js, result + '.' + value.key, value.values);
          settJson(upjs);
        }
        if (func == 'edit') {
          let path = _.toPath(result);
          let lastKey = path[path.length - 1];
          path.pop();
          let jsr = json;

          if (path.length > 0) {
            let js = _.get(jsr, path.join('.'));
            let gs;
            Object.keys(js).forEach((key) => {
              if (key == lastKey) {
                gs = { ...gs, [value]: js[key] };
              } else {
                gs = { ...gs, [key]: js[key] };
              }
            });

            _.set(jsr, path.join('.'), gs);
            settJson(jsr);
            let wholeKey = ['', ...path, lastKey].join('.');
            let updatedEditedValues = {};
            Object.keys(editedValues).forEach((keys) => {
              if (keys == wholeKey) {
                updatedEditedValues = {
                  ...updatedEditedValues,
                  [['', ...path, value].join('.')]: editedValues[keys],
                };
              } else {
                updatedEditedValues = {
                  ...updatedEditedValues,
                  [keys]: editedValues[keys],
                };
              }
            });
            setEditedValues(updatedEditedValues);
          } else {
            let gss;
            Object.keys(jsr).forEach((key) => {
              if (key == lastKey) {
                gss = { ...gss, [value]: jsr[key] };
              } else {
                gss = { ...gss, [key]: jsr[key] };
              }
            });

            settJson(gss);
            let wholeKey = ['', lastKey].join('.');
            let updatedEditedValues = {};
            Object.keys(editedValues).forEach((keys) => {
              if (keys == wholeKey) {
                updatedEditedValues = {
                  ...updatedEditedValues,
                  [['', value].join('.')]: editedValues[keys],
                };
              } else {
                updatedEditedValues = {
                  ...updatedEditedValues,
                  [keys]: editedValues[keys],
                };
              }
            });
          }
        }
        if (func == 'update') {
          if (value) {
            const js = json;

            _.update(js, result, (n) => {
              n = value.value;

              return n;
            });
            settJson(js);
            return js;
          }
        }
        if (func == 'delete') {
          let js = json;

          let path = _.toPath(result);

          for (let i = 0; i < path.length - 1; i++) {
            js = js[path[i]];
          }
          const indexToDelete = path[path.length - 1];
          const lastKey = path[path.length - 1];
          if (Array.isArray(js)) {
            js.splice(indexToDelete, 1);
          } else if (typeof js === 'object') {
            delete js[lastKey];
          }
          path.pop();
          const upjs = _.set(json, path, js);
          settJson(upjs);
        }
      } else {
        let js = json;
        if (func == 'add') {
          if (typeof js === 'object' && !Array.isArray(js)) {
            js = {
              ...js,
              [value.key]: value.values,
            };
          } else {
            js = [...js, value.values];
          }
          settJson(js);
        }
        if (func == 'edit') {
          let gs;
          Object.keys(js)?.map((key) => {
            if (key == value) {
              gs = { ...gs, [value]: js[key] };
            } else {
              gs = { ...gs, [key]: js[key] };
            }

            settJson(gs);
          });
        }
        if (func == 'update') {
          Object.keys(js)?.map((key) => {
            if (key == value.key) {
              return (js[key] = value.value);
            }
            return js[key];
          });
          settJson(js);
          return js;
        }
        if (func == 'delete') {
          js = {};
          settJson(js);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = (file) => {
    try {
      if (file) {
        let uploadedJson = JSON.parse(file);
        const error = checkForNull(uploadedJson);
        if (error) {
          settJson(uploadedJson);
        } else {
          showErrorss('key should not be null or undefined');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showErrorss = (type) => {
    let errorMessage;
    if (type == 'key') {
      errorMessage = 'Key should not be empty';
    } else if (type == 'value') {
      errorMessage = 'Value should not be empty';
    } else if (type == 'selected') {
      errorMessage = 'selected should not be empty';
    } else {
      errorMessage = 'please select key and value';
    }

    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000,
    });
  };

  useEffect(() => {
    try {
      let totalOption = [];

      if (Object.keys(controlPolicy).length == 0) {
        return setTotalOptions([]);
      } else {
        for (const [level, values] of Object.entries(controlPolicy)) {
          const levelOptions =
            values &&
            Array.isArray(values) &&
            values.map((value) => ({
              label: value.charAt(0).toUpperCase() + value.slice(1),
              value,
            }));

          totalOption.push({
            L: level.slice(5),
            options: levelOptions,
          });
        }
        setTotalOptions(totalOption);
      }

      let totalColor = [];

      if (Object.keys(colorPolicy).length === 0) {
        return setTotalColors([]);
      } else {
        for (const [level] of Object.entries(colorPolicy)) {
          const levelOptions = {
            value: colorPolicy[level],
          };

          totalColor.push({
            L: level.slice(5),
            color: levelOptions.value,
          });
        }
        setTotalColors(totalColor);
      }
      settJson(defaultJSOn);
      if (helperJson) setKeyJson(helperJson);

      return () => {
        setDecider('');
      };
    } catch (error) {
      console.error(error);
    }
  }, [controlPolicy, colorPolicy, defaultJSOn, helperJson]);

  console.log(editedValues, 'editedValues');

  const savingMode = (showing) => {
    switch (showing) {
      case 'loading':
        return (
          <Spinner
            size="sm"
            classNames={{
              base: 'w-8 h-8 bg-transparent rounded-full animate-spin border-t-transparent border-l-transparent border-r-transparent border-b-transparent',
              wrapper:
                'relative  border-dotted border-t-transparent border-l-transparent border-r-transparent border-b-transparent ',
              circle1:
                'absolute opacity-100  border-dotted border-t-transparent border-l-transparent border-r-transparent border-4 border-b-[#53cf88] ',
              circle2:
                'absolute opacity-100 border-t-transparent border-l-transparent border-r-transparent border-4 border-b-[#53cf88]',
            }}
          />
        );

      case 'tick':
        return (
          // <GrCheckboxSelected
          //   size={15}
          //   color={`${
          //     darkMode
          //       ? "white"
          //       : ` ${uiPolicy[`Level${[Number(1)]}`] === "table" ? "#727D8D" : "black"}`
          //   } `}
          //   className="hover:text-teal-500"
          // />

          <TickIcon className="text-white" />
        );

      default:
        return <>Save</>;
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        functionality,
        editedValues,
        setEditedValues,
        collapse,
        builderChildren: children,
      }}
    >
      <Suspense fallback={<p>loading ...</p>}>
        <div
          style={{ height: height ? height : '100%' }}
          className="flex  w-full  flex-col items-center overflow-y-scroll"
        >
          <div className="h-[95%] w-full">
            {uiPolicy && (
              <UiDecider
                uiPolicy={uiPolicy}
                json={dupJson}
                setjson={setJson}
                keyJson={keyJson}
                depth={Number(0)}
                isAdmin={isAdmin}
                totalOptions={totalOptions}
                totalColors={totalColors}
                level={Number(1)}
                dp={Number(0)}
                path={''}
                title={''}
                type={type}
              >
                <div>
                  <TorusButton
                    onPress={() => handleSave(editedValues, json)}
                    Children={
                      <div className="flex w-full  items-center justify-center ">
                        <p className="text-[0.72vw] font-medium text-white">
                          {savingMode(decider)}
                        </p>
                      </div>
                    }
                    buttonClassName="flex cursor-pointer items-center justify-center rounded-md bg-[#0736C4]  w-[4.58vw] h-[3.98vh]"
                  />

                  {/* <TorusButton
                    size="sm"
                    onClick={() => handleSave(editedValues, json)}
                    className={` flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-md hover:text-[#03DAC6]
                      ${
                        darkMode
                          ? ` ${uiPolicy[`Level${[Number(1)]}`] === "table" ? "bg-transparent " : "bg-transparent"} `
                          : ` ${uiPolicy[`Level${[Number(1)]}`] === "table" ? "bg-transparent" : "bg-transparent"}`
                      }  border-0 hover:bg-[#4A90E2]`}
                  > */}

                  {uiPolicy['Level1'] !== 'table' && (
                    <span
                      onClick={() => setCollapse(!collapse)}
                      className={` flex h-[25px] w-[25px] items-center justify-center rounded-md ${darkMode ? 'bg-transparent' : 'bg-transparent'} border-0 hover:bg-[#4A90E2]  `}
                    >
                      <MdExpand
                        size={15}
                        className="rotate-45"
                        color={darkMode ? 'white' : 'black'}
                      />
                    </span>
                  )}
                  <div
                    style={{
                      display:
                        !json || Object.keys(json).length == 0
                          ? 'block'
                          : 'none',
                    }}
                  >
                    <span className="fileUpload">
                      <span
                        className={` flex h-[25px] w-[25px] items-center justify-center rounded-md 
                          ${darkMode ? 'bg-transparent' : 'bg-transparent'} border-0 hover:bg-[#4A90E2]  `}
                      >
                        <Upload
                          id={'builderUpload'}
                          key={'builderUpload'}
                          setFiles={handleUpload}
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </UiDecider>
            )}
          </div>
        </div>
      </Suspense>
    </BuilderContext.Provider>
  );
}
