import { STATUS_LABEL, STATUS_STYLES, type SuggestionStatus } from "@/lib/statuses";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { CircleDollarSign, Coins, TrendingUp } from "lucide-react";

export function StatusBadge({ status, className }: { status: SuggestionStatus; className?: string }) {
  const t = useT();
  return (
    <span className={cn("status-pill", STATUS_STYLES[status], className)}>{t(`status_${status}`) || STATUS_LABEL[status]}</span>
  );
}

export function BudgetBadge({ tier, className }: { tier: string; className?: string }) {
  if (tier === "no_cost") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30", className)}>
        <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        No Cost
      </span>
    );
  }
  if (tier === "low_cost") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30", className)}>
        <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        Low Cost
      </span>
    );
  }
  if (tier === "investment") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30", className)}>
        <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        Investment
      </span>
    );
  }
  return null;
}


