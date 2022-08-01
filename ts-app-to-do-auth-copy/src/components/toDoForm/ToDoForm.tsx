import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, TextField,
} from '@mui/material';
import {
  Field, Form, Formik,
} from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addNewToDoItem, updateToDoItem } from '../../reduxToolkit/actionsCreator';
import { useAppDispatch, useAppSelector } from '../../reduxToolkit/hooks';
import { toDoItemType } from '../../reduxToolkit/toDosSlice';
import { RenderTextFieldType } from '../login/Login';

const emptyToDo = {
  title: '',
  description: '',
  uid: '',
  id: '',
  isDone: false,
};

function ToDoForm() {
  const toDoItems = useAppSelector((state) => state.toDoReducer.toDoItems);
  /*   const { uid: userId } = useSelector((state) => state.currentUser?.userId); */
  const currentUser = useAppSelector((state) => state.userReducer.currentUser);
  const taskId = new URLSearchParams(useLocation().search).get('taskId');
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setOpenForm(!openForm);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onCloseHandller = () => {
    setOpenForm(!openForm);
    navigate('/homePage');
  };

  const renderTextFormField: RenderTextFieldType = (props) => {
    const { field, meta } = props;
    return (
      <TextField
        label={field.name}
        type={field.name === 'confirmPassword' || field.name === 'password' ? 'password' : 'input'}
        {...field}
        variant="standard"
        error={meta.error && meta.touched}
        helperText={meta.error || (field.name === 'email' || field.name === 'passwordAccept' ? 'error' : null)}
        size="small"
        fullWidth
      />
    );
  };

  const handleSubmit = (props: toDoItemType) => {
    if (currentUser?.uid) {
      taskId ? dispatch(updateToDoItem(props)) : dispatch(addNewToDoItem(currentUser.uid, props));
      onCloseHandller();
    }
  };

  const getToDoInitialValues = () => {
    const currentToDo = toDoItems?.find((item) => item.id === taskId);
    const res = currentToDo || emptyToDo;
    return res;
  };

  const renderToDoItemForm = () => (
    <Form>
      <Grid container direction="column" spacing={4} width="500px" padding="20px">
        <Grid item xs={12} sm={6}>
          <DialogContent>
            <DialogContentText>
              Here you can edit or add new item
            </DialogContentText>
          </DialogContent>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="title">
            {renderTextFormField}
          </Field>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="description">
            {renderTextFormField}
          </Field>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DialogActions>
            <Button onClick={onCloseHandller}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Grid>
      </Grid>
    </Form>
  );

  return (
    openForm ? (
      <div>
        <Dialog open={openForm} onClose={onCloseHandller}>
          <Formik
            initialValues={getToDoInitialValues()}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {renderToDoItemForm}
          </Formik>
        </Dialog>
      </div>
    ) : (
      <div>
        wait a minnute
      </div>
    )
  );
}

export default ToDoForm;
