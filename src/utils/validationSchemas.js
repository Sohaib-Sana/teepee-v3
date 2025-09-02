import * as Yup from "yup";

// Common validation rules
export const emailValidation = Yup.string().email("Invalid email address").required("Email is required");

export const passwordValidation = Yup.string().min(6, "Password must be at least 6 characters").required("Password is required");

export const usernameValidation = Yup.string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must not exceed 20 characters")
  .required("Username is required");

export const confirmPasswordValidation = (refField = "password") =>
  Yup.string()
    .oneOf([Yup.ref(refField), null], "Passwords must match")
    .required("Confirm Password is required");

export const otpValidation = Yup.string().length(6, "OTP must be 6 digits").required("OTP is required");

// Example form schemas
export const loginSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

export const registerSchema = Yup.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation("password"),
});

export const otpSchema = Yup.object({
  otp: otpValidation,
});
