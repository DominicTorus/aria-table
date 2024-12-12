/* eslint-disable */
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import Logbutton from './button';

const NavigationBar = ({ height, json }) => {
  const navbarItems = ['Home', 'ContactUs', 'About us', 'Services', 'More'];

  const [navBarItem, setNavbarItem] = useState(navbarItems);

  const [navjson, setNavjson] = useState([]);

  useEffect(() => {
    setNavjson(json);
  }, []);

  return (
    <React.Fragment>
      <div
        className="flex w-full items-center justify-center"
        style={{ height: '100%' }}
      >
        <Navbar
          style={{ height: '100%' }}
          className="flex items-center justify-center rounded-md bg-[#3769BB] shadow-lg shadow-indigo-500/50"
        >
          <NavbarBrand className="font-bold text-white">
            <span>L O G O</span>
          </NavbarBrand>
          <NavbarContent className="flex items-center justify-center">
            {navBarItem &&
              navBarItem.length > 0 &&
              navBarItem.map((item) => (
                <NavbarItem className="flex list-none items-center justify-center">
                  <Link className="px-2 py-5 font-semibold text-white" href="#">
                    {item}
                  </Link>
                </NavbarItem>
              ))}
          </NavbarContent>
          <div className="profile_tag">
            <div className="flex items-center justify-center">
              <Logbutton />
            </div>
          </div>
        </Navbar>
      </div>
    </React.Fragment>
  );
};

export default NavigationBar;
