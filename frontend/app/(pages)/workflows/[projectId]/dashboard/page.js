import S3BucketConfigMenu from "@/app/components/S3BucketConfigMenu";

export default function DashboardPage({ params }) {
  return (
    <div className="pt-8 pb-8">
      <h1 className="text-2xl font-bold mt-4">
        Dashboard for Project {params.projectId}
      </h1>
      <S3BucketConfigMenu></S3BucketConfigMenu>
    </div>
  );
}