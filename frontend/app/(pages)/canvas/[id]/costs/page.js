export default function CostsPage({ params }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Costs for Project {params.projectId}
      </h1>
    </div>
  );
}