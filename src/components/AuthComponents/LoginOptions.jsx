import { useGoogleLogin } from "@react-oauth/google";
import { api } from "../../utils/api";
import { useDispatch } from "react-redux";
import { addToken, googleOrMicrosoftLogin, setUser } from "../../store/slices/authSlice";
import { useRevalidator } from "react-router-dom";
import { loginRequest } from "../../services/ms_auth_config";
import { useAccount, useMsal } from "@azure/msal-react";
function LoginOptions({ onEmail }) {
  const dispatch = useDispatch();
  const revalidator = useRevalidator();
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const googleLogin = useGoogleLogin({
    onSuccess: (credentialReponse) => {
      api.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialReponse.access_token}`).then(async (res) => {
        const email = res.data.email;
        const name = res.data.name;

        dispatch(setUser({ email: email, name: name }));
        const resultAction = await dispatch(googleOrMicrosoftLogin({ name, authType: 2, email }));
        if (googleOrMicrosoftLogin.fulfilled.match(resultAction) && resultAction.payload.token) {
          revalidator.revalidate();
        }
      });
    },

    onError: (error) => {
      console.log("ERROR: ", error);
    },
  });

  const handleMicrosoftLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then(async (res) => {
        console.log("RES: ", res);
        const name = res.account.name;
        const email = res.account.username;
        const resultAction = await dispatch(googleOrMicrosoftLogin({ name, authType: 3, email }));
        if (googleOrMicrosoftLogin.fulfilled.match(resultAction) && resultAction.payload.token) {
          revalidator.revalidate();
        }
      })
      .catch((e) => console.error(e));
  };

  // const handleLogout = () => {
  //   instance.logoutPopup().catch((e) => console.error(e));
  // };

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
        <button
          className="w-full border rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50"
          onClick={() => handleMicrosoftLogin()}
        >
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
