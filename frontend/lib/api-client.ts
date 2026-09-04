const rawUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
const API_BASE_URL = rawUrl === "/api" || rawUrl === "" ? "/api" : (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl.replace(/\/+$/, "")}/api`);

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fifthlab_jwt_token");
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("fifthlab_jwt_token", token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("fifthlab_jwt_token");
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE_URL}${cleanEndpoint}`;

  let response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  // Handle transient serverless database cold-start with a fast single retry
  if (!response.ok && (response.status === 500 || response.status === 503) && (!options.method || options.method === "GET")) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    response = await fetch(targetUrl, {
      ...options,
      headers,
    });
  }

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) {
        errorMsg = errorJson.error;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Auth
  sendOtp: async (email: string, name?: string) => {
    return request<{ success: boolean; message: string; expiresInMinutes?: number; error?: string }>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    });
  },

  verifyOtp: async (email: string, otp: string) => {
    return request<{ success: boolean; message: string; data?: { token: string; user: any; isFirstTime?: boolean }; error?: string }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  getMe: async () => {
    return request<{ success: boolean; data: any }>("/auth/me");
  },

  getUsers: async () => {
    return request<{ success: boolean; count: number; data: any[] }>("/auth/users");
  },

  updateUserRole: async (userId: string, role: string) => {
    return request<{ success: boolean; message: string; data: any }>(`/auth/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (userId: string) => {
    return request<{ success: boolean; message: string }>(`/auth/users/${userId}`, {
      method: "DELETE",
    });
  },

  updateProfile: async (profileData: { name?: string; timezone?: string; workingHours?: string; avatarUrl?: string }) => {
    return request<{ success: boolean; data: any }>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },

  // Events
  getEvents: async (params?: { category?: string; priority?: string; search?: string; publishedOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.priority) query.append("priority", params.priority);
    if (params?.search) query.append("search", params.search);
    if (params?.publishedOnly !== undefined) query.append("publishedOnly", String(params.publishedOnly));
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<{ success: boolean; count: number; data: any[] }>(`/events${qs}`);
  },

  getFeaturedEvents: async () => {
    return request<{ success: boolean; count: number; data: any[] }>("/events/featured");
  },

  getEventById: async (id: string) => {
    return request<{ success: boolean; data: any }>(`/events/${id}`);
  },

  createEvent: async (eventData: any) => {
    return request<{ success: boolean; data: any }>("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },

  updateEvent: async (id: string, eventData: any) => {
    return request<{ success: boolean; data: any }>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    });
  },

  deleteEvent: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/events/${id}`, {
      method: "DELETE",
    });
  },

  rsvpEvent: async (eventId: string, status: string, userId?: string) => {
    return request<{ success: boolean; data: any }>(`/events/${eventId}/rsvp`, {
      method: "POST",
      body: JSON.stringify({ status, userId }),
    });
  },

  checkinAttendee: async (eventId: string, userId: string, qrPayload?: string) => {
    return request<{ success: boolean; message: string; data: any }>(`/events/${eventId}/checkin`, {
      method: "POST",
      body: JSON.stringify({ userId, qrPayload }),
    });
  },

  getEventBadge: async (eventId: string, userId: string) => {
    return request<{ success: boolean; data: any }>(`/events/${eventId}/badge/${userId}`);
  },

  // Public Registrations
  registerForEvent: async (eventId: string, registrationData: any) => {
    return request<{ success: boolean; message: string; data: any; error?: string }>(`/events/${eventId}/register`, {
      method: "POST",
      body: JSON.stringify(registrationData),
    });
  },

  getEventRegistrations: async (eventId: string) => {
    return request<{ success: boolean; count: number; data: any[]; error?: string }>(`/events/${eventId}/registrations`);
  },

  // Pitches & Proposals
  submitPitch: async (pitchData: any) => {
    return request<{ success: boolean; message: string; data: any; error?: string }>("/pitches", {
      method: "POST",
      body: JSON.stringify(pitchData),
    });
  },

  getPitches: async () => {
    return request<{ success: boolean; count: number; data: any[] }>("/pitches");
  },

  updatePitchStatus: async (pitchId: string, status: string, options?: { adminReviewNotes?: string; autoPublishEvent?: boolean }) => {
    return request<{ success: boolean; message: string; data: any }>(`/pitches/${pitchId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...options }),
    });
  },

  // Stats
  getStats: async () => {
    return request<{ success: boolean; data: any }>("/stats");
  },

  // Products
  getProducts: async () => {
    return request<{ success: boolean; count: number; data: any[] }>("/products");
  },

  getProductBySlug: async (slug: string) => {
    return request<{ success: boolean; data: any }>(`/products/${slug}`);
  },

  // Leads
  getLeads: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<{ success: boolean; count: number; data: any[] }>(`/leads${qs}`);
  },

  submitLead: async (leadData: any) => {
    return request<{ success: boolean; data: any }>("/leads", {
      method: "POST",
      body: JSON.stringify(leadData),
    });
  },

  updateLead: async (leadId: string, updates: any) => {
    return request<{ success: boolean; data: any }>(`/leads/${leadId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Newsletter
  subscribeNewsletter: async (email: string, source = "HOMEPAGE") => {
    return request<{ success: boolean; message: string; data: any }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, source }),
    });
  },
};
