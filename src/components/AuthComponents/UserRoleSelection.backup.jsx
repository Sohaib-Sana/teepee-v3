import { useDispatch } from "react-redux";
import studentIcon from "../../assets/svg/student-icon.svg";
import teacherIcon from "../../assets/svg/teacher-icon.svg";
import TeepeeIcon from "../../assets/svg/teepee-icon.svg";
import { setUserState, userRoles } from "../../store/slices/uiSlice";

function UserRoleSelection() {
  const dispatch = useDispatch();

  const handleStudentCardClicked = () => {
    dispatch(setUserState(userRoles.Student));
  };

  const handleTeacherCardClicked = () => {
    dispatch(setUserState(userRoles.Teacher));
  };

  return (
    <div className="w-full max-w-md p-6 flex flex-col items-center">
      {/* Logo */}
      <img src={TeepeeIcon} alt="Huxley logo" className="w-20 h-20 mb-3" />
      {/* Heading */}
      <div className="sign-in-label mb-[20px]">
        <p>Join Huxley as a</p>{" "}
      </div>
      {/* Role Selection */}
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-12 mb-6">
        {/* Student */}
        <button
          onClick={handleStudentCardClicked}
          className="border border-gray-200 bg-[#EFB3A5]/50  rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow w-[12rem]"
        >
          <span className="text-xl font-medium text-black">Student</span>
          <div className="my-2 rounded-full flex items-center justify-center">
            <img src={studentIcon} alt="Student" className="h-[8rem]" />
          </div>
        </button>
        {/* Teacher */}
        <button
          onClick={handleTeacherCardClicked}
          className="border border-gray-200 bg-[#B89FD6]/50 rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow w-[12rem]"
        >
          <span className="text-xl font-medium text-black">Teacher</span>
          <div className="my-2 rounded-full flex items-center justify-center">
            <img src={teacherIcon} alt="Teacher" className="h-[8rem]" />
          </div>
        </button>
      </div>
      {/* Trial Info */}
      <p className="text-sm text-black">
        <span className="font-bold">14-Day Free Trial</span> — No Credit Card Required!
      </p>
    </div>
  );
}
export default UserRoleSelection;
