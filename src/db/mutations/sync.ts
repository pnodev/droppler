import fetch from "node-fetch";

export async function sync(topic: string, payload: any) {
  const appId = process.env.VITE_SYNC_APP_ID;
  const key = process.env.SYNC_KEY;
  await fetch(
    `https://sync-connect.pno.dev/stream/${appId}?key=${key}&topic=${topic}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    }
  );
}
