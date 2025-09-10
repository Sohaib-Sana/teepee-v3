import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../../utils/validationSchemas";
import { emailLogin, statusEnum } from "../../store/slices/authSlice";
import { useRevalidator } from "react-router-dom";

function LoginForm() {
  const status = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const revalidator = useRevalidator();

  const handleSubmit = async (values) => {
    const resultAction = await dispatch(emailLogin(values));
    if (emailLogin.fulfilled.match(resultAction) && resultAction.payload.token) {
      revalidator.revalidate();
    }
  };

  return (
    <div className="form-shell">
      <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="form" noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Enter your email address:
              </label>
              <Field className="form-input" type="email" id="email" name="email" placeholder="Enter your Username" autoComplete="email" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password:
              </label>
              <Field
                className="form-input"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                autoComplete="current-password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              <a className="form-help-link" href="/forgot_password">
                Forgot your password?
              </a>
            </div>

            {/* Submit */}
            <button className="btn btn-primary btn-block" type="submit" disabled={status === statusEnum?.Loading || isSubmitting}>
              {status === statusEnum?.Loading ? "Signing In..." : "Sign In"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default LoginForm;
