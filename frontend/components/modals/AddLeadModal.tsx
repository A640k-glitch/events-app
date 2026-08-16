"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LeadStatus } from "@/lib/types";
import { X, UserPlus } from "lucide-react";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const { addLead, products, owners } = useApp();
  const [visitorName, setVisitorName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productInterested, setProductInterested] = useState(products[0]?.name || "FifthLab Payments");
  const [assignedProductOwner, setAssignedProductOwner] = useState(owners[0]?.name || "Elena Vance");
  const [bookingDate, setBookingDate] = useState("2026-08-04");
  const [bookingTime, setBookingTime] = useState("11:30 AM");
  const [status, setStatus] = useState<LeadStatus>("Unread");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      visitorName,
      company,
      email,
      phone,
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#0e1017] border border-white/10 shadow-2xl rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" /> Log New Demo Request (Lead)
          </h2>
          <button onClick={onClose} className="p-1 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Visitor Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Michael Scott"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Company / Organization *</label>
              <input
                type="text"
                required
                placeholder="Dunder Mifflin Enterprise"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Work Email *</label>
              <input
                type="email"
                required
                placeholder="mscott@dundermifflin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+1 (570) 555-0144"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Product Interested</label>
              <select
                value={productInterested}
                onChange={(e) => setProductInterested(e.target.value)}
                className="w-full bg-black/80 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold">Assigned Product Owner</label>
              <select
                value={assignedProductOwner}
                onChange={(e) => setAssignedProductOwner(e.target.value)}
                className="w-full bg-black/80 border border-white/10 focus:border-blue-500 text-white p-2.5 rounded-xl outline-none"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold">Requirements & Brief</label>
            <textarea
              rows={3}
              placeholder="Enter meeting notes or technical scope requested..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg"
            >
              Create Lead Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
