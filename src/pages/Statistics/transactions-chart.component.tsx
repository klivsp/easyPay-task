import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Cell,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  currency: string;
  createdAt: string;
};

type TransactionChartsProps = {
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
};

export default function TransactionCharts({
  transactions,
  summary,
}: TransactionChartsProps) {
  const { t } = useTranslation("common");
  const overviewData = [
    { name: t("income"), value: summary.totalIncome, fill: "#22c55e" },
    { name: t("expense"), value: summary.totalExpenses, fill: "#ef4444" },
  ];

  const overviewConfig = {
    value: {
      label: t("amount"),
    },
    income: {
      label: t("income"),
      color: "#22c55e",
    },
    expenses: {
      label: t("expense"),
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  const categoryData = transactions.reduce((acc, transaction) => {
    const existing = acc.find((item) => item.category === transaction.category);
    if (existing) {
      if (transaction.type === "income") {
        existing.income += transaction.amount;
      } else {
        existing.expenses += transaction.amount;
      }
    } else {
      acc.push({
        category: transaction.category,
        income: transaction.type === "income" ? transaction.amount : 0,
        expenses: transaction.type === "expense" ? transaction.amount : 0,
      });
    }
    return acc;
  }, [] as { category: string; income: number; expenses: number }[]);

  const categoryConfig = {
    income: {
      label: t("income"),
      color: "#22c55e",
    },
    expenses: {
      label: t("expense"),
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt);
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;

    const existing = acc.find((item) => item.month === monthYear);
    if (existing) {
      if (transaction.type === "income") {
        existing.income += transaction.amount;
      } else {
        existing.expenses += transaction.amount;
      }
    } else {
      acc.push({
        month: monthYear,
        income: transaction.type === "income" ? transaction.amount : 0,
        expenses: transaction.type === "expense" ? transaction.amount : 0,
        date: date.getTime(),
      });
    }
    return acc;
  }, [] as { month: string; income: number; expenses: number; date: number }[]);

  monthlyData.sort((a, b) => a.date - b.date);

  const monthlyConfig = {
    income: {
      label: t("income"),
      color: "#22c55e",
    },
    expenses: {
      label: t("expense"),
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{t("incomeVsExpense")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={overviewConfig} className="h-[200px] w-full">
            <BarChart data={overviewData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={8}>
                {overviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("byCategory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryConfig} className="h-[200px] w-full">
            <BarChart data={categoryData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>{t("monthlyTrend")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={monthlyConfig} className="h-[200px] w-full">
            <LineChart data={monthlyData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={{ fill: "var(--color-income)" }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="var(--color-expenses)"
                strokeWidth={2}
                dot={{ fill: "var(--color-expenses)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
