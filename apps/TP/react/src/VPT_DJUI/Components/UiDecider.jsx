import React, { memo, useEffect, useState } from 'react';
import DisplayArray from './cardUi/DisplayArray';
import DisplayObject from './cardUi/DisplayObject';
import Tableui from './tableUi/tableui';
import TabComponent from './tabUi/TabComponent';
import TreeView from './treeUi/TreeView';

const UiDecider = memo(
  ({
    uiPolicy,
    depth,
    json,
    isAdmin,
    keyJson,
    totalOptions,
    totalColors,

    level,
    path,
    title,
    children,
    type,
  }) => {
    const [toggl, setToggl] = useState(true);
    const [jsons, setJsons] = useState(null);

    useEffect(() => {
      setJsons(json);
    }, [json]);

    if (uiPolicy && jsons) {
      const currentLevel = `Level${[level]}`;
      if (uiPolicy[currentLevel] === 'tab') {
        return (
          <TabComponent
            keyJson={keyJson}
            json={jsons}
            path={path}
            isAdmin={isAdmin}
            depth={depth}
            totalOptions={totalOptions}
            totalColors={totalColors}
            uiPolicys={uiPolicy}
            level={level + 1}
            title={title}
            children={children}
            type={type}
          />
        );
      }
      if (uiPolicy[currentLevel] === 'tree') {
        return (
          <TreeView
            keyJson={keyJson}
            uiPolicy={uiPolicy}
            isAdmin={isAdmin}
            json={jsons}
            iterator={Number(1)}
            to={toggl}
            setToggle={setToggl}
            totalOptions={totalOptions.length > 0 && totalOptions}
            depth={depth}
            totalColors={totalColors.length > 0 && totalColors}
            level={level + 1}
            dp={0}
            title={title}
            children={children}
            path={path}
            type={type}
          />
        );
      }
      if (uiPolicy[currentLevel] === 'card') {
        if (typeof jsons === 'object' && !Array.isArray(jsons)) {
          return (
            <DisplayObject
              keyJson={keyJson}
              uiPolicy={uiPolicy}
              title={title}
              isAdmin={isAdmin}
              json={jsons}
              depth={depth}
              totalOptions={totalOptions.length > 0 && totalOptions}
              totalColors={totalColors.length > 0 && totalColors}
              parentType={'array'}
              level={level + 1}
              children={children}
              path={path}
              type={type}
            />
          );
        } else if (Array.isArray(jsons)) {
          return (
            <DisplayArray
              keyJson={keyJson}
              uiPolicy={uiPolicy}
              title={title}
              data={Object.keys(jsons) && jsons}
              path={path}
              depth={depth}
              totalOptions={totalOptions.length > 0 && totalOptions}
              isAdmin={isAdmin}
              totalColors={totalColors.length > 0 && totalColors}
              level={level + 1}
              children={children}
              types={type}
            />
          );
        }
      }
      if (uiPolicy[currentLevel] === 'table') {
        return (
          <div className="flex h-full w-full flex-col items-center">
            <Tableui
              keyJson={keyJson}
              path={path}
              ArrayJson={jsons}
              isAdmin={isAdmin}
              depth={depth}
              totalOptions={totalOptions}
              totalColors={totalColors}
              uiPolicys={uiPolicy}
              level={level + 1}
              title={title}
              children={children}
              currentLevel={currentLevel}
              type={type}
            />
          </div>
        );
      }
    }
  },
);

export default UiDecider;
