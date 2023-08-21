import {useCallback} from 'react';
import {changeTodoFilterAC, changeTodoTitleTC, deleteTodolistTC, FilterValuesType} from "../todolists-reducer";
import {addTasksTC, fetchTasksTC} from "../tasks-reducer";
import {TaskStatuses} from "../../../api/task-api";
import {useAppDispatch, useAppSelector} from "../../../app/hook";
export const useTodolist = (id: string, filter: FilterValuesType) => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector(state => state.tasks[id]);
    const fetchTasks = useCallback(() => {
        dispatch(fetchTasksTC(id))}, [dispatch]);
    const removeTodolist = useCallback(() => {dispatch(deleteTodolistTC(id))}, [id]);
    const onAllClickHandler = useCallback(() => dispatch(changeTodoFilterAC(id, "all")), []);
    const onActiveClickHandler = useCallback(() => dispatch(changeTodoFilterAC(id, "active")), []);
    const onCompletedClickHandler = useCallback(() =>
        dispatch(changeTodoFilterAC(id, "completed")), []);
    const addTask = useCallback((title: string) => {dispatch(addTasksTC(id, title))}, [id]);
    const onChangeTodoTitle = useCallback((newValue: string) => {
        dispatch(changeTodoTitleTC(id, newValue))}, [id])
    let tasksForTodolist = tasks;
    if (filter === "active") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    return {
        removeTodolist,
        onAllClickHandler,
        onActiveClickHandler,
        onCompletedClickHandler,
        addTask,
        onChangeTodoTitle,
        tasksForTodolist,
        fetchTasks
    }
}