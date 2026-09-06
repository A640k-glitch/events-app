"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LeadStatus } from "@/lib/types";
import { X, UserPlus, ArrowRight } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  // Lock background scrolling when modal is open
  useBodyScrollLock(isOpen);

  const { addLead, products, owners } = useApp();
  const [visitorName, setVisitorName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productInterested, setProductInterested] = useState(products[0]?.name || "Bulkwave Core Payments");
  const [assignedProductOwner, setAssignedProductOwner] = useState(owners[0]?.name || "Product Specialist");
  const [bookingDate, setBookingDate] = useState("2026-09-02");
  const [bookingTime, setBookingTime] = useState("10:00 AM (WAT)");
  const [status, setStatus] = useState<LeadStatus>("Unread");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      visitorName,
      company,
      email,
      phone: phone || "+234 800 000 0000",
      productInterested,
      assignedProductOwner,
      bookingDate,
      bookingTime,
      status,
      notes,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white border border-slate-300 shadow-2xl rounded-xl p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto font-sans text-left text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#005B6E]" /> Log Inbound Attendee Lead
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Record executive briefings, demo requests, and delegate contact details.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Visitor Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tunde Balogun"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Company / Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Zenith Bank PLC"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Corporate Email *</label>
              <input
                type="email"
                required
                placeholder="tunde@zenithbank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Phone / WhatsApp</label>
              <input
                type="tel"
                placeholder="+234 803 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Product Interested</label>
              <select
                value={productInterested}
                onChange={(e) => setProductInterested(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Assigned Specialist</label>
              <select
                value={assignedProductOwner}
                onChange={(e) => setAssignedProductOwner(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium cursor-pointer"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Status Pipeline</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium cursor-pointer"
              >
                <option value="Unread">Unread</option>
                <option value="Qualified">Qualified</option>
                <option value="Followed Up">Followed Up</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Booking Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Demo Time Slot</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM (WAT)"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full h-8 bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 px-2.5 py-1 text-xs rounded-md outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-700">Meeting Notes &amp; Requirements</label>
            <textarea
              rows={2}
              placeholder="Enter meeting notes, integration requirements, or booth discussion..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-[#005B6E] text-slate-900 p-2 text-xs rounded-md outline-none resize-none font-medium"
            />
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 h-8 px-4 bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer transition-colors"
            >
              <span>Record Lead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
