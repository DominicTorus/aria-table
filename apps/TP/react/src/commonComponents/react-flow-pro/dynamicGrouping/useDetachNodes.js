import { useCallback } from 'react';
import { useReactFlow, useStoreApi } from 'reactflow';

function useDetachNodes() {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const detachNodes = useCallback(
    (ids, removeParentId) => {
      const { nodeInternals } = store.getState();
      const nextNodes = Array.from(nodeInternals.values()).map((n) => {
        if (ids.includes(n.id) && n.parentNode) {
          const parentNode = nodeInternals.get(n.parentNode);
          return {
            ...n,
            position: {
              x: n.position.x + (parentNode?.positionAbsolute?.x ?? 0),
              y: n.position.y + (parentNode?.positionAbsolute?.y ?? 0),
            },
            expandParent: undefined,
            parentNode: undefined,
          };
        }
        return n;
      });
      setNodes(
        nextNodes.filter((n) => !removeParentId || n.id !== removeParentId),
      );
    },
    [setNodes, store],
  );
  return detachNodes;
}

export default useDetachNodes;
