import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import {
  todolistsApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation,
} from "@/features/todolists/api/todolistsApi"

import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import { useAppDispatch } from "@/common/hooks"
import { RequestStatus } from "@/common/types"
import { DomainTodolist } from "@/features/todolists/lib/types"
import { Try } from "@mui/icons-material"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const deleteTodolistHandler = () => {
    deleteTodolist(id)
  }

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ id, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleHandler} disabled={entityStatus === "loading"} />
      </h3>
      <IconButton onClick={deleteTodolistHandler} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
