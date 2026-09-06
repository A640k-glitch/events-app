"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, RefreshCw, Trash2, ShieldAlert, Users, Calendar, Mail } from "lucide-react";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/components/ui/SkeletonLoaders";
import AppleSpinner from "@/components/ui/AppleSpinner";

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
  const [users, setUsers] = useState<CorporateUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

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
    let isMounted = true;
    api.getUsers().then((res) => {
      if (isMounted && res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    }).catch((err) => {
      console.error("Failed to fetch team:", err);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
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

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the corporate roster?`)) {
      return;
    }
    try {
      setDeletingUserId(userId);
      await api.deleteUser(userId);
      await fetchTeam();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to remove staff member");
    } finally {
      setDeletingUserId(null);
    }
  };

  const isCorporateDomain = (email: string) => {
    const norm = email.toLowerCase();
    return norm.endsWith("@thefifthlab.com") || norm.endsWith("@cwg-plc.com");
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
      <div className="space-y-6 font-sans text-left text-slate-900">
        
        {/* Header Bar - Compact AWS Enterprise Style */}
        <div className="bg-gradient-to-r from-[#EAF7F7]/70 via-white to-[#F0F6FF]/70 p-3.5 sm:p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10.5px] font-bold text-[#005B6E] tracking-wider uppercase">
                Corporate Directory
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500 font-medium">Access Control &amp; Event Assignments</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Team Directory
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Verified corporate personnel, roles, and event assignments across FifthLab and CWG.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTeam}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            {isLoading ? (
              <AppleSpinner size={13} color="#005B6E" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-[#005B6E]" />
            )}
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Compact Search & Filter Bar (Image 1 Style) */}
        <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { key: "ALL", label: "All Roles" },
              { key: "ADMIN", label: "Admin" },
              { key: "PRODUCT_OWNER", label: "Product Owner" },
              { key: "STAFF", label: "Staff" }
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setRoleFilter(r.key)}
                className={cn(
                  "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  roleFilter === r.key
                    ? "bg-slate-950 text-white font-bold shadow-xs"
                    : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search team by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 rounded-md border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#005B6E] font-medium"
            />
          </div>
        </div>

        {/* Team Table - Dense AWS Console Style */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-2 px-3">Staff Member</th>
                  <th className="py-2 px-3">Corporate Email</th>
                  <th className="py-2 px-3">Role &amp; Access</th>
                  <th className="py-2 px-3">Assigned Inquiries</th>
                  <th className="py-2 px-3">Events Attending</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <TableSkeleton rows={5} columns={6} hasAvatar={true} />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const validDomain = isCorporateDomain(u.email);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Member */}
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#EAF7F7] border border-[#CEEFEF] text-[#005B6E] font-bold text-[10px] flex items-center justify-center shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-950">{u.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">ID: {u.id.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-800">{u.email}</span>
                            {!validDomain && (
                              <span 
                                title="Non-corporate domain email."
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 shrink-0"
                              >
                                <ShieldAlert className="w-3 h-3 text-rose-500" /> Non-Domain
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Role & Access */}
                        <td className="py-2 px-3 whitespace-nowrap">
                          {u.role === "ADMIN" && (
                            <span className="font-semibold text-xs text-purple-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                              <span>Admin</span>
                            </span>
                          )}
                          {u.role === "PRODUCT_OWNER" && (
                            <span className="font-semibold text-xs text-[#005B6E] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#005B6E] shrink-0" />
                              <span>Product Owner</span>
                            </span>
                          )}
                          {u.role === "STAFF" && (
                            <span className="font-semibold text-xs text-slate-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                              <span>Staff</span>
                            </span>
                          )}
                          {!["ADMIN", "PRODUCT_OWNER", "STAFF"].includes(u.role) && (
                            <span className="font-medium text-xs text-slate-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                              <span>{u.role}</span>
                            </span>
                          )}
                        </td>

                        {/* Assigned Inquiries */}
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {u._count?.assignedLeads || 0} Leads
                        </td>

                        {/* Events Attending */}
                        <td className="py-2 px-3 text-slate-800 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#005B6E]" />
                            <span>{u._count?.rsvps || 0} Summits</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={u.role}
                              disabled={updatingUserId === u.id}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="bg-white border border-slate-300 rounded px-2 py-0.5 text-[10.5px] text-slate-900 font-medium focus:outline-none focus:border-[#005B6E] cursor-pointer h-6.5"
                            >
                              <option value="STAFF">Staff</option>
                              <option value="PRODUCT_OWNER">Product Owner</option>
                              <option value="ADMIN">Admin</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              disabled={deletingUserId === u.id}
                              title="Delete Team Member"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {deletingUserId === u.id ? (
                                <AppleSpinner size={12} color="#E11D48" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                      No staff members match the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
