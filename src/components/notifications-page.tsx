import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Inbox, Settings2 } from "lucide-react";

type Notif = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
  event_type: string | null;
  suggestion_id: string | null;
};

type Filter = "new" | "unread" | "all";

const EVENT_TYPES: Array<{ key: "submit" | "transfer" | "approve" | "reject" | "evidence" | "verification"; label: string; hint: string }> = [
  { key: "submit", label: "New suggestion submitted", hint: "PE / super admin get notified when an employee submits" },
  { key: "transfer", label: "Transfer / routing", hint: "When a suggestion is transferred between departments" },
  { key: "approve", label: "Approval", hint: "When a department approves a suggestion" },
  { key: "reject", label: "Rejection", hint: "When a suggestion is rejected" },
  { key: "evidence", label: "Evidence submitted", hint: "When implementation evidence is uploaded" },
  { key: "verification", label: "PE verification", hint: "Final verification outcome — implemented or fake closure" },
];

const PAGE_SIZE = 20;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleString();
}

export function NotificationsPage() {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(0);
  const [showPrefs, setShowPrefs] = useState(false);

  const listKey = ["notifications-page", session?.userId, filter, page] as const;

  const { data: list } = useQuery({
    queryKey: listKey,
    enabled: !!session?.userId,
    queryFn: async () => {
      let q = supabase
        .from("notifications")
        .select("id, title, body, link, read, created_at, event_type, suggestion_id", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
      if (filter === "unread") q = q.eq("read", false);
      if (filter === "new") q = q.eq("read", false).gt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      const { data, count } = await q;
      return { rows: (data ?? []) as Notif[], count: count ?? 0 };
    },
  });

  const rows = list?.rows ?? [];
  const total = list?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const markOne = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications-page", session?.userId] });
      qc.invalidateQueries({ queryKey: ["notifications", session?.userId] });
    },
  });

  const markAll = useMutation({
    mutationFn: async () => {
      await supabase.from("notifications").update({ read: true }).eq("read", false);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications-page", session?.userId] });
      qc.invalidateQueries({ queryKey: ["notifications", session?.userId] });
      toast.success("All notifications marked as read");
    },
  });

  function open(n: Notif) {
    if (!n.read) markOne.mutate(n.id);
    if (n.link) {
      // Prefer TanStack navigation for internal links so history updates
      // cleanly instead of a full page reload.
      if (n.link.startsWith("/")) navigate({ to: n.link as any });
      else if (typeof window !== "undefined") window.location.assign(n.link);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All workflow updates for your account. {total > 0 && <span>· {total} total</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(!!session?.isAdmin || !!session?.isPE) && (
            <Button variant="outline" size="sm" onClick={() => setShowPrefs((v) => !v)}>
              <Settings2 className="w-4 h-4 mr-1" /> Preferences
            </Button>
          )}
          <Button size="sm" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
            <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
          </Button>
        </div>
      </div>

      {showPrefs && <PreferencesPanel />}

      <div className="flex items-center gap-1 rounded-lg bg-muted p-1 w-fit">
        {(["new", "unread", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(0);
            }}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors",
              filter === f ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <Inbox className="w-8 h-8" />
            You're all caught up.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => open(n)}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex gap-3",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <span className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", !n.read ? "bg-primary" : "bg-transparent")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium leading-snug">{n.title}</div>
                      {n.event_type && (
                        <span className="text-[10px] uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {n.event_type}
                        </span>
                      )}
                    </div>
                    {n.body && <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>}
                    <div className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <ChevronLeft className="w-3 h-3" /> Prev
            </Button>
            <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PreferencesPanel() {
  const { data: session } = useSession();
  const qc = useQueryClient();

  // "submit" fires only to PE / super_admin audiences; hide that toggle from
  // regular employees so they don't see irrelevant admin preferences.
  const isAdminOrPE = !!session?.isAdmin || !!session?.isPE;
  const visibleEvents = useMemo(
    () => EVENT_TYPES.filter((ev) => (ev.key === "submit" ? isAdminOrPE : true)),
    [isAdminOrPE],
  );

  const key = ["notification-prefs", session?.userId] as const;
  const { data: prefs } = useQuery({
    queryKey: key,
    enabled: !!session?.userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("event_type, in_app, email")
        .eq("user_id", session!.userId);
      return (data ?? []) as Array<{ event_type: string; in_app: boolean; email: boolean }>;
    },
  });

  const map = useMemo(() => {
    const m = new Map<string, { in_app: boolean; email: boolean }>();
    (prefs ?? []).forEach((p) => m.set(p.event_type, { in_app: p.in_app, email: p.email }));
    return m;
  }, [prefs]);

  const update = useMutation({
    mutationFn: async (v: { event_type: string; in_app: boolean; email: boolean }) => {
      if (!session?.userId) return;
      await supabase.from("notification_preferences").upsert(
        { user_id: session.userId, event_type: v.event_type, in_app: v.in_app, email: v.email },
        { onConflict: "user_id,event_type" },
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: any) => toast.error(e.message ?? "Could not save preference"),
  });

  function toggle(event_type: string, channel: "in_app" | "email", value: boolean) {
    const cur = map.get(event_type) ?? { in_app: true, email: true };
    const next = { ...cur, [channel]: value };
    update.mutate({ event_type, in_app: next.in_app, email: next.email });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <div className="text-sm font-semibold">Notification preferences</div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choose which events reach you in-app and by email. Changes save automatically.
        </p>
      </div>
      <div className="divide-y divide-border">
        <div className="grid grid-cols-[1fr_80px_80px] items-center py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div>Event</div>
          <div className="text-center">In-app</div>
          <div className="text-center">Email</div>
        </div>
        {visibleEvents.map((ev) => {
          const p = map.get(ev.key) ?? { in_app: true, email: true };
          return (
            <div key={ev.key} className="grid grid-cols-[1fr_80px_80px] items-center py-2.5">
              <div className="min-w-0 pr-3">
                <div className="text-sm font-medium">{ev.label}</div>
                <div className="text-xs text-muted-foreground">{ev.hint}</div>
              </div>
              <div className="flex justify-center">
                <Switch checked={p.in_app} onCheckedChange={(v) => toggle(ev.key, "in_app", v)} />
              </div>
              <div className="flex justify-center">
                <Switch checked={p.email} onCheckedChange={(v) => toggle(ev.key, "email", v)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
