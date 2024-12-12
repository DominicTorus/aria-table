import { useCallback } from 'react';
import { getSmoothStepPath, useStore } from 'reactflow';

import { getEdgeParams } from '../utils/util';

/**
 * Renders a custom edge between two nodes in a React Flow diagram.
 *
 * @param {Object} props - The properties for the custom edge.
 * @param {string} props.id - The unique identifier for the custom edge.
 * @param {string} props.source - The identifier of the source node.
 * @param {string} props.target - The identifier of the target node.
 * @param {string} props.markerEnd - The marker to be displayed at the end of the custom edge.
 * @param {Object} props.style - The style object for the custom edge.
 * @return {JSX.Element|null} The custom edge path element or null if either source or target node is missing.
 */
function CustomEdge({ id, source, target, markerEnd, style }) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}

export default CustomEdge;
