"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { FifthLabEvent, Lead, FifthLabProduct, ProductOwner, LeadStatus, EventCategory, EventPriority, AttendanceRecord } from "@/lib/types";
import { api, setAuthToken, clearAuthToken } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "lead" | "event" | "system";
  read: boolean;
}

export interface EventPitch {
  id: string;
  organizerName: string;
  organization: string;
  email: string;
  phone: string;
  eventTitle: string;
  proposedDate: string;
  proposedCity: string;
  expectedAudience: number;
  pitchDescription: string;
  sponsorshipRequested?: string | null;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "DECLINED";
  adminReviewNotes?: string | null;
  createdAt: string;
}

export interface LiveStats {
  upcomingEventsCount: number;
  demoRequestsCount: number;
  unreadLeadsCount: number;
  activeStaffCount: number;
  pendingPitchesCount: number;
  publicRegistrationsCount: number;
  totalExpectedAttendance: number;
}

interface AppUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  provider?: string;
  token?: string;
}

interface AppContextType {
  events: FifthLabEvent[];
  leads: Lead[];
  products: FifthLabProduct[];
  owners: ProductOwner[];
  pitches: EventPitch[];
  stats: LiveStats;
  notifications: SystemNotification[];
  currentRegion: string;
  setRegion: (region: string) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isLoading: boolean;
  
  // User Authentication State
  user: AppUser | null;
  loginAs: (name?: string, email?: string, provider?: string) => Promise<void>;
  requestOtp: (email: string, name?: string) => Promise<{ success: boolean; message: string }>;
  verifyOtpAndLogin: (email: string, otp: string) => Promise<{ isFirstTime: boolean }>;
  updateUserProfile: (profileData: { name?: string; timezone?: string; workingHours?: string; avatarUrl?: string }) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  
  // Event Actions
  addEvent: (event: Omit<FifthLabEvent, "id" | "confirmedStaffCount" | "attendanceManifest"> & { imageUrl?: string; isFeatured?: boolean; isPublished?: boolean }) => Promise<void>;
  toggleAttendance: (eventId: string, status: "Attending" | "Declined" | "Maybe") => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  // Pitch Actions
  approvePitch: (pitchId: string, autoPublish?: boolean, reviewNotes?: string) => Promise<void>;
  declinePitch: (pitchId: string, reviewNotes?: string) => Promise<void>;

  // Lead Actions
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => Promise<void>;
  updateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  updateLead: (leadId: string, updatedFields: Partial<Lead>) => Promise<void>;
  deleteLead: (leadId: string) => void;

  // Product & Owner Actions
  addProduct: (productData: { slug: string; name: string; tagline: string; description: string; iconName?: string; ownerId?: string }) => Promise<void>;
  updateProduct: (productId: string, updatedFields: Partial<FifthLabProduct>) => void;
  updateOwnerAvailability: (ownerId: string, workingHours: string, timezone: string) => void;

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapPrismaEvent(e: any): FifthLabEvent {
  const manifest: AttendanceRecord[] = (e.attendanceManifest || []).map((m: any) => {
    const staffName = m.user?.name || "Staff Member";
    return {
      userId: m.userId || m.user?.id,
      userName: staffName,
      userRole: m.user?.role || "Staff",
      avatarUrl: m.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffName)}&background=0891b2&color=fff&bold=true`,
      confirmedAt: m.confirmedAt ? new Date(m.confirmedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently",
      status: m.status === "ATTENDING" ? "Attending" : m.status === "DECLINED" ? "Declined" : "Maybe",
    };
  });

  const categoryMap: Record<string, EventCategory> = {
    CONFERENCE: "Conference",
    SUMMIT: "Summit",
    EXPOSITION: "Exposition",
    EXECUTIVE_BRIEFING: "Executive Briefing",
    WEBINAR: "Webinar",
  };

  const priorityMap: Record<string, EventPriority> = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
  };

  const dateObj = new Date(e.date);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : e.date;

  return {
    id: e.id,
    title: e.title,
    category: categoryMap[e.category] || "Conference",
    priority: priorityMap[e.priority] || "Medium",
    date: formattedDate,
    time: e.time,
    location: e.location,
    city: e.city,
    country: e.country,
    description: e.description,
    strategicNotes: e.strategicNotes || "",
    boothNumber: e.boothNumber || undefined,
    expectedAttendance: e.expectedAttendance || 0,
    confirmedStaffCount: manifest.filter((m) => m.status === "Attending").length,
    isFifthLabAttending: e.isFifthLabAttending ?? true,
    attendanceManifest: manifest,
    ...(e.imageUrl ? { imageUrl: e.imageUrl } : {}),
  } as FifthLabEvent;
}

function mapPrismaLead(l: any): Lead {
  const statusMap: Record<string, LeadStatus> = {
    UNREAD: "Unread",
    FOLLOWED_UP: "Followed Up",
    QUALIFIED: "Qualified",
    CONVERTED: "Converted",
    CLOSED: "Closed",
  };

  return {
    id: l.id,
    visitorName: l.visitorName,
    company: l.company,
    email: l.email,
    phone: l.phone,
    productInterested: l.productInterested,
    assignedProductOwner: l.assignedOwner?.name || "Unassigned",
    bookingDate: l.bookingDate ? new Date(l.bookingDate).toISOString().split("T")[0] : "",
    bookingTime: l.bookingTime || "",
    status: statusMap[l.status] || "Unread",
    notes: l.notes || "",
    createdAt: l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today",
  };
}

function mapPrismaProduct(p: any): FifthLabProduct {
  return {
    id: p.id,
    slug: p.slug || p.id,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    ownerId: p.ownerId || "",
    ownerName: p.owner?.name || "Product Lead",
    iconName: p.iconName || "Briefcase",
    bgColor: p.bgColor || "#F4F4FF",
    logoUrl: p.logoUrl || "/favicon.ico",
    tags: p.tags || ["Enterprise Solution"],
    activeDemosThisMonth: p.activeDemosThisMonth || 0,
    availableSlots: p.availableSlots || ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    leadsCount: p.leadsCount || 0,
    conversionRate: p.conversionRate || 65,
    recentLeads: p.recentLeads || [],
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [events, setEvents] = useState<FifthLabEvent[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<FifthLabProduct[]>([]);
  const [owners, setOwners] = useState<ProductOwner[]>([]);
  const [pitches, setPitches] = useState<EventPitch[]>([]);
  const [stats, setStats] = useState<LiveStats>({
    upcomingEventsCount: 0,
    demoRequestsCount: 0,
    unreadLeadsCount: 0,
    activeStaffCount: 0,
    pendingPitchesCount: 0,
    publicRegistrationsCount: 0,
    totalExpectedAttendance: 0,
  });
  const [currentRegion, setRegion] = useState<string>("WAT (Lagos)");
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User state
  const [user, setUser] = useState<AppUser | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Fetch live data from backend API
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [eventsRes, productsRes, statsRes] = await Promise.all([
        api.getEvents().catch(() => null),
        api.getProducts().catch(() => null),
        api.getStats().catch(() => null),
      ]);

      if (eventsRes && eventsRes.data) {
        setEvents(eventsRes.data.map(mapPrismaEvent));
      }

      if (productsRes && productsRes.data) {
        setProducts(productsRes.data.map(mapPrismaProduct));
      }

      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }

      // Fetch protected resources if authenticated
      const token = typeof window !== "undefined" ? localStorage.getItem("fifthlab_jwt_token") : null;
      if (token) {
        const [leadsRes, usersRes, pitchesRes] = await Promise.all([
          api.getLeads().catch(() => null),
          api.getUsers().catch(() => null),
          api.getPitches().catch(() => null),
        ]);

        if (leadsRes && leadsRes.data) {
          setLeads(leadsRes.data.map(mapPrismaLead));
        }

        if (usersRes && usersRes.data) {
          setOwners(
            usersRes.data.map((u: any) => ({
              id: u.id,
              name: u.name,
              role: u.role,
              email: u.email,
              timezone: u.timezone || "WAT",
              workingHours: u.workingHours || "9:00 AM - 5:00 PM",
              assignedProducts: (u.ownedProducts || []).map((p: any) => p.name),
              avatarUrl: u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0891b2&color=fff&bold=true`,
            }))
          );
        }

        if (pitchesRes && pitchesRes.data) {
          setPitches(pitchesRes.data);
        }
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check saved session on mount
  useEffect(() => {
    async function restoreSession() {
      const savedUserStr = localStorage.getItem("fifthlab_user");
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.email) {
            setUser(parsed);
          }
        } catch {
          // ignore
        }
      }
      await refreshData();
    }

    restoreSession();
  }, [refreshData]);

  // Real-time synchronization across mobile devices, browsers, and tabs
  useEffect(() => {
    let sse: EventSource | null = null;
    let isSubscribed = true;
    let channel: BroadcastChannel | null = null;

    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("fifthevents_sync");
        channel.onmessage = () => {
          if (isSubscribed) {
            refreshData();
          }
        };
      }
    } catch {
      // ignore
    }

    // Connect to Server-Sent Events (SSE) stream
    function connectSSE() {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const streamEndpoint = rawApiUrl.endsWith("/api")
          ? `${rawApiUrl}/realtime/stream`
          : `${rawApiUrl}/api/realtime/stream`;

        sse = new EventSource(streamEndpoint);

        sse.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type !== "CONNECTED" && isSubscribed) {
              refreshData();
            }
          } catch {
            // Heartbeat or malformed payload
          }
        };

        sse.onerror = () => {
          if (sse) {
            sse.close();
            sse = null;
          }
          if (isSubscribed) {
            setTimeout(connectSSE, 4000);
          }
        };
      } catch (err) {
        console.warn("SSE connection error:", err);
      }
    }

    connectSSE();

    // Instant refresh when user returns to phone or desktop tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isSubscribed) {
        refreshData();
      }
    };
    const handleFocus = () => {
      if (isSubscribed) {
        refreshData();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Fallback polling interval (every 12 seconds)
    const interval = setInterval(() => {
      if (isSubscribed) {
        refreshData();
      }
    }, 12000);

    return () => {
      isSubscribed = false;
      if (sse) sse.close();
      if (channel) channel.close();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [refreshData]);

  const requestOtp = async (email: string, name?: string) => {
    if (!email) throw new Error("Corporate email address is required.");
    const res = await api.sendOtp(email.trim().toLowerCase(), name?.trim());
    if (res.success) {
      return { success: true, message: res.message };
    }
    throw new Error(res.error || "Failed to dispatch verification code.");
  };

  const verifyOtpAndLogin = async (email: string, otp: string) => {
    if (!email || !otp) throw new Error("Corporate email and verification code are required.");

    const res = await api.verifyOtp(email.trim().toLowerCase(), otp.trim());
    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
      const loggedUser: AppUser = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role || "STAFF",
        provider: "FifthLab Verified Auth",
        token: res.data.token,
      };
      setUser(loggedUser);
      localStorage.setItem("fifthlab_user", JSON.stringify(loggedUser));
      await refreshData();
      return { isFirstTime: Boolean(res.data?.isFirstTime) };
    } else {
      throw new Error(res.error || "Invalid or expired verification code.");
    }
  };

  const loginAs = async (
    name = "",
    email = "",
    provider = "Corporate SSO"
  ) => {
    if (!email) throw new Error("Corporate email is required.");

    const res = await api.sendOtp(email);
    if (!res.success) {
      throw new Error(res.error || "Authentication request failed");
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    localStorage.removeItem("fifthlab_user");
    router.push("/");
  };

  const updateUserProfile = async (profileData: { name?: string; timezone?: string; workingHours?: string; avatarUrl?: string }) => {
    try {
      if (user) {
        const updatedUser: AppUser = {
          ...user,
          ...(profileData.name ? { name: profileData.name.trim() } : {}),
        };
        setUser(updatedUser);
        localStorage.setItem("fifthlab_user", JSON.stringify(updatedUser));
      }

      await api.updateProfile(profileData);
      await refreshData();
    } catch (e) {
      console.error("Failed to update user profile:", e);
    }
  };

  // Command Palette Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const notifySync = () => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        new BroadcastChannel("fifthevents_sync").postMessage({ type: "SYNC", timestamp: Date.now() });
      } catch {
        // ignore
      }
    }
  };

  const addEvent = async (eventData: Omit<FifthLabEvent, "id" | "confirmedStaffCount" | "attendanceManifest"> & { imageUrl?: string; isFeatured?: boolean; isPublished?: boolean }) => {
    try {
      const res = await api.createEvent({
        title: eventData.title,
        category: eventData.category.toUpperCase().replace(/\s+/g, "_"),
        priority: eventData.priority.toUpperCase(),
        date: new Date(eventData.date).toISOString(),
        time: eventData.time,
        location: eventData.location,
        city: eventData.city,
        country: eventData.country,
        description: eventData.description,
        strategicNotes: eventData.strategicNotes,
        boothNumber: eventData.boothNumber,
        imageUrl: eventData.imageUrl,
        isFeatured: eventData.isFeatured ?? true,
        isPublished: eventData.isPublished ?? true,
        expectedAttendance: eventData.expectedAttendance,
        isFifthLabAttending: true,
      });

      if (res.success && res.data) {
        const newEvt = mapPrismaEvent(res.data);
        setEvents((prev) => [newEvt, ...prev]);
        notifySync();
        await refreshData();
      }
    } catch (e) {
      console.error("Failed to create event:", e);
    }
  };

  const toggleAttendance = async (eventId: string, status: "Attending" | "Declined" | "Maybe") => {
    try {
      const dbStatus = status === "Attending" ? "ATTENDING" : status === "Declined" ? "DECLINED" : "MAYBE";
      const res = await api.rsvpEvent(eventId, dbStatus, user?.id);

      if (res.success) {
        notifySync();
        await refreshData();
      }
    } catch (e) {
      console.error("Failed to submit RSVP:", e);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await api.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      notifySync();
      await refreshData();
    } catch (e) {
      console.error("Failed to delete event:", e);
    }
  };

  const approvePitch = async (pitchId: string, autoPublish = true, reviewNotes = "Approved by FifthLab Admin") => {
    try {
      await api.updatePitchStatus(pitchId, "APPROVED", { autoPublishEvent: autoPublish, adminReviewNotes: reviewNotes });
      notifySync();
      await refreshData();
    } catch (e) {
      console.error("Failed to approve pitch:", e);
    }
  };

  const declinePitch = async (pitchId: string, reviewNotes = "Declined by FifthLab Review Board") => {
    try {
      await api.updatePitchStatus(pitchId, "DECLINED", { adminReviewNotes: reviewNotes });
      notifySync();
      await refreshData();
    } catch (e) {
      console.error("Failed to decline pitch:", e);
    }
  };

  const addLead = async (leadData: Omit<Lead, "id" | "createdAt">) => {
    try {
      const res = await api.submitLead({
        visitorName: leadData.visitorName,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        productInterested: leadData.productInterested,
        bookingDate: leadData.bookingDate || new Date().toISOString(),
        timeSlot: leadData.bookingTime || "11:00 AM WAT",
        notes: leadData.notes,
      });

      if (res.success && res.data) {
        const newLead = mapPrismaLead(res.data);
        setLeads((prev) => [newLead, ...prev]);
        notifySync();
        await refreshData();
      }
    } catch (e) {
      console.error("Failed to submit lead:", e);
    }
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      const dbStatus = status.toUpperCase().replace(/\s+/g, "_");
      await api.updateLead(leadId, { status: dbStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );
      notifySync();
      await refreshData();
    } catch (e) {
      console.error("Failed to update lead status:", e);
    }
  };

  const updateLead = async (leadId: string, updatedFields: Partial<Lead>) => {
    try {
      await api.updateLead(leadId, updatedFields);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, ...updatedFields } : l))
      );
      notifySync();
      await refreshData();
    } catch (e) {
      console.error("Failed to update lead:", e);
    }
  };

  const deleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    notifySync();
  };

  const addProduct = async (productData: { slug: string; name: string; tagline: string; description: string; iconName?: string; ownerId?: string }) => {
    try {
      // POST to backend products endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("fifthlab_jwt_token") || ""}`,
        },
        body: JSON.stringify(productData),
      });
      await refreshData();
    } catch (e) {
      console.error("Failed to create product:", e);
    }
  };

  const updateProduct = (productId: string, updatedFields: Partial<FifthLabProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p))
    );
  };

  const updateOwnerAvailability = (ownerId: string, workingHours: string, timezone: string) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === ownerId ? { ...o, workingHours, timezone } : o))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        events,
        leads,
        products,
        owners,
        pitches,
        stats,
        notifications,
        currentRegion,
        setRegion,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isLoading,
        user,
        loginAs,
        requestOtp,
        verifyOtpAndLogin,
        updateUserProfile,
        logout,
        refreshData,
        addEvent,
        toggleAttendance,
        deleteEvent,
        approvePitch,
        declinePitch,
        addLead,
        updateLeadStatus,
        updateLead,
        deleteLead,
        addProduct,
        updateProduct,
        updateOwnerAvailability,
        markNotificationAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
