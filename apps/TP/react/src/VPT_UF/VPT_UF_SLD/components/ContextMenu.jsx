import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';
import { FaRegObjectUngroup } from 'react-icons/fa';
import { GrDetach } from 'react-icons/gr';
import { useReactFlow, useStore, useStoreApi } from 'reactflow';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import useDetachNodes from '../../../commonComponents/react-flow-pro/dynamicGrouping/useDetachNodes';
import { getRelativeNodesBounds } from '../../../commonComponents/react-flow-pro/dynamicGrouping/utils';
export const ContextMenu = ({
  id,
  top,
  left,
  right,
  bottom,
  setToogle,
  sideT,
  setMenu,
  setSelectedNodeid,
}) => {
  const { getNode } = useReactFlow();
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();

  /**
   * Ungroups a node by detaching its child nodes from the store.
   *
   * @return {void} This function does not return anything.
   */
  const onunGroup = () => {
    const childNodeIds = Array.from(store.getState().nodeInternals.values())
      .filter((n) => n.parentNode === id)
      .map((n) => n.id);
    detachNodes(childNodeIds, id);
  };
  const store = useStoreApi();
  const { hasChildNodes } = useStore((store) => {
    const childNodes = Array.from(store.nodeInternals.values()).filter(
      (n) => n.parentNode === id,
    );
    const rect = getRelativeNodesBounds(childNodes);
    return {
      minWidth: rect.x + rect.width,
      minHeight: rect.y + rect.height,
      hasChildNodes: childNodes.length > 0,
    };
  }, isEqual);

  /**
   * A function that checks if the properties of two objects are equal.
   *
   * @param {object} prev - The previous object to compare.
   * @param {object} next - The next object to compare.
   * @return {boolean} Returns true if the properties are equal, false otherwise.
   */
  function isEqual(prev, next) {
    return (
      prev.minWidth === next.minWidth &&
      prev.minHeight === next.minHeight &&
      prev.hasChildNodes === next.hasChildNodes
    );
  }
  const node = getNode(id);
  const hasParent = useStore(
    (store) => !!store.nodeInternals.get(id)?.parentNode,
  );
  const onDetach = () => detachNodes([id]);
  const { darkMode } = React.useContext(DarkmodeContext);

  return (
    <div
      style={{ top, left, right, bottom }}
      className={
        `${darkMode ? 'bg-[#363636]  ' : 'bg-white   '}` +
        `${
          hasChildNodes || hasParent
            ? 'absolute z-10 flex h-[180px] w-[170px] flex-col  items-center justify-center rounded-md '
            : 'absolute z-10 flex h-[130px] w-[170px] flex-col items-center  justify-center  rounded-md '
        }`
      }
    >
      <div
        className={`w-full ${
          node?.type
            ? 'flex items-center  justify-center border-b-2  border-gray-400/40  '
            : '   hidden'
        }`}
      >
        <p
          className={
            darkMode
              ? 'mb-2 mt-2 text-start font-semibold capitalize text-white'
              : 'mb-2 mt-2 text-start font-semibold capitalize text-black/75'
          }
        >
          {node?.type}
        </p>
      </div>

      {/* contextmenu-menu */}
      <div className={`${darkMode ? ' w-full p-2' : ' w-full p-2 '}`}>
        <div
          className={
            darkMode
              ? 'flex w-full flex-row gap-[18px]   whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
              : 'flex flex-row gap-[18px]  whitespace-nowrap  rounded-lg p-[10px] hover:bg-gray-300/50 '
          }
        >
          <span>
            <BiEdit size={20} color={darkMode ? '#fff' : '#8C8C8C'} />
          </span>
          <button
            onClick={() => {
              sideT();
              setToogle(node, id);
              setMenu(null);
              setSelectedNodeid(id);
            }}
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

        {node.type === 'group' && hasChildNodes && (
          <div
            className={
              darkMode
                ? 'flex w-full flex-row gap-[18px]   whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
                : 'flex flex-row gap-[18px]  whitespace-nowrap  rounded-lg p-[10px] hover:bg-gray-300/50 '
            }
          >
            <span>
              <FaRegObjectUngroup
                size={20}
                color={darkMode ? '#fff' : '#8C8C8C'}
              />
            </span>
            <button
              onClick={() => {
                onunGroup();

                setMenu(null);
              }}
            >
              <span
                className={`text-base ${
                  darkMode ? 'text-white' : 'text-black/80'
                } ml-2`}
              >
                Ungroup
              </span>
            </button>
          </div>
        )}
        {node.type !== 'group' && hasParent && (
          <div
            className={
              darkMode
                ? 'flex w-full flex-row gap-[18px]   whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
                : 'flex flex-row gap-[18px]  whitespace-nowrap  rounded-lg p-[10px] hover:bg-gray-300/50 '
            }
          >
            <span>
              <GrDetach size={20} color={darkMode ? '#fff' : '#8C8C8C'} />
            </span>
            <button
              onClick={() => {
                onDetach();

                setMenu(null);
              }}
            >
              <span
                className={`text-base ${
                  darkMode ? 'text-white' : 'text-black/80'
                } ml-2`}
              >
                Detach
              </span>
            </button>
          </div>
        )}
        <div
          className={
            darkMode
              ? 'flex flex-row  gap-[20px]  whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
              : 'flex flex-row gap-[20px]  whitespace-nowrap rounded-lg p-[10px] hover:bg-gray-300/50 '
          }
        >
          <button
            onClick={() => {
              // deleteNode(id, node);
              deleteElements({ nodes: [{ id }] });
              setMenu(null);
            }}
            className="flex "
          >
            <span>
              <AiOutlineDelete
                color={darkMode ? '#fff' : '#8C8C8C'}
                size={20}
              />
            </span>
            <span
              className={`ml-[26px] text-base  ${
                darkMode ? 'text-white' : 'text-black/80'
              }`}
            >
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
