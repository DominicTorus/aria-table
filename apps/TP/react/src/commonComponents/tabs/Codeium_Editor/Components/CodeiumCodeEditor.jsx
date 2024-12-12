/* eslint-disable */
import { CodeiumEditor } from '@codeium/react-code-editor';
import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ArrowGone,
  DockBottom,
  DockSide,
  FailureIcon,
  NavbarBackward,
  Save,
  SuccessIcon,
} from '../../../../SVG_Application';
import TorusButton from '../../../../torusComponents/TorusButton';
import TorusToolTip from '../../../../torusComponents/TorusToolTip';
import { DarkmodeContext } from '../../../context/DarkmodeContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TorusModellerContext } from '../../../../Layout';
import { BsArrowUpRightSquareFill } from 'react-icons/bs';
import { isLightColor } from '../../../../asset/themes/useTheme';

// import AnimatedButton from '../../Gorule';

const CodeiumCodeEditor = ({
  setNavigateTo,
  object,
  customCode,
  onChange,
  setDocktoBottom,
  DocktoBottom,
  setDocktoLeft,
  Docktoleft,
  selectedAction,
  selectedActionName,
  handleSave,
  setTestJson,
  testjson,
  strarr,
}) => {
  const monacoRef = useRef();
  const [objectValue, setObjectValue] = useState({});
  const { darkMode } = useContext(DarkmodeContext);
  const arrowRef = useRef(null);
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  useGSAP(() => {
    gsap.fromTo(
      arrowRef.current,
      { opacity: 0, duration: 0.3, ease: 'power1.inOut' },
      { opacity: 1, duration: 0.3, ease: 'power1.inOut' },
    );
  }, []);

  const [backShown, setBackShown] = useState(false);
  const [sucessBtn, setSucessBtn] = useState(false);
  const [failureBtn, setFailureBtn] = useState(false);

  function ShowAutocompletion(obj) {
    try {
      // Helper function to return the monacoRef.current completion item type of a thing
      function getType(thing, isMember) {
        isMember =
          isMember == undefined
            ? typeof isMember == 'boolean'
              ? isMember
              : false
            : false; // Give isMember a default value of false
        switch ((typeof thing).toLowerCase()) {
          case 'object':
            return monacoRef.current.languages.CompletionItemKind.Class;
          case 'function':
            return isMember
              ? monacoRef.current.languages.CompletionItemKind.Method
              : monacoRef.current.languages.CompletionItemKind.Function;
          default:
            return isMember
              ? monacoRef.current.languages.CompletionItemKind.Property
              : monacoRef.current.languages.CompletionItemKind.Variable;
        }
      }
      // Register object that will return autocomplete items
      monacoRef.current.languages.registerCompletionItemProvider('javascript', {
        // Run this function when the period or open parenthesis is typed (and anything after a space)
        triggerCharacters: ['.', '('],

        // Function to generate autocompletion results
        provideCompletionItems: function (model, position, token) {
          try {
            var last_chars = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 0,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            var words = last_chars.replace('\t', '').split(' ');
            var active_typing = words[words.length - 1]; // What the user is currently typing (everything after the last space)

            // This if statement adds support for autocomplete inside if statements and stuff
            if (active_typing.includes('(')) {
              active_typing = active_typing.split('(');
              active_typing = active_typing[active_typing.length - 1];
            }

            // If the last character typed is a period then we need to look at member objects of the obj object
            var is_member =
              active_typing.charAt(active_typing.length - 1) == '.';

            // Array of autocompletion results
            var result = [];
            let pushedKey = [];
            Object.keys(obj).forEach((key) => {
              if (pushedKey.includes(key)) return;
              let ds = '';
              pushedKey.push(key);
              if (!is_member) {
                try {
                  ds = obj[key].__proto__.constructor.name;
                } catch (e) {
                  ds = typeof obj[key];
                }

                result.push({
                  label: key,
                  insertText: key,
                  detail: ds,
                  kind: getType(obj[key], is_member),
                });
              }
            });

            // Used for generic handling between member and non-member objects
            var last_token = obj;
            var prefix = '';

            if (is_member) {
              // Is a member, get a list of all members, and the prefix
              var parents = active_typing
                .substring(0, active_typing.length - 1)
                .split('.');

              if (parents != undefined && parents != null) {
                last_token = obj[parents[0]];

                if (last_token !== undefined && last_token !== null) {
                  prefix = parents[0];

                  for (var i = 1; i < parents.length; i++) {
                    var propToLookFor = parents[i];

                    // Support for arrays
                    var isPropAnArray =
                      propToLookFor.charAt(propToLookFor.length - 1) == ']';
                    if (isPropAnArray)
                      propToLookFor = propToLookFor.split('[')[0];

                    if (last_token.hasOwnProperty(propToLookFor)) {
                      prefix += '.' + propToLookFor;
                      last_token = last_token[propToLookFor];

                      if (isPropAnArray && Array.isArray(last_token)) {
                        last_token = last_token[0];
                      }
                    } else {
                      // Not valid
                      return result;
                    }
                  }

                  prefix += '.';
                  // Array properties
                  if (Array.isArray(last_token)) last_token = { length: 0 };

                  // Get all the child properties of the last token
                  for (var prop in last_token) {
                    // Do not show properites that begin with "__"
                    if (
                      last_token.hasOwnProperty(prop) &&
                      !prop.startsWith('__')
                    ) {
                      // Get the detail type (try-catch) incase object does not have prototype
                      var details = '';
                      try {
                        details = last_token[prop].__proto__.constructor.name;
                      } catch (e) {
                        details = typeof last_token[prop];
                      }

                      if (pushedKey.includes(prefix + prop)) break;
                      // Create completion object
                      pushedKey.push(prefix + prop);
                      var to_push = {
                        label: prefix + prop,
                        kind: getType(last_token[prop], is_member),
                        detail: details,
                        insertText: prop,
                      };

                      // Change insertText and documentation for functions
                      // if (to_push.detail.toLowerCase() == "function") {
                      // to_push.insertText += "(";
                      // to_push.documentation = last_token[prop]
                      // .toString()
                      // .split("{")[0]; // Show function prototype in the documentation popup
                      // }

                      // Add to final results
                      result.push(to_push);
                    }
                  }
                  // Loop through all the parents the current one will have (to generate prefix)
                }
              }
            }

            return {
              suggestions: result,
            };
          } catch (err) {
            console.error(err.message);
          }
          // Split everything the user has typed on the current line up at each space, and only look at the last word
        },
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    if (monacoRef.current && object && !_.isEqual(object, objectValue)) {
      const value = _.cloneDeep(object);
      ShowAutocompletion(value);
      setObjectValue(value);
    }
  }, [object, monacoRef.current]);

  const beforeMount = async (monaco) => {
    // const response = await fetch(
    // 'https://cdn.jsdelivr.net/npm/valibot@0.42.0/dist/index.d.ts',
    // );
    // const valibotTypes = await response.text();
    // let result = `
    // declare module "valibot" {
    // ${valibotTypes}
    // }
    // `;

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(
    // result,
    // 'valibot.d.ts',
    // );
    // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    // target: monaco.languages.typescript.ScriptTarget.ES6,
    // allowNonTsExtensions: true,
    // moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    // module: monaco.languages.typescript.ModuleKind.ESNext, // Ensure ESM is being used
    // typeRoots: ['node_modules/@types'],
    // });
    monacoRef.current = monaco;
  };

  const handleDocktoLeft = () => {
    setDocktoLeft(true);
    setDocktoBottom(false);
  };
  const handleDocktoBottom = () => {
    setDocktoBottom(true);
    setDocktoLeft(false);
  };

  const hideSpecificLink = () => {
    const link = document.querySelector(
      'a[target="_blank"][rel="noreferrer noopener"]',
    );
    if (link) {
      link.style.display = 'none';
    }
  };

  useEffect(() => {
    hideSpecificLink();
  }, []);

  return (
    <div className={` h-[100%] w-[100%] rounded-md `}>
      <div
        className={` flex w-[100%] items-center justify-between`}
        style={{
          borderColor: `${selectedTheme?.border}`,
        }}
      >
        <div
          className={`${DocktoBottom ? 'flex w-[80%] items-center p-2 px-[0.25vw]  py-[0.55vh]' : 'flex w-[80%] items-center px-[0.25vw] py-[0.55vh]'} `}
        >
          <span
            ref={arrowRef}
            className="cursor-pointer"
            onClick={() => {
              setNavigateTo('');
            }}
          >
            <NavbarBackward
              className={`h-[1.25vw] w-[2.31vw] `}
              stroke={`${selectedTheme?.['textOpacity/50']}`}
            />
          </span>

          <span
            className="p-2 text-[1.10vw] font-bold "
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            Expresion Editor
          </span>
        </div>
        <div
          className={`flex transition-[width] delay-75 duration-300 ease-soft-spring ${DocktoBottom ? 'w-[9%]' : 'w-[15%]'} items-center justify-end gap-[0.55vw]`}
        >
          {/* <TorusToolTip
						placement="top"
						triggerElement={
							<TorusButton
								id={'df_rule'}
								buttonClassName={` ${DocktoBottom ? 'bg-[#0736C4] ' : 'bg-[#DAE1F6]'} ${DocktoBottom ? 'h-[4vh] w-[2vw]' : 'h-[4vh] w-[2vw]'} 
									rounded `}
								isIconOnly={true}
								onPress={() => {
									if (!DocktoBottom) {
										handleDocktoBottom();
									}
								}}
								size=""
								Children={
									<DockBottom
										className={`h-[1.16vw] w-[1.5vw]
											${DocktoBottom ? 'fill-[#0736C4] stroke-[#ffffff]' : 'fill-[#DAE1F6] stroke-[#0736C4]'} 
												dark:fill-[#ffffff] dark:stroke-[#0736C4] `}
									/>
								}
							/>
						}
						color={'#ccc'}
						tooltipFor={'df_rule'}
						tooltipContent={'console bottom'}
					/>

					<TorusToolTip
						placement="top"
						triggerElement={
							<TorusButton
								id={'df_rule'}
								buttonClassName={`${Docktoleft ? 'bg-[#0736C4] ' : 'bg-[#DAE1F6]'} 
								${DocktoBottom ? 'flex   h-[4vh]  w-[1.8vw] items-center justify-center ' : 'flex   h-[4vh]  w-[1.8vw] items-center justify-center  '} 
								rounded`}
								isIconOnly={true}
								onPress={() => {
									if (!Docktoleft) {
										handleDocktoLeft();
									}
								}}
								size=""
								Children={
									<DockSide
										className={`h-[1.14vw] w-[1.25vw] 
											${Docktoleft ? 'fill-[#0736C4] stroke-[#ffffff]' : 'fill-[#DAE1F6] stroke-[#0736C4]'} 
												dark:stroke-[#0736C4] `}
									/>
								}
							/>
						}
						color={'#ccc'}
						tooltipFor={'df_rule'}
						tooltipContent={'console right'}
					/> */}

          <TorusButton
            id={'testCode'}
            onPress={() => {
              setTestJson(customCode ? customCode : strarr);
            }}
            buttonClassName={`
	flex items-center justify-center h-[4vh] w-[1.9vw] rounded

	`}
            btncolor={selectedAccntColor}
            isIconOnly={true}
            size=""
            Children={
              <span className='h-[1.25vw] w-[2.31vw] rotate-[140deg]' > 

                <NavbarBackward
                  className={`h-[1.25vw] w-[2.31vw]`}
                  stroke={`${isLightColor(selectedAccntColor) === "light" ? "#000000" : "#ffffff" }`}
                />
              </span>
            }
          />

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
                      onClick={() => {
                        handleSave(
                          selectedActionName,
                          customCode ? customCode : strarr,
                          testjson,
                        );
                      }}
                      label={
                        <Save
                          className={`h-[1.16vw] w-[1.5vw]`}
                          stroke={`${isLightColor(selectedAccntColor) === "light" ? "#000000" : "#ffffff" }`}
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
                  buttonClassName={`
						${
              DocktoBottom
                ? 'flex   h-[4vh]  w-[1.9vw] items-center justify-center  bg-[#F14336] '
                : 'flex  justify-center  h-[4vh]  w-[1.9vw] items-center  bg-[#F14336] '
            }
					${DocktoBottom ? 'cursor-not-allowed' : 'cursor-pointer'}
					rounded `}
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
                  buttonClassName={`
						${
              DocktoBottom
                ? 'flex   h-[4vh]  w-[1.9vw] items-center justify-center  bg-[#4CAF50] '
                : 'flex  justify-center  h-[4vh]  w-[1.9vw] items-center  bg-[#4CAF50] '
            }
					${DocktoBottom ? 'cursor-not-allowed' : 'cursor-pointer'}
					rounded `}
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

      <div className=" h-[100%]  w-[100%] pl-[1.25vw] ">
        <div className="h-[90vh] w-[100%] p-0">
          <CodeiumEditor
            ref={monacoRef}
            value={customCode ? customCode : strarr}
            onChange={(value) => {
              onChange(value);
            }}
            language="javascript"
            height={Docktoleft ? '94%' : DocktoBottom ? '90%' : ''}
            beforeMount={beforeMount}
            theme="vs-dark"
            defaultValue={strarr ? strarr : customCode}
            className="bg-purple-500"
          />
        </div>
      </div>

      {/* <Editor
			ref={monacoRef}
			options={{ selectOnLineNumbers: true }}
			height="87vh"
			theme="vs-dark"
			language={"javascript"}
			value={value}
			onChange={(value) => {
				setValue(value);
				onChange(value);
			}}
			beforeMount={beforeMount}
			/> */}
    </div>
  );
};

export default CodeiumCodeEditor;

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