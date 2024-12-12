import React from 'react';
const componentsList = ['Group', 'Button'];
export default function DndPanel() {
  const onDragStart = (event, key) => {
    if (key) {
      event.dataTransfer.setData('application/key', key);
      event.dataTransfer.effectAllowed = 'move';
    }
  };
  return (
    <div className="border border-gray-300 p-4">
      <h2 className="mb-2 text-lg font-bold">Node Gallery</h2>
      {componentsList.map((component) => (
        <div
          key={component}
          draggable
          onDragStart={(event) => onDragStart(event, component)}
          className={`bg-green-200" mb-2 border 
             p-2
          `}
        >
          {component}
        </div>
      ))}
    </div>
  );
}
