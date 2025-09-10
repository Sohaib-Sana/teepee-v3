import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { logout, statusEnum, verifyOtp } from "../../store/slices/authSlice";
import { useRevalidator } from "react-router-dom";
import { useRef } from "react";

function OtpVerificationForm({ userEmail }) {
  const status = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const revalidator = useRevalidator();

  const inputsRef = useRef([]);

  const handleSubmit = (values, { setSubmitting }) => {
    const otp = values.digits.join(""); // merge digits
    const payload = { email: userEmail, OTP: otp };
    dispatch(verifyOtp(payload))
      .unwrap()
      .then((payload) => {
        setSubmitting(false);
        if (payload.is_valid_otp && payload.token) {
          revalidator.revalidate();
        } else {
          alert("Invalid OTP Entered!");
          // dispatch(logout());
        }
      })
      .catch((err) => {
        console.error("Dispatch error: ", err);
      });
  };

  const handleChange = (e, index, setFieldValue) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      setFieldValue(`digits[${index}]`, value);

      // Move to next input if value is entered
      if (value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="form-shell">
      <Formik initialValues={{ digits: ["", "", "", "", ""] }} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form className="form" noValidate>
            <div className="form-group text-center">
              <p className="form-subtitle font-bold">OTP Verification</p>
              <p className="form-helper">
                Please enter the verification code sent to <span className="font-semibold">{userEmail}</span>
              </p>
            </div>

            {/* OTP Fields */}
            <div className=" otp-input flex justify-center gap-3">
              {values.digits.map((digit, index) => (
                <Field
                  key={index}
                  innerRef={(el) => (inputsRef.current[index] = el)}
                  name={`digits[${index}]`}
                  type="text"
                  as="input" // 👈 this makes sure it's rendered as input directly
                  maxLength="1"
                  className="w-12 h-12 border rounded text-center text-xl 
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(e, index, setFieldValue)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {/* Error */}
            {errors.otp && touched.otp && <div className="text-red-500 text-sm mt-1">{errors.otp}</div>}

            {/* Submit */}
            <button className="btn btn-primary btn-block mt-4" type="submit" disabled={status === statusEnum?.Loading || isSubmitting}>
              {status === statusEnum?.Loading ? "Verifying..." : "Verify"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default OtpVerificationForm;
