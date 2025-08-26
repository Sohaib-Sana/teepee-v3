import { useSelector } from "react-redux";
import AuthPageLeftSide from "../components/AuthComponents/AuthPageLeftSide";
import UserRoleSelection from "../components/AuthComponents/UserRoleSelection";
import LoginOptions from "../components/AuthComponents/LoginOptions";
import LoginTabs from "../components/AuthComponents/LoginTabs";
import { userRoles } from "../store/slices/uiSlice";

function AuthPage() {
  const selectedUiRole = useSelector((state) => state.ui.authUi);
  const data = [
    { label: userRoles.Student, value: userRoles.Student, body: <LoginOptions /> },
    { label: userRoles.Teacher, value: userRoles.Teacher, body: <LoginOptions /> },
  ];

  return (
    <section className="w-screen h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        <AuthPageLeftSide />
        <div className="flex items-center justify-center min-h-screen bg-white">
          {!selectedUiRole ? (
            <UserRoleSelection /> // Landing page where user selects role (Teacher/Student)
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-white">
              <div className="w-full max-w-[400px] text-center">
                <div className="sign-in-label mb-[20px]">
                  <p>Join Teepee as a</p>
                </div>
                <LoginTabs data={data}/>
              </div>
            </div>
           )}
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
