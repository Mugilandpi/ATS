import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // active_users_manager:[],
  // active_users_recruiter:[],
  activeUsers: [],
  recruiters: [],
  managers: [],
};

const userSlice = createSlice({
  name: "jobs data",
  initialState,
  reducers: {
    setActiveManagers: (state, action) => {
      state.active_users_manager = action.payload.users;
    },
    setRecruiters: (state, action) => {
      state.recruiters = action.payload.recruiters;
    },
    setManagers: (state, action) => {
      state.managers = action.payload.managers;
    },
  },
});
export const { setActiveManagers, setRecruiters, setManagers } =
  userSlice.actions;
export default userSlice.reducer;
