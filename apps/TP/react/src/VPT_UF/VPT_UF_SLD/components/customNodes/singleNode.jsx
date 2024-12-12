import { memo } from 'react';
import {
  Handle,
  NodeToolbar,
  Position,
  useReactFlow,
  useStore,
} from 'reactflow';
import useDetachNodes from '../../../../commonComponents/react-flow-pro/dynamicGrouping/useDetachNodes';

/**
 * Renders a single node component with delete and detach functionality.
 *
 * @param {Object} id - The id of the node
 * @param {Object} data - The data object containing label information
 * @return {JSX.Element} The rendered single node component
 */
function SingleNode({ id, data }) {
  const hasParent = useStore(
    (store) => !!store.nodeInternals.get(id)?.parentNode,
  );
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();
  const onDelete = () => deleteElements({ nodes: [{ id }] });
  const onDetach = () => detachNodes([id]);
  return (
    <div className="min-h-20 min-w-20 border-1 border-slate-700">
      <NodeToolbar className="nodrag">
        <button onClick={onDelete}>Delete</button>
        {hasParent && <button onClick={onDetach}>Detach</button>}
      </NodeToolbar>
      <Handle type="target" position={Position.Left} />
      <div className="icon">△</div>
      <div className="label">{data?.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(SingleNode);
