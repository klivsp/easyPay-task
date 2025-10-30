import { useEffect, useState } from "react";
import TransactionCharts from "./transactions-chart.component";
import { transactionAPI } from "@/api/getTransactions";

function Statistics() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const allTransactions = transactionAPI.getAll();
  const loadTransactions = () => {
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

  useEffect(() => {
    loadTransactions();

    window.addEventListener("storage", () => loadTransactions());
    window.addEventListener("transactionAdded", () => loadTransactions());
    return () => {
      window.removeEventListener("storage", () => loadTransactions());
      window.removeEventListener("transactionAdded", () => loadTransactions());
    };
  }, []);
  return (
    <div>
      <TransactionCharts summary={summary} transactions={allTransactions} />
    </div>
  );
}

export default Statistics;
