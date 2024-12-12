import React, { useContext } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { useReactFlow } from 'reactflow';
import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  setToogleNodeInfo,
  setNodeInfoData,
  takeSnapshot,
  ...props
}) {
  const { getNode, setNodes, setEdges, getNodes, getEdges } = useReactFlow();
  const { darkMode } = useContext(DarkmodeContext);

  /**
   * Deletes a node and its associated edges from the graph.
   *
   * @return {void} This function does not return anything.
   */
  const deleteNode = () => {
    try {
      const getChildIds = (parentId, nodes) => {
        const childIds = [];
        const stack = [parentId];
        while (stack.length > 0) {
          const currentNodeId = stack.pop();
          const currentNode = nodes.find((node) => node.id === currentNodeId);
          if (currentNode) {
            childIds.push(currentNodeId);
            if (currentNode.data.children) {
              stack.push(...currentNode.data.children);
            }
          }
        }
        return childIds;
      };
      const nodeToDelete = getNodes().find((node) => node.id === id);
      if (!nodeToDelete) {
        return;
      }
      const childIds = getChildIds(id, getNodes());
      const updatedNodes = getNodes().filter(
        (node) => !childIds.includes(node.id),
      );
      if (
        updatedNodes &&
        Array.isArray(updatedNodes) &&
        updatedNodes.length > 0
      ) {
        const rmvChildFrmPrnt = updatedNodes.map((node) => {
          if (node.data.children && node.data.children.includes(id)) {
            return {
              ...node,
              data: {
                ...node.data,
                children: node.data.children.filter(
                  (childId) => childId !== id,
                ),
              },
            };
          }
          return node;
        });
        setNodes(rmvChildFrmPrnt);
      } else {
        setNodes([]);
      }
      const updatedEdges = getEdges().filter(
        (edge) =>
          !childIds.includes(edge.source) && !childIds.includes(edge.target),
      );
      setEdges(updatedEdges);
      takeSnapshot();
    } catch (error) {
      toast.error('Error while deleting', { autoClose: 1500 });
    }
  };

  /**
   * Renders a context menu component.
   *
   * @return {JSX.Element} The context menu component.
   */
  return (
    <div
      style={{ top, left, right, bottom }}
      className={
        `${darkMode ? 'bg-[#363636]  ' : 'bg-white   '}` +
        `${
          getNode(id).data.label
            ? 'absolute z-10 flex h-[145px] w-[170px] flex-col  items-center justify-center rounded-md '
            : 'absolute z-10 flex h-[130px] w-[170px] flex-col items-center  justify-center  rounded-md '
        }`
      }
      {...props}
    >
      <div
        className={`w-full ${
          getNode(id).data.label
            ? 'mt-1 flex items-center justify-center border-b-2  border-gray-400/40  '
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
          {getNode(id).data.label}
        </span>
      </div>
      <div className={`${darkMode ? ' w-full p-2' : ' w-full p-2 '}`}>
        <div
          className={
            darkMode
              ? 'flex w-full cursor-pointer flex-row gap-[20px]  whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
              : 'flex cursor-pointer flex-row gap-[20px] whitespace-nowrap  rounded-lg p-[10px] hover:bg-gray-300/50 '
          }
          onClick={() => {
            setNodeInfoData(getNode(id));
            setToogleNodeInfo(true);
          }}
        >
          <span>
            <BiEdit size={20} color={darkMode ? '#fff' : '#8C8C8C'} />
          </span>

          <button>
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
              ? 'flex w-full cursor-pointer flex-row gap-[20px]  whitespace-nowrap rounded-lg p-[10px] hover:bg-slate-500/40 '
              : 'flex cursor-pointer flex-row gap-[20px] whitespace-nowrap  rounded-lg p-[10px] hover:bg-gray-300/50 '
          }
          onClick={deleteNode}
        >
          <span>
            <AiOutlineDelete color={darkMode ? '#fff' : '#8C8C8C'} size={20} />
          </span>
          <button>
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
  );
}
