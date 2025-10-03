'use client';
import { Rocket } from "lucide-react";
import { useState,useEffect } from "react";

export default function Deploy({nodes = []}) {
const[status,setStatus] = useState(false)
const nodeLength = nodes.length
const userInput = JSON.parse(localStorage.getItem("service_input") || "[]")


useEffect(() => {
    const next = nodes.length > 0 && nodeLength === userInput.length;
    setStatus(prev => (prev === next ? prev : next)); 

  }, [nodeLength])

  return (
    <button
      
      className={`flex items-center gap-2 rounded-lg px-3 py-3 text-white shadow-md 
        ${status ? "bg-black" : "bg-gray-300 hover:bg-gray-600"}`}
    >
      <Rocket />
      <span className="font-semibold text-sm">Deploy</span>
      <span className="text-xs text-gray-300">(Configure all services)</span>
    </button>
  );
}


