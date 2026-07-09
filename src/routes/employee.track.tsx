import { createFileRoute, redirect } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { STATUS_LABEL } from "@/lib/statuses";
import { Search } from "lucide-react";

export const Route = createFileRoute("/employee/track")({
  beforeLoad: ({ search }) => {
    const code = (search as { code?: string } | undefined)?.code;
    throw redirect({ to: "/employee", search: { section: "track", ...(code ? { code } : {}) } as any });
  },
  component: () => null,
});

export function TrackPage({ initialCode }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  async function search() {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const { data } = await supabase.from("suggestions").select("*, categories(name), employees(name, employee_code), departments!suggestions_department_id_fkey(name), plants(name), locations(location)").ilike("code", code.trim()).maybeSingle();
      setResult(data);
      if (data) {
        const { data: h } = await supabase.from("suggestion_history").select("*").eq("suggestion_id", data.id).order("created_at");
        setHistory(h ?? []);
      } else setHistory([]);
    } finally { setLoading(false); }
  }

  return (
    <EmployeeShell>
      <PageHeader title="Track Suggestion" description="Enter a suggestion ID to see its full timeline." />
      <div className="flex gap-2 mb-6 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input placeholder="SUG-P01-2026-000001" value={code} onChange={(e) => setCode(e.target.value)} className="pl-8 font-mono" onKeyDown={(e) => e.key === "Enter" && search()} />
        </div>
        <Button onClick={search} disabled={loading}>Track</Button>
      </div>

      {result ? (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-muted-foreground">{result.code}</div>
                <h2 className="text-lg font-semibold mt-1">{result.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={result.status} /><PriorityBadge priority={result.priority} />
                  <span className="text-xs text-muted-foreground">Submitted {new Date(result.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm border-t border-border pt-3">
              <Meta label="Employee" value={`${result.employees?.name} (${result.employees?.employee_code})`} />
              <Meta label="Category" value={result.categories?.name ?? "—"} />
              <Meta label="Department" value={result.departments?.name ?? "—"} />
              <Meta label="Plant" value={result.plants?.name ?? "—"} />
              <Meta label="Location" value={result.locations?.location ?? "—"} />
              <Meta label="Expected saving" value={result.expected_saving ? `₹ ${Number(result.expected_saving).toLocaleString()}` : "—"} />
            </div>
            <div className="border-t border-border pt-3 space-y-3">
              <Section title="Problem" body={result.problem} />
              <Section title="Suggested method" body={result.suggested_method} />
              <Section title="Expected benefits" body={result.expected_benefits} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-sm font-medium mb-3">Timeline</div>
            <ol className="space-y-4 relative">
              {history.map((h, i) => (
                <li key={h.id} className="relative pl-6">
                  <div className="absolute left-1.5 top-1 w-2 h-2 rounded-full bg-primary" />
                  {i < history.length - 1 && <div className="absolute left-2 top-3 bottom-[-1rem] w-px bg-border" />}
                  <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                  <div className="text-sm font-medium">{STATUS_LABEL[h.to_status as keyof typeof STATUS_LABEL]}</div>
                  {h.remarks && <div className="text-xs text-muted-foreground mt-0.5">{h.remarks}</div>}
                </li>
              ))}
              {history.length === 0 && <li className="text-xs text-muted-foreground">No activity yet.</li>}
            </ol>
          </div>
        </div>
      ) : code && !loading ? (
        <div className="text-sm text-muted-foreground">No suggestion found for that ID.</div>
      ) : null}
    </EmployeeShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (<div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-0.5">{value}</div></div>);
}
function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (<div><div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div><div className="mt-1 text-sm whitespace-pre-wrap">{body}</div></div>);
}
