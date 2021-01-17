import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    initUser(_state, action) {
      return action.payload;
    },
    clearUser(_state, _action) {
      return null;
    },
  },
});

export const { initUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
