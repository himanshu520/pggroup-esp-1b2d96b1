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
    } catch { /* ignore */ }
    setVisible(true);
    const t1 = setTimeout(() => setLeaving(true), 1600);
    const t2 = setTimeout(() => setVisible(false), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}
      aria-hidden="true"
    >
      <img
        src={espLogo.url}
        alt="ESP"
        className="w-40 h-40 object-contain esp-splash-logo"
      />
      <div className="mt-6 text-lg font-bold tracking-wide esp-splash-text" style={{ color: "#0f1b3d" }}>
        EMPLOYEE SUGGESTION PORTAL
      </div>
      <div className="mt-1 text-sm font-semibold esp-splash-text-2" style={{ color: "#f97316" }}>
        — ESP —
      </div>
    </div>
  );
}
