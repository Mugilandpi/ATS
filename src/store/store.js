import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardSliceReducer from "./slices/dashboardSlice";
import storeCandidateSliceReducer from "./slices/storeCandidateSlice"
import jobSliceReducer from "./slices/jobSlice";
import userSliceReducer from "./slices/userSlice";
import meetingSliceReducer from "./slices/meetingslice";

export const store = configureStore({
  reducer: combineReducers({
    dashboardSliceReducer,
    jobSliceReducer,
    userSliceReducer,
    meetingSliceReducer,
    storeCandidateSliceReducer,
  }),
});
