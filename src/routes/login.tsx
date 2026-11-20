/**
 * Zero-Trust Employee ID + WhatsApp OTP Login Page
 * Route: /login
 *
 * Flow:
 *  Step 1 → Employee enters Employee ID (auto-uppercased, PG-XXXX format)
 *  Step 2 → Masked mobile shown, 6-digit OTP input with 30s resend timer
 *  On success → Role-based redirect (admin/hod/supervisor/employee)
 */

import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { sendEspOtp, verifyEspOtp } from "@/lib/esp-auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { loadSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Loader2,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";
import { BrandLogos } from "@/components/brand-logos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  ssr: false,
  beforeLoad: async () => {
    // If already signed in, redirect to appropriate dashboard
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    const s = await loadSession();
    if (!s) return;
    if (s.isAdmin) throw redirect({ to: "/admin" });
    throw redirect({ to: "/employee" });
  },
  head: () => ({
    meta: [
      { title: "Sign In — PG GROUP Employee Suggestion Portal" },
      {
        name: "description",
        content:
          "Secure Zero-Trust Employee ID + WhatsApp OTP sign-in for PG GROUP ESP.",
      },
    ],
  }),
  component: EspLoginPage,
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RESEND_SECONDS = 30;

// Employee ID formatter: uppercase, replace spaces with hyphen, limit chars
function formatEmpId(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9\-]/g, "")
    .slice(0, 12);
}

// ---------------------------------------------------------------------------
// Root Page Shell
// ---------------------------------------------------------------------------

function EspLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[color:oklch(0.18_0.05_260)] relative overflow-hidden">
      {/* Background decorative circles */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        {/* Top branded header bar */}
        <div className="bg-[color:oklch(0.18_0.05_260)] px-8 py-6 flex flex-col items-center gap-3">
          <BrandLogos className="justify-center" imgClassName="h-12 sm:h-14 brightness-0 invert" />
          <div className="text-center">
            <h1 className="text-white font-bold text-lg sm:text-xl tracking-tight">
              Employee Suggestion Portal
            </h1>
            <p className="text-white/60 text-xs sm:text-sm mt-0.5 font-medium">
              PG GROUP · Secure Sign In
            </p>
          </div>
        </div>

        {/* Form area */}
        <div className="px-8 py-8">
          <LoginFlow />
        </div>

        {/* Footer */}
        <div className="border-t border-border px-8 py-4 bg-muted/20 text-center">
          <p className="text-[11px] text-muted-foreground">
            Your login OTP is delivered via{" "}
            <span className="font-semibold text-[#25D366]">WhatsApp</span> from{" "}
            <span className="font-mono font-semibold">PG GROUP (+91 90969 87506)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Login Flow (manages step state)
// ---------------------------------------------------------------------------

function LoginFlow() {
  const [step, setStep] = useState<"id" | "otp">("id");
  const [employeeId, setEmployeeId] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const sendFn = useServerFn(sendEspOtp);
  const verifyFn = useServerFn(verifyEspOtp);
  const navigate = useNavigate();

  const lastVerifiedOtpRef = useRef("");

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && !loading && lastVerifiedOtpRef.current !== otp) {
      lastVerifiedOtpRef.current = otp;
      handleVerify();
    } else if (otp.length !== 6) {
      lastVerifiedOtpRef.current = "";
    }
  }, [otp, loading]);

  const doSendOtp = useCallback(
    async (empId: string) => {
      const res = await sendFn({ data: { employee_id: empId } });
      return res;
    },
    [sendFn],
  );

  async function handleSendOtp() {
    const id = employeeId.trim();
    if (!id) return;
    setLoading(true);
    setRetryAfter(null);
    try {
      const res = await doSendOtp(id);
      setMaskedMobile(res.masked_mobile);
      setEmployeeName(res.employee_name || "");
      toast.success(`OTP sent to ${res.masked_mobile} via WhatsApp`);
      setStep("otp");
    } catch (e: any) {
      const msg: string = e?.message ?? "Could not send OTP. Please try again.";
      if ((e as any)?.retry_after) {
        setRetryAfter((e as any).retry_after);
        toast.error(`⏳ ${msg}`);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    try {
      const res = await doSendOtp(employeeId.trim());
      setMaskedMobile(res.masked_mobile);
      toast.success(`OTP resent to ${res.masked_mobile}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not resend OTP.");
      throw e;
    }
  }

  async function handleVerify() {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const res = await verifyFn({
        data: { employee_id: employeeId.trim(), otp },
      });

      // Set Supabase session in browser
      const { error: sessionErr } = await supabase.auth.setSession({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      });
      if (sessionErr) throw sessionErr;

      toast.success(`Welcome, ${res.user.name}! Signing you in…`);

      // Role-based redirect
      navigate({ to: res.redirect_url as any });
    } catch (e: any) {
      toast.error(e?.message ?? "Invalid or expired OTP. Please try again.");
      setOtp("");
      lastVerifiedOtpRef.current = "";
    } finally {
      setLoading(false);
    }
  }

  if (step === "id") {
    return (
      <IdStep
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        onSend={handleSendOtp}
        loading={loading}
        retryAfter={retryAfter}
      />
    );
  }

  return (
    <OtpStep
      maskedMobile={maskedMobile}
      employeeName={employeeName}
      otp={otp}
      setOtp={setOtp}
      onVerify={handleVerify}
      onResend={handleResendOtp}
      onBack={() => {
        setStep("id");
        setOtp("");
        lastVerifiedOtpRef.current = "";
      }}
      loading={loading}
    />
  );
}

// ---------------------------------------------------------------------------
// Step 1: Employee ID Input
// ---------------------------------------------------------------------------

function IdStep({
  employeeId,
  setEmployeeId,
  onSend,
  loading,
  retryAfter,
}: {
  employeeId: string;
  setEmployeeId: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  retryAfter: number | null;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="space-y-6"
    >
      {/* Zero-Trust badge */}
      <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs font-medium text-primary">
          Zero-Trust Login · No password required · WhatsApp OTP only
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[color:oklch(0.18_0.05_260)]">
            Enter your Employee ID
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            We'll verify your identity and send a 6-digit OTP to your registered
            WhatsApp number.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Employee ID</label>
          <Input
            type="text"
            placeholder="e.g. PG-1042"
            value={employeeId}
            onChange={(e) => setEmployeeId(formatEmpId(e.target.value))}
            className={cn(
              "h-12 text-base font-mono bg-muted/40 tracking-wider uppercase",
              "focus-visible:ring-primary",
            )}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            maxLength={12}
          />
          <p className="text-[11px] text-muted-foreground">
            Format: <span className="font-mono font-semibold">PG-XXXX</span> ·
            Your ID is printed on your company ID card
          </p>
        </div>

        {retryAfter && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 font-medium">
            ⏳ Please wait {retryAfter}s before requesting a new OTP.
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 gap-2"
          disabled={loading || !employeeId.trim() || !!retryAfter}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending OTP…
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              Send WhatsApp OTP
            </>
          )}
        </Button>
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-border" />
        <span className="flex-shrink mx-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
          Also available
        </span>
        <div className="flex-grow border-t border-border" />
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Admin / Staff?{" "}
        <a
          href="/auth"
          className="font-semibold text-primary hover:underline"
        >
          Sign in here
        </a>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 2: OTP Input
// ---------------------------------------------------------------------------

function OtpStep({
  maskedMobile,
  employeeName,
  otp,
  setOtp,
  onVerify,
  onResend,
  onBack,
  loading,
}: {
  maskedMobile: string;
  employeeName: string;
  otp: string;
  setOtp: (v: string) => void;
  onVerify: () => void;
  onResend: () => Promise<void>;
  onBack: () => void;
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
    const t = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
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
    <div className="space-y-6">
      {/* WhatsApp delivery badge */}
      <div className="flex items-center gap-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-3">
        <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
        <p className="text-xs font-medium text-[#128C7E]">
          OTP delivered via WhatsApp from PG GROUP
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[color:oklch(0.18_0.05_260)]">
          Verify OTP
        </h2>
        {employeeName && (
          <p className="text-sm font-semibold text-primary mt-1">
            Welcome, {employeeName}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-foreground font-mono">
            {maskedMobile}
          </span>
        </p>
      </div>

      {/* OTP slots */}
      <div className="flex justify-center w-full overflow-x-auto py-1">
        <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
          <InputOTPGroup className="gap-1.5 sm:gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="w-10 h-12 sm:w-12 sm:h-13 text-lg sm:text-xl font-bold"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Resend timer */}
      <div className="text-center text-sm">
        {remaining > 0 ? (
          <span className="text-muted-foreground">
            Resend code in{" "}
            <span className="font-semibold text-foreground tabular-nums">
              {remaining}s
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline disabled:opacity-60"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", resending && "animate-spin")} />
            {resending ? "Resending…" : "Resend OTP"}
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="h-12 gap-1.5"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 gap-2"
          onClick={onVerify}
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              <BadgeCheck className="w-4 h-4" />
              Verify & Open Portal
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Didn't receive it? Check your WhatsApp or tap Resend after{" "}
        <span className="font-semibold">30s</span>.
      </p>
    </div>
  );
}
