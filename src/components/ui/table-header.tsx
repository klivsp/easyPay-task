import { TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import type { TableHeaderProps } from "@/@types/table";

const CustomTableHeader = <T,>({ table, className }: TableHeaderProps<T>) => {
  return (
    <TableHeader
      className={cn(
        "sticky-header rounded-t-lg bg-primary dark:hover:bg-transparent",
        className
      )}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="dark:hover:bg-transparent">
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className={cn(
                  "min-w-full divide-y divide-gray-200 text-white dark:bg-appBackground-dark dark:text-white dark:hover:bg-transparent",
                  className
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default CustomTableHeader;
