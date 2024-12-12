import { configureStore } from "@reduxjs/toolkit";

import MainStates from "../Store/Reducers/MainSlice";
export const store = configureStore({
  reducer: {
    main: MainStates,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
