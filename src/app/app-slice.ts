import {createSlice } from "@reduxjs/toolkit";

//три обязательных параметра
export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
  },
  reducers: (create) => ({
      //подъредьюсер или экш криэйтор
      changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
        state.themeMode = action.payload.themeMode
      }),
  }),
})

export const appReducer = appSlice.reducer
export const {changeThemeModeAC} = appSlice.actions

export type ThemeMode = "dark" | "light"
