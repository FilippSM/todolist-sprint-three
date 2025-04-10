import { RequestStatus } from "@/common/types"
import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: 'idle' as RequestStatus,
    error: null as string | null
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setStatus: create.reducer<{status: RequestStatus}>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{error: string | null}>((state, action) => {
      state.error = action.payload.error
    }),
  }),
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
  },
})

export const { changeThemeModeAC, setStatus, setAppErrorAC } = appSlice.actions
export const { selectThemeMode, selectStatus, selectError } = appSlice.selectors
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
