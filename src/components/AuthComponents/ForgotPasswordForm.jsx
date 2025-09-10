import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { emailValidation } from "../../utils/validationSchemas";
import { statusEnum } from "../../store/slices/authSlice";
import * as Yup from "yup";

function ForgotPasswordForm({ handleForgotEmail }) {
  const status = useSelector((state) => state.auth.status);

  // Schema (modular, but wrapped in Yup.object here)
  const forgotPasswordSchema = Yup.object({
    email: emailValidation,
  });

  return (
    <div className="form-shell">
      <Formik initialValues={{ email: "" }} validationSchema={forgotPasswordSchema} onSubmit={handleForgotEmail}>
        {({ isSubmitting }) => (
          <Form className="form" noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Enter your email address:
              </label>
              <Field className="form-input" type="email" id="email" name="email" placeholder="Enter your email" autoComplete="email" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit */}
            <button className="btn btn-primary btn-block" type="submit" disabled={status === statusEnum?.Loading || isSubmitting}>
              {status === statusEnum?.Loading ? "Processing..." : "Next"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPasswordForm;
