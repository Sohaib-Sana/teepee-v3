import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { registerSchema } from "../../utils/validationSchemas";
import { registerUser, statusEnum } from "../../store/slices/authSlice";

function SignupForm({ handleSubmit }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.ui.status);

  return (
    <div className="form-shell">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form" noValidate>
            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Enter your full name:
              </label>
              <Field className="form-input" type="text" id="username" name="username" placeholder="Enter your name here" autoComplete="username" />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Enter your email address:
              </label>
              <Field className="form-input" type="email" id="email" name="email" placeholder="Enter your email" autoComplete="email" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Enter your Password:
              </label>
              <Field
                className="form-input"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                autoComplete="new-password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm your Password:
              </label>
              <Field
                className="form-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter same password"
                autoComplete="new-password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit */}
            <button className="btn btn-primary btn-block" type="submit" disabled={status === statusEnum?.Loading || isSubmitting}>
              {status === statusEnum?.Loading ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignupForm;
