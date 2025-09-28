export default function CanvasPage({ params }) {
  return (
    <div className="pt-8 pb-8">
      <h1 className="text-2xl font-bold">
        Canvas for Project {params.projectId}
      </h1>
    </div>
  );
}