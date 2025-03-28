import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
   /*  setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((_state, action) => {
    //return action.payload.todolists.map((td) => ({ ...td, filter: "all" })) 
    }), */
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
 /*    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }), */
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
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
    createTodolistAC: create.preparedReducer(
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
          order: 0,
        })
      },
    ),
  }),
  extraReducers: (builder) => {
    builder.addCase(setTodolists.fulfilled, (_state, action) => {
      return action.payload?.todolists.map((td) => ({ ...td, filter: "all" }))
    })
    .addCase(changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    })

    //обработка ошибки
   /*  .addCase(setTodolists.rejected, (state, action) => {
      
    }) */
  }
})

export const setTodolists = createAsyncThunk(`${todolistsSlice.name}/setTodolists`, async (_arg, {rejectWithValue}) => {
 /*  const { dispatch } = thunkAPI
  todolistsApi.getTodolists().then((res) => {
    dispatch(setTodolistsAC({ todolists: res.data }))
  }) */

  try {
    const res = await todolistsApi.getTodolists()
    return { todolists: res.data }
 /*    thunkAPI.dispatch(setTodolistsAC({ todolists: res.data })) */
  } catch (error) {
    return rejectWithValue(null)
  }
})

export const changeTodolistTitle = createAsyncThunk(`${todolistsSlice.name}/changeTodolistTitle`, async (args: {id: string, title: string}, {rejectWithValue}) => {
  try {
    await todolistsApi.changeTodolistTitle(args)
    return args
  } catch (error){
    return rejectWithValue(null)
  }
})


export const todolistsReducer = todolistsSlice.reducer
export const { deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, createTodolistAC} =
  todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
