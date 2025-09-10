import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { taskSchema } from "../../utils/validationSchemas";
import { api } from "../../utils/api";
import loopAnimation from "../../assets/animations/loop_loading_animation.json";
import Lottie from "lottie-react";

function TaskSetupForm({ paperList, handleGenerateTask, taskConfig, readOnly = false }) {
  console.log("PAPERLIST: ", paperList);
  const handleSubmit = async (values, { setSubmitting }) => {
    api
      .post("/get_paper_questions", { paper_id: values.paper })
      .then((res) => {
        handleGenerateTask?.({
          questionList: res.data.question_list,
          task: {
            quizName: values.taskName,
            paperId: values.paper,
            humanInLoop: values.feedback === "review",
          },
        });
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error Generating Task: ", error);
        setSubmitting(false);
      });
  };

  const initialValues = {
    taskName: taskConfig?.quizName || "",
    paper: taskConfig?.paperId || "",
    feedback: taskConfig?.humanInLoop ? "review" : "direct",
  };

  return (
    <div className="form-shell">
      <Formik
        initialValues={initialValues}
        validationSchema={!readOnly ? taskSchema : null}
        onSubmit={readOnly ? undefined : handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting }) => (
          <Form className="form" noValidate>
            {/* Step Header */}
            {!readOnly && <h2 className="form-title mb-6 ">Task Setup</h2>}

            {/* Task Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="taskName">
                {`1.  ${readOnly ? "Task Name" : "Name Your Task"}`} {!readOnly && <span className="text-red-500">*</span>}
              </label>
              <>
                <Field className="form-input" type="text" id="taskName" name="taskName" placeholder="e.g Task 1" disabled={readOnly} />
                <ErrorMessage name="taskName" component="div" className="text-red-500 text-sm mt-1" />
              </>
            </div>

            {/* Select Paper */}
            <div className="form-group">
              <label className="form-label" htmlFor="paper">
                {`2.  ${readOnly ? "Selected Paper" : "Select the paper of your choice"}`} {!readOnly && <span className="text-red-500">*</span>}
              </label>
              <>
                <Field as="select" className="form-input" id="paper" name="paper">
                  {/* Show placeholder only when no paper is selected */}
                  {!values.paper && (
                    <option value="" disabled hidden>
                      Select Paper
                    </option>
                  )}

                  {/* Add current paper if not in paperList but exists in taskConfig */}
                  {taskConfig?.paperName && !paperList.find(p => p.paper_id === taskConfig.paperId) && (
                    <option value={taskConfig.paperId}>
                      {taskConfig.paperName}
                    </option>
                  )}

                  {paperList.map((paper) => (
                    <option key={paper.paper_id} value={paper.paper_id}>
                      {paper.paper_name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage name="paper" component="div" className="text-red-500 text-sm mt-1" />
              </>
            </div>

            {/* Feedback Choice */}
            <div className="form-group">
              <label className="form-label block mb-2">{!readOnly ? "Choose how" : "How"} Huxley shares feedback:</label>
              <p className="text-gray-600 text-sm mb-3">Review it first (Human-in-the-loop) or send directly to students instantly.</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <Field type="radio" name="feedback" value="review" disabled={readOnly} />
                  <span>Review before sharing (Human-in-the-loop)</span>
                </label>

                <label className="flex items-center gap-2">
                  <Field type="radio" name="feedback" value="direct" disabled={readOnly} />
                  <span>Share feedback directly with students</span>
                </label>
              </div>
              {!readOnly && <ErrorMessage name="feedback" component="div" className="text-red-500 text-sm mt-1" />}
            </div>

            {/* Submit */}
            {!readOnly && (
              <div className="relative flex justify-center items-center">
                {isSubmitting ? (
                  <div className="flex flex-col items-center">
                    <Lottie animationData={loopAnimation} loop={true} style={{ width: 120, height: 120 }} />
                    <p className="mt-2 text-gray-600">Generating...</p>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-block" type="submit">
                    Generate Task
                  </button>
                )}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TaskSetupForm;
