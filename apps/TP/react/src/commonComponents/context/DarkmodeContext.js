import { createContext, useState } from 'react';

const DarkmodeContext = createContext();

function DarkmodeProvider(props) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark');
  };

  return (
    <DarkmodeContext.Provider
      className="h-full w-full"
      value={{ darkMode, toggleDarkMode }}
    >
      {props.children}
    </DarkmodeContext.Provider>
  );
}

export { DarkmodeContext, DarkmodeProvider };
