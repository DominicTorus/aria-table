import React from 'react';
import { useComponent } from '../contexts/Componet';

export default function ChangeGrid({ id }) {
  const component = useComponent();
  const { grid } = component.state[id];
  return (
    <div className="absolute right-0 top-0 flex gap-2">
      <button
        onClick={() => {
          if (grid.column.start > 1 && grid.column.start < 13) {
            component.changeGridPosition(
              id,
              'column',
              'start',
              grid.column.start + 1,
            );
          }
        }}
      >
        {'<'}
      </button>
      <button
        onClick={() => {
          component.changeGridPosition(id, 'column', 'end');
        }}
      >
        {'>'}
      </button>
      <button
        onClick={() => {
          component.changeGridPosition(id, 'row', 'start');
        }}
      >
        {'^'}
      </button>
      <button
        onClick={() => {
          component.changeGridPosition(id, 'row', 'end');
        }}
      >
        {'v'}
      </button>
    </div>
  );
}
