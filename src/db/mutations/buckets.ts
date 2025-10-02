import { createServerFn, useServerFn } from "@tanstack/react-start";
import { buckets, insertBucketValidator } from "../schema";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { db } from "..";
import { useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v7 as uuid } from "uuid";
import { and, eq } from "drizzle-orm";
import { sync } from "./sync";

const createBucket = createServerFn({ method: "POST" })
  .validator(insertBucketValidator)
  .handler(async ({ data }) => {
    const user = await getAuth(getWebRequest());
    if (!user) {
      throw new Error("User not found");
    }

    await db.insert(buckets).values({
      ...data,
      id: uuid(),
      isPublic: true,
      owner: user.userId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await sync(`bucket-${data.id}`, { bucketId: data.id });
  });

export const useCreateBucketMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const _createBucket = useServerFn(createBucket);

  return useMutation({
    mutationFn: (data: { name: string }) => _createBucket({ data }),
    onSuccess: () => {
      router.invalidate();
      queryClient.invalidateQueries({
        queryKey: ["buckets"],
      });
    },
  });
};

const updateBucket = createServerFn({ method: "POST" })
  .validator(insertBucketValidator)
  .handler(async ({ data }) => {
    const user = await getAuth(getWebRequest());
    if (!user) {
      throw new Error("User not found");
    }

    await db
      .update(buckets)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(buckets.owner, user.userId as string),
          eq(buckets.id, data.id as string)
        )
      );

    await sync(`bucket-${data.id}`, { bucketId: data.id });
  });

export const useUpdateBucketMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const _updateBucket = useServerFn(updateBucket);

  return useMutation({
    mutationFn: (data: { id: string; name: string }) => _updateBucket({ data }),
    onSuccess: (_data, variables) => {
      router.invalidate();
      queryClient.invalidateQueries({
        queryKey: ["buckets", variables.id],
      });
    },
  });
};
