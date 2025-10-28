import { ColumnDef, Table } from "@tanstack/react-table";
import { ReactNode } from "react";
import { PaginationComponentProps } from "./common";

export interface LoadingProps {
  isFetching?: boolean;
  isError?: boolean;
}

export interface GenericTableProps<T>
  extends Partial<PaginationComponentProps>,
    LoadingProps {
  data?: T[];
  totalPages?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: ColumnDef<any>[];
  showColumns?: boolean;
  footer?: ReactNode;
  children?: ChildrenType;
  pageSize?: number;
  noRowsChildren?: ReactNode;
  className?: string;
  isMobile?: boolean;
  tableClassName?: string;
  setSelectedRowId?: (value: number) => void;
  onRowClick?: (value: boolean) => void;
  rowClassName?: string;
}

export type CollapseType = {
  [key: string]: boolean;
};

export type ChildrenType = {
  [key: string]: ReactNode;
};

export interface TableHeaderProps<T> {
  table?: Table<T>;
  className?: string;
}

export interface NoRowsProps extends LoadingProps {
  length: number;
  children?: ReactNode;
  className?: string;
}

export interface GenericWrapperProps<T>
  extends GenericTableProps<T>,
    LoadingProps {
  data?: T[];
  title?: string;
}
