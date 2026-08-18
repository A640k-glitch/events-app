"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { EventCategory, EventPriority } from "@/lib/types";
import { X, Plus, Image as ImageIcon, Sparkles } from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const { addEvent } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Summit");
  const [priority, setPriority] = useState<EventPriority>("High");
  const [date, setDate] = useState("2026-09-15");
  const [time, setTime] = useState("09:00 AM - 05:00 PM WAT");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("Lagos");
  const [country, setCountry] = useState("Nigeria");
  const [description, setDescription] = useState("");
  const [strategicNotes, setStrategicNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [boothNumber, setBoothNumber] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState(2500);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEvent({
      title,
      category,
      priority,
      date,
      time,
      location,
      city,
      country,
      description: description || strategicNotes,
      strategicNotes,
      boothNumber,
      expectedAttendance,
      isFifthLabAttending: true,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      isFeatured,
      isPublished: true,
    } as any);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0e1017] border border-white/10 shadow-2xl rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto font-sans text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Publish Event to Database & Homepage
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Creates live database record in Neon PostgreSQL and syncs to homepage carousel.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-white/50 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. West Africa Digital Core Banking Forum 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-black/80 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
              >
                <option value="Summit">Summit</option>
                <option value="Exposition">Exposition</option>
                <option value="Executive Briefing">Executive Briefing</option>
                <option value="Conference">Conference</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EventPriority)}
                className="w-full bg-black/80 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Venue Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eko Convention Centre"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">City *</label>
              <input
                type="text"
                required
                placeholder="Lagos"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Country *</label>
              <input
                type="text"
                required
                placeholder="Nigeria"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cover Photo URL (Populates Homepage Carousel Card)</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold">Description & Strategic Goals *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe event agenda, keynote speakers, and exhibition solutions..."
              value={description}
              onChange={(e) => { setDescription(e.target.value); setStrategicNotes(e.target.value); }}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 rounded-xl outline-none resize-none"
            />
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Feature on Homepage Hero Carousel
              </span>
              <p className="text-[11px] text-white/50">
                Instantly displays in the top showcase card for public visitors.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full shadow-lg cursor-pointer"
            >
              Publish Event Live
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
