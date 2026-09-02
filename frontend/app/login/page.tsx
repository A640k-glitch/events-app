"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowRight, Mail, ShieldCheck, User, KeyRound, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { BrandButton } from "@/components/ui/BrandButtons";
import { cn } from "@/lib/utils";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function LoginPage() {
  const { requestOtp, verifyOtpAndLogin, loginAs } = useApp();

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
        setSuccessMessage(res.message || "OTP code delivered to corporate inbox.");
        setStep("OTP");
      } else {
        setErrorMessage("Failed to deliver OTP.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Authentication error");
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
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Verification error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick dev bypass
  const handleQuickBypass = async (role: "ADMIN" | "STAFF") => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const name = role === "ADMIN" ? "System Admin" : "Akinwole Abraham";
      const targetEmail = role === "ADMIN" ? "admin@thefifthlab.com" : "akinwole.a@thefifthlab.com";
      await loginAs(name, targetEmail, "credentials");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Dev bypass failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between font-sans text-left">
      
      {/* Top Bar */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 space-y-6 shadow-xs">
          
          {/* Logo & Heading */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <FifthEventsLogo variant="stacked" size={38} theme="light" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111827] tracking-tight">
                FifthLab Operations Portal
              </h1>
              <p className="text-xs text-[#6B7280] mt-1">
                Sign in with your corporate @thefifthlab.com credentials.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMessage}
            </div>
          )}

          {successMessage && step === "OTP" && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === "EMAIL" ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-gray-700">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@thefifthlab.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white"
                  />
                </div>
              </div>

              <BrandButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send One-Time Passcode
              </BrandButton>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-gray-700">6-Digit Verification Code</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-center text-sm font-mono tracking-widest text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white"
                  />
                </div>
              </div>

              <BrandButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
              >
                Verify & Enter Console
              </BrandButton>

              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-900 cursor-pointer pt-1"
              >
                Use different email address
              </button>
            </form>
          )}

          {/* Dev Bypass Section */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="text-[10px] font-mono font-semibold uppercase text-gray-400 block text-center">
              Quick Dev Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickBypass("ADMIN")}
                className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 transition-colors cursor-pointer text-center"
              >
                Admin Mode
              </button>
              <button
                type="button"
                onClick={() => handleQuickBypass("STAFF")}
                className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 transition-colors cursor-pointer text-center"
              >
                Staff Mode
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer info */}
      <div className="py-6 text-center text-[11px] text-gray-400 font-mono">
        The FifthLab Nigeria • Enterprise Operations Portal
      </div>

    </div>
  );
}
