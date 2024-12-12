import React, { useEffect, useState } from 'react';
import { TiArrowBackOutline } from 'react-icons/ti';
import UFDMain from '../UFDMain';
import JsonUiLayout from './customComponents/jsonUiLayout';

/**
 * Renders the Builder component.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - stateTrack: The state tracking value.
 *   - nodesj: The nodes JSON data.
 *   - jsonj: The JSON data.
 *   - widthj: The width value.
 *   - heightj: The height value.
 *   - setShowBuilder: The function to set the showBuilder value.
 *   - showbuilder: The showBuilder value.
 * @return {JSX.Element} The rendered Builder component.
 */
export const Builder = ({
  stateTrack,
  nodesj,
  jsonj,
  widthj,
  heightj,
  setShowBuilder,
  showbuilder,
}) => {
  const [nodejson, setnodeJson] = useState([]);
  const [height, setHeight] = useState(null);
  const width = null;

  useEffect(() => {
    setnodeJson(nodesj);
    setHeight(heightj);
  }, [heightj, jsonj, nodesj]);

  const handleClick = () => {
    setShowBuilder(!showbuilder);
  };

  return (
    <div>
      {!showbuilder ? (
        <>
          <UFDMain />
        </>
      ) : (
        <>
          <button
            onClick={handleClick}
            className="fixed left-4 top-2 z-50 m-10 
       cursor-pointer rounded bg-gray-500 px-3  py-3 text-center text-white hover:bg-gray-700"
          >
            <TiArrowBackOutline />
          </button>

          <JsonUiLayout
            nodejson={nodejson}
            height={height}
            width={width}
            stateTrack={stateTrack}
          />
        </>
      )}
    </div>
  );
};
