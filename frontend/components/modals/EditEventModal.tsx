"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { EventCategory, EventPriority, FifthLabEvent } from "@/lib/types";
import { X, Edit3, Image as ImageIcon, Sparkles, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { api } from "@/lib/api-client";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: FifthLabEvent | null;
  onEventUpdated: () => void;
}

const PRESET_IMAGES = [
  { label: "Keynote Lagos", url: "/images/auth/real_lagos_keynote.jpg" },
  { label: "Door Accreditation", url: "/images/auth/real_lagos_checkin.jpg" },
  { label: "Developer Pavilion", url: "/images/auth/developer.jpg" },
  { label: "VIP Executive Lounge", url: "/images/vip_lounge.jpg" },
];

export default function EditEventModal({ isOpen, onClose, event, onEventUpdated }: EditEventModalProps) {
  useBodyScrollLock(isOpen);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [expectedAttendance, setExpectedAttendance] = useState(0);

  // Image states
  const [imageUrl, setImageUrl] = useState("/images/auth/real_lagos_keynote.jpg");
  const [customImage, setCustomImage] = useState("");
  const [customPreview, setCustomPreview] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

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
      setExpectedAttendance(event.expectedAttendance || 0);
      
      const currentImg = event.imageUrl || "/images/auth/real_lagos_keynote.jpg";
      if (PRESET_IMAGES.some(p => p.url === currentImg)) {
        setImageUrl(currentImg);
        setCustomImage("");
        setCustomPreview(null);
      } else {
        setCustomImage(currentImg);
        setCustomPreview(currentImg);
      }
      setIsFeatured(true);
      setIsPublished(true);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setCustomPreview(localUrl);
    setUploadFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCustomImage(data.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setCustomImage(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Upload failed, falling back to base64:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setCustomImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCustomImage = () => {
    setCustomImage("");
    setCustomPreview(null);
    setUploadFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            <h2 className="text-base font-semibold text-[#111827] tracking-tight flex items-center gap-2">
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

          {/* Carousel Image Selector with Custom Upload */}
          <div className="space-y-3 border border-slate-100 p-4 rounded-2xl bg-slate-50/70">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#0090AD]" />
                <span>Event Cover Image</span>
              </label>
              <span className="text-[10px] text-slate-500">Live on Carousel & Summit Index</span>
            </div>

            {/* Custom Upload Drop Area */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />

              {customPreview || customImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-3 flex items-center gap-3.5">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={customPreview || customImage}
                      alt="Uploaded event preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[#0090AD] font-semibold text-xs truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadFileName || "Active custom event image"}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Live on homepage and summit schedules</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveCustomImage}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Remove custom image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-[#0090AD] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-white/80 hover:bg-[#E8F8FA]/30 transition-all cursor-pointer group"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0090AD]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading event image...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#E8F8FA] flex items-center justify-center text-slate-600 group-hover:text-[#0090AD] transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        Upload custom image from your device
                      </span>
                      <span className="text-[10px] text-slate-500">
                        PNG, JPG, or WebP (Recommended 1200 x 675 or 16:9)
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Presets Toggle */}
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-[11px] font-semibold text-[#0090AD] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{showPresets ? "Hide preset library" : "Or choose from preset photo library"}</span>
                </button>
              </div>

              {showPresets && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 animate-in fade-in duration-150">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => {
                        setImageUrl(img.url);
                        handleRemoveCustomImage();
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
              )}
            </div>

            {/* Direct URL Input */}
            <div className="pt-1">
              <input
                type="url"
                placeholder="Or paste external image URL (https://...)"
                value={customImage && !customPreview ? customImage : ""}
                onChange={(e) => {
                  setCustomImage(e.target.value);
                  setCustomPreview(null);
                }}
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
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Booth # / Pavilion</label>
              <input
                type="text"
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
                id="isFeaturedEdit"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#0090AD] rounded border-gray-300 focus:ring-[#0090AD]"
              />
              <label htmlFor="isFeaturedEdit" className="font-semibold text-gray-800 text-[11px] cursor-pointer flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Feature in Carousel</span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isPublishedEdit"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-[#0090AD] rounded border-gray-300 focus:ring-[#0090AD]"
              />
              <label htmlFor="isPublishedEdit" className="font-semibold text-gray-800 text-[11px] cursor-pointer">
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
