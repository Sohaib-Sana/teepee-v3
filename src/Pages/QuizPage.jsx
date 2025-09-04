import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { api } from "../utils/api";
import QuizResponse from "../components/QuizComponents/QuizResponse";

const QuizPage = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizResponse, setQuizResponse] = useState();

  useEffect(() => {
    const fetchQuiz = async () => {
      api
        .post("/view_quiz", { quiz_id: quizId })
        .then((res) => {
          console.log("/view_quiz: ", res.data.quiz_data);
          setQuizData(res.data.quiz_data);
        })
        .catch((error) => console.error("Error viewing quiz:", error))
        .finally(() => setLoading(false));
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuizSubmit = async (values) => {
    try {
      console.log("Submitting answers:", values);
      const updatedQuestions = quizData.questions.map((ques) => ({
        ...ques,
        answer: values.answers[ques.question_id] || "", // new key for each question
      }));
      setQuizData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
      api
        .post("/submit_quiz", {
          student_name: values.studentName,
          quiz_id: quizId,
          student_question_list: updatedQuestions,
        })
        .then((res) => {
          setQuizResponse(res.data.student_question_list);
          console.log(res.data);
        })
        .catch((error) => console.error("Error submitting quiz:", error));
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Something went wrong!");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (!quizData) return <p className="text-center mt-10">No quiz found.</p>;
  if (quizResponse) return <QuizResponse responseData={quizResponse} />;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white shadow-sm rounded-md p-8">
        {/* Header */}
        <h1 className="text-lg font-semibold text-center mb-6">Task Name: {quizData.quiz.quiz_name}</h1>

        <Formik initialValues={{ studentName: "", answers: {} }} onSubmit={handleQuizSubmit}>
          {({ setFieldValue }) => (
            <Form className="space-y-8">
              {/* Student Name + Source Button */}
              <div className="flex justify-between items-center">
                <div className="w-1/6">
                  <label className="block text-sm font-medium">Student Name</label>
                  <Field
                    name="studentName"
                    placeholder=""
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-1 py-2"
                  />
                </div>
                <button
                  type="button"
                  className="ml-4 bg-blue-50 border border-blue-300 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition"
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
                    <span className="text-blue-700 text-sm font-medium whitespace-nowrap flex-none min-w-[60px] text-right">{ques.marks} Marks</span>
                  </div>

                  <Field
                    as="textarea"
                    name={`answers.${ques.question_id}`}
                    placeholder="Type your answer here..."
                    rows={3}
                    className="w-full border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}

              {/* Submit Button */}
              <button type="submit" className="w-full primary-button py-2 px-0 rounded-md hover:bg-blue-100 transition">
                Submit Answers
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default QuizPage;
