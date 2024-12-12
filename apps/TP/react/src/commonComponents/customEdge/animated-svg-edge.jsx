import {
  BaseEdge,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from 'reactflow';

/**
 * The `AnimatedSvgEdge` component renders a typical React Flow edge and animates
 * an SVG shape along the edge's path.
 */
export function AnimatedSvgEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,

  data = {
    duration: 2,
    direction: 'forward',
    path: 'smoothstep',
    repeat: 'indefinite',
    shape: 'circle',
  },

  ...delegated
}) {
  const Shape = shapes[data.shape];

  const [path] = getPath({
    type: data.path ?? 'bezier',
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const animateMotionProps = getAnimateMotionProps({
    duration: data.duration,
    direction: data.direction ?? 'forward',
    repeat: data.repeat ?? 'indefinite',
    path,
  });

  return (
    <>
      <BaseEdge id={id} path={path} {...delegated} />
      <Shape animateMotionProps={animateMotionProps} />
    </>
  );
}

const shapes = {
  circle: ({ animateMotionProps }) => (
    <circle r="2" fill="#000">
      <animateMotion {...animateMotionProps} />
    </circle>
  ),
  box: ({ animateMotionProps }) => (
    <rect width="7" height="2" fill="#ff0073" transform="translate(-2.5,-2.5)">
      <animateMotion {...animateMotionProps} />
    </rect>
  ),
  arrow: ({ animateMotionProps }) => (
    <g fill="none" transform="translate(-10,-10)">
      <path
        d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z"
        stroke={'black'}
        stroke-width="1"
        stroke-linejoin="round"
      />
      <animateMotion {...animateMotionProps} />
    </g>
  ),

  package: ({ animateMotionProps }) => (
    <g fill="#dfc7b1" stroke="#2b2a2a" transform="translate(-10,-10)">
      <path d="M11 21.73a2 2 0 0l7-4A2 21 16V8a2 0-1-1.73l-7-4a2 0-2 0l-7 4A2 3 8v8a2 1 1.73z" />
      <path d="M12 22V12" />
      <path d="m3.3 7 7.703 4.734a2 2 0 1.994 0L20.7" />
      <path d="m7.5 4.27 9 5.15" />
      <animateMotion {...animateMotionProps} />
    </g>
  ),
};

/**
 * Chooses which of React Flow's edge path algorithms to use based on the provided
 * `type`.
 */
function getPath({
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) {
  switch (type) {
    case 'bezier':
      return getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });

    case 'smoothstep':
      return getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });

    case 'step':
      return getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 0,
      });

    case 'straight':
      return getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
  }
}

/**
 * Construct the props for an `<animateMotion />` element based on an
 * `AnimatedSvgEdge`'s data.
 */
function getAnimateMotionProps({ duration, direction, repeat, path }) {
  const base = {
    path,
    repeatCount: repeat,
    // The default calcMode for the `<animateMotion />` element is "paced", which
    // is not compatible with the `keyPoints` attribute. Setting this to "linear"
    // ensures that the shape correc follows the path.
    calcMode: 'linear',
  };

  switch (direction) {
    case 'forward':
      return {
        ...base,
        dur: `${duration}s`,
        keyTimes: '0;1',
        keyPoints: '0;1',
      };

    case 'reverse':
      return {
        ...base,
        dur: `${duration}s`,
        keyTimes: '0;1',
        keyPoints: '1;0',
      };

    case 'alternate':
      return {
        ...base,
        // By doubling the animation duration, the time spent moving from one end
        // to the other remains consistent when switching between directions.
        dur: `${duration * 2}s`,
        keyTimes: '0;0.5;1',
        keyPoints: '0;1;0',
      };

    case 'alternate-reverse':
      return {
        ...base,
        dur: `${duration * 2}s`,
        keyTimes: '0;0.5;1',
        keyPoints: '1;0;1',
      };
  }
}
