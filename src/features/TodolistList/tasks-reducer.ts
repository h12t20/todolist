import { taskAPI, TaskStatuses, TaskType } from "api/task-api";
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from "app/app-reducer";
import { clearDataAC, todolistThunks } from "./todolists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../utils/create-app-async-thunk";
import { handleServerNetworkError, promiseHandler } from "../../utils/promise-handler-utils";
import { TodolistType } from "../../api/todolist-api";

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
export type removeTaskType = {
  todolistId: string;
  taskId: string;
};
export type AddTaskArgType = {
  todolistId: string;
  title: string;
};
export type UpdateTaskArgType = {
  taskId: string;
  todolistId: string;
  newValue: string | null;
  newStatus: TaskStatuses | null;
};
export type UpdateTaskReturnType = { todolistId: string; taskId: string; task: TaskType };
const initialState: TasksStateType = {};
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await taskAPI.readTasks(todolistId);
      const tasks = res.data.items;
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);
export const addTasks = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "tasks/addTasks",
  async (arg: AddTaskArgType, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return dispatch<any>(
      promiseHandler(taskAPI.createTask(arg.todolistId, arg.title), null, arg.todolistId, null, rejectWithValue),
    );
  },
);

export const updateTask = createAppAsyncThunk<UpdateTaskReturnType, UpdateTaskArgType>(
  "tasks/updateTask",
  async ({ taskId, todolistId, newValue, newStatus }, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const task = getState().tasks[todolistId].find((t) => t.id === taskId);
    if (task) {
      const changedTask = {
        ...task,
        title: newValue != null ? newValue : task.title,
        status: newStatus != null ? newStatus : task.status,
      };
      return dispatch<any>(
        promiseHandler(
          taskAPI.updateTask(todolistId, taskId, changedTask),
          { taskId, task: changedTask, todolistId },
          todolistId,
          taskId,
          rejectWithValue,
        ),
      );
    } else {
      dispatch(setAppErrorAC({ error: "Task not found" }));
      return rejectWithValue(null);
    }
  },
);

export const removeTasks = createAppAsyncThunk<removeTaskType, removeTaskType>(
  "tasks/removeTask",
  async ({ todolistId, taskId }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return dispatch<any>(
      promiseHandler(
        taskAPI.deleteTask(todolistId, taskId),
        { taskId, todolistId },
        todolistId,
        taskId,
        rejectWithValue,
      ),
    );
  },
);

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeTaskEntityStatusAC(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        status: RequestStatusType;
      }>,
    ) {
      const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) state[action.payload.todolistId][index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistThunks.createTodolist.fulfilled, (state, action) => {
        return {
          ...state,
          [action.payload.todoList.id]: [],
        };
      })
      .addCase(todolistThunks.deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistThunks.fetchTodolist.fulfilled, (state, action) => {
        action.payload.data.forEach((tl: TodolistType) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearDataAC, () => initialState)
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((t) => ({
          ...t,
          entityStatus: "idle",
        }));
      })
      .addCase(addTasks.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({
          ...action.payload.task,
          entityStatus: "idle",
        });
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId);
        if (index > -1) state[action.payload.todolistId][index] = action.payload.task;
      })
      .addCase(removeTasks.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId);
        if (index > -1) state[action.payload.todolistId].splice(index, 1);
      });
  },
});
export const {changeTaskEntityStatusAC} = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTasks, updateTask, removeTasks };
