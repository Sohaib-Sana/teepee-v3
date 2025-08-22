import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: {},
});

// export const {} = appSlice.actions;
export default appSlice.reducer;
