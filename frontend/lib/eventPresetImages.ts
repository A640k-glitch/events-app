export interface EventPresetImage {
  label: string;
  location: string;
  category: "Summits" | "Expos" | "Demos & Labs" | "VIP & Access";
  region: "West Africa" | "East Africa" | "Southern Africa" | "North Africa" | "Pan-Africa";
  url: string;
}

export const EVENT_PRESET_IMAGES: EventPresetImage[] = [
  // 1. Summits & Keynotes across Africa
  {
    label: "Kigali Summit Dome",
    location: "Kigali, Rwanda",
    category: "Summits",
    region: "East Africa",
    url: "/images/presets/kigali_summit_dome.jpg",
  },
  {
    label: "Nairobi Tech Summit",
    location: "Nairobi, Kenya",
    category: "Summits",
    region: "East Africa",
    url: "/images/presets/nairobi_tech_summit.jpg",
  },
  {
    label: "Keynote Lagos",
    location: "Lagos, Nigeria",
    category: "Summits",
    region: "West Africa",
    url: "/images/auth/real_lagos_keynote.jpg",
  },
  {
    label: "Accra FinTech Summit",
    location: "Accra, Ghana",
    category: "Summits",
    region: "West Africa",
    url: "/images/presets/accra_fintech_summit.jpg",
  },
  {
    label: "Speaker Panel Lineup",
    location: "Pan-Africa",
    category: "Summits",
    region: "Pan-Africa",
    url: "/images/auth/speaker_lineup.jpg",
  },

  // 2. Expos & Exhibition Pavilions
  {
    label: "CTICC Cape Town Expo",
    location: "Cape Town, South Africa",
    category: "Expos",
    region: "Southern Africa",
    url: "/images/presets/capetown_tech_expo.jpg",
  },
  {
    label: "Cairo Cloud Pavilion",
    location: "Cairo, Egypt",
    category: "Expos",
    region: "North Africa",
    url: "/images/presets/cairo_tech_expo.jpg",
  },
  {
    label: "Grand Expo Pavilion",
    location: "Pan-Africa",
    category: "Expos",
    region: "Pan-Africa",
    url: "/images/exhibition_hall.jpg",
  },
  {
    label: "Developer Pavilion",
    location: "Lagos, Nigeria",
    category: "Expos",
    region: "West Africa",
    url: "/images/auth/developer.jpg",
  },

  // 3. Demos & Developer Labs
  {
    label: "Fintech Pitch Stage",
    location: "Pan-Africa",
    category: "Demos & Labs",
    region: "West Africa",
    url: "/images/presets/tech_pitch_stage.jpg",
  },
  {
    label: "Cloud & AI Hackathon",
    location: "Nairobi, Kenya",
    category: "Demos & Labs",
    region: "East Africa",
    url: "/images/presets/africa_hackathon_lab.jpg",
  },
  {
    label: "Interactive Product Demo",
    location: "Pan-Africa",
    category: "Demos & Labs",
    region: "Pan-Africa",
    url: "/images/auth/live_product_demo.jpg",
  },

  // 4. VIP & Access Accreditation
  {
    label: "Sandton VIP Roundtable",
    location: "Johannesburg, South Africa",
    category: "VIP & Access",
    region: "Southern Africa",
    url: "/images/presets/africa_vip_roundtable.jpg",
  },
  {
    label: "VIP Executive Lounge",
    location: "Lagos, Nigeria",
    category: "VIP & Access",
    region: "West Africa",
    url: "/images/vip_lounge.jpg",
  },
  {
    label: "Smart Gate Turnstiles",
    location: "Kigali, Rwanda",
    category: "VIP & Access",
    region: "East Africa",
    url: "/images/presets/smart_gate_checkin.jpg",
  },
  {
    label: "Door Accreditation",
    location: "Lagos, Nigeria",
    category: "VIP & Access",
    region: "West Africa",
    url: "/images/auth/real_lagos_checkin.jpg",
  },
];
