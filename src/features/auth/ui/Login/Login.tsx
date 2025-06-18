import { selectThemeMode, setIsloggedAC } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"

import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControlLabel } from "@mui/material"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useGetCaptchaUrlQuery, useLoginMutation } from "../../api/authApi"
import { LoginInputs, loginSchema } from "../../lib/schemas"
import s from "./Login.module.css"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const [login] = useLoginMutation()
  const { data: captchaData, refetch: refreshCaptcha } = useGetCaptchaUrlQuery()

  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset, //ресет полей
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: { email: "", password: "", rememberMe: false, captcha: "" },
    resolver: zodResolver(loginSchema),
  }) //значение по умолчанию

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    /* login(data).then((res) => {
      if (res.data?.resultCode === ResultCode.Success) {
        //local storage
        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
        dispatch(setIsloggedAC({isLoggedIn: true}))
      }
    })
    getCaptchaUrl(data).then((res) => {
      
    })
    reset() */
    const loginResult = await login(data)

    if (loginResult.data?.resultCode === ResultCode.Success) {
      localStorage.setItem(AUTH_TOKEN, loginResult.data.data.token)
      dispatch(setIsloggedAC({ isLoggedIn: true }))
      reset()
    } else if (loginResult.data?.resultCode === 10d) {
      // Если требуется капча - запрашиваем новую
      await refreshCaptcha()
    }
  }

  // 1 var
  /* if (isLoggetIn) {
    return <Navigate to={Path.Main} />
  }
 */
  // 2 var
  /* useEffect(() => {
    if (isLoggetIn) {
    navigate(Path.Main)
  }
}, [isLoggetIn]) */

  const showCaptcha = loginData?.resultCode === 10;

  return (
    <Grid container justifyContent={"center"}>
      <FormControl>
        <FormLabel>
          <p>
            To login get registered
            <a
              style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
              href="https://social-network.samuraijs.com"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>
            <b>Email:</b> free@samuraijs.com
          </p>
          <p>
            <b>Password:</b> free
          </p>
        </FormLabel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <TextField
              label="Email"
              margin="normal"
              error={!!errors.email} //подсвечивание
              {...register("email")}
            />
            {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
            <TextField type="password" label="Password" margin="normal" {...register("password")} />
            {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>}
            {
              <FormControlLabel
                label="Remember me"
                control={
                  <Controller
                    name={"rememberMe"}
                    control={control}
                    render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} />}
                  />
                }
              />
            }

            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}
