import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { transactionAPI } from "@/api/getTransactions";
import { useTranslation } from "react-i18next";
import { useGetCurrenciesQuery } from "@/redux/services/api";
import { useLocation } from "react-router";

const transactionFormSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  type: z.enum(["income", "expense"] as const),
  category: z.string().min(1, "Please select or create a category"),
  currency: z.string().min(1, "Please select a currency"),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  currency: string;
  createdAt: string;
};

const DEFAULT_CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  expense: [
    "Food",
    "Rent",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Other",
  ],
};

const STORAGE_KEYS = {
  TRANSACTIONS: "transactions",
  CUSTOM_CATEGORIES: "customCategories",
};

export function TransactionForm() {
  const [customCategories, setCustomCategories] = useState<{
    income: string[];
    expense: string[];
  }>({
    income: [],
    expense: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation("common");
  const { state } = useLocation();
  const selectedTransaction = state?.transaction;

  const { data: currencies } = useGetCurrenciesQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCategories = localStorage.getItem(
        STORAGE_KEYS.CUSTOM_CATEGORIES
      );
      if (savedCategories) {
        setCustomCategories(JSON.parse(savedCategories));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_CATEGORIES,
        JSON.stringify(customCategories)
      );
    }
  }, [customCategories]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      type: "expense",
      category: "",
      currency: "USD",
    },
  });

  const transactionType = form.watch("type");

  const availableCategories = [
    ...DEFAULT_CATEGORIES[transactionType],
    ...customCategories[transactionType],
  ];

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !availableCategories.includes(newCategory.trim())
    ) {
      setCustomCategories((prev) => ({
        ...prev,
        [transactionType]: [...prev[transactionType], newCategory.trim()],
      }));
      form.setValue("category", newCategory.trim());
      setNewCategory("");
      setIsDialogOpen(false);
    }
  };

  function onSubmit(data: TransactionFormValues) {
    transactionAPI.add({
      description: data.description,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      currency: data.currency,
    });

    if (selectedTransaction) {
      toast.success("Transaction updated successfully!");
      return;
    }

    toast.success("Transaction added successfully!");

    form.reset();
  }

  useEffect(() => {
    if (selectedTransaction) {
      form.reset({
        ...selectedTransaction,
        amount: String(selectedTransaction.amount),
      });
    }
  }, [selectedTransaction]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grocery shopping" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("amount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("currency")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies?.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t("transactionType")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t("income")}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {t("expense")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("category")}</FormLabel>
              <div className="flex gap-2">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Plus className="size-4" />
                      <span className="sr-only">{t("addNewCategory")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("addNewCategory")}</DialogTitle>
                      <DialogDescription>
                        Create a custom category for your {transactionType}{" "}
                        transactions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        placeholder="Category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setNewCategory("");
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="button" onClick={handleAddCategory}>
                        {t("addCategory")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <FormDescription>{t("selectOrCreateCategory")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t("addTransaction")}
        </Button>
      </form>
    </Form>
  );
}
