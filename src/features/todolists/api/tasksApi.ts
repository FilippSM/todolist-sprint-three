import { instance } from "@/common/instance"
import { GetTasksResponse, Task, UpdateTaskModel } from "./tasksApi.types"
import { BaseResponse } from "@/common/types"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },

  updateTask(todolistId: string, taskId: string, model: UpdateTaskModel) {
    return instance.put<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },

  changeTask(todolistId: string, taskId: string, model: UpdateTaskModel) {
    return instance.put<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}
