import { createSlice, nanoid } from "@reduxjs/toolkit";
import { Todolist } from "../api/todolistsApi.types";

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((_state, action) => {
      return action.payload.todolists.map(td => ({ ...td, filter: 'all' }))
    }),
    deleteTodolistAC:create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC:create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC:create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),

    //синтакисис генерация id в компоненте
    /* createTodolistAC:create.reducer<{title: string, id: string}>((state, action) => {
      //state.push({ ...action.payload, filter: "all" }) - в одну строку
      const newTodolist: Todolist = {
        title: action.payload.title,
        id: action.payload.id,
        filter: "all"
      }
      state.push(newTodolist)
    }), */

    //синтакисис генерация id в preparedReducer
    createTodolistAC:create.preparedReducer(
      (title: string) => {
        return {
          payload: {
            title,
            id: nanoid(),
          },
        }
      },
      (state, action) => {
        state.push({
          ...action.payload, 
          filter: "all",
          addedDate: "",
          order: 0
        })
      }
    ),

  })
})

export const todolistsReducer = todolistsSlice.reducer
export const {deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, createTodolistAC, setTodolistsAC} = todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
