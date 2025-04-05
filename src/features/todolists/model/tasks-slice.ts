import { RootState } from "@/app/store.ts"
import { TaskStatus } from "@/common/enums/enums.ts"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { tasksApi } from "../api/tasksApi.ts"
import { CreateTaskArgs, DeleteTaskArgs, DomainTask, UpdateTaskModel } from "../api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"

// {
//   "todoId1": [{taskId: '1', title: 'a'}],
//   "todoId2": [{taskId: '10', title: 'aa'}],
//   "1": [],
// }

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    //actions
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
    //thunk
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { rejectWithValue }) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTask: create.asyncThunk(
      async (args: CreateTaskArgs, { rejectWithValue }) => {
        try {
          const res = await tasksApi.createTask(args)
          return { task: res.data.data.item }
        } catch (error) {
          return rejectWithValue(null)
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
      async (args: DeleteTaskArgs, { rejectWithValue }) => {
        try {
          await tasksApi.deleteTask(args)
          return args
        } catch (error) {
          return rejectWithValue(null)
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
      async (args: { todolistId: string; taskId: string; status: TaskStatus }, { rejectWithValue, getState }) => {
        const { todolistId, taskId, status } = args

        try {
          const state = getState() as RootState
          const tasks = state.tasks
          const tasksForTodolist = tasks[todolistId]
          const currentTask = tasksForTodolist.find((task) => task.id === taskId)

          if (currentTask) {
            const model: UpdateTaskModel = {
              status,
              title: currentTask.title,
              priority: currentTask.priority,
              deadline: currentTask.deadline,
              description: currentTask.description,
              startDate: currentTask.startDate,
            }

            console.log("Updating task:", { todolistId, taskId, model })
            const response = await tasksApi.updateTask({ todolistId, taskId, model })
            console.log("Response from server:", response)

            return args
          } else {
            return rejectWithValue(null)
          }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
          if (task) {
            task.status = action.payload.status
            console.log('Task status updated:', state);
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
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

export const { changeTaskTitleAC, fetchTasks, createTask, deleteTask, changeTaskStatus } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
