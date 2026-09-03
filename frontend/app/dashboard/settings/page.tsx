"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, Calendar, Save, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SettingsPage() {
  const { user, updateUserProfile } = useApp();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [timezone, setTimezone] = useState("WAT");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateUserProfile({
        name: displayName.trim(),
        timezone,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl font-sans text-left text-slate-900">
        
        {/* Header Bar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-slate-900">
              Preferences
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage your profile details, default timezone, and account settings.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: User Profile Settings */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 space-y-5 shadow-2xs">
            <h2 className="text-sm font-bold text-[#111827] tracking-tight flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0090AD]" /> Profile Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-700 font-semibold">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Corporate Name"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-[#111827] focus:outline-none focus:border-[#0090AD]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 font-semibold">Work Email</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-500 cursor-not-allowed font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 font-semibold">System Role</label>
                <input
                  type="text"
                  readOnly
                  value={user?.role || "STAFF"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-[#0090AD] font-mono font-semibold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-700 font-semibold">Timezone Normalization</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-[#111827] focus:outline-none focus:border-[#0090AD]"
                >
                  <option value="WAT">West Africa Time (WAT) — Lagos / Abuja (UTC+1)</option>
                  <option value="GMT">Greenwich Mean Time (GMT) — Accra (UTC+0)</option>
                  <option value="EAT">East Africa Time (EAT) — Nairobi / Kigali (UTC+3)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Security & Session Status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-[#111827] tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0090AD]" /> Security & Access Audit
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="space-y-0.5">
                <div className="font-bold text-[#111827]">Two-Factor OTP Authentication</div>
                <div className="text-gray-500">Corporate single-use passcodes delivered to verified inboxes.</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px] self-start sm:self-auto">
                Enforced & Active
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
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
