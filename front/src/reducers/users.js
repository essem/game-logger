import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    initUsers(_state, action) {
      return [...action.payload];
    },
    createUsers(state, action) {
      return [...state, action.payload];
    },
  },
});

export const { initUsers, createUsers } = usersSlice.actions;

export default usersSlice.reducer;
