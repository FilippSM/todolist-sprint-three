import {createSlice } from "@reduxjs/toolkit"


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
  selectors: {
    //state - это не весь стейт программы как ранее а стейт этого слайса
    selectThemeMode: (state) => state.themeMode
  },
})

//старый синтаксис селектора
/* export const selectThemeMode = (state: RootState): ThemeMode => state.app.themeMode */

export const appReducer = appSlice.reducer
export const {changeThemeModeAC} = appSlice.actions
export const {selectThemeMode} = appSlice.selectors

export type ThemeMode = "dark" | "light"
