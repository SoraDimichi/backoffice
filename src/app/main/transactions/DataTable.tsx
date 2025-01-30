import { useCallback, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  type Row,
} from "@tanstack/react-table";
import { useDebouncedCallback } from "use-debounce";

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
import { columns } from "./Columns";

interface DataTableProps<TValue> {
  columns: ColumnDef<Transaction, TValue>[];
  data: Transaction[];
}

const ALL = "All" as const;
export function DataTable<TValue>(
  p: DataTableProps<TValue> & { setData: (data: Transaction[]) => void },
) {
  const { columns, setData, data } = p;
  const { showBoundary } = useErrorBoundary();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<TransactionType | typeof ALL>(ALL);
  const [subtype, setSubtype] = useState<TransactionSubtype | typeof ALL>(ALL);
  const [status, setStatus] = useState<TransactionStatus | typeof ALL>(ALL);

  const [searchTerm, setSearchTerm] = useState("");

  const setDSearchTerm = useDebouncedCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, 500);
  const [minAmount, setMinAmount] = useState<number | undefined>(undefined);
  const [maxAmount, setMaxAmount] = useState<number | undefined>(undefined);

  const [totalCount, setTotalCount] = useState(0);
  const pageCount = Math.ceil(totalCount / LIMIT) || 1;

  const cb = useCallback(async () => {
    try {
      const { data, count } = await getTransactions({
        page,
        searchTerm: searchTerm || undefined,
        type: type === ALL ? undefined : type,
        subtype: subtype === ALL ? undefined : subtype,
        status: status === ALL ? undefined : status,
        minAmount,
        maxAmount,
      });
      setData(data as Transaction[]);
      setTotalCount(count ?? 0);
    } catch (error) {
      showBoundary(error);
    }
  }, [
    page,
    setData,
    searchTerm,
    type,
    subtype,
    status,
    minAmount,
    maxAmount,
    showBoundary,
  ]);

  useEffect(() => {
    cb();
  }, [cb]);

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
          onChange={setDSearchTerm}
        />
        Type
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
        Sybtype
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
        Status
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
          Min $
          <Input
            type="number"
            className="w-[80px]"
            value={minAmount ?? ""}
            onChange={(e) => {
              setPage(1);
              const rawMin = Number(e.target.value);
              const newMin = rawMin < 0 ? 0 : rawMin;
              if (maxAmount !== undefined && newMin >= maxAmount) {
                setMaxAmount(newMin + 1);
              }
              setMinAmount(e.target.value ? newMin : undefined);
            }}
          />
          Max $
          <Input
            type="number"
            className="w-[80px]"
            value={maxAmount ?? ""}
            onChange={(e) => {
              setPage(1);
              const rawMax = Number(e.target.value);
              let newMax = rawMax < 0 ? 0 : rawMax;
              if (minAmount !== undefined && newMax <= minAmount) {
                const shiftedMin = Math.max(0, newMax - 1);
                setMinAmount(shiftedMin);
                if (shiftedMin >= newMax) {
                  newMax = shiftedMin + 1;
                }
              }
              setMaxAmount(e.target.value ? newMax : undefined);
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
                    {flexRender(
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
              table
                .getRowModel()
                .rows.map((row) => <Row key={crypto.randomUUID()} row={row} />)
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

const Row = ({ row }: { row: Row<Transaction> }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TableRow key={row.id} className="relative">
      {row.getVisibleCells().map((cell, i) => {
        const item = (cell.getValue() ?? "").toString();
        const stars = "*".repeat(item.length);

        return (
          <TableCell key={cell.id}>
            {i < 2
              ? flexRender(cell.column.columnDef.cell, cell.getContext())
              : visible
                ? item
                : stars}
          </TableCell>
        );
      })}
      <div onClick={() => setVisible(true)} className="absolute inset-0" />
    </TableRow>
  );
};

export const TransactionsTable = () => {
  const [data, setData] = useState<Transaction[]>([]);

  return (
    <Boundary>
      <DataTable columns={columns} data={data} setData={setData} />
    </Boundary>
  );
};
