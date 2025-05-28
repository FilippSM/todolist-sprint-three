import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { useGetTodolistsQuery } from "../../api/todolistsApi";
import { TodolistItem } from "./TodolistItem/TodolistItem";

export const Todolists = () => {
  const {data: todolists, refetch} = useGetTodolistsQuery()

  
  return (
    <>
    <button onClick={refetch}>fetch TD</button>
      {todolists?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
