"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Save, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

const AVAILABLE_ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "PRODUCT_OWNER", label: "Product Owner" },
  { value: "STAFF", label: "Staff" },
  { value: "SALES", label: "Sales" },
  { value: "OPS", label: "Operations" },
];

export default function SettingsPage() {
  const { user, updateUserProfile } = useApp();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || "STAFF");
  const [timezone, setTimezone] = useState(user?.timezone || "WAT");
  const [workingHours, setWorkingHours] = useState(user?.workingHours || "9:00 AM - 5:00 PM");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "");
      setRole(user.role || "STAFF");
      if (user.timezone) setTimezone(user.timezone);
      if (user.workingHours) setWorkingHours(user.workingHours);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      setIsSaving(true);
      await updateUserProfile({
        name: displayName.trim(),
        role,
        timezone,
        workingHours,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setErrorMessage(err.message || "Failed to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-3.5 max-w-3xl font-sans text-left text-slate-900 pb-8">
        
        {/* Header Bar Card */}
        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-slate-950">
            Account Preferences
          </h1>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-[#005B6E]" />
            <span>Role: <strong className="text-slate-900 font-mono">{user?.role || "STAFF"}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          
          {/* Section 1: User Profile Details */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 space-y-3.5 shadow-2xs">
            <h2 className="text-xs font-bold text-slate-900 tracking-wide uppercase border-b border-slate-100 pb-2.5">
              Profile Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-700 font-semibold block">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Corporate Name"
                  className="w-full h-8 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#005B6E] focus:ring-1 focus:ring-[#005B6E]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-700 font-semibold block">Corporate Email</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="w-full h-8 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-500 cursor-not-allowed font-mono"
                />
              </div>

              {/* Dynamic System Role Selector */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-slate-700 font-semibold block">
                  System Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-8 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#005B6E] focus:ring-1 focus:ring-[#005B6E]/20 cursor-pointer"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-700 font-semibold block">Timezone Normalization</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-8 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#005B6E] focus:ring-1 focus:ring-[#005B6E]/20 cursor-pointer"
                >
                  <option value="WAT">West Africa Time (WAT) (Lagos / Abuja, UTC+1)</option>
                  <option value="GMT">Greenwich Mean Time (GMT) (Accra, UTC+0)</option>
                  <option value="EAT">East Africa Time (EAT) (Nairobi / Kigali, UTC+3)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-700 font-semibold block">Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="9:00 AM - 5:00 PM"
                  className="w-full h-8 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#005B6E] focus:ring-1 focus:ring-[#005B6E]/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Security & Authentication */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs">
            <h2 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              Security &amp; Login
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs bg-slate-50 p-3 rounded-md border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-xs">Two-Factor OTP Corporate Authentication</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Single-use passcodes delivered to verified corporate inboxes.</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10.5px] self-start sm:self-auto shrink-0">
                Enforced &amp; Active
              </span>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit / Action Bar */}
          <div className="flex items-center justify-between pt-1">
            <div>
              {saved && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preferences saved successfully
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 h-8 px-4 bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold rounded-md shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}


