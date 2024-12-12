/* eslint-disable */
import { memo, useEffect } from 'react';
import {
  Handle,
  NodeResizeControl,
  NodeResizer,
  Position,
  useReactFlow,
} from 'reactflow';
import { SvgResizeIcon } from '../../../../asset/SvgsApplication';
import ButtonComponent from '../customComponents/Button/ButtonComponent';
import { DateInputComponent } from '../customComponents/date/DateInputComponent';
import DropdownComponent from '../customComponents/dropdown/dropdownComponent';
import FormComponent from '../customComponents/Form/FormComponent';
import InputComponent from '../customComponents/Input/InputComponent';
import NavigationBar from '../customComponents/Navdata/navbar';
import { RadioComponent } from '../customComponents/radio/RadioComponent';
import SideNavbar from '../customComponents/SIdebar/SideNavbar';
import TableItems from '../customComponents/Tabledata/tableItem';
import { TextareaComponent } from '../customComponents/textarea/TextareaComponent';
import { TimeInputComponent } from '../customComponents/Time/TimeInputComponent';

import { CgCalendarNext } from 'react-icons/cg';
import { FaRegListAlt } from 'react-icons/fa';
import { FaBarsProgress } from 'react-icons/fa6';
import { IoIosSwitch } from 'react-icons/io';
import { LuFormInput } from 'react-icons/lu';
import { MdLabelImportant } from 'react-icons/md';
import { PiRadioButtonDuotone, PiTextColumnsFill } from 'react-icons/pi';
import { RxAvatar } from 'react-icons/rx';
import { TbUserSquare } from 'react-icons/tb';
import { CardComponent } from '../customComponents/Card/CardComponent';
import Checkboxx from '../customComponents/checkbox/Checkbox';

/**
 * Returns a React component that renders an SVG icon for node resizing.
 *
 * @return {React.Component} The SVG icon component.
 */
function ResizeIcon() {
  return <SvgResizeIcon />;
}

/**
 * Renders a custom node for the react flow visualization.
 *
 * @param {Object} props - The props object containing the id, data, isConnectable and selected properties.
 * @param {string} props.id - The id of the node.
 * @param {Object} props.data - The data associated with the node.
 * @param {boolean} props.isConnectable - Indicates whether the node is connectable.
 * @param {boolean} props.selected - Indicates whether the node is selected.
 * @return {React.Component} The custom node component.
 */
export const NavBarNode = memo(({ id, data, isConnectable, selected }) => {
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
                height: 70,
                width: 700,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

  /**
   * Updates the position of a node in the flow based on the mouse event coordinates.
   *
   * @param {Object} e - The mouse event object containing the x and y coordinates.
   * @param {string} id - The ID of the node to be resized.
   * @return {void} This function does not return anything.
   */
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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={700}
        minHeight={70}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={700}
          minHeight={70}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <NavigationBar />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
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
        className="custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * Table component for rendering a table node in React Flow.
 * @param {string} id - The unique identifier for the node.
 * @param {Object} data - The data object for the node.
 * @param {boolean} isConnectable - Whether the node is connectable.
 * @param {boolean} selected - Whether the node is selected.
 * @returns {JSX.Element} The rendered table node.
 */
export const Table = memo(({ id, data, isConnectable, selected }) => {
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
                height: 100,
                width: 200,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '50%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={300}
        minHeight={300}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={300}
          minHeight={300}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <TableItems height={data.height} width={data.width} />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
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
        className="custom-node-handle"
        style={{
          position: 'absolute',
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * Form component for custom node.
 *
 * @param {string} id - The id of the node.
 * @param {object} data - The data of the node.
 * @param {boolean} isConnectable - Whether the node is connectable or not.
 * @param {boolean} selected - Whether the node is selected or not.
 * @returns {JSX.Element} The rendered form component.
 */
export const Form = memo(({ id, data, isConnectable, selected }) => {
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
                height: 150,
                width: 300,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={300}
        minHeight={150}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={300}
          minHeight={150}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <FormComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
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
        className="custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * Sidebarnav component which renders the sidebar navigation.
 *
 * @param {string} id - The id of the node.
 * @param {object} data - The data of the node.
 * @param {boolean} isConnectable - Indicates if the node is connectable.
 * @param {boolean} selected - Indicates if the node is selected.
 * @returns {JSX.Element} The rendered sidebar navigation.
 */
export const Sidebarnav = memo(({ id, data, isConnectable, selected }) => {
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
                height: 150,
                width: 300,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={300}
        minHeight={150}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={300}
          minHeight={150}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <SideNavbar />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
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
        className="custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * Render a button node.
 *
 * @param {string} id - The id of the node.
 * @param {object} data - The data of the node.
 * @param {boolean} isConnectable - Whether the node is connectable.
 * @param {boolean} selected - Whether the node is selected.
 * @returns {JSX.Element} The rendered button node.
 */
export const ButtonNode = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <ButtonComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
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
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * A memoized component representing an input node.
 *
 * @param {string} id - The id of the node.
 * @param {object} data - The data of the node.
 * @param {boolean} isConnectable - Whether the node is connectable.
 * @param {boolean} selected - Whether the node is selected.
 * @returns {JSX.Element} The input node component.
 */
export const InputNode = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <InputComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * Radio group component
 *
 * @param {Object} props - The props for the component
 * @param {string} props.id - The id of the component
 * @param {Object} props.data - The data of the component
 * @param {boolean} props.isConnectable - The connectable status of the component
 * @param {boolean} props.selected - The selected status of the component
 * @returns {JSX.Element} - The rendered component
 */
export const radioGroup = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <RadioComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

export const checkbox = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <Checkboxx />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * Textarea component for custom node.
 *
 * @param {string} id - The id of the node.
 * @param {Object} data - The data of the node.
 * @param {boolean} isConnectable - Whether the node is connectable.
 * @param {boolean} selected - Whether the node is selected.
 * @return {JSX.Element} The textarea component.
 */
export const textarea = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <TextareaComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * React component for time input node.
 *
 * @param {string} id - The id of the node.
 * @param {object} data - The data of the node.
 * @param {boolean} isConnectable - Is the node connectable.
 * @param {boolean} selected - Is the node selected.
 * @returns {JSX.Element} - The time input node.
 */
export const timeinput = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <TimeInputComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

export const card = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <CardComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * dateinput component
 * @param {string} id - id of the node
 * @param {object} data - data of the node
 * @param {boolean} isConnectable - whether the node is connectable
 * @param {boolean} selected - whether the node is selected
 * @returns {JSX.Element} - dateinput component
 */
export const datePicker = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <DateInputComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

export const dropdown = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div>
        <DropdownComponent />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

export const avatar = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2 ">
        <RxAvatar size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const icon = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2  ">
        <TbUserSquare size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const label = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2  ">
        <MdLabelImportant size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const list = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2  ">
        <FaRegListAlt size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const pagination = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2  ">
        <CgCalendarNext size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const pininput = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2  ">
        <LuFormInput size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const progress = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2  ">
        <FaBarsProgress size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const radiobutton = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2  ">
        <PiRadioButtonDuotone size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});
export const switchmode = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2 ">
        <IoIosSwitch size={30} color="gray" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

export const column = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div className="px-2 py-2 ">
        <PiTextColumnsFill size={40} />
        {/* <IoIosSwitch size={30} color="gray" /> */}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'green',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          // transform: "translate(0px,-1px) ",
          position: 'absolute',
          // width: "1px",
          // height: "40%",
          borderRadius: '50%',
          backgroundColor: 'red',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            // width:"100%",
            textAlign: 'center',
            fontSize: '8px',
            color: 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
});

/**
 * Render a TextUpdaterNode component.
 *
 * @param {string} id - The id of the node.
 * @param {object} data - The data of the node.
 * @param {boolean} isConnectable - Whether the node is connectable.
 * @param {boolean} selected - Whether the node is selected.
 * @returns {ReactNode} The rendered TextUpdaterNode component.
 */
export const TextUpdaterNode = memo(({ id, data, isConnectable, selected }) => {
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
                height: 50,
                width: 100,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

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
    <div className="custom-node-img relative" style={{ height: '100%' }}>
      <NodeResizer
        lineStyle={{ border: '1px solid #ff0071' }}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        onResizeEnd={(e, params) => {
          handleReize(params, id);
        }}
      />
      {selected && (
        <NodeResizeControl
          onResizeEnd={(e, params) => {
            handleReize(params, id);
          }}
          style={{
            display: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            background: 'transparent',
            border: 'none',
          }}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" className="nodrag" />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
});
