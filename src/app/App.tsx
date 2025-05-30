import { selectThemeMode, setIsloggedAC } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components/ErrorSnackBar/ErrorSnackBar"
import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Routing } from "@/common/routing"
import { getTheme } from "@/common/theme"
import { useMeQuery } from "@/features/auth/api/authApi"
import { CircularProgress } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import s from "./App.module.css"
import { ResultCode } from "@/common/enums"

export const App = () => {
  const [isInit, setIsInit] = useState(false)

  const themeMode = useAppSelector(selectThemeMode)

  const { data, isLoading } = useMeQuery()

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isLoading) return
    setIsInit(true)
    if (data?.resultCode === ResultCode.Success)

      dispatch(setIsloggedAC({isLoggedIn: true}))
  }, [isLoading])

  if (!isInit) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={s.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
