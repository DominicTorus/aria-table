/* eslint-disable */
import { clsx } from 'clsx';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const functionality = (json, func, path, value = null) => {
  try {
    if (path !== '') {
      let result;

      result = path.split('.');
      result.shift();
      result = result.join('.');

      if (func == 'add') {
        let js = json;
        const upjs = _.set(js, result + '.' + value.key, value.values);
        return upjs;
      }
      if (func == 'edit') {
        let path = _.toPath(result);
        let lastKey = path[path.length - 1];
        path.pop();
        let jsr = json;

        if (path.length > 0) {
          let js = _.get(jsr, path.join('.'));
          let gs;
          Object.keys(js) &&
            Object.keys(js)?.map((key) => {
              if (key == lastKey) {
                gs = { ...gs, [value]: js[key] };
              } else {
                gs = { ...gs, [key]: js[key] };
              }
            });
          _.set(jsr, path.join('.'), gs);
          return jsr;
        } else {
          let gss;
          Object.keys(jsr) &&
            Object.keys(jsr).map((key) => {
              if (key == lastKey) {
                gss = { ...gss, [value]: jsr[key] };
              } else {
                gss = { ...gss, [key]: jsr[key] };
              }
            });
          return gss;
        }
      }
      if (func == 'update') {
        if (value) {
          const js = json;

          _.update(js, result, (n) => {
            n = value.value;

            return n;
          });
          return js;
        }
      }
      if (func == 'delete') {
        let js = json;

        let path = _.toPath(result);

        for (let i = 0; i < path.length - 1; i++) {
          js = js[path[i]];
        }
        const indexToDelete = path[path.length - 1];
        const lastKey = path[path.length - 1];
        if (Array.isArray(js)) {
          js.splice(indexToDelete, 1);
        } else if (typeof js === 'object') {
          delete js[lastKey];
        }
        path.pop();
        const upjs = _.set(json, path, js);
        return upjs;
      }
    } else {
      let js = json;
      if (func == 'add') {
        if (typeof js === 'object' && !Array.isArray(js)) {
          js = {
            ...js,
            [value.key]: value.values,
          };
        } else {
          js = [...js, value.values];
        }
        return js;
      }
      if (func == 'edit') {
        let gs;
        Object.keys(js) &&
          Object.keys(js).map((key) => {
            if (key == value) {
              gs = { ...gs, [value]: js[key] };
            } else {
              gs = { ...gs, [key]: js[key] };
            }
            return gs;
          });
      }
      if (func == 'update') {
        Object.keys(js) &&
          Object.keys(js).map((key) => {
            if (key == value.key) {
              return (js[key] = value.value);
            }
            return js[key];
          });
        return js;
      }
      if (func == 'delete') {
        js = {};
        return js;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export function checkForNull(jsonData) {
  try {
    if (typeof jsonData === 'object' && jsonData !== null) {
      if (Array.isArray(jsonData)) {
        jsonData.forEach((item) => checkForNull(item));
      } else {
        Object.values(jsonData).forEach((value) => checkForNull(value));
      }
    } else if (jsonData === null || jsonData === undefined) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}

export const onJsonChange = (json, func, path, obj) => {
  try {
    const copiedObject = JSON.parse(
      JSON.stringify(functionality(json, func, path, obj)),
    );
    if (!_.isEqual(json, copiedObject)) {
      return copiedObject;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};
