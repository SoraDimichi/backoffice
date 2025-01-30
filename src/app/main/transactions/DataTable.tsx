import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import { getTransactions, LIMIT } from "./getTransactions";
import {
  Transaction,
  TransactionType,
  TransactionSubtype,
  TransactionStatus,
} from "./type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Boundary, useErrorBoundary } from "@/components/ui/Boundary";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
}

const ALL = "All" as const;
export function DataTable({ columns }: DataTableProps<Transaction>) {
  const { showBoundary } = useErrorBoundary();
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [type, setType] = useState<TransactionType | typeof ALL>(ALL);
  const [subtype, setSubtype] = useState<TransactionSubtype | typeof ALL>(ALL);
  const [status, setStatus] = useState<TransactionStatus | typeof ALL>(ALL);
  const [minAmount, setMinAmount] = useState<number | undefined>(undefined);
  const [maxAmount, setMaxAmount] = useState<number | undefined>(undefined);

  const [data, setData] = React.useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const pageCount = Math.ceil(totalCount / LIMIT) || 1;

  useEffect(() => {
    async function fetchData() {
      const { data, count } = await getTransactions({
        page,
        searchTerm: searchTerm || undefined,
        type: type === ALL ? undefined : type,
        subtype: subtype === ALL ? undefined : subtype,
        status: status === ALL ? undefined : status,
        minAmount,
        maxAmount,
      });

      setData(data);
      setTotalCount(count ?? 0);
    }

    fetchData();
  }, [
    page,
    searchTerm,
    type,
    subtype,
    status,
    minAmount,
    maxAmount,
    showBoundary,
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: LIMIT,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        setPage((oldPage) => {
          const newPag = updater({ pageIndex: oldPage - 1, pageSize: LIMIT });
          return newPag.pageIndex + 1;
        });
      } else {
        setPage(updater.pageIndex + 1);
      }
    },
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center pb-4">
        <Input
          placeholder="Search description or user..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        <Select
          value={type}
          onValueChange={(val: typeof type) => {
            setType(val);
            setPage(1);
          }}
          defaultValue={ALL}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {[ALL, ...Object.values(TransactionType)].map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={ALL}
          value={subtype}
          onValueChange={(val: typeof subtype) => {
            setSubtype(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sub-type" />
          </SelectTrigger>
          <SelectContent>
            {[ALL, ...Object.values(TransactionSubtype)].map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(val: typeof status) => {
            setStatus(val);
            setPage(1);
          }}
          defaultValue={ALL}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {[ALL, ...Object.values(TransactionStatus)].map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min $"
            className="w-[80px]"
            value={minAmount ?? ""}
            onChange={(e) => {
              setPage(1);
              setMinAmount(e.target.value ? Number(e.target.value) : undefined);
            }}
          />
          <Input
            type="number"
            placeholder="Max $"
            className="w-[80px]"
            value={maxAmount ?? ""}
            onChange={(e) => {
              setPage(1);
              setMaxAmount(e.target.value ? Number(e.target.value) : undefined);
            }}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            table.setPageIndex(table.getState().pagination.pageIndex - 1)
          }
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            table.setPageIndex(table.getState().pagination.pageIndex + 1)
          }
          disabled={page >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export const TransactionsTable: typeof DataTable = (p) => (
  <Boundary>
    <DataTable {...p} />
  </Boundary>
);
