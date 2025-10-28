import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type React from "react";
import Po
import { useEffect, useState } from "react";

export interface pagination {
  page: number;
  size: number;
}

export interface PaginationComponentProps {
  pagination: pagination;
  setPagination: React.Dispatch<React.SetStateAction<pagination>>;
  totalPages?: number;
  showItemsPerPage?: boolean;
  showJumpToEnds?: boolean;
  className?: string;
  variant?: "default" | "outline" | "minimal";
}

export const PaginationComponent = ({
  pagination,
  setPagination,
  totalPages = 1,
  showItemsPerPage = true,
  showJumpToEnds = true,
  className,
  variant = "default",
}: PaginationComponentProps) => {
  const [visiblePages, setVisiblePages] = useState<(number | "ellipsis")[]>([]);
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;
  useEffect(() => {
    const calculateVisiblePages = () => {
      const maxVisiblePages = isMobile ? 3 : 5;
      const pages: (number | "ellipsis")[] = [];

      pages.push(1);

      if (totalPages <= maxVisiblePages + 2) {
        for (let i = 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const currentPage = pagination.page - 1;

        let startPage = Math.max(
          2,
          currentPage - Math.floor(maxVisiblePages / 2)
        );
        const endPage = Math.min(
          totalPages - 1,
          startPage + maxVisiblePages - 1
        );

        if (endPage === totalPages - 1) {
          startPage = Math.max(2, endPage - maxVisiblePages + 1);
        }

        if (startPage > 2) {
          pages.push("ellipsis");
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (endPage < totalPages - 1) {
          pages.push("ellipsis");
        }

        if (totalPages > 0) {
          pages.push(totalPages);
        }
      }
      setVisiblePages(pages);
    };

    calculateVisiblePages();
  }, [totalPages, pagination.page, isMobile]);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  const handleSizeChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      size: Number(value),
      page: 0,
    }));
  };

  const getButtonStyles = (isActive: boolean) => {
    const baseStyles = "h-9 w-9 text-sm transition-all";

    if (variant === "outline") {
      return cn(
        baseStyles,
        "border rounded-md",
        isActive
          ? "border-primary bg-primary text-white hover:text-white hover:bg-primary/90"
          : "border-border hover:bg-accent hover:text-accent-foreground"
      );
    } else if (variant === "minimal") {
      return cn(
        baseStyles,
        "rounded-md",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-muted hover:text-foreground"
      );
    } else {
      return cn(
        baseStyles,
        "rounded-md",
        isActive
          ? "bg-primary text-white hover:text-white hover:bg-primary/90"
          : "hover:bg-gray-200 hover:text-primary"
      );
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <Pagination className="order-2">
        <PaginationContent className="flex-wrap gap-1">
          {showJumpToEnds && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9",
                  pagination.page === 0 && "pointer-events-none opacity-50"
                )}
                onClick={() => handlePageChange(0)}
                disabled={pagination.page === 0}
                aria-label="Go to first page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
          )}

          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9",
                pagination.page === 0 && "pointer-events-none opacity-50"
              )}
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>

          {!isMobile ? (
            visiblePages.map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    isActive={pagination.page === page - 1}
                    className={getButtonStyles(pagination.page === page - 1)}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))
          ) : (
            <PaginationItem>
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm font-medium">
                  {pagination.page + 1}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {totalPages}
                </span>
              </div>
            </PaginationItem>
          )}

          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9",
                pagination.page === totalPages - 1 &&
                  "pointer-events-none opacity-50"
              )}
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages - 1}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>

          {showJumpToEnds && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9",
                  pagination.page === totalPages - 1 &&
                    "pointer-events-none opacity-50"
                )}
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={pagination.page === totalPages - 1}
                aria-label="Go to last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {showItemsPerPage && (
        <div className="order-1 flex items-center gap-2 sm:order-3">
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            Items per page:
          </span>

          <PopoverRender
            isSearchable={false}
            type="select"
            dropdownData={{
              options: ["10", "20", "50", "100"].map((item) => ({
                value: {
                  label: item,
                  value: item,
                },
                label: item,
              })),
              onSelectChange: handleSizeChange,
            }}
            value={String(pagination.size)}
            className="w-20"
            displayIcon={false}
          />
        </div>
      )}
    </div>
  );
};
