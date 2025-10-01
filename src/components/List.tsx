import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";

export const List = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul role="list" className="divide-y divide-gray-100 -mx-6 [&_li_a]:px-6">
      {children}
    </ul>
  );
};

export const ListItem = ({
  title,
  label,
  labelColor,
  description,
  className,
  to,
}: {
  title: string;
  label: string;
  labelColor: "gray" | "yellow";
  description: string;
  className?: string;
  to: string;
}) => {
  return (
    <li className={cn(className)}>
      <Link
        to={to}
        className="flex items-center justify-between gap-x-6 py-5 hover:bg-accent"
      >
        <div className="min-w-0">
          <div className="flex items-start gap-x-3">
            <p className="text-sm/6 font-semibold text-gray-900">{title}</p>
            {labelColor === "gray" ? (
              <p className="mt-0.5 rounded-md bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10">
                {label}
              </p>
            ) : null}

            {labelColor === "yellow" ? (
              <p className="mt-0.5 rounded-md bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20">
                {label}
              </p>
            ) : null}
          </div>
          <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
            <p className="whitespace-nowrap">{description}</p>
          </div>
        </div>
        <div className="flex flex-none items-center gap-x-4">
          <ChevronRight className="text-gray-500" />
        </div>
      </Link>
    </li>
  );
};
