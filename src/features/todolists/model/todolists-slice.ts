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
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        const newTodolist: DomainTodolist = {
          id: action.payload.id, // Используем id из payload
          title: action.payload.title, // Используем title из payload
          filter: "all",
          order: 1,
          addedDate: "",
        }
        state.push(newTodolist) // Добавляем новый тудулист в состояние
      })
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const { changeTodolistFilterAC} = todolistsSlice.actions
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
  async (id: string, { rejectWithValue }) => {
    try {
      await todolistsApi.deleteTodolist(id)
      return id
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, { rejectWithValue }) => {
    try {
      const id = nanoid(); // Генерация id
      const newTodolist = { title, id }; // Создаем новый тудулист
      await todolistsApi.createTodolist(title); // Отправляем на сервер
      return newTodolist; // Возвращаем новый тудулист
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
