import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/splash-screen";
import { OfflineDetector } from "@/components/offline-detector";
import { LanguageProvider } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-semibold text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Return home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    const msg = error?.message || String(error || "");
    if (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Importing a module script failed") ||
      msg.includes("dynamically imported") ||
      msg.includes("404")
    ) {
      const lastReload = sessionStorage.getItem("esp_chunk_reload_ts");
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem("esp_chunk_reload_ts", String(now));
        window.location.reload();
      }
    }
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Employee Suggestion Portal (ESP)" },
      { name: "description", content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant." },
      { property: "og:title", content: "Employee Suggestion Portal (ESP)" },
      { property: "og:description", content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Employee Suggestion Portal (ESP)" },
      { name: "twitter:description", content: "Enterprise employee suggestion management. Submit, review, approve, and implement improvement ideas across every plant." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Xtgjz4wmJlYnE0E185Q2wdT3x553/social-images/social-1783225025676-ESP_(2).webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Xtgjz4wmJlYnE0E185Q2wdT3x553/social-images/social-1783225025676-ESP_(2).webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    // Automatically recover from stale asset chunk 404s after new Vercel deployments
    const handleChunkError = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const isScriptError = target && target.tagName === "SCRIPT";
      const reason = (event as any).reason || (event as any).detail || (event as any).error;
      const errorMsg = reason?.message || (event as any).message || String(event || "");

      if (
        event.type === "vite:preloadError" ||
        isScriptError ||
        (typeof errorMsg === "string" &&
          (errorMsg.includes("Failed to fetch dynamically imported module") ||
            errorMsg.includes("Importing a module script failed") ||
            errorMsg.includes("Failed to load resource") ||
            errorMsg.includes("dynamically imported") ||
            errorMsg.includes("404")))
      ) {
        if (event.preventDefault) event.preventDefault();
        const lastReload = sessionStorage.getItem("esp_chunk_reload_ts");
        const now = Date.now();
        // Prevent infinite reload loops within 10 seconds
        if (!lastReload || now - Number(lastReload) > 10000) {
          sessionStorage.setItem("esp_chunk_reload_ts", String(now));
          window.location.reload();
        }
      }
    };

    window.addEventListener("vite:preloadError", handleChunkError);
    window.addEventListener("error", handleChunkError, true);
    window.addEventListener("unhandledrejection", handleChunkError as EventListener);
    return () => {
      window.removeEventListener("vite:preloadError", handleChunkError);
      window.removeEventListener("error", handleChunkError, true);
      window.removeEventListener("unhandledrejection", handleChunkError as EventListener);
    };
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SplashScreen />
        <OfflineDetector />
        <Outlet />
        <Toaster richColors position="top-right" />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
