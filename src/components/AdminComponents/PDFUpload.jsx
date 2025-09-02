import { useState } from "react";
import Loader from "../UiComponents/LoadingIndicator";

export default function PDFUpload({ pdfs, setPdfs }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 3) {
      alert("Please upload exactly 3 PDF files.");
      return;
    }
    setLoading(true);

    // Simulate backend response delay
    setTimeout(() => {
      setPdfs(files); // in real API, replace with response data
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="form-group">
      <label className="form-label">Upload 3 PDFs</label>
      <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="form-input" />

      {loading && (
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Loader size={20} />
          <span>Processing PDFs…</span>
        </div>
      )}

      {pdfs?.length > 0 && !loading && (
        <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
          {pdfs.map((pdf, i) => (
            <li key={i}>{pdf.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
