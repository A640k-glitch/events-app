"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Calendar, ArrowRight, Mail, ShieldCheck, User, KeyRound, RefreshCw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { requestOtp, verifyOtpAndLogin } = useApp();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Resend cooldown timer (30s)
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Please enter your corporate email address.");
      return;
    }

    if (!cleanEmail.endsWith("@thefifthlab.com")) {
      setErrorMessage("Access restricted. Authorized organization accounts only.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await requestOtp(cleanEmail, name.trim());
      setSuccessMessage(res.message);
      setStep("otp");
      setResendCooldown(30);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch access code";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim().replace(/\s+/g, "");

    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit access code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await verifyOtpAndLogin(email.trim().toLowerCase(), cleanOtp);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await requestOtp(email.trim().toLowerCase(), name.trim());
      setSuccessMessage(res.message);
      setResendCooldown(30);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not resend code";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] text-[#f5f5f7] flex flex-col justify-center items-center px-4 py-12 selection:bg-cyan-500 selection:text-black font-sans">
      
      {/* Auth Card Container */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-8 space-y-6 shadow-2xl relative overflow-hidden text-left">
        
        {/* Card Header */}
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 border border-cyan-500/40 p-0.5 flex items-center justify-center shadow-xl">
            {step === "otp" ? (
              <KeyRound className="w-6 h-6 text-cyan-400" />
            ) : (
              <Calendar className="w-6 h-6 text-cyan-400" />
            )}
          </div>

          {step === "credentials" ? (
            <>
              {/* Mode Switcher */}
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10 max-w-[240px] mx-auto text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setErrorMessage(null); }}
                  className={cn(
                    "flex-1 py-1.5 rounded-full transition-all cursor-pointer",
                    mode === "signin" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-white/60 hover:text-white"
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setErrorMessage(null); }}
                  className={cn(
                    "flex-1 py-1.5 rounded-full transition-all cursor-pointer",
                    mode === "signup" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-white/60 hover:text-white"
                  )}
                >
                  Register
                </button>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-white pt-1">
                {mode === "signin" ? "FifthLab Events Portal" : "Register Corporate Account"}
              </h1>
              <p className="text-xs text-white/60 font-light">
                Internal event management, lead tracking & attendance manifest.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold tracking-tight text-white pt-1">
                Verify Corporate Access
              </h1>
              <p className="text-xs text-white/60 font-light">
                Enter the single-use 6-digit access code delivered to <br />
                <strong className="text-cyan-400">{email}</strong>
              </p>
            </>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl font-light">
            {errorMessage}
          </div>
        )}

        {successMessage && step === "otp" && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs rounded-xl font-light">
            {successMessage}
          </div>
        )}

        {/* STEP 1: Enter Corporate Email */}
        {step === "credentials" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white/70">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-xs text-white pl-10 pr-3 py-2.5 rounded-xl outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/70">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-xs text-white pl-10 pr-3 py-2.5 rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white rounded-full transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:shadow-cyan-500/10 mt-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>
                {isSubmitting
                  ? "Dispatching Verification Code..."
                  : mode === "signin"
                  ? "Sign In with Work Email"
                  : "Register with Work Email"}
              </span>
            </button>
          </form>
        )}

        {/* STEP 2: Enter 6-Digit OTP Code */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2 text-center">
              <label className="block text-xs font-semibold text-white/70 text-left">
                6-Digit Access Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white/5 border-2 border-cyan-500/40 focus:border-cyan-400 text-xl font-mono text-center tracking-[10px] text-white py-3 rounded-xl outline-none transition-all"
              />
              <p className="text-[11px] text-white/40 text-left font-light">
                Code expires in 10 minutes. Check spam folder if not received.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-full transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Validating Session..." : "Verify Code & Enter Command Hub"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2 text-xs font-light">
              <button
                type="button"
                onClick={() => { setStep("credentials"); setErrorMessage(null); }}
                className="text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Use different email
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isSubmitting}
                onClick={handleResendOtp}
                className={cn(
                  "flex items-center gap-1 cursor-pointer transition-colors",
                  resendCooldown > 0 ? "text-white/40 cursor-not-allowed" : "text-cyan-400 hover:text-cyan-300"
                )}
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isSubmitting && "animate-spin")} />
                <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend code"}</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 text-center border-t border-white/5">
          <p className="text-[11px] text-white/40 flex items-center justify-center gap-1 font-light">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Restrictive Corporate Access • The FifthLab Nigeria
          </p>
        </div>

      </div>

    </div>
  );
}
