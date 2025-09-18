import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <img src="/logo-large.svg" className="w-96 h-96" />
    </div>
  );
}
