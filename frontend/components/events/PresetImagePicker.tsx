"use client";

import { useState } from "react";
import Image from "next/image";
import { EVENT_PRESET_IMAGES, EventPresetImage } from "@/lib/eventPresetImages";
import { Check, Search, Globe, Sparkles } from "lucide-react";

interface PresetImagePickerProps {
  selectedUrl: string;
  onSelect: (url: string) => void;
}

type CategoryFilter = "ALL" | "Summits" | "Expos" | "Demos & Labs" | "VIP & Access";
type RegionFilter = "ALL" | "West Africa" | "East Africa" | "Southern Africa" | "North Africa";

export default function PresetImagePicker({ selectedUrl, onSelect }: PresetImagePickerProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [activeRegion, setActiveRegion] = useState<RegionFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: "ALL", label: "All Hubs" },
    { id: "Summits", label: "Summits & Keynotes" },
    { id: "Expos", label: "Expos & Pavilions" },
    { id: "Demos & Labs", label: "Demos & Labs" },
    { id: "VIP & Access", label: "VIP & Access" },
  ];

  const regions: { id: RegionFilter; label: string }[] = [
    { id: "ALL", label: "All Regions" },
    { id: "West Africa", label: "West Africa (Lagos, Accra)" },
    { id: "East Africa", label: "East Africa (Nairobi, Kigali)" },
    { id: "Southern Africa", label: "Southern Africa (CT, Joburg)" },
    { id: "North Africa", label: "North Africa (Cairo)" },
  ];

  const filteredImages = EVENT_PRESET_IMAGES.filter((img) => {
    const matchesCategory = activeCategory === "ALL" || img.category === activeCategory;
    const matchesRegion = activeRegion === "ALL" || img.region === activeRegion;
    const matchesSearch =
      searchQuery === "" ||
      img.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.region.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60">
      {/* Category Pills & Region Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`h-6 px-2.5 rounded text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value as RegionFilter)}
            className="h-6 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded px-1.5 focus:outline-none focus:border-[#0090AD]"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of African Tech Images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
        {filteredImages.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-slate-500">
            No images match your filter criteria.
          </div>
        ) : (
          filteredImages.map((img) => {
            const isCurrent = selectedUrl === img.url;
            return (
              <button
                type="button"
                key={img.url}
                onClick={() => onSelect(img.url)}
                className={`group relative h-24 rounded-lg overflow-hidden border transition-all text-left cursor-pointer ${
                  isCurrent
                    ? "border-[#005B6E] ring-2 ring-[#005B6E]/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 opacity-85 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.label}
                  fill
                  sizes="160px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                {/* Selection Checkmark */}
                {isCurrent && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#005B6E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Text Metadata */}
                <div className="absolute inset-x-0 bottom-0 p-1.5">
                  <div className="text-[10px] font-bold text-white leading-tight truncate drop-shadow-xs">
                    {img.label}
                  </div>
                  <div className="text-[9px] font-medium text-slate-300 truncate">
                    {img.location}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-200/60">
        <span>Showing {filteredImages.length} African tech summit & expo visuals</span>
        <span className="font-mono">Kigali • Nairobi • Lagos • Cape Town • Cairo • Accra</span>
      </div>
    </div>
  );
}
