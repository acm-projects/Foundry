import { signIn } from 'next-auth/react'
import React from 'react'


export default function GetStarted() { 

    const signInHandler = async () => await signIn("github",{callbackUrl: "/workflows"});

  return(


<button onClick = {() => signInHandler()}  className="inline-flex mt-8 items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-5 py-3 shadow-[0_8px_18px_rgba(249,115,22,.35)] hover:translate-y-[1px] hover:shadow-[0_6px_14px_rgba(249,115,22,.3)] transition">
        Get Started <span>→</span>
      </button>
)
}