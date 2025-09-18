import { createFileRoute } from "@tanstack/react-router";
import { PageArea } from "~/components/Shell/PageArea";
import { UploadDropzone } from "~/utils/uploadthing";

export const Route = createFileRoute("/upload/$bucketId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageArea>
      <UploadDropzone
        className="flex-grow"
        endpoint="fileUploader"
        config={{ mode: "auto" }}
        onClientUploadComplete={(data) => {
          console.log(data);
        }}
      />
    </PageArea>
  );
}
