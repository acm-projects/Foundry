"use client";

import { useState } from "react";





export default function SettingsPage({ params }) {
  const [projectName, setProjectName] = useState("My Foundry Workflow");
  const [environment, setEnvironment] = useState("development");
  const [description, setDescription] = useState("This is an AWS deployment made easy by Foundry.");
  const [region, setRegion] = useState("US East");
  const [teamMembers, setTeamMembers] = useState([
    { name: "John Smith", role: "read" },
    { name: "Jane Doe", role: "modify" },
  ]);

  const handleSave = () => {
    console.log({ projectName, environment, description, region, teamMembers });
    alert("Settings saved! Check console for values");
  };

  return (
    <div className="pt-8 pb-8">
    

    </div>
  );
}