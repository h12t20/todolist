import React, {useEffect} from 'react';
import './App.css';
import {Todolist} from '../todolist/Todolist';
import {AddItemForm} from "../additemform/AddItemForm";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AppBar from '@mui/material/AppBar';
import {useApp} from "./useApp";
import {TaskPriorities, TaskStatuses} from "../api/task-api";

type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
function App() {
    useEffect(() => setTodolist(), []);
    const {
        todolists,
        addTodolist,
        setTodolist
    } = useApp();

    return (
        <div className="App">
            <div className='AppBar'>
                <Box sx={{flexGrow: 1}}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                Todolist
                            </Typography>
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>
            <Container fixed>
                <Grid container>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3} style={{padding: '20px'}}>
                    {
                        todolists.map(tl => {
                            return <Grid key={tl.id} item>
                                <Paper key={tl.id} style={{padding: '10px'}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        filter={tl.filter}
                                    />
                                </Paper> </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
