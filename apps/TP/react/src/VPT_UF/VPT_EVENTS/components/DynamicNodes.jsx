import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export const GroupNode = memo(
  ({ id, data, isConnectable, selected, itemKey }) => {
    return (
      <div
        className="flex items-center justify-center rounded-lg text-center text-[0.42vw]   "
        style={{
          height: '40px',
          width: '40px',
          borderWidth: '2px',
          borderColor: '#E74C3C',
          backgroundColor: '#F5B7B1',
        }}
      >
        {data.nodeName || data.nodeType}
        <br />({data.sequence})
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="events-custom-node-handle"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="events-custom-node-handle"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }}
          isConnectable={isConnectable}
        />
      </div>
    );
  },
);

export const InputNode = memo(
  ({ id, data, isConnectable, selected, itemKey }) => {
    return (
      <div
        className="flex items-center justify-center  "
        style={{
          borderStyle: 'solid',
          borderRadius: '50%',
          height: '100px',
          width: '200px',
          fontSize: '25px',
          borderWidth: '4px',
          borderColor: '#CB4335',
          backgroundColor: '#F5B7B1',
        }}
      >
        {data.label}
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="events-custom-node-handle"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="events-custom-node-handle"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          isConnectable={isConnectable}
        />
      </div>
    );
  },
);

export const ControlNode = memo(
  ({ id, data, isConnectable, selected, itemKey }) => {
    return (
      <div
        className="flex items-center justify-center  "
        style={{
          height: '25px',
          width: '60px',
          fontSize: '0.42vw',
          borderWidth: '2px',
          textAlign: 'center',
          borderColor: '#17A589',
          backgroundColor: '#A3E4D7',
          borderRadius: '2px',
          TextAlign: 'center',
        }}
      >
        {data.nodeName || data.nodeType}
        <br />({data.sequence})
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="events-custom-node-handle"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="events-custom-node-handle"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }}
          isConnectable={isConnectable}
        />
      </div>
    );
  },
);

export const EventNode = memo(({ id, data, isConnectable, selected }) => {
  return (
    <div
      className="flex h-[45px] min-w-[45px] items-center justify-center rounded-full text-center text-[0.42vw]  "
      style={{
        borderColor: '#F1C40F',
        borderWidth: '2px',
        backgroundColor: '#F9E79F',
      }}
    >
      {data.label}
      <br />({data.sequence})
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});

export const HandlerNode = memo(({ id, data, isConnectable, selected }) => {
  return (
    <div
      className="flex h-[45px] min-w-[45px]  items-center justify-center rounded-full text-center text-[0.42vw] "
      style={{
        borderColor: '#707B7C',
        borderWidth: '2px',
        backgroundColor: '#CCD1D1',
      }}
    >
      {data.label}
      <br />({data.sequence})
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});

export const ResponseNode = memo(({ id, data, isConnectable, selected }) => {
  return (
    <div
      className="flex h-[45px] min-w-[45px] items-center justify-center rounded-full text-center text-[0.42vw] "
      style={{
        borderColor: data?.responseType === 'success' ? '#2ECC71' : '#E74C3C',
        borderWidth: '2px',
        backgroundColor:
          data?.responseType === 'success' ? '#DFF0D8' : '#F2DEDE',
      }}
    >
      {data.label}
      <br />({data.sequence})
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
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
        height: '200px',
        width: '200px',
        fontSize: '25px',
        borderWidth: '4px',
        borderColor: '#ff66aa',
        backgroundColor: '#ffdfed',
      }}
    >
      onSubmit
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

export const ScreenNode = memo(({ id, data, isConnectable, selected }) => {
  return (
    <div
      className="flex h-[45px] min-w-[45px] items-center justify-center rounded-full text-center text-[0.42vw] "
      style={{
        height: '40px',
        width: '40px',
        borderWidth: '2px',
        borderColor: '#2dafbb',
        backgroundColor: '#c3f5f5',
      }}
    >
      {data.label}
      <br />({data.sequence})
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="events-custom-node-handle"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
});