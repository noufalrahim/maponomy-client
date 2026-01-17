import * as React from "react";
import { ChevronDown, Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TColumn } from "@/types";
import TableSkeletonRow from "./TableSkeletonRow";
import MemoizedSearch from "./MemoizedSearch";

interface TableComponentProps<T> {
  data: T[] | undefined;
  columns: TColumn<T>[];
  getRowId: (row: T) => string;
  filterColumn?: keyof T;
  onClickTo?: string;
  onClickEdit?: (item: T) => void;
  onClickDelete?: (id: string) => void;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  showActions?: {
    edit?: boolean | ((row: T) => boolean);
    delete?: boolean | ((row: T) => boolean);
  };
  totalItems: number;
  setSearch?: (search: string) => void;
  search?: string;
  isLoading: boolean;
  columnFilters?: boolean;
  indexing?: boolean;
}

function TableComponentInner<T>({
  data,
  columns,
  getRowId,
  pagination,
  onPaginationChange,
  onClickTo,
  onClickEdit,
  onClickDelete,
  totalItems,
  showActions = { edit: true, delete: true },
  setSearch,
  search,
  isLoading,
  columnFilters = false,
  indexing = true,
}: TableComponentProps<T>) {
  const navigate = useNavigate();

  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(columns.map((c) => [String(c.key), true]))
  );

  if (!data) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const startIndex =
    (pagination?.pageIndex || 0) * (pagination?.pageSize || data.length);

  return (
    <div className="w-full">
      <div className="flex items-center p-4 gap-2">
        {search !== undefined && setSearch && (
          <MemoizedSearch value={search} onChange={setSearch} />
        )}

        {columnFilters && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-white">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {columns
                .filter((c) => c.hideable !== false)
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={String(column.key)}
                    checked={visibleColumns[String(column.key)]}
                    onCheckedChange={(value: boolean) =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [String(column.key)]: !!value,
                      }))
                    }
                  >
                    {column.header}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="border-t border-b">
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              {indexing && (
                <TableHead className="w-16 text-center">S.No.</TableHead>
              )}
              {columns.map(
                (col) =>
                  visibleColumns[String(col.key)] && (
                    <TableHead key={String(col.key)}>
                      {col.header}
                    </TableHead>
                  )
              )}
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pagination?.pageSize || 5 }).map((_, i) => (
                <TableSkeletonRow
                  key={i}
                  columns={
                    columns.filter((c) => visibleColumns[String(c.key)]).length + 1
                  }
                />
              ))
            ) : data.length ? (
              data.map((row, index) => {
                const rowId = getRowId(row);
                const canEdit =
                  typeof showActions?.edit === "function"
                    ? showActions.edit(row)
                    : showActions?.edit !== false;
                const canDelete =
                  typeof showActions?.delete === "function"
                    ? showActions.delete(row)
                    : showActions?.delete !== false;

                return (
                  <TableRow
                    key={rowId}
                    className={cn(onClickTo && "cursor-pointer")}
                    onClick={() =>
                      onClickTo && navigate(`${onClickTo}/${rowId}`)
                    }
                  >
                    {
                      indexing && (
                        <TableCell className="text-center font-medium">
                          {startIndex + index + 1}
                        </TableCell>
                      )
                    }
                    {columns.map(
                      (col) =>
                        visibleColumns[String(col.key)] && (
                          <TableCell key={String(col.key)}>
                            {col.render
                              ? col.render(row)
                              : String(row[col.key as keyof T])}
                          </TableCell>
                        )
                    )}

                    {showActions && (canEdit || canDelete) && (
                      <TableCell className="w-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {canEdit && (
                              <DropdownMenuItem
                                onClick={() => onClickEdit?.(row)}
                              >
                                <Edit3 />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() => onClickDelete?.(rowId)}
                              >
                                <Trash2 className="text-red-500" />
                                <span className="text-red-500">Delete</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            pagination &&
            onPaginationChange?.({
              pageIndex: pagination.pageIndex - 1,
              pageSize: pagination.pageSize,
            })
          }
          disabled={pagination?.pageIndex === 0 || data.length === 0}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            pagination &&
            onPaginationChange?.({
              pageIndex: pagination.pageIndex + 1,
              pageSize: pagination.pageSize,
            })
          }
          disabled={
            pagination?.pageIndex ===
              Math.ceil(totalItems / (pagination?.pageSize || 5)) - 1 ||
            data.length === 0
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const TableComponent = React.memo(TableComponentInner) as typeof TableComponentInner;
export default TableComponent;
