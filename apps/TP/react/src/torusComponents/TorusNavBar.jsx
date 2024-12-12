import React, { useState } from 'react';
import { MdDataArray } from 'react-icons/md';
import TorusAvatar from './TorusAvatar';

const defaultTropdownClassNames = {
  buttonClassName: `torus-pressed:animate-torusButtonActive 
  `,
  popoverClassName:
    'torus-entering:animate-torusPopOverOpen torus-exiting:animate-torusPopOverClose w-40',
  dialogClassName: 'outline-none w-full',
  listBoxClassName:
    'w-full bg-slate-200 border-2 border-gray-300 transition-all p-1 rounded-md gap-1 flex flex-col items-center',
  listBoxItemClassName:
    'p-1 w-full torus-focus:outline-none torus-hover:bg-blue-300 rounded-md cursor-pointer transition-colors duration-300',
};

const menus = [
  {
    menuGroup: 'master',
    screenName: [
      'masterbank-ABC:CG:mvp:SF:bank:v1-ABC:CG:mvp:UF:bank:v2',
      'masterbranch-ABC:CG:mvp:SF:branch:v1-ABC:CG:mvp:UF:branch:v2',
      'mastertest-ABC:CG:mvp:SF:test:v2-ABC:CG:mvp:UF:test:v2',
    ],
  },
  {
    menuGroup: 'master2',
    screenName: ['master2bank-ABC:CG:mvp:SF:bank:v1-ABC:CG:mvp:UF:bank:v2'],
  },
  {
    menuGroup: 'master3',
    screenName: [
      'master3bank-ABC:CG:mvp:SF:bank:v1-ABC:CG:mvp:UF:bank:v2',
      'master3branch-ABC:CG:mvp:SF:branch:v1-ABC:CG:mvp:UF:branch:v2',
    ],
  },
];

const RenderDropdown = ({ menus }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const [select, setSelect] = useState(null);

  const toggleMenuClick = (index, item) => {
    if (selectedItem === item) {
      setOpen(!open);
    } else {
      setOpen(true);
    }
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  console.log(select, 'select');
  const handleMouseDown = (event, index, item) => {
    event.preventDefault();
    setClickedItem(event.currentTarget.getBoundingClientRect());
    toggleMenuClick(index, item);
  };

  return (
    <div className="">
      <div className="flex gap-2">
        {menus &&
          menus.map((item, index) => {
            if (typeof item === 'object') {
              return Object.keys(item).map((ele, key) => {
                if (typeof item[ele] === 'string') {
                  return (
                    <div
                      onClick={(event) => handleMouseDown(event, index, item)}
                      className="relative"
                    >
                      <ul key={key}>
                        {console.log(item[ele], ele, index, ' ele')}
                        <li
                          className={`${
                            selectedIndex === index
                              ? 'text-red-600'
                              : 'text-white'
                          }`}
                        >
                          {item[ele]}
                        </li>
                      </ul>
                    </div>
                  );
                }
                if (Array.isArray(item[ele]) && open && selectedItem) {
                  return (
                    <div
                      className="absolute   rounded border bg-[#F4F5FA] p-2"
                      style={{
                        top: `${clickedItem?.bottom + 9 + window.scrollY}px`,
                        left: `${clickedItem?.left}px`,
                      }}
                    >
                      {Object.keys(selectedItem).map((ele, key) => {
                        if (Array.isArray(selectedItem[ele])) {
                          return (
                            <span key={key}>
                              {selectedItem[ele].map((eles, keys) => {
                                console.log(eles, selectedItem[ele], 'fhf');
                                return (
                                  <p
                                    key={keys}
                                    className="mb-2 flex text-black"
                                    onClick={() =>
                                      setSelect(eles.split('-')[0])
                                    }
                                  >
                                    {eles.split('-')[0]}
                                  </p>
                                );
                              })}
                            </span>
                          );
                        }
                      })}
                    </div>
                  );
                }
              });
            }
          })}
      </div>
    </div>
  );
};

export default function TorusNavBar() {
  return (
    <div className="bg-[#070D1F] p-2">
      <nav className="flex w-[100%]  flex-col items-center justify-between   lg:flex-row">
        <div className="flex items-center space-x-4 ">
          <div className="">
            <MdDataArray color="white" />
          </div>
          <div className="">
            <RenderDropdown menus={menus} />
          </div>
        </div>

        <div className="mt-4 flex space-x-4 lg:mt-0">
          <div>
            <TorusAvatar class="h-10 w-10 rounded-full" />
          </div>
          <div className="text-white">elwf</div>
        </div>
      </nav>
      {/* 
      <div className="absolute top-12 bg-[#F4F5FA] border rounded p-2">
        {open &&
          selectedItem &&
          Object.keys(selectedItem).map((ele, key) => {
            if (Array.isArray(selectedItem[ele])) {
              return (
                <span
                  key={key}
                  // style={{ display: key === selectedIndex ? "block" : "none" }}
                >
                  {selectedItem[ele].map((eles, keys) => {
                    console.log(eles, selectedItem[ele], "fhf");
                    return (
                      <p key={keys} className="text-black flex mb-2">
                        {eles.split('-')[0]}
                      </p>
                    );
                  })}
                </span>
              );
            }
          })
          
          
          }
      </div> */}
    </div>
  );
}
