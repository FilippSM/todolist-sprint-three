import { instance } from "@/common/instance"
import { LoginInputs } from "../lib/schemas"
import { BaseResponse } from "@/common/types"
import { MeResponse } from "./authApi.types"
import { baseApi } from "@/app/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
    login: build.mutation<BaseResponse<{ userId: number; token: string }>, MeResponse>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: "auth/login",
        method: "DELETE",
      }),
    }),
  }),
})
 
export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi


export const _authApi = {
  login(args: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number, token: string }>>("/auth/login", args)
  },
  logout() {
    return instance.delete<BaseResponse>("/auth/login")
  },
  me() {
    return instance.get<BaseResponse<MeResponse>>("auth/me")
  },
}

