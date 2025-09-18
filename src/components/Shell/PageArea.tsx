import { cn } from "~/lib/utils";

export function PageArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-60px)] flex flex-col justify-end">
      <div
        className={cn(
          "flex flex-co",
          "bg-white rounded-t-2xl shadow-2xl",
          "py-5 px-6 h-[calc(100vh-150px)] w-full max-w-(--page-width) mx-auto"
        )}
      >
        {children}
      </div>
    </div>
  );
}
