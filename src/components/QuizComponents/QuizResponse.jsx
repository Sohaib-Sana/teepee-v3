import React from "react";

const QuizResponse = ({ responseData }) => {
  if (!responseData) {
    return <p className="text-center mt-10">No response found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white shadow-sm rounded-md p-8">
        {/* Header */}
        <h1 className="text-lg font-semibold text-center mb-6">Task Name: {responseData.quiz.quiz_name}</h1>

        <div className="space-y-8">
          {/* Student Info */}
          <div className="flex justify-between items-center">
            <div className="w-1/6">
              <label className="block text-sm font-medium">Student Name</label>
              <p className="border-b border-gray-400 px-1 py-2 text-gray-800">{responseData.student_name}</p>
            </div>
            <button
              type="button"
              disabled
              className="ml-4 bg-blue-50 border border-blue-300 text-blue-700 px-4 py-2 rounded-md opacity-70 cursor-not-allowed"
            >
              View Source Text
            </button>
          </div>

          {/* Questions + Answers */}
          {responseData.questions.map((ques, index) => (
            <div key={ques.question_id} className="space-y-2">
              <div className="flex justify-between items-start">
                <label className="text-sm font-medium flex-1 pr-4">
                  <span className="font-semibold">Question {index + 1}:</span> {ques.question}
                </label>
                <span className="text-blue-700 text-sm font-medium text-right w-20 shrink-0">{ques.marks} Mark</span>
              </div>

              {/* Answer (read-only) */}
              <textarea
                value={ques.answer || ""}
                readOnly
                rows={3}
                className="w-full border rounded-md px-3 py-2 resize-none bg-gray-50 text-gray-700"
              />

              {/* Feedback & Marks */}
              {ques.obtained_feedback && <p className="text-sm text-gray-600 mt-1">Feedback: {ques.obtained_feedback}</p>}
              {ques.obtained_marks !== undefined && <p className="text-sm text-green-700 font-medium">Obtained Marks: {ques.obtained_marks}</p>}
            </div>
          ))}

          {/* Summary */}
          <div className="border-t pt-4">
            <p className="text-gray-700">
              <span className="font-semibold">Total Obtained Marks:</span> {responseData.obtained_marks}
            </p>
            {responseData.obtained_feedback && (
              <p className="text-gray-700 mt-1">
                <span className="font-semibold">Overall Feedback:</span> {responseData.obtained_feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResponse;
