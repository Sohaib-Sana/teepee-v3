import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleGetQuestionResponses, handleUpdateQuestionResponse } from "../utils/api_handlers";

function ViewQuestionResponsesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef();
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
      obtained_feedback: questionResponse.obtained_feedback || "",
    });
  };

  const handleSaveEdit = async (questionResponseId) => {
    try {
      await handleUpdateQuestionResponse(questionResponseId, editValues.obtained_marks, editValues.obtained_feedback);

      // Update local state
      setQuestionResponses((prev) =>
        prev.map((qr) =>
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

  const handleDownload = () => {
    // Add print styles
    const printStyles = document.createElement("style");
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #pdf-content, #pdf-content * {
          visibility: visible;
        }
        #pdf-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        .edit-buttons {
          display: none !important;
        }
        .editable-marks input {
          display: none !important;
        }
        .editable-feedback textarea {
          display: none !important;
        }
        img {
          max-width: 100% !important;
          height: auto !important;
          page-break-inside: avoid;
        }
        .space-y-8 > div {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        hr {
          page-break-after: avoid;
        }
      }
    `;
    document.head.appendChild(printStyles);

    // Add ID to the PDF content for targeting
    const element = pdfRef.current;
    element.id = "pdf-content";

    // Trigger print dialog
    setTimeout(() => {
      window.print();

      // Clean up after print dialog closes
      setTimeout(() => {
        document.head.removeChild(printStyles);
        element.removeAttribute("id");
      }, 1000);
    }, 100);
  };

  if (loading) return <div className="p-6">Loading question responses...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="no-print mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center">
          ← Back to Results
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Question Responses - {studentName || "Unknown Student"}</h1>
          <button 
            onClick={handleDownload} 
            className="no-print bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Download PDF
          </button>
        </div>
      </div>

      {questionResponses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No question responses found.</div>
      ) : (
        <div ref={pdfRef} className="space-y-8" style={{ backgroundColor: "white", padding: "20px" }}>
          {questionResponses.map((ques, index) => (
            <div key={ques.question_response_id} className="space-y-4">
              {/* Question header with marks */}
              <div className="flex justify-between items-start">
                <div className="text-gray-800 text-sm">
                  <span className="font-semibold">Question {index + 1}:</span>
                  {ques.question
                    ? ques.question
                        .replace(/ \n+/g, " ")
                        .split("\n")
                        .map((line, i) => (
                          <p key={i} className="mb-2">
                            {line}
                          </p>
                        ))
                    : "No question text available"}
                </div>
                <span className="text-xs text-black font-bold">
                  {editingQuestion === ques.question_response_id ? (
                    <input
                      type="number"
                      value={editValues.obtained_marks}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, obtained_marks: Number(e.target.value) }))}
                      className="editable-marks w-16 p-1 border border-gray-300 rounded text-center text-xs"
                      min="0"
                      max={ques.marks || 100}
                    />
                  ) : (
                    ques.obtained_marks || 0
                  )}
                  /{ques.marks}
                </span>
              </div>

              {/* Question Image */}
              {ques.image && (
                <div className="mt-3 flex justify-center">
                  <img src={`${ques.image}`} alt={`Question ${index + 1} illustration`} className="max-h-64 object-contain rounded shadow" />
                </div>
              )}

              {/* Student Answer */}
              <div className="bg-gray-50 rounded-md text-gray-700 text-sm p-3">
                <span className="font-semibold">Student Answer: </span>
                {ques.answer || "No answer provided."}
              </div>

              {/* Feedback (Editable) */}
              {editingQuestion === ques.question_response_id ? (
                <div className="editable-feedback space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Feedback:</label>
                  <textarea
                    value={editValues.obtained_feedback}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, obtained_feedback: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows="3"
                    placeholder="Enter feedback..."
                  />
                </div>
              ) : (
                ques.obtained_feedback && (
                  <div className="bg-gray-100 border-l-4 border-blue-400 p-3 text-gray-700 text-sm rounded-md whitespace-pre-line">
                    <span className="font-semibold text-blue-700">Huxley:</span> {ques.obtained_feedback}
                  </div>
                )
              )}

              {/* Action Buttons */}
              <div className="edit-buttons flex justify-end space-x-2">
                {editingQuestion === ques.question_response_id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(ques.question_response_id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    >
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition text-sm">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditQuestion(ques)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Edit Marks & Feedback
                  </button>
                )}
              </div>

              <hr className="my-4 mb-7" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewQuestionResponsesPage;
