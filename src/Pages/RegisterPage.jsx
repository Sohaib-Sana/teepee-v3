import React from "react";
import SignupForm from "../components/AuthComponents/SignupForm";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSteps, setAuthView } from "../store/slices/authUiSlice";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAreadyHaveAccount = () => {
    dispatch(setAuthView(loginSteps.OptionsView));
    navigate("/login");
  };
  return (
    <div className="h-full p-6">
      <SignupForm />
      <div className="form-divider">Or</div>
      <button type="button" className="link-button" onClick={handleAreadyHaveAccount}>
        <span className="text-black/50 hover:no-underline">Already have an account? </span>
        Sign In
      </button>
    </div>
  );
}

export default RegisterPage;
