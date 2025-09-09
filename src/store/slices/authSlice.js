import { createSlice } from "@reduxjs/toolkit";
import getToken, { removeToken, setToken } from "../../utils/token_helper";
import { emailLogin, googleOrMicrosoftLogin, registerUser, resetPassword, sendForgotEmail, verifyOtp } from "../thunks/authThunk";

export const statusEnum = { Idle: "idle", Loading: "loading", Succeeded: "succeeded", Failed: "failed" };
export const OTPEnum = { Idle: "idle", Sent: "sent", Valid: "valid", Invalid: "invalid" };

const initialState = {
  user: null, // { id, name, email, role, subjectId } | null
  token: getToken(), // JWT token | null
  status: statusEnum.Idle, // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  otpStatus: OTPEnum.Idle,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    addToken: (state, action) => {
      setToken(action.payload);
      state.token = action.payload;
    },
    logout: (_) => {
      removeToken();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(emailLogin.pending, (s) => {
        (s.status = statusEnum.Loading), (s.error = null);
      })
      .addCase(emailLogin.fulfilled, (s, a) => {
        s.status = statusEnum.Succeeded;
        s.token = a.payload.token;
        setToken(a.payload.token), (s.user = a.payload.user);
      })
      .addCase(emailLogin.rejected, (s, a) => {
        s.status = statusEnum.Failed;
        s.error = a.error?.message;
      })

      .addCase(registerUser.pending, (s) => {
        s.status = statusEnum.Loading;
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = statusEnum.Succeeded;
        s.otpStatus = OTPEnum.Sent;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = statusEnum.Failed;
        s.error = a.error?.message;
      })

      .addCase(verifyOtp.pending, (s) => {
        s.status = statusEnum.Loading;
        s.error = null;
      })
      .addCase(verifyOtp.fulfilled, (s, a) => {
        s.status = statusEnum.Succeeded;
        if (a.payload.is_valid_otp) {
          s.token = a.payload.token;
          setToken(a.payload.token), (s.user = a.payload.user);
        }
      })
      .addCase(verifyOtp.rejected, (s, a) => {
        s.status = statusEnum.Failed;
        s.error = a.error?.message;
      })

      .addCase(sendForgotEmail.pending, (s) => {
        s.status = statusEnum.Loading;
        s.error = null;
      })
      .addCase(sendForgotEmail.fulfilled, (s, a) => {
        s.status = statusEnum.Succeeded;
        if (a.payload.is_account_exist) {
          s.otpStatus = OTPEnum.Sent;
        }
      })
      .addCase(sendForgotEmail.rejected, (s, a) => {
        s.status = statusEnum.Failed;
        s.error = a.error?.message;
      })

      .addCase(googleOrMicrosoftLogin.pending, (s) => {
        s.status = statusEnum.Loading;
        s.error = null;
      })
      .addCase(googleOrMicrosoftLogin.fulfilled, (s, a) => {
        s.status = statusEnum.Succeeded;
        s.token = a.payload.token;
        setToken(a.payload.token);
        s.user = {
          ...s.user,
          ...a.payload.user,
        };
      })
      .addCase(googleOrMicrosoftLogin.rejected, (s, a) => {
        s.status = statusEnum.Failed;
        s.error = a.error?.message;
      })

      .addCase(resetPassword.pending, (s) => {
        s.status = statusEnum.Loading;
        s.error = null;
      })
      .addCase(resetPassword.fulfilled, (s) => {
        s.status = statusEnum.Succeeded;
      })
      .addCase(resetPassword.rejected, (s, a) => {
        s.status = statusEnum.Failed;
        s.error = a.error?.message;
      });
  },
});

export const { addToken, setUser, logout } = authSlice.actions;
export * from "../thunks/authThunk";
export default authSlice.reducer;
