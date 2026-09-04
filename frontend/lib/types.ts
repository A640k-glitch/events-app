export type UserRole = "Admin" | "Sales" | "Ops" | "Product Owner" | "Staff" | "Visitor";

export type EventPriority = "High" | "Medium" | "Low";
export type EventCategory = "Conference" | "Summit" | "Exposition" | "Executive Briefing" | "Webinar";

export interface AttendanceRecord {
  userId: string;
  userName: string;
  userRole: string;
  avatarUrl: string;
  confirmedAt: string;
  status: "Attending" | "Declined" | "Maybe";
}

export interface FifthLabEvent {
  id: string;
  title: string;
  category: EventCategory;
  priority: EventPriority;
  date: string;
  time: string;
  location: string;
  city: string;
  country: string;
  description: string;
  strategicNotes: string;
  boothNumber?: string;
  imageUrl?: string;
  expectedAttendance: number;
  confirmedStaffCount: number;
  isFifthLabAttending: boolean;
  attendanceManifest: AttendanceRecord[];
}

export type Event = FifthLabEvent;
export type EventItem = FifthLabEvent;

export type LeadStatus = "Unread" | "Followed Up" | "Qualified" | "Converted" | "Closed";

export interface Lead {
  id: string;
  visitorName: string;
  company: string;
  email: string;
  phone: string;
  productInterested: string;
  assignedProductOwner: string;
  bookingDate: string;
  bookingTime: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
}

export interface ProductOwner {
  id: string;
  name: string;
  role: string;
  email: string;
  timezone: string;
  workingHours: string;
  assignedProducts: string[];
  avatarUrl: string;
}

export interface FifthLabProduct {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  description: string;
  ownerId?: string;
  ownerName?: string;
  iconName: string;
  bgColor?: string;
  logoUrl?: string;
  tags?: string[];
  activeDemosThisMonth: number;
  availableSlots: string[];
  leadsCount?: number;
  conversionRate?: number;
  recentLeads?: Array<{
    id: string;
    visitorName: string;
    company: string;
    email: string;
    phone: string;
    status: string;
    bookingDate?: string;
    bookingTime?: string;
    createdAt?: string;
  }>;
}

export interface BookingSubmission {
  productId: string;
  date: string;
  timeSlot: string;
  visitorName: string;
  company: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface DashboardKPI {
  upcomingEventsCount: number;
  demoRequestsThisMonth: number;
  conversionRate: string;
  activeProductOwners: number;
}
