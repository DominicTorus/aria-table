import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import { useEffect } from 'react';
import { useReactFlow, useStore } from 'reactflow';

const elementCountSelector = (state) =>
  state.nodeInternals.size + state.edges.length;
const nodesInitializedSelector = (state) =>
  Array.from(state.nodeInternals.values()).every(
    (node) => node.width && node.height,
  ) && state.nodeInternals.size;

function useForceLayout({ strength = -1000, distance = 150 }) {
  const elementCount = useStore(elementCountSelector);
  const nodesInitialized = useStore(nodesInitializedSelector);
  const { setNodes, getNodes, getEdges } = useReactFlow();

  useEffect(() => {
    const nodes = getNodes();
    const edges = getEdges();

    if (!nodes.length || !nodesInitialized) {
      return;
    }

    const simulationNodes = nodes.map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }));

    const simulationLinks = edges.map((edge) => edge);

    const simulation = forceSimulation()
      .nodes(simulationNodes)
      .force('charge', forceManyBody().strength(strength))
      .force(
        'link',
        forceLink(simulationLinks)
          .id((d) => d.id)
          .strength(0.05)
          .distance(distance),
      )
      .force('x', forceX().x(0).strength(0.08))
      .force('y', forceY().y(0).strength(0.08))
      .on('tick', () => {
        setNodes((nodes) =>
          nodes.map((node, i) => {
            const { x, y } = simulationNodes[i];

            if (node.dragging) {
              // Setting the fx/fy properties of a node tells the simulation to
              // "fix" the node at that position and ignore any forces that would
              // normally cause it to move.
              //
              // The node is still part of the simulation, though, and will push
              // other nodes around while the simulation runs.
              simulationNodes[i].fx = node.position.x;
              simulationNodes[i].fy = node.position.y;
            }

            return { ...node, position: { x: x ?? 100, y: y ?? 100 } };
          }),
        );
      });

    return () => {
      simulation.stop();
    };
  }, [
    elementCount,
    getNodes,
    getEdges,
    setNodes,
    strength,
    distance,
    nodesInitialized,
  ]);
}

export default useForceLayout;
