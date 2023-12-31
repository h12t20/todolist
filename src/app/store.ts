import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "features/TodolistList/tasks-reducer";
import { todoListsReducer } from "features/TodolistList/todolists-reducer";
import { appReducer } from "./app-reducer";
import { authReducer } from "features/login/auth-reducer";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
  },
});
//types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
