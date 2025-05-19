import { z } from "zod"

/* export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
} */
export const domainTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.string(),
  order: z.number()
})

//enum
export type Todolist = z.infer<typeof domainTaskSchema>
