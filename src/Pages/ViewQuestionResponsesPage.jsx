import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleGetQuestionResponses, handleUpdateQuestionResponse } from "../utils/api_handlers";

function ViewQuestionResponsesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizResponseId, studentName } = location.state || {};
  const [questionResponses, setQuestionResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    if (!quizResponseId) {
      navigate("/");
      return;
    }

    const fetchQuestionResponses = async () => {
      setLoading(true);
      try {
        const data = await handleGetQuestionResponses(quizResponseId);
        setQuestionResponses(Array.isArray(data) ? data : []);
        console.log("QUESTION RESPONSES: ", data);
      } catch (error) {
        console.error("Error fetching question responses:", error);
        setQuestionResponses([]);
      }
      setLoading(false);
    };

    fetchQuestionResponses();
  }, [quizResponseId, navigate]);

  const handleEditQuestion = (questionResponse) => {
    setEditingQuestion(questionResponse.question_response_id);
    setEditValues({
      obtained_marks: questionResponse.obtained_marks || 0,
      obtained_feedback: questionResponse.obtained_feedback || ""
    });
  };

  const handleSaveEdit = async (questionResponseId) => {
    try {
      await handleUpdateQuestionResponse(
        questionResponseId,
        editValues.obtained_marks,
        editValues.obtained_feedback
      );
      
      // Update local state
      setQuestionResponses(prev => 
        prev.map(qr => 
          qr.question_response_id === questionResponseId 
            ? { ...qr, obtained_marks: editValues.obtained_marks, obtained_feedback: editValues.obtained_feedback }
            : qr
        )
      );
      
      setEditingQuestion(null);
      setEditValues({});
    } catch (error) {
      console.error("Error updating question response:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditValues({});
  };

  if (loading) return <div className="p-6">Loading question responses...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center"
        >
          ← Back to Results
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Question Responses - {studentName || "Unknown Student"}
        </h1>
      </div>

      {questionResponses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No question responses found.
        </div>
      ) : (
        <div className="space-y-6">
          {questionResponses.map((questionResponse, index) => (
            <div key={questionResponse.question_response_id} className="bg-white shadow-sm rounded-lg p-6 border">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Question {index + 1}
                </h3>
                <p className="text-gray-700 mb-3">
                  {questionResponse.question || "No question text available"}
                </p>
                
                {/* Question Image */}
                {questionResponse.image && (
                  <div className="mb-4">
                    <img
                      src={`${questionResponse.image}`}
                      alt={`Question ${index + 1}`}
                      className="max-w-full h-auto rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Answer
                  </label>
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {questionResponse.answer || "No answer provided"}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Marks
                  </label>
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {questionResponse.marks || 0}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Obtained Marks
                  </label>
                  {editingQuestion === questionResponse.question_response_id ? (
                    <input
                      type="number"
                      value={editValues.obtained_marks}
                      onChange={(e) => setEditValues(prev => ({ ...prev, obtained_marks: Number(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max={questionResponse.marks || 100}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded border text-sm">
                      {questionResponse.obtained_marks || 0}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback
                  </label>
                  {editingQuestion === questionResponse.question_response_id ? (
                    <textarea
                      value={editValues.obtained_feedback}
                      onChange={(e) => setEditValues(prev => ({ ...prev, obtained_feedback: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Enter feedback..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded border text-sm min-h-[76px]">
                      {questionResponse.obtained_feedback || "No feedback provided"}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                {editingQuestion === questionResponse.question_response_id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(questionResponse.question_response_id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditQuestion(questionResponse)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit Marks & Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewQuestionResponsesPage;