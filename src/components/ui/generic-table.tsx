import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { GenericTableProps } from "@/@types/table";
import ColumnsDropdown from "./columns-dropdown";
import CustomTableHeader from "./table-header";
import NoRows from "./no-rows";
import { PaginationComponent } from "./pagination-component";

export const initialPage = {
  page: 0,
  size: 10,
};

export function GenericTable<T>({
  data = [],
  columns = [],
  pagination = initialPage,
  setPagination,
  showColumns,
  footer,
  pageSize,
  noRowsChildren,
  className,
  isError,
  isFetching,
  tableClassName,
  setSelectedRowId,
  onRowClick,
  rowClassName,
  ...field
}: GenericTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: pageSize
      ? {
          pagination: {
            pageSize,
            pageIndex: pagination.page,
          },
        }
      : undefined,
  });

  return (
    <div className={cn("lighter-dark w-full pb-5", className)}>
      {showColumns && <ColumnsDropdown table={table} />}
      <div className="flex flex-col gap-2">
        <div className="table-container rounded-lg">
          <Table className="relative rounded-lg border border-slate-200 dark:border-slate-700">
            <CustomTableHeader table={table} className={tableClassName} />
            <TableBody>
              {isFetching || isError ? (
                <NoRows length={columns.length} {...{ isError, isFetching }} />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "cursor-pointer border border-slate-200  dark:border-slate-700 dark:hover:bg-slate-800",
                      rowClassName
                    )}
                    onClick={() => {
                      setSelectedRowId?.(row.original.id);
                      onRowClick?.(true);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="text-foreground" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <NoRows length={columns.length} children={noRowsChildren} />
              )}
              {footer && (
                <TableRow className="border border-slate-200 dark:border-slate-700">
                  <td colSpan={100}>{footer}</td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {setPagination && (
          <PaginationComponent {...{ pagination, setPagination }} {...field} />
        )}
      </div>
    </div>
  );
}
