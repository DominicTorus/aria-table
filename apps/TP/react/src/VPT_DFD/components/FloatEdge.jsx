import { useCallback } from 'react';
import { getSmoothStepPath, useStore } from 'reactflow';
import { getEdgeParams } from '../utils/utils';

/**
 * Renders a floating edge between two nodes in a ReactFlow graph.
 *
 * @param {Object} props - The properties for the FloatingEdge component.
 * @param {string} props.id - The ID of the edge.
 * @param {string} props.source - The ID of the source node.
 * @param {string} props.target - The ID of the target node.
 * @param {string} props.markerEnd - The marker end for the edge.
 * @param {Object} props.style - The style for the edge.
 * @return {JSX.Element|null} The rendered edge path, or null if the source or target node is not found.
 */
function FloatingEdge({ id, source, target, markerEnd, style }) {
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

export default FloatingEdge;
