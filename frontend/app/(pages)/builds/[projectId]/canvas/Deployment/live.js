"use client";
import { useState } from "react";

export default function Live() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("version 1");

  const options = ["version 1", "version 2", "version 3"];


  return (
    <div className="ml-4 relative inline-block text-left">
      {/* Dropdown button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 shadow-sm border border-gray-300 hover:bg-gray-200 transition-all"
      >
        <span className="font-medium text-gray-700">{selected}</span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-10 w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                option === selected ? "text-blue-600 font-medium" : "text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}