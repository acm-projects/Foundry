'use client';
import { Rocket } from "lucide-react";
import { useState,useEffect } from "react";

import Live from "./live";
export default function Deploy({nodes = []}) {
const[status,setStatus] = useState(false)
const[live,setLive] = useState(true)
const nodeLength = nodes.length






  return (
    <div className=" h-10 flex justify-between items-center">

  <button
    onClick={() => {
      goLive();
      setLive(true)
      changeAnimation()
    }}
    disabled={status}
    className={`flex items-center gap-2 rounded-lg px-3 py-3 text-white shadow-md
      ${!status ? "bg-black" : "bg-gray-300"}
      disabled:cursor-not-allowed disabled:opacity-50`}
  >
    <Rocket />
    <span className="font-semibold text-sm">Deploy</span>

  </button>
</div>

  );
}


