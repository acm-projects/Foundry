"use client"

// later integrate next auth for github oauth, this is just frontend right now

export default function AuthForm(){
  function signIn(){
    console.log("User signed in with GitHub") //placeholder for actual sign in
  }

  return(
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-white">
      <h2 className="text-3xl font-bold text-orange-500">
        Placeholder for drag and drop gif
      </h2>
      </div>

      <div className="relative flex items-center justify-center bg-gradient-to-br from-[#fff7ed] via-white to-[#fff7ed] overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-2xl shadow-xl border bg-white">
          <h1 className="text-2xl font-bold text-orange-500">Welcome to Foundry</h1>
          <p className="text-gray-600">Sign in with GitHub to continue</p>
          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-orange-800 text-white rounded-xl hover:bg-orange-500 transition"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}

