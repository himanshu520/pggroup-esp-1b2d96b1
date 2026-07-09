import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { startEmployeeOtp, verifyEmployeeOtp, linkAuthUserToEmployee } from "@/lib/auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { KeyRound, ArrowRight, Languages } from "lucide-react";
import { BrandLogos } from "@/components/brand-logos";

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
  },
} as const;

function EmployeeLogin() {
  const [lang] = useState<Lang>("en");
  const [stage, setStage] = useState<"id" | "otp">("id");
  const t = T[lang];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[color:oklch(0.18_0.05_260)]">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 sm:p-10">
        <BrandLogos className="justify-center mb-4" imgClassName="h-14 sm:h-16" />

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[color:oklch(0.18_0.05_260)]">
          Employee Suggestion Portal
        </h1>
        <p className="text-center text-muted-foreground text-sm mt-1 mb-8">
          Share your ideas. Improve your workplace.
        </p>

        <EmployeeFlow t={t} stage={stage} setStage={setStage} lang={lang} />

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
  stage: "id" | "otp";
  setStage: (s: "id" | "otp") => void;
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
    <div className="space-y-5">
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
        className="w-full h-12 text-base bg-primary hover:bg-primary/90"
        disabled={loading || !empCode.trim()}
        onClick={requestOtp}
      >
        <KeyRound className="w-4 h-4" /> {t.sendOtp}
      </Button>
    </div>
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
