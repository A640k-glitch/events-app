export const EVENT_CATEGORIES = [
  "Conference",
  "Summit",
  "Exposition",
  "Executive Briefing",
  "Webinar",
] as const;

export const EVENT_PRIORITIES = ["High", "Medium", "Low"] as const;

export const LEAD_STATUSES = [
  "Unread",
  "Followed Up",
  "Qualified",
  "Converted",
  "Closed",
] as const;

export const USER_ROLES = [
  "Admin",
  "Sales",
  "Ops",
  "Product Owner",
  "Staff",
  "Visitor",
] as const;

export const FIFTHLAB_PRODUCTS = [
  { id: "bulkwave", name: "Bulkwave", tagline: "Telecom & Messaging", bgColor: "#F4F4FF" },
  { id: "smerp", name: "Smerp", tagline: "Enterprise ERP", bgColor: "#FCEDFF" },
  { id: "kuleanpay", name: "Kuleanpay", tagline: "Payment Gateway", bgColor: "#E6F8FB" },
  { id: "finedge", name: "Finedge", tagline: "Core Banking & Fintech", bgColor: "#E6F8FB" },
  { id: "smerp-go", name: "Smerp Go", tagline: "SME Management", bgColor: "#EEEBFF" },
  { id: "ucp", name: "UCP", tagline: "Universal Card Platform", bgColor: "#EDF4FF" },
  { id: "beetvas", name: "beetVAS", tagline: "Value Added Services", bgColor: "#E7F1FF" },
] as const;
