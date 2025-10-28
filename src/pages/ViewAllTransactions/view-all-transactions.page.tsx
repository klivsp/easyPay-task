import { useEffect, useMemo, useState, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type DateSort = "none" | "asc" | "desc";
type AmountSort = "none" | "asc" | "desc";
type TypeFilter = "all" | "income" | "expense";
type CategoryFilter = "all" | string;

export default function ViewAllTransactions() {
  const { t } = useTranslation("common");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const [dateSort, setDateSort] = useState<DateSort>("desc");
  const [amountSort, setAmountSort] = useState<AmountSort>("none");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

      const allCategories = Array.from(
        new Set(allTransactions.map((t) => t.category))
      );
      setCategories(allCategories);
    };

    loadTransactions();

    const handleStorageChange = () => loadTransactions();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("transactionAdded", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("transactionAdded", handleStorageChange);
    };
  }, []);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);

  const triggerDeleteEvent = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  }, []);

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

  const handleEdit = useCallback(
    (transaction: Transaction) => {
      navigate(`/`, { state: { transaction } });
    },
    [navigate]
  );

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () =>
      getTransactionsListTableColumns({
        triggerDeleteEvent,
        handleEdit,
      }) as ColumnDef<Transaction>[],
    [triggerDeleteEvent, handleEdit]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = typeFilter === "all" ? true : t.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" ? true : t.category === categoryFilter;
      const matchesSearch = t.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [transactions, typeFilter, categoryFilter, searchTerm]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (dateSort !== "none") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        const dateComparison = dateA - dateB;
        if (dateComparison !== 0)
          return dateSort === "asc" ? dateComparison : -dateComparison;
      }

      if (amountSort !== "none") {
        const amountComparison = a.amount - b.amount;
        if (amountComparison !== 0)
          return amountSort === "asc" ? amountComparison : -amountComparison;
      }

      if (dateSort === "none" && amountSort === "none") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      return 0;
    });
  }, [filteredTransactions, dateSort, amountSort]);

  const handleDateSortChange = (value: DateSort) => {
    setDateSort(value);
    if (value !== "none") setAmountSort("none");
  };

  const handleAmountSortChange = (value: AmountSort) => {
    setAmountSort(value);
    if (value !== "none") setDateSort("none");
  };

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

        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex-2 min-w-[250px]">
            <Label htmlFor="search" className="mb-2 block text-sm font-medium">
              Search by Description
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label
              htmlFor="date-sort"
              className="mb-2 block text-sm font-medium"
            >
              Sort by Date
            </Label>
            <Select value={dateSort} onValueChange={handleDateSortChange}>
              <SelectTrigger id="date-sort">
                <SelectValue placeholder="Select date order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sort</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
                <SelectItem value="desc">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label
              htmlFor="amount-sort"
              className="mb-2 block text-sm font-medium"
            >
              Sort by Amount
            </Label>
            <Select value={amountSort} onValueChange={handleAmountSortChange}>
              <SelectTrigger id="amount-sort">
                <SelectValue placeholder="Select amount order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sort</SelectItem>
                <SelectItem value="asc">Lowest First</SelectItem>
                <SelectItem value="desc">Highest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label
              htmlFor="type-filter"
              className="mb-2 block text-sm font-medium"
            >
              Filter by Type
            </Label>
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as TypeFilter)}
            >
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label
              htmlFor="category-filter"
              className="mb-2 block text-sm font-medium"
            >
              Filter by Category
            </Label>
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value as CategoryFilter)
              }
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
