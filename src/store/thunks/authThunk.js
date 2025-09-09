import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export const emailLogin = createAsyncThunk("auth/emailLogin", async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    const { access_token, subject_id } = response.data;
    return { user: { subjectId: subject_id }, token: access_token };
  } catch (error) {
    console.error("Error in email Login:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to login user by email");
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

export const registerUser = createAsyncThunk("auth/registerUser", async ({ username, email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/create_new_user_by_otp_authentication", {
      email,
      password,
      name: username,
    });

    const { msg, new_user } = response.data;
    return { msg, new_user };
  } catch (error) {
    console.error("Error creating new user by OTP:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to register user");
  }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, OTP }) => {
  try {
    const response = await api.post("/verify_otp", { email, one_time_password: OTP });
    const { is_valid_otp } = response.data;
    if (is_valid_otp) {
      const { access_token, subject_id, web_user_id } = response.data;
      return { is_valid_otp, user: { subjectId: subject_id }, token: access_token };
    }
    return is_valid_otp;
  } catch (error) {
    console.error("Error in /verify_otp API:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to verify user by OTP");
  }
});

export const sendForgotEmail = createAsyncThunk("auth/forgotEmail", async ({ email }) => {
  try {
    const response = await api.post("/forgot_password_request", { email: email });
    const { is_account_exist } = response.data;
    return { is_account_exist };
  } catch (error) {
    console.error("Error in /verify_otp API:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to verify user by OTP");
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ email, password }) => {
  //TODO: Call API Here
  return { token: "fake" };
});
