import React, { useRef } from "react";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle.min.js";

const QuizResponse = ({ responseData }) => {
  const pdfRef = useRef();

  if (!responseData) {
    return <p className="text-center mt-10">No response found.</p>;
  }

  const handleDownload = () => {
    const element = pdfRef.current;
    console.log("PDF element:", element); // debug

    const opt = {
      margin: 0.5,
      filename: `${responseData.student_name}_feedback.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    // html2pdf(element, opt);
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch((err) => console.error("PDF generation failed:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl bg-white mx-auto shadow-sm rounded-md p-8">
        {/* Button outside the PDF ref */}
        <div className="flex justify-end mb-4">
          <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm">
            Download PDF
          </button>
        </div>

        <div ref={pdfRef} style={{ backgroundColor: "white", padding: "20px" }}>
          <h1 className="text-lg font-semibold text-center mb-8">Huxley’s feedback👇</h1>
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
          </div>
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
                {ques.image && (
                  <div className="mt-3 flex justify-center">
                    <img src={`${ques.image}`} alt={`Question ${index + 1} illustration`} className="max-h-64 object-contain rounded shadow" />
                  </div>
                )}

                <div className="bg-gray-50 rounded-md text-gray-700 text-sm p-3">
                  <span className="font-semibold">Student Answer: </span>
                  {ques.answer || "No answer provided."}
                </div>

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
    </div>
  );
};

export default QuizResponse;
