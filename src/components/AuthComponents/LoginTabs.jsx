import { useState } from "react";
import { setUserState, userRoles } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";

const LoginTabs = ({ data }) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(useSelector((state) => state.ui.authUi));
  const handleTabClick = () => {
    console.log(value);
    dispatch(setUserState(value));
    setActive(value);
  };

  return (
    <div id="custom-animation" className="w-full">
      {/* Header */}
      <div className="flex justify-center">
        <div className="flex w-1/2 h-[48px] bg-white p-0 border rounded-[0.5rem] border-[#6750A4]">
          {data.map(({ label, value }, index) => {
            const isActive = active === value;

            return (
              <button
                key={value}
                onClick={handleTabClick}
                className={`
                  flex-1 text-center font-medium transition-colors
                  ${isActive ? "bg-[#6750A4] text-white" : "text-[#6750A4]"}
                `}
                style={{
                  borderRadius:
                    index === 0
                      ? isActive
                        ? "6px 0 0 6px"
                        : "6px 0 0 6px"
                      : index === data.length - 1
                      ? isActive
                        ? "0 6px 6px 0"
                        : "0 6px 6px 0"
                      : "0",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="mt-4">
        {data.map(({ value, body }) =>
          active === value ? (
            <div key={value} className="animate-fadeIn">
              {body}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default LoginTabs;
