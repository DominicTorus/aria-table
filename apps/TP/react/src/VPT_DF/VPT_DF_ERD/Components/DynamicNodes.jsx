import React, { useContext, useMemo, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

import { Input } from 'react-aria-components';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';
import { TorusModellerContext } from '../../../Layout';

export function CustomTableNode({ data, id }) {
  const { uniqueNames } = useContext(TorusModellerContext);

  const [editingHeader, setEditingHeader] = useState(false);
  const [editedHeader, setEditedHeader] = useState('');
  const [showError, setShowError] = useState(false);
  const { darkMode } = useContext(DarkmodeContext);
  const { setNodes } = useReactFlow();

  //UseEffect for editing header

  const datas = useMemo(() => {
    return data?.nodeProperty?.entities || [];
  }, [data, id]);
  // Position Styles for Handles
  const positionStyles = {
    [Position.Left]: {
      left: '-13px',
      top: '51%',
      transform: 'translateY(-50%)',
    },
    [Position.Right]: {
      right: '-16px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    [Position.Top]: {
      top: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    [Position.Bottom]: {
      bottom: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  };

  /**
   * Handles the change event for the header input field.
   *
   * @param {Event} e - The event object containing information about the change event.
   * @return {void} This function does not return anything.
   */
  const handleHeaderChange = (e) => {
    try {
      if (
        uniqueNames.includes(e.target.value) &&
        e.target.value !== data.label
      ) {
        setShowError(true);
        e.target.value = '';
        return;
      } else {
        showError && setShowError(false);
        setEditedHeader(e.target.value);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles the blur event for the header input field.
   *
   * @param {Event} e - The event object containing information about the blur event.
   * @return {void} This function does not return anything.
   */
  const handleHeaderBlur = (e) => {
    try {
      if (editedHeader === '') {
        return;
      }
      setShowError(false);
      setEditingHeader(false);
      setNodes((nds) => {
        return nds?.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: editedHeader,
              },
              property: {
                ...node.property,
                name: editedHeader,
              },
            };
          }
          return node;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles the header click event.
   *
   * @return {void} This function does not return anything.
   */
  const handleHeaderClick = () => {
    setEditingHeader(true);
  };

  /**
   * Renders a table with a header and body.
   *
   * @return {JSX.Element} The rendered table component.
   */
  return (
    <table
      removeWrapper
      topContentPlacement="top"
      className="w-[100px] rounded bg-[#F4F5FA] ring-1 ring-[#000000]/20 dark:bg-[#161616]"
    >
      <th className="relative ">
        <tr
          onClick={handleHeaderClick}
          className="flex h-[15px] w-full items-center justify-center bg-[#F4F5FA] text-white dark:bg-[#161616] "
        >
          {editingHeader ? (
            <div className="labeless">
              <Input
                className="flex h-full w-[100px] items-center justify-center truncate bg-[#F4F5FA] text-center text-[0.45vw] font-semibold text-gray-600"
                aria-describedby="username-help"
                defaultValue={data.label}
                value={editedHeader}
                onChange={handleHeaderChange}
                onBlur={handleHeaderBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleHeaderBlur(e);
                  }
                }}
                autoFocus
              />
              {/* <InputText /> */}
              {showError && (
                <small id="username-help">Table name already exists</small>
              )}
            </div>
          ) : (
            <div className="label">
              <Handle
                id={`header-${id}-left`}
                type="target"
                position={Position.Left}
                style={{
                  width: '7px',
                  height: '8px',
                  backgroundColor: darkMode ? '#212121' : '  #b2babb ',
                  cursor: 'crosshair',
                  border: '1px solid ',
                  borderColor: darkMode ? '#ccc' : '#FFFFFF',
                  marginLeft: '8.5px',
                  borderRadius: '0px',
                  ...positionStyles[Position.Left],
                }}
              />
              {
                <p className="w-[100px] truncate text-center  text-[0.45vw] font-semibold  text-[#0f0f0f] dark:text-white">
                  {data.label || 'click to give entity name'}
                </p>
              }

              <Handle
                id={`header-${id}-right`}
                type="source"
                position={Position.Right}
                style={{
                  width: '7px',
                  height: '7px',
                  backgroundColor: darkMode ? '#212121' : '  #b2babb ',
                  cursor: 'crosshair',
                  border: '1px solid ',
                  borderColor: darkMode ? '#ccc' : '#FFFFFF',
                  marginRight: '12px',
                  ...positionStyles[Position.Right],
                }}
              />
            </div>
          )}
        </tr>
      </th>
      <tbody className="w-full">
        {datas &&
          Object.keys(datas).length > 0 &&
          datas?.attributes &&
          Object.keys(datas?.attributes).length > 0 &&
          Object.keys(datas?.attributes).map(
            (key, index) =>
              datas?.attributes[key].cname !== '' && (
                <td
                  key={index}
                  className="transition-ease-in-out flex h-[10px] flex-col justify-center border-t border-[#000000]/10 bg-white
p-[8px]  text-[0.72vw]  last:rounded-b   hover:bg-[#f4f5fa] 
                   dark:bg-[#0f0f0f]  dark:text-black"
                >
                  <tr className="relative ">
                    <Handle
                      type="target"
                      id={`${index}-right`}
                      position={Position.Left}
                      style={{
                        position: 'absolute',
                        left: '-11.5px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: darkMode ? '#FFFFFF' : '#ccc',
                        cursor: 'crosshair',
                        border: '1px solid ',
                        borderColor: darkMode ? '#212121' : '#99a3a4 ',
                        marginRight: '10px',
                      }}
                    />

                    {
                      <p className="text-start text-[0.42vw] text-black dark:text-white ">
                        {datas?.attributes[key].cname ||
                          'click to give entity name'}
                      </p>
                    }

                    <Handle
                      type="source"
                      id={`${index}-left`}
                      position={Position.Right}
                      style={{
                        position: 'absolute',
                        right: '-21px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: darkMode ? '#FFFFFF' : '#ccc',
                        cursor: 'crosshair',
                        border: '1px solid ',
                        borderColor: darkMode ? '#212121' : '#99a3a4 ',
                        marginRight: '10px',
                      }}
                    />
                  </tr>
                </td>
              ),
          )}
      </tbody>
    </table>
  );
}
