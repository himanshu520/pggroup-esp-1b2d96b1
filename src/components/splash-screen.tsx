import { useEffect, useState } from "react";
import espLogo from "@/assets/esp-logo.png.asset.json";

const SESSION_KEY = "esp-splash-shown";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(true);
    const t1 = setTimeout(() => setLeaving(true), 3200);
    const t2 = setTimeout(() => setVisible(false), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-all duration-500 ${
        leaving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center">
        {/* Soft glowing ambient light behind logo */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-orange-400/25 via-blue-500/25 to-orange-400/25 blur-2xl animate-pulse" />
        <img
          src={espLogo.url}
          alt="Employee Suggestion Portal Logo"
          className="relative w-72 h-auto max-w-[85vw] object-contain esp-splash-logo p-3 rounded-2xl bg-white shadow-xl border border-slate-200/80"
        />
      </div>
      <div className="mt-6 text-xl font-extrabold tracking-widest text-slate-900 dark:text-slate-100 esp-splash-text">
        EMPLOYEE SUGGESTION PORTAL
      </div>
      <div className="mt-1.5 text-xs font-bold tracking-widest text-orange-500 uppercase esp-splash-text-2 flex items-center gap-2">
        <span className="w-6 h-[2px] bg-orange-400 inline-block" />
        PG GROUP — ESP
        <span className="w-6 h-[2px] bg-orange-400 inline-block" />
      </div>
    </div>
  );
}
