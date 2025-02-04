import {createAction, createReducer, nanoid} from '@reduxjs/toolkit'
import type {Task, TasksState} from '../app/App'
import {createTodolistAC, deleteTodolistAC} from './todolists-reducer'

const initialState: TasksState = {}

export const deleteTaskAC = createAction<{ todolistId: string, taskId: string }>('task/deleteTask')
export const createTaskAC = createAction<{ todolistId: string, title: string }>('task/createTask')
export const changeTaskStatusAC = createAction<{ todolistId: string, taskId: string, isDone: boolean }>('task/changeTaskStatus')
export const changeTaskTitleAC = createAction<{ todolistId: string, taskId: string, title: string }>('task/changeTaskTitle')

export const tasksReducer = createReducer(initialState, builder => {
  builder
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(createTodolistAC, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTaskAC, (state, action) => {
        const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
        if (index !== -1) {
          state[action.payload.todolistId].splice(index, 1)
        }
      })
      .addCase(createTaskAC, (state, action) => {
        state[action.payload.todolistId].unshift({title: action.payload.title, isDone: false, id: nanoid()})
      })
      .addCase(changeTaskStatusAC, (state, action) => {
        const index = state[action.payload.todolistId].findIndex(todolist => todolist.id === action.payload.taskId)
        if (index !== -1) {
          state[action.payload.todolistId][index].isDone = action.payload.isDone
        }
      })
      .addCase(changeTaskTitleAC, (state, action) => {
        const index = state[action.payload.todolistId].findIndex(todolist => todolist.id === action.payload.taskId)
        if (index !== -1) {
          state[action.payload.todolistId][index].title = action.payload.title
        }
      })
})

