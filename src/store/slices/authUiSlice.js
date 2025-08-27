import { createSlice } from "@reduxjs/toolkit";

export const userRoles = {
  Teacher: "Teacher",
  Student: "Student",
};

export const loginSteps = {
  OptionsView: 'OptionsView',
  EmailView: 'EmailView',
}

export const forgotSteps = {
  Email: 'Email',
  OTP: 'OTP',
  Reset: 'Reset'
}

const initialState = {
  authUi: userRoles.Teacher /* null | authUi.Teacher | authUi.Student */,
  roleSelected: false /* Change it to true when user selects a role */,
  authView: loginSteps.OptionsView,
  forgotSteps: forgotSteps.Email,
};

const authUiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUserRoleState: (state, action) => {
      state.authUi = action.payload;
      state.roleSelected = true;
    },
    setAuthView: (state, action)=>{state.authView = action.payload;},
    setForgotSteps: (state, action)=>{state.forgotSteps = action.payload;},
    resetAuthUi: (state)=>{state.authView = initialState;},
  },
});

export const { setUserRoleState, setAuthView, setForgotSteps, resetAuthUi } = authUiSlice.actions;
export default authUiSlice.reducer;
