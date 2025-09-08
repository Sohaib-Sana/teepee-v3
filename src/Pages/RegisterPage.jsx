import React, { useRef } from "react";
import SignupForm from "../components/AuthComponents/SignupForm";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSteps, setAuthView } from "../store/slices/authUiSlice";
import { OTPEnum, registerUser } from "../store/slices/authSlice";
import OtpVerificationForm from "../components/AuthComponents/OTPForm";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpStatus = useSelector((state) => state.auth.otpStatus);
  const emailRef = useRef("");

  const handleAreadyHaveAccount = () => {
    dispatch(setAuthView(loginSteps.OptionsView));
    navigate("/login");
  };

  const handleSubmit = (values) => {
    emailRef.current = values.email;
    dispatch(registerUser(values));
  };

  return (
    <div className="h-full p-6">
      {otpStatus === OTPEnum.Sent ? <OtpVerificationForm userEmail={emailRef.current} /> : <SignupForm handleSubmit={handleSubmit} />}
      <div className="form-divider">Or</div>
      <div className=" text-center mt-4 text-sm">
        <p>
          Already have an account?{" "}
          <span href="/login" className="link-button" onClick={handleAreadyHaveAccount}>
            Sign in
          </span>
        </p>
      </div>
      {/* <button type="button" className="link-button" onClick={handleAreadyHaveAccount}>
        <span className="text-black/50 hover:no-underline">Already have an account? </span>
        Sign In
      </button> */}
    </div>
  );
}

export default RegisterPage;
