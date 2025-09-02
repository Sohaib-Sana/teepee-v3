import { useState } from "react";
import Input from "../UiComponents/Input";
import TextArea from "../UiComponents/TextArea";
import Dropdown from "../UiComponents/DropDown";
import Button from "../UiComponents/Button";
import Incrementer from "../UiComponents/incrementer";
import PDFUpload from "../AdminComponents/PDFUpload";

export default function PaperForm({ initialData, onSubmit, onCancel }) {
  const [paperName, setPaperName] = useState(initialData?.name || "");
  const [section, setSection] = useState(initialData?.section || "Paper 1");
  const [sourceText, setSourceText] = useState(initialData?.sourceText || "");
  const [question, setQuestion] = useState(initialData?.question || "");
  const [marks, setMarks] = useState(initialData?.marks || 0);
  const [prompt, setPrompt] = useState(initialData?.prompt || "");
  const [images, setImages] = useState(initialData?.images || []);
  const [pdfs, setPdfs] = useState(initialData?.pdfs || []);

  const tabEnum = {
    Manual: "Manual",
    Upload: "Upload",
  };
  const [tab, setTab] = useState(tabEnum.Manual);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === tabEnum.Upload && pdfs.length < 3) {
      alert("Please upload 3 PDFs.");
      return;
    }
    onSubmit({
      name: paperName,
      section,
      sourceText,
      question,
      marks,
      prompt,
      images,
      pdfs,
    });
  };

  return (
    <form className="form space-y-4" onSubmit={handleSubmit}>
      <Input label="Paper Name" value={paperName} onChange={(e) => setPaperName(e.target.value)} required />

      <Dropdown label="Section" value={section} onChange={(e) => setSection(e.target.value)} options={["Paper 1", "Paper 2", "Paper 3"]} />

      {/* Tabs for Manual vs PDF Upload */}
      <div className="flex gap-4 mb-4">
        <button type="button" onClick={() => setTab(tabEnum.Manual)} className={`btn ${tab === tabEnum.Manual ? "btn-primary" : "bg-gray-200"}`}>
          Manual Entry
        </button>
        <button type="button" onClick={() => setTab(tabEnum.Upload)} className={`btn ${tab === tabEnum.Upload ? "btn-primary" : "bg-gray-200"}`}>
          Upload PDF
        </button>
      </div>

      {tab === tabEnum.Manual ? (
        <>
          <TextArea label="Source Text" value={sourceText} onChange={(e) => setSourceText(e.target.value)} />
          <TextArea label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <div className="form-group">
            <label className="form-label">Marks</label>
            <Incrementer value={marks} setValue={setMarks} />
          </div>
          <div className="form-group">
            <label className="form-label">Upload Image</label>
            <input type="file" multiple onChange={handleImageUpload} />
          </div>
          <TextArea label="Prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </>
      ) : (
        <PDFUpload pdfs={pdfs} setPdfs={setPdfs} />
      )}

      <div className="flex gap-4">
        <Button type="submit">{initialData ? "Update" : "Submit"}</Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
