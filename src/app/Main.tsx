import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice"
import { createTodolist } from "@/features/todolists/model/todolists-slice"

import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { Login } from '@/features/auth/ui/Login/Login';
import { Navigate } from "react-router"
import { Path } from "@/common/routing/Routing"

export const Main = () => {
  const isLoggetIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const createTodolistHandler = (title: string) => {
    dispatch(createTodolist(title))
  }

  if (!isLoggetIn) {
    return <Navigate to={Path.Login}/>
  }

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
