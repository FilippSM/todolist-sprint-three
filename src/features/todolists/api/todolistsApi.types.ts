import { baseResponseSchema } from "@/common/types"
import { z } from "zod"

/* export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
} */
/* export const TodolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.string(),
  order: z.number()
})

//enum
export type Todolist = z.infer<typeof TodolistSchema> */

export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.string().datetime({ local: true }),
  order: z.number(),
})
 
export type Todolist = z.infer<typeof todolistSchema>
 
export const createTodolistResponseSchema = baseResponseSchema(
  z.object({
    item: todolistSchema,
  }),
)
 
export type CreateTodolistResponse = z.infer<typeof createTodolistResponseSchema>
