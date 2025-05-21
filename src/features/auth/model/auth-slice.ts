import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { LoginInputs } from "../lib/schemas"
import { authApi } from "../api/authApi"
import { ResultCode } from "@/common/enums"
import { setStatus } from "@/app/app-slice"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (args: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          const res = await authApi.login(args)
          if (res.data.resultCode === ResultCode.Success) {
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
  }),
})

export const { selectIsLoggedIn } = authSlice.selectors
export const { loginTC } = authSlice.actions
export const authReducer = authSlice.reducer
