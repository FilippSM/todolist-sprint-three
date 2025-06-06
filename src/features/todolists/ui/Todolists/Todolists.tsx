import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { useGetTodolistsQuery } from "../../api/todolistsApi";
import { DomainTodolist } from "../../model/todolists-slice";
import { TodolistItem } from "./TodolistItem/TodolistItem";
import { containerSx } from './../../../../common/styles/container.styles';
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton";

export const Todolists = () => {
  const {data: todolists, isLoading} = useGetTodolistsQuery()

  if (isLoading) return (
    <Box sx={containerSx} style={{gap: '30px'}}>
      {Array(3).fill(null).map((_, i) => (
        <TodolistSkeleton key={i}/>
      ))}
    </Box>
  )

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
