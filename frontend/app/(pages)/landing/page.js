
"use client"
import React from 'react'
import {Cloud, Bolt, Shield, Globe,Server, Archive, Database} from "lucide-react";
import Link from 'next/link';
import DeploymentTimeline from './timeline/deploymentTimeline';
import { ReactFlow, Controls } from '@xyflow/react';
//normal canvas
import '@xyflow/react/dist/style.css';
import { ReactFlowProvider } from '@xyflow/react';
import DnDFlow from './canvas/canvas';
import { DnDProvider } from './canvas/Dnd';
import { TextAnimate } from './animatedText/text-animate';
import TextAnimateDemo6 from './animatedText/slogan';
import SideBar from './canvas/SideBar';

//user flow canvas
import DndFlow2 from './flowCanvas/canvas';
import { DnDProvider as DnDProvider2 } from './flowCanvas/Dnd';
import LoginButton from './login/LoginButton';
import GetStarted from './login/getStarted';





export default function Land() { 

return (



  <div className="inset-0 w-full min-h-screen bg-gradient-to-br from-orange-200 via-orange-50 to-transparent -z-10">
<div className = "bg-[radial-gradient(circle,rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:32px_32px,auto]">
<header className="sticky top-3 z-50 flex justify-center pt-4 px-4 sm:px-6">
    <div className="bg-white/30 backdrop-blur-md shadow-md rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between w-full max-w-5xl">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-600 shadow-sm">
          <Cloud className="w-4 h-4 text-white" />
        </div>
        <span className="text-orange-600 font-extrabold text-lg">Foundry</span>
      </div>

 <LoginButton/>

    </div>
  </header>
  
  <div className="flex flex-col md:flex-row min-h-[70vh]">
<div className="w-full md:w-1/2 p-6 md:p-8 flex justify-center items-center">
<div className="flex flex-col items-start space-y-6 sm:space-y-8">
<div className="text-orange-600 font-bold pl-6 sm:pl-10 text-4xl sm:text-5xl md:text-6xl">
  <h1 className = "mb-3">The visual</h1>
  <h1 className = "mb-3">AWS infrastructure</h1>
  <h1 >builder</h1>


</div>
<div className = "pl-6 sm:pl-10">
  <div className = "w-full text-2xl sm:text-4xl md:text-5xl">
  <TextAnimateDemo6/>
  </div>
  
  

      <GetStarted/>

   
</div>
</div>
</div>



<div className="w-full bg-transparent flex justify-center">
<div className="h-[50vh] sm:h-[60vh] md:h-[75vh] w-full md:w-3/4 flex justify-center">

<div className="h-full w-full">
<ReactFlowProvider>
<DnDFlow/>

</ReactFlowProvider>
</div>
</div>
</div>
</div>
<div className="max-w-full mx-auto flex flex-wrap items-stretch justify-center gap-6 sm:gap-8 md:gap-10 px-6 mt-20">
<div className="w-full sm:w-[40vh] max-w-sm min-h-40 border border-orange-100 bg-white/30 backdrop-blur-md shadow-md rounded-xl flex items-center justify-start px-6 transition-transform duration-300 hover:scale-105">
<div className="w-20 h-20 flex items-center justify-center mr-6">
<Server className="w-10 h-10 text-orange-600" />
</div>
<div className="flex flex-col">
<h1 className="text-orange-700 font-semibold text-lg mb-1">ECS Instance</h1>
<p className="text-xs sm:text-sm text-gray-700 leading-snug">
EC2 offers scalable virtual servers to run applications without 
managing hardware, giving full control over OS, storage, and performance.
</p>
</div>
</div>


<div className="w-full sm:w-[40vh] max-w-sm min-h-40 border border-orange-100 bg-white/30 backdrop-blur-md shadow-md rounded-xl flex items-center justify-start px-6 transition-transform duration-300 hover:scale-105">
<div className="w-20 h-20 flex items-center justify-center  mr-6">
<Archive className="w-10 h-10 text-green-600" />
</div>
<div className="flex flex-col">
<h1 className="text-green-700 font-semibold text-lg mb-1">S3 Bucket</h1>
<p className="text-xs sm:text-sm text-gray-700 leading-snug">
Amazon S3 provides secure, scalable object 
storage for any type of file, allowing easy access, backup, and data management from anywhere.
</p>
</div>
</div>
<div className="w-full sm:w-[40vh] max-w-sm min-h-40 border border-orange-100 bg-white/30 backdrop-blur-md shadow-md rounded-xl flex items-center justify-start px-6 transition-transform duration-300 hover:scale-105">
<div className="w-20 h-20 flex items-center justify-center mr-6">
<Database className="w-10 h-10 text-purple-600" />
</div>
<div className="flex flex-col">
<h1 className="text-purple-700 font-semibold text-lg mb-1">RDS</h1>
<p className="text-xs sm:text-sm text-gray-700 leading-snug">
Amazon RDS offers managed relational databases that handle
setup, scaling, and maintenance, allowing developers to focus on building applications efficiently.
</p>
</div>
</div>


<div className="w-full sm:w-[40vh] max-w-sm min-h-40 border border-orange-100 bg-white/30 backdrop-blur-md shadow-md rounded-xl flex items-center justify-start px-6 transition-transform duration-300 hover:scale-105">
<div className="w-20 h-20 flex items-center justify-center  mr-6">
<Database className="w-10 h-10 text-blue-600" />
</div>
<div className="flex flex-col">
<h1 className="text-blue-700 font-semibold text-lg mb-1">DynamoDB</h1>
<p className="text-xs sm:text-sm text-gray-700 leading-snug">
Amazon DynamoDB is a fully managed, 
scalable NoSQL database that delivers fast performance
and automatically handles data distribution and scaling.
</p>
</div>
</div>
</div>
</div>

<div className = "mt-30 px-4">
<DeploymentTimeline/>
</div>
<div className = "mt-20 px-4">
<ReactFlowProvider>

<DndFlow2/>


</ReactFlowProvider>
</div>

<section className="bg-gradient-to-b mb-20 from-transparent to-orange-50/40">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold">Why Choose Foundry?</h2>
        <p className="mt-2 text-gray-500">Built for developers, by developers</p>
      </div>

      <div className="mt-10 grid  grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          icon={<Bolt className="w-6 h-6  text-orange-600" />}
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
<div className="rounded-2xl border  bg-orange-50 shadow-sm p-8 text-center">
  <div className="w-12 h-12 rounded-xl bg-orange-100 mx-auto flex items-center justify-center">
    {icon}
  </div>
  <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
  <p className="mt-2 text-gray-600">{desc}</p>
</div>
);
}
