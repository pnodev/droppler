import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { PageArea } from "~/components/Shell/PageArea";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PageTitle } from "~/components/ui/page-title";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBucketsQuery } from "~/db/queries/buckets";
import { useCreateBucketMutation } from "~/db/mutations/buckets";
import { useState } from "react";
import { List, ListItem } from "~/components/List";

export const Route = createFileRoute("/buckets/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useBucketsQuery();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <PageArea>
      <PageTitle
        actions={
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>
                <PlusIcon /> Create new Bucket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new Bucket</DialogTitle>
                <DialogDescription>
                  Please enter a name for your new bucket.
                </DialogDescription>
              </DialogHeader>
              <CreateBucketForm onSubmit={() => setModalOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      >
        Buckets
      </PageTitle>
      <List>
        {data.map((bucket) => (
          <ListItem
            key={bucket.id}
            title={bucket.name}
            label={bucket.isPublic ? "Public" : "Private"}
            labelColor={bucket.isPublic ? "gray" : "yellow"}
            description={bucket.description || "No description"}
            to={`/buckets/${bucket.id}`}
          />
        ))}
      </List>
    </PageArea>
  );
}

const CreateBucketForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { mutate: createBucket, isPending } = useCreateBucketMutation();
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Bucket name must be at least 2 characters.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmitForm(values: z.infer<typeof formSchema>) {
    await createBucket(values);
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
        <div className="flex flex-col">
          <Button loading={isPending} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
