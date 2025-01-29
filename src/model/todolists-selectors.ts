import { Todolist } from "../store/App";
import { RootState } from "../store/store";

export const selectTodolists = (state: RootState): Todolist[] => state.todolists