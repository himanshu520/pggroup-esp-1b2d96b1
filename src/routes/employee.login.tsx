import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { startEmployeeOtp, verifyEmployeeOtp, linkAuthUserToEmployee, anonymousTrackSuggestion } from "@/lib/auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { KeyRound, ArrowRight, Languages, Search, ArrowLeft, Globe, Loader2 } from "lucide-react";
import { BrandLogos } from "@/components/brand-logos";
import { useLang, useT } from "@/lib/i18n";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { STATUS_LABEL } from "@/lib/statuses";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/employee/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Employee Sign in — ESP" },
      { name: "description", content: "Sign in to submit and track your improvement suggestions." },
    ],
  }),
  component: EmployeeLogin,
});

type Lang = "en" | "hi";

const T = {
  en: {
    welcome: "Welcome",
    subtitle: "Employee Suggestion Portal",
    intro: "Share your ideas. Improve your workplace. Get recognised.",
    continueQ: "Do you want to continue?",
    yes: "Yes, continue",
    switch: "हिन्दी में देखें",
    enterId: "Enter your Employee ID",
    idHint: "We'll verify your access and send a login OTP code.",
    empId: "Employee ID",
    sendOtp: "Send OTP",
    verify: "Verify OTP",
    verifyHint: "Enter the 6-digit code sent to:",
    resendIn: "Resend code in",
    resend: "Resend OTP",
    resending: "Resending…",
    back: "Back",
    verifyBtn: "Verify & sign in",
    admin: "Admin?",
    signInHere: "Sign in here",
    sendWhatsapp: "Send OTP on WhatsApp",
    
    // Suggestion Tracking Translation keys
    trackBtn: "Track Suggestion (No Login)",
    trackTitle: "Track Suggestion",
    trackDesc: "Enter Suggestion ID to track progress without login.",
    trackPlaceholder: "E.g. SUG-P01-2026-000001",
    trackNow: "Track",
    backToLogin: "Back to Employee Login",
    searching: "Searching…",
    noSugFound: "No suggestion found with that ID.",
    metaEmp: "Submitted By",
    metaCategory: "Category",
    metaDept: "Department",
    metaPlant: "Plant",
    metaLoc: "Location",
    metaProblem: "Problem",
    metaSolution: "Suggested Solution",
    metaBenefits: "Expected Benefits",
    timeline: "Timeline",
    subDate: "Submitted on",
  },
  hi: {
    welcome: "स्वागत है",
    subtitle: "कर्मचारी सुझाव पोर्टल",
    intro: "अपने विचार साझा करें। अपने कार्यस्थल को बेहतर बनाएँ। सम्मान पाएँ।",
    continueQ: "क्या आप जारी रखना चाहते हैं?",
    yes: "हाँ, जारी रखें",
    switch: "View in English",
    enterId: "अपना कर्मचारी आईडी दर्ज करें",
    idHint: "हम आपकी पहचान सत्यापित करेंगे और लॉगिन ओटीपी भेजेंगे।",
    empId: "कर्मचारी आईडी",
    sendOtp: "ओटीपी भेजें",
    verify: "ओटीपी सत्यापित करें",
    verifyHint: "सत्यापन कोड दर्ज करें जो इस पर भेजा गया है:",
    resendIn: "पुनः भेजें",
    resend: "ओटीपी पुनः भेजें",
    resending: "भेज रहे हैं…",
    back: "वापस",
    verifyBtn: "सत्यापित करें और साइन इन करें",
    admin: "एडमिन?",
    signInHere: "यहाँ साइन इन करें",
    sendWhatsapp: "WhatsApp पर ओटीपी भेजें",

    // Suggestion Tracking Translation keys
    trackBtn: "सुझाव ट्रैक करें (बिना लॉगिन)",
    trackTitle: "सुझाव ट्रैक करें",
    trackDesc: "बिना लॉगिन किए प्रगति ट्रैक करने के लिए सुझाव आईडी दर्ज करें।",
    trackPlaceholder: "उदा. SUG-P01-2026-000001",
    trackNow: "ट्रैक करें",
    backToLogin: "कर्मचारी लॉगिन पर वापस जाएं",
    searching: "खोज रहे हैं…",
    noSugFound: "इस आईडी के साथ कोई सुझाव नहीं मिला।",
    metaEmp: "प्रस्तुतकर्ता",
    metaCategory: "श्रेणी",
    metaDept: "विभाग",
    metaPlant: "प्लांट",
    metaLoc: "स्थान",
    metaProblem: "समस्या",
    metaSolution: "सुझाया गया समाधान",
    metaBenefits: "अपेक्षित लाभ",
    timeline: "समयरेखा",
    subDate: "प्रस्तुत करने की तिथि",
  },
} as const;

function EmployeeLogin() {
  const { lang, setLang } = useLang();
  const [stage, setStage] = useState<"id" | "otp" | "track">("id");
  const t = T[lang];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[color:oklch(0.18_0.05_260)]">
      <div className={cn("w-full transition-all duration-300 rounded-2xl bg-white shadow-2xl p-6 sm:p-10", stage === "track" ? "max-w-4xl" : "max-w-md")}>
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <BrandLogos className="justify-start" imgClassName="h-10 sm:h-12" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="text-xs flex items-center gap-1.5 h-8 text-primary hover:text-primary-hover hover:bg-primary/5 rounded-full"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "en" ? "हिन्दी" : "English"}
          </Button>
        </div>

        {stage !== "track" && (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-[color:oklch(0.18_0.05_260)]">
              Employee Suggestion Portal
            </h1>
            <p className="text-center text-muted-foreground text-sm mt-1 mb-8">
              Share your ideas. Improve your workplace.
            </p>
          </>
        )}

        {stage === "track" ? (
          <AnonymousTracker t={t} onBack={() => setStage("id")} />
        ) : (
          <EmployeeFlow t={t} stage={stage as any} setStage={setStage as any} lang={lang} />
        )}

      </div>
    </div>
  );
}


function WelcomeScreen({ t, onContinue }: { t: (typeof T)[Lang]; onContinue: () => void }) {
  return (
    <div className="text-center space-y-6 py-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:oklch(0.18_0.05_260)]">
          {t.welcome}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <p className="text-base text-foreground/80 leading-relaxed px-2">{t.intro}</p>

      <div className="pt-2">
        <p className="text-lg font-semibold text-foreground mb-4">{t.continueQ}</p>
        <Button
          onClick={onContinue}
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
        >
          {t.yes} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

const RESEND_SECONDS = 30;

function EmployeeFlow({
  t,
  stage,
  setStage,
  lang,
}: {
  t: (typeof T)[Lang];
  stage: "id" | "otp" | "track";
  setStage: (s: "id" | "otp" | "track") => void;
  lang: Lang;
}) {
  const [empCode, setEmpCode] = useState("");
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const start = useServerFn(startEmployeeOtp);
  const verify = useServerFn(verifyEmployeeOtp);
  const link = useServerFn(linkAuthUserToEmployee);
  const navigate = useNavigate();

  const lastVerifiedOtpRef = useRef("");

  useEffect(() => {
    if (otp.length === 6 && !loading && lastVerifiedOtpRef.current !== otp) {
      lastVerifiedOtpRef.current = otp;
      verifyOtp();
    } else if (otp.length !== 6) {
      lastVerifiedOtpRef.current = "";
    }
  }, [otp, loading]);

  const sendOtp = useCallback(
    async (code: string) => {
      const res = await start({
        data: {
          employee_code: code,
          send_via: sendViaWhatsApp ? "whatsapp" : "email",
        },
      });
      setMaskedPhone(res.maskedContact);
      return res.maskedContact;
    },
    [start, sendViaWhatsApp],
  );

  async function requestOtp() {
    const code = empCode.trim();
    if (!code) return;
    setLoading(true);
    try {
      const masked = await sendOtp(code);
      toast.success(`OTP sent to ${masked}`);
      setStage("otp");
    } catch (e: any) {
      toast.error(e.message ?? "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    try {
      const masked = await sendOtp(empCode.trim());
      toast.success(`OTP resent to ${masked}`);
    } catch (e: any) {
      toast.error(e.message ?? "Could not resend OTP");
      throw e;
    }
  }

  async function verifyOtp() {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const { access_token, refresh_token } = await verify({
        data: { employee_code: empCode.trim(), token: otp },
      });
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) throw error;
      await link({ data: undefined as never }).catch(() => {});
      toast.success("Signed in");
      navigate({ to: "/employee" });
    } catch (e: any) {
      toast.error(e.message ?? "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }


  return stage === "id" ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        requestOtp();
      }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-[color:oklch(0.18_0.05_260)]">{t.enterId}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t.idHint}</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">{t.empId}</label>
        <Input
          placeholder="e.g. EMP00123"
          value={empCode}
          onChange={(e) => setEmpCode(e.target.value)}
          className="h-12 bg-muted/40"
          autoFocus
        />
      </div>

      <div className="flex items-center space-x-2 py-1">
        <input
          type="checkbox"
          id="sendWhatsapp"
          checked={sendViaWhatsApp}
          onChange={(e) => setSendViaWhatsApp(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
        />
        <label htmlFor="sendWhatsapp" className="text-xs sm:text-sm text-foreground/80 font-medium cursor-pointer select-none">
          {t.sendWhatsapp}
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base bg-primary hover:bg-primary/90"
        disabled={loading || !empCode.trim()}
      >
        <KeyRound className="w-4 h-4" /> {t.sendOtp}
      </Button>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink mx-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Or</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => setStage("track")}
        className="w-full h-12 text-base border-primary text-primary hover:bg-primary/5 hover:text-primary-hover flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" /> {t.trackBtn}
      </Button>
    </form>
  ) : (
    <OtpStage
      t={t}
      phone={maskedPhone}
      otp={otp}
      setOtp={setOtp}
      onBack={() => {
        setStage("id");
        setOtp("");
      }}
      onVerify={verifyOtp}
      onResend={resendOtp}
      loading={loading}
    />
  );
}

function OtpStage({
  t,
  phone,
  otp,
  setOtp,
  onBack,
  onVerify,
  onResend,
  loading,
}: {
  t: (typeof T)[Lang];
  phone: string;
  otp: string;
  setOtp: (v: string) => void;
  onBack: () => void;
  onVerify: () => void;
  onResend: () => Promise<void>;
  loading: boolean;
}) {
  const [remaining, setRemaining] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      setRemaining(RESEND_SECONDS);
    }
    if (remaining <= 0) return;
    const int = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(int);
  }, [remaining]);

  async function handleResend() {
    if (remaining > 0 || resending) return;
    setResending(true);
    try {
      await onResend();
      setRemaining(RESEND_SECONDS);
    } catch {
      /* toast handled upstream */
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[color:oklch(0.18_0.05_260)]">{t.verify}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.verifyHint}{" "}
          <span className="font-medium text-foreground">{phone}</span>
        </p>
      </div>
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="text-center text-sm">
        {remaining > 0 ? (
          <span className="text-muted-foreground">
            {t.resendIn}{" "}
            <span className="font-semibold text-foreground">{remaining}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {resending ? t.resending : t.resend}
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="h-12" onClick={onBack}>
          {t.back}
        </Button>
        <Button
          className="flex-1 h-12 text-base bg-primary hover:bg-primary/90"
          onClick={onVerify}
          disabled={loading || otp.length !== 6}
        >
          {t.verifyBtn}
        </Button>
      </div>
    </div>
  );
}

function maskEmail(e: string) {
  const [local, domain] = e.split("@");
  if (!domain) return e;
  const shown = local.slice(0, 2);
  return `${shown}${"•".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

function AnonymousTracker({ t, onBack }: { t: (typeof T)[Lang]; onBack: () => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const track = useServerFn(anonymousTrackSuggestion);
  const globalT = useT();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    setHistory([]);
    try {
      const data = await track({ data: code.trim() });
      if (data) {
        setResult(data.result);
        setHistory(data.history);
      } else {
        toast.error(t.noSugFound);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 rounded-full shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-[color:oklch(0.18_0.05_260)]">{t.trackTitle}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.trackDesc}</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
          <Input
            placeholder={t.trackPlaceholder}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="pl-9 h-11 font-mono uppercase"
          />
        </div>
        <Button type="submit" className="h-11 px-5" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
          {t.trackNow}
        </Button>
      </form>

      {result ? (
        <div className="grid md:grid-cols-3 gap-4 border-t border-border pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="text-xs font-mono text-muted-foreground">{result.code}</div>
              <h3 className="text-lg font-bold mt-1 text-foreground">{result.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <StatusBadge status={result.status} />
                <PriorityBadge priority={result.priority} />
                <span className="text-xs text-muted-foreground">
                  {t.subDate}: {new Date(result.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm border-t border-border pt-4">
              <MetaItem label={t.metaEmp} value={`${result.employees?.name} (${result.employees?.employee_code})`} />
              <MetaItem label={t.metaCategory} value={result.categories?.name ? globalT(result.categories.name) : "—"} />
              <MetaItem label={t.metaDept} value={result.departments?.name ?? "—"} />
              <MetaItem label={t.metaPlant} value={result.plants?.name ?? "—"} />
              <div className="col-span-2">
                <MetaItem label={t.metaLoc} value={result.locations?.location ?? "—"} />
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <SectionItem label={t.metaProblem} content={result.problem} />
              <SectionItem label={t.metaSolution} content={result.suggested_method} />
              <SectionItem label={t.metaBenefits} content={result.expected_benefits} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h4 className="text-sm font-bold mb-4 text-foreground">{t.timeline}</h4>
            <ol className="space-y-4 relative">
              {history.map((h, i) => (
                <li key={h.id} className="relative pl-6">
                  <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-primary" />
                  {i < history.length - 1 && <div className="absolute left-2.5 top-3.5 bottom-[-1.25rem] w-px bg-border" />}
                  <div className="text-[10px] text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                  <div className="text-xs font-semibold mt-0.5 text-foreground">
                    {globalT(`status_${h.to_status}`) || STATUS_LABEL[h.to_status as keyof typeof STATUS_LABEL]}
                  </div>
                  {h.remarks && <div className="text-[11px] text-muted-foreground mt-0.5 italic">"{h.remarks}"</div>}
                </li>
              ))}
              {history.length === 0 && <li className="text-xs text-muted-foreground">No activity yet.</li>}
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold text-foreground text-xs sm:text-sm break-all">{value}</div>
    </div>
  );
}

function SectionItem({ label, content }: { label: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="bg-muted/20 border border-border/60 rounded-lg p-3">
      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">{content}</div>
    </div>
  );
}
