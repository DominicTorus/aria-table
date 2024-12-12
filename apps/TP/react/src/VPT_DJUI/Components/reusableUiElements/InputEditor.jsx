import { Tooltip } from '@nextui-org/react';
import { memo, useContext, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { SvgDeletingIcon } from '../../../asset/SvgsApplication';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import useOnClickOutsideRef from '../../../commonComponents/customhooks/outsidecall';
import ReusableInput from '../../../commonComponents/reusableComponents/ReusableInput';
import { BuilderContext } from '../../builder';
import { RenderTooltip } from '../utils/RenderTooltip';
import { handlepath } from '../utils/utils';

export const InputEditor = memo(({ keys, nodes, path, keyJson }) => {
  const [newKey, setNewKey] = useState(null);
  const [toogleKey, setTooglekey] = useState(true);
  const [toogleValue, setTooglevalue] = useState(true);

  const [show, setShow] = useState(false);

  const modalRef = useOnClickOutsideRef(() => setShow(false));

  const { darkMode } = useContext(DarkmodeContext);
  const { functionality, editedValues, setEditedValues } =
    useContext(BuilderContext);

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

  const handleDoubleClick = (ele, clear = true) => {
    try {
      if (ele === 'key' && newKey && clear) {
        functionality('edit', path, newKey);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      key={nodes[keys] + keys + path}
      style={{
        height: '100%',

        paddingBottom: '5px',

        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isNaN(Number(keys)) && (
        <div className="h-[50%]">
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
            className=" rounded-md p-[5px]"
            style={{
              display: show ? 'flex ' : 'none',

              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            ref={modalRef}
          >
            <ReusableInput
              key={keys + path}
              isClearable={false}
              defaultValue={keys}
              handleChange={(e) => setNewKey(e.target.value)}
              type={
                typeof keys === 'string'
                  ? 'text'
                  : typeof keys === 'number'
                    ? 'number'
                    : 'text'
              }
              variant="underlined"
              endContent={
                <div className="ml-1 flex w-5 items-center justify-center">
                  <button
                    className={` ${darkMode ? 'bg-[#656666]' : 'bg-[#D9DEE8]'} rounded-full   p-[5px] hover:bg-blue-700/40 hover:text-white`}
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
                    className={`${darkMode ? 'bg-[#656666]' : 'bg-[#D9DEE8]'} ml-2 rounded-full p-[5px]  hover:bg-pink-700/40 hover:text-white`}
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
            />
          </div>
        </div>
      )}

      <div className="flex h-[100%] justify-between gap-1 pt-1 ">
        <ReusableInput
          key={path + 'Treevalue'}
          darkMode={darkMode}
          defaultValue={nodes[keys]}
          value={editedValues[path]}
          handleChange={(e) => {
            setEditedValues((prev) => {
              return { ...prev, [path]: e.target.value };
            });
          }}
          type={
            typeof nodes[keys] === 'string'
              ? 'text'
              : typeof nodes[keys] === 'number'
                ? 'number'
                : 'text'
          }
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
});
