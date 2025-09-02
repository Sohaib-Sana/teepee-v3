import { useState } from "react";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";

export default function PaperAccordion({ papers, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
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
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Source:</strong> {paper.sourceText}
              </p>
              <p>
                <strong>Question:</strong> {paper.question}
              </p>
              <p>
                <strong>Marks:</strong> {paper.marks}
              </p>
              <p>
                <strong>Prompt:</strong> {paper.prompt}
              </p>
              {paper.pdfs?.length > 0 && (
                <p>
                  <strong>PDFs:</strong> {paper.pdfs.map((f) => f.name).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
