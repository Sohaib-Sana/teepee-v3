import { useDispatch, useSelector } from "react-redux";

function LoginForm() {
  const authUiState = useSelector((state) => state.ui.authUi);

  return <div className="flex items-center justify-center min-h-screen bg-white"></div>;
}

export default LoginForm;
