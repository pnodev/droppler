import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { PageArea } from "~/components/Shell/PageArea";
import { Button } from "~/components/ui/button";
import { FormCheckbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { PageTitle } from "~/components/ui/page-title";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { useUpdateBucketMutation } from "~/db/mutations/buckets";
import { useBucketQuery } from "~/db/queries/buckets";
import { useFilesQuery } from "~/db/queries/files";
import { Bucket } from "~/db/schema";

export const Route = createFileRoute("/buckets/$bucketId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = useParams({ from: Route.id });
  const { data, isLoading: isBucketLoading } = useBucketQuery(params.bucketId);
  const { data: files, isLoading: isFilesLoading } = useFilesQuery(
    params.bucketId
  );

  return (
    <PageArea>
      <PageTitle
        actions={<BucketSettings bucket={data} />}
        loading={isBucketLoading || isFilesLoading}
      >
        Bucket {data.name}
      </PageTitle>
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </PageArea>
  );
}

const BucketSettings = ({ bucket }: { bucket: Bucket }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!bucket) {
    return null;
  }
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bucket Settings</SheetTitle>
        </SheetHeader>
        <EditBucketForm bucket={bucket} onSubmit={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

const EditBucketForm = ({
  bucket,
  onSubmit,
}: {
  bucket: Bucket;
  onSubmit: () => void;
}) => {
  const { mutate: updateBucket, isPending } = useUpdateBucketMutation();
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Bucket name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    isPublic: z.boolean(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bucket.name,
      description: bucket.description || undefined,
      isPublic: bucket.isPublic,
    },
  });

  async function onSubmitForm(values: z.infer<typeof formSchema>) {
    await updateBucket({ id: bucket.id, ...values });
    form.reset();
    onSubmit();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bucket Name</FormLabel>
              <FormControl>
                <Input placeholder="My new bucket" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="…" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <FormCheckbox
                  label="Public"
                  description="Anyone with the link can access this bucket."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col">
          <Button loading={isPending} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
