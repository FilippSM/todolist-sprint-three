import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { useGetTodolistsQuery } from "../../api/todolistsApi";
import { TodolistItem } from "./TodolistItem/TodolistItem";
import { DomainTodolist } from "../../model/todolists-slice";

export const Todolists = () => {
  const {data: todolists} = useGetTodolistsQuery()


  return (
    <>
      {todolists?.map((todolist: DomainTodolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
