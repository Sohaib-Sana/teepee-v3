import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPapers, addPaper, updatePaper, deletePaper } from "../store/slices/paperSlice";
import PaperAccordion from "../components/AdminComponents/PaperAccordian";
import PaperForm from "../components/AdminComponents/PaperForm";
import Button from "../components/UiComponents/Button";
import {
  handleGetSubjects,
  handleInsertSubject,
  handleUpdateSubject,
  handleGetPapers,
  handleInsertPaper,
  handleUpdatePaper,
  handleDeletePaper,
} from "../utils/api_handlers";
import PDFProcessCard from "../components/AdminComponents/PDFProcessCard";

export default function PapersPage() {
  const dispatch = useDispatch();
  const papers = useSelector((state) => state.papers.papers);

  const [showForm, setShowForm] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);

  // Subjects state
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [subjectsMessage, setSubjectsMessage] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [editedSubjects, setEditedSubjects] = useState({}); // { [id]: { subject_name, state } }
  const [savingSubjectIds, setSavingSubjectIds] = useState({}); // { [id]: boolean }

  const SUBJECT_STATE_OPTIONS = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const getEditedField = (subjectId, key, fallback) => {
    const subjectEdit = editedSubjects[subjectId];
    if (!subjectEdit) return fallback;
    const value = subjectEdit[key];
    return value === undefined || value === null ? fallback : value;
  };

  const setEditedField = (subjectId, key, value) => {
    setEditedSubjects((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [key]: value,
      },
    }));
  };

  const normalizeState = (value) => {
    if (value === undefined || value === null) return 0;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "number") return value === 0 ? 0 : 1;
    const str = String(value).trim().toLowerCase();
    if (str === "0" || str === "inactive" || str === "false") return 0;
    if (str === "1" || str === "active" || str === "true") return 1;
    return 0;
  };

  // Load papers when subject changes
  useEffect(() => {
    if (!selectedSubjectId) return;
    setIsLoadingPapers(true);
    handleGetPapers(selectedSubjectId)
      .then((data) => {
        const list = (data && (data.paper_list || data)) || [];
        // Normalize into UI structure expected by PaperAccordion/PaperForm
        const normalized = (Array.isArray(list) ? list : []).map((p) => ({
          id: p.paper_id ?? p.id,
          name: p.paper_name ?? p.name,
          section: typeof p.section === "number" ? `Paper ${p.section}` : p.section || "Paper 1",
          sourceText: p.source_text ?? p.sourceText ?? "",
          question: p.question ?? p.first_question ?? "",
          marks: p.marks ?? 0,
          prompt: p.prompt ?? "",
          images: [],
          pdfs: [],
        }));
        dispatch(setPapers(normalized));
      })
      .finally(() => setIsLoadingPapers(false));
  }, [dispatch, selectedSubjectId]);

  // Load subjects
  const loadSubjects = () => {
    setIsLoadingSubjects(true);
    setSubjectsMessage("");
    handleGetSubjects()
      .then((data) => {
        const list = (data && (data.subject_list || data)) || [];
        const normalized = (Array.isArray(list) ? list : []).map((item) => {
          const rawState =
            item.state !== undefined
              ? item.state
              : item.subject_state !== undefined
              ? item.subject_state
              : item.status !== undefined
              ? item.status
              : item.is_active !== undefined
              ? item.is_active
              : undefined;
          return {
            ...item,
            state: normalizeState(rawState),
          };
        });
        setSubjects(normalized);
        setEditedSubjects({});
      })
      .catch((error) => {
        setSubjectsMessage("Error loading subjects: " + (error?.message || "Unknown error"));
      })
      .finally(() => setIsLoadingSubjects(false));
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // Add subject
  const addSubject = () => {
    const trimmed = newSubjectName.trim();
    if (!trimmed) {
      setSubjectsMessage("Please enter a subject name");
      return;
    }
    setIsAddingSubject(true);
    setSubjectsMessage("");
    handleInsertSubject(trimmed)
      .then(() => {
        setNewSubjectName("");
        setSubjectsMessage("Subject added successfully");
        loadSubjects();
      })
      .catch((error) => setSubjectsMessage("Error adding subject: " + (error?.message || "Unknown error")))
      .finally(() => setIsAddingSubject(false));
  };

  // Save a single subject
  const saveSubject = (subject) => {
    const subjectId = subject.subject_id;
    const subjectName = getEditedField(subjectId, "subject_name", subject.subject_name);
    const stateRaw = getEditedField(subjectId, "state", (subject.state ?? "1").toString());
    const state = parseInt(stateRaw, 10);

    if (!subjectName || !subjectName.trim()) {
      setSubjectsMessage("Subject name cannot be empty");
      return;
    }

    setSavingSubjectIds((prev) => ({ ...prev, [subjectId]: true }));
    setSubjectsMessage("");
    handleUpdateSubject(subjectId, state, subjectName.trim())
      .then(() => {
        setSubjectsMessage("Subject updated successfully");
        setSubjects((prev) => prev.map((s) => (s.subject_id === subjectId ? { ...s, subject_name: subjectName.trim(), state } : s)));
        setEditedSubjects((prev) => {
          const { [subjectId]: _omit, ...rest } = prev;
          return rest;
        });
      })
      .catch((error) => setSubjectsMessage("Error updating subject: " + (error?.message || "Unknown error")))
      .finally(() => setSavingSubjectIds((prev) => ({ ...prev, [subjectId]: false })));
  };

  const mapSectionToNumber = (section) => {
    const str = String(section || "").toLowerCase();
    if (str.includes("2")) return 2;
    if (str.includes("3")) return 3;
    return 1;
  };

  const handleAdd = (paper) => {
    if (!selectedSubjectId) {
      alert("Please select a subject first");
      return;
    }
    const sectionNum = mapSectionToNumber(paper.section);

    if (editingPaper) {
      handleUpdatePaper(editingPaper.id, paper.name, sectionNum, paper.sourceText);
      dispatch(updatePaper({ ...paper, id: editingPaper.id }));
      setEditingPaper(null);
    } else {
      handleInsertPaper(selectedSubjectId, paper.name, sectionNum, paper.sourceText);
      dispatch(addPaper({ ...paper, id: Date.now() }));
    }
    setShowForm(false);
    // Refresh papers from API for real-time accuracy
    handleGetPapers(selectedSubjectId).then((data) => {
      const list = (data && (data.paper_list || data)) || [];
      const normalized = (Array.isArray(list) ? list : []).map((p) => ({
        id: p.paper_id ?? p.id,
        name: p.paper_name ?? p.name,
        section: typeof p.section === "number" ? `Paper ${p.section}` : p.section || "Paper 1",
        sourceText: p.source_text ?? p.sourceText ?? "",
        question: p.question ?? p.first_question ?? "",
        marks: p.marks ?? 0,
        prompt: p.prompt ?? "",
        images: [],
        pdfs: [],
      }));
      dispatch(setPapers(normalized));
    });
  };

  const handleEdit = (paper) => {
    setEditingPaper(paper);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    handleDeletePaper(id);
    dispatch(deletePaper(id));
  };

  const selectedSubject = subjects.find((s) => s.subject_id === selectedSubjectId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Academic Papers Management</h1>
          <p className="text-gray-600">Manage subjects and their associated papers</p>
        </div>

        {/* Subjects Management Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">📚 Subjects Management</h2>
          </div>

          <div className="p-6">
            {/* Add New Subject */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Subject</h3>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="Enter subject name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => e.key === "Enter" && addSubject()}
                  />
                </div>
                <Button
                  onClick={addSubject}
                  disabled={isAddingSubject || !newSubjectName.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingSubject ? "Adding..." : "➕ Add Subject"}
                </Button>
              </div>
            </div>

            {/* Status Message */}
            {subjectsMessage && (
              <div
                className={`mb-6 px-4 py-3 rounded-lg border-l-4 ${
                  subjectsMessage.startsWith("Error") ? "bg-red-50 border-red-400 text-red-700" : "bg-green-50 border-green-400 text-green-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{subjectsMessage.startsWith("Error") ? "❌" : "✅"}</span>
                  {subjectsMessage}
                </div>
              </div>
            )}

            {/* Subjects Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingSubjects ? (
                      <tr>
                        <td className="px-6 py-8 text-center text-gray-500" colSpan={4}>
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            Loading subjects...
                          </div>
                        </td>
                      </tr>
                    ) : subjects.length === 0 ? (
                      <tr>
                        <td className="px-6 py-8 text-center text-gray-500" colSpan={4}>
                          <div className="text-gray-400">📝 No subjects found. Add your first subject above!</div>
                        </td>
                      </tr>
                    ) : (
                      subjects.map((s) => {
                        const currentName = getEditedField(s.subject_id, "subject_name", s.subject_name);
                        const currentState = getEditedField(s.subject_id, "state", (s.state ?? "1").toString());
                        const isSaving = !!savingSubjectIds[s.subject_id];
                        const isSelected = selectedSubjectId === s.subject_id;

                        return (
                          <tr
                            key={s.subject_id}
                            className={`hover:bg-gray-50 transition-colors duration-150 ${isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">#{s.subject_id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={currentName}
                                onChange={(e) => setEditedField(s.subject_id, "subject_name", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={currentState}
                                onChange={(e) => setEditedField(s.subject_id, "state", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              >
                                {SUBJECT_STATE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.value === "1" ? "🟢" : "🔴"} {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  onClick={() => saveSubject(s)}
                                  disabled={isSaving}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                                >
                                  {isSaving ? "💾 Saving..." : "💾 Save"}
                                </Button>
                                <Button
                                  onClick={() => setSelectedSubjectId(s.subject_id)}
                                  disabled={isSaving}
                                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                                    isSelected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {isSelected ? "✅ Selected" : "👁️ View"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Papers Management Section */}
        {selectedSubjectId && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-2">📄 Papers for {selectedSubject?.subject_name}</h2>
                  <p className="text-green-100 mt-1">
                    {papers.length} paper{papers.length !== 1 ? "s" : ""} available
                  </p>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  disabled={!selectedSubjectId || isLoadingPapers}
                  className="px-6 py-3 bg-white text-green-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoadingPapers ? "⏳ Loading..." : "➕ Add Paper"}
                </Button>
              </div>
            </div>

            <div className="p-6">
              {isLoadingPapers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    Loading papers...
                  </div>
                </div>
              ) : papers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📝</div>
                  <p className="text-gray-500">No papers found for this subject.</p>
                  <p className="text-gray-400 text-sm">Add your first paper using the button above!</p>
                </div>
              ) : (
                <PaperAccordion papers={papers} onEdit={handleEdit} onDelete={handleDelete} />
              )}
            </div>
          </div>
        )}

        {/* No Subject Selected State */}
        {!selectedSubjectId && subjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Subject</h3>
              <p className="text-gray-600">Choose a subject from the table above to view and manage its papers.</p>
            </div>
          </div>
        )}

        {/* PDF Processing Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">🔄 PDF Processing</h2>
            <p className="text-purple-100 mt-1">
              {selectedSubjectId ? `Process PDFs for ${selectedSubject?.subject_name}` : "Select a subject to process PDFs"}
            </p>
          </div>

          <div className="p-6">
            {!selectedSubjectId ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">📋</div>
                <p className="text-gray-500">Please select a subject to enable PDF processing.</p>
              </div>
            ) : (
              <PDFProcessCard
                selectedSubjectId={selectedSubjectId}
                onSaved={() => {
                  if (!selectedSubjectId) return;
                  handleGetPapers(selectedSubjectId).then((data) => {
                    const list = (data && (data.paper_list || data)) || [];
                    const normalized = (Array.isArray(list) ? list : []).map((p) => ({
                      id: p.paper_id ?? p.id,
                      name: p.paper_name ?? p.name,
                      section: typeof p.section === "number" ? `Paper ${p.section}` : p.section || "Paper 1",
                      sourceText: p.source_text ?? p.sourceText ?? "",
                      question: p.question ?? p.first_question ?? "",
                      marks: p.marks ?? 0,
                      prompt: p.prompt ?? "",
                      images: [],
                      pdfs: [],
                    }));
                    dispatch(setPapers(normalized));
                  });
                }}
              />
            )}
          </div>
        </div>

        {/* Paper Form Modal/Overlay */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">{editingPaper ? "✏️ Edit Paper" : "➕ Add New Paper"}</h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingPaper(null);
                    }}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <PaperForm
                  paper={editingPaper}
                  onSubmit={handleAdd}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingPaper(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">📄</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Papers in Selected Subject</p>
                <p className="text-2xl font-bold text-gray-900">{selectedSubjectId ? papers.length : "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.filter((s) => s.state === 1).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
