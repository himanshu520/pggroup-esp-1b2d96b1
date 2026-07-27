import { useState, useEffect } from "react";
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2, Radio, Globe, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    // Sync initial state
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleManualCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOffline(false);
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 4000);
      }
      setIsChecking(false);
    }, 1200);
  };

  // 1. Toast Notification when connection is restored
  if (justReconnected && !isOffline) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400/30 backdrop-blur-md">
          <div className="p-1.5 bg-white/20 rounded-full animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Internet Restored!</div>
            <div className="text-xs text-emerald-100">You are back online. All data is syncing...</div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Screen Animated No Internet Overlay
  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Background Animated Radar Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-md w-full bg-card border border-border/80 shadow-2xl rounded-2xl p-6 text-center space-y-6 overflow-hidden">
        {/* Top Decorative Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse" />

        {/* Animated Wi-Fi Disconnected Hero Icon */}
        <div className="relative flex items-center justify-center py-4">
          {/* Concentric Pulse Circles */}
          <div className="absolute w-36 h-36 rounded-full bg-red-500/10 animate-ping opacity-75" />
          <div className="absolute w-28 h-28 rounded-full bg-red-500/15 animate-pulse" />

          {/* Main Glowing Badge */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 text-white transform transition-transform hover:scale-105">
            <WifiOff className="w-10 h-10 animate-pulse" />
          </div>

          {/* Floating Warning Badge */}
          <div className="absolute top-2 right-[32%] bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-md animate-bounce">
            <AlertTriangle className="w-4 h-4 font-bold" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <Radio className="w-3.5 h-3.5 animate-spin" /> No Internet Connection
          </div>
          <h2 className="text-xl font-bold text-foreground">You are offline</h2>
          <p className="text-xs text-muted-foreground leading-relaxed px-2">
            We can't connect to the server right now. Please check your network cables, Wi-Fi router, or mobile data connection.
          </p>
        </div>

        {/* Live Auto-Checking Indicator Card */}
        <div className="bg-muted/50 rounded-xl p-3.5 border border-border text-xs flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Monitoring Connection</div>
              <div className="text-[11px] text-muted-foreground">Will auto-resume when online</div>
            </div>
          </div>
          <Globe className="w-4 h-4 text-muted-foreground animate-pulse" />
        </div>

        {/* Quick Tips */}
        <div className="text-left bg-muted/20 p-3 rounded-xl border border-border/50 text-[11px] space-y-1.5 text-muted-foreground">
          <div className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Quick Troubleshooting:
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Verify Wi-Fi network or Ethernet cable is plugged in</li>
            <li>Toggle Airplane mode on and off</li>
            <li>Refresh page once connection is back</li>
          </ul>
        </div>

        {/* Interactive Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleManualCheck}
            disabled={isChecking}
            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md font-semibold h-10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Try Reconnecting"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="h-10 text-xs font-semibold px-4"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}
