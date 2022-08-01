import {
  addDoc,
  collection, deleteDoc, doc, getDocs, query, updateDoc, where,
} from 'firebase/firestore';
import { Dispatch } from 'redux';
import { db } from '../firebase-config';
import {
  addToDoItem,
  deleteToDo, toDoComplete, toDoItemType, toDosFetching, updateToDo,
} from './toDosSlice';

const toDoColection = collection(db, 'tasks');

export const fetchToDoItems = (uid: string) => async (dispatch: Dispatch) => {
  const data = await getDocs(query(toDoColection, where('userId', '==', uid)));
  const toDoList = data.docs.map((item) => ({ ...item.data(), id: item.id }));
  dispatch(toDosFetching(toDoList));
};

export const changeToDoCompleted = (item: toDoItemType) => async (dispatch: Dispatch) => {
  updateDoc(doc(db, 'tasks', item.id), {
    isDone: !item.isDone,
  }).then(() => dispatch(toDoComplete(item)));
};

export const deleteToDoItem = (id: string) => (dispatch: Dispatch) => {
  deleteDoc(doc(db, 'tasks', id)).then(() => dispatch(deleteToDo(id)));
};

export const updateToDoItem = (item: toDoItemType) => async (dispatch: Dispatch) => {
  updateDoc(doc(db, 'tasks', item.id), {
    title: item.title,
    description: item.description,
  }).then(() => dispatch(updateToDo(item)));
};

export const addNewToDoItem = (userId: string, newTask: toDoItemType) => (dispatch: Dispatch) => {
  const newToDo = {
    ...newTask,
    userId,
    isDone: false,
  };
  addDoc(
    collection(db, 'tasks'),
    newToDo,
  ).then((docData) => dispatch(addToDoItem({
    ...newToDo,
    id: docData.id,
  })));
};
