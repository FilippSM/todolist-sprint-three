import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import {
  todolistsApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation,
} from "@/features/todolists/api/todolistsApi"
import { type DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import { useAppDispatch } from "@/common/hooks"
import { RequestStatus } from "@/common/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const dispatch = useAppDispatch()

  const changeTodolistStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === id)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      }),
    )
  }

  const deleteTodolistHandler = () => {
    changeTodolistStatus('loading')
    deleteTodolist(id).unwrap().catch(() => { //unwrap() - чтобы попало в catch
      changeTodolistStatus('failed')
    })
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
