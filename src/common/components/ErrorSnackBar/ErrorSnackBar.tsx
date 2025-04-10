import { selectError, setAppErrorAC } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import Alert from "@mui/material/Alert"
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import { SyntheticEvent } from "react"

export const ErrorSnackbar = () => {
  const error = useAppSelector(selectError)

  const dispatch = useAppDispatch()

 

  const handleClose = (_event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return
    }

    dispatch(setAppErrorAC({error: null}))
  }

  

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" variant="filled">
        This is a success Alert inside a Snackbar!
      </Alert>
    </Snackbar>
  )
}
