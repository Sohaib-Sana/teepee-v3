import { createSlice } from "@reduxjs/toolkit";
import getToken, { removeToken, setToken } from "../../utils/token_helper";
import {emailLogin, registerUser, resetPassword, sendForgotEmail, verifyOtp} from '../thunks/authThunk'


export const statusEnum = {Idle : 'idle', Loading: 'loading', Succeeded: 'succeeded', Failed: 'failed'}

const initialState = {
  isAuthenticated: false,
  user: null, // { id, name, email, role } | null
  token: getToken(), // JWT token | null
  status: statusEnum.Idle, // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action)=>{
      state.token = action.payload;
      if (action.payload) setToken(action.payload);
      else removeToken();
    },
    logout: (_) => {
      state.token = null;
      state.user = null;
      return initialState;
    },
  },
  extraReducers:
    (builder) => {
      builder
      .addCase(emailLogin.pending, (s)=>{ s.status = statusEnum.Loading, s.error = null})
      .addCase(emailLogin.fulfilled, (s, a)=>{ s.status=statusEnum.Succeeded; s.token=a.payload.token; setToken(a.payload.token), s.user = a.payload.user })
      .addCase(emailLogin.rejected, (s, a)=>{ s.status=statusEnum.Failed; s.error=a.error?.message })

      .addCase(registerUser.pending, (s)=>{ s.status=statusEnum.Loading; s.error=null })
      .addCase(registerUser.fulfilled, (s, a)=>{ s.status=statusEnum.Succeeded; s.token=a.payload.token; setToken(a.payload.token), s.user = a.payload.user })
      .addCase(registerUser.rejected, (s, a)=>{ s.status=statusEnum.Failed; s.error=a.error?.message })

      // forgot flow thunks just flip status/error here
      .addCase(sendForgotEmail.pending, (s)=>{ s.status=statusEnum.Loading; s.error=null })
      .addCase(sendForgotEmail.fulfilled, (s)=>{ s.status=statusEnum.Succeeded })
      .addCase(sendForgotEmail.rejected, (s, a)=>{ s.status=statusEnum.Failed; s.error=a.error?.message })

      .addCase(verifyOtp.pending, (s)=>{ s.status=statusEnum.Loading; s.error=null })
      .addCase(verifyOtp.fulfilled, (s)=>{ s.status=statusEnum.Succeeded })
      .addCase(verifyOtp.rejected, (s, a)=>{ s.status=statusEnum.Failed; s.error=a.error?.message })

      .addCase(resetPassword.pending, (s)=>{ s.status=statusEnum.Loading; s.error=null })
      .addCase(resetPassword.fulfilled, (s)=>{ s.status=statusEnum.Succeeded })
      .addCase(resetPassword.rejected, (s, a)=>{ s.status=statusEnum.Failed; s.error=a.error?.message })
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export * from '../thunks/authThunk';
export default authSlice.reducer;
