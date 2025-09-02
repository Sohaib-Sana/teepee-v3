import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export const emailLogin = createAsyncThunk("auth/emailLogin", async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    const token = response.data?.access_token;
    console.log(token);
    return { token };
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
    const token = response.data?.access_token;
    return { token };
  } catch (error) {
    console.error("Error creating new user by OTP:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to register user");
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
