import type {Task, Todolist} from '@/app/App'
import {useAppDispatch} from '@/common/hooks/useAppDispatch'
import {EditableSpan} from '@/common/components/EditableSpan/EditableSpan'
import {changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC} from '@/features/todolists/model/tasks-reducer'
import {getListItemSx} from './TaskItem.styles'
import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import type {ChangeEvent} from 'react'

type Props = {
  task: Task
  todolist: Todolist
}

export const TaskItem = ({task, todolist}: Props) => {
  const {id} = todolist

  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskAC({todolistId: id, taskId: task.id}))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked
    dispatch(changeTaskStatusAC({todolistId: id, taskId: task.id, isDone: newStatusValue}))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(changeTaskTitleAC({todolistId: id, taskId: task.id, title}))
  }

  return (
      <ListItem sx={getListItemSx(task.isDone)}>
        <div>
          <Checkbox checked={task.isDone} onChange={changeTaskStatus}/>
          <EditableSpan value={task.title} onChange={changeTaskTitle} />
        </div>
        <IconButton onClick={deleteTask}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
  )
}