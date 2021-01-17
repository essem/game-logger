import jwtDecode from 'jwt-decode';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  checkToken: true,
  token: null,
  account: '',
  admin: false,
  loading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    login(state, action) {
      if (action.payload) {
        localStorage.setItem('token', action.payload);
        const decoded = jwtDecode(action.payload);
        state.checkToken = false;
        state.token = action.payload;
        state.account = decoded.account;
        state.admin = decoded.admin;
        return state;
      }
      state.checkToken = false;
      return state;
    },
    logout(state, _action) {
      localStorage.removeItem('token');
      state.token = null;
      state.account = '';
      state.admin = null;
      return state;
    },
    setLoading(state, _action) {
      state.loading = true;
      return state;
    },
    clearLoading(state, _action) {
      state.loading = false;
      return state;
    },
  },
});

export const { login, logout, setLoading, clearLoading } = appSlice.actions;

export default appSlice.reducer;
