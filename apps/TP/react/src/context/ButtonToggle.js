import { useContext } from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { DarkmodeContext } from './darkmodeContext';

const ButtonToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkmodeContext);

  return (
    <>
      <button onClick={() => toggleDarkMode()}>
        {darkMode && <IoMdSunny />}
        {!darkMode && <IoMdMoon />}
      </button>
    </>
  );
};

export default ButtonToggle;
