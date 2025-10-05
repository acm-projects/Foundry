import { useState,useEffect } from "react"

export default function Live() { 

    const [live, setLive] = useState(
        () => JSON.parse(localStorage.getItem("deployed")) || false
      );
      
      useEffect(() => {
        localStorage.setItem("deployed", JSON.stringify(live));
      }, [live]);
      

    return (<div> 

{live || state ? <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-800 border border-green-200 shadow-md font-semibold text-sm cursor-default">
  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
  <span>Live</span>
</div> :  
<div className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 shadow-sm border border-gray-200">

<span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>


<span className="font-medium text-gray-700">Not Live</span>
</div>
  }






    </div>)
}