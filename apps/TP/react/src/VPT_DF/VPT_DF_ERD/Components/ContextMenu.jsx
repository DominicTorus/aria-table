import React, { useContext, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';
import { useReactFlow } from 'reactflow';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import Deletepop from './Deletepop';

export default function ContextMenu({
  deleteNode,
  setMenu,
  setToogle,
  id,
  top,
  left,
  right,
  bottom,
  onEditAttribute,
  updatedNodeConfig,
  isAdmin,
  nodeConfig,
  controlPolicyApi,
  showerror,
  showsuccess,
  sideT,
  funcNodedata,
  ...props
}) {
  const { getNode } = useReactFlow();
  const node = getNode(id);
  const { darkMode } = useContext(DarkmodeContext);
  const [deletepop, setDeletepop] = useState(false);

  //Returns the context menu for the node which gives a popup when a right click event is done on the node.
  //Which gives a Edit node and Delete node option.
  //Also sending the Deletepop's reuqirement to delete the node.
  return (
    <>
      <div
        style={{ top, left, right, bottom }}
        className={
          `${darkMode ? 'bg-[#363636]  ' : 'bg-white   '}` +
          `${
            node.data.label
              ? 'absolute z-10 flex h-[145px] w-[170px] flex-col  items-center justify-center rounded-md '
              : 'absolute z-10 flex h-[130px] w-[170px] flex-col items-center  justify-center  rounded-md '
          }`
        }
      >
        <div
          className={`w-full ${
            node?.data.label
              ? 'mt-1 flex items-center  justify-center border-b-2  border-gray-400/40  '
              : '   hidden'
          }`}
        >
          <span
            className={
              darkMode
                ? 'mb-2 text-start font-semibold capitalize  text-white'
                : 'mb-2 text-start font-semibold capitalize  text-black/75'
            }
          >
            {node?.data.label}
          </span>
        </div>

        <div className={`${darkMode ? ' w-full p-2' : ' w-full p-2 '}`}>
          <div
            className={
              darkMode
                ? 'flex w-full flex-row gap-[20px]   whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
                : 'flex flex-row gap-[20px]  whitespace-nowrap  rounded-lg p-[10px] hover:bg-gray-300/50 '
            }
            style={{
              cursor: !isAdmin.canEdit ? 'not-allowed' : 'pointer',
            }}
          >
            <span>
              <BiEdit size={20} color={darkMode ? '#fff' : '#8C8C8C'} />
            </span>
            <button
              onClick={() => {
                if (isAdmin.canEdit) {
                  funcNodedata(node);
                  setMenu(null);
                }
              }}
              disabled={!isAdmin.canEdit}
              className={`cursor-${
                isAdmin.canEdit
                  ? 'text-base text-gray-500 hover:text-black'
                  : 'not-allowed'
              } `}
            >
              <span
                className={`text-base ${
                  darkMode ? 'text-white' : 'text-black/80'
                } ml-2`}
              >
                Edit Node
              </span>
            </button>
          </div>
          <div
            className={
              darkMode
                ? 'flex flex-row  gap-[20px]  whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
                : 'flex flex-row gap-[20px]  whitespace-nowrap rounded-lg p-[10px] hover:bg-gray-300/50 '
            }
            style={{
              cursor: !isAdmin.canEdit ? 'not-allowed' : 'pointer',
            }}
          >
            <span>
              <AiOutlineDelete
                color={darkMode ? '#fff' : '#8C8C8C'}
                size={20}
              />
            </span>
            <button
              onClick={() => {
                if (isAdmin.canDelete) setDeletepop(true);
              }}
              disabled={!isAdmin.canDelete}
              className={`cursor-${
                isAdmin.canEdit
                  ? 'text-base text-gray-500 hover:text-black'
                  : 'not-allowed'
              }`}
            >
              <span
                className={`ml-[12px] text-base  ${
                  darkMode ? 'text-white' : 'text-black/80'
                }`}
              >
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
      <Deletepop
        type="Er"
        id={node.id}
        node={node}
        deletepop={deletepop}
        setDeletepop={setDeletepop}
        deleteNode={deleteNode}
      />
    </>
  );
}
