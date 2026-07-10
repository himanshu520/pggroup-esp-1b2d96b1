import { STATUS_LABEL, STATUS_STYLES, PRIORITY_LABEL, PRIORITY_STYLES, type SuggestionStatus, type Priority } from "@/lib/statuses";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function StatusBadge({ status, className }: { status: SuggestionStatus; className?: string }) {
  const t = useT();
  return (
    <span className={cn("status-pill", STATUS_STYLES[status], className)}>{t(`status_${status}`) || STATUS_LABEL[status]}</span>
  );
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span className={cn("status-pill", PRIORITY_STYLES[priority], className)}>{PRIORITY_LABEL[priority]}</span>
  );
}
