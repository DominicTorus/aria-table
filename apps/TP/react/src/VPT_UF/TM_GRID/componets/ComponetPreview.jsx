import React, { memo, useMemo } from 'react';
import WithChildren from './WithChildren';
import WithOutChildren from './WithOutChildren';
import * as ComponentList from '../resources/ComponetList';
import { useComponent } from '../contexts/Componet';
import _ from 'lodash';

function ComponetPreview({ componentId, onNodeContextMenu }) {
  const component = useComponent();

  const { type } = component.state?.[componentId];
  const capType = useMemo(() => _.capitalize(type), [type]);

  switch (capType) {
    case 'root':
    case 'Group':
      return (
        <WithChildren
          componentId={componentId}
          componentType={ComponentList[capType]}
          onNodeContextMenu={onNodeContextMenu}
        />
      );

    default:
      return (
        <WithOutChildren
          componentId={componentId}
          componentType={
            typeof ComponentList?.[capType] === 'function'
              ? ComponentList[capType]
              : ComponentList.DefaultComponent
          }
          onNodeContextMenu={onNodeContextMenu}
        />
      );
  }
}

export default memo(ComponetPreview);
