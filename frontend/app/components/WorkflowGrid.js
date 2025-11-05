import WorkflowCard from "@/app/components/WorkflowCard";

export default function WorkflowGrid({ projects }) { // Accept projects as a prop
  
  
  return (
    <>
      {projects.map((proj) => (
        <WorkflowCard
          key={proj.id}
          title={proj.title}
          description={proj.description}
          status={proj.status}
          lastModified={proj.lastModified}
          href={`/builds/${proj.id}/canvas`} 
        />
      ))}
    </>

  );
}