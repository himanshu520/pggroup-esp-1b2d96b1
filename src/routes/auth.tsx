import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { linkAuthUserToEmployee, sendCustomOtp } from "@/lib/auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, KeyRound } from "lucide-react";
import { BrandLogos } from "@/components/brand-logos";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Employee Suggestion Portal — ESP" },
      { name: "description", content: "Secure OTP sign-in for the ESP administration dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[color:oklch(0.18_0.05_260)]">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-10">
        <BrandLogos className="justify-center mb-6" imgClassName="h-16" />

        <h1 className="text-3xl font-bold text-center text-[color:oklch(0.18_0.05_260)]">Employee Suggestion Portal</h1>
        <p className="text-center text-muted-foreground text-sm mt-1 mb-8">Dashboard</p>

        <AdminFlow />

      </div>
    </div>
  );
}

const RESEND_SECONDS = 30;



function AdminFlow() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"email"|"otp">("email");
  const [loading, setLoading] = useState(false);
  const link = useServerFn(linkAuthUserToEmployee);
  const send = useServerFn(sendCustomOtp);
  const navigate = useNavigate();

  const sendOtp = useCallback(async (targetEmail: string) => {
    await send({ data: { email: targetEmail } });
  }, [send]);

  async function requestOtp() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await sendOtp(email.trim());
      toast.success(`OTP sent to ${maskEmail(email)}`);
      setStage("otp");
    } catch (e: any) { toast.error(e.message ?? "Could not send OTP"); } finally { setLoading(false); }
  }
  async function resendOtp() {
    try {
      await sendOtp(email.trim());
      toast.success(`OTP resent to ${maskEmail(email)}`);
    } catch (e: any) {
      toast.error(e.message ?? "Could not resend OTP");
      throw e;
    }
  }
  async function verifyOtp() {
    if (otp.length !== 8) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
      if (error) throw error;
      await link({ data: undefined as never }).catch(() => {});
      toast.success("Signed in");
      navigate({ to: "/" });
    } catch (e: any) { toast.error(e.message ?? "Invalid or expired OTP"); } finally { setLoading(false); }
  }

  return stage === "email" ? (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[color:oklch(0.18_0.05_260)]">Enter your email</h2>
        <p className="text-sm text-muted-foreground mt-1">We'll verify your access and send a login OTP code.</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Admin Email Address</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input type="email" placeholder="admin@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-9 bg-muted/40" />
        </div>
      </div>
      <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90" onClick={requestOtp} disabled={loading || !email.trim()}>
        <KeyRound className="w-4 h-4" /> Send OTP
      </Button>
    </div>
  ) : (
    <OtpStage email={email} otp={otp} setOtp={setOtp} onBack={() => { setStage("email"); setOtp(""); }} onVerify={verifyOtp} onResend={resendOtp} loading={loading} />
  );
}

function OtpStage({ email, otp, setOtp, onBack, onVerify, onResend, loading }: { email: string; otp: string; setOtp: (v: string) => void; onBack: () => void; onVerify: () => void; onResend: () => Promise<void>; loading: boolean }) {
  const [remaining, setRemaining] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) { startedRef.current = true; setRemaining(RESEND_SECONDS); }
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
    } catch { /* toast handled upstream */ }
    finally { setResending(false); }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[color:oklch(0.18_0.05_260)]">Verify OTP</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter the 8-digit code sent to <span className="font-medium text-foreground">{maskEmail(email)}</span></p>
      </div>
      <div className="flex justify-center">
        <InputOTP maxLength={8} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            {[0,1,2,3,4,5,6,7].map((i) => <InputOTPSlot key={i} index={i} />)}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="text-center text-sm">
        {remaining > 0 ? (
          <span className="text-muted-foreground">Resend code in <span className="font-semibold text-foreground">{remaining}s</span></span>
        ) : (
          <button type="button" onClick={handleResend} disabled={resending} className="font-semibold text-primary hover:underline disabled:opacity-60">
            {resending ? "Resending…" : "Resend OTP"}
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="h-12" onClick={onBack}>Back</Button>
        <Button className="flex-1 h-12 text-base bg-primary hover:bg-primary/90" onClick={onVerify} disabled={loading || otp.length !== 8}>Verify &amp; sign in</Button>
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
