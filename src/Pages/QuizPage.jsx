import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { api } from "../utils/api";
import QuizResponse from "../components/QuizComponents/QuizResponse";
import { handleViewQuiz } from "../utils/api_handlers";

const QuizPage = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizResponse, setQuizResponse] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const viewQuizDataResponse = await handleViewQuiz(quizId);
      setQuizData(viewQuizDataResponse.quiz_data);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  const handleQuizSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedQuestions = quizData.questions.map((ques) => ({
        ...ques,
        answer: values.answers[ques.question_id] || "null",
      }));

      setQuizData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));

      const res = await api.post("/submit_quiz", {
        student_name: values.studentName,
        quiz_id: quizId,
        student_question_list: updatedQuestions,
        paper_source_text: quizData.quiz.paper_source_text,
      });

      setQuizResponse({
        quiz: quizData.quiz,
        student_name: values.studentName,
        obtained_marks: res.data.obtained_marks,
        obtained_feedback: res.data.obtained_feedback,
        questions: res.data.student_question_list,
      });
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false); // always reset submitting state
    }
  };

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (!quizData) return <p className="text-center mt-10">No quiz found.</p>;

  // ✅ Show QuizResponse immediately after submission
  if (quizResponse) return <QuizResponse responseData={quizResponse} />;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white shadow-sm rounded-md p-8">
        {/* Header */}
        <h1 className="text-lg font-semibold text-center mb-6">Task Name: {quizData.quiz.quiz_name}</h1>

        <Formik initialValues={{ studentName: "", answers: {} }} onSubmit={handleQuizSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              {/* Student Name + Source Button */}
              <div className="flex justify-between items-center">
                <div className="w-1/6">
                  <label className="block text-sm font-medium">Student Name</label>
                  <Field
                    name="studentName"
                    placeholder=""
                    disabled={isSubmitting}
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-1 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="ml-4 bg-blue-50 border border-blue-300 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  View Source Text
                </button>
              </div>

              {/* Questions */}
              {quizData.questions.map((ques, index) => (
                <div key={ques.question_id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <label className="text-sm font-medium flex-1 pr-2">
                      <span className="font-semibold">Question {index + 1}:</span>{" "}
                      {ques.question
                        .replace(/ \n+/g, " ")
                        .split("\n")
                        .map((line, i) => (
                          <p key={i} className="mb-2">
                            {line}
                          </p>
                        ))}
                    </label>
                    <span className="text-blue-700 text-sm font-medium text-right w-20 shrink-0">{ques.marks} Marks</span>
                  </div>

                  <Field
                    as="textarea"
                    name={`answers.${ques.question_id}`}
                    placeholder="Type your answer here..."
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {ques.image && (
                    <div className="mt-3 flex justify-center">
                      <img src={`${ques.image}`} alt={`Question ${index + 1} illustration`} className="max-h-64 object-contain rounded shadow" />
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full primary-button py-2 px-0 rounded-md hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Answers"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default QuizPage;
