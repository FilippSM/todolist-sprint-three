import { useAppDispatch, useAppSelector } from "@/common/hooks"

import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { fetchTasks, selectTasks } from "@/features/todolists/model/tasks-slice"
import { useEffect } from "react"
import { TaskStatus } from "@/common/enums"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

/*   console.log(todolist.entityStatus === "loading") */

  const dispath = useAppDispatch()

  const tasks = useAppSelector(selectTasks)

  useEffect(() => {
    dispath(fetchTasks(id))
  }, [])

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolistId={id} todolist={todolist}/>)}</List>
      )}
    </>
  )
}
