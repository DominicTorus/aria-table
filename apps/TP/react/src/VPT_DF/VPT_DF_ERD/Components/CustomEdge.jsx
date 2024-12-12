import React, { useContext, useState } from 'react';
import { SiRelay } from 'react-icons/si';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from 'reactflow';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import TorusDropDown from '../../../torusComponents/TorusDropDown';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [toogle, setToogle] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { darkMode } = useContext(DarkmodeContext);

  /**
   * Updates the edges array by modifying the specified edge's data based on the type of click.
   * If the click is on the start label, updates the startLabel property of the edge's data.
   * If the click is on the end label, updates the endLabel property of the edge's data.
   * Toggles the toogle state if the click is on the start label.
   * Toggles the toggle state if the click is on the end label.
   *
   * @param {Event} e - The click event.
   * @param {string} type - The type of click ('start' or 'end').
   * @return {void}
   */
  const onEdgeClick = (e, type) => {
    try {
      setEdges((edges) => {
        return edges?.map((edge) => {
          if (edge.id === id) {
            if (type === 'start') {
              return (edge = {
                ...edge,
                data: {
                  ...edge.data,
                  startLabel: e,
                },
              });
            }
            if (type === 'end') {
              return (edge = {
                ...edge,
                data: {
                  ...edge.data,
                  endLabel: e,
                },
              });
            }
          }
          return edge;
        });
      });
      if (type === 'start') {
        setToogle(!toogle);
      }
      if (type === 'end') {
        setToggle(!toggle);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const Cardinalities = [
    { name: 'One', value: 'One' },
    { name: 'Many', value: 'Many' },
  ];

  /**
   * Component representing a JSX structure with conditional rendering and event handling.
   * @param {object} props - The props object containing various properties.
   * @param {string} props.id - The id of the element.
   * @param {string} props.edgePath - The path of the edge.
   * @param {number} props.labelX - The x-coordinate for label positioning.
   * @param {number} props.labelY - The y-coordinate for label positioning.
   * @param {boolean} props.toogle - The toggle state for conditional rendering.
   * @param {object} props.data - The data object containing startLabel and endLabel properties.
   * @param {boolean} props.darkMode - The dark mode state.
   * @param {function} props.onEdgeClick - The function to handle edge click event.
   * @param {function} props.setToogle - The function to set the toggle state.
   */
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            pointerEvents: 'all',
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'transparent',
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
          className="nodrag nopan font-normal text-white "
        >
          {/* <Dropdown
                inputId="cardinality"
                value={data.startLabel}
                options={Cardinalities}
                optionLabel="name"
                className="flex h-[15px] w-[50px] items-center justify-center bg-gray-400 text-[0.62vw] text-[#0F0F0F] dark:bg-[#0F0F0F] dark:text-white"
                placeholder="Cardinality"
                onChange={(e) => {
                  onEdgeClick(e, "start");
                }}
                style={{
                  boxShadow: "none",
                  border: "none",
                }}
              /> */}
          <TorusDropDown
            title={data.startLabel}
            key="cardinality"
            selected={new Set([data.startLabel])}
            selectionMode="single"
            items={Cardinalities.map((option) => ({
              label: option.name,
              key: option.value,
              value: option.value,
            }))}
            setSelected={(e) => {
              onEdgeClick(Array.from(e)[0], 'start');
            }}
            classNames={{
              buttonClassName:
                'rounded-md border-none text-[#616A6B] dark:text-white outline-none  text-[0.52vw] font-medium bg-transparent dark:bg-transparent text-center dark:text-white',
              popoverClassName:
                'flex item-center justify-center w-[6vw] text-[0.83vw]',
              listBoxClassName:
                'overflow-y-auto bg-white border border-[#F2F4F7] dark:bg-[#0F0F0F] ',
              listBoxItemClassName: 'flex justify-between text-md',
            }}
          />

          <SiRelay
            className="p-1 text-[3vw]"
            color={darkMode ? 'white' : '#616A6B '}
          />

          {/* <Dropdown
                inputId="cardinality"
                value={data.endLabel}
                options={Cardinalities}
                optionLabel="name"
                className="w-full"
                placeholder="Cardinality"
                onChange={(e) => {
                  onEdgeClick(e, "end");
                }}
                style={{
                  boxShadow: "none",
                  border: "none",
                  backgroundColor: "transparent",
                }}
              /> */}
          <TorusDropDown
            title={data.endLabel}
            key="cardinality"
            selected={new Set([data.endLabel])}
            selectionMode="single"
            items={Cardinalities.map((option) => ({
              label: option.name,
              key: option.value,
              value: option.value,
            }))}
            setSelected={(e) => {
              onEdgeClick(Array.from(e)[0], 'end');
            }}
            classNames={{
              buttonClassName:
                'rounded-md border-none text-[#616A6B] dark:text-white outline-none  text-[0.52vw] font-medium bg-transparent dark:bg-transparent text-center dark:text-white',
              popoverClassName:
                'flex item-center justify-center w-[6vw] text-[0.83vw]',
              listBoxClassName:
                'overflow-y-auto bg-white border border-[#F2F4F7] dark:bg-[#0F0F0F] ',
              listBoxItemClassName: 'flex justify-between text-md',
            }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
