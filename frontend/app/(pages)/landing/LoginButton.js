"use client"
import React from 'react'
import {useSession,signIn, signOut} from "next-auth/react"
export default function LoginButton() { 

const {data, status}= useSession()

return (
<div> 

{status==="authenticated"? <div> 
    
    <button className="px-4 py-1 rounded-xl border border-gray-300 text-orange-600 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition"   onClick = {() => signOut()}>Log out</button>
    
    
    
    </div>: <div>

        <button  className="px-4 py-1 rounded-xl border border-gray-300 text-orange-600 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition"  onClick={()=>signIn()}>Login</button> 
        </div>
        
        
        }




</div>



)


}