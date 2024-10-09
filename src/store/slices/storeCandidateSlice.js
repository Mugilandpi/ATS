import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    StoredCandidateData: {},
};

const storeCandidateSlice = createSlice({
  name: "stored candidate data",
  initialState,
  reducers: {
    // setStoredCandidateData: (state, action) => {
    //   // console.log(action.payload.data)
    //   state.StoredCandidateData = action.payload.data;
      
    // },
    setStoredCandidateData: (state, action) => {
      state.StoredCandidateData = action.payload.StoredCandidateData;
    }
  },
});
export const { setStoredCandidateData } = storeCandidateSlice.actions;
export default storeCandidateSlice.reducer;
