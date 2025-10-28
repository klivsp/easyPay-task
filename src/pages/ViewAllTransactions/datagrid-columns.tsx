import type { Transaction } from "../CreateTransaction/transactions-form.component";
import type { Column } from "@/components/custom_components/custom-data-grid.component";

export const getTransactionsListTableColumns = ({
  triggerDeleteEvent,
  handleEdit,
}): unknown => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const columns: Column<Transaction>[] = [
    {
      key: "createdAt",
      header: "Date",
      render: (transaction) => formatDate(transaction.createdAt),
      className: "text-muted-foreground",
    },
    {
      key: "description",
      header: "Description",
      render: (transaction) => transaction.description,
      className: "font-medium",
    },
    {
      key: "category",
      header: "Category",
      render: (transaction) => (
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
          {transaction.category}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (transaction) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            transaction.type === "income"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {transaction.type === "income" ? "Income" : "Expense"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      headerClassName: "text-right",
      render: (transaction) => (
        <span
          className={`font-semibold ${
            transaction.type === "income" ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      render: (transaction) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(transaction)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => triggerDeleteEvent(transaction)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return columns;
};
