"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, Calendar, Save, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SettingsPage() {
  const { user } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl font-sans text-left">
        
        {/* Header Title Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-heading">
                System Settings
              </h1>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                FIFTHLAB NIGERIA & CWG PLC
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Organization preferences, West Africa Time (WAT) calendar sync, and corporate access controls.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: User Profile Settings */}
          <div className="border border-white/10 bg-black/60 backdrop-blur-xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-medium text-white tracking-tight flex items-center gap-2 font-heading">
              <Shield className="w-4 h-4 text-blue-400" /> Profile & Access Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
              <div className="space-y-1.5">
                <label className="text-white/70 font-medium">Display Name</label>
                <input
                  type="text"
                  defaultValue={user ? user.name : "Olumide Adebayo"}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 font-medium">Work Email</label>
                <input
                  type="email"
                  defaultValue={user ? user.email : "olumide.adebayo@fifthlab.ng"}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 font-medium">System Role</label>
                <input
                  type="text"
                  readOnly
                  value={user ? user.role : "VP of Product • FifthLab Nigeria"}
                  className="w-full bg-white/5 border border-white/10 text-emerald-400 p-2.5 font-medium outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 font-medium">Default Timezone</label>
                <select className="w-full bg-black/80 border border-white/10 focus:border-blue-500 text-white p-2.5 outline-none font-medium">
                  <option>WAT (UTC+1) - West Africa Time (Lagos, Abuja)</option>
                  <option>GMT (UTC+0) - Greenwich Mean Time (Accra, London)</option>
                  <option>CAT (UTC+2) - Central Africa Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Calendar Integration Settings */}
          <div className="border border-white/10 bg-black/60 backdrop-blur-xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-medium text-white tracking-tight flex items-center gap-2 font-heading">
              <Calendar className="w-4 h-4 text-emerald-400" /> Calendar & Corporate Sync
            </h2>

            <div className="space-y-3 text-xs font-light">
              <div className="p-3.5 bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">FifthLab & CWG Enterprise Calendar</h3>
                  <p className="text-white/50">Auto-pull product owner availability & emit direct invitations</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  CONNECTED
                </span>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Microsoft 365 / Outlook Sync</h3>
                  <p className="text-white/50">Corporate Exchange calendar sync for West Africa team leads</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  CONNECTED
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-white/50 font-light">
              FifthLab Nigeria & CWG PLC Engine v2.1
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "Settings Saved" : "Save Changes"}</span>
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
