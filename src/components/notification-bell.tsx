import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";
import { Bell, CheckCheck, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationBell() {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data = [] } = useQuery({
    queryKey: ["notifications", session?.userId],
    enabled: !!session?.userId,
    // Real-time is primary; keep a slow poll as a safety net for tabs that
    // lose the WebSocket (mobile background, corporate proxies).
    refetchInterval: 60_000,
    queryFn: async (): Promise<Notif[]> => {
      const { data } = await supabase
        .from("notifications")
        .select("id, title, body, link, read, created_at")
        .order("created_at", { ascending: false })
        .limit(30);
      return (data ?? []) as Notif[];
    },
  });

  // Realtime subscription to the notifications table for THIS user.
  useEffect(() => {
    if (!session?.userId) return;
    const channel = supabase
      .channel(`notifications:${session.userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.userId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["notifications", session.userId] });
          qc.invalidateQueries({ queryKey: ["notifications-page", session.userId] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.userId, qc]);

  const unread = useMemo(() => data.filter((n) => !n.read).length, [data]);

  const markOne = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", session?.userId] }),
  });

  const markAll = useMutation({
    mutationFn: async () => {
      await supabase.from("notifications").update({ read: true }).eq("read", false);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", session?.userId] }),
  });

  function handleClick(n: Notif) {
    if (!n.read) markOne.mutate(n.id);
    if (n.link && typeof window !== "undefined") window.location.assign(n.link);
  }

  function goToPage() {
    const dest = session?.isAdmin ? "/admin/notifications" : "/employee/notifications";
    navigate({ to: dest });
  }

  if (!session?.userId) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 sm:h-9 sm:w-9 transition-transform duration-200 hover:scale-110"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="text-sm font-semibold">Notifications</div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
            <button
              onClick={goToPage}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              aria-label="Notification settings"
              title="Open notifications page"
            >
              <Settings2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {data.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              You're all caught up.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data.slice(0, 8).map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => handleClick(n)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors flex gap-2",
                      !n.read && "bg-primary/5",
                    )}
                  >
                    <span className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", !n.read ? "bg-primary" : "bg-transparent")} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium leading-snug">{n.title}</div>
                      {n.body && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</div>}
                      <div className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border">
          <button
            onClick={goToPage}
            className="w-full text-xs text-center py-2 text-primary hover:bg-muted/50"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
