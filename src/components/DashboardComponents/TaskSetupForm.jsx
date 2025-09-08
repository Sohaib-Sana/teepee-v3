import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { taskSchema } from "../../utils/validationSchemas";
import { api } from "../../utils/api";

function TaskSetupForm({ paperList, handleGenerateTask, taskConfig, readOnly = false }) {
  const handleSubmit = (values, { setSubmitting }) => {
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
        {({ isSubmitting }) => (
          <Form className="form" noValidate>
            {/* Step Header */}
            <h2 className="form-title mb-6 text-purple-600">Task Setup</h2>

            {/* Task Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="taskName">
                1. Name Your Task <span className="text-red-500">*</span>
              </label>
              {/* {readOnly ? (
                <div className="form-readonly">{initialValues.taskName}</div>
              ) : ( */}
              <>
                <Field className="form-input" type="text" id="taskName" name="taskName" placeholder="e.g Task 1" disabled={readOnly} />
                <ErrorMessage name="taskName" component="div" className="text-red-500 text-sm mt-1" />
              </>
              {/*  )} */}
            </div>

            {/* Select Paper */}
            <div className="form-group">
              <label className="form-label" htmlFor="paper">
                2. Select the paper of your choice <span className="text-red-500">*</span>
              </label>
              {/* {readOnly ? (
                <div className="form-readonly">{paperList.find((p) => p.paper_id === initialValues.paper)?.paper_name || "N/A"}</div>
              ) : ( */}
              <>
                <Field as="select" className="form-input" id="paper" name="paper">
                  <option value="">{readOnly ? taskConfig?.paperName : "Select Paper"}</option>
                  {paperList.map((paper) => (
                    <option key={paper.paper_id} value={paper.paper_id}>
                      {paper.paper_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="paper" component="div" className="text-red-500 text-sm mt-1" />
              </>
              {/* )} */}
            </div>

            {/* Feedback Choice */}
            <div className="form-group">
              <label className="form-label block mb-2">Choose how Huxley shares feedback:</label>
              <p className="text-gray-600 text-sm mb-3">Review it first (Human-in-the-loop) or send directly to students instantly.</p>

              {/* {readOnly ? (
                <div className="form-readonly">
                  {initialValues.feedback === "review" ? "Review before sharing (Human-in-the-loop)" : "Share feedback directly with students"}
                </div>
              ) : ( */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <Field type="radio" name="feedback" value="review" disabled={readOnly} />
                  <span>Review before sharing (Human-in-the-loop)</span>
                </label>

                <label className="flex items-center gap-2">
                  <Field type="radio" name="feedback" value="direct" />
                  <span>Share feedback directly with students</span>
                </label>
              </div>
              {/* )} */}

              {!readOnly && <ErrorMessage name="feedback" component="div" className="text-red-500 text-sm mt-1" />}
            </div>

            {/* Submit */}
            {!readOnly && (
              <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Generate Task"}
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TaskSetupForm;
