import { instance } from "@/common/instance"
import { defaultResponseSchema, type BaseResponse, type DefaultResponse } from "@/common/types"
import {
  getTasksSchema,
  TaskOperationResponse,
  taskOperationResponseSchema,
  type CreateTaskArgs,
  type DeleteTaskArgs,
  type DomainTask,
  type GetTasksResponse,
  type UpdateTaskModel,
} from "./tasksApi.types"
import { baseApi } from "@/app/baseApi"
import { z } from "zod"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, string>({
      providesTags: ["Task"],
      query: (todolistId) => ({
        url: `/todo-lists/${todolistId}/tasks`,
      }),
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
      invalidatesTags: ["Task"],
      query: ({ todolistId, title }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
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
      invalidatesTags: ["Task"],
      query: ({ todolistId, taskId, model }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
    }),

    deleteTask: build.mutation<DefaultResponse, DeleteTaskArgs>({
      invalidatesTags: ["Task"],
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      extraOptions: {dataSchema: defaultResponseSchema}
    }),
  }),
})


export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
