import { useSelector } from "react-redux";
import SelectInitialSubject from "../components/DashboardComponents/SelectInitialSubject";
import CreateTaskCard from "../components/DashboardComponents/CreateTaskCard";
import MyTasks from "../components/DashboardComponents/MyTasks";
function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const subjectId = user?.subjectId;

  return !subjectId ? (
    <SelectInitialSubject dispatch />
  ) : (
    <div>
      <h1 className="text-xl font-semibold mb-6">Welcome to Huxley</h1>
      <p className="text-gray-600 mb-10">
        Your space to create tasks, organise classes, and keep track of your student’s progress — all in one place.
      </p>
      {/* Uncomment this div jb koi task Already created nae hai... */}
      {/* <div className="flex items-center justify-center min-h-screen bg-gray-50"> */}
      <CreateTaskCard />
      <MyTasks />

      {/* </div> */}
    </div>
  );
  // return !subjectId ? <SelectInitialSubject dispatch /> : <TaskSetupForm />;
  // return !subjectId ? <SelectInitialSubject dispatch /> : <QuestionList />;
}

export default Dashboard;
