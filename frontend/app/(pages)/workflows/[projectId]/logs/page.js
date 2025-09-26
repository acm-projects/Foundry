export default function LogsPage({ params }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Logs for Project {params.projectId}
      </h1>
    </div>
  );
}