// meetingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState: {
    events: [],
    error: null,
  },
  reducers: {
    setMeetings: (state, action) => {
      state.events = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setMeetings, setError } = meetingsSlice.actions;

export default meetingsSlice.reducer;
