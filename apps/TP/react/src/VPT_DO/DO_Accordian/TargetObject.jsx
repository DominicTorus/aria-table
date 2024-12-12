/* eslint-disable */
import React, { useContext, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { TorusModellerContext } from '../../Layout';

export default function TargetObject({ id, item, color, search }) {
  const { selectedSubFlow, selectedTheme } = useContext(TorusModellerContext);
  const items = useMemo(() => {
    try {
      if (!search) return item;
      return item.filter(
        (individualItem) =>
          individualItem?.nodeName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          individualItem?.nodeType.toLowerCase().includes(search.toLowerCase()),
      );
    } catch (error) {
      console.error(error);
    }
  }, [item, search]);
  return (
    <div className="  flex  h-full  flex-col  justify-start gap-2 overflow-y-scroll rounded-bl-md rounded-br-md py-[1.5vh] pl-[0.35vw] pr-[0.85vw]">
      {selectedSubFlow === 'DO' ? (
        ''
      ) : (
        <>
          {items &&
            items?.map((child, childIndex) => (
              <div
                className="relative  flex cursor-grab flex-col overflow-visible  "
                key={childIndex}
              >
                <div
                  className=" flex justify-between rounded-md border-l-3  p-2 text-[0.72vw] leading-[2.22vh]"
                  style={{
                    backgroundColor: `${selectedTheme?.bg}`,
                  }}
                >
                  {console.log(child, 'child')}
                  <span
                    className="text-[0.72vw] font-normal leading-[2.22vh]"
                    style={{
                      color: `${selectedTheme?.['textOpacity/50']}`,
                    }}
                  >
                    {' '}
                    {child.nodeName}{' '}
                  </span>
                  <span
                    className="text-[0.72vw] font-normal leading-[2.22vh]"
                    style={{
                      color: `${selectedTheme?.['textOpacity/50']}`,
                    }}
                  >
                    {child.nodeType}
                  </span>
                </div>
                <div
                  className={`absolute left-[0]  mr-5 h-[100%] w-[2%] rounded-l-md bg-[${color(
                    id + '|' + child?.nodeId,
                  )}] `}
                />
                <Handle
                  isConnectable={true}
                  id={id + '|' + child?.nodeId}
                  position={Position.Left}
                  type="target"
                  style={{
                    left: '-4px',
                    width: '0.5vw',
                    height: '0.5vw',
                    backgroundColor: color(id + '|' + child?.nodeId),
                  }}
                />
              </div>
            ))}
        </>
      )}
    </div>
  );
}
