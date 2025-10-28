import { Card } from "@/components/ui/card";
import { TransactionForm } from "./transactions-form.component";

function CreateTransaction() {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <Card className="w-full max-w-md p-8">
        <TransactionForm />
      </Card>
    </div>
  );
}

export default CreateTransaction;
