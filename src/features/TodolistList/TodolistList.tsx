import { useTodolistList } from "./useTodolistList";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/components";
import Paper from "@mui/material/Paper";
import { Todolist } from "./todolist/Todolist";
import Container from "@mui/material/Container";
import React from "react";
import { Navigate } from "react-router-dom";
import s from "./TodolistList.module.scss";

export const TodolistList = React.memo(() => {
  const { todo, theme, addTodolist, isLoggedIn } = useTodolistList();
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <div className={s.Container}>
      <Container fixed>
        <Grid container>
          <AddItemForm addItem={addTodolist} theme={theme} />
        </Grid>
        <Grid container spacing={3} style={{ padding: "20px", height: "85vh" }}>
          {todo.map((tl) => {
            return (
              <Grid key={tl.id} item>
                <Paper
                  key={tl.id}
                  style={{
                    padding: "10px",
                    backgroundColor: theme === "Dark" ? "rgb(51, 74, 92)" : "white",
                    border: "1px rgb(176, 196, 212) solid",
                  }}
                >
                  <Todolist
                    key={tl.id}
                    id={tl.id}
                    theme={theme}
                    title={tl.title}
                    filter={tl.filter}
                    entityStatus={tl.entityStatus}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
});
