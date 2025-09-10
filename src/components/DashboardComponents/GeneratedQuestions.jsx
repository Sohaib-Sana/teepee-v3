import React from "react";
import { api } from "../../utils/api";
function GeneratedQuestions({ questions, setQuestions, taskConfig, setDialogOpen, setQuizId, readOnly = false }) {
  const handleShare = (paperId, quizName, humanInLoop) => {
    const quizMarks = questions.reduce((sum, q) => sum + parseInt(q.marks, 10), 0);
    const questionIdsCsv = questions.map((q) => q.question_id).join(",");
    api
      .post("/create_quiz", {
        paper_id: paperId,
        quiz_name: quizName,
        human_in_loop: humanInLoop ? 1 : 0,
        quiz_marks: quizMarks,
        question_ids_csv: questionIdsCsv,
      })
      .then((res) => {
        setQuizId?.(res.data.quiz_id);
        setDialogOpen?.(true);
      })
      .catch((error) => console.error("Error creating quiz:", error));
  };
  const handleRemove = (id) => {
    setQuestions?.((prev) => prev.filter((ques) => ques.question_id !== id));
  };
  return (
    <div className="form-shell">
      <div className="form space-y-6">
        {questions.map((ques, index) => (
          <div key={ques.question_id} className="form-group">
            {/* Question text */}
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="text-sm text-justify whitespace-pre-line">
                <span className="font-semibold">Question {index + 1}:</span>{" "}
                {(() => {
                  const lines = ques.question.replace(/ \n+/g, "\n").split("\n");
                  return (
                    <>
                      {/* First line inline (normal weight, with spacing) */}
                      <span className="leading-10 font-normal">{lines[0]}</span>
                      {/* Remaining lines stacked with spacing */}
                      {lines.slice(1).map((line, i) => (
                        <div key={i} className="leading-relaxed mb-4 font-normal">
                          {line}
                        </div>
                      ))}
                    </>
                  );
                })()}
                <span className="font-semibold">[Marks: {ques.marks}]</span>
                {ques.image && (
                  <div className="mt-3 flex justify-center">
                    <img src={`${ques.image}`} alt={`Question ${index + 1} illustration`} className="max-h-64 object-contain rounded shadow" />
                  </div>
                )}
              </div>
            </div>
            {/* Remove button */}
            {!readOnly && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => handleRemove(ques.question_id)}
                  className="btn-secondary text-[red]/70 hover:text-[red] text-[0.75rem] flex items-center gap-1"
                >
                  ✕ Remove
                </button>
              </div>
            )}
            <hr className="mt-4" />
          </div>
        ))}
        {/* Share Button */}
        {/* {!readOnly && ( */}
        <button
          type="button"
          onClick={() => {
            handleShare(taskConfig.paperId, taskConfig.quizName, taskConfig.humanInLoop);
          }}
          className="btn btn-primary btn-block"
        >
          Share Paper
        </button>
        {/* )} */}
      </div>
    </div>
  );
}
export default GeneratedQuestions;
