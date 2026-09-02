"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { EventCategory, EventPriority } from "@/lib/types";
import { X, Calendar } from "lucide-react";

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
      description,
      strategicNotes: description,
      boothNumber,
      expectedAttendance: Number(expectedAttendance) || 1000,
      isFifthLabAttending: true,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      isFeatured: true,
      isPublished: true,
    } as any);
    onClose();
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
              <Calendar className="w-4 h-4 text-[#0090AD]" /> Publish New Event Schedule
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Creates summit record, generates digital passes, and notifies registered team members.
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
              placeholder="e.g. West Africa Digital Banking Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
            />
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

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Expected Attendance Count</label>
            <input
              type="number"
              value={expectedAttendance}
              onChange={(e) => setExpectedAttendance(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Event Overview & Strategic Goals</label>
            <textarea
              rows={3}
              placeholder="Enter details on focus areas, keynote panels, and products showcased..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#0090AD] hover:bg-[#007A94] text-white font-semibold rounded-xl shadow-xs"
            >
              Publish Event Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
