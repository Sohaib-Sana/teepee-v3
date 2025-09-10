import { createSlice } from "@reduxjs/toolkit";

// export const OTPEnum = { Idle: "idle", Sent: "sent", Valid: "valid", Invalid: "invalid" };

export const userRoles = {
  Teacher: "Teacher",
  Student: "Student",
};

export const loginSteps = {
  OptionsView: "OptionsView",
  EmailView: "EmailView",
};

export const forgotSteps = {
  Email: "Email",
  OTP: "OTP",
  Reset: "Reset",
};
export const registerSteps = {
  Email: "Email",
  OTP: "OTP",
};

const initialState = {
  authUi: userRoles.Teacher /* null | authUi.Teacher | authUi.Student */,
  roleSelected: false /* Change it to true when user selects a role */,
  authView: loginSteps.OptionsView,
  forgotStep: forgotSteps.Email,
  registerStep: registerSteps.Email,
};

const authUiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUserRoleState: (state, action) => {
      state.authUi = action.payload;
      state.roleSelected = true;
    },
    setAuthView: (state, action) => {
      state.authView = action.payload;
    },
    setForgotSteps: (state, action) => {
      state.forgotStep = action.payload;
    },
    setRegisterSteps: (state, action) => {
      state.registerStep = action.payload;
    },
    resetAuthUi: (state) => {
      state.authView = initialState;
    },
  },
});

export const { setUserRoleState, setAuthView, setForgotSteps, resetAuthUi, setRegisterSteps } = authUiSlice.actions;
export default authUiSlice.reducer;
