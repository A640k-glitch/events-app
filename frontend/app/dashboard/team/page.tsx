"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, RefreshCw } from "lucide-react";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import LogoChargingLoader from "@/components/brand/LogoChargingLoader";

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
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Team & Staff Directory
              </h1>
              <span className="text-[11px] text-[#0090AD] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8FA] border border-[#20B2AA]/20 font-mono">
                {users.length} Personnel
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Registered corporate personnel, email verification audit, and permission roles.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTeam}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs hover:border-slate-300 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0090AD] ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Search & Filter Bar Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 overflow-x-auto no-scrollbar shadow-2xs">
            {["ALL", "ADMIN", "STAFF", "PRODUCT_OWNER"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  roleFilter === role
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                {role === "ALL" ? "All Roles" : role.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search team by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0090AD] shadow-2xs"
            />
          </div>
        </div>

        {/* Team Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-[#8E8EA0] uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role & Access</th>
                  <th className="py-3 px-4">Assigned Leads</th>
                  <th className="py-3 px-4">Event RSVPs</th>
                  <th className="py-3 px-4 text-right">Role Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <LogoChargingLoader size={44} message="Syncing corporate roster..." />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E8F8FA] border border-[#20B2AA]/20 text-[#0090AD] font-bold text-xs flex items-center justify-center">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-[#111827]">{u.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">ID: {u.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                          u.role === "ADMIN" && "bg-purple-50 text-purple-700 border border-purple-200",
                          u.role === "PRODUCT_OWNER" && "bg-[#E8F8FA] text-[#00829B] border border-[#20B2AA]/30",
                          u.role === "STAFF" && "bg-gray-100 text-gray-700"
                        )}>
                          {u.role.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#111827]">
                        {u._count?.assignedLeads || 0} Leads
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        {u._count?.rsvps || 0} Summits
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={u.role}
                          disabled={updatingUserId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-[#111827] focus:outline-none focus:border-[#0090AD] cursor-pointer"
                        >
                          <option value="STAFF">Staff</option>
                          <option value="PRODUCT_OWNER">Product Owner</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
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
