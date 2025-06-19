import { baseApi } from "@/app/baseApi";
import { BaseResponse, CaptchaResponse } from "@/common/types";
import { LoginArgs } from "./authApi.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
    login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
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

    /* 
    Теперь я понимаю проблему. Сервер возвращает каптчу в нестандартном 
    формате - URL находится в корне объекта, а не внутри data
    поэтому нада отдельная типизация
    */
    getCaptchaUrl: build.query<CaptchaResponse, void>({
      query: () => ({
        url: "security/get-captcha-url"
      }),
    }),
  }),
})
 
export const { useMeQuery, useLoginMutation, useLogoutMutation, useGetCaptchaUrlQuery } = authApi

