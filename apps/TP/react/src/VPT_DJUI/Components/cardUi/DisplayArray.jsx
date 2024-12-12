/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react';

import { FaRegCheckCircle } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import { InputEditor } from '../reusableUiElements/InputEditor';
import { PopupAddElements } from '../reusableUiElements/PopupAddElements';
import { TextAreaEditor } from '../reusableUiElements/TextAreaEditor';
import UiDecider from '../UiDecider';

import { Tooltip } from '@nextui-org/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { RiAddBoxLine } from 'react-icons/ri';
import { TbBrackets } from 'react-icons/tb';
import { SvgDeleteIcon } from '../../../asset/SvgsApplication';
import ReusableInput from '../../../commonComponents/reusableComponents/ReusableInput';
import { BuilderContext } from '../../builder';
import { RenderTooltip } from '../utils/RenderTooltip';
import { handlepath } from '../utils/utils';
export default function DisplayArray({
  keyJson,
  data,

  title,
  path,

  totalOptions,
  depth,
  isAdmin,
  totalColors,

  uiPolicy,
  level,
  children,
  types,
}) {
  const [func, setFunc] = useState(null);
  const [currentJson, setCurrentJson] = useState([]);
  const [options, setOptions] = useState([]);

  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState(null);
  const iRef = useRef(null);
  const { darkMode } = useContext(DarkmodeContext);
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const { functionality } = useContext(BuilderContext);

  const handlekey = (e) => {
    try {
      setValue(e.target.value);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      setOptions(totalOptions[depth]?.options);
      setCurrentJson(data);
    } catch (error) {
      console.error(error);
    }
  }, [data, totalOptions, depth, totalColors]);
  return (
    <>
      {totalOptions && totalOptions.length > depth && (
        <div
          className="list-array-obj "
          key={path + 'arr'}
          style={{ backgroundColor: darkMode ? '#494949' : 'white' }}
        >
          <div
            className="array-title"
            style={{ backgroundColor: darkMode ? '#494949' : 'white' }}
            onMouseEnter={() => {
              setShow(true);
            }}
            onMouseLeave={() => {
              setShow(false);
            }}
          >
            <div
              className="array-titles flex"
              style={{ backgroundColor: darkMode ? '#494949' : 'white' }}
            >
              {selected ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '20px',
                  }}
                >
                  <div>
                    <ReusableInput
                      type="text"
                      darkMode={darkMode}
                      defaultValue={title}
                      handleChange={(e) => {
                        handlekey(e.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignContent: 'center',
                    }}
                  >
                    <div
                      onClick={(e) => {
                        functionality('edit', path, value);
                        setSelected(null);
                      }}
                    >
                      <FaRegCheckCircle
                        style={{ width: '20px', height: '21px' }}
                      />
                    </div>

                    <div
                      onClick={(e) => {
                        setSelected(null);
                      }}
                    >
                      <ImCancelCircle
                        style={{ width: '19px', height: '22px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <span>
                    <div
                      class="circle"
                      style={{
                        backgroundColor: ` ${totalColors[depth]?.color}`,
                      }}
                    >
                      <span class="text">{totalOptions[depth]?.L}</span>
                    </div>
                  </span>
                  <span className={darkMode ? 'text-white' : 'text-gray-950'}>
                    {title} :
                  </span>
                  {keyJson && keyJson.hasOwnProperty(handlepath(path)) && (
                    <Tooltip
                      content={
                        <RenderTooltip tooltip={keyJson[handlepath(path)]} />
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          <AiOutlineInfoCircle
                            color={darkMode ? 'white' : 'black'}
                          />
                        </span>
                      </div>
                    </Tooltip>
                  )}
                  <TbBrackets color={darkMode ? 'white' : 'black'} />
                  <div>{children}</div>
                </span>
              )}

              <div
                className={`opacity-${show ? '100' : '0'}  flex bg-${
                  darkMode ? 'slate-500' : 'white'
                } gap-2 rounded-md p-1 transition-all duration-500 ease-in-out hover:bg-${
                  darkMode ? 'slate-400 ' : 'gray-300'
                }`}
              >
                <span
                  title="Add"
                  className="icon-button"
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    setFunc('add');
                    setVisible(true);
                    e.preventDefault();
                  }}
                >
                  <RiAddBoxLine color="black" size={16} opacity={0.5} />
                </span>

                <span
                  title="Delete"
                  style={{
                    cursor: 'pointer',
                  }}
                  htmlFor=""
                  onClick={() => functionality('delete', path)}
                >
                  <SvgDeleteIcon />
                </span>
              </div>
            </div>
          </div>

          {func && func == 'add' && currentJson && (
            <PopupAddElements
              visible={visible}
              setVisble={setVisible}
              type={'array'}
              functionality={functionality}
              setFunc={setFunc}
              json={currentJson}
              path={path}
              options={options}
              arrIndex={currentJson.length}
            />
          )}

          <div className="object-list">
            {currentJson &&
              currentJson.length > 0 &&
              currentJson.map((Element, index) => {
                if (typeof Element === 'object') {
                  return (
                    <div
                      style={{
                        flexGrow: 1,
                        width: `${Math.round(100 / currentJson.length) + 95}%`,
                      }}
                    >
                      <UiDecider
                        key={index}
                        keyJson={keyJson}
                        title={index}
                        uiPolicy={uiPolicy}
                        json={Element}
                        isAdmin={isAdmin}
                        depth={depth + 1}
                        functionality={functionality}
                        totalOptions={totalOptions}
                        totalColors={totalColors}
                        level={level}
                        path={path + '.' + index}
                        type={types}
                      />
                    </div>
                  );
                }

                return (
                  <div className="h-full w-full">
                    {types !== '' ? (
                      <TextAreaEditor
                        keyJson={keyJson}
                        functionality={functionality}
                        isAdmin={isAdmin}
                        keys={index}
                        nodes={currentJson}
                        key={path + '.' + index}
                        path={path + '.' + index}
                      />
                    ) : (
                      <InputEditor
                        keyJson={keyJson}
                        functionality={functionality}
                        isAdmin={isAdmin}
                        keys={index}
                        nodes={currentJson}
                        key={path + '.' + index}
                        path={path + '.' + index}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
