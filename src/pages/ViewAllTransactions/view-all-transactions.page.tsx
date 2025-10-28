import { useEffect, useMemo, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import type { Transaction } from "../CreateTransaction/transactions-form.component";
import { transactionAPI } from "@/api/getTransactions";
import CustomDatagrid from "@/components/custom_components/custom-data-grid.component";
import type { ColumnDef } from "@tanstack/react-table";
import { getTransactionsListTableColumns } from "./datagrid-columns";
import ConfirmationDialog from "@/components/custom_components/confirmation-dialog.component";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function ViewAllTransactions() {
  const { t } = useTranslation("common");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  useEffect(() => {
    const loadTransactions = () => {
      const allTransactions = transactionAPI.getAll();
      setTransactions(allTransactions);

      const income = allTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = allTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
      });
    };

    loadTransactions();

    const handleStorageChange = () => {
      loadTransactions();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("transactionAdded", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("transactionAdded", handleStorageChange);
    };
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const triggerDeleteEvent = (transaction) => {
    console.log("Delete transaction:", transaction);
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    const transactions = transactionAPI.getAll();
    const filtered = transactions.filter(
      (t) => t.id !== selectedTransaction?.id
    );
    localStorage.setItem("transactions", JSON.stringify(filtered));
    window.dispatchEvent(new Event("transactionAdded"));
    setShowDeleteDialog(false);
    toast.success(t("transactionDeletedSuccess"));
  };

  const handleEdit = (transaction: Transaction) => {
    navigate(`/`, { state: { transaction } });
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () =>
      getTransactionsListTableColumns({
        triggerDeleteEvent,
        handleEdit,
      }) as ColumnDef<Transaction>[],
    []
  );

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Income
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {formatCurrency(summary.totalIncome, "USD")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {transactionAPI.getByType("income").length} transactions
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <ArrowUpCircle className="size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {formatCurrency(summary.totalExpenses, "USD")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {transactionAPI.getByType("expense").length} transactions
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <ArrowDownCircle className="size-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </p>
                <p
                  className={`mt-2 text-3xl font-bold ${
                    summary.balance >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(summary.balance, "USD")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {transactions.length} total transactions
                </p>
              </div>
              <div
                className={`rounded-full p-3 ${
                  summary.balance >= 0 ? "bg-blue-100" : "bg-red-100"
                }`}
              >
                <Wallet
                  className={`size-6 ${
                    summary.balance >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <CustomDatagrid
          data={sortedTransactions}
          columns={columns}
          title="All Transactions"
          emptyMessage="No transactions yet. Start by adding your first transaction!"
          defaultItemsPerPage={10}
          itemsPerPageOptions={[5, 10, 20]}
          getRowKey={(transaction) => transaction.id}
        />
      </div>
      <ConfirmationDialog
        description={t("deleteTransactionDesc")}
        title={t("deleteTransaction")}
        handleSubmit={handleDelete}
        openModal={showDeleteDialog}
        setOpenModal={setShowDeleteDialog}
      />
    </main>
  );
}
