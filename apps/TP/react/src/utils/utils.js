import _ from 'lodash';
import { Bounce, toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import light from '../asset/themes/daylight.json';
import eclipse from '../asset/themes/eclipse.json';
import dark from '../asset/themes/midnight.json';
import sunrise from '../asset/themes/sunrise.json';
import TorusToast from '../torusComponents/TorusToaster/TorusToast';
export const merger = (defalut, newclass) => twMerge(defalut, newclass);

export function calculatePositionX(referenceX) {
  return (window.innerWidth / 1366) * referenceX;
}

export function calculatePositionY(referenceY) {
  console.log((window.innerHeight / 633) * referenceY);
  return (window.innerHeight / 633) * referenceY;
}
export function handlNestedObj(
  operation,
  editedValue,
  editingKey,
  labels,
  labelsValue,
  obj,
  filterKey = ['code', 'rule', 'events', 'mapper', 'action'],
) {
  let EditedValue = editedValue;
  let EditingKey = editingKey;

  let Labels = _.cloneDeep(labels);
  let LabelsValue = _.cloneDeep(labelsValue);
  let Obj = _.cloneDeep(obj);

  let path = '';
  const findObjPath = (obj, p) => {
    let Obj = _.cloneDeep(obj);

    if (Array.isArray(Obj)) {
      for (let i = 0; i < Obj.length; i++) {
        if (
          !_.isEmpty(Obj[i]) &&
          typeof Obj[i] === 'object' &&
          !Array.isArray(Obj[i])
        ) {
          let keys = Object.keys(Obj[i]).filter(
            (k) => k !== editingKey && !filterKey.includes(k),
          );
          for (let j = 0; j < keys.length; j++) {
            if (
              _.isEqual(Obj[i]?.[keys[j]], LabelsValue[0]) &&
              _.isEqual(keys[j], Labels[0])
            ) {
              Labels.shift();
              LabelsValue.shift();
              if (!path && _.isEmpty(Labels) && _.isEmpty(LabelsValue)) {
                let finalPath = p.split('.');
                finalPath.shift();
                path = finalPath.join('.') + '.' + i;
              }
            }
            if (
              !_.isEmpty(Obj[i]?.[keys[j]]) &&
              typeof Obj[i]?.[keys[j]] === 'object'
            ) {
              if (!path)
                findObjPath(Obj[i]?.[keys[j]], p + '.' + i + '.' + keys[j]);
            }
          }
        }
      }
    }
    if (!_.isEmpty(Obj) && typeof Obj === 'object' && !Array.isArray(Obj)) {
      let keys = Object.keys(Obj).filter(
        (k) => k !== editingKey && !filterKey.includes(k),
      );
      for (let i = 0; i < keys.length; i++) {
        if (
          _.isEqual(Obj?.[keys[i]], LabelsValue[0]) &&
          _.isEqual(keys[i], Labels[0])
        ) {
          Labels.shift();
          LabelsValue.shift();
          if (!path && _.isEmpty(Labels) && _.isEmpty(LabelsValue)) {
            let finalPath = p.split('.');
            finalPath.shift();
            path = finalPath.join('.');
          }
        }
        if (!_.isEmpty(Obj[keys[i]]) && typeof Obj[keys[i]] === 'object') {
          if (!path) findObjPath(Obj[keys[i]], p + '.' + keys[i]);
        }
      }
    }
  };

  findObjPath(Obj, '');

  let resultObj;

  if (operation === 'set') {
    resultObj = _.update(Obj, path, (e) => {
      if (Array.isArray(e)) {
        e.push(EditedValue);
      }
      if (typeof e === 'object' && e !== null) {
        e[EditingKey] = EditedValue;
      }

      return e;
    });
  }
  if (operation === 'get') {
    resultObj = _.get(Obj, path + '.' + EditingKey);
  }

  if (operation === 'delete') {
    resultObj = _.update(Obj, path, (e) => {
      if (Array.isArray(e)) {
        e.splice(EditingKey, 1);
      }
      if (typeof e === 'object' && e !== null) {
        delete e[EditingKey];
      }

      return e;
    });
  }
  return resultObj;
}

export function findDiffAndChangeDiffInObject(
  newObject,
  oldObject,
  toLookupKeys,
  validationKeys,
  replaceNewWithOld = false,
) {
  try {
    let result = _.cloneDeep(newObject);
    let newO = _.cloneDeep(newObject);
    let oldO = _.cloneDeep(oldObject);
    const finalPaths = [];
    const findBy = (obj, p, whatToFind, byValue = undefined) => {
      let path = '';
      if (!_.isEmpty(obj) && typeof obj === 'object') {
        Object.keys(obj)
          .filter((key) => !toLookupKeys.includes(key))
          .forEach((innerkey) => {
            const p1 = p !== '' ? p + '.' + innerkey : innerkey;
            if (byValue !== undefined) {
              if (innerkey === byValue)
                if (_.isEqual(obj[innerkey], whatToFind)) {
                  path = p;
                }
            } else if (innerkey === whatToFind) {
              const oldPath = findBy(oldO, '', obj[innerkey], innerkey);
              if (!_.isEmpty(oldPath) && typeof oldPath === 'string') {
                if (
                  finalPaths.findIndex(
                    (f) => f.newPath === p && f.oldPath === oldPath,
                  ) === -1
                )
                  finalPaths.push({
                    newPath: p,
                    oldPath: oldPath,
                  });
              }
            }
            if (
              typeof obj[innerkey] === 'object' &&
              !_.isEmpty(obj[innerkey])
            ) {
              const found = findBy(obj[innerkey], p1, whatToFind, byValue);
              if (!_.isEmpty(found)) path = found;
            }
          });
      }

      return path;
    };

    if (_.isEmpty(oldO)) return result;

    validationKeys.forEach((key) => {
      if (Array.isArray(key)) {
        key.forEach((k) => {
          findBy(newO, '', k);
        });
      }
      if (typeof key === 'string') {
        findBy(newO, '', key);
      }
    });

    finalPaths.forEach((path) => {
      toLookupKeys.forEach((key) => {
        const oldValue = _.get(oldO, path.oldPath + '.' + key);
        const newValue = _.get(newO, path.newPath + '.' + key);
        if (replaceNewWithOld) {
          if (!_.isEmpty(oldValue))
            _.set(result, path.newPath + '.' + key, oldValue);
        } else {
          if (!_.isEmpty(newValue)) {
            if (!_.isEqual(oldValue, newValue)) {
              _.set(result, path.newPath + '.' + key, newValue);
            }
          } else {
            _.set(result, path.newPath + '.' + key, oldValue);
          }
        }
      });
    });

    return result;
  } catch (error) {
    console.error(error);
  }
}

export const flatenGrps = (chec, selectedTkey, selectedCatelogue) => {
  const takesData = chec[selectedTkey];
  console.log(takesData);

  if (!Array.isArray(takesData) || takesData.length === 0) {
    return { catalogue: [], artifactGroup: [] };
  }

  const result = takesData.reduce(
    (acc, element) => {
      acc.catalogue.push(element.catalog);

      if (
        selectedCatelogue &&
        element.catalog === selectedCatelogue &&
        Array.isArray(element.artifactGroupList)
      ) {
        acc.artifactGroup.push(...element.artifactGroupList.flat());
      }

      return acc;
    },
    { catalogue: [], artifactGroup: [] },
  );

  if (selectedCatelogue && !result.catalogue.includes(selectedCatelogue)) {
    return { catalogue: result.catalogue, artifactGroup: [] };
  }

  return result;
};

export const updateToast = (toastId, type, message) => {
  if (toastId) {
    toast.update(toastId, {
      type,
      title: type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'info' ? 'Info' : '',
      text: message,
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      delay: 500,
      transition: Bounce,
    });
  }
};

export const pendingToast = (message) => {
  return toast(<TorusToast />, {
    type: 'pending',
    position: 'bottom-right',
    autoClose: false, // Pending toast should not auto-close
    hideProgressBar: true,
    closeButton: false,
    title: 'Please wait',
    text: message,
    transition: Bounce,
  });
};

export const getTheme = (theme) => {
  switch (theme) {
    case 'midnight':
      return dark;
    case 'sunrise':
      return sunrise;
    case 'eclipse':
      return eclipse;
    default:
      return light;
  }
};
