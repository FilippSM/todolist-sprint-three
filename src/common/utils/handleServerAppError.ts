import { setAppErrorAC, setStatus } from "@/app/app-slice"
import { Dispatch } from "@reduxjs/toolkit"

export const handleServerAppError = (dispatch: Dispatch, data: any) => {
  dispatch(setStatus({ status: "failed" }))
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }))
  } else {
    dispatch(setAppErrorAC({ error: "Some error occurred" }))
  }
}
