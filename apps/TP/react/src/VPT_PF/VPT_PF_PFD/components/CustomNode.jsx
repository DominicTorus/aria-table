import { useContext } from 'react';
import { AiOutlineApartment } from 'react-icons/ai';
import { FaRegStopCircle } from 'react-icons/fa';
import { GiHumanPyramid } from 'react-icons/gi';
import { MdOutlineNotStarted } from 'react-icons/md';
import { RiTimerFlashLine } from 'react-icons/ri';
import { Handle, Position } from 'reactflow';
import { SvgApiCustomNode } from '../../../asset/SvgsApplication';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import { TbSettingsAutomation } from 'react-icons/tb';
import { GoDatabase } from 'react-icons/go';
import { IoMdWifi } from 'react-icons/io';

//Custom-Nodes for VPT-PF-PFD

/**
 * Renders a custom node component with a given data object. The component includes a React icon,
 * handles for connecting, and a label. The appearance of the component is determined by the
 * 'data' object, which includes properties for the node color, label, and connectability.
 *
 * @param {Object} props - The properties for the custom node component.
 * @param {Object} props.data - The data object for the custom node.
 * @param {string} props.data.nodeColor - The color of the node.
 * @param {string} props.data.label - The label of the node.
 * @param {boolean} props.isConnectable - Whether the node is connectable.
 * @param {boolean} props.selected - Whether the node is selected.
 * @return {JSX.Element} The custom node component.
 */

export function StartNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div className="custom-node-img">
      <div
        className={`custom-node  `}
        style={{
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          border: `1px solid #addead`,
          borderRadius: '9px',
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
        }}
      >
        <MdOutlineNotStarted color={darkMode ? 'white' : '#5BB974'} size={15} />

        <label
          title={'Start'}
          style={{
            fontSize: '5px',
            color: darkMode ? 'white' : 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          Start
        </label>

        <Handle
          type="source"
          position={Position.Right}
          id="b"
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',

            borderRadius: '50%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
      </div>
    </div>
  );
}
export function ApiNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div
      className={`custom-node   border-1 border-[#212121a9] dark:border-gray-50`}
      style={{
        border: '1px solid' + (data.nodeColor || '#ccc'),
        backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
        height: '45px',
        width: '45px',
        borderRadius: '8px',
      }}
    >
      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: data.label !== '' ? '3px' : '',
          marginBottom: data.label !== '' ? '-5px' : '',
        }}
      >
        <SvgApiCustomNode
          nodeColor={`${darkMode ? 'white' : '#6E2DA8'}`}
          size={15}
        />
      </span>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: data.nodeColor || '#ccc',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="custom-node-handle"
        style={{
          position: 'absolute',

          height: '10px',
          borderRadius: '25%',
          backgroundColor: data.nodeColor || '#ccc',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: darkMode ? 'white' : 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            textAlign: 'center',
            fontSize: '5px',
            color: darkMode ? 'white' : 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
          
        </label>
      </div>
    </div>
  );
}
export function DecisionNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);

  return (
    <div
      className={`custom-node  `}
      style={{
        border: '1px solid' + (data.nodeColor || '#ccc'),
        backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
        height: '45px',
        width: '45px',
        borderRadius: '8px',
      }}
    >
      {
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: data.label !== '' ? '3px' : '',
            marginBottom: data.label !== '' ? '-5px' : '',
          }}
        >
          <AiOutlineApartment
            color={darkMode ? '#007C00' : '#54B8C9'}
            size={15}
          />
        </span>
      }
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="custom-node-handle"
        style={{
          position: 'absolute',
          height: '10px',
          borderRadius: '25%',
          backgroundColor: data.nodeColor || '#ccc',
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: data.nodeColor || '#ccc',
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: data.nodeColor || '#ccc',
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="c"
        className="custom-node-handle"
        style={{
          position: 'absolute',

          borderRadius: '50%',
          backgroundColor: data.nodeColor || '#ccc',
        }}
        isConnectable={isConnectable}
      />
      <div
        style={{
          width: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: darkMode ? 'white' : 'black',
          textAlign: 'center',
        }}
      >
        <label
          title={data.label}
          style={{
            textAlign: 'center',
            fontSize: '5px',
            color: darkMode ? 'white' : 'black',
            fontFamily: 'monospace',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
}
export function HumanTaskNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div className="custom-node-img">
      <div
        className={`custom-node  `}
        style={{
          border: '1px solid' + (data.nodeColor || '#ccc'),
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          borderRadius: '8px',
        }}
      >
        {
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: data.label !== '' ? '3px' : '',
              marginBottom: data.label !== '' ? '-5px' : '',
            }}
          >
            <GiHumanPyramid color={'#003355'} size={15} />
          </span>
        }
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',

            borderRadius: '50%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="custom-node-handle"
          style={{
            position: 'absolute',

            height: '10px',
            borderRadius: '25%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
          isConnectable={isConnectable}
        />
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: darkMode ? 'white' : 'black',
            textAlign: 'center',
          }}
        >
          <label
            title={data.label}
            style={{
              fontSize: '5px',
              color: darkMode ? 'white' : 'black',
              fontFamily: 'monospace',
            }}
            htmlFor=""
          >
            {data.label}
          </label>
        </div>
      </div>
    </div>
  );
}

export function SchedulerNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div className="custom-node-img">
      <div
        className={`custom-node  `}
        style={{
          border: '1px solid' + (data.nodeColor || '#ccc'),
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          borderRadius: '8px',
        }}
      >
        {
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: data.label !== '' ? '3px' : '',
              marginBottom: data.label !== '' ? '-5px' : '',
            }}
          >
            <RiTimerFlashLine color={'#3D43D5'} size={15} />
            {/* <GiHumanPyramid  /> */}
          </span>
        }
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',

            borderRadius: '50%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="custom-node-handle"
          style={{
            position: 'absolute',

            height: '10px',
            borderRadius: '25%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
          isConnectable={isConnectable}
        />
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: darkMode ? 'white' : 'black',
            textAlign: 'center',
          }}
        >
          <label
            title={data.label}
            style={{
              fontSize: '5px',
              color: darkMode ? 'white' : 'black',
              fontFamily: 'monospace',
            }}
            htmlFor=""
          >
            {data.label}
          </label>
        </div>
      </div>
    </div>
  );
}

export function AutomationNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div className="custom-node-img">
      <div
        className={`custom-node  `}
        style={{
          border: '1px solid ' + (data.nodeColor || '#ccc'),
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          borderRadius: '8px',
        }}
      >
        {
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: data.label !== '' ? '3px' : '',
              marginBottom: data.label !== '' ? '-5px' : '',
            }}
          >
            <TbSettingsAutomation   color={'#F58536'} size={17}/>
           
  
          </span>
        }
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',

            borderRadius: '50%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="custom-node-handle"
          style={{
            position: 'absolute',

            height: '10px',
            borderRadius: '25%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
          isConnectable={isConnectable}
        />
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: darkMode ? 'white' : 'black',
            textAlign: 'center',
          }}
        >
          <label
            title={data.label}
            style={{
              fontSize: '5px',
              color: darkMode ? 'white' : 'black',
              fontFamily: 'monospace',
            }}
            htmlFor=""
          >
            {data.label}
          </label>
        </div>
      </div>
    </div>
  );
}

export function EndNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);

  return (
    <div className="custom-node-img">
      <div
        className={`custom-node  `}
        style={{
          border: `1px solid #FFA09A`,
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          borderRadius: '9px',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',

        }}
      >
        {
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: data.label !== '' ? '3px' : '',
              marginBottom: data.label !== '' ? '-5px' : '',
            }}
          >
            <FaRegStopCircle color={darkMode ? 'white' : '#EB6D4A'} size={15} />
          </span>
        }
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',
            height: '10px',
            borderRadius: '25%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
        <div
          style={{
            fontSize: '5px',
            color: darkMode ? 'white' : 'black',
            fontFamily: 'monospace',
            marginTop: '10px',
          }}
        >
          <label title="End" htmlFor="text">
            End
          </label>
        </div>
      </div>
    </div>
  );
}

export function DBNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div className="custom-node-img">
      <div
        className={`custom-node   `}
        style={{
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          border: `1px solid #f5b041`,
          borderRadius: '10px',
        }}
      >
        <GoDatabase color={darkMode ? 'white' : '#f5b041'} size={15} />

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',

            borderRadius: '50%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="custom-node-handle"
          style={{
            position: 'absolute',

            height: '10px',
            borderRadius: '25%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
          isConnectable={isConnectable}
        />

        <label
          className="py-[2px]"
          title={'Start'}
          style={{
            fontSize: '6px',
            color: darkMode ? 'white' : 'black',
            fontFamily: 'monospace',
            textOverflow: 'ellipsis',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
}
export function StreamNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div className="custom-node-img">
      <div
        className={`custom-node   `}
        style={{
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          border: `1px solid #5E6AD2`,
          borderRadius: '10px',
        }}
      >
        <IoMdWifi color={darkMode ? 'white' : '#5E6AD2'} size={15} />

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',

            borderRadius: '50%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="custom-node-handle"
          style={{
            position: 'absolute',
            height: '10px',
            borderRadius: '25%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
          isConnectable={isConnectable}
        />

        <label
          className="py-[2px]"
          title={'Start'}
          style={{
            fontSize: '6px',
            color: darkMode ? 'white' : 'black',
            fontFamily: 'monospace',
            textOverflow: 'ellipsis',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
}

export function FileNode({ data, isConnectable, selected }) {
  const { darkMode } = useContext(DarkmodeContext);
  return (
    <div className="custom-node-img">
      <div
        className={`custom-node   `}
        style={{
          backgroundColor: !darkMode ? '#FFFFFF' : 'transparent',
          height: '45px',
          width: '45px',
          border: `1px solid #e59866`,
          borderRadius: '10px',
        }}
      >
        <IoMdWifi color={darkMode ? 'white' : '#e59866'} size={15} />

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="custom-node-handle"
          style={{
            position: 'absolute',

            borderRadius: '50%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          className="custom-node-handle"
          style={{
            position: 'absolute',
            height: '10px',
            borderRadius: '25%',
            backgroundColor: data.nodeColor || '#ccc',
          }}
          isConnectable={isConnectable}
        />

        <label
          className="py-[2px]"
          title={'Start'}
          style={{
            fontSize: '6px',
            color: darkMode ? 'white' : 'black',
            fontFamily: 'monospace',
            textOverflow: 'ellipsis',
          }}
          htmlFor=""
        >
          {data.label}
        </label>
      </div>
    </div>
  );
}