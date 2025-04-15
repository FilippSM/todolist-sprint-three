import { setAppErrorAC, setStatus } from "@/app/app-slice.ts"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { tasksApi } from "../api/tasksApi.ts"
import { CreateTaskArgs, DeleteTaskArgs, DomainTask, UpdateTaskModel } from "../api/tasksApi.types.ts"
import { createTodolist, deleteTodolist } from "./todolists-slice.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import { handleServerNetworkError } from "@/common/utils/handleServerNetworkError.ts"
import { handleServerAppError } from "@/common/utils/handleServerAppError.ts"

// {
//   "todoId1": [{taskId: '1', title: 'a'}],
//   "todoId2": [{taskId: '10', title: 'aa'}],
//   "1": [],
// }

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    //thunk
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))

          const res = await tasksApi.getTasks(todolistId)
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTask: create.asyncThunk(
      async (args: CreateTaskArgs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          //задержка на 2 с искусственная
          /* await new Promise((resolve) => {
            setTimeout(resolve, 1000)
          }) */
          /*   const res = await tasksApi.createTask(args) */
          const res = await tasksApi.createTask(args)
          if (res.data.resultCode === ResultCode.Success) {
            return { task: res.data.data.item }
          } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
        }
      },
      {
        fulfilled: (state, action) => {
          /*  const newTask: DomainTask = {
            title: action.payload.title,
            todoListId: action.payload.todolistId,
            priority: TaskPriority.Low,
            status: TaskStatus.New,
            id: nanoid(),
            deadline: "",
            order: 1,
            startDate: "",
            description: "",
            addedDate: "",
          } */
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),
    deleteTask: create.asyncThunk(
      async (args: DeleteTaskArgs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))
          await tasksApi.deleteTask(args)
          return args
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) 
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    changeTaskStatus: create.asyncThunk(
      async (task: DomainTask, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))

          const model: UpdateTaskModel = {
            status: task.status,
            title: task.title,
            priority: task.priority,
            deadline: task.deadline,
            description: task.description,
            startDate: task.startDate,
          }

          await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model })
          return task

          //через response
      /*     const res = await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model })
          return { task: res.data.data.item } */
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todoListId].find((task) => task.id === action.payload.id)
          if (task) {
            task.status = action.payload.status
          }
          //response
         /*  const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          } */
        },
      },
    ),
    changeTaskTitle: create.asyncThunk(
      async (task: DomainTask, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setStatus({ status: "loading" }))

          const model: UpdateTaskModel = {
            status: task.status,
            title: task.title,
            priority: task.priority,
            deadline: task.deadline,
            description: task.description,
            startDate: task.startDate,
          }

          await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model })
          return task
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setStatus({ status: "idle" })) //крутилка при ошибке сервера - если ошибка крутилка вырубается а не крутится вечно
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todoListId].find((task) => task.id === action.payload.id)
          if (task) {
            task.title = action.payload.title
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        if (action.payload) {
          // Проверка на наличие payload
          delete state[action.payload.id] // Удаляем по id
        }
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const { changeTaskTitle, fetchTasks, createTask, deleteTask, changeTaskStatus } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
