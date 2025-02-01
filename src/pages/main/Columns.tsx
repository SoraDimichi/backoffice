import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "./type";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "username",
    header: "User",
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const dateVal: string = row.getValue("created_at");
      const date = new Date(dateVal);

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formattedDate = date
        .toLocaleString("en-US", options)
        .replace(",", "");

      return formattedDate;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "subtype",
    header: "Sub-type",
  },
  {
    accessorKey: "amount",
    header: "Amount $",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
