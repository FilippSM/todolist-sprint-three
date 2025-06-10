import { TaskPriority, TaskStatus } from "@/common/enums/enums"
import { baseResponseSchema } from "@/common/types"
import { z } from "zod"

/* export type DomainTask = {
  description: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
} */

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  /* title: z.number(), //чтобы ошибку вывсти*/ 
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.string().datetime({local: true}),
})
 
export type DomainTask = z.infer<typeof domainTaskSchema>

/* export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
} */

export const getTasksSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int().nonnegative(),
  items: domainTaskSchema.array(),
})
 
export type GetTasksResponse = z.infer<typeof getTasksSchema>

//create and update task
export const taskOperationResponseSchema = baseResponseSchema(
  z.object({
    item: domainTaskSchema,
  }),
)
export type TaskOperationResponse = z.infer<typeof taskOperationResponseSchema>


export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}

export type DeleteTaskArgs = {
  todolistId: string, 
  taskId: string
}

export type CreateTaskArgs = {
  todolistId: string, 
  title: string
}