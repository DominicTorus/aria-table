import { Button, User } from '@nextui-org/react';
import React from 'react';

export default function SideNavbar({ height, width, statetrack }) {
  const navItem = [
    'HOME',
    'ABOUT US',
    'CONTACT US',
    'SERVICES',
    'BOOK SESSION',
  ];

  return (
    <React.Fragment>
      <div
        className="flex flex-col items-center justify-between rounded-lg bg-slate-500 px-6 py-7 shadow-md"
        style={{
          width: width,
          height: height,
        }}
      >
        <div
          className="flex flex-col items-start justify-evenly gap-4"
          style={{ width: width }}
        >
          <div className="pt=[10%]">
            <User name="TORUS" description=" product design tool"></User>
          </div>
          <div className="pt-[20%]">
            {navItem &&
              navItem.length > 0 &&
              navItem.map((item) => <h5>{item}</h5>)}
          </div>

          <div>
            <Button>Log out</Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
