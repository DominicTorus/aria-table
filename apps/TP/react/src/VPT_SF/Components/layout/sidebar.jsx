import React, { useContext, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import TreeView from './treeView';

import { TorusModellerContext } from '../../../Layout';
const fabrics = [
  { id: 'orgGrp', fabricName: 'orgGrp' },
  { id: 'roleGrp', fabricName: 'roleGrp' },
  { id: 'psGrp', fabricName: 'psGrp' },
];

const OrpsSidebar = ({ dropdownJson }) => {
  const { darkMode } = useContext(DarkmodeContext);
  const { sfNodeGalleryData } = useContext(TorusModellerContext);

  console.log(sfNodeGalleryData, 'orpsSidebar');
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="mt-1 flex h-full w-full flex-col p-2">
      {fabrics.map((item) => (
        <div key={item.id} className="mb-2">
          <div
            className="flex w-full cursor-pointer items-center justify-center  rounded-md"
            onClick={() => toggleAccordion(item.id)}
          >
            <div className="flex w-full items-center justify-start">
              <span className=" text-[0.72vw] font-medium text-black dark:text-white">
                {item.fabricName}
              </span>
            </div>
            <span className="flex w-full items-center justify-end">
              {openAccordion === item.id ? (
                <IoIosArrowUp
                  size={12}
                  className="text-black dark:text-white"
                />
              ) : (
                <IoIosArrowDown
                  size={12}
                  className="text-black dark:text-white"
                />
              )}
            </span>
          </div>
          {openAccordion === item.id && (
            <div className="mt-2 w-full  ">
              {dropdownJson && dropdownJson.hasOwnProperty(item.id) ? (
                <TreeView data={dropdownJson[item.id]} />
              ) : (
                <p className="text-center">
                  {darkMode ? 'No data found' : 'No data found'}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrpsSidebar;
