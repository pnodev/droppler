import { createServerFn, useServerFn } from "@tanstack/react-start";
import { FileInput, files, insertFileValidator } from "../schema";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { db } from "..";
import { useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v7 as uuid } from "uuid";

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
