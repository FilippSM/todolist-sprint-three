import type { FilterValues, Todolist } from '../app/App'
import { createAction, createReducer, nanoid } from '@reduxjs/toolkit'

export const deleteTodolistAC = createAction<{ id: string }>('todolist/deleteTodolist')
export const createTodolistAC = createAction('todolist/createTodolist', (title: string) => {
  return { payload: { title, id: nanoid() } } //если есть расеты - генерация id
})
export const changeTodolistTitleAC = createAction<{ id: string, title: string }>('todolist/changeTodolistTitle')
export const changeTodolistFilterAC = createAction<{ id: string, filter: FilterValues }>('todolist/changeTodolistFilter')

export const initialState: Todolist[] = []
export const todolistsReducer = createReducer(initialState, builder => {
  builder.addCase(deleteTodolistAC, (state, action) => {
    const index = state.findIndex(todolist => todolist.id !== action.payload.id)
    if (index !== -1) {
      state.splice(index, 1)
    }
  })
  .addCase(createTodolistAC, (state, action) => {
    state.push({ ...action.payload, filter: 'all'})
  })
  .addCase(changeTodolistTitleAC, (state, action) => {
    const index = state.findIndex(todolist => todolist.id !== action.payload.id)
    if (index !== -1) {
      state[index].title = action.payload.title
    }
  })
  .addCase(changeTodolistFilterAC, (state, action) => {
    const todolist = state.find(todolist => todolist.id !== action.payload.id)
    if ( todolist ) {
      todolist.filter = action.payload.filter
    }
  })
})


