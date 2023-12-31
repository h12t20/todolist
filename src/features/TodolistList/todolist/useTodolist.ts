import { useCallback } from "react";
import { changeTodoTitle, deleteTodolist } from "../todolists-reducer";
import { addTasks } from "../tasks-reducer";
import { useAppDispatch, useAppSelector } from "common/hooks/hook";
import { tasksSelectorCreator } from "common/selectors/selectors";
import { TaskStatuses } from "common/enums";
import { FilterValuesType } from "common/types/types";

export const useTodolist = (todolistId: string, filter: FilterValuesType) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(tasksSelectorCreator(todolistId));
  const removeTodolist = useCallback(() => {
    dispatch(deleteTodolist(todolistId));
  }, [todolistId]);
  const addTask = useCallback(
    (title: string) => {
      return dispatch(addTasks({ todolistId, title })).unwrap();
    },
    [todolistId],
  );
  const onChangeTodoTitle = useCallback(
    (title: string) => {
      dispatch(changeTodoTitle({ todolistId, title }));
    },
    [todolistId],
  );
  let tasksForTodolist = tasks ? tasks : [];
  if (filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return {
    removeTodolist,
    addTask,
    onChangeTodoTitle,
    tasksForTodolist,
  };
};
