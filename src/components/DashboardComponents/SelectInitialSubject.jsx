import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";

function SelectInitialSubject({}) {
  const [selected, setSelected] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("/get_subjects_for_user")
      .then((res) => {
        console.log(res.data);
        setSubjectList(res.data.subject_list || []);
        // ✅ Auto-select if there's only one subject
        if (res.data.subject_list?.length === 1) {
          setSelected(res.data.subject_list[0].subject_id);
        }
      })
      .catch((error) => console.error("Error getting subjects for user:", error));
  }, []);

  const handleUpdateUserSubject = (subjectId) => {
    api
      .post("/update_user_subject", { subject_id: subjectId })
      .then((res) => {
        dispatch(setUser({ subjectId: subjectId }));
      })
      .catch((error) => console.error("Error updating user subject:", error));
  };

  return (
    <div className="form-shell py-6">
      <div className="text-center max-w-md px-6">
        <h2 className="text-sm text-gray-500 mb-2">Welcome to Huxley!</h2>
        <p className="text-lg font-semibold mb-6">Choose your subject, and let Huxley create a personalised experience for you.</p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {/* <option value="">Select subject</option> */}
          {subjectList.map((subject) => (
            <option key={subject.subjectId} value={subject.subjectId}>
              {subject.subject_name}
            </option>
          ))}
        </select>

        <button
          disabled={!selected}
          className={`w-full py-2 rounded-md font-medium transition ${selected ? "primary-button" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          onClick={() => {
            handleUpdateUserSubject(selected);
          }}
        >
          Let’s Go!
        </button>
      </div>
    </div>
  );
}

export default SelectInitialSubject;
