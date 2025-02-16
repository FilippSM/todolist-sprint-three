import { type ChangeEvent, type CSSProperties, useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
/* import { CreateItemForm } from '@/common/components' */ //index писать необязательно
import { EditableSpan, CreateItemForm } from '@/common/components'
import { BaseResponse } from '@/common/types'
import { instance } from '@/common/instance/instance'
import { Todolist } from '@/features/todolists/api/todolistApi.types'
import { todolistApi } from '@/features/todolists/api/todolistApi'
/* 
const token = 'a87033d9-1efd-493a-8122-8c5b41fe94a7'
const apiKey = 'a00e3908-f288-4f60-9137-9f41213206da' */

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<any>({})

  useEffect(() => {
    todolistApi.getTodolists().then(res => setTodolists(res.data))
  }, [])

  const createTodolist = (title: string) => {
    todolistApi.createTodolist(title).then(res => {
        const todolist = res.data.data.item
        setTodolists([todolist, ...todolists])
      })
  }

  const deleteTodolist = (id: string) => { 
    todolistApi.deleteTodolist(id).then(() => {
      setTodolists(todolists.filter(todolist => todolist.id !== id))
    })
  }

  const changeTodolistTitle = (title: string, id: string) => { 
    todolistApi.changeTodolistTitle(id, title).then(() => {
      setTodolists(todolists.map(todolist => todolist.id === id ? {...todolist, title} : todolist))
    })
  }

  const createTask = (todolistId: string, title: string) => { }

  const deleteTask = (todolistId: string, taskId: string) => { }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: any) => { }

  const changeTaskTitle = (task: any, title: string) => { }

  return (
    <div style={{ margin: '20px' }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title}
              onChange={title => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={title => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task: any) => (
            <div key={task.id}>
              <Checkbox checked={task.isDone}
                onChange={e => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title}
                onChange={title => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: '1px solid black',
  margin: '20px 0',
  padding: '10px',
  width: '300px',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
}





/* export type CreateTodoResponse = {
  data: {item: Todolist}
  fieldsErrors: FieldError[]
  messages: string[]
  resultCode: number
}

export type DeleteTodoResponse = {
  data: {}
  fieldsErrors: FieldError[]
  messages: string[]
  resultCode: number
}

export type UpdateTodoResponse = {
  data: {}
  fieldsErrors: FieldError[]
  messages: string[]
  resultCode: number */