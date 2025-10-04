

export default function SettingsPage({ params }) {
  return (
    <div className="pt-8 pb-8">
      <h1 className="text-2xl font-bold mt-4">
        Settings for Project {params.projectId}
      </h1>

    </div>
  );
}