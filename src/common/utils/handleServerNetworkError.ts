import { setAppErrorAC, setStatus } from "@/app/app-slice"
import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"
import { z } from "zod"

export const handleServerNetworkError = (dispatch: Dispatch, error: unknown) => {
  let errorMessage

  if (axios.isAxiosError(error)) {
    //серверная ошибка
    errorMessage = error.message
  } else if (error instanceof Error) {//клиентская ошибка
    //zod ошибка
    if (error instanceof z.ZodError) {
      console.table(error.issues)
      errorMessage = "ZodError"
    } else {errorMessage = error.message}
  } else {
    errorMessage = JSON.stringify(error) //ошибка в любом случае
  }

  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setStatus({ status: "failed" }))
}
