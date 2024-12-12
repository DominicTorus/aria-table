"use client";
export function setCookie(cname: string, cvalue: string, exdays: number = 10) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  // Encode the value before setting it
  document.cookie = `${cname}=${encodeURIComponent(cvalue)};${expires};path=/`;
}

export function getCookie(cname: string) {
  if (typeof window == "undefined") return "";
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      // Decode the value after retrieving it
      return decodeURIComponent(c.substring(name.length, c.length));
    }
  }
  return "";
}

export function setCookieIfNotExist(name:string, value:string){
  if(!getCookie(name)){
    setCookie(name, value);
  }
}

export function deleteAllCookies() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    if (!name.includes("cfg")) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
}

export function deleteCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getEncodedDetails(
  fabric: string,
  artifactType?: string,
  catalog?: string,
  artifactGrp?: string,
  artifactName?: string,
  version?: string,
  tenant?: string
) {
  let client = getCookie("tp_cc");
  let userObj = getCookie("tp_user") ? JSON.parse(getCookie("tp_user")) : {};
  let cfg_tm = getCookie("cfg_tm") ? getCookie("cfg_tm") : "daylight";
  let cfg_lc = getCookie("cfg_lc") ? getCookie("cfg_lc") : "en-GB";
  let cfg_clr = getCookie("cfg_clr") ? getCookie("cfg_clr") : "#0736C4";
  let cfg_fs = getCookie("cfg_fs") ? getCookie("cfg_fs") : "1";
  const dataObject = {
    client,
    fngk: artifactType,
    fnk: fabric,
    catalog,
    artifactGrp,
    artifactName,
    version,
    tenant : tenant ? tenant : undefined ,
    cfg_tm,
    cfg_lc,
    cfg_clr,
    cfg_fs,
     ...userObj
  };
  return btoa(JSON.stringify(dataObject));
}
