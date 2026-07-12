import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";
import { toast } from "sonner";
import { Database, Table, Trash2, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/database")({
  beforeLoad: () => {
    // We will verify roles inside the component
  },
  component: AdminDatabase,
});

const TABLES = [
  "suggestions",
  "employees",
  "users",
  "departments",
  "plants",
  "locations",
  "categories",
];

export function AdminDatabase() {
  const { data: sess } = useSession();
  const isSuperAdmin = sess?.roles?.some((r) => r.role === "super_admin");
  const qc = useQueryClient();

  const [table, setTable] = useState<string>("suggestions");
  const [editingRow, setEditingRow] = useState<any>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-database", table],
    enabled: !!isSuperAdmin && !!table,
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false, nullsFirst: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-database", table] });
      toast.success("Record deleted");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete record"),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from(table).update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-database", table] });
      toast.success("Record updated");
      setEditingRow(null);
    },
    onError: (e: any) => toast.error(e.message || "Failed to update record"),
  });

  if (!isSuperAdmin) {
    return (
      <AppShell navGroups={ADMIN_NAV} title="Admin Console">
        <PageHeader title="Database Management" description="Unauthorized access" />
        <div className="p-4 text-destructive">You do not have permission to view this page.</div>
      </AppShell>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]).filter(k => k !== "id") : [];

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Database Management"
        description="Direct database access for Super Admins. Use with caution."
      />
      <div className="flex gap-4 items-center mb-6">
        <div className="w-[300px]">
          <Select value={table} onValueChange={(v) => setTable(v)}>
            <SelectTrigger>
              <Database className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Table" />
            </SelectTrigger>
            <SelectContent>
              {TABLES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-left">
              <th className="px-4 py-2.5 font-medium text-muted-foreground w-16 text-center">Actions</th>
              <th className="px-4 py-2.5 font-medium text-muted-foreground">ID</th>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2.5 font-medium text-muted-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-muted-foreground">
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-muted-foreground">
                  No records found in {table}.
                </td>
              </tr>
            ) : (
              data.map((row: any) => (
                <tr key={row.id} className="hover:bg-muted/30">
                  <td className="px-4 py-2 flex gap-1 justify-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingRow(row)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("Are you sure you want to permanently delete this record?")) {
                          deleteMut.mutate(row.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{String(row.id).slice(0, 8)}...</td>
                  {columns.map((col) => {
                    const val = row[col];
                    return (
                      <td key={col} className="px-4 py-2 max-w-[200px] truncate text-xs">
                        {typeof val === "object" ? JSON.stringify(val) : String(val ?? "—")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingRow} onOpenChange={(o) => !o && setEditingRow(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingRow &&
              columns.map((col) => (
                <div key={col} className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs break-all">{col}</Label>
                  <Input
                    className="col-span-3 h-9 text-sm"
                    value={typeof editingRow[col] === "object" ? JSON.stringify(editingRow[col]) : (editingRow[col] ?? "")}
                    onChange={(e) => setEditingRow({ ...editingRow, [col]: e.target.value })}
                  />
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRow(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateMut.mutate({ id: editingRow.id, updates: editingRow });
              }}
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
