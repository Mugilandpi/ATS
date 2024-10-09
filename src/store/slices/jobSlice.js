import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // activeJobs:[],
  // holdJobs:[],
  jobs: [],
};

const jobSlice = createSlice({
  name: "jobs data",
  initialState,
  reducers: {
    setActiveJobs: (state, action) => {
      state.activeJobs = action.payload.jobs;
    },
    setHoldJobs: (state, action) => {
      state.holdJobs = action.payload.jobs;
    },
    setAllJobs: (state, action) => {
      state.jobs = action.payload.jobs;
    },
  },
});
export const { setAllJobs } = jobSlice.actions;
export default jobSlice.reducer;
