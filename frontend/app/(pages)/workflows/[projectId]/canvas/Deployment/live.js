import { useState,useEffect } from "react"

export default function Live() { 

    const [live, setLive] = useState(true);
    const[open,setOpen] = useState(false)
    const [selected, setSelected] = useState("") 

    const options = ["version 1", "version 2", "version 3"]
     
    
    return (<div> 

{live ?  <div >
 
<div className>
<button onClick={() => setOpen(!open)}>
<div className="inline-flex items-center gap-2 rounded-lg bg-green-200 px-4 py-2 shadow-sm border border-gray-200 mr-10">
<span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
<span className="font-medium text-gray-700 flex  gap-1">
Live
{selected && (
  <span className="text-[10px] text-gray-500 ml-1">
    {selected}
  </span>
)}
</span>
</div>
</button>

{open && (
  <div className="absolute bg-white border border-gray-200 rounded-lg shadow-md max-h-20 overflow-y-auto">
    {options.map((option) => (
      <button
        key={option}
        onClick={() => {
          setSelected(option);
          setOpen(false);
        }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {option}
      </button>
    ))}
  </div>
)}

</div>
</div> :  
null
}






    </div>)
}