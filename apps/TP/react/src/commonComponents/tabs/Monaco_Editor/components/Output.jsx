import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { DarkmodeContext } from '../../../context/DarkmodeContext';
import { executeCode } from '../utils/api';
import { TorusModellerContext } from '../../../../Layout';
import { CodeiumEditor } from '@codeium/react-code-editor';
import _ from 'lodash';
import { isLightColor } from '../../../../asset/themes/useTheme';
import TorusButton from '../../../../torusComponents/TorusButton';

const Output = ({
  fabricsKey,
  nodeName,
  code,
  DocktoBottom,
  Docktoleft,
  selectedSubFlow,
  testjson,
  setTestJson,
  strarr,
  object,
}) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);
  const { darkMode } = useContext(DarkmodeContext);
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);
  const monacoRef = useRef();

  const runCode = async () => {
    const sourceCode = code;
    if (!sourceCode) {
      setOutput(null);
      return;
    }
    try {
      setIsLoading(true);
      const data = await executeCode(fabricsKey, nodeName, sourceCode);
      console.log(data, 'datacode');
      setOutput(data.data.run.output.split('\n'));
      data.data.run.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const hideSpecificLinks = () => {
    const links = document.querySelector(
      'a[target="_blank"][rel="noreferrer noopener"]',
    );
    if (links) {
      links.style.display = 'none';
    }
  };

  useEffect(() => {
    hideSpecificLinks();
  }, []);

  useEffect(() => {
    const codiumEditorBoard = document.querySelector(
      '.torusCodeEditor_main section',
    );

    if (codiumEditorBoard) {
      codiumEditorBoard.style.height = '42vh';
    }
  }, []);

  return (
    <div
      className={`rounded-md  p-2  
        ${
          (selectedSubFlow !== 'UO' || selectedSubFlow !== 'PO') && Docktoleft
            ? 'mt-2 h-[100%] w-[98%]'
            : (selectedSubFlow !== 'UO' || selectedSubFlow !== 'PO') &&
                DocktoBottom
              ? 'mt-2 h-[97%] w-[99%]'
              : 'h-[100%] w-full'
        }`}
      style={{
        backgroundColor: `${selectedTheme?.bg}`,
        border: `1px solid ${selectedTheme?.border}`,
      }}
    >
      <div className="h-[50%]">
        {console.log(testjson, 'testjson')}
        <CodeiumEditor
          ref={monacoRef}
          value={testjson}
          onChange={(value) => {
            setTestJson(value);
          }}
          language="javascript"
          // height={Docktoleft ? '94%' : DocktoBottom ? '90%' : ''}
          beforeMount={beforeMount}
          theme="vs-dark"
          defaultValue={testjson}
          className="h-[42vh] bg-purple-500"
          containerClassName="torusCodeEditor_main"
          containerStyle={{
            backgroundColor: `${selectedTheme?.bg}`,
            // border: `1px solid ${selectedTheme?.border}`,
            height: '50%',
          }}
        />
      </div>

      <div className="my-2 h-[50%]">
        <div className={`flex justify-between gap-2`}>
          <p
            className="m-2 text-[0.72vw] font-bold  "
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            Output
          </p>

          <TorusButton
            btncolor={`${selectedAccntColor}`}
            onPress={async () => await runCode()}
            isIconOnly={true}
            buttonClassName={`text-black w-[2vw]  h-[2vw]   rounded-md flex justify-center items-center`}
            Children={
              <div>
                <FaPlay
                  size={'1vw'}
                  color={`${isLightColor(selectedAccntColor) === 'light' ? 'black' : 'white'}`}
                />
              </div>
            }
          />
        </div>
        <div
          className={`h-[35vh] w-full overflow-y-scroll rounded-md border-1    p-2 scrollbar-default 
        ${isError && 'rounded-sm border-1 border-solid border-red-500 text-red-400'}`}
          style={{
            border: `1px solid ${selectedTheme?.border}`,
          }}
        >
          {isLoading ? (
            <ProgressSpinner style={{ width: '40px', height: '15px' }} />
          ) : output ? (
            output.map((line, i) => (
              <p
                key={i}
                className="text-[0.72vw]"
                style={{
                  color: `${selectedTheme?.text}`,
                }}
              >
                {line}
              </p>
            ))
          ) : (
            <span
              className="text-[0.72vw]"
              style={{
                color: `${selectedTheme?.text}70`,
              }}
            >
              'Click "Run Code" to see the output here'
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Output;
