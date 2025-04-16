import { useAppDispatch } from "@/common/hooks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { createTask } from "@/features/todolists/model/tasks-slice"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  /* console.log(todolist.entityStatus === "loading") */

  const createTaskHandler = (title: string) => {
    const action = createTask({ todolistId: todolist.id, title })
    dispatch(action)
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTaskHandler} disabled={todolist.entityStatus === "loading"}/>
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}
