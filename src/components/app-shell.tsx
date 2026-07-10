import { Link, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

const AppShellContext = createContext(false);
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";
import { ROLE_LABEL } from "@/lib/statuses";
import { LogOut, Menu, X, User, Loader2 } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import pgLogo from "@/assets/pg-logo.png.asset.json";
import espLogo from "@/assets/esp-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Optional search-param section id — used by consolidated single-page shells (e.g. /admin?section=x). */
  section?: string;
};

export function AppShell(props: {
  navGroups: Array<{ label?: string; items: NavItem[] }>;
  title: string;
  children: ReactNode;
  collapsible?: boolean;
}) {
  const nested = useContext(AppShellContext);
  if (nested) return <>{props.children}</>;
  return (
    <AppShellContext.Provider value={true}>
      <AppShellInner {...props} />
    </AppShellContext.Provider>
  );
}

function AppShellInner({
  navGroups,
  title,
  children,
  collapsible = true,
}: {
  navGroups: Array<{ label?: string; items: NavItem[] }>;
  title: string;
  children: ReactNode;
  collapsible?: boolean;
}) {
  const { data: session } = useSession();
  const loc = useLocation();
  const navigate = useNavigate();
  const router = useRouter();

  const firstRole = session?.roles?.[0];
  const locName = session?.employee?.locations?.location || firstRole?.locations?.location;
  const plantName = session?.employee?.plants?.name || firstRole?.plants?.name;
  const deptName = session?.employee?.departments?.name || firstRole?.departments?.name;
  const qc = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Persist collapsed state across route changes (AppShell remounts per route)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return collapsible;
    const v = window.localStorage.getItem("esp:sidebar-collapsed");
    if (v === "1") return true;
    if (v === "0") return false;
    return collapsible;
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("esp:sidebar-collapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pgLoaded, setPgLoaded] = useState(false);
  const [espLoaded, setEspLoaded] = useState(false);
  const pgImgRef = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0) setPgLoaded(true);
  }, []);
  const espImgRef = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0) setEspLoaded(true);
  }, []);



  async function signOut() {
    const isEmployee = typeof window !== "undefined" && window.location.pathname.startsWith("/employee");
    const loginPath = isEmployee ? "/employee/login" : "/auth";
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      try { window.localStorage.clear(); } catch { /* ignore */ }
      try { window.sessionStorage.clear(); } catch { /* ignore */ }
    }
    router.invalidate();
    toast.success("You have been signed out", {
      description: "Your session has been cleared.",
      action: {
        label: "Back to login",
        onClick: () => navigate({ to: loginPath, replace: true }),
      },
    });
    navigate({ to: loginPath, replace: true });
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    await signOut();
  }

  const initials = (session?.employee?.name ?? session?.email ?? "U").slice(0, 2).toUpperCase();

  const sidebar = (
    <aside
      className={cn(
        "shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col w-64",
        "lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]",
        "fixed inset-y-0 left-0 z-50 h-screen transition-all duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        collapsible && collapsed && "lg:w-16",
      )}
    >
      {/* Mobile-only close button */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
        <span className="text-sm font-semibold text-sidebar-foreground truncate">Menu</span>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="p-2 -mr-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups
          .filter((g) => g.label !== "Administration" || session?.primaryRole === "super_admin")
          .map((g, gi) => (
          <div key={gi}>
            {g.label && (!collapsible || !collapsed) && (
              <div className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">{g.label}</div>
            )}
            <div className="space-y-1">
              {g.items.map((item) => {
                // Index/dashboard routes (e.g. "/admin", "/employee") must only match exactly,
                // otherwise every child path (/admin/suggestions, …) also lights them up.
                const isIndexRoute = item.to === "/admin" || item.to === "/employee" || item.to === "/";
                const currentSection = (loc.search as { section?: string } | undefined)?.section;
                const pathActive = isIndexRoute
                  ? loc.pathname === item.to
                  : loc.pathname === item.to || loc.pathname.startsWith(item.to + "/");
                const active = item.section !== undefined || currentSection !== undefined
                  // Consolidated single-page shell: match on ?section=… (undefined section = overview default)
                  ? pathActive && (item.section ?? undefined) === (currentSection ?? undefined)
                  : pathActive;
                const Icon = item.icon;
                const showLabel = !collapsible || !collapsed;
                return (
                  <Link
                    key={item.to + ":" + (item.section ?? "")}
                    to={item.to}
                    search={item.section ? { section: item.section } as any : undefined}
                    onClick={() => setMobileOpen(false)}
                    title={collapsible && collapsed ? item.label : undefined}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                      active && "bg-primary/10 text-primary font-semibold border-l-2 border-primary",
                      collapsible && collapsed && "lg:justify-center lg:px-0",
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {showLabel && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>


      {/* Bottom user / role */}
      <div className={cn("border-t border-sidebar-border p-3", collapsible && collapsed && "lg:hidden")}>
        <div className="rounded-lg bg-muted/50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="grid place-items-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">{initials}</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground truncate">{session?.employee?.name ?? session?.email ?? "User"}</div>
              {session?.primaryRole && (
                <div className="text-[10px] text-muted-foreground mt-0.5 font-medium truncate">
                  {ROLE_LABEL[session.primaryRole]}
                </div>
              )}
            </div>
          </div>
          
          {(locName || plantName || deptName) && (
            <div className="text-[10px] border-t border-sidebar-border/60 pt-2 space-y-0.5 text-muted-foreground/90 font-medium leading-normal">
              {locName && (
                <div className="truncate"><span className="text-foreground/60 font-semibold">Loc:</span> {locName}</div>
              )}
              {plantName && (
                <div className="truncate"><span className="text-foreground/60 font-semibold">Plant:</span> {plantName}</div>
              )}
              {deptName && (
                <div className="truncate"><span className="text-foreground/60 font-semibold">Dept:</span> {deptName}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  function toggleSidebar() {
    // Mobile: open the drawer. Desktop: collapse/expand.
    if (window.matchMedia("(min-width: 1024px)").matches) {
      if (collapsible) setCollapsed((c) => !c);
    } else {
      setMobileOpen((o) => !o);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="sticky top-0 z-30 w-full h-16 bg-background/95 backdrop-blur border-b border-border flex items-center justify-between px-2 sm:px-4 gap-2">
        <div className="flex items-center gap-1 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="shrink-0 grid place-items-center w-8 h-8 sm:w-9 sm:h-9 -ml-1 rounded-md hover:bg-muted"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 sm:gap-3 min-w-0" role="img" aria-label="PG Group — Employee Suggestion Portal">
            <div className="relative bg-white rounded-md px-1 sm:px-2 h-11 sm:h-13 w-[64px] sm:w-[110px] flex items-center justify-center shadow-sm shrink-0 border border-border/60">
              {!pgLoaded && (
                <div aria-hidden="true" className="absolute inset-1 rounded bg-muted/60 animate-pulse" />
              )}
              <img
                ref={pgImgRef}
                src={pgLogo.url}
                alt="PG Group company logo"
                width={184}
                height={80}
                decoding="async"
                fetchPriority="high"
                onLoad={() => setPgLoaded(true)}
                className={cn("brand-logo h-8 sm:h-11 w-auto max-w-full object-contain hover-scale", pgLoaded && "is-loaded")}
              />
            </div>
            <div className="relative bg-white rounded-md px-1 sm:px-2 h-11 sm:h-13 w-[64px] sm:w-[110px] flex items-center justify-center shadow-sm shrink-0 border border-border/60">
              {!espLoaded && (
                <div aria-hidden="true" className="absolute inset-1 rounded bg-muted/60 animate-pulse" />
              )}
              <img
                ref={espImgRef}
                src={espLogo.url}
                alt="Employee Suggestion Portal logo"
                width={184}
                height={80}
                decoding="async"
                fetchPriority="high"
                onLoad={() => setEspLoaded(true)}
                className={cn("brand-logo brand-logo-delay h-8 sm:h-11 w-auto max-w-full object-contain hover-scale", espLoaded && "is-loaded")}
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="text-sm font-bold text-foreground truncate">Employee Suggestion Portal (ESP)</span>
              <span className="text-[11px] text-muted-foreground truncate">{title}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 transition-transform duration-200 hover:scale-110" aria-label="User menu">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{session?.employee?.name ?? session?.email ?? "User"}</span>
                  <span className="text-xs text-muted-foreground truncate">{session?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" /> My Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 sm:h-9 px-1.5 sm:px-3 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Logout</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm logout</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging out…
                    </>
                  ) : (
                    "Logout"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>My Profile</DialogTitle>
                <DialogDescription>Your account and role details.</DialogDescription>
              </DialogHeader>
              <div className="space-y-1">
                <ProfileRow label="Name" value={session?.employee?.name ?? session?.email} />
                <ProfileRow label="Email" value={session?.email} />
                <ProfileRow label="Role" value={session?.primaryRole ? ROLE_LABEL[session.primaryRole] : undefined} />
                {session?.employee && (
                  <>
                    <ProfileRow label="Employee ID" value={session.employee.employee_code} />
                    <ProfileRow label="Designation" value={session.employee.designation} />
                    <ProfileRow label="Mobile" value={session.employee.mobile} />
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex flex-1 min-w-0">
        {sidebar}
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <main className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto page-fade-in">{children}</main>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value ?? "—"}</span>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

const TONE_STYLES = {
  default: { bar: "bg-primary", num: "text-foreground" },
  info: { bar: "bg-info", num: "text-info" },
  success: { bar: "bg-success", num: "text-success" },
  warning: { bar: "bg-warning", num: "text-warning" },
  destructive: { bar: "bg-destructive", num: "text-destructive" },
  accent: { bar: "bg-[color:oklch(0.60_0.20_300)]", num: "text-[color:oklch(0.55_0.20_300)]" },
} as const;

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: keyof typeof TONE_STYLES;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const t = TONE_STYLES[tone];
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
      <div className={cn("h-1", t.bar)} />
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={cn("mt-2 text-3xl font-bold leading-none", t.num)}>{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1.5">{hint}</div>}
        </div>
        {Icon && (
          <div className={cn("shrink-0 grid place-items-center w-9 h-9 rounded-md bg-muted/60", t.num)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
