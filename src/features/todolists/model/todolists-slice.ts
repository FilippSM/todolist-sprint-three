import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"

// []
// ---
// [{id: 1, title: '111' }]

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    /* deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }), */
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    // ✅
    // todolists/createTodolistAC
    createTodolistAC: create.preparedReducer(
      (title: string) => ({
        payload: { title, id: nanoid() },
      }),
      (state, action) => {
        const newTodolist: DomainTodolist = {
          ...action.payload,
          filter: "all",
          order: 1,
          addedDate: "",
        }
        state.push(newTodolist)
      },
    ),
    // ✅🤔
    // createTodolistAC: create.reducer<{ id: string; title: string }>((state, action) => {
    //   state.push({ id: action.payload.id, title: action.payload.title, filter: "all" })
    // }),
    // ❌
    // createTodolistAC: create.reducer<string>((state, action) => {
    //   state.push({ id: nanoid(), title: action.payload, filter: "all" })
    // }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map((todolist) => ({ ...todolist, filter: "all" }))
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.findIndex((todolist) => todolist.id === action.payload)
          
          if (index !== -1) {
            state.splice(index, 1)
          }
        }
      })
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const { changeTodolistFilterAC, createTodolistAC } = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

// Thunk
export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`,
  async (_arg, { rejectWithValue }) => {
    try {
      const res = await todolistsApi.getTodolists()
      return { todolists: res.data }
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (args: { id: string; title: string }, { rejectWithValue }) => {
    try {
      await todolistsApi.changeTodolistTitle(args)
      return args
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (arg: {id: string}, { rejectWithValue }) => {
    try {
      await todolistsApi.deleteTodolist(arg.id)
      return arg.id
    } catch (error) {
      return rejectWithValue(null)
    }
  },
);

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
