import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, {message: "Email is required"}).email(),
  password: z.string().min(2, {message: "Passsword min three characters"}),
  rememberMe: z.boolean(),
  captcha: z.string().optional(),  //optional() - опционально
})

export type LoginInputs = z.infer<typeof loginSchema>