/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';

import { TorusModellerContext } from '../../../Layout';
import { LogicCenterContext } from '../../../VPT_DO/DO_Logic_Screen/LogicCenter';
import { label } from '../../../VPT_UF/VPT_UF_SLD/components/customNodes/CustomNode';
import { getDfdSchema, getDsSchema, getUfSchema } from '../../api/fabricsApi';
import Output from '../Monaco_Editor/components/Output';
import CodeiumCodeEditor from './Components/CodeiumCodeEditor';

const obj = {
  pre: {
    exception: {},
    request: {
      pre: 'pre',
      title: 'title1',
      description: 'description1',
      blog: 'This is a blog.',
      date: '11/4/2013',
      extra: {
        link: 'http://goo.cm',
      },
      list1: [
        {
          age: '56',
          name: 'mike',
          gender: 'M',
        },
      ],
      list2: [
        {
          item: 'thing',
        },
      ],
      clearMe: 'text',
    },
    response: {
      name: '',
      info: '',
      text: '',
      date: '',
      link: '',
      item: '',
      clearMe: '',
      fieldGroup: ['', ''],
    },
  },
  pro: {
    exception: {},
    request: {
      pro: 'pro',
      title: 'title1',
      description: 'description1',
      blog: 'This is a blog.',
      date: '11/4/2013',
      extra: {
        link: 'http://goo.cm',
      },
      list1: [
        {
          name: 'mike',
        },
      ],
      list2: [
        {
          item: 'thing',
        },
      ],
      clearMe: 'text',
    },
    response: {
      name: '',
      info: '',
      text: '',
      date: '',
      link: '',
      item: '',
      clearMe: '',
      fieldGroup: ['', ''],
    },
  },
  pst: {
    exception: {},
    request: {
      pst: 'pst',
      title: 'title1',
      description: 'description1',
      blog: 'This is a blog.',
      date: '11/4/2013',
      extra: {
        link: 'http://goo.cm',
      },
      list1: [
        {
          name: 'mike',
        },
      ],
      list2: [
        {
          item: 'thing',
        },
      ],
      clearMe: 'text',
    },
    response: {
      name: '',
      info: '',
      text: '',
      date: '',
      link: '',
      item: '',
      clearMe: '',
      fieldGroup: ['', ''],
    },
  },
  pre: {
    exception: {},
    request: {
      pre: 'pre',
      title: 'title1',
      description: 'description1',
      blog: 'This is a blog.',
      date: '11/4/2013',
      extra: {
        link: 'http://goo.cm',
      },
      list1: [
        {
          age: '56',
          name: 'mike',
          gender: 'M',
        },
      ],
      list2: [
        {
          item: 'thing',
        },
      ],
      clearMe: 'text',
    },
    response: {
      name: '',
      info: '',
      text: '',
      date: '',
      link: '',
      item: '',
      clearMe: '',
      fieldGroup: ['', ''],
    },
  },
  pro: {
    exception: {},
    request: {
      pro: 'pro',
      title: 'title1',
      description: 'description1',
      blog: 'This is a blog.',
      date: '11/4/2013',
      extra: {
        link: 'http://goo.cm',
      },
      list1: [
        {
          name: 'mike',
        },
      ],
      list2: [
        {
          item: 'thing',
        },
      ],
      clearMe: 'text',
    },
    response: {
      name: '',
      info: '',
      text: '',
      date: '',
      link: '',
      item: '',
      clearMe: '',
      fieldGroup: ['', ''],
    },
  },
  pst: {
    exception: {},
    request: {
      pst: 'pst',
      title: 'title1',
      description: 'description1',
      blog: 'This is a blog.',
      date: '11/4/2013',
      extra: {
        link: 'http://goo.cm',
      },
      list1: [
        {
          name: 'mike',
        },
      ],
      list2: [
        {
          item: 'thing',
        },
      ],
      clearMe: 'text',
    },
    response: {
      name: '',
      info: '',
      text: '',
      date: '',
      link: '',
      item: '',
      clearMe: '',
      fieldGroup: ['', ''],
    },
  },
};
function CodeiumEditors({
  initial,
  fabricsKey,
  setNavigateTo,
  selectedActionName,
  testinitial,
}) {
  const [json, setJson] = useState(initial);
  const [testjson, setTestJson] = useState(testinitial);
  const [myObj, setObj] = useState(obj);
  const [language, setLanguage] = useState('javascript');
  const [strarr, setStrarr] = useState(null);

  const [Docktoleft, setDocktoLeft] = useState(true);
  const [DocktoBottom, setDocktoBottom] = useState(false);

  const {
    mappedData,
    setMappedData,
    selectedLogic,
    selectedSubFlow,
    redisKey,
    currentDrawing,
  } = useContext(LogicCenterContext);

  const { selectedTheme } = useContext(TorusModellerContext);

  const handleGetAutoCompletion = async () => {
    const response = await getDsSchema(
      selectedLogic?.path + ':',
      selectedActionName[selectedActionName.length - 1],
    );
    console.log(response, 'strarrres');
    if (response && Array.isArray(response)) {
      const func = `function test(){
	let ${response.map((key) => `${key} = ${key}_val`).join(', ')};
	return {};
	}
	test();`;
      setStrarr(func);
    }
  };

  const handleGetAutoCompletionDF = async () => {
    const response = await getDfdSchema(
      selectedLogic?.path + ':',
      selectedActionName[selectedActionName.length - 1], 
    );
    console.log(response, 'strarrres');
    if (response && Array.isArray(response)) {
      const func = `function test(){
	let ${response.map((key) => `${key} = ${key}_val`).join(', ')};
	return {};
	}
	test();`;
      setStrarr(func);
    }
  };

  const handleGetAutoSuggestion = async () => {
    const response = await getUfSchema(redisKey);
    console.log(response, 'strarrres');
    if (response && typeof response === 'object') {
      setObj(response);
    }
  };

  useEffect(() => {
    if (currentDrawing === 'PF-PFD') handleGetAutoCompletion();
    else if (currentDrawing === 'UF-UFM' || currentDrawing === 'UF-UFW' || currentDrawing === 'UF-UFD')
      handleGetAutoSuggestion();
    else if (currentDrawing === 'DF-DFD') handleGetAutoCompletionDF();
  }, []);

  console.log(strarr, 'strarr');
  useEffect(() => {
    /**
     * Handles errors that occur during the execution of the function.
     *
     * @param {Error} e - The error object.
     * @return {void}
     */
    const errorHandler = (e) => {
      if (
        e.message.includes(
          'ResizeObserver loop completed with undelivered notifications' ||
            'ResizeObserver loop limit exceeded',
        )
      ) {
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay',
        );
        if (resizeObserverErr) {
          resizeObserverErr.style.display = 'none';
        }
      }
    };
    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  const handleSave = (actionName, value, test) => {
    console.log(test, 'codedatatest');
    setMappedData((prev) => {
      if (actionName && Array.isArray(actionName)) {
        if (actionName.length == 1) {
          return {
            ...prev,
            artifact: {
              ...prev?.artifact,
              code: value,
              testCode: test,
            },
          };
        }
        if (actionName.length == 2) {
          let returnData;

          returnData =
            Array.isArray(prev?.artifact?.node) &&
            prev?.artifact?.node?.map((item) => {
              if (item.nodeId === actionName[1]) {
                return {
                  ...item,
                  code: value,
                  testCode: test,
                };
              } else {
                return item;
              }
            });

          return {
            ...prev,
            artifact: {
              ...prev?.artifact,
              node: returnData,
            },
          };
        }
        if (actionName.length == 3) {
          let returnData;
          returnData =
            Array.isArray(prev?.artifact?.node) &&
            prev?.artifact?.node?.map((item) => {
              if (item.nodeId === actionName[1]) {
                return {
                  ...item,
                  objElements: item?.objElements?.map((obj) => {
                    if (obj?.elementId === actionName[2]) {
                      return {
                        ...obj,
                        code: value,
                        testCode: test,
                      };
                    }
                    return obj;
                  }),
                };
              } else {
                return item;
              }
            });

          return {
            ...prev,
            artifact: {
              ...prev?.artifact,
              name: selectedActionName[0],
              node: returnData,
            },
          };
        }
      } else return prev;
    });
  };

  console.log(mappedData, json, 'codedata');
  return (
    <div
      className={`${
        Docktoleft ? 'flex' : DocktoBottom ? 'flex flex-col' : ''
      } ${selectedSubFlow !== 'UO' || selectedSubFlow !== 'PO' ? 'h-[99.85%] w-[100%]  space-x-2' : ' h-[100%] w-[100%]  gap-2'} overflow-hidden rounded-lg`}
      style={{
        backgroundColor: `${selectedTheme?.bg}`,
        borderColor: `${selectedTheme?.borderLine}`,
      }}
    >
      <div className="h-[97%] w-[50%]">
        <CodeiumCodeEditor
          setNavigateTo={setNavigateTo}
          object={myObj}
          customCode={json}
          setTestJson={setTestJson}
          onChange={(val) => {
            setJson(val);
          }}
          Docktoleft={Docktoleft}
          setDocktoLeft={setDocktoLeft}
          DocktoBottom={DocktoBottom}
          setDocktoBottom={setDocktoBottom}
          selectedActionName={selectedActionName}
          handleSave={handleSave}
          testjson={testjson}
          strarr={strarr}
        />
      </div>
      <div className=" h-[97%] w-[50%]">
        <Output
          object={myObj}
          fabricsKey={fabricsKey}
          nodeName={label}
          code={testjson}
          language={language}
          DocktoBottom={DocktoBottom}
          Docktoleft={Docktoleft}
          selectedSubFlow={selectedSubFlow}
          testjson={testjson}
          setTestJson={setTestJson}
          strarr={strarr}
        />
      </div>
    </div>
  );
}

export default CodeiumEditors;
