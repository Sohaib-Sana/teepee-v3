import React, { useRef } from "react";
import ForgotPasswordForm from "../components/AuthComponents/ForgotPasswordForm";
import { useDispatch, useSelector } from "react-redux";
import { OTPEnum, sendForgotEmail } from "../store/slices/authSlice";
import OtpVerificationForm from "../components/AuthComponents/OTPForm";
import { loginSteps, setAuthView } from "../store/slices/authUiSlice";
import { useNavigate } from "react-router-dom";

function ForgotPage() {
  const otpstatus = useSelector((state) => state.auth.otpStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef("");

  const handleForgotEmail = (values, { isSubmitting }) => {
    console.log("Forgot Password Submitted:", values);
    emailRef.current = values.email;
    dispatch(sendForgotEmail(values));
  };

  const handleAreadyHaveAccount = () => {
    dispatch(setAuthView(loginSteps.OptionsView));
    navigate("/login");
  };

  return (
    <div className="h-full p-6">
      {otpstatus !== OTPEnum.Sent ? (
        <ForgotPasswordForm handleForgotEmail={handleForgotEmail} />
      ) : (
        <OtpVerificationForm userEmail={emailRef.current} />
      )}

      <div className=" text-center mt-4 text-sm">
        <p>
          Already have an account?{" "}
          <span href="/login" className="link-button" onClick={handleAreadyHaveAccount}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPage;
