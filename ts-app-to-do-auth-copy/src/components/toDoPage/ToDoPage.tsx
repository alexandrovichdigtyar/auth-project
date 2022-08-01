import {
  CircularProgress, Grid, Typography,
} from '@mui/material';
import React from 'react';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link } from 'react-router-dom';
import ToDoItem from '../toDoItem/ToDoItem';
import { useAppSelector } from '../../reduxToolkit/hooks';

function ToDoPage() {
  const currentUser = useAppSelector((state) => state.userReducer.currentUser);
  const toDoItems = useAppSelector((state) => state.toDoReducer.toDoItems);

  return (
    currentUser ? (
      <Grid container marginTop="100px" justifyContent="center">
        {!toDoItems ? (<CircularProgress />) : (
          <Grid container spacing={2}>
            {toDoItems.map((item) => (
              <Grid item xs={4} key={item.id}>
                <ToDoItem item={item} />
              </Grid>
            ))}
            <Grid item xs={4} alignItems="center" alignSelf="center" alignContent="center">
              <Link to="./newTask">
                <AddCircleOutlinedIcon fontSize="large" />
              </Link>
            </Grid>
          </Grid>
        )}
      </Grid>
    )
      : (
        <Typography textAlign="center" marginTop="100px">
          Sign in or register to use to do list...
        </Typography>
      )
  );
}

export default ToDoPage;
