import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const QuizResponse = ({ responseData }) => {
  const pdfRef = useRef();

  if (!responseData) {
    return <p className="text-center mt-10">No response found.</p>;
  }

  const handleDownload = () => {
    const element = pdfRef.current;

    const opt = {
      margin: 0.5,
      filename: `${responseData.student_name}_feedback.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Wrap content in ref for PDF export */}
      <div ref={pdfRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Page Header */}
        <h1 className="text-lg font-semibold text-center mb-8">Huxley’s feedback👇</h1>

        {/* Student Info Card */}
        <div className="flex justify-between items-center border border-gray-200 rounded-md p-4 mb-8">
          <div>
            <p className="text-sm text-gray-500">Student Name</p>
            <p className="font-semibold text-2xl">{responseData.student_name}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Marks Achieved</p>
            <p className="font-semibold text-xl text-gray-800">
              {responseData.obtained_marks}/{responseData.quiz.marks}
            </p>
          </div>
          <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm">
            Download PDF
          </button>
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          {responseData.questions.map((ques, index) => (
            <div key={ques.question_id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-gray-800 text-sm">
                  <span className="font-semibold">Question {index + 1}:</span>
                  {ques.question
                    .replace(/ \n+/g, " ")
                    .split("\n")
                    .map((line, i) => (
                      <p key={i} className="mb-2">
                        {line}
                      </p>
                    ))}
                </div>
                <span className="text-xs text-black font-bold">
                  {ques.obtained_marks}/{ques.marks}
                </span>
              </div>

              {/* Student Answer */}
              <div className="bg-gray-50 rounded-md text-gray-700 text-sm p-3">
                <span className="font-semibold">Student Answer: </span>
                {ques.answer || "No answer provided."}
              </div>

              {/* Feedback */}
              {ques.obtained_feedback && (
                <div className="bg-gray-100 border-l-4 border-blue-400 p-3 text-gray-700 text-sm rounded-md">
                  <span className="font-semibold text-blue-700">Huxley:</span> {ques.obtained_feedback}
                </div>
              )}
              <hr className="my-4 mb-7" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResponse;
