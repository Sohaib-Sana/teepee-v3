import React, { useRef } from "react";
import TaskSetupForm from "../components/DashboardComponents/TaskSetupForm";
import GeneratedQuestions from "../components/DashboardComponents/GeneratedQuestions";
import { useLoaderData } from "react-router-dom";

function ViewTaskPage() {
  const loader = useLoaderData();
  const paperList = useRef(loader?.data?.paper_list || []);
  const { questions, taskConfig } = presetData;

  return (
    <div>
      <TaskSetupForm
        paperList={paperList.current}
        taskConfig={taskConfig}
        readOnly={true} // tell form to just display values, no edits
      />

      {questions && (
        <>
          <div className="justify-center text-center my-10">HERE ARE YOUR QUESTIONS</div>
          <GeneratedQuestions
            questions={questions}
            taskConfig={taskConfig}
            readOnly={true} // no editing options
          />
        </>
      )}
    </div>
  );
}

export default ViewTaskPage;
