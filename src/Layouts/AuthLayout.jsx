import { Outlet } from "react-router-dom";
import AuthPageLeftSide from "../components/AuthComponents/AuthPageLeftSide";

function AuthLayout() {
  return (
    <section className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        <AuthPageLeftSide />
        <div className="flex items-center justify-center h-full bg-white overflow-hidden">
          <div className="w-full">
            <div className="text-center m-10 font-bold text-3xl">Welcome to Huxley!</div>
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
