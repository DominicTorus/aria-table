export function gettingValues(value) {
  try {
    let components = [];
    let controls = [];
    var result = [];

    let sample = {
      component: {
        nodeId: 'canvas',
        nodeName: 'Canvas',
        nodeType: 'group',
      },
      controls: [
        {
          nodeId: 'canvas',
          nodeName: 'Canvas',
          nodeType: 'group',
          events: [
            {
              name: 'onLoad',
              type: 'Group',
              enabled: 'true',
            },
          ],
        },
      ],
    };

    let hasID = new Set();
    // Separate components and controls
    value.forEach((item) => {
      if (item.type === 'group') {
        components.push(item);
      } else {
        controls.push(item);
      }
    });

    // Create response object
    components.forEach((parent) => {
      hasID.add(parent.id);
      let singleEntity = {
        component: {
          nodeId: parent.id,
          nodeName: parent.data.label || parent.type,
          nodeType: parent.type,
          Pevents: parent?.data?.nodeProperty?.elementInfo?.events ?? [
            {
              name: 'onLoad',
              type: 'Group',
              enabled: 'true',
            },
          ],
        },
        controls: [
          {
            nodeId: parent.id,
            nodeName: parent.data.label || parent.type,
            nodeType: parent.type,
            events: parent?.data?.nodeProperty?.elementInfo?.events ?? [
              {
                name: 'onLoad',
                type: 'Group',
                enabled: 'true',
              },
            ],
          },
        ],
      };

      controls.forEach((child) => {
        if (child.parentNode) {
          if (parent.id === child.parentNode) {
            if (!hasID.has(child.id)) {
              hasID.add(child.id);
              singleEntity.controls.push({
                nodeId: child.id,
                nodeName: child.data.label || child.type,
                nodeType: child.type,
                events: child?.data?.nodeProperty?.elementInfo?.events ?? [
                  {
                    name: 'onLoad',
                    type: 'Group',
                    enabled: 'true',
                  },
                ],
              });
            }
          }
        } else if (!child.parentNode) {
          if (!hasID.has(child.id)) {
            hasID.add(child.id);
            let customNodeId = `${child.width}E${2 + 1}${child.layoutFlag}-${child.position.x * 4}-${child.position.y * 6}-${143 * 120 + 143}-${child.data.label}${child.dragging}`;
            sample.component.nodeId = customNodeId;
            sample.controls.push({
              nodeId: child.id,
              nodeName: child.data.label || child.type,
              nodeType: child.type,
              events: child?.data?.nodeProperty?.elementInfo?.events ?? [
                {
                  name: 'onLoad',
                  type: 'Group',
                  enabled: 'true',
                },
              ],
            });
          }
        }
      });

      result.push(singleEntity);
    });

    if (!result.includes(sample)) {
      result.push(sample);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
}

export function transformNodesToProps(nodes, id = [], parentID = '') {
  try {
    var ids = [...id];
    function transformGroupToEvents(nodes, parentID = '') {
      const data = [];
      nodes &&
        nodes.map((node) => {
          if (!parentID && node.type === 'group' && !ids.includes(node.id)) {
            ids.push(node.id);
            data.push({
              nodeId: node.id,
              nodeName: node.data.label,
              nodeType: node.type,
              elementInfo: node?.data?.nodeProperty?.elementInfo ?? {
                event: [
                  {
                    name: 'onLoad',
                    type: 'Group',
                    enabled: 'true',
                  },
                ],
              },
              children: [...transformGroupToEvents(nodes, node.id)],
            });
          }
          if (
            parentID &&
            ids.length > 0 &&
            node.hasOwnProperty('parentNode') &&
            parentID === node.parentNode &&
            !ids.includes(node.id)
          ) {
            ids.push(node.id);
            data.push({
              nodeId: node.id,
              nodeName: node.data.label,
              nodeType: node.type,
              elementInfo: node?.data?.nodeProperty?.elementInfo ?? {
                event: [
                  {
                    name: 'onLoad',
                    type: 'Group',
                    enabled: 'true',
                  },
                ],
              },
            });
          }

          return node;
        });

      return data;
    }

    const data = transformGroupToEvents(nodes, parentID);
    if (ids.length < nodes.length) {
      nodes &&
        nodes.map((node) => {
          if (!ids.includes(node.id)) {
            ids.push(node.id);
            data.push({
              nodeId: node.id,
              nodeName: node.data.label,
              nodeType: node.type,
              elementInfo: node?.data?.nodeProperty?.elementInfo ?? {
                event: [
                  {
                    name: 'onLoad',
                    type: 'Group',
                    enabled: 'true',
                  },
                ],
              },
            });
          }
          return node;
        });
    }
    data.push({
      nodeId: 'canvas',
      nodeName: 'canvas',
      nodeType: 'canvas',
      elementInfo: {
        event: [
          {
            name: 'onLoad',
            type: 'Group',
            enabled: 'true',
          },
        ],
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}
