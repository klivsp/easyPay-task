import CreateTransaction from "@/pages/CreateTransaction/create-transaction.page";
import ViewAllTransactions from "@/pages/ViewAllTransactions/view-all-transactions.page";
import Statistics from "@/pages/Statistics/Statistics.page";
import { Route, Routes } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<CreateTransaction />} path="/" />
      <Route element={<ViewAllTransactions />} path="/all-transactions" />
      <Route element={<Statistics />} path="/statistics" />
    </Routes>
  );
};

export default AppRoutes;
