"use client";

import { useState } from "react";
import { X, Ticket, ArrowRight, ShieldCheck, CheckCircle2, User, Mail, Building, Phone } from "lucide-react";
import { api } from "@/lib/api-client";
import { useApp } from "@/context/AppContext";
import TicketPassModal, { TicketPassData } from "./TicketPassModal";

interface RegisterPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: "FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER";
  selectedEventId?: string;
  selectedEventTitle?: string;
}

export default function RegisterPassModal({
  isOpen,
  onClose,
  defaultTier = "FREE_VISITOR",
  selectedEventId,
  selectedEventTitle,
}: RegisterPassModalProps) {
  const { events } = useApp();

  const [visitorName, setVisitorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [ticketTier, setTicketTier] = useState<string>(defaultTier);
  const [eventId, setEventId] = useState<string>(selectedEventId || (events[0]?.id || ""));
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<TicketPassData | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  if (!isOpen) return null;

  const targetEventId = eventId || selectedEventId || (events[0]?.id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !email.trim() || !company.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!targetEventId) {
      setErrorMessage("Please select an upcoming event.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await api.registerForEvent(targetEventId, {
        visitorName: visitorName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || "+234 800 000 0000",
        company: company.trim(),
        ticketTier,
      });

      if (res.success && res.data) {
        setConfirmedTicket({
          visitorName: res.data.visitorName,
          email: res.data.email,
          company: res.data.company,
          ticketTier: res.data.ticketTier,
          qrPassCode: res.data.qrPassCode,
          qrBadgeDataUrl: res.data.qrBadgeDataUrl,
          event: res.data.event,
        });
        setIsPassModalOpen(true);
      } else {
        throw new Error(res.error || "Registration could not be completed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePassModalClose = () => {
    setIsPassModalOpen(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg bg-[#0b0c10] border border-white/15 p-6 sm:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 text-white/50 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 pr-8">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5" /> Public Attendee Pass Registration
            </span>
            <h2 className="text-2xl font-normal text-white font-heading">
              Claim Your Event Pass
            </h2>
            <p className="text-xs text-white/60 font-light">
              Receive your official verified QR pass instantly on screen and delivered to your email.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-light">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-light">
            
            {/* Event Selector */}
            {events.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-white/70 font-medium">Select Upcoming Event *</label>
                <select
                  value={eventId || events[0]?.id}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full bg-[#13151b] border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.city} • {evt.date})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pass Tier Selector */}
            <div className="space-y-1.5">
              <label className="block text-white/70 font-medium">Pass Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "FREE_VISITOR", label: "Free Visitor", price: "₦0" },
                  { id: "PRO_ORGANIZER", label: "Pro Pass", price: "₦15,000" },
                  { id: "ENTERPRISE_PARTNER", label: "Enterprise", price: "₦45,000" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setTicketTier(tier.id)}
                    className={`p-2.5 border text-center transition-all cursor-pointer ${
                      ticketTier === tier.id
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 font-semibold"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                    }`}
                  >
                    <span className="block text-[11px]">{tier.label}</span>
                    <span className="text-[10px] text-white/50 font-mono">{tier.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="block text-white/70 font-medium">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Lawal"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white pl-9 pr-3 py-2 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/70 font-medium">Email Address *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="your-email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white pl-9 pr-3 py-2 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/70 font-medium">Company / Organization *</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sterling Financials"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white pl-9 pr-3 py-2 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/70 font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white pl-9 pr-3 py-2 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Generating Official QR Pass..." : "Confirm & Claim Digital Pass"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-white/40 text-center pt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant QR pass generation • Digital badge delivery to your inbox</span>
            </p>
          </form>
        </div>
      </div>

      {/* Instant Digital Ticket Pass Preview Modal */}
      <TicketPassModal
        isOpen={isPassModalOpen}
        onClose={handlePassModalClose}
        ticket={confirmedTicket}
      />
    </>
  );
}
