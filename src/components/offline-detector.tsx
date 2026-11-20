import { useState, useEffect } from "react";
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2, Radio, Globe, ShieldAlert, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DinoGame } from "@/components/dino-game";

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"status" | "game">("status");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      {/* Background Animated Radar Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-xl w-full bg-card border border-border/80 shadow-2xl rounded-2xl p-5 sm:p-6 text-center space-y-5 overflow-hidden my-auto">
        {/* Top Decorative Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse" />

        {/* Top Header Mode Toggle */}
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            <Radio className="w-3.5 h-3.5 animate-spin" /> No Internet Connection
          </div>

          <div className="flex bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab("status")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === "status"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Status Info
            </button>
            <button
              onClick={() => setActiveTab("game")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                activeTab === "game"
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> Play Dino Game 🦖
            </button>
          </div>
        </div>

        {activeTab === "status" ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Animated Wi-Fi Disconnected Hero Icon */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-32 h-32 rounded-full bg-red-500/10 animate-ping opacity-75" />
              <div className="absolute w-24 h-24 rounded-full bg-red-500/15 animate-pulse" />

              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 text-white transform transition-transform hover:scale-105">
                <WifiOff className="w-8 h-8 animate-pulse" />
              </div>

              <div className="absolute top-1 right-[35%] bg-amber-500 text-slate-950 p-1 rounded-full shadow-md animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5 font-bold" />
              </div>
            </div>

            {/* Text Details */}
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-foreground">You are offline</h2>
              <p className="text-xs text-muted-foreground leading-relaxed px-2">
                We can't connect to the server right now. Please check your network cables, modem, Wi-Fi router, or mobile data.
              </p>
            </div>

            {/* Live Auto-Checking Indicator Card */}
            <div className="bg-muted/50 rounded-xl p-3 border border-border text-xs flex items-center justify-between gap-3 text-left">
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
                <li>Check network cables, modem, and Wi-Fi connection</li>
                <li>Toggle Airplane mode or reconnect Wi-Fi</li>
                <li>Play the <strong>Dino Runner Game</strong> below while you wait!</li>
              </ul>
            </div>

            {/* Switch to Game Promotion Banner */}
            <div 
              onClick={() => setActiveTab("game")}
              className="bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-primary/20 rounded-xl p-3 text-left cursor-pointer hover:border-primary/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground font-bold shadow-xs group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">Bored waiting for Internet?</div>
                  <div className="text-[11px] text-muted-foreground">Click here to play the offline ESP Dino Runner Game 🦖</div>
                </div>
              </div>
              <div className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                Play Now →
              </div>
            </div>

            {/* Interactive Buttons */}
            <div className="flex pt-1">
              <Button
                variant="default"
                size="sm"
                onClick={handleManualCheck}
                disabled={isChecking}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md font-semibold h-10 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isChecking ? "animate-spin" : ""}`} />
                {isChecking ? "Checking Connection..." : "Try Reconnecting"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <DinoGame />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("status")}
                className="w-full text-xs font-semibold h-9"
              >
                ← Back to Connection Status
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleManualCheck}
                disabled={isChecking}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isChecking ? "animate-spin" : ""}`} />
                {isChecking ? "Checking..." : "Check Connection"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
