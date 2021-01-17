import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
  name: 'event',
  initialState: null,
  reducers: {
    initEvent(_state, action) {
      return action.payload;
    },
    createPlayers(state, action) {
      state.players.push(...action.payload);
      return state;
    },
    deletePlayer(state, action) {
      _.remove(state.players, (p) => p.id === action.payload);
      return state;
    },
    createGame(state, action) {
      state.games.push(action.payload);
      return state;
    },
    deleteGame(state, action) {
      _.remove(state.games, (g) => g.id === action.payload);
      return state;
    },
    finishEvent(state, _action) {
      state.finished = true;
      return state;
    },
    reopenEvent(state, _action) {
      state.finished = false;
      return state;
    },
    deleteEvent(_state, _action) {
      console.log(11);
      return null;
    },
    clearEvent(_state, _action) {
      return null;
    },
  },
});

export const {
  initEvent,
  createPlayers,
  deletePlayer,
  createGame,
  deleteGame,
  finishEvent,
  reopenEvent,
  deleteEvent,
  clearEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
