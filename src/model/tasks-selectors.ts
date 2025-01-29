import { TasksState, Todolist } from "../store/App";
import { RootState } from "../store/store";

export const selectTasks = (state: RootState): TasksState => state.tasks