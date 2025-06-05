import { RequestStatus } from "@/common/types"
import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    isLoggedIn: false,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsloggedAC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  extraReducers: (builder) => {
    builder
    .addMatcher(
      isPending,
      (state) => {
        state.status = "loading"
      },
    )
    .addMatcher(
      isFulfilled,
      (state) => {
        state.status = "succeeded"
      },
    )
    .addMatcher(
      isRejected,
      (state) => {
        state.status = "failed"
      },
    )
  },
})

export const { changeThemeModeAC, setStatus, setAppErrorAC, setIsloggedAC } = appSlice.actions
export const { selectThemeMode, selectStatus, selectError, selectIsLoggedIn } = appSlice.selectors
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
