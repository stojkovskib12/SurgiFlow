import { configureStore } from "@reduxjs/toolkit";
import surgicalCasesReducer from "./surgicalCases.slice";

export const createAppStore = () => configureStore({
  reducer: {
    surgicalCases: surgicalCasesReducer,
  },
});

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
