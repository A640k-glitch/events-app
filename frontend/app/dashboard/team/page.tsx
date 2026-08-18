"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserCheck, ShieldCheck, ShieldAlert, Mail, Search, RefreshCw, Sparkles, Building, Layers, CheckCircle2, Clock } from "lucide-react";
import { api } from "@/lib/api-client";
import { useApp } from "@/context/AppContext";

interface CorporateUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
  timezone?: string;
  lastLoginAt?: string | null;
  createdAt: string;
  ownedProducts?: { id: string; name: string }[];
  _count?: {
    rsvps: number;
    assignedLeads: number;
  };
}

export default function TeamPage() {
  const { user } = useApp();
  const [users, setUsers] = useState<CorporateUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const res = await api.getUsers();
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch team members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingUserId(userId);
      await api.updateUserRole(userId, newRole);
      await fetchTeam();
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl font-sans text-left">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-heading">
                Team & Personnel Directory
              </h1>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                THE FIFTHLAB NIGERIA
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Registered corporate personnel, email verification audit, and system permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTeam}
            className="px-3.5 py-2 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white text-xs font-light transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-light">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search personnel by name or @thefifthlab.com email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white pl-9 pr-3 py-2 outline-none font-medium text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/50 text-[11px]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#13151b] border border-white/10 text-white px-3 py-1.5 outline-none text-xs"
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="ADMIN">Admins</option>
              <option value="STAFF">Staff Personnel</option>
              <option value="PRODUCT_OWNER">Product Owners</option>
              <option value="SALES">Sales / BD</option>
              <option value="OPS">Operations</option>
            </select>
          </div>
        </div>

        {/* Personnel Roster Table */}
        <div className="border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                  <th className="p-4">Personnel</th>
                  <th className="p-4">Corporate Email</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4">Assigned Solutions</th>
                  <th className="p-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-white/50 text-xs">
                      {isLoading ? "Loading verified corporate directory..." : "No personnel found matching the filter."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const initial = u.name.trim().charAt(0).toUpperCase() || "S";
                    const isSelf = user?.email === u.email;

                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Member Identity */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                              {initial}
                            </div>
                            <div>
                              <div className="text-white font-medium flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 font-mono">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-white/40 font-mono">
                                ID: {u.id.substring(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4 text-white/80 font-mono text-xs">
                          {u.email}
                        </td>

                        {/* Verification Status */}
                        <td className="p-4">
                          {u.isVerified !== false ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>OTP Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Pending Verification</span>
                            </span>
                          )}
                        </td>

                        {/* Role Selector */}
                        <td className="p-4">
                          <select
                            value={u.role}
                            disabled={updatingUserId === u.id}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-[#111319] border border-white/15 text-xs text-white p-1.5 outline-none font-medium cursor-pointer disabled:opacity-50"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="STAFF">STAFF</option>
                            <option value="PRODUCT_OWNER">PRODUCT_OWNER</option>
                            <option value="SALES">SALES</option>
                            <option value="OPS">OPS</option>
                          </select>
                        </td>

                        {/* Assigned Products */}
                        <td className="p-4">
                          {u.ownedProducts && u.ownedProducts.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {u.ownedProducts.map((p) => (
                                <span key={p.id} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-medium">
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/40 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="p-4 text-white/50 text-[11px] font-mono">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 border border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-light text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Corporate Policy: All users must verify ownership of `@thefifthlab.com` via single-use email security codes.</span>
          </div>
          <span className="font-mono text-[11px]">Roster Count: {users.length}</span>
        </div>

      </div>
    </DashboardLayout>
  );
}
