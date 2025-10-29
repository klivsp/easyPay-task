import type { ReactNode } from "react";

interface SummaryCardProps {
  label: string;
  valueElement: ReactNode;
  transactionCount: number;
  transactionLabel: string;
  icon: ReactNode;
  isLoading: boolean;
}

export const SummaryCard = ({
  label,
  valueElement,
  transactionCount,
  transactionLabel,
  icon,
  isLoading,
}: SummaryCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {isLoading ? <span>...</span> : valueElement}
          <p className="mt-1 text-xs text-muted-foreground">
            {transactionCount} {transactionLabel}
          </p>
        </div>
        {icon}
      </div>
    </div>
  );
};
