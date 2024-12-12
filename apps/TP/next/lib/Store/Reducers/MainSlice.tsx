import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "../../utils/cookiemgmt";
import { getLanguage, getTheme } from "../../utils/utility";

export type Theme = "daylight" | "midnight" | "sunrise" | "eclipse";

export type FontSize = 0.9 | 1 | 1.2;

interface InitialReduxState {
  tenant?: string;
  accentColor: string;
  useDarkMode: boolean;
  locale: Record<string, string>;
  testTheme: Record<string, string>;
  fontSize: FontSize;
}

const getInitialLanguage: () => Record<string, string> = () => {
  const lang = getCookie("cfg_lc");
  if (lang) {
    return getLanguage(lang);
  } else {
    return getLanguage("en");
  }
};

const getInitialFontSize = (): FontSize => {
  let initialFontSize: FontSize = 1;
  
  const validFontSizes: FontSize[] = [0.9, 1, 1.2];
  
  if (getCookie("cfg_fs")) {
    const fontSizeInCookie = parseFloat(getCookie("cfg_fs"));
    
    // Check if fontSizeInCookie is a valid FontSize
    if (validFontSizes.includes(fontSizeInCookie as FontSize)) {
      initialFontSize = fontSizeInCookie as FontSize;
    }
  }
  
  return initialFontSize;
};

const initialState: InitialReduxState = {
  tenant: "",
  accentColor: getCookie("cfg_clr") ? getCookie("cfg_clr") : "#006FEE",
  useDarkMode: false,
  locale: getInitialLanguage(),
  testTheme: getCookie("cfg_tm") ? getTheme(getCookie("cfg_tm")) : getTheme("daylight"),
  fontSize: getInitialFontSize(),
};

const MainStates = createSlice({
  name: "mainslice",
  initialState,
  reducers: {
    setTenant: (state: InitialReduxState, action: PayloadAction<string>) => {
      state.tenant = action.payload;
    },

    setAccentColor: (state: InitialReduxState, action: PayloadAction<string>) => {
      setCookie("cfg_clr", action.payload);
      state.accentColor = action.payload;
    },

    setLocale: (state: InitialReduxState, action: PayloadAction<string>) => {
      setCookie("cfg_lc", action.payload);
      state.locale = getLanguage(action.payload);
    },

    setTestTheme: (state: InitialReduxState, action: PayloadAction<Theme>) => {
      setCookie("cfg_tm", action.payload);
      state.testTheme = getTheme(action.payload);
    },

    setFontSize: (state: InitialReduxState, action: PayloadAction<FontSize>) => {
      setCookie("cfg_fs", action.payload.toString());
      state.fontSize = action.payload;
    },
  },
});

export const { setTenant, setAccentColor, setLocale, setTestTheme, setFontSize } = MainStates.actions;

export default MainStates.reducer;
