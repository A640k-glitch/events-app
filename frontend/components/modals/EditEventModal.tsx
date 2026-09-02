"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { EventCategory, EventPriority, FifthLabEvent } from "@/lib/types";
import { X, Edit3, Image as ImageIcon, Sparkles } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { api } from "@/lib/api-client";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: FifthLabEvent | null;
  onEventUpdated: () => void;
}

const PRESET_IMAGES = [
  { label: "Keynote Lagos", url: "/images/keynote_lagos.jpg" },
  { label: "Exhibition Hall", url: "/images/exhibition_hall.jpg" },
  { label: "VIP Lounge", url: "/images/vip_lounge.jpg" },
  { label: "Door Registration", url: "/images/qr_registration.jpg" },
];

export default function EditEventModal({ isOpen, onClose, event, onEventUpdated }: EditEventModalProps) {
  useBodyScrollLock(isOpen);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Summit");
  const [priority, setPriority] = useState<EventPriority>("High");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [description, setDescription] = useState("");
  const [boothNumber, setBoothNumber] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState(2500);
  const [imageUrl, setImageUrl] = useState("/images/keynote_lagos.jpg");
  const [customImage, setCustomImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setCategory(event.category || "Summit");
      setPriority(event.priority || "High");
      
      const parsedDate = new Date(event.date);
      setDate(!isNaN(parsedDate.getTime()) ? parsedDate.toISOString().split("T")[0] : "2026-09-15");
      
      setTime(event.time || "09:00 AM - 05:00 PM WAT");
      setLocation(event.location || "");
      setCity(event.city || "Lagos");
      setCountry(event.country || "Nigeria");
      setDescription(event.description || "");
      setBoothNumber(event.boothNumber || "");
      setExpectedAttendance(event.expectedAttendance || 1500);
      
      const currentImg = event.imageUrl || "/images/keynote_lagos.jpg";
      if (PRESET_IMAGES.some(p => p.url === currentImg)) {
        setImageUrl(currentImg);
        setCustomImage("");
      } else {
        setCustomImage(currentImg);
      }
      setIsFeatured(true);
      setIsPublished(true);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const finalImage = customImage.trim() ? customImage.trim() : imageUrl;

      await api.updateEvent(event.id, {
        title,
        category,
        priority,
        date,
        time,
        location,
        city,
        country,
        description,
        strategicNotes: description,
        boothNumber,
        expectedAttendance: Number(expectedAttendance) || 1000,
        imageUrl: finalImage,
        isFeatured,
        isPublished,
      });

      onEventUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update event:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto font-sans text-left text-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#111827] tracking-tight flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#0090AD]" /> Edit Summit & Carousel Details
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Updates will synchronize across the homepage carousel, digital door badges, and event rosters.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
            />
          </div>

          {/* Carousel Image Selector */}
          <div className="space-y-2 border border-slate-100 p-3.5 rounded-2xl bg-slate-50/70">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#0090AD]" />
                <span>Carousel Cover Image</span>
              </label>
              <span className="text-[10px] text-slate-500">Live on Homepage Spotlight Carousel</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.url}
                  onClick={() => {
                    setImageUrl(img.url);
                    setCustomImage("");
                  }}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    imageUrl === img.url && !customImage
                      ? "border-[#0090AD] ring-2 ring-[#0090AD]/20 scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.label} fill sizes="150px" className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white font-medium text-center truncate">
                    {img.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-1.5">
              <input
                type="url"
                placeholder="Or paste custom image URL (https://...)"
                value={customImage}
                onChange={(e) => setCustomImage(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2 text-[11px] text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              >
                <option value="Summit">Summit</option>
                <option value="Exposition">Exposition</option>
                <option value="Executive Briefing">Executive Briefing</option>
                <option value="Conference">Conference</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EventPriority)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Event Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Venue / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eko Convention Centre"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Operating Time (WAT) *</label>
              <input
                type="text"
                required
                placeholder="09:00 AM - 05:00 PM WAT"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Booth # / Pavilion</label>
              <input
                type="text"
                placeholder="e.g. Hall A, Booth #14"
                value={boothNumber}
                onChange={(e) => setBoothNumber(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Expected Attendance</label>
              <input
                type="number"
                value={expectedAttendance}
                onChange={(e) => setExpectedAttendance(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="editIsFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#0090AD] rounded border-gray-300 focus:ring-[#0090AD]"
              />
              <label htmlFor="editIsFeatured" className="font-semibold text-gray-800 text-[11px] cursor-pointer flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Feature in Carousel</span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="editIsPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-[#0090AD] rounded border-gray-300 focus:ring-[#0090AD]"
              />
              <label htmlFor="editIsPublished" className="font-semibold text-gray-800 text-[11px] cursor-pointer">
                <span>Publish Live</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Event Overview & Strategic Goals</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#0090AD] hover:bg-[#007A94] text-white font-semibold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
