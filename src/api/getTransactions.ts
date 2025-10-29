import type { Transaction } from "@/pages/CreateTransaction/transactions-form.component";

const STORAGE_KEYS = {
  TRANSACTIONS: "transactions",
  CUSTOM_CATEGORIES: "customCategories",
};

export const transactionAPI = {
  getAll: (): Transaction[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  add: (transaction: Omit<Transaction, "id" | "createdAt">): Transaction => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const transactions = transactionAPI.getAll();
    transactions.push(newTransaction);
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
    return newTransaction;
  },

  delete: (id: string): void => {
    const transactions = transactionAPI.getAll().filter((t) => t.id !== id);
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  },

  update: (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "createdAt">>
  ): Transaction | null => {
    const transactions = transactionAPI.getAll();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
    return transactions[index];
  },

  getByType: (type: "income" | "expense"): Transaction[] => {
    return transactionAPI.getAll().filter((t) => t.type === type);
  },

  getByCategory: (category: string): Transaction[] => {
    return transactionAPI.getAll().filter((t) => t.category === category);
  },
};
