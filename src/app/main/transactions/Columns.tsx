import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "./type";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "user_id",
    header: "User",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("type")}</span>
    ),
  },
  {
    accessorKey: "subtype",
    header: "Sub-type",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("subtype")}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return currencyFormatter.format(amount);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("status")}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const dateVal: string = row.getValue("created_at");
      const date = new Date(dateVal);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => {
      const dateVal: string = row.getValue("updated_at");
      const date = new Date(dateVal);
      return date.toLocaleString();
    },
  },
];
