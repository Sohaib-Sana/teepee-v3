
import { Outlet } from "react-router-dom";
import AuthPageLeftSide from "../components/AuthComponents/AuthPageLeftSide";

function AuthLayout() {


  return (
    <section className="w-screen h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        <AuthPageLeftSide />
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="w-full">
            <Outlet/>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
