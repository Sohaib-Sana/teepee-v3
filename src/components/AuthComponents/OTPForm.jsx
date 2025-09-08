import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { statusEnum, verifyOtp } from "../../store/slices/authSlice";

import { useRevalidator } from "react-router-dom";

function OtpVerificationForm({ userEmail }) {
  const status = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const revalidator = useRevalidator();

  const handleSubmit = (values) => {
    const payload = { email: userEmail, OTP: values.otp };
    dispatch(verifyOtp(payload))
      .unwrap() // 👈 unwrap gives you the actual payload or throws
      .then((payload) => {
        if (payload.token) {
          revalidator.revalidate(); // now it will navigate correctly
        }
      })
      .catch((err) => {
        console.error("Dispatch error: ", err);
      });
  };

  return (
    <div className="form-shell">
      <Formik initialValues={{ otp: "" }} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form className="form" noValidate>
            <div className="form-group text-center">
              <p className="form-subtitle">OTP Verification</p>
              <p className="form-helper">
                Please enter the verification code sent to <span className="font-semibold">{userEmail}</span>
              </p>
            </div>

            {/* OTP Field */}
            <div className="form-group otp-input">
              <Field
                className="form-input text-center tracking-widest"
                type="text"
                id="otp"
                name="otp"
                placeholder="______"
                maxLength="6"
                inputMode="numeric"
              />
              {errors.otp && touched.otp && <div className="text-red-500 text-sm mt-1">{errors.otp}</div>}
            </div>

            {/* Submit */}
            <button className="btn btn-primary btn-block" type="submit" disabled={status === statusEnum?.Loading || isSubmitting}>
              {status === statusEnum?.Loading ? "Verifying..." : "Verify"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default OtpVerificationForm;
