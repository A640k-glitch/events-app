"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { EventCategory, EventPriority } from "@/lib/types";
import { X, Plus } from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const { addEvent } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Summit");
  const [priority, setPriority] = useState<EventPriority>("High");
  const [date, setDate] = useState("2026-09-12");
  const [time, setTime] = useState("09:00 AM - 05:00 PM EST");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [strategicNotes, setStrategicNotes] = useState("");
  const [boothNumber, setBoothNumber] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState(5000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
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
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0e1017] border border-white/10 shadow-2xl rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" /> Create New Industry Event
          </h2>
          <button onClick={onClose} className="p-1 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Financial Services Cloud Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-black/80 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
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
                className="w-full bg-black/80 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
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
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Venue Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Moscone Center"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">City *</label>
              <input
                type="text"
                required
                placeholder="San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Country *</label>
              <input
                type="text"
                required
                placeholder="USA"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold">Strategic Notes & Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Outline target accounts, pitch goals, and key staff mandates..."
              value={strategicNotes}
              onChange={(e) => setStrategicNotes(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg"
            >
              Publish Event to Discovery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
