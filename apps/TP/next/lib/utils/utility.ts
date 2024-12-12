import _ from "lodash";

export const transformObject: any = (obj: any) => {
  if (typeof obj === "string") {
    return "";
  }

  if (Array.isArray(obj)) {
    return [transformObject(obj[0])];
  }

  if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = transformObject(obj[key]);
      }
    }
    return newObj;
  }
  return obj; // Return the value if it's not an object, array, or string
};

export function findPath(obj: any, searchValue: any, path = "") {
  if (typeof obj === "object") {
    for (const key in obj) {
      if (JSON.stringify(obj[key]) === JSON.stringify(searchValue)) {
        return path + key;
      } else if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          const result: any = findPath(
            obj[key][i],
            searchValue,
            path + key + "." + i + "."
          );
          if (result) {
            return result;
          }
        }
      } else if (typeof obj[key] === "object") {
        const result: any = findPath(obj[key], searchValue, path + key + ".");
        if (result) {
          return result;
        }
      }
    }
  }
  return null;
}

export function hexWithOpacity(hex: string, opacity: number) {
  // Ensure opacity is between 0 and 1
  opacity = Math.round(opacity * 255);

  // Remove the hash if present
  hex = hex.replace("#", "");

  // Ensure the hex code is valid
  if (hex.length !== 6) {
    throw new Error("Invalid hex color");
  }

  // Convert the opacity to a 2-character hex string
  let alpha = opacity.toString(16).padStart(2, "0").toUpperCase();

  // Return the original hex color with appended alpha value
  return `#${hex}${alpha}`;
}

export const capitalize = (val: string) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const calculateRecentlyWorkingDetails = (
  date: string,
  locale: string
) => {
  const date1 = new Date(date);
  const date2 = new Date();
  const diffTime = date2.getTime() - date1.getTime();

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

  // Create a relative time formatter based on the locale
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffDays > 0) {
    return rtf.format(-diffDays, "day"); // "day" in correct plural form
  } else if (diffHours > 0) {
    return rtf.format(-diffHours, "hour"); // "hour" in correct plural form
  } else if (diffMinutes > 0) {
    return rtf.format(-diffMinutes, "minute"); // "minute" in correct plural form
  } else {
    return rtf.format(0, "second"); // "Just now" equivalent
  }
};

export const getLanguage = (lan: string) => {
  const en = require("../locales/en.json");
  const fr = require("../locales/fr.json");
  const sp = require("../locales/sp.json");
  const ta = require("../locales/ta.json");
  const ar = require("../locales/ar.json");
  switch (lan) {
    case "es-ES":
      return sp;
    case "fr-FR":
      return fr;
    case "ar-AR":
      return ar;
    case "ta-IN":
      return ta;
    default:
      return en;
  }
};

export const getTheme = (theme: string) => {
  const light = require("../themes/daylight.json");
  const dark = require("../themes/midnight.json");
  const sunrise = require("../themes/sunrise.json");
  const eclipse = require("../themes/eclipse.json");
  switch (theme) {
    case "midnight":
      return dark;
    case "sunrise":
      return sunrise;
    case "eclipse":
      return eclipse;
    default:
      return light;
  }
};

export const handleDeleteGroupAndMembers = (
  data: any,
  selectedItems: any,
  setSelectedItems: any,
  onUpdate: any,
  saveFunction: (isDeletion: boolean, data?: any) => void
) => {
  var updatedData = _.cloneDeep(data);
  const groupKeys = new Set();
  const memberKeys = new Set();
  Object.entries(selectedItems).forEach(([key, value]) => {
    if (value && key.split(".").length === 1) {
      groupKeys.add(key);
    } else if (value) {
      memberKeys.add(key);
    }
  });

  if (groupKeys.size == 0 && memberKeys.size == 0) {
    return { error: "no selected keys" };
  }
  Array.from(groupKeys)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      updatedData = updatedData.filter(
        (item: any, index: number) => index !== Number(key)
      );
      setSelectedItems((prev: any) => {
        const updatedItems = { ...prev };
        delete updatedItems[key as string];
        return updatedItems;
      });
    });

  Array.from(memberKeys).sort((a, b) => {
    const aParts = (a as string).split('.').map(Number); // Split and convert parts to numbers
    const bParts = (b as string).split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      if ((bParts[i] || 0) !== (aParts[i] || 0)) {
        return (bParts[i] || 0) - (aParts[i] || 0); // Sort descending
      }
    }
    return 0; // Equal parts
  }).forEach((key) => {
    if (groupKeys.has((key as string).split(".")[0])) return;
    const parentPath = (key as string).split(".").slice(0, -1).join(".");
    const parentData = _.get(updatedData, parentPath);
    const memberObj = _.get(updatedData, `${key}`);
    if (!parentData) return;
    _.remove(parentData, (obj) => obj === memberObj);
    setSelectedItems((prev: any) => {
      const updatedItems = { ...prev };
      delete updatedItems[key as string];
      return updatedItems;
    });
    _.set(updatedData, parentPath, parentData);
  });
  onUpdate(updatedData);
  saveFunction(true, updatedData);
  setSelectedItems({});
  return { success: "success" };
};

export const handleDelete = (
  data: any,
  selectedRows: any,
  setSelectedRows: any,
  onUpdate: any,
  saveFunction: (isDeletion: boolean, data?: any[]) => void,
  primaryColumn: string
) => {
  const updatedData = new Set(data);
  if (selectedRows.has("all")) {
    updatedData.clear();
  } else {
    selectedRows.forEach((row: any) => {
      updatedData.forEach((item: any) => {
        if (item[primaryColumn] === row) {
          updatedData.delete(item);
        }
      });
    });
  }
  setSelectedRows(new Set([]));
  onUpdate(Array.from(updatedData));
  saveFunction(true, Array.from(updatedData));
};

export const handleSelectGroupandMembers = (path: string, isParent: boolean , assetType: string , setSelectedItems :any , data: any) => {
  setSelectedItems((prev:any) => {
    const updatedItems = { ...prev };

    if (isParent) {
      const groupData = _.get(data, path);
      const isParentSelected = !!updatedItems[path];

      if (isParentSelected) {
        // If the parent is selected, remove the parent and all its children
        delete updatedItems[path];
        if(path.includes(assetType)){
          delete updatedItems[path.replace(`.${assetType}`, "")];
        }
        Object.entries(groupData).forEach(([key, item]: any) => {
          if (typeof item === "object" && Array.isArray(item)) {
            delete updatedItems[`${path}.${key}`];
            item.forEach((_, index) => {
              delete updatedItems[`${path}.${key}.${index}`];
            });
          }else if (typeof item === "object") {
            delete updatedItems[`${path}.${key}`];
          }
        });
      } else {
        // If the parent is not selected, add the parent and all its children
        updatedItems[path] = true;
        Object.entries(groupData).forEach(([key, item]: any) => {
          if (typeof item === "object" && Array.isArray(item)) {
            updatedItems[`${path}.${key}`] = true;
            item.forEach((_, index) => {
              updatedItems[`${path}.${key}.${index}`] = true;
            });
          }else if (typeof item === "object"){
            updatedItems[`${path}.${key}`] = true;
          }
        });
      }
    } else {

      if(updatedItems[path]){
        const segmentedPath = path.split(".") 
        let parentPathArray:any[] = [];
        let currentPath = "";
        segmentedPath.forEach((segment, index) => {
          currentPath += (currentPath ? "." : "") + `${segment}`;
          parentPathArray.push(currentPath);
        })
        for (const parentPath of parentPathArray) {
           updatedItems[parentPath] = false;        //As this parentPath array included path of selected item also
        }
      }else{
        updatedItems[path] = true;
      }
    }

    return updatedItems;
  });
};
