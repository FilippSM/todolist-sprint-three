import { setStatus } from "@/app/app-slice"
import { clearDataAC } from "@/common/actions"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { authApi } from "../api/authApi"
import { LoginInputs } from "../lib/schemas"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (args: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          const res = await authApi.login(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setStatus({ status: "succeeded" }))

            //local storage
            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return { isLoggedIn: true }
          } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setStatus({ status: "succeeded" }))
            dispatch(clearDataAC()) //nаски и тудулисты, которые должны зачищаться
            //local storage
            localStorage.removeItem(AUTH_TOKEN)
            return { isLoggedIn: false }
          } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    setIsloggedAC: create.reducer<{isLoggedIn: boolean}>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  }),
})

export const { loginTC, logoutTC} = authSlice.actions
export const authReducer = authSlice.reducer
