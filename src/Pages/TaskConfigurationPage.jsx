import React, { useRef, useState } from "react";
import TaskSetupForm from "../components/DashboardComponents/TaskSetupForm";
import GeneratedQuestions from "../components/DashboardComponents/GeneratedQuestions";
import { useLoaderData, useNavigate } from "react-router-dom";
import ShareDialog from "../components/Dialogues/ShareQuizDialog";

function TaskConfigurationPage() {
  const loader = useLoaderData();
  const navigate = useNavigate();
  const paperList = useRef(loader?.data?.paper_list || []);
  const [questions, setQuestions] = useState();
  const [taskConfig, setTaskConfig] = useState();
  const [quizId, setQuizId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGenerateTask = (data) => {
    setQuestions(data.questionList);
    setTaskConfig(data.task);
  };

  return (
    <div className="">
      {/* <ShareQuizDialog open={dialogOpen} onClose={() => setDialogOpen(false)} shareLink={quizLink} /> */}
      {dialogOpen && <ShareDialog onClose={() => setDialogOpen(false)} quizId={quizId} />}
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center">
        ← Back
      </button>
      <TaskSetupForm paperList={paperList.current} handleGenerateTask={handleGenerateTask} />

      {questions && (
        <>
          <div className="justify-center text-center my-10">HERE ARE YOUR QUESTIONS</div>
          <GeneratedQuestions
            questions={questions}
            setQuestions={setQuestions}
            taskConfig={taskConfig}
            setDialogOpen={setDialogOpen}
            setQuizId={setQuizId}
          />
        </>
      )}
    </div>
  );
}

export default TaskConfigurationPage;
