import { ColumnDef } from "@tanstack/react-table";
import { File } from "~/db/schema";
import { filesize } from "filesize";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Download,
  Ellipsis,
  Trash,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";

export function getDataTableColumns(
  onDelete: (id: string) => void
): ColumnDef<File>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader
          label="Name"
          toggleSorting={column.toggleSorting}
          sorted={column.getIsSorted()}
        />
      ),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <SortableHeader
          label="Size"
          toggleSorting={column.toggleSorting}
          sorted={column.getIsSorted()}
        />
      ),
      cell: ({ row }) => FileSizeCell({ size: row.original.size }),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <SortableHeader
          label="Type"
          toggleSorting={column.toggleSorting}
          sorted={column.getIsSorted()}
        />
      ),
      cell: ({ row }) => TextCell({ text: row.original.type }),
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => UrlCell({ url: row.original.url }),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader
          label="Uploaded"
          toggleSorting={column.toggleSorting}
          sorted={column.getIsSorted()}
        />
      ),
      cell: ({ row }) => DateCell(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="cursor-pointer">
              <Ellipsis className="h-4 w-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DeleteButton onDelete={onDelete} id={row.original.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

const DeleteButton = ({
  onDelete,
  id,
}: {
  onDelete: (id: string) => void;
  id: string;
}) => {
  return (
    <DropdownMenuItem asChild>
      <button
        className="w-full cursor-pointer"
        type="button"
        onClick={async () => {
          await onDelete(id);
        }}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </DropdownMenuItem>
  );
};

const TextCell = ({ text }: { text: string }) => {
  return <div className="text-gray-600">{text}</div>;
};

const FileSizeCell = ({ size }: { size: number }) => {
  return <div className="text-gray-600">{filesize(size)}</div>;
};

const SortableHeader = ({
  label,
  toggleSorting,
  sorted,
}: {
  label: string;
  toggleSorting: (sorted: boolean) => void;
  sorted: string | boolean;
}) => {
  return (
    <Button
      variant="tableHeader"
      onClick={() => toggleSorting(sorted === "asc")}
    >
      {label}
      {!sorted ? <ChevronsUpDown className="ml-2 h-4 w-4" /> : null}
      {sorted === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : null}
      {sorted === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : null}
    </Button>
  );
};

const DateCell = (date: Date) => {
  return (
    <div className="text-gray-600">
      {new Intl.DateTimeFormat(undefined, {
        dateStyle: "long",
        timeStyle: "long",
      }).format(date)}
    </div>
  );
};

const UrlCell = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={url}
      className="text-blue-600 hover:text-blue-500 truncate max-w-[450px] inline-block"
    >
      {url}
    </a>
  );
};
