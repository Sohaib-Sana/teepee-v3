import React from "react";

const HumanInLoopMessage = ({ studentName, quizName }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-md p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Response Submitted Successfully!</h1>
          <p className="text-gray-600">
            Hello {studentName}, your response for "{quizName}" has been submitted.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-blue-800 mb-2">What happens next?</h2>
          <p className="text-blue-700">
            Your teacher will notify you once the AI evaluation has been completed. Please wait for further instructions.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          <p>Thank you for your submission. You may now close this page.</p>
        </div>
      </div>
    </div>
  );
};

export default HumanInLoopMessage;
