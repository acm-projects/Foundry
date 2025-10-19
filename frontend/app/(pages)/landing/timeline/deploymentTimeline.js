
import { LogIn,Github, MousePointer2, Rocket, CheckCircle2 } from "lucide-react";
import "./edge.css"; 

const steps = [
  { title: "Log in", icon: Github, desc: "Authenticate to start" },
  { title: "Pick your service", icon: MousePointer2, desc: "Choose EC2/RDS/etc." },
  { title: "Deploy", icon: Rocket, desc: "Provision + configure" },
  { title: "Your service is live", icon: CheckCircle2, desc: "Reachable & healthy" },
];

function Connector() {
  return (
    <svg width="92" height="20" viewBox="0 0 92 20" className="mx-2  text-#b1b1b7 ">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
          markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill=" #b1b1b7" />
        </marker>
      </defs>
      <line className="edge" x1="2" y1="10" x2="86" y2="10" markerEnd="url(#arrow)" />
    </svg>
  );
}

function Step({ title, desc, Icon }) {
  return (
    <div className="flex flex-col items-center text-center ">
      <div className="w-20 h-20 rounded-2xl shadow-sm border bg-white border-gray-200
                      flex items-center justify-center">
        <Icon className="w-10 h-10 text-gray-800 " />
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

export default function DeploymentTimeline() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="">
        <div className="flex items-center justify-center bg-transparent
                      rounded-2xl shadow-sm">
          <div className="flex items-centerm ">
            {steps.map((s, i) => (
              <div key={s.title} className="flex items-center ">
                <Step className = "" title={s.title} desc={s.desc} Icon={s.icon} />
                {i < steps.length - 1 && <Connector />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
