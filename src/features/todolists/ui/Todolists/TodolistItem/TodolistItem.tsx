import {useAppDispatch} from '@/common/hooks/useAppDispatch'
import {FilterButtons} from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons'
import {createTaskAC} from '@/features/todolists/model/tasks-reducer'
import {Tasks} from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks'
import {TodolistTitle} from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle'
import type {Todolist} from '@/app/App'
import {CreateItemForm} from '@/common/components/CreateItemForm/CreateItemForm'

type Props = {
  todolist: Todolist
}

export const TodolistItem = ({todolist}: Props) => {
  const dispatch = useAppDispatch()

  const createTask = (title: string) => {
    dispatch(createTaskAC({todolistId: todolist.id, title}))
  }

  return (
      <div>
        <TodolistTitle todolist={todolist}/>
        <CreateItemForm onCreateItem={createTask}/>
        <Tasks todolist={todolist}/>
        <FilterButtons todolist={todolist}/>
      </div>
  )
}
