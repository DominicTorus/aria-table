import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getConnectedEdges,
  useKeyPress,
  useReactFlow,
  useStore,
} from 'reactflow';

export function useCopyPaste() {
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rfDomNode = useStore((state) => state.domNode);

  const { getNodes, setNodes, getEdges, setEdges, screenToFlowPosition } =
    useReactFlow();

  // Set up the paste buffers to store the copied nodes and edges.
  const [bufferedNodes, setBufferedNodes] = useState([]);
  const [bufferedEdges, setBufferedEdges] = useState([]);

  // initialize the copy/paste hook
  // 1. remove native copy/paste/cut handlers
  // 2. add mouse move handler to keep track of the current mouse position
  useEffect(() => {
    const events = ['cut', 'copy', 'paste'];

    if (rfDomNode) {
      const preventDefault = (e) => e.preventDefault();

      const onMouseMove = (event) => {
        mousePosRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
      };

      for (const event of events) {
        rfDomNode.addEventListener(event, preventDefault);
      }

      rfDomNode.addEventListener('mousemove', onMouseMove);

      return () => {
        for (const event of events) {
          rfDomNode.removeEventListener(event, preventDefault);
        }

        rfDomNode.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [rfDomNode]);

  const copy = useCallback(
    (id) => {
      const selectedNodes = getNodes().filter(
        (node) => node.selected || id === node.id,
      );
      const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter(
        (edge) => {
          const isExternalSource = selectedNodes.every(
            (n) => n.id !== edge.source,
          );
          const isExternalTarget = selectedNodes.every(
            (n) => n.id !== edge.target,
          );

          return !(isExternalSource || isExternalTarget);
        },
      );

      setBufferedNodes(selectedNodes);
      setBufferedEdges(selectedEdges);
    },
    [getNodes, getEdges],
  );

  const cut = useCallback(
    (id) => {
      const selectedNodes = getNodes().filter(
        (node) => node.selected || id === node.id,
      );
      const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter(
        (edge) => {
          const isExternalSource = selectedNodes.every(
            (n) => n.id !== edge.source,
          );
          const isExternalTarget = selectedNodes.every(
            (n) => n.id !== edge.target,
          );

          return !(isExternalSource || isExternalTarget);
        },
      );

      setBufferedNodes(selectedNodes);
      setBufferedEdges(selectedEdges);

      // A cut action needs to remove the copied nodes and edges from the graph.
      setNodes((nodes) => nodes.filter((node) => !node.selected));
      setEdges((edges) =>
        edges.filter((edge) => !selectedEdges.includes(edge)),
      );
    },
    [getNodes, setNodes, getEdges, setEdges],
  );

  const paste = useCallback(
    (
      { x: pasteX, y: pasteY } = screenToFlowPosition({
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
      }),
    ) => {
      const minX = Math.min(...bufferedNodes?.map((s) => s.position.x));
      const minY = Math.min(...bufferedNodes?.map((s) => s.position.y));

      const now = Date.now();

      const newNodes = bufferedNodes?.map((node) => {
        const id = `${node.id}-${now}`;
        const x = pasteX + (node.position.x - minX);
        const y = pasteY + (node.position.y - minY);

        return { ...node, id, position: { x, y } };
      });

      const newEdges =
        bufferedEdges &&
        bufferedEdges?.map((edge) => {
          const id = `${edge.id}-${now}`;
          const source = `${edge.source}-${now}`;
          const target = `${edge.target}-${now}`;

          return { ...edge, id, source, target };
        });

      setNodes((nodes) => [
        ...nodes?.map((node) => ({ ...node, selected: false })),
        ...newNodes,
      ]);
      setEdges((edges) => [
        ...edges?.map((edge) => ({ ...edge, selected: false })),
        ...newEdges,
      ]);
    },
    [bufferedNodes, bufferedEdges, screenToFlowPosition, setNodes, setEdges],
  );

  useShortcut(['Meta+x', 'Control+x'], cut);
  useShortcut(['Meta+c', 'Control+c'], copy);
  useShortcut(['Meta+v', 'Control+v'], paste);

  return { cut, copy, paste, bufferedNodes, bufferedEdges };
}

function useShortcut(keyCode, callback) {
  const [didRun, setDidRun] = useState(false);
  const shouldRun = useKeyPress(keyCode);

  useEffect(() => {
    if (shouldRun && !didRun) {
      callback();
      setDidRun(true);
    } else {
      setDidRun(shouldRun);
    }
  }, [shouldRun, didRun, callback]);
}

export default useCopyPaste;
