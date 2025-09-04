import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { handleGetPaperQuestions, handleInsertQuestion, handleUpdateQuestion, handleDeleteQuestion } from "../../utils/api_handlers";

export default function PaperAccordion({ papers, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [questionsByPaper, setQuestionsByPaper] = useState({}); // { [paperId]: Question[] }
  const [loadingQuestions, setLoadingQuestions] = useState({}); // { [paperId]: boolean }
  const [messageByPaper, setMessageByPaper] = useState({}); // { [paperId]: string }

  const [editingQuestion, setEditingQuestion] = useState(null); // {paperId, question}
  const [newQuestionByPaper, setNewQuestionByPaper] = useState({}); // { [paperId]: { question, marks, imageBase64, prompt } }

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    if (!openId) return;
    if (questionsByPaper[openId]?.length) return; // already loaded
    setLoadingQuestions((prev) => ({ ...prev, [openId]: true }));
    setMessageByPaper((prev) => ({ ...prev, [openId]: "" }));
    handleGetPaperQuestions(openId)
      .then((data) => {
        const list = (data && (data.question_list || data)) || [];
        const normalized = (Array.isArray(list) ? list : []).map((q) => ({
          id: q.question_id ?? q.id,
          question: q.question ?? q.text ?? "",
          marks: q.marks ?? 0,
          image: q.image ?? "",
          prompt: q.prompt ?? "",
        }));
        setQuestionsByPaper((prev) => ({ ...prev, [openId]: normalized }));
      })
      .catch((error) =>
        setMessageByPaper((prev) => ({
          ...prev,
          [openId]: "Error loading questions: " + (error?.message || "Unknown error"),
        }))
      )
      .finally(() => setLoadingQuestions((prev) => ({ ...prev, [openId]: false })));
  }, [openId, questionsByPaper]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleNewQuestionChange = (paperId, key, value) => {
    setNewQuestionByPaper((prev) => ({
      ...prev,
      [paperId]: {
        question: prev[paperId]?.question || "",
        marks: prev[paperId]?.marks || 0,
        image: prev[paperId]?.image || "",
        prompt: prev[paperId]?.prompt || "",
        [key]: value,
      },
    }));
  };

  const handleNewQuestionImage = async (paperId, file) => {
    if (!file) return;
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      setMessageByPaper((prev) => ({
        ...prev,
        [paperId]: "Error: Image exceeds 5MB limit",
      }));
      return;
    }
    const b64 = await fileToBase64(file);
    handleNewQuestionChange(paperId, "image", b64);
  };

  const addQuestion = (paperId) => {
    const data = newQuestionByPaper[paperId] || {};
    const qText = (data.question || "").trim();
    const marks = Number(data.marks || 0);
    const image = data.image || ""; // base64
    const prompt = data.prompt || "";
    if (!qText) {
      setMessageByPaper((prev) => ({ ...prev, [paperId]: "Question text is required" }));
      return;
    }
    handleInsertQuestion(paperId, qText, marks, image, prompt);
    // Optimistic clear and refresh
    setNewQuestionByPaper((prev) => ({ ...prev, [paperId]: { question: "", marks: 0, image: "", prompt: "" } }));
    handleGetPaperQuestions(paperId).then((data) => {
      const list = (data && (data.question_list || data)) || [];
      const normalized = (Array.isArray(list) ? list : []).map((q) => ({
        id: q.question_id ?? q.id,
        question: q.question ?? q.text ?? "",
        marks: q.marks ?? 0,
        image: q.image ?? "",
        prompt: q.prompt ?? "",
      }));
      setQuestionsByPaper((prev) => ({ ...prev, [paperId]: normalized }));
    });
  };

  const startEditQuestion = (paperId, q) => setEditingQuestion({ paperId, ...q });

  const saveEditQuestion = async () => {
    if (!editingQuestion) return;
    const { paperId, id, question, marks, image, prompt } = editingQuestion;
    handleUpdateQuestion(id, question, Number(marks || 0), image || "", prompt || "");
    setEditingQuestion(null);
    handleGetPaperQuestions(paperId).then((data) => {
      const list = (data && (data.question_list || data)) || [];
      const normalized = (Array.isArray(list) ? list : []).map((q) => ({
        id: q.question_id ?? q.id,
        question: q.question ?? q.text ?? "",
        marks: q.marks ?? 0,
        image: q.image ?? "",
        prompt: q.prompt ?? "",
      }));
      setQuestionsByPaper((prev) => ({ ...prev, [paperId]: normalized }));
    });
  };

  const onEditImageChange = async (file) => {
    if (!editingQuestion) return;
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxBytes) {
      setMessageByPaper((prev) => ({
        ...prev,
        [editingQuestion.paperId]: "Error: Image exceeds 5MB limit",
      }));
      return;
    }
    if (file) {
      const b64 = await fileToBase64(file);
      setEditingQuestion((prev) => ({ ...prev, image: b64 }));
    }
  };

  const deleteQuestion = (paperId, id) => {
    handleDeleteQuestion(id);
    setQuestionsByPaper((prev) => ({
      ...prev,
      [paperId]: (prev[paperId] || []).filter((q) => q.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      {papers.map((paper) => (
        <div key={paper.id} className="border rounded-lg shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{paper.name}</h3>
              <p className="text-sm text-gray-600">{paper.section}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onEdit(paper)}>
                <Edit size={18} className="text-blue-500" />
              </button>
              <button onClick={() => onDelete(paper.id)}>
                <Trash size={18} className="text-red-500" />
              </button>
              <button onClick={() => toggleOpen(paper.id)}>{openId === paper.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
            </div>
          </div>

          {openId === paper.id && (
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              {messageByPaper[paper.id] && (
                <div
                  className={`px-3 py-2 rounded ${
                    messageByPaper[paper.id].startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {messageByPaper[paper.id]}
                </div>
              )}

              <div>
                <p className="mb-1">
                  <strong>Source:</strong> {paper.sourceText}
                </p>
                <p className="mb-1">
                  <strong>Prompt:</strong> {paper.prompt}
                </p>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Questions</h4>
                  {loadingQuestions[paper.id] && <span className="text-xs text-gray-500">Loading...</span>}
                </div>

                {(questionsByPaper[paper.id] || []).length === 0 && !loadingQuestions[paper.id] && (
                  <div className="text-gray-500">No questions found</div>
                )}

                <div className="space-y-2">
                  {(questionsByPaper[paper.id] || []).map((q) => (
                    <div key={q.id} className="border rounded p-3">
                      {editingQuestion && editingQuestion.id === q.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full border rounded px-2 py-1"
                            value={editingQuestion.question}
                            onChange={(e) => setEditingQuestion((prev) => ({ ...prev, question: e.target.value }))}
                          />
                          <div className="flex gap-2 items-center">
                            <label className="text-xs">Marks</label>
                            <input
                              type="number"
                              className="w-24 border rounded px-2 py-1"
                              value={editingQuestion.marks}
                              onChange={(e) => setEditingQuestion((prev) => ({ ...prev, marks: e.target.value }))}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs">Prompt</label>
                            <input
                              type="text"
                              className="border rounded px-2 py-1"
                              value={editingQuestion.prompt}
                              onChange={(e) => setEditingQuestion((prev) => ({ ...prev, prompt: e.target.value }))}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="file" accept="image/*" onChange={(e) => onEditImageChange(e.target.files?.[0])} />
                            {editingQuestion.image && <img src={editingQuestion.image} alt="preview" className="h-12 w-12 object-cover rounded" />}
                          </div>
                          <div className="flex gap-2">
                            <button className="btn btn-primary" onClick={saveEditQuestion} type="button">
                              Save
                            </button>
                            <button className="btn" onClick={() => setEditingQuestion(null)} type="button">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium">{q.question}</div>
                            <div className="text-xs text-gray-500">Marks: {q.marks}</div>
                            {q.prompt && <div className="text-xs text-gray-500">Prompt: {q.prompt}</div>}
                            {q.image && <img src={q.image} alt="question" className="mt-2 h-16 w-16 object-cover rounded" />}
                          </div>
                          <div className="flex gap-2">
                            <button className="btn" onClick={() => startEditQuestion(paper.id, q)} type="button">
                              Edit
                            </button>
                            <button className="btn bg-red-500 text-white" onClick={() => deleteQuestion(paper.id, q.id)} type="button">
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new question */}
                <div className="mt-3 border rounded p-3">
                  <div className="font-semibold mb-2">Add Question</div>
                  <textarea
                    className="w-full border rounded px-2 py-1 mb-2"
                    placeholder="Question text"
                    value={newQuestionByPaper[paper.id]?.question || ""}
                    onChange={(e) => handleNewQuestionChange(paper.id, "question", e.target.value)}
                  />
                  <div className="flex items-center gap-3 mb-2">
                    <label className="text-xs">Marks</label>
                    <input
                      type="number"
                      className="w-24 border rounded px-2 py-1"
                      value={newQuestionByPaper[paper.id]?.marks || 0}
                      onChange={(e) => handleNewQuestionChange(paper.id, "marks", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 mb-2">
                    <label className="text-xs">Prompt</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={newQuestionByPaper[paper.id]?.prompt || ""}
                      onChange={(e) => handleNewQuestionChange(paper.id, "prompt", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <input type="file" accept="image/*" onChange={(e) => handleNewQuestionImage(paper.id, e.target.files?.[0])} />
                    {newQuestionByPaper[paper.id]?.image && (
                      <img src={newQuestionByPaper[paper.id]?.image} alt="preview" className="h-12 w-12 object-cover rounded" />
                    )}
                  </div>
                  <button className="btn btn-primary" type="button" onClick={() => addQuestion(paper.id)}>
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
