import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { deleteEvent } from './event';

const initialState = {
  list: [],
  hasMore: true,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    loadEvents(state, action) {
      return {
        list: [...state.list, ...action.payload.list],
        hasMore: action.payload.hasMore,
      };
    },
    createEvent(state, action) {
      state.list.push(action.payload);
      return state;
    },
    resetEvents(_state, _action) {
      return initialState;
    },
  },
  extraReducers: {
    [deleteEvent]: (state, action) => {
      console.log(state.list, action);
      _.remove(state.list, (e) => e.id === action.payload);
      console.log(state.list);
      return state;
    },
  },
});

export const { loadEvents, createEvent, resetEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
