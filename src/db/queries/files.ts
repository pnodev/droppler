import { getAuth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import z from "zod";
import { db } from "..";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { utapi } from "~/server/uploadthing";

const fetchFilesForBucket = createServerFn({ method: "GET" })
  .validator(z.object({ bucketId: z.string() }))
  .handler(async ({ data }) => {
    const user = await getAuth(getWebRequest());
    if (!user) {
      throw new Error("User not found");
    }

    const files = await db.query.files.findMany({
      where: (model, { eq, and }) =>
        and(
          eq(model.bucketId, data.bucketId),
          eq(model.owner, user.userId as string)
        ),
      orderBy: (fields, { desc }) => desc(fields.createdAt),
    });

    return await Promise.all(
      files.map(async (file) => {
        const presignedUrl = await utapi.generateSignedURL(file.key, {
          expiresIn: 60 * 60,
        });
        return {
          ...file,
          url: presignedUrl.ufsUrl,
        };
      })
    );
  });

const filesQueryOptions = (bucketId: string) =>
  queryOptions({
    queryKey: ["files", bucketId],
    queryFn: () => fetchFilesForBucket({ data: { bucketId } }),
  });

export const useFilesQuery = (bucketId: string) => {
  const queryData = useSuspenseQuery(filesQueryOptions(bucketId));
  return { ...queryData };
};
