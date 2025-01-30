import { columns } from "./Columns";
import { TransactionsTable } from "./DataTable";

export const Transactions = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>
      <TransactionsTable columns={columns} />
    </div>
  );
};
