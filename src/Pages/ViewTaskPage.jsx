import React, { useEffect, useRef, useState } from "react";
import TaskSetupForm from "../components/DashboardComponents/TaskSetupForm";
import GeneratedQuestions from "../components/DashboardComponents/GeneratedQuestions";
import { useLoaderData, useLocation } from "react-router-dom";
import { handleViewQuiz } from "../utils/api_handlers";
import ShareDialog from "../components/Dialogues/ShareQuizDialog";

function ViewTaskPage() {
  const loader = useLoaderData();
  const location = useLocation();
  const paperList = useRef(loader?.data?.paper_list || []);
  const [questions, setQuestions] = useState();
  const [taskConfig, setTaskConfig] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quizLink, setQuizLink] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      const viewQuizDataResponse = await handleViewQuiz(location.state.quizId);
      const quiz = viewQuizDataResponse.quiz_data.quiz;

      const tempTask = {
        quizName: quiz.quiz_name,
        paperId: quiz.paper_id,
        humanInLoop: quiz.human_in_loop,
        paperName: quiz.paper_name, // Just for ReadOnly flow
      };
      setTaskConfig(tempTask);
      setQuestions(viewQuizDataResponse.quiz_data.questions);
    };
    fetchQuiz();
  }, []);

  return (
    <div>
      {dialogOpen && <ShareDialog onClose={() => setDialogOpen(false)} quizLink={quizLink} />}
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
            setDialogOpen={setDialogOpen}
            setQuizLink={setQuizLink}
          />
        </>
      )}
    </div>
  );
}

export default ViewTaskPage;
