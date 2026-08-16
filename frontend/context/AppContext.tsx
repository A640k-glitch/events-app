"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FifthLabEvent, Lead, FifthLabProduct, ProductOwner, LeadStatus } from "@/lib/types";
import { MOCK_EVENTS, MOCK_LEADS, MOCK_PRODUCTS, MOCK_PRODUCT_OWNERS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "lead" | "event" | "system";
  read: boolean;
}

interface AppContextType {
  events: FifthLabEvent[];
  leads: Lead[];
  products: FifthLabProduct[];
  owners: ProductOwner[];
  notifications: SystemNotification[];
  currentRegion: string;
  setRegion: (region: string) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // User Authentication State
  user: { name: string; email: string; role: string; provider?: string } | null;
  loginAs: (name?: string, email?: string, provider?: string) => void;
  logout: () => void;
  
  // Event Actions
  addEvent: (event: Omit<FifthLabEvent, "id" | "confirmedStaffCount" | "attendanceManifest">) => void;
  toggleAttendance: (eventId: string, status: "Attending" | "Declined" | "Maybe") => void;
  deleteEvent: (eventId: string) => void;
  
  // Lead Actions
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateLead: (leadId: string, updatedFields: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;

  // Product & Owner Actions
  updateProduct: (productId: string, updatedFields: Partial<FifthLabProduct>) => void;
  updateOwnerAvailability: (ownerId: string, workingHours: string, timezone: string) => void;

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [events, setEvents] = useState<FifthLabEvent[]>(MOCK_EVENTS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [products, setProducts] = useState<FifthLabProduct[]>(MOCK_PRODUCTS);
  const [owners, setOwners] = useState<ProductOwner[]>(MOCK_PRODUCT_OWNERS);
  const [currentRegion, setRegion] = useState<string>("us-east-1 (N. Virginia)");
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Initial user state (check localStorage)
  const [user, setUser] = useState<{ name: string; email: string; role: string; provider?: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fifthlab_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser({ name: "Alex Rivera", email: "alex.rivera@fifthlab.io", role: "Event Organizer & Staff Architect" });
      }
    } else {
      // Default initial session for immediate exploration
      const defaultUser = { name: "Alex Rivera", email: "alex.rivera@fifthlab.io", role: "Event Organizer & Staff Architect" };
      setUser(defaultUser);
      localStorage.setItem("fifthlab_user", JSON.stringify(defaultUser));
    }
  }, []);

  const loginAs = (name = "Alex Rivera", email = "alex.rivera@fifthlab.io", provider = "Email") => {
    const newUser = { name, email, role: "Event Organizer & Staff Architect", provider };
    setUser(newUser);
    localStorage.setItem("fifthlab_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fifthlab_user");
    router.push("/login");
  };

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "notif-1",
      title: "New Public Demo Booked",
      message: "Jonathan Hayes from Stripe Enterprise booked FifthLab Payments for Aug 4, 11:30 AM.",
      timestamp: "10 mins ago",
      type: "lead",
      read: false,
    },
    {
      id: "notif-2",
      title: "Staff Attendance Confirmed",
      message: "Alex Rivera confirmed attendance for Global FinTech Summit 2026.",
      timestamp: "1 hour ago",
      type: "event",
      read: false,
    },
    {
      id: "notif-3",
      title: "Calendar Sync Verified",
      message: "Elena Vance's Google Calendar availability refreshed cleanly.",
      timestamp: "3 hours ago",
      type: "system",
      read: true,
    },
  ]);

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

  const addEvent = (eventData: Omit<FifthLabEvent, "id" | "confirmedStaffCount" | "attendanceManifest">) => {
    const newEvent: FifthLabEvent = {
      ...eventData,
      id: `evt-${Date.now().toString().slice(-4)}`,
      confirmedStaffCount: 1,
      isFifthLabAttending: true,
      attendanceManifest: [
        {
          userId: "u-current",
          userName: user ? user.name : "Alex Rivera",
          userRole: "Staff Architect",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
          confirmedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          status: "Attending",
        },
      ],
    };
    setEvents((prev) => [newEvent, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "New Event Created",
        message: `Event "${eventData.title}" was published to internal discovery manifest.`,
        timestamp: "Just now",
        type: "event",
        read: false,
      },
      ...prev,
    ]);
  };

  const toggleAttendance = (eventId: string, status: "Attending" | "Declined" | "Maybe") => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;

        const currentUserName = user ? user.name : "Alex Rivera";
        const existingIndex = evt.attendanceManifest.findIndex((m) => m.userId === "u-current" || m.userName.includes(currentUserName));
        let updatedManifest = [...evt.attendanceManifest];

        if (existingIndex >= 0) {
          updatedManifest[existingIndex] = {
            ...updatedManifest[existingIndex],
            status,
            confirmedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          };
        } else {
          updatedManifest.push({
            userId: "u-current",
            userName: `${currentUserName} (You)`,
            userRole: "Staff Architect",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
            confirmedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
            status,
          });
        }

        const attendingCount = updatedManifest.filter((m) => m.status === "Attending").length;

        return {
          ...evt,
          isFifthLabAttending: attendingCount > 0,
          confirmedStaffCount: attendingCount,
          attendanceManifest: updatedManifest,
        };
      })
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const addLead = (leadData: Omit<Lead, "id" | "createdAt">) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setLeads((prev) => [newLead, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Manual Lead Captured",
        message: `Lead for ${leadData.visitorName} (${leadData.company}) was logged.`,
        timestamp: "Just now",
        type: "lead",
        read: false,
      },
      ...prev,
    ]);
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  };

  const updateLead = (leadId: string, updatedFields: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updatedFields } : l))
    );
  };

  const deleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
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
        notifications,
        currentRegion,
        setRegion,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        user,
        loginAs,
        logout,
        addEvent,
        toggleAttendance,
        deleteEvent,
        addLead,
        updateLeadStatus,
        updateLead,
        deleteLead,
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
