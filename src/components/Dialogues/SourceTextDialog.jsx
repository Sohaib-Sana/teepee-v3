import React from "react";

const SourcePopup = ({ heading, text, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
      <div className="bg-white rounded-md shadow-lg max-w-2xl w-full p-4 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-lg font-semibold mb-4">{heading}</h2>

        {/* Text */}
        <div className="text-justify text-[14px] text-gray-700 space-y-3 overflow-y-auto max-h-[70vh] pr-0 px-2 shadow-md">
          {text
            .replace(/ \n+/g, " ")
            .split("\n")
            .map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SourcePopup;
