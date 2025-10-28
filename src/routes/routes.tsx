import CreateTransaction from "@/pages/CreateTransaction/create-transaction.page";
import ViewAllTransactions from "@/pages/ViewAllTransactions/view-all-transactions.page";
import { Route, Routes } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<CreateTransaction />} path="/" />
      <Route element={<ViewAllTransactions />} path="/all-transactions" />
    </Routes>
  );
};

export default AppRoutes;
