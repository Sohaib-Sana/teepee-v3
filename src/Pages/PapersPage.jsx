import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPapers, addPaper, updatePaper, deletePaper } from "../store/slices/paperSlice";
import PaperAccordion from "../components/AdminComponents/PaperAccordian";
import PaperForm from "../components/AdminComponents/PaperForm";
import Button from "../components/UiComponents/Button";

export default function PapersPage() {
  const dispatch = useDispatch();
  const papers = useSelector((state) => state.papers.papers);

  const [showForm, setShowForm] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);

  // Mock API fetch
  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "Mock Paper 1",
          section: "Paper 1",
          sourceText: "Some source text",
          question: "Sample Question?",
          marks: 5,
          prompt: "Sample Prompt",
          images: [],
          pdfs: [],
        },
      ];
      dispatch(setPapers(mockData));
    }, 1000);
  }, [dispatch]);

  const handleAdd = (paper) => {
    if (editingPaper) {
      dispatch(updatePaper({ ...paper, id: editingPaper.id }));
      setEditingPaper(null);
    } else {
      dispatch(addPaper({ ...paper, id: Date.now() }));
    }
    setShowForm(false);
  };

  const handleEdit = (paper) => {
    setEditingPaper(paper);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deletePaper(id));
  };

  return (
    <div className="form-shell py-6">
      {papers.length === 0 || showForm ? (
        <PaperForm
          initialData={editingPaper}
          onSubmit={handleAdd}
          onCancel={() => {
            setEditingPaper(null);
            setShowForm(false);
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="teepee-heading">Papers</h2>
            <div className="max-w-6xl">
              <Button onClick={() => setShowForm(true)}>+ Add Paper</Button>
            </div>
          </div>
          <PaperAccordion papers={papers} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
