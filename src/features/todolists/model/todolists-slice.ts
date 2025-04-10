import { setStatus } from "@/app/app-slice"
import { createAppSlice } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

// []
// ---
// [{id: 1, title: '111' }]

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    //actions
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    //asynk actions (thunk)
    fetchTodolists: create.asyncThunk(
      async (_arg, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          //задерж
          // ка на 2 с искусственная
          /*   await new Promise((resolve) => {
          setTimeout(resolve, 2000)
        }) */

          dispatch(setStatus({ status: "succeeded" }))

          const res = await todolistsApi.getTodolists()
          return { todolists: res.data }
        } catch (error) {
          dispatch(setStatus({ status: "failed" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all" })
          })
        },
      },
    ),
    changeTodolistTitle: create.asyncThunk(
      async (args: { id: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          await todolistsApi.changeTodolistTitle(args)
          return args
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),
    createTodolist: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title) // Отправляем на сервер
          return { todolist: res.data.data.item } // Возвращаем респонс сервера
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all" }) // Добавляем новый тудулист в состояние
        },
      },
    ),
    deleteTodolist: create.asyncThunk(
      async (id: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          await todolistsApi.deleteTodolist(id)
          return { id }
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const { changeTodolistFilterAC, fetchTodolists, changeTodolistTitle, createTodolist, deleteTodolist } =
  todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
