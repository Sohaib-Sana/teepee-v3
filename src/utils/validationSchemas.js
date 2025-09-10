import * as Yup from "yup";

// Common validation rules
export const emailValidation = Yup.string().email("Invalid email address").required("Email is required");

export const passwordRequiredValidation = Yup.string().required("Password is required");

export const passwordValidation = Yup.string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters")
  .matches(/[A-Za-z]/, "Password must contain at least one alphabet")
  .matches(/\d/, "Password must contain at least one number")
  .matches(/[@$!%*?&#^()_\-+={}[\]|\\:;"'<>,.?/~]/, "Password must contain at least one special character");

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
  password: passwordRequiredValidation,
});

export const registerSchema = Yup.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation("password"),
});

// export const otpSchema = Yup.object({
//   otp: otpValidation,
// });

// Validation Schema
export const taskSchema = Yup.object().shape({
  taskName: Yup.string().required("Task name is required"),
  paper: Yup.string().required("Please select a paper"),
  feedback: Yup.string().required("Please choose a feedback option"),
});

// Schema: 6-digit numeric OTP
export const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "Enter a valid 6-digit code")
    .required("OTP is required"),
});
