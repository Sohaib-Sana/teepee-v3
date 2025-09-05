// import { useEffect, useMemo, useState } from "react";
// import Button from "../components/UiComponents/Button";
// import { handleGetSubjects, handleInsertSubject, handleUpdateSubject } from "./api_handlers";
// import { useNavigate } from "react-router-dom";

// export default function SubjectsPage() {
//   const navigate = useNavigate();
//   const [subjects, setSubjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [query, setQuery] = useState("");
//   const [sortKey, setSortKey] = useState("subject_name");
//   const [sortDir, setSortDir] = useState("asc");

//   const [creatingName, setCreatingName] = useState("");
//   const [isCreating, setIsCreating] = useState(false);

//   const load = () => {
//     setIsLoading(true);
//     setMessage("");
//     handleGetSubjects()
//       .then((data) => {
//         const list = (data && (data.subject_list || data)) || [];
//         setSubjects(Array.isArray(list) ? list : []);
//       })
//       .catch((e) => setMessage("Error loading subjects: " + (e?.message || "Unknown error")))
//       .finally(() => setIsLoading(false));
//   };

//   useEffect(() => { load(); }, []);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     let rows = subjects.filter((s) => !q || String(s.subject_name || "").toLowerCase().includes(q));
//     rows = rows.sort((a, b) => {
//       const av = a[sortKey];
//       const bv = b[sortKey];
//       if (av === bv) return 0;
//       if (sortDir === "asc") return av > bv ? 1 : -1;
//       return av < bv ? 1 : -1;
//     });
//     return rows;
//   }, [subjects, query, sortKey, sortDir]);

//   const toggleSort = (key) => {
//     if (sortKey === key) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//   };

//   const onCreate = () => {
//     const name = creatingName.trim();
//     if (!name) {
//       setMessage("Please enter a subject name");
//       return;
//     }
//     setIsCreating(true);
//     setMessage("");
//     handleInsertSubject(name)
//       .then(() => {
//         setCreatingName("");
//         setMessage("Subject created");
//         load();
//       })
//       .catch((e) => setMessage("Error creating subject: " + (e?.message || "Unknown error")))
//       .finally(() => setIsCreating(false));
//   };

//   const onQuickToggleState = (row) => {
//     const next = String((row.state ?? 0) ? 0 : 1);
//     handleUpdateSubject(row.subject_id, parseInt(next, 10), row.subject_name)
//       .then(() => {
//         setSubjects((prev) => prev.map((s) => (s.subject_id === row.subject_id ? { ...s, state: parseInt(next, 10) } : s)));
//       })
//       .catch((e) => setMessage("Error updating: " + (e?.message || "Unknown error")));
//   };

//   return (
//     <div className="form-shell py-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="teepee-heading">Subject Management</h2>
//         <div className="flex gap-2 items-center">
//           <input
//             value={creatingName}
//             onChange={(e) => setCreatingName(e.target.value)}
//             placeholder="New subject name"
//             className="border rounded px-3 py-2"
//           />
//           <Button onClick={onCreate} disabled={isCreating}>{isCreating ? "Creating..." : "Create New Subject"}</Button>
//         </div>
//       </div>

//       <div className="flex items-center gap-3 mb-3">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by name..."
//           className="border rounded px-3 py-2 w-full md:w-80"
//         />
//         <Button onClick={load} disabled={isLoading}>{isLoading ? "Loading..." : "Refresh"}</Button>
//       </div>

//       {message && (
//         <div className={`mb-3 px-3 py-2 rounded ${message.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{message}</div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="text-left p-3 border-b cursor-pointer" onClick={() => toggleSort("subject_name")}>Name</th>
//               <th className="text-left p-3 border-b cursor-pointer" onClick={() => toggleSort("state")}>State</th>
//               <th className="text-right p-3 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 && (
//               <tr>
//                 <td className="p-4 text-center text-gray-500" colSpan={3}>{isLoading ? "Loading..." : "No subjects found"}</td>
//               </tr>
//             )}
//             {filtered.map((s) => (
//               <tr key={s.subject_id}>
//                 <td className="p-3 border-b">{s.subject_name}</td>
//                 <td className="p-3 border-b">
//                   <span className={`px-2 py-1 rounded text-xs ${Number(s.state) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
//                     {Number(s.state) ? "Active (1)" : "Inactive (0)"}
//                   </span>
//                 </td>
//                 <td className="p-3 border-b text-right">
//                   <div className="inline-flex gap-2">
//                     <Button onClick={() => navigate(`/subjects/${s.subject_id}`, { state: { subject: s } })}>View</Button>
//                     <Button onClick={() => onQuickToggleState(s)}>Toggle State</Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
