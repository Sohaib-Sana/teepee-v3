import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export const emailLogin = createAsyncThunk("auth/emailLogin", async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    console.log("SADA LOGIN RESPONSE: ", response);
    const { access_token, subject_id } = response.data;
    console.log("ACCESS_TOKEN: ", access_token, "SUBJECT_ID: ", subject_id);
    return { user: { subjectId: subject_id }, token: access_token };
  } catch (error) {
    console.error("Error in email Login:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to login user by email");
  }
});

export const registerUser = createAsyncThunk("auth/registerUser", async ({ username, email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/create_new_user_by_otp_authentication", {
      email,
      password,
      name: username,
    });

    const { access_token, subject_id } = response.data;
    return { user: { subjectId: subject_id }, token: access_token };
  } catch (error) {
    console.error("Error creating new user by OTP:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to register user");
  }
});

export const googleOrMicrosoftLogin = createAsyncThunk("auth/googleOrMicrosoftLogin", async ({ email, authType, name }) => {
  try {
    const response = await api.post("/login_with_google_or_ms_verified_email", { email, auth_type: authType, name });
    const { access_token, subject_id } = response.data;
    return { user: { subjectId: subject_id }, token: access_token };
  } catch (error) {
    console.error("Error in Microsoft Login:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to login user by email");
  }
});

export const sendForgotEmail = createAsyncThunk("auth/forgotEmail", async ({ email }) => {
  //TODO: Call API Here
  return { token: "fake" };
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ OTP }) => {
  //TODO: Call API Here
  return { token: "fake" };
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ email, password }) => {
  //TODO: Call API Here
  return { token: "fake" };
});
