import ReactFlow from 'reactflow';

const AppAIF = ({ children }) => {
  return (
    <div className="h-full w-full">
      <ReactFlow>
        {children && (typeof children == 'function' ? children({}) : children)}
      </ReactFlow>
    </div>
  );
};

export default AppAIF;
