import { useGoogleLogin } from "@react-oauth/google";
import { api } from "../../utils/api";
import { useDispatch } from "react-redux";
import { addToken, setUser } from "../../store/slices/authSlice";
import { useRevalidator } from "react-router-dom";
function LoginOptions({ onEmail }) {
  const dispatch = useDispatch();
  const revalidator = useRevalidator();

  const googleLogin = useGoogleLogin({
    onSuccess: (credentialReponse) => {
      console.log("Success: ", credentialReponse);
      api.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialReponse.access_token}`).then((res) => {
        dispatch(addToken(credentialReponse.access_token));
        dispatch(setUser({ email: res.data.email, name: res.data.name }));
        revalidator.revalidate();
      });
    },

    onError: (error) => {
      console.log("ERROR: ", error);
    },
  });

  return (
    <div className="form-shell">
      <div className="login-options my-10">
        Choose how would you like to sign in your<br></br> Teepee.ai account
      </div>
      <div className="space-y-4">
        <button className="w-full border rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50" onClick={() => googleLogin()}>
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
        <button className="w-full border rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50">
          <img src="https://www.svgrepo.com/show/448239/microsoft.svg" alt="Microsoft" className="w-5 h-5" />
          Continue with Microsoft
        </button>
        <button className="w-full border rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50" onClick={onEmail}>
          Continue with Email
        </button>
      </div>
    </div>
  );
}
export default LoginOptions;
