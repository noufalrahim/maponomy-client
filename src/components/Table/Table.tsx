
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
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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

  // Track column widths - initialize with minimum width for each column
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);
  const resizingRef = React.useRef<{ key: string; startX: number; startWidth: number } | null>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);

  // Store handlers in refs to avoid circular dependencies
  const handleMouseMoveRef = React.useRef<(e: MouseEvent) => void>(() => { });
  const handleMouseUpRef = React.useRef<() => void>(() => { });

  // Initialize column widths on mount
  React.useEffect(() => {
    if (tableRef.current) {
      const headers = tableRef.current.querySelectorAll('th[data-column-key]');
      if (headers.length > 0) {
        const initialWidths: Record<string, number> = {};
        headers.forEach((header) => {
          const key = header.getAttribute('data-column-key');
          if (key && !columnWidths[key]) {
            // Find the column config to get its minWidth
            const col = columns.find((c) => String(c.key) === key);
            const minWidth = col?.minWidth ?? 80;
            initialWidths[key] = Math.max(minWidth, header.getBoundingClientRect().width);
          }
        });
        if (Object.keys(initialWidths).length > 0) {
          setColumnWidths((prev) => ({ ...prev, ...initialWidths }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns]);

  // Update refs with current handlers
  React.useEffect(() => {
    handleMouseMoveRef.current = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const { key, startX, startWidth } = resizingRef.current;
      // Get the minWidth for this column
      const col = columns.find((c) => String(c.key) === key);
      const minWidth = col?.minWidth ?? 80;
      const delta = e.pageX - startX;
      const newWidth = Math.max(minWidth, startWidth + delta);
      setColumnWidths((prev) => ({ ...prev, [key]: newWidth }));
    };

    handleMouseUpRef.current = () => {
      resizingRef.current = null;
      setResizingColumn(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener("mousemove", handleMouseMoveRef.current);
      document.removeEventListener("mouseup", handleMouseUpRef.current);
    };
  });

  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();

    const headerElement = (e.target as HTMLElement).closest('th');
    if (!headerElement) return;

    const currentWidth = columnWidths[key] || headerElement.getBoundingClientRect().width;

    resizingRef.current = {
      key,
      startX: e.pageX,
      startWidth: currentWidth,
    };
    setResizingColumn(key);

    // Set cursor globally during resize
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    document.addEventListener("mousemove", handleMouseMoveRef.current);
    document.addEventListener("mouseup", handleMouseUpRef.current);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMoveRef.current);
      document.removeEventListener("mouseup", handleMouseUpRef.current);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  if (!data) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const startIndex = (pagination?.pageIndex || 0) * (pagination?.pageSize || data.length);

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
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table ref={tableRef} className="bg-white border-collapse w-full" style={{ tableLayout: 'fixed' }}>
            <TableHeader>
              <TableRow>
                {indexing && (
                  <TableHead className="w-16 text-center border-r" style={{ width: 60, minWidth: 60 }}>S.No.</TableHead>
                )}
                {columns.map(
                  (col) =>
                    visibleColumns[String(col.key)] && (
                      <TableHead
                        key={String(col.key)}
                        data-column-key={String(col.key)}
                        style={{
                          width: columnWidths[String(col.key)] || 'auto',
                          minWidth: col.minWidth ?? 80,
                        }}
                        className="relative group border-r px-4 select-none"
                      >
                        <span className="truncate block">{col.header}</span>
                        <div
                          onMouseDown={(e) => handleMouseDown(e, String(col.key))}
                          className={cn(
                            "absolute right-0 top-0 h-full w-2 cursor-col-resize z-10 transition-colors",
                            "hover:bg-primary/50",
                            resizingColumn === String(col.key) ? "bg-primary" : "bg-transparent"
                          )}
                        />
                      </TableHead>
                    )
                )}
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: pagination?.pageSize || 5 }).map((_, i) => (
                  <TableSkeletonRow
                    key={i}
                    columns={
                      columns.filter((c) => visibleColumns[String(c.key)]).length +
                      (indexing ? 1 : 0) + 1
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
                      className={cn(onClickTo && "cursor-pointer hover:bg-slate-50")}
                      onClick={() => onClickTo && navigate(`${onClickTo}/${rowId}`)}
                    >
                      {indexing && (
                        <TableCell className="text-center font-medium border-r">
                          {startIndex + index + 1}
                        </TableCell>
                      )}
                      {columns.map((col) => {
                        const cellValue = row[col.key as keyof T];
                        const hasContent = cellValue !== "" && cellValue !== null && cellValue !== undefined;

                        const content = col.render ? col.render(row) : String(cellValue);

                        // Determine tooltip value: custom function > raw cell value
                        const tooltipText = col.tooltipValue
                          ? col.tooltipValue(row)
                          : (cellValue != null ? String(cellValue) : '');

                        // Check if tooltip is enabled (defaults to true)
                        const showTooltip = col.tooltip !== false && hasContent && tooltipText;

                        return (
                          visibleColumns[String(col.key)] && (
                            <TableCell
                              key={String(col.key)}
                              className="border-r overflow-hidden"
                              style={{ width: columnWidths[String(col.key)] || "auto" }}
                            >
                              {showTooltip ? (
                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <div className="truncate cursor-pointer">{content}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{tooltipText}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <div className="truncate">{content}</div>
                              )}
                            </TableCell>
                          )
                        );
                      })}

                      {showActions && (canEdit || canDelete) && (
                        <TableCell className="w-12 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {canEdit && (
                                <DropdownMenuItem onClick={() => onClickEdit?.(row)}>
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete && (
                                <DropdownMenuItem onClick={() => onClickDelete?.(rowId)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
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
                    colSpan={columns.length + (indexing ? 2 : 1)}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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