import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { toDosSlice } from './toDosSlice';
import userSlice from './userSlice';

const rootReducer = combineReducers({
  userReducer: userSlice,
  toDoReducer: toDosSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
