import { memo, useEffect } from 'react';
import { NodeResizer, useReactFlow } from 'reactflow';

const lineStyle = { borderColor: 'white' };

/**
 * Renders a group node component.
 *
 * @param {Object} props - The properties of the component.
 * @param {string} props.id - The unique identifier of the node.
 * @return {JSX.Element} The rendered group node component.
 */
function GroupNode({ id }) {
  const { flowToScreenPosition, setNodes } = useReactFlow();
  useEffect(() => {
    setNodes((nds) => {
      return (
        nds &&
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              flowToScreenPosition: {
                ...node.flowToScreenPosition,
                height: 200,
                width: 400,
              },
            };
          }
          return node;
        })
      );
    });
  }, [id, setNodes]);
  const handleReize = (e, id) => {
    const position = flowToScreenPosition({ x: e.x, y: e.y });
    setNodes((nds) => {
      return (
        nds &&
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              flowToScreenPosition: {
                ...e,
                ...position,
              },
            };
          }
          return node;
        })
      );
    });
  };
  return (
    <div>
      <NodeResizer
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
        lineStyle={lineStyle}
      />
    </div>
  );
}

export default memo(GroupNode);
