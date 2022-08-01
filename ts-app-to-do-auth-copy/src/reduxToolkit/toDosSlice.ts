import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface toDoItemType {
  title: string,
  description: string,
  uid: string,
  isDone: boolean,
  id: string,
}

type initialStateType = {
  toDoItems: toDoItemType[] | null,
  isLoading: boolean,
}

const initialState: initialStateType = {
  toDoItems: null,
  isLoading: false,
};

export const toDosSlice = createSlice({
  name: 'toDos',
  initialState,
  reducers: {
    toDosFetching(state, action) {
      state.toDoItems = action.payload;
    },
    toDoComplete(state: initialStateType, action: PayloadAction<toDoItemType>) {
      const currentTodo = state.toDoItems?.find((item) => item.id === action.payload.id);
      if (currentTodo) {
        currentTodo.isDone = !currentTodo.isDone;
      }
    },
    deleteToDo(state: initialStateType, action: PayloadAction<string>) {
      const currentTodo = state.toDoItems?.filter((item) => item.id !== action.payload);
      if (currentTodo) {
        state.toDoItems = currentTodo;
      }
    },
    updateToDo(state: initialStateType, action: PayloadAction<toDoItemType>) {
      const updatedToDo = state.toDoItems?.find((item) => item.id === action.payload.id);
      if (updatedToDo) {
        updatedToDo.description = action.payload.description;
        updatedToDo.title = action.payload.title;
      }
    },
    addToDoItem(state: initialStateType, action: PayloadAction<toDoItemType>) {
      state.toDoItems?.push(action.payload);
    },
  },
});

export const {
  toDosFetching, toDoComplete, deleteToDo, updateToDo, addToDoItem,
} = toDosSlice.actions;
