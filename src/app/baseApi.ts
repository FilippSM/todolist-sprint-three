import { AUTH_TOKEN } from "@/common/constants"
import { baseQueryWithZodValidation } from "@/common/utils"
import { handleError } from "@/common/utils/handleError"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: baseQueryWithZodValidation( async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: 'include',
      prepareHeaders: (headers) => {
        headers.set("API-KEY", import.meta.env.VITE_API_KEY)
        headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
      },
    })(args, api, extraOptions)
    
    handleError(result, api)

    return result
  }),
  endpoints: () => ({}),
  keepUnusedDataFor: 1000,
})
