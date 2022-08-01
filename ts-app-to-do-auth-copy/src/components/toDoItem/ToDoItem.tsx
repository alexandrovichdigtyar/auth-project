import {
  Card, Grid, Typography,
} from '@mui/material';
import React from 'react';
import CardContent from '@mui/material/CardContent';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Container } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { changeToDoCompleted, deleteToDoItem } from '../../reduxToolkit/actionsCreator';
import { toDoItemType } from '../../reduxToolkit/toDosSlice';
import { useAppDispatch } from '../../reduxToolkit/hooks';

interface Props {
  item: toDoItemType,
}

function ToDoItem({ item }: Props) {
  const dispatch = useAppDispatch();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <Grid container justifyContent="space-between" padding="15px">
        <Grid item>
          <DeleteIcon color="error" onClick={() => dispatch(deleteToDoItem(item.id))} />
        </Grid>
        <Grid item>
          <Link to={`./edit/?taskId=${item.id}`}>
            <EditIcon />
          </Link>
        </Grid>
      </Grid>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
      <Container>
        {item.isDone ? (<TaskAltIcon color="success" fontSize="large" onClick={() => dispatch(changeToDoCompleted(item))} />) : (<HighlightOffIcon color="secondary" fontSize="large" onClick={() => dispatch(changeToDoCompleted(item))} />)}
      </Container>
    </Card>
  );
}

export default ToDoItem;
