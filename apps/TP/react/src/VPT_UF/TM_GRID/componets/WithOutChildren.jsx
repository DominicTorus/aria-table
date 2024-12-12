import React from 'react';
import { useComponent } from '../contexts/Componet';
import ComponetPreview from './ComponetPreview';

export default function WithOutChildren({
  componentId,
  componentType,
  onNodeContextMenu,
}) {
  const component = useComponent();
  const { id, grid, data, type } = component.state[componentId];

  const onDragStart = (event) => {
    event.stopPropagation();
    event.dataTransfer.setData('application/key', id);
    event.dataTransfer.effectAllowed = 'move';
  };
  const childern = React.createElement(componentType, {
    key: id,
    id: id,
    type: type,
    title: data.label,
    grid: grid,
    onContextMenu: (e) => onNodeContextMenu(e, component.state[componentId]),
    onDragStart: (event) => onDragStart(event),
    draggable: true,
    className: `${
      component.selectedComponent === id
        ? 'outline outline-1 outline-red-300'
        : ''
    } `,
  });

  return childern;
}
