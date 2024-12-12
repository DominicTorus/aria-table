import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useComponent } from '../contexts/Componet';
import ComponetPreview from './ComponetPreview';
import { defaultProps } from '../utils/defaultProps';
import { getCrkNodeData } from '../../../commonComponents/api/fabricsApi';
import _ from 'lodash';
export default function WithChildren({
  componentId,
  componentType,
  onNodeContextMenu,
}) {
  const component = useComponent();
  const { id, grid, children, groupType, data } =
    component.state?.[componentId];
  const [isDragging, setIsDragging] = React.useState(false);
  const onDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let newType = event.dataTransfer.getData('application/key');

    if (component.state?.[newType]) {
      const { type } = component.state?.[newType];
      if (type === 'group') {
        alert('you can not put a component inside a  component');

        setIsDragging(false);
        return;
      }
      component.AddToComponet(component.state?.[newType], id);
    } else {
      if (newType === 'group') {
        alert('you can not put a component inside a  component');
        setIsDragging(false);
        return;
      }
      let nodeProperty = {};
      if (newType.includes(':')) {
        if (newType.split(':')[5].toLowerCase() === 'group') {
          alert('you can not put a component inside a  component');

          setIsDragging(false);
          return;
        }
        await getCrkNodeData(newType)
          .then((res) => {
            if (res && res?.data && res?.data?.nodeProperty) {
              let prop = Object.values(res?.data?.nodeProperty)[0];
              console.log('🚀 ~ .then ~ prop:', prop);
              if (!prop) return;
              let key = Object.keys(prop).filter(
                (key) =>
                  key !== 'nodeId' &&
                  key !== 'nodeName' &&
                  key !== 'nodeType' &&
                  key !== 'mode',
              );

              key.forEach((k) => {
                nodeProperty[k] = prop[k];
              });
            }
          })

          .catch((error) => {
            console.error(error);
          });
        newType = newType.split(':')[5].toLowerCase();
      }
      console.log('s$', newType);
      const newComponent = {
        id: uuidv4(),
        type: newType,
        grid: defaultProps[newType] || defaultProps?.defaults,
        data: {
          label: '',
          nodeProperty: nodeProperty,
        },
        property: {
          name: '',
          nodeType: newType,
          description: '',
        },
        children: [],

        parent: '',
      };
      component.AddToComponet(newComponent, id);
    }

    setIsDragging(false);
  };

  const onDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragStart = (event) => {
    event.stopPropagation();
    event.dataTransfer.setData('application/key', id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const currentChildren = useMemo(() => {
    return (
      <>
        {children.map((child) => {
          return (
            <ComponetPreview
              key={id + child}
              componentId={child}
              onNodeContextMenu={onNodeContextMenu}
            />
          );
        })}
        <div className="absolute bottom-0 h-[2.5vh]  right-0 top-0 w-[3.5vw] truncate  p-1 text-[0.72vw] italic">
          {data.label || groupType}
        </div>
      </>
    );
  }, [children, data.label, groupType]);
  const onDragLeave = () => {
    setIsDragging(false);
  };
  return React.createElement(
    componentType,
    {
      grid: grid,
      onDrop,
      onDragOver,
      onDragStart,
      onDragLeave,
      draggable: true,
      onContextMenu: (e) =>
        onNodeContextMenu(e, component.state?.[componentId]),
      className: ` ${
        component.selectedComponent === id
          ? 'outline outline-1 outline-red-300'
          : ''
      }  ${isDragging ? 'bg-green-50 ' : ' '}`,
    },
    currentChildren,
  );
}
