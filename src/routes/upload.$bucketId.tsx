import { createFileRoute, useParams } from "@tanstack/react-router";
import { PageArea } from "~/components/Shell/PageArea";
import { useCreateFileMutation } from "~/db/mutations/files";
import { UploadDropzone } from "~/utils/uploadthing";

export const Route = createFileRoute("/upload/$bucketId")({
  component: RouteComponent,
});

function RouteComponent() {
  const createFile = useCreateFileMutation();
  const params = useParams({ from: Route.id });
  return (
    <PageArea>
      <UploadDropzone
        className="flex-grow"
        endpoint="fileUploader"
        config={{ mode: "auto" }}
        onClientUploadComplete={async (data) => {
          await Promise.all(
            data.map((file) =>
              createFile.mutateAsync({
                name: file.name,
                size: file.size,
                type: file.type,
                url: file.ufsUrl,
                bucketId: params.bucketId,
                key: file.key,
              })
            )
          );
        }}
      />
    </PageArea>
  );
}
