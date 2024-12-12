import React, { forwardRef, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useComponent } from '../contexts/Componet';
import { defaultProps } from '../utils/defaultProps';
import ComponetPreview from './ComponetPreview';
import { getCrkNodeData } from '../../../commonComponents/api/fabricsApi';
import _ from 'lodash';
import { TorusModellerContext } from '../../../Layout';
export default forwardRef(function Editor(
  { onNodeContextMenu, onPaneClick, children },
  ref,
) {
  const component = useComponent();
  const {selectedTheme} = useContext(TorusModellerContext);
  console.log(Object.values(component.state), 'componet');
  const [isDragging, setIsDragging] = React.useState(false);
  const onDrop = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    let type = event.dataTransfer.getData('application/key');

    if (component.state?.[type]) {
      component.AddToComponet(component.state?.[type], 'root');
    } else {
      let nodeProperty = {};
      if (type.includes(':')) {
        await getCrkNodeData(type)
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
              console.log('🚀 ~ .then ~ prop:', key);
              key.forEach((k) => {
                nodeProperty[k] = prop[k];
              });
            }
          })

          .catch((error) => {
            console.error(error);
          });
        type = type.split(':')[5].toLowerCase();
      }
      const newComponent = {
        id: uuidv4(),
        type: type,
        grid: defaultProps[type] || defaultProps?.defaults || {},
        data: {
          label: '',
          nodeProperty: nodeProperty,
        },
        property: {
          name: '',
          nodeType: type,
          description: '',
        },
        children: [],
        parent: '',
      };
      component.AddToComponet(newComponent, 'root');
    }

    setIsDragging(false);
  };

  return (
    <div
      ref={ref}
      onDrop={onDrop}
      onDragOver={(event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsDragging(true);
      }}
      onContextMenu={(e) => onNodeContextMenu(e, component.state.root)}
      onDragLeave={() => setIsDragging(false)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onPaneClick && onPaneClick();
      }}
      className={`grid  h-full w-full grid-cols-12  overflow-auto rounded-md bg-transparent border border-dashed border-slate-400/20   ${
        isDragging ? 'bg-sky-100' : 'bg-gray-100'
      }`}
      style={component.state.root.grid?.style}
    >
      {component.state.root.children.map((child) => (
        <ComponetPreview
          key={child}
          componentId={child}
          onNodeContextMenu={onNodeContextMenu}
        />
      ))}
      {children && children}
    </div>
  );
});
