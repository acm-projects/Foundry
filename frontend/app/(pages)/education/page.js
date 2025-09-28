"use client";
import React from 'react'
import NavBar from '../../components/navbar'
import {useState} from 'react'


export default function Education() { 

    const[input,setInput] = useState("")
    const[messages,setMessages] = useState([])
    const[button,setButton] = useState(false)
    return (<div> 
        <NavBar/>
      
        <div class="flex flex-col min-h-screen bg-gray-100">
      
          <main class="flex-1 flex flex-col items-center justify-center pb-24">
      
            {button ? <div>
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 shadow-lg">

              <span class="text-white text-2xl">💬</span>
            </div>
      
            <h1 class="mt-6 text-2xl font-semibold text-gray-800">AWS Education Assistant</h1>
            <p class="mt-2 text-gray-500">Ask me anything about AWS services and best practices</p>
      
            <div class="mt-6 flex flex-wrap gap-3">
              <button onClick = {() => setInput("What is AWS EC2?")} class="px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium hover:bg-orange-200 transition" >What is AWS EC2?</button>
              <button onClick = {() => setInput("How do I set up S3?")} class="px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium hover:bg-orange-200 transition">How do I set up S3?</button>
              <button onClick = {() => setInput("Best RDS practices")} class="px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium hover:bg-orange-200 transition">Best RDS practices</button>
            </div> 
          
            </div> : <div class="flex flex-col h-screen bg-gray-100 w-3/4">




  <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">

    <div class="flex items-start justify-end gap-3">
      <div class="bg-blue-500 text-white rounded-lg px-4 py-3 max-w-xs">
        <p>1</p>
      </div>
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
        👤
      </div>
    </div>

    <div class="flex items-start gap-3">
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white">
        🤖
      </div>
      
      <div class="bg-gray-200 rounded-lg px-4 py-3 max-w-xl text-gray-800">
        <p>That's a great question! While I specialize in AWS services and cloud architecture, I'd be happy to help you with:</p>

        <p class="mt-2">Could you rephrase your question to focus on a specific AWS service or cloud architecture topic?</p>
      </div>
    </div>  
  </div>


  </div>
}  <div class="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-2 justify-center">
              <div className="flex justify-center w-full">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  class="w-5/7 rounded-lg border border-gray-100 px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300"

                  value = {input}
                  onChange = {(e) => setInput(e.target.value)}
                />
                <div className="pl-2">
                  <button onClick = {() => {setButton(false) 
                    setInput("")}} class="p-2 rounded-lg bg-orange-400 hover:bg-orange-500 text-white transition" >

                    
                    ➤
                  </button>
                </div>
              </div>
              <span class="text-sm text-gray-500">0/1000</span>
            </div>
          </main>
      
        </div>
      </div>
      )
}