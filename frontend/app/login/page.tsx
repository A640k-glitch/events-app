"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  ArrowRight, 
  Mail, 
  X, 
  CheckCircle2, 
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import FifthEventsLogo, { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";
import AuthVisualShowcase from "@/components/auth/AuthVisualShowcase";

export default function LoginPage() {
  const router = useRouter();
  const { requestOtp, verifyOtpAndLogin } = useApp();

  // Auth Flow: Step 1 = Enter Email -> Step 2 = Enter 6-digit OTP
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  
  // Inputs
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Status & Timing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for code resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Request OTP passcode via corporate email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your corporate email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await requestOtp(email.trim().toLowerCase());
      
      if (res.success) {
        setSuccessMessage(res.message || `Security passcode dispatched to ${email}`);
        setStep("OTP");
        setResendCooldown(60);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setErrorMessage("Unable to dispatch security passcode. Please check your email address.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Authentication error encountered");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Handle individual digit input & auto-advance
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otpDigits];
      cleanDigits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(cleanDigits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.slice(-1).replace(/\D/g, "");
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP and navigate based on user status
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const result = await verifyOtpAndLogin(email.trim().toLowerCase(), fullOtp);
      
      if (result?.isFirstTime) {
        router.push("/dashboard/settings?newUser=true");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid or expired passcode. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (step === "OTP" && otpDigits.every((d) => d !== "")) {
      handleVerifyOtp();
    }
  }, [otpDigits, step]);

  // Resend code handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await requestOtp(email.trim().toLowerCase());
      if (res.success) {
        setSuccessMessage("A fresh verification passcode was sent to your email.");
        setResendCooldown(60);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-white flex flex-col lg:flex-row font-sans selection:bg-[#0090AD] selection:text-white overflow-hidden">
      
      {/* ========================================================= */}
      {/* LEFT COLUMN: EMAIL / OTP AUTH FLOW (Light / Single Screen) */}
      {/* ========================================================= */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative bg-white overflow-hidden">
        
        {/* Slanted Full-Colour Emblem by the Right Edge Corner (No text) */}
        <div className="absolute -right-24 bottom-4 sm:-right-28 sm:bottom-8 pointer-events-none select-none z-0 opacity-20 -rotate-12">
          <FifthEventsEmblem size={380} monochrome={false} />
        </div>

        {/* Top Header: Complete Full Logo in Colour + Close Button */}
        <div className="flex items-center justify-between w-full relative z-10">
          <FifthEventsLogo variant="full" size={30} theme="light" showSubtitle />

          <Link
            href="/"
            title="Return to Home"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Center Form Container (No scroll needed) */}
        <div className="w-full max-w-md mx-auto my-auto relative z-10 text-left">
          
          {/* ---------------- STEP 1: EMAIL SIGN IN (NO PASSWORD) ---------------- */}
          {step === "EMAIL" ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header Titles */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter your corporate email to access the dashboard. First-time users are automatically provisioned.
                </p>
              </div>

              {/* Error Alerts */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <span className="font-bold">Error:</span>
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Form: Email only */}
              <form onSubmit={handleRequestOtp} className="space-y-5 text-left">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0090AD] focus:ring-2 focus:ring-[#0090AD]/15 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Dark Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0D1522] hover:bg-[#162235] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                >
                  <span>{isSubmitting ? "Dispatching Passcode..." : "Continue with Email"}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </button>

                <p className="text-xs text-slate-400 text-center pt-1">
                  A single-use 6-digit access code will be sent to your email.
                </p>
              </form>

            </div>
          ) : (
            /* ---------------- STEP 2: 6-DIGIT OTP PASSCODE VIEW ---------------- */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* OTP Header */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                  Verify your email
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter the 6-digit access passcode sent to{" "}
                  <span className="font-semibold text-slate-900">{email}</span>
                </p>
              </div>

              {/* Feedback Alerts */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <span className="font-bold">Error:</span>
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="leading-snug">{successMessage}</span>
                </div>
              )}

              {/* 6 Individual Digit Inputs */}
              <form onSubmit={handleVerifyOtp} className="space-y-6 text-left">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Enter 6-Digit Passcode
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      Valid for 10 minutes
                    </span>
                  </div>
                  
                  {/* Digits Grid */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpInputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-mono font-bold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-[#0090AD] focus:bg-white focus:ring-2 focus:ring-[#0090AD]/20 transition-all shadow-2xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Dark Verification Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || otpDigits.some((d) => !d)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0D1522] hover:bg-[#162235] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  <span>{isSubmitting ? "Authenticating..." : "Verify & Enter Dashboard"}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </button>

                {/* Resend Passcode and Change Email Controls */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isSubmitting}
                    className="inline-flex items-center gap-1.5 font-medium text-[#0090AD] hover:underline disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>
                      {resendCooldown > 0
                        ? `Resend code in ${resendCooldown}s`
                        : "Resend security code"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("EMAIL");
                      setOtpDigits(["", "", "", "", "", ""]);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change email address</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

        {/* Empty bottom spacer to maintain vertical centering without scrolling */}
        <div className="h-4 pointer-events-none" />

      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: FULL-HEIGHT PHOTOGRAPHY (No Overlays/Pills)  */}
      {/* ========================================================= */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <AuthVisualShowcase />
      </div>

    </div>
  );
}
