import { createServerFn, useServerFn } from "@tanstack/react-start";
import { FileInput, files, insertFileValidator } from "../schema";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { db } from "..";
import { useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v7 as uuid } from "uuid";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { utapi } from "~/server/uploadthing";
import { sync } from "./sync";

const createFile = createServerFn({ method: "POST" })
  .validator(insertFileValidator)
  .handler(async ({ data }) => {
    const user = await getAuth(getWebRequest());
    if (!user) {
      throw new Error("User not found");
    }

    await db.insert(files).values({
      ...data,
      id: uuid(),
      owner: user.userId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await sync(`files-for-bucket-${data.bucketId}`, { fileId: data.id });
  });

export const useCreateFileMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const _createFile = useServerFn(createFile);

  return useMutation({
    mutationFn: (data: FileInput) => _createFile({ data }),
    onSuccess: (_data, variables) => {
      router.invalidate();
      queryClient.invalidateQueries({
        queryKey: ["files", variables.bucketId],
      });
    },
  });
};

const deleteFile = createServerFn({ method: "POST" })
  .validator(z.object({ fileId: z.string() }))
  .handler(async ({ data }) => {
    const user = await getAuth(getWebRequest());
    if (!user) {
      throw new Error("User not found");
    }

    const file = await db.query.files.findFirst({
      where: (model, { eq, and }) =>
        and(eq(model.id, data.fileId), eq(model.owner, user.userId as string)),
    });

    if (!file) {
      throw new Error("File not found");
    }

    await utapi.deleteFiles([file.key]);

    await db
      .delete(files)
      .where(
        and(
          eq(files.id, data.fileId),
          eq(files.bucketId, file.bucketId),
          eq(files.owner, user.userId as string)
        )
      );

    await sync(`files-for-bucket-${file.bucketId}`, { fileId: data.fileId });

    return { file };
  });

export const useDeleteFileMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const _deleteFile = useServerFn(deleteFile);

  return useMutation({
    mutationFn: async (data: { fileId: string }) => await _deleteFile({ data }),
    onSuccess: (data) => {
      router.invalidate();
      queryClient.invalidateQueries({
        queryKey: ["files", data.file.bucketId],
      });
    },
  });
};
