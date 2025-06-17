import { baseApi } from "@/app/baseApi"
import { defaultResponseSchema, type DefaultResponse } from "@/common/types"
import {
  getTasksSchema,
  TaskOperationResponse,
  taskOperationResponseSchema,
  type CreateTaskArgs,
  type DeleteTaskArgs,
  type GetTasksResponse,
  type UpdateTaskModel,
} from "./tasksApi.types"
import { PAGE_SIZE } from "@/common/constants"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { page: number } }>({
      query: ({ todolistId, params }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        params: { ...params, count: PAGE_SIZE },
      }),
      providesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
      extraOptions: { dataSchema: getTasksSchema },
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
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
      extraOptions: { dataSchema: taskOperationResponseSchema },
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
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

        let patchResults: any[] = []

        cachedArgsForQuery.forEach(({ params }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: params.page } }, (state) => {
                const index = state.items.findIndex((task) => task.id === taskId)
                if (index !== -1) {
                  state.items[index] = { ...state.items[index], ...model }
                }
              }),
            ),
          )
        })
        try {
          await queryFulfilled
        } catch (error) {
          patchResults.forEach((patchResult) => {
            //откатиться к предыдцщему действию
            patchResult.undo()
          })
        }
      },
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    deleteTask: build.mutation<DefaultResponse, DeleteTaskArgs>({
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
      extraOptions: { dataSchema: defaultResponseSchema },
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
