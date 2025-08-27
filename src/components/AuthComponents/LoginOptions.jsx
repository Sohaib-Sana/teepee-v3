import { useGoogleLogin } from "@react-oauth/google";

function LoginOptions({onEmail}) {

  const googleLogin =  useGoogleLogin({
    onSuccess: (credentialReponse)=>{
        console.log("Success: ", credentialReponse);
    },
    onError: (error)=>{
        console.log("ERROR: ", error)
    }
});

  return (
    <div className="form-shell">
      <div className="login-options my-10">
        Choose how would you like to sign in your<br></br> Teepee.ai account
      </div>

      <div className="space-y-4">
        <button className="w-full border rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50" onClick={()=>googleLogin()}>
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
        <button className="w-full border rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50">
          <img src="https://www.svgrepo.com/show/303144/microsoft-icon-logo.svg" alt="Microsoft" className="w-5 h-5" />
          Continue with Microsoft
        </button>
        <button className="w-full border rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50" onClick={onEmail}>Continue with Email</button>
      </div>

      {/* <div className="mt-4 flex items-center justify-center gap-2">
        <input type="checkbox" id="updates" defaultChecked className="accent-purple-600" />
        <label htmlFor="updates" className="text-sm text-gray-600">
          I want to receive updates about Teepee
        </label>
      </div> */}
{/* 
      <button type="button" className="link-button" onClick={() => {}}>
        Create new account
      </button> */}
    </div>
  );
}
export default LoginOptions;
