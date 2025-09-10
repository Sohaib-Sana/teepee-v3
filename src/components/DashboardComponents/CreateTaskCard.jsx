import React from "react";
import { useNavigate, useNavigation } from "react-router-dom";

function CreateTaskCard() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading" && navigation.location?.pathname === "/configure-task";

  const handleCreateTask = () => {
    navigate("/configure-task");
  };

  return (
    <div className="max-w-md w-full text-center">
      <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white text-left">
        <div className="flex items-center mb-4">
          <div className="btn-primary text-[#A07BEC] p-2 mr-3">
            {/* Icon (simple document icon) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Create a Task</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Set practice tasks for your students in just a few clicks. Huxley takes care of marking and tracking automatically.
        </p>

        <button className="px-4 py-2 primary-button " onClick={handleCreateTask}>
          {isLoading ? "Creating..." : "Create a task"}
        </button>
      </div>
    </div>
  );
}

export default CreateTaskCard;
