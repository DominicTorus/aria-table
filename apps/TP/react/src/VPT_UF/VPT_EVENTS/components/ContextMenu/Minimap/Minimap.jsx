import { useContext } from 'react';
import { DarkmodeContext } from '../../../../../commonComponents/context/DarkmodeContext';

export const MinimapComponent = ({ x, y, width }) => {
  const { darkMode } = useContext(DarkmodeContext);

  return (
    <circle
      cx={x}
      cy={y}
      r={width / 2 + 10}
      strokeWidth={1}
      color={darkMode ? 'white' : 'black'}
      fill={darkMode ? '#333334' : '#E4E3E3'}
    />
  );
};
