import React, { useEffect, useState } from "react";
import { handleGetQuizzes } from "../../utils/api_handlers";
import { useNavigate } from "react-router-dom";

function MyTasks() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const data = await handleGetQuizzes();
      setQuizzes(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="">
      {" "}
      {/* Tab Title */}
      <div className="mb-6 ">
        <button className="px-4 py-2 text-sm font-medium text-[#3B82F6] border-b-2 border-[#3B82F6]">My Tasks</button>
      </div>
      {/* Grid of Task Cards */}
      {quizzes.length === 0 ? (
        <div>No tasks found.</div>
      ) : (
        <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {quizzes.map((quiz) => {
            const formattedDate = quiz.created_at
              ? new Date(quiz.created_at).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No date";

            return (
              <div key={quiz.quiz_id} className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white flex flex-col justify-between h-full">
                {/* Title & Date */}
                <div className="mb-4">
                  <h3 className="text-base font-semibold mb-1">{quiz.quiz_name || "Untitled Quiz"}</h3>
                  <span className="text-sm text-gray-500">{formattedDate}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 mt-auto">
                  <button
                    className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => {
                      navigate("/view-task", { state: { quizId: quiz.quiz_id } });
                    }}
                  >
                    View Task
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm text-white bg-[#3B82F6] hover:bg-blue-600 transition"
                    onClick={() => {
                      navigate("/view-result", { state: { quizId: quiz.quiz_id } });
                    }}
                  >
                    View Result
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyTasks;
