import { useSelector } from "react-redux";
import { statusEnum } from "../../store/slices/authSlice";

function forgotPassword(){
    const status = useSelector(state => state.auth.status);
    const handleSubmit = () => {}
    return (
    <div className="form-shell">
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Enter your email address:
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Username"
                autoComplete="email"
              />
            </div>
    
            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={status === statusEnum?.Loading}
            >
              Next
            </button>
          </form>
        </div>)
}
export default forgotPassword;