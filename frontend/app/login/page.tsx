"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  ArrowRight, 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Building2,
  Sparkles
} from "lucide-react";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";
import ScrollLogoBackground from "@/components/home/ScrollLogoBackground";

export default function LoginPage() {
  const router = useRouter();
  const { requestOtp, verifyOtpAndLogin } = useApp();

  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await requestOtp(email.trim().toLowerCase());
      if (res.success) {
        setSuccessMessage(res.message || "A secure single-use passcode was dispatched to your inbox.");
        setStep("OTP");
      } else {
        setErrorMessage("Unable to deliver verification passcode. Please verify your address.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Authentication error encountered");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await verifyOtpAndLogin(email.trim().toLowerCase(), otpCode.trim());
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid or expired passcode");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-between font-sans relative overflow-hidden selection:bg-[#00B4D8] selection:text-white">
      {/* Background Ambience & Logo Watermark */}
      <ScrollLogoBackground />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10 pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white/90 backdrop-blur-xs text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#0090AD]" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>WAT Operations Sync</span>
        </div>
      </header>

      {/* Main Corporate Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-8 sm:p-10 space-y-7 shadow-xl">
          
          {/* Logo & Platform Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center pb-1">
              <FifthEventsLogo variant="stacked" size={42} theme="light" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8FA] border border-[#20B2AA]/30 text-[#00829B] text-[10px] font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[#0090AD]" />
                <span>Enterprise Staff SSO</span>
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Operations Console
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Access attendee rosters, keynote management, and real-time door scanners.
              </p>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <span className="font-bold">Error:</span>
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {successMessage && step === "OTP" && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="leading-snug">{successMessage}</span>
            </div>
          )}

          {/* Form: Step 1 Email Request */}
          {step === "EMAIL" ? (
            <form onSubmit={handleSendOtp} className="space-y-5 text-xs text-left">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 text-[11px] uppercase tracking-wider font-mono">
                  Corporate Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@thefifthlab.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0090AD] hover:bg-[#007A94] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{isSubmitting ? "Dispatching Security Code..." : "Send Verification Passcode"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Protected by FifthLab Enterprise Security</span>
              </div>
            </form>
          ) : (
            /* Form: Step 2 OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs text-left">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 text-[11px] uppercase tracking-wider font-mono">
                    6-Digit Security Code
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Valid for 10 min</span>
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-center text-base font-mono tracking-widest text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0090AD] hover:bg-[#007A94] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{isSubmitting ? "Verifying Credentials..." : "Authenticate & Enter Console"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("EMAIL");
                    setOtpCode("");
                    setErrorMessage("");
                  }}
                  className="text-xs font-semibold text-[#0090AD] hover:underline cursor-pointer"
                >
                  Use a different email address
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-6 px-4 text-center space-y-1">
        <p className="text-[11px] text-slate-400 font-mono">
          The FifthLab Nigeria & CWG PLC • Encrypted NDPR Compliant Portal
        </p>
      </footer>
    </div>
  );
}
