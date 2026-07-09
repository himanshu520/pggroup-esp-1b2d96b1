import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, FileType } from "lucide-react";
import { exportAny, type ExportColumn, type ExportFormat } from "@/lib/exports";

export function ExportMenu<T>({
  data,
  columns,
  filename,
  title,
  subtitle,
  label = "Export",
  disabled,
}: {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
  title?: string;
  subtitle?: string;
  label?: ReactNode;
  disabled?: boolean;
}) {
  const run = (format: ExportFormat) =>
    exportAny(format, data, columns, filename, { title: title ?? filename, subtitle });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={disabled || data.length === 0}>
          <Download className="w-4 h-4 mr-1.5" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => run("xlsx")}>
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run("csv")}>
          <FileType className="w-4 h-4 mr-2 text-blue-600" />
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run("pdf")}>
          <FileText className="w-4 h-4 mr-2 text-red-600" />
          PDF (.pdf)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
