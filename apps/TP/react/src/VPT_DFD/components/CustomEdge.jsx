import React, { useContext, useState } from 'react';
import { Input } from 'react-aria-components';
import { GrClose } from 'react-icons/gr';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/base.css';
import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';
import TorusButton from '../../torusComponents/TorusButton';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  label,
  style,
}) {
  const { darkMode } = useContext(DarkmodeContext);
  const [toogle, setToogle] = useState(false);
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  /**
   * Updates the label of the edge with the given id to the value of the target input element.
   *
   * @param {Event} e - The click event that triggered the function.
   * @return {void} This function does not return anything.
   */
  const onEdgeClick = (e) => {
    setEdges((edges) => {
      return edges.map((edge) => {
        if (edge.id === id) {
          return (edge = {
            ...edge,
            label: e.target.value,
          });
        }
        return edge;
      });
    });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} id={id} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {toogle && (
            <div
              style={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setToogle(!toogle);
                  }
                }}
                className="h-[3vh] w-[6vw] rounded border border-gray-400/50 bg-transparent p-2 text-[0.50vw] text-black placeholder:text-[0.50vw] placeholder:text-[#1C274C] dark:text-white dark:placeholder:text-white "
                placeholder="type here..."
                value={label}
                onChange={(e) => {
                  onEdgeClick(e);
                }}
              />
              <TorusButton
                buttonClassName={
                  'bg-transparent text-[0.83vw] text-black dark:text-white border-none'
                }
                onPress={() => setToogle(!toogle)}
                Children={
                  <GrClose size={8} className="text-black dark:text-white" />
                }
              />
            </div>
          )}
          {toogle === false && (
            <p
              className="text-black dark:text-white"
              style={{
                zIndex: 20,
                fontSize: 7,
                backgroundColor: 'transparent',
              }}
              onClick={() => setToogle(!toogle)}
            >
              {label || 'Add Conditional Edge'}
            </p>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
