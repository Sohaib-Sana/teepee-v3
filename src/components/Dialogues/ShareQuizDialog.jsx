import React, { useRef, useState } from "react";

function ShareDialog({ onClose, quizId }) {
  const [link] = useState(`${import.meta.env.VITE_URL + "/quiz/" + quizId}`);
  const [isClicked, setIsClicked] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setIsClicked(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative text-center">
        {/* Close Button */}
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={onClose}>
          ×
        </button>

        {/* Icon Circle (replace emoji with SVG if you want) */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-4xl">🔗</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium mb-4">Provide Students with This Link</h3>

        {/* Input + Copy Button */}
        <div className="flex items-center">
          <input type="text" value={link} readOnly className="flex-1 px-3 py-2 border border-gray-300 rounded-l-2xl focus:outline-none text-sm" />
          <button onClick={copyToClipboard} className=" px-2 py-2 text-[14.5px] bg-[#3B82F6] text-white rounded-e-2xl">
            {isClicked ? "Copied..." : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareDialog;
