import { baseApi } from "@/app/baseApi"
import { defaultResponseSchema, type DefaultResponse } from "@/common/types"
import {
  getTasksSchema,
  TaskOperationResponse,
  taskOperationResponseSchema,
  type CreateTaskArgs,
  type DeleteTaskArgs,
  type GetTasksResponse,
  type UpdateTaskModel
} from "./tasksApi.types"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => ({
        url: `/todo-lists/${todolistId}/tasks`,
      }),
      providesTags: (result, _error, todolistId) =>
        result
          ? [...result.items.map(({ id }) => ({ type: "Task", id }) as const), { type: "Task", id: todolistId }]
          : ["Task"],
      extraOptions: {dataSchema: getTasksSchema}
      //вариант - ошибка вывод в консоль
      /*  transformResponse: (res: GetTasksResponse) => getTasksSchema.parse(res) */
      //вариат через alert
      /* transformResponse: (res: GetTasksResponse) => {
        try {
          getTasksSchema.parse(res)
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.table(error.issues)
            alert("! Zod error. Смотри консоль.")
          }
        }
        return res
      }, */

    }),
    createTask: build.mutation<TaskOperationResponse, CreateTaskArgs>({
      query: ({ todolistId, title }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_result, _error, {todolistId}) => [{type: "Task", id: todolistId}],
      extraOptions: {dataSchema: taskOperationResponseSchema}
    }),
    updateTask: build.mutation<
      TaskOperationResponse,
      {
        todolistId: string
        taskId: string
        model: UpdateTaskModel
      }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      invalidatesTags: (_result, _error, {taskId}) => [{type: "Task", id: taskId}],
    }),

    deleteTask: build.mutation<DefaultResponse, DeleteTaskArgs>({
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, {taskId}) => [{type: "Task", id: taskId}],
      extraOptions: {dataSchema: defaultResponseSchema}
    }),
  }),
})


export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
