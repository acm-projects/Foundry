export default function DashboardPage({ params }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Dashboard for Project {params.projectId}
      </h1>
    </div>
  );
}