"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, RefreshCw, Trash2, ShieldAlert, CheckCircle2 } from "lucide-react";
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
      <div className="space-y-6 font-sans text-left text-[#111827]">
        
        {/* Header Bar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Team Directory
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Verified corporate personnel, roles, and event assignments across FifthLab and CWG.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTeam}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-900 transition-all cursor-pointer shadow-2xs hover:border-slate-400 self-start sm:self-auto"
          >
            {isLoading ? (
              <AppleSpinner size={14} color="#0090AD" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-[#0090AD]" />
            )}
            <span>Refresh</span>
          </button>
        </div>

        {/* High-Contrast Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-slate-200/90 border border-slate-300 overflow-x-auto no-scrollbar shadow-2xs">
            {["ALL", "ADMIN", "STAFF", "PRODUCT_OWNER"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  roleFilter === role
                    ? "bg-white text-slate-950 shadow-xs ring-1 ring-slate-300"
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                )}
              >
                {role === "ALL" ? "All Roles" : role.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search team by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-[#0090AD] shadow-2xs font-medium"
            />
          </div>
        </div>

        {/* High-Contrast Mobile-Responsive Team Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-800 uppercase tracking-wider text-[10.5px] font-bold">
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role & Access</th>
                  <th className="py-3.5 px-4">Assigned Inquiries</th>
                  <th className="py-3.5 px-4">Events Attending</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
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
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#E8F8FA] border border-[#20B2AA]/30 text-[#0090AD] font-bold text-xs flex items-center justify-center shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-950">{u.name}</div>
                              <div className="text-[10px] text-slate-500">ID: {u.id.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-800">{u.email}</span>
                            {!validDomain && (
                              <span 
                                title="Non-corporate domain email. Remove this account."
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0"
                              >
                                <ShieldAlert className="w-3 h-3 text-rose-600" /> Non-Domain
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10.5px] font-bold",
                            u.role === "ADMIN" && "bg-purple-100 text-purple-900 border border-purple-300",
                            u.role === "PRODUCT_OWNER" && "bg-[#E8F8FA] text-[#00829B] border border-[#20B2AA]/40",
                            u.role === "STAFF" && "bg-slate-100 text-slate-800 border border-slate-300"
                          )}>
                            {u.role.replace(/_/g, " ")}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-950">
                          {u._count?.assignedLeads || 0} Leads
                        </td>

                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {u._count?.rsvps || 0} Summits
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={u.role}
                              disabled={updatingUserId === u.id}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#0090AD] cursor-pointer shadow-2xs"
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
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {deletingUserId === u.id ? (
                                <AppleSpinner size={14} color="#E11D48" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
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
