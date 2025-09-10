import React, { useRef } from "react";
import SignupForm from "../components/AuthComponents/SignupForm";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSteps, registerSteps, setAuthView, setRegisterSteps } from "../store/slices/authUiSlice";
import { registerUser } from "../store/slices/authSlice";
import OtpVerificationForm from "../components/AuthComponents/OTPForm";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const otpStatus = useSelector((state) => state.auth.otpStatus);
  const currentRegisterStep = useSelector((state) => state.ui.registerStep);
  const emailRef = useRef("");

  const handleAreadyHaveAccount = () => {
    dispatch(setAuthView(loginSteps.OptionsView));
    navigate("/login");
  };

  const handleSubmit = (values, { setSubmitting }) => {
    emailRef.current = values.email;
    dispatch(registerUser(values))
      .unwrap()
      .then((payload) => {
        dispatch(setRegisterSteps(registerSteps.OTP));
        console.log("PAYLOAD: ", payload);
      })
      .catch((err) => console.log(err));
    setSubmitting(false);
  };

  return (
    <div className="h-full">
      {currentRegisterStep === registerSteps.OTP ? <OtpVerificationForm userEmail={emailRef.current} /> : <SignupForm handleSubmit={handleSubmit} />}
      <div className="form-divider">Or</div>
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

export default RegisterPage;
