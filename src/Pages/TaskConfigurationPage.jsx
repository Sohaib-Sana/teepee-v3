import React, { useRef, useState } from "react";
import TaskSetupForm from "../components/DashboardComponents/TaskSetupForm";
import GeneratedQuestions from "../components/DashboardComponents/GeneratedQuestions";
import { useLoaderData } from "react-router-dom";
import ShareDialog from "../components/Dialogues/ShareQuizDialog";

function TaskConfigurationPage() {
  const loader = useLoaderData();
  const paperList = useRef(loader?.data?.paper_list || []);
  const [questions, setQuestions] = useState();
  const [taskConfig, setTaskConfig] = useState();
  const [quizLink, setQuizLink] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGenerateTask = (data) => {
    setQuestions(data.questionList);
    setTaskConfig(data.task);
  };

  return (
    <div className="">
      {/* <ShareQuizDialog open={dialogOpen} onClose={() => setDialogOpen(false)} shareLink={quizLink} /> */}
      {dialogOpen && <ShareDialog onClose={() => setDialogOpen(false)} quizLink={quizLink} />}
      <TaskSetupForm paperList={paperList.current} handleGenerateTask={handleGenerateTask} />

      {questions && (
        <>
          <div className="justify-center text-center my-10">HERE ARE YOUR QUESTIONS</div>
          <GeneratedQuestions
            questions={questions}
            setQuestions={setQuestions}
            taskConfig={taskConfig}
            setDialogOpen={setDialogOpen}
            setQuizLink={setQuizLink}
          />
        </>
      )}
    </div>
  );
}

export default TaskConfigurationPage;
