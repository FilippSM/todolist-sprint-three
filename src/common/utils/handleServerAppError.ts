import { setAppErrorAC, setStatus } from "@/app/app-slice"
import { Dispatch } from "@reduxjs/toolkit"
import { BaseResponse } from "../types"

export const handleServerAppError = <T>(dispatch: Dispatch, data: BaseResponse<T>) => {
  dispatch(setStatus({ status: "failed" }))
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }))
  } else {
    dispatch(setAppErrorAC({ error: "Some error occurred" }))
  }
}
