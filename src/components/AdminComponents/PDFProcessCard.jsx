import { useState } from "react";
import Button from "../UiComponents/Button";
import { handleProcessThreePDFs, handleInsertPaperViaAI } from "../../utils/api_handlers";

export default function PDFProcessCard({ selectedSubjectId, onSaved }) {
  const [questionFile, setQuestionFile] = useState(null);
  const [marksheetFile, setMarksheetFile] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [paperSection, setPaperSection] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [pdfResponse, setPdfResponse] = useState(null);
  const [paperName, setPaperName] = useState("");
  const [editableSource, setEditableSource] = useState("");
  const [editableQuestions, setEditableQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const submitPaper = () => {
    setSaveMessage("");
    if (!selectedSubjectId) {
      setSaveMessage("Please select a subject before submitting.");
      return;
    }
    if (!pdfResponse) {
      setSaveMessage("Please process PDFs before submitting.");
      return;
    }
    if (!paperName.trim()) {
      setSaveMessage("Please provide a paper title.");
      return;
    }
    const questionList = editableQuestions.map((q) => ({
      question: q.question_text || "",
      marks: Number(q.marks || 0),
      image: q.data_b64 ? `data:image/png;base64,${q.data_b64}` : "",
      prompt: q.prompt || "",
    }));
    setIsSaving(true);
    handleInsertPaperViaAI(selectedSubjectId, paperName.trim(), Number(paperSection), editableSource || "", questionList)
      .then(() => {
        setSaveMessage("Paper saved successfully.");
        if (typeof onSaved === "function") {
          onSaved();
        }
      })
      .catch((error) => {
        setSaveMessage("Error saving paper: " + (error?.message || "Unknown error"));
      })
      .finally(() => setIsSaving(false));
  };

  const handleFileChange = (setter) => (e) => {
    const file = e.target.files?.[0];
    setter(file || null);
  };

  const handlePDFUpload = () => {
    if (!questionFile || !marksheetFile || !sourceFile) {
      setUploadMessage("Please select all three PDF files");
      return;
    }
    const files = [questionFile, marksheetFile, sourceFile];
    const invalid = files.filter((f) => f.type !== "application/pdf");
    if (invalid.length > 0) {
      setUploadMessage("Please select only PDF files");
      return;
    }

    setIsUploading(true);
    setUploadMessage("Processing files...");
    handleProcessThreePDFs(questionFile, marksheetFile, sourceFile, paperSection)
      .then((response) => {
        setUploadMessage("Files uploaded successfully!");
        setPdfResponse(response);
        setPaperName(response?.paper_name || "");
        setEditableSource(response?.source || "");
        const qs = Array.isArray(response?.questions) ? response.questions : [];
        setEditableQuestions(
          qs.map((q) => ({
            question_text: q.question_text || "",
            marks: q.marks || 0,
            prompt: q.prompt || "",
            data_b64: q.data_b64 || "",
          }))
        );
        setQuestionFile(null);
        setMarksheetFile(null);
        setSourceFile(null);
        setPaperSection(1);
      })
      .catch((error) => {
        setUploadMessage("Error Processing files: " + (error?.message || "Unknown error"));
        setPdfResponse(null);
      })
      .finally(() => setIsUploading(false));
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="teepee-heading mb-3">Upload PDF Files</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Question PDF</label>
            <input type="file" accept=".pdf" onChange={handleFileChange(setQuestionFile)} className="w-full border rounded px-3 py-2" />
            {questionFile && <span className="text-green-600 text-xs">✓ {questionFile.name}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Marksheet PDF</label>
            <input type="file" accept=".pdf" onChange={handleFileChange(setMarksheetFile)} className="w-full border rounded px-3 py-2" />
            {marksheetFile && <span className="text-green-600 text-xs">✓ {marksheetFile.name}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Insert/Source PDF</label>
            <input type="file" accept=".pdf" onChange={handleFileChange(setSourceFile)} className="w-full border rounded px-3 py-2" />
            {sourceFile && <span className="text-green-600 text-xs">✓ {sourceFile.name}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Paper Section</label>
            <select value={paperSection} onChange={(e) => setPaperSection(parseInt(e.target.value))} className="w-full border rounded px-3 py-2">
              <option value={1}>Paper 1</option>
              <option value={2}>Paper 2</option>
              <option value={3}>Paper 3</option>
            </select>
          </div>

          <Button onClick={handlePDFUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload PDFs"}
          </Button>

          {uploadMessage && (
            <div className={`px-3 py-2 rounded ${uploadMessage.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {uploadMessage}
            </div>
          )}
        </div>
      </div>

      {/* Paper Details & Save - always visible */}
      <div className="card p-4">
        <h3 className="teepee-heading mb-3">Paper Details & Save</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Paper Title</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              placeholder="Enter paper name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Paper Section</label>
            <select value={paperSection} onChange={(e) => setPaperSection(parseInt(e.target.value))} className="w-full border rounded px-3 py-2">
              <option value={1}>Paper 1</option>
              <option value={2}>Paper 2</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Button onClick={submitPaper}>{isSaving ? "Submitting..." : "Submit & Save Paper"}</Button>
          <div className="text-xs text-slate-500">{!selectedSubjectId ? "Select a subject" : !pdfResponse ? "Process PDFs first" : ""}</div>
          {saveMessage && (
            <div className={`px-3 py-2 rounded ${saveMessage.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {saveMessage}
            </div>
          )}
        </div>
      </div>

      {pdfResponse && (
        <div className="p-5 bg-white rounded-xl shadow border">
          <div className="text-center mb-5 border-b pb-4">
            <h2 className="text-2xl font-semibold text-slate-800">PDF Processing Results</h2>
            <p className="text-slate-500">Successfully processed your PDF files</p>
          </div>

          {pdfResponse.source && (
            <div className="mb-6 bg-slate-50 rounded-lg p-5 border">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Source Text</h3>
              <div className="bg-white border rounded p-4 whitespace-pre-wrap break-words text-slate-700">{pdfResponse.source}</div>
            </div>
          )}

          {pdfResponse.questions && pdfResponse.questions.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4 p-4 bg-blue-50 rounded border border-blue-200">
                <h3 className="m-0 text-blue-800 text-lg font-semibold">Questions Found</h3>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{pdfResponse.questions.length} questions</span>
              </div>

              <div className="grid gap-4">
                {pdfResponse.questions.map((question, index) => (
                  <div key={index} className="bg-white border-2 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 border-b pb-3">
                      <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {question.question_number || index + 1}
                      </div>
                      <h4 className="m-0 text-slate-800 text-lg font-semibold">Question {question.question_number || index + 1}</h4>
                      {question.marks && (
                        <span className="ml-auto bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{question.marks} marks</span>
                      )}
                    </div>

                    <div className="mb-4">
                      <h5 className="m-0 mb-2 text-slate-700 text-sm font-semibold">Question Text:</h5>
                      <div className="p-4 bg-slate-50 rounded border text-slate-800">{question.question_text || "No question text available"}</div>
                    </div>

                    {question.prompt && (
                      <div className="mb-4">
                        <h5 className="m-0 mb-2 text-slate-700 text-sm font-semibold">Prompt:</h5>
                        <div className="p-4 bg-amber-50 rounded border border-amber-200 text-amber-800 italic">{question.prompt}</div>
                      </div>
                    )}

                    {question.has_image && question.data_b64 && (
                      <div>
                        <h5 className="m-0 mb-2 text-slate-700 text-sm font-semibold">Image:</h5>
                        <div className="text-center p-4 bg-slate-50 rounded border">
                          <img
                            src={`data:image/png;base64,${question.data_b64}`}
                            alt={`Question ${question.question_number || index + 1} image`}
                            className="inline-block max-w-full max-h-[500px] h-auto border rounded shadow"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                          <div className="hidden p-6 bg-red-100 text-red-700 rounded border border-red-200 font-medium">Failed to load image</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!pdfResponse.questions || pdfResponse.questions.length === 0) && (
            <div className="bg-slate-50 rounded-lg p-5 border">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Raw Response Data</h3>
              <pre className="whitespace-pre-wrap break-words bg-white p-4 rounded border max-h-[500px] overflow-auto text-slate-700">
                {JSON.stringify(pdfResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
