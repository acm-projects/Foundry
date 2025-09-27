import React from 'react'
import { useRouter,useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'


export default function BackCanvas({params}) {

    const router = useRouter()
    const {id} = useParams()


    return (<div> 

<button
        onClick={() => router.push(`/canvas/${id}`)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Canvas</span>
      </button>





    </div>)



}