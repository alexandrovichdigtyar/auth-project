import React, { useEffect } from 'react';
import './App.css';
import {
  onAuthStateChanged,
} from 'firebase/auth';
import {
  Navigate, Route, Routes,
} from 'react-router-dom';
import { Container } from '@mui/system';
import ToDoForm from './components/toDoForm/ToDoForm';
import { auth } from './firebase-config';
import Login from './components/login/Login';
import { setCurrentUser } from './reduxToolkit/userSlice';
import ToDoPage from './components/toDoPage/ToDoPage';
import { fetchToDoItems } from './reduxToolkit/actionsCreator';
import Header from './components/header/Header';
import { useAppDispatch } from './reduxToolkit/hooks';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setCurrentUser({
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
        }));
        dispatch(fetchToDoItems(user.uid));
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Header />
      <Routes>
        <Route path="/homePage" element={<ToDoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="signup" element={<Login />} />
        <Route path="/homePage/newTask" element={<ToDoForm />} />
        <Route path="/homePage/edit/" element={<ToDoForm />} />
        <Route path="*" element={<Navigate to="/homePage" />} />
      </Routes>
    </Container>
  );
}

export default App;
