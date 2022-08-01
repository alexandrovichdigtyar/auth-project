import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type currentUserType = {
  email: string | null,
  uid: string,
  photoURL?: string | null,
} | null

export type initialStateType = {
  currentUser: currentUserType | null,
}

const initialState: initialStateType = {
  currentUser: null,
};

const userSLice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser(state: initialStateType, action: PayloadAction<currentUserType>) {
      state.currentUser = action.payload;
    },
  },
});

export default userSLice.reducer;
export const { setCurrentUser } = userSLice.actions;
