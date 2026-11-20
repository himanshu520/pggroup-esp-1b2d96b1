import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /**
   * Description is rendered as plain text — user-provided content cannot inject HTML.
   * For structured content, pass a `body` node built from trusted static markup.
   */
  description?: string;
  body?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

/**
 * Shared confirmation dialog for destructive / irreversible actions in admin pages.
 * Replaces window.confirm/alert with a styled, accessible AlertDialog.
 *
 * - `description` is rendered as **plain text** (React auto-escapes).
 * - Buttons are disabled and show a spinner while `loading` is true.
 * - Closing via ESC / overlay click is blocked while loading.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        if (loading) return; // prevent closing mid-flight
        onOpenChange(o);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            // Plain text — no dangerouslySetInnerHTML, no HTML parsing.
            <AlertDialogDescription className="whitespace-pre-wrap break-words">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {body}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className={cn(destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
            onClick={(e) => {
              // Prevent Radix's default close-on-click so we can await the action.
              e.preventDefault();
              void onConfirm();
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Working…
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
