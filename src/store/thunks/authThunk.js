import { createAsyncThunk } from "@reduxjs/toolkit";

export const emailLogin = createAsyncThunk('auth/emailLogin', async ({email,password})=>{
    //TODO:  Call API Here
    return {token: 'fake'}
})
export const registerUser = createAsyncThunk('auth/registerUser', async ({name, email, password})=>{
    //TODO:  Call API Here
    return {token: 'fake'}
})
export const sendForgotEmail = createAsyncThunk('auth/forgotEmail', async ({email})=>{
    //TODO: Call API Here
    return {token: 'fake'}
})
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ OTP})=>{
    //TODO: Call API Here
    return {token: 'fake'}
})
export const resetPassword = createAsyncThunk('auth/resetPassword', async ({email, password})=>{
    //TODO: Call API Here
    return {token: 'fake'}
})
