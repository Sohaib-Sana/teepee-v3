import { useSelector } from "react-redux";
import { statusEnum } from "../../store/slices/authSlice";

function SignupForm() {
  const status = useSelector((state) => state.ui.status);
  const handleSubmit = () => {};
  return (
    <div className="form-shell">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Enter your full name:
          </label>
          <input className="form-input" type="username" id="username" name="username" placeholder="Enter your name here" autoComplete="username" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Enter your email address:
          </label>
          <input className="form-input" type="email" id="email" name="email" placeholder="Enter your Username" autoComplete="email" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Enter your Password:
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            autoComplete="current-password"
          />
        </div>{" "}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Confirm your Password:
          </label>
          <input
            className="form-input"
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Enter same password"
            autoComplete="current-password"
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={status === statusEnum?.Loading}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
export default SignupForm;
