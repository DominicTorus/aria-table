import React, { useState } from 'react';
import { FaCircleNotch, FaFolderOpen } from 'react-icons/fa6';
import { GoTriangleRight } from 'react-icons/go';
import { IoAdd, IoDocumentTextOutline } from 'react-icons/io5';
import { Md123, MdAbc } from 'react-icons/md';
import { RiArrowRightSFill } from 'react-icons/ri';

const JsonNode = ({
  node,
  type,
  dragkeys,
  drag,
  sourceDraggable,
  targetDraggable,
  path,
  selectedPath,
  nodeKey,
  getPath,
  removePath,
  findSelectedNode,
  attributeInput,
}) => {
  const isString = !node || typeof node !== 'object';
  const [expandedKeys, setExpandedKeys] = useState([]);

  function getParentPath(nodes) {
    const nodepath = localStorage.getItem('nodepath');
    if (getPath) getPath(nodepath, nodes);
  }

  if (isString) {
    return (
      <span
        className="text-600"
        draggable
        onDragStart={
          type === 'source'
            ? () => sourceDraggable()
            : type === 'target'
              ? () => targetDraggable()
              : null
        }
        onDragEnd={(e, i) => {
          if (
            e.dataTransfer.dropEffect === 'copy' &&
            (type === 'source' || type === 'target')
          ) {
            drag(
              nodeKey,
              node[nodeKey],
              type,
              Array.isArray(node) ? `${path}[${nodeKey}]` : `${path}`,
            );
          }
        }}
      ></span>
    );
  }

  return (
    <>
      <ul>
        {Object.entries(node) &&
          Object.entries(node).length > 0 &&
          Object.entries(node).map(([key, value, i]) => {
            return (
              <li key={i}>
                <div
                  style={{ width: 'max-content', minWidth: '100%' }}
                  draggable={type === 'result' && true}
                  onDragEnd={(e) => {
                    if (
                      e.dataTransfer.dropEffect === 'copy' &&
                      (type === 'form' || type === 'source')
                    ) {
                      getParentPath({ [key]: value });
                    }
                  }}
                >
                  {type === 'data' && typeof node[key] === 'object' && (
                    <span className={'star-right'}>
                      <span
                        className="opacity-60"
                        onDragOver={(e) => {
                          e.preventDefault();
                          localStorage.setItem(
                            'nodepath',
                            Array.isArray(node)
                              ? `${path}[${key}]`
                              : path !== ''
                                ? `${path}.${key}`
                                : key,
                          );
                        }}
                      >
                        <IoAdd size={10} />
                      </span>
                    </span>
                  )}
                  {(key === 'source' ||
                    value.type === 'object' ||
                    key === 'target') && (
                    <button
                      className="opacity-50"
                      onClick={() => {
                        setExpandedKeys(
                          expandedKeys.includes(key)
                            ? expandedKeys.filter((k) => {
                                return k !== key;
                              })
                            : [...expandedKeys, key],
                        );
                      }}
                    >
                      {expandedKeys.includes(key) ? (
                        <span>
                          <GoTriangleRight size={10} />
                        </span>
                      ) : (
                        <span>
                          <RiArrowRightSFill size={10} />
                        </span>
                      )}
                    </button>
                  )}
                  {key !== 'type' && type !== 'data' && (
                    <span>
                      {value.type === 'string' ? (
                        <MdAbc />
                      ) : value.type === 'number' ? (
                        <Md123 />
                      ) : value.type === 'null' ? (
                        <FaCircleNotch />
                      ) : key === 'source' || key === 'target' ? (
                        <FaFolderOpen />
                      ) : (
                        <IoDocumentTextOutline />
                      )}
                    </span>
                  )}
                  {typeof value.type === 'object' && type !== 'data' && (
                    <span>
                      <FaFolderOpen />
                    </span>
                  )}
                  <span
                    className={`${dragkeys.length !== 0 && dragkeys.includes(key) ? '' : ''}`}
                    style={{
                      color: `${dragkeys.length !== 0 && dragkeys.includes(key) ? '#1E90FF' : ''}`,
                    }}
                    draggable={type !== 'result' && true}
                    onDragStart={
                      type === 'source'
                        ? () => sourceDraggable()
                        : type === 'target'
                          ? () => targetDraggable()
                          : null
                    }
                    onDragEnd={(e) => {
                      if (
                        e.dataTransfer.dropEffect === 'copy' &&
                        (type === 'source' || type === 'target')
                      ) {
                        drag(
                          key,
                          node[key],
                          type,
                          Array.isArray(node)
                            ? `${path}[${key}]`
                            : path !== ''
                              ? `${path}.${key}`
                              : key,
                        );
                      }
                      if (type === 'ejs') {
                        localStorage.setItem(
                          'nodepath',
                          Array.isArray(node)
                            ? `${path}[${key}]`
                            : path !== ''
                              ? `${path}.${key}`
                              : key,
                        );
                      }
                    }}
                  >
                    {key !== 'type' && key}{' '}
                    {key !== 'type' && type !== 'data' && ':'}
                    {type !== 'data' && (
                      <span
                        style={{
                          color: `${dragkeys.length !== 0 && dragkeys.includes(key) ? '#1E90FF' : '#888888'}`,
                        }}
                        className=""
                      >
                        {Array.isArray(value)
                          ? ' Array'
                          : typeof value === 'object' && value.type
                            ? ` ${value.type}`
                            : (key === 'source' || key === 'target') &&
                              ' Object'}{' '}
                      </span>
                    )}
                  </span>
                  {typeof value === 'object' &&
                    value?.tag !== 'attribute' &&
                    value?.tag !== 'input' &&
                    expandedKeys.includes(key) && (
                      <JsonNode
                        node={value}
                        type={type}
                        drag={drag}
                        selectedPath={selectedPath}
                        sourceDraggable={sourceDraggable}
                        targetDraggable={targetDraggable}
                        nodeKey={key}
                        dragkeys={dragkeys}
                        path={
                          Array.isArray(node)
                            ? `${path}[${key}]`
                            : path !== ''
                              ? `${path}.${key}`
                              : key
                        }
                        removePath={removePath}
                        findSelectedNode={findSelectedNode}
                        attributeInput={attributeInput}
                      />
                    )}
                  {typeof value !== 'object' && (
                    <JsonNode
                      node={value}
                      type={type}
                      drag={drag}
                      selectedPath={selectedPath}
                      sourceDraggable={sourceDraggable}
                      targetDraggable={targetDraggable}
                      nodeKey={key}
                      dragkeys={dragkeys}
                      path={
                        Array.isArray(node)
                          ? `${path}[${key}]`
                          : path !== ''
                            ? `${path}.${key}`
                            : key
                      }
                      removePath={removePath}
                      findSelectedNode={findSelectedNode}
                      attributeInput={attributeInput}
                    />
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default JsonNode;
