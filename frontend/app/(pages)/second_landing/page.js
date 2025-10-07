import React from 'react'
import {
    Cloud, Bolt, Shield, Globe,
    Server, Archive, Database
  } from "lucide-react";
  import Link from 'next/link';

  import { ReactFlow, Background as FlowBackground, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ReactFlowProvider } from '@xyflow/react';
import DnDFlow from '../landing/second_canvas/canvas';
import { DnDProvider } from '../landing/second_canvas/Dnd';
import TextAnimateDemo6 from '@/app/components/animatedText/slogan';


export default function Land() { 

    return (
    
       // <div className = " inset-0 w-full h-full bg-gradient-to-br from-orange-200 via-orange-50 to-transparent -z-10 bg-[radial-gradient(circle,rgba(0,0,0,0.3)_1px,transparent_1px)] [background-size:32px_32px]" ></div>

        <div className="inset-0 w-full h-full -z-10 bg-[radial-gradient(circle,rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(to_bottom_right,#fed7aa,#fff7ed,transparent)] [background-size:32px_32px,auto]">

   <header className="sticky top-3 z-50 flex justify-center pt-4">
          <div className="bg-white/30 backdrop-blur-md shadow-md rounded-2xl px-6 py-3 flex items-center justify-between w-[90%] max-w-5xl">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-600 shadow-sm">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="text-orange-600 font-extrabold text-lg">Foundry</span>
            </div>
  
            <button className="px-4 py-1 rounded-xl border border-gray-300 text-orange-600 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition">
     
              
              Login
            </button>
          </div>
        </header>

        
        
        
        
        
        
        <div className="flex h-[85vh]">
  <div className="w-1/2  p-6 flex justify-center items-center">
    <div className="flex flex-col items-start space-y-8">
      <div className="text-orange-600 font-bold pl-10 text-6xl">
        <h1 className = "mb-3">The visual</h1>
        <h1 className = "mb-3">AWS infrastructure</h1>
        <h1 >builder</h1>

      
      </div>
      <div className = "pl-10">
        <div className = "w-full  text-5xl">
        <TextAnimateDemo6/>
        </div>
        
      <Link href="/workflows">
            <button className="inline-flex mt-8 items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-5 py-3 shadow-[0_8px_18px_rgba(249,115,22,.35)] hover:translate-y-[1px] hover:shadow-[0_6px_14px_rgba(249,115,22,.3)] transition">
              Get Started <span>→</span>
            </button>
          </Link>
      </div>
    </div>
  </div>

  {/**/ }
  <div className="w-full bg-transparent flex justify-center">
  <div className="h-screen w-3/4 flex justify-center">
  
    <div className="h-6/7 w-7/7">
     <ReactFlowProvider>
<DnDFlow/>

      </ReactFlowProvider>
    </div>
  </div>
</div>


</div>

<div className="flex justify-center gap-20 py-10">
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 flex items-center justify-center rounded-2xl bg-orange-100">
          <Server className="h-12 w-12 text-orange-600" />
        </div>
        <span className="mt-4 text-slate-700 font-medium">EC2 Instance</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="h-24 w-24 flex items-center justify-center rounded-2xl bg-green-100">
          <Archive className="h-12 w-12 text-green-600" />
        </div>
        <span className="mt-4 text-slate-700 font-medium">S3 Bucket</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="h-24 w-24 flex items-center justify-center rounded-2xl bg-blue-100">
          <Database className="h-12 w-12 text-blue-600" />
        </div>
        <span className="mt-4 text-slate-700 font-medium">RDS</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="h-24 w-24 flex items-center justify-center rounded-2xl bg-purple-100">
          <Database className="h-12 w-12 text-purple-600" />
        </div>
        <span className="mt-4 text-slate-700 font-medium">DynamoDB</span>
      </div>
    </div>


<section className="bg-gradient-to-b from-transparent to-orange-50/40">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold">Why Choose Foundry?</h2>
              <p className="mt-2 text-gray-500">Built for developers, by developers</p>
            </div>
  
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                icon={<Bolt className="w-6 h-6 text-orange-600" />}
                title="Lightning Fast"
                desc="Deploy AWS infrastructure in minutes, not hours. Our visual interface streamlines the entire process."
              />
              <Card
                icon={<Shield className="w-6 h-6 text-orange-600" />}
                title="Secure by Default"
                desc="Built-in security best practices and automated compliance checks ensure your infrastructure stays protected."
              />
              <Card
                icon={<Globe className="w-6 h-6 text-orange-600" />}
                title="Scale Globally"
                desc="From prototype to production, scale your applications across AWS regions with just a few clicks."
              />
            </div>
          </div>
        </section>
  
     
        <section className="bg-gradient-to-br from-orange-600 via-orange-600 to-orange-700">
          <div className="mx-auto max-w-6xl px-6 py-16 text-center text-white">
            <h3 className="text-3xl md:text-4xl font-extrabold">
              Ready to simplify your AWS journey?
            </h3>
            <p className="mt-3 text-orange-100">
              Join thousands of developers who have already streamlined their cloud
              infrastructure with Foundry.
            </p>
  
            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-orange-600 font-semibold px-5 py-3 shadow-[0_10px_22px_rgba(0,0,0,.12)] hover:translate-y-[1px] transition">
              Start Building Now <span>→</span>
            </button>
          </div>
        </section>



 



   




    </div>)
}
function Card({ icon, title, desc }) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-orange-100 mx-auto flex items-center justify-center">
          {icon}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{desc}</p>
      </div>
    );
  }