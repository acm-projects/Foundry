
import {
    Cloud, Bolt, Shield, Globe,
    Server, Archive, Database
  } from "lucide-react";

  import Link from "next/link";
  
  export default function Page() {
    return (
      <div>
        <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-transparent -z-10"></div>
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 text-gray-900">
       
        <header className="sticky top-3 z-50 flex justify-center">
          <div className="bg-white/80 backdrop-blur-md shadow-md rounded-2xl px-6 py-3 flex items-center justify-between w-[90%] max-w-5xl">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-600 shadow-sm">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="text-orange-600 font-extrabold text-lg">Foundry</span>
            </div>
  
            <button className="px-4 py-1 rounded-xl border border-gray-300 text-orange-600 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition">
               {/* login logic */}
              
              Login
            </button>
          </div>
        </header>
  
      
        <section className="mx-auto max-w-6xl px-6 pt-40 pb-10 text-center">
          <h1 className="text-6xl font-extrabold tracking-tight text-orange-700">Foundry</h1>
          <p className=" pt-20 mt-8 text-5xl font-black text-gray-900">Drag. Drop. Deploy.</p>
          <p className="mt-4 text-lg text-gray-600">
            Visual AWS service management with powerful automation
          </p>
          <div className="mt-8">

            <button className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-5 py-3 shadow-[0_8px_18px_rgba(249,115,22,.35)] hover:translate-y-[1px] hover:shadow-[0_6px_14px_rgba(249,115,22,.3)] transition">
              Get Started <span>→</span>
            </button>
          </div>
        </section>
  

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature icon={<Server className="w-6 h-6 text-orange-600" />} chip="bg-orange-100" title="EC2 Instance" />
            <Feature icon={<Archive className="w-6 h-6 text-green-600" />} chip="bg-green-100" title="S3 Bucket" />
            <Feature icon={<Database className="w-6 h-6 text-blue-600" />} chip="bg-blue-100" title="RDS" />
            <Feature icon={<Database className="w-6 h-6 text-purple-600" />} chip="bg-purple-100" title="DynamoDB" />
          </div>
        </section>
  
      
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
      </main>
      </div>
    );
  }
  
  
  function Feature({ icon, chip, title }) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white/80 shadow-sm p-6 flex flex-col items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${chip}`}>{icon}</div>
        <div className="text-gray-800 font-semibold">{title}</div>
      </div>
    );
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
  

