import { baseApi } from "@/app/baseApi"
import type { DefaultResponse } from "@/common/types"
import { DomainTodolist } from "../lib/types"
import { CreateTodolistResponse, todolistSchema, type Todolist } from "./todolistsApi.types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      providesTags: ["Todolist"],
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
      extraOptions: { dataSchema: todolistSchema.array() },
    }),
    createTodolist: build.mutation<CreateTodolistResponse, string>({
      invalidatesTags: ["Todolist"],
      query: (title) => ({
        url: "/todo-lists",
        method: "POST",
        body: { title },
      }),
    }),
    deleteTodolist: build.mutation<DefaultResponse, string>({
      query: (id) => ({
        url: `/todo-lists/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
            const index = state.findIndex((todolist) => todolist.id === id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo() //откатиться к предыдцщему действию
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    changeTodolistTitle: build.mutation<DefaultResponse, { id: string; title: string }>({
      invalidatesTags: ["Todolist"],
      query: ({ id, title }) => ({
        url: `/todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
    }),
  }),
})

// `createApi` создает объект `API`, который содержит все эндпоинты в виде хуков,
// определенные в свойстве `endpoints`
export const {
  useGetTodolistsQuery,
  useCreateTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = todolistsApi
