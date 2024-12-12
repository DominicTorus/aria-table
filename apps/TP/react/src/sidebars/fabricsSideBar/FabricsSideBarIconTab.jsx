import React from 'react';
import { Add, Flip, Medicine, Pencil, Scan } from '../../SVG_Application';
import TorusToolTip from '../../torusComponents/TorusToolTip';
const tabIcons = [
  {
    name: 'DF',
    icon: <Pencil />,
  },
  {
    name: 'UF',
    icon: <Flip />,
  },
  {
    name: 'UF',
    icon: <Medicine />,
  },
  {
    name: 'UF',
    icon: <Scan />,
  },
  {
    name: 'UF',
    icon: <Add />,
  },
  {
    name: 'UF',
    icon: <Flip />,
  },
  {
    name: 'UF',
    icon: <Medicine />,
  },
  {
    name: 'UF',
    icon: <Scan />,
  },
];

export default function FabricsSideBarIconTab({ color }) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white pt-6 ">
      {tabIcons.map((icon) => {
        return;
        <RenderIcon name={icon.name} icon={icon.icon} color={color} />;
      })}
    </div>
  );
}

const RenderIcon = ({ name, icon, color }) => {
  return (
    <div className="flex w-full items-center justify-center p-2 ">
      <TorusToolTip tooltipContent={name} hoverContent={icon} color={color} />
    </div>
  );
};
