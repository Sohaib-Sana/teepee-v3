import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleGetQuizResponses } from "../utils/api_handlers";

function ViewResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = location.state || {};
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) {
      navigate("/");
      return;
    }

    const fetchQuizResponses = async () => {
      setLoading(true);
      try {
        const data = await handleGetQuizResponses(quizId);
        setResponses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching quiz responses:", error);
        setResponses([]);
      }
      setLoading(false);
    };

    fetchQuizResponses();
  }, [quizId, navigate]);

  const handleViewResponse = (response) => {
    navigate("/view-question-responses", {
      state: {
        quizResponseId: response.quiz_response_id,
        studentName: response.student_name,
      },
    });
  };

  if (loading) return <div className="p-6">Loading responses...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center">
          ← Back to Tasks
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No responses found for this quiz.</div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obtained Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{response.student_name || "Unknown Student"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{response.obtained_marks || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.response_time ? new Date(response.response_time).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleViewResponse(response)} className="text-indigo-600 hover:text-indigo-900">
                        View Response
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewResultPage;
