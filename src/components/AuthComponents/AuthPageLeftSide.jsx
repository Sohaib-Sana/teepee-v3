import { useSelector } from "react-redux";
import TeepeeIcon from "../../assets/images/teepeeAi.png";
import Background from "../../assets/images/Rectangle.png";
import Footer from "./Footer";
import { userRoles } from "../../store/slices/authUiSlice";

function AuthPageLeftSide() {
  const authUiState = useSelector((state) => state.ui.authUi);

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-10 relative"
      style={{
        backgroundImage: `url(${Background})`,
      }}
    >
      {/* Logo */}
      <div className="jess_icon left-[35px] md:left-[35px] sm:left-[30px]">
        <img src={TeepeeIcon} alt="Teepee AI" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center items-center h-full mt-20 md:mt-0">
        <div className=" w-[495px] sm:w-[360px] md:w-[495px] text-center">
          <p className="teepee-heading">
            {authUiState === userRoles.Student ? "Hey, it's Teepee AI" : "Unlimited Exam Practice with Instant AI Marking and Feedback"}
          </p>
          <div className="teepee-sub-heading mt-6">
            {authUiState === userRoles.Student ? (
              <p>Join your class to start learning</p>
            ) : (
              <p>
                With Teepee.ai’s extensive bank of <strong>topic-specific exam questions,</strong> you can prepare students for success under{" "}
                <strong>exam conditions</strong>, <strong> reduce your workload</strong> , and gain valuable <strong>real-time insights</strong> into
                their performance.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
}

export default AuthPageLeftSide;
