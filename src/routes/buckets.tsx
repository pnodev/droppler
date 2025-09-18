import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { PageArea } from "~/components/Shell/PageArea";
import { Button } from "~/components/ui/button";
import { PageTitle } from "~/components/ui/page-title";

export const Route = createFileRoute("/buckets")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageArea>
      <PageTitle
        actions={
          <Button variant={"secondary"}>
            <PlusIcon /> Create new Bucket
          </Button>
        }
      >
        Buckets
      </PageTitle>
    </PageArea>
  );
}
