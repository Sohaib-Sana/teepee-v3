// import { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Button from "../components/UiComponents/Button";
// import PDFProcessCard from "../components/AdminComponents/PDFProcessCard";
// import { handleGetPapers } from "./api_handlers";

// export default function SubjectPapersPage() {
//   const { subjectId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const subjectFromState = location.state?.subject;
//   const [subject, setSubject] = useState(subjectFromState || null);
//   const [papers, setPapers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const refreshPapers = () => {
//     if (!subjectId) return;
//     setIsLoading(true);
//     handleGetPapers(subjectId)
//       .then((data) => {
//         const list = (data && (data.paper_list || data)) || [];
//         const normalized = (Array.isArray(list) ? list : []).map((p) => ({
//           id: p.paper_id ?? p.id,
//           name: p.paper_name ?? p.name,
//           section: typeof p.section === "number" ? `Paper ${p.section}` : (p.section || "Paper 1"),
//           numQuestions: p.num_questions ?? p.question_count ?? 0,
//           createdAt: p.created_at || p.createdAt || "",
//         }));
//         setPapers(normalized);
//       })
//       .finally(() => setIsLoading(false));
//   };

//   useEffect(() => { refreshPapers(); }, [subjectId]);

//   return (
//     <div className="form-shell py-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <div className="text-sm text-slate-500">Subjects &gt; {subject?.subject_name || `Subject ${subjectId}`}</div>
//           <h2 className="teepee-heading">{subject?.subject_name || "Subject Papers"}</h2>
//         </div>
//         <Button onClick={() => navigate("/subjects")}>Back to Subjects</Button>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         <div>
//           <div className="mb-3 font-semibold">Create Paper</div>
//           <PDFProcessCard selectedSubjectId={Number(subjectId)} onSaved={refreshPapers} />
//         </div>
//         <div>
//           <div className="mb-3 font-semibold flex items-center justify-between">
//             <span>Existing Papers</span>
//             <Button onClick={refreshPapers} disabled={isLoading}>{isLoading ? "Loading..." : "Refresh"}</Button>
//           </div>
//           <div className="space-y-2">
//             {papers.length === 0 && (
//               <div className="text-gray-500">{isLoading ? "Loading papers..." : "No papers found"}</div>
//             )}
//             {papers.map((p) => (
//               <div key={p.id} className="border rounded p-3 flex items-center justify-between">
//                 <div>
//                   <div className="font-medium">{p.name}</div>
//                   <div className="text-xs text-gray-500">{p.section} • {p.numQuestions} questions {p.createdAt && `• ${p.createdAt}`}</div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button onClick={() => navigate(`/subjects/${subjectId}/papers/${p.id}`, { state: { subject, paper: p } })}>View</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
