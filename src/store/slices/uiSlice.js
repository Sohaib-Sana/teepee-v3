import { createSlice } from "@reduxjs/toolkit";

export const userRoles = {
  Teacher: "Teacher",
  Student: "Student",
};

const initialState = {
  authUi: null /* authUi.Teacher | authUi.Student */,
  optionSelected: false /* Change it to true when option is selected */,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUserRoleState: (state, action) => {
      state.authUi = action.payload;
      state.optionSelected = true;
    },
  },
});

export const { setUserRoleState: setUserState } = uiSlice.actions;
export default uiSlice.reducer;
