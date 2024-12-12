import React, { createContext, useContext } from 'react';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import { EventDashBoard } from '../components/DashBoard';


import { TorusModellerContext } from '../../../Layout';
import { EventScreen } from '../../../NodeGallery';

export const eventSourceNodesJsonContext = createContext([]);

export function EventDisplay({
  nodes,
  edges,
  setEdges,
  setNodes,
  onNodesChange,
  onEdgesChange,
  children,

  currentDrawing,
  selectedControlEvents,
}) {
  const { controlJson } = useContext(TorusModellerContext);
  const { darkMode } = useContext(DarkmodeContext);

  return (
    <eventSourceNodesJsonContext.Provider value={controlJson}>
      <div
        className={`mt-[0px] flex h-full w-full items-center ${darkMode ? 'bg-[#1D1D1D]' : 'bg-[#f0f0f0]'}`}
      >
        {selectedControlEvents && (
          
            <div
              className={`h-[100%] w-[15%] overflow-scroll transition-all  ${darkMode ? 'bg-[#1D1D1D]/90  ' : 'bg-[#e4e3e3] '} border-r border-neutral-600`}
              
            >
              <EventScreen json={selectedControlEvents} />
            </div>
          
        )}

        <div
          className={
            ' h-full border-r border-gray-600 transition-all delay-75 duration-75 ease-in-out ' +
            (selectedControlEvents ? 'w-[85%]' : 'w-full')
          }
        >
          <div className="flex h-full w-full items-center justify-center">
            <EventDashBoard
              nodes={nodes}
              edges={edges}
              setEdges={setEdges}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              children={children}
            />
          </div>
        </div>
      </div>
    </eventSourceNodesJsonContext.Provider>
  );
}

/**
 * Renders the event screen with the provided JSON data.
 * Allows dragging of events to reorder them.
 *
 * @param {Object} json - The JSON data containing the event information.
 * @return {JSX.Element} The rendered event screen.
 */
