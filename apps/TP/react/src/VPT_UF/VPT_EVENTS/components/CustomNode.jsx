import { Handle, Position } from 'reactflow';
import './styles.module.css';

import { memo } from 'react';

export const onClick = memo(({ id, data, isConnectable, selected }) => {
  return (
    <div
      key={id}
      className="flex items-center justify-center  "
      style={{
        borderStyle: 'solid',
        borderRadius: '50%',
        height: '100px',
        width: '100px',
        fontSize: '25px',
        borderWidth: '4px',
        borderColor: '#ff66aa',
        backgroundColor: '#ffdfed',
      }}
    >
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
export const onSubmit = memo(({ id, data, isConnectable, selected }) => {
  return (
    <div
      className="flex items-center justify-center  "
      style={{
        borderStyle: 'solid',
        borderRadius: '50%',
        height: '100px',
        width: '100px',
        fontSize: '25px',
        borderWidth: '4px',
        borderColor: '#ff66aa',
        backgroundColor: '#ffdfed',
      }}
    >
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="events-custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="events-custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
export const input = memo(({ id, data, isConnectable, selected }) => {
  return (
    <div
      className="flex items-center justify-center  "
      style={{
        borderStyle: 'solid',
        borderRadius: '50%',
        height: '100px',
        width: '100px',
        fontSize: '25px',
        borderWidth: '4px',
        borderColor: '#ff66aa',
        backgroundColor: '#ffdfed',
      }}
    >
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="events-custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="events-custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
