'use client';
import { Rocket } from "lucide-react";
import { useState,useEffect } from "react";
import api from "@/app/api";
import Live from "./live";



function Deploy({onClick}) {

const[status,setStatus] = useState(false)
const[live,setLive] = useState(true)
// const nodeLength = nodes.length


  let reactJson = null
  const deployClicked = () =>{
    reactJson = onClick()
    
    sendCanvas()
    //  goLive();//this isn't defined: ak
      setLive(true)
      // changeAnimation() //this isn't defined: ak

  }
  const sendCanvas = async () =>{
    const response = await api.post('/canvas/deploy', reactJson)
  }



  return (
    <div className=" h-10 flex justify-between items-center">

  <button
    onClick={deployClicked}
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


export default Deploy