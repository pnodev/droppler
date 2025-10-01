import { getAuth } from "@clerk/tanstack-react-start/server";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { db } from "..";
import z from "zod";

const fetchBuckets = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getAuth(getWebRequest());
  if (!user) {
    throw new Error("Unauthorized");
  }
  return await db.query.buckets.findMany({
    where: (model, { eq }) => eq(model.owner, user.userId as string),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
  });
});

const bucketQueryOptions = () =>
  queryOptions({
    queryKey: ["buckets"],
    queryFn: () => fetchBuckets(),
  });

export const useBucketsQuery = () => {
  const queryData = useSuspenseQuery(bucketQueryOptions());
  return { ...queryData };
};

const fetchBucket = createServerFn({ method: "GET" })
  .validator(z.object({ bucketId: z.string() }))
  .handler(async ({ data }) => {
    const user = await getAuth(getWebRequest());
    if (!user) {
      throw new Error("User not found");
    }

    const bucket = await db.query.buckets.findFirst({
      where: (model, { eq, and }) =>
        and(
          eq(model.id, data.bucketId),
          eq(model.owner, user.userId as string)
        ),
    });

    if (!bucket) {
      throw new Error("Bucket not found");
    }

    return bucket;
  });

const bucketsQueryOptions = (bucketId: string) =>
  queryOptions({
    queryKey: ["buckets", bucketId],
    queryFn: () => fetchBucket({ data: { bucketId } }),
  });

export const useBucketQuery = (bucketId: string) => {
  const queryData = useSuspenseQuery(bucketsQueryOptions(bucketId));
  return { ...queryData };
};
