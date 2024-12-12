import React, { useContext } from 'react';
import { MdDriveFolderUpload } from 'react-icons/md';
import { DarkmodeContext } from '../context/DarkmodeContext';

export function Upload({ setFiles, id }) {
  const { darkMode } = useContext(DarkmodeContext);

  const handleChange = (e) => {
    try {
      const fileReader = new FileReader();

      if (!e.target.files[0]) return;
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        setFiles(e.target.result);
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <label htmlFor={id} className="fileUploadLabel z-50">
        <MdDriveFolderUpload size={12} className="text-black dark:text-white" />
      </label>
      <input
        style={{ display: 'none' }}
        type="file"
        id={id}
        accept="application/json"
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleChange(e);
        }}
      />
    </>
  );
}
