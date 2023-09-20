import { AxiosResponse } from "axios";
import { AppThunk } from "app/store";
import { setAppStatusAC } from "../app/app-reducer";
import { ResponseType } from "../api/todolist-api";
import { changeTaskEntityStatusAC, ResultCode } from "../features/TodolistList/tasks-reducer";
import { changeTodolistEntityStatusAC } from "../features/TodolistList/todolists-reducer";
import { TaskType } from "../api/task-api";
import { handleServerAppError, handleServerNetworkError } from "utils";

export type ThunkReturnType = {
  task?: TaskType;
  todolistId?: string;
  taskId?: string;
  title?: string;
  value?: boolean;
  isInitialized?: boolean;
};
export const promiseHandler =
  <R>(
    promise: Promise<AxiosResponse<ResponseType<R>, ResponseType<null>>>,
    payload: ThunkReturnType | null,
    todolistId: string | null,
    taskId: string | null,
    rejectWithValue: any,
  ): AppThunk =>
  async (dispatch) => {
    try {
      todolistId && !taskId && dispatch(changeTodolistEntityStatusAC({ todolistId, status: "loading" }));
      todolistId && taskId && dispatch(changeTaskEntityStatusAC({ todolistId, taskId, status: "loading" }));
      const res = await promise;
      // @ts-ignore
      const item = payload ? null : res.data.data.item;
      if (res.data.resultCode === ResultCode.success) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
        todolistId && !taskId && dispatch(changeTodolistEntityStatusAC({ todolistId, status: "succeeded" }));
        todolistId && taskId && dispatch(changeTaskEntityStatusAC({ todolistId, taskId, status: "succeeded" }));
        if (payload) return { ...payload };
        else return { item, todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      todolistId && !taskId && dispatch(changeTodolistEntityStatusAC({ todolistId, status: "failed" }));
      todolistId && taskId && dispatch(changeTaskEntityStatusAC({ todolistId, taskId, status: "failed" }));
      return rejectWithValue(null);
    }
  };
