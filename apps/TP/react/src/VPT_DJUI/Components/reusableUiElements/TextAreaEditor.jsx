import { memo, useContext, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { SvgDeletingIcon } from '../../../asset/SvgsApplication';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import useOnClickOutsideRef from '../../../commonComponents/customhooks/outsidecall';
import { BuilderContext } from '../../builder';
import { handlepath } from '../utils/utils';

import { Textarea, Tooltip } from '@nextui-org/react';
import { FaCheck } from 'react-icons/fa6';
import { RenderTooltip } from '../utils/RenderTooltip';

export const TextAreaEditor = memo(
  ({ keys, nodes, totalColors, path, dp, keyJson }) => {
    const [newKey, setNewKey] = useState(null);
    const [toogleKey, setTooglekey] = useState(true);
    const [toogleValue, setTooglevalue] = useState(true);
    const [newValue, setNewValue] = useState(null);
    const [show, setShow] = useState(false);
    const { functionality } = useContext(BuilderContext);

    const modalRef = useOnClickOutsideRef(() => setShow(false));

    const { darkMode } = useContext(DarkmodeContext);

    const ToggleFlip = (ele) => {
      try {
        if (ele === 'key') {
          setTooglekey(!toogleKey);
        }
        if (ele === 'value') {
          setTooglevalue(!toogleValue);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleDoubleClick = (ele) => {
      try {
        if (ele === 'key' && newKey) {
          functionality('edit', path, newKey);
        }
        if (ele === 'value' && newValue) {
          functionality('update', path, {
            key: keys,
            value: newValue,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div
        style={{
          height: '100%',

          paddingBottom: '5px',

          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="h-[100%]">
          <div className="flex items-center gap-[1px]">
            <b
              style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '12px',
                display: show ? 'none ' : 'block',
                userSelect: 'none',
                cursor: 'text',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                ToggleFlip('key');
                setShow(true);
              }}
            >
              {isNaN(Number(keys)) ? keys + ':' : <li />}
            </b>
            {keyJson && keyJson.hasOwnProperty(handlepath(path)) && (
              <Tooltip
                content={<RenderTooltip tooltip={keyJson[handlepath(path)]} />}
              >
                <div className="flex items-center gap-2">
                  <span>
                    <AiOutlineInfoCircle color={darkMode ? '#fff' : '#000'} />
                  </span>
                </div>
              </Tooltip>
            )}
          </div>

          <div
            className=" rounded-md p-[5px] "
            style={{
              display: show ? 'flex ' : 'none',
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            ref={modalRef}
          >
            <Textarea
              onChange={(e) => setNewKey(e.target.value)}
              endContent={
                <div className="flex w-5  items-end justify-end gap-1">
                  <button
                    className={` ${darkMode ? 'bg-[#656666]' : 'bg-[#D9DEE8]'} rounded-full  p-[5px] hover:bg-blue-700/40 hover:text-white`}
                    onClick={() => {
                      ToggleFlip('key');
                      handleDoubleClick('key');
                    }}
                  >
                    <FaCheck
                      className="text-[50%]"
                      color={darkMode ? 'white' : 'black'}
                    />
                  </button>

                  <button
                    className={`${darkMode ? 'bg-[#656666]' : 'bg-[#D9DEE8]'} rounded-full p-[5px]   hover:bg-pink-700/40 hover:text-white`}
                    onClick={() => {
                      ToggleFlip('key');
                      handleDoubleClick('key', false);
                    }}
                  >
                    <IoMdClose
                      className="text-[50%]"
                      color={darkMode ? 'white' : 'black'}
                    />
                  </button>
                </div>
              }
              type="text"
              defaultValue={keys}
              isClearable
              radius="lg"
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
              }}
              className="second-text-area text-white shadow-md"
              classNames={{
                base: ' w-full ',
                label: 'text-sm font-bold text-zinc-700',
                mainWrapper: 'h-full text-slate-700 ',
                input: darkMode
                  ? [
                      'bg-transparent',
                      'text-white',
                      'placeholder:text-white',
                      'text-sm',
                      'font-bold',
                    ]
                  : [
                      'bg-transparent',
                      'text-black',
                      'placeholder:text-black',
                      'text-sm',
                      'font-bold',
                    ],
                inputWrapper: darkMode
                  ? [
                      'h-[10px]',
                      'rounded-md bg-transparent border border-slate-500/50',
                      'text-white',
                      'data-[hover=true]:border-blue-500',
                      'data-[focus-visible=true]:ring-pink-900',
                    ]
                  : [
                      'h-[10px]',
                      'rounded-md bg-transparent border border-slate-500/50',
                      'text-black',
                      'bg-gray-300',
                      'data-[hover=true]:border-blue-500',
                      'data-[focus-visible=true]:ring-pink-900',
                    ],
              }}
            />
          </div>
        </div>

        <div className="flex h-[100%] justify-between pl-2 pt-1">
          <Textarea
            onChange={(e) => setNewValue(e.target.value)}
            pattern="[a-zA-Z0-9]*"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                ToggleFlip('value');
                handleDoubleClick('value');
              }
            }}
            minRows={2}
            type="text"
            defaultValue={nodes[keys]}
            isClearable
            radius="lg"
            style={{
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
            }}
            classNames={{
              base: ' w-full ',
              label: 'text-sm font-bold text-zinc-700',
              mainWrapper: 'h-full text-slate-700 ',
              input: darkMode
                ? [
                    'bg-transparent',
                    'text-white',
                    'placeholder:text-white',
                    'text-sm',
                    'font-bold',
                  ]
                : [
                    'bg-transparent',
                    'text-black',
                    'placeholder:text-black',
                    'text-sm',
                    'font-bold',
                  ],
              inputWrapper: darkMode
                ? [
                    'h-[10px]',
                    'rounded-md bg-transparent border border-slate-500/50',
                    'text-white',
                    'data-[hover=true]:border-blue-500',
                    'data-[focus-visible=true]:ring-pink-900',
                  ]
                : [
                    'h-[10px]',
                    'rounded-md bg-transparent border border-slate-500/50',
                    'text-black',
                    'bg-gray-300',
                    'data-[hover=true]:border-blue-500',
                    'data-[focus-visible=true]:ring-pink-900',
                  ],
            }}
          />

          <span
            title="Delete"
            style={{
              display: 'flex',
              alignContent: 'center',

              cursor: 'pointer',
            }}
            htmlFor=""
            onClick={() => functionality('delete', path)}
          >
            <SvgDeletingIcon />
          </span>
        </div>
      </div>
    );
  },
);
