import React, { useRef } from "react";
import ForgotPasswordForm from "../components/AuthComponents/ForgotPasswordForm";
import { useDispatch, useSelector } from "react-redux";
import { OTPEnum, sendForgotEmail } from "../store/slices/authSlice";
import OtpVerificationForm from "../components/AuthComponents/OTPForm";
import { forgotSteps, loginSteps, setAuthView, setForgotSteps } from "../store/slices/authUiSlice";
import { useNavigate } from "react-router-dom";

function ForgotPage() {
  // const otpstatus = useSelector((state) => state.auth.otpStatus);
  const currentForgotStep = useSelector((state) => state.ui.forgotStep);
  console.log("CURRENT FORGOT STEP: ", currentForgotStep);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef("");

  const handleForgotEmail = (values, { setSubmitting }) => {
    emailRef.current = values.email;
    dispatch(sendForgotEmail(values))
      .unwrap()
      .then((payload) => {
        if (payload.is_account_exist) {
          dispatch(setForgotSteps(forgotSteps.OTP)); // 👈 action from uiSlice
        }
      })
      .catch((err) => {
        console.error(err);
      });
    setSubmitting(false);
  };

  const handleAreadyHaveAccount = () => {
    dispatch(setAuthView(loginSteps.OptionsView));
    navigate("/login");
  };

  return (
    <div className="h-full p-6">
      {currentForgotStep === forgotSteps.Email ? (
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
