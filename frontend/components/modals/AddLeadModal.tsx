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
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto font-sans text-left text-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#111827] tracking-tight flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#0090AD]" /> Log Inbound Attendee Lead
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Record executive briefings, demo requests, and delegate contact details.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Visitor Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tunde Balogun"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Company / Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Zenith Bank PLC"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Corporate Email *</label>
              <input
                type="email"
                required
                placeholder="tunde@zenithbank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Phone / WhatsApp</label>
              <input
                type="tel"
                placeholder="+234 803 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Product Interested</label>
              <select
                value={productInterested}
                onChange={(e) => setProductInterested(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Assigned Specialist</label>
              <select
                value={assignedProductOwner}
                onChange={(e) => setAssignedProductOwner(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Status Pipeline</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              >
                <option value="Unread">Unread</option>
                <option value="Qualified">Qualified</option>
                <option value="Followed Up">Followed Up</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Booking Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Demo Time Slot</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM (WAT)"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Meeting Notes & Strategic Requirements</label>
            <textarea
              rows={3}
              placeholder="Enter meeting notes, integration requirements, or booth discussion..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-[#0090AD] text-[#111827] p-2.5 rounded-xl outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              <span>Record Inbound Lead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
