import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: {},
};

const dashboardSlice = createSlice({
  name: "dashboard data",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      // console.log(action.payload.data)
      state.dashboardData = action.payload.data;
    },
  },
});
export const { setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
