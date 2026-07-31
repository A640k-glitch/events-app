"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Calendar, ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useApp();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@fifthlab.io");
  const [password, setPassword] = useState("••••••••••••");

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(name || "Alex Rivera", email, "Email");
    router.push("/dashboard");
  };

  const handleSsoLogin = (provider: string, defaultName: string, defaultEmail: string) => {
    loginAs(defaultName, defaultEmail, provider);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[85vh] text-[#f5f5f7] flex flex-col justify-center items-center px-4 py-12 selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Auth Card Container */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 flex items-center justify-center shadow-xl">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 max-w-[240px] mx-auto text-xs font-semibold">
            <button
              onClick={() => setMode("signin")}
              className={cn(
                "flex-1 py-1.5 rounded-full transition-all cursor-pointer",
                mode === "signin" ? "bg-blue-600 text-white shadow-md" : "text-white/60 hover:text-white"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 py-1.5 rounded-full transition-all cursor-pointer",
                mode === "signup" ? "bg-blue-600 text-white shadow-md" : "text-white/60 hover:text-white"
              )}
            >
              Create Account
            </button>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white pt-1">
            {mode === "signin" ? "Sign In to FifthEvents" : "Create Enterprise Account"}
          </h1>
          <p className="text-xs text-white/60">
            {mode === "signin"
              ? "Access your event organizer console, ticket payouts & attendee lead data."
              : "Register your organization to publish events, capture leads, and sync team calendars."}
          </p>
        </div>

        {/* Enterprise SSO Buttons (Microsoft & Google / Gmail) */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleSsoLogin("Microsoft", "Alex Rivera (Microsoft)", "alex.rivera@microsoft.com")}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            <span>{mode === "signin" ? "Sign in with Microsoft 365" : "Sign up with Microsoft 365"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSsoLogin("Google", "Alex Rivera (Google)", "alex.rivera@gmail.com")}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{mode === "signin" ? "Sign in with Google / Gmail" : "Sign up with Google / Gmail"}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase font-mono">
          <div className="flex-1 h-px bg-white/10" />
          <span>or email authentication</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          
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
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-xs text-white pl-10 pr-3 py-2.5 rounded-xl outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white/70">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                required
                placeholder="alex.rivera@fifthlab.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-xs text-white pl-10 pr-3 py-2.5 rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-white/70">
                Password
              </label>
              {mode === "signin" && (
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-xs text-white pl-10 pr-3 py-2.5 rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{mode === "signin" ? "Sign In to Dashboard" : "Create & Enter Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-white/5">
          <p className="text-[11px] text-white/40 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secured with 256-bit SSL Enterprise Encryption
          </p>
        </div>

      </div>

    </div>
  );
}
