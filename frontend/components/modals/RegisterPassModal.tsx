"use client";

import { useState } from "react";
import { X, Ticket, ArrowRight, ShieldCheck, User, Mail, Building, Phone } from "lucide-react";
import { api } from "@/lib/api-client";
import { useApp } from "@/context/AppContext";
import TicketPassModal, { TicketPassData } from "./TicketPassModal";
import { BrandButton } from "@/components/ui/BrandButtons";
import { cn } from "@/lib/utils";

interface RegisterPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: "FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER";
  initialTier?: "FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER";
  selectedEventId?: string;
  initialEventId?: string;
  eventId?: string;
}

export default function RegisterPassModal(props: RegisterPassModalProps) {
  const {
    isOpen,
    onClose,
    defaultTier,
    initialTier,
    selectedEventId,
    initialEventId,
    eventId: propEventId,
  } = props;

  const { events } = useApp();
  const effectiveEventId = initialEventId || selectedEventId || propEventId || (events[0]?.id || "");
  const activeTier = initialTier || defaultTier || "FREE_VISITOR";

  const [visitorName, setVisitorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [ticketTier, setTicketTier] = useState<string>(activeTier);
  const [chosenEventId, setChosenEventId] = useState<string>(effectiveEventId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<TicketPassData | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  if (!isOpen) return null;

  const targetEventId = chosenEventId || effectiveEventId;

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
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden font-sans max-h-[90vh] overflow-y-auto text-[#0E0E0E]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 pr-8">
            <span className="text-[11px] font-semibold text-[#0090AD] uppercase tracking-widest flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5" /> Public Attendee Pass Registration
            </span>
            <h2 className="text-2xl font-medium text-[#0E0E0E]">
              Claim Your Event Pass
            </h2>
            <p className="text-xs text-[#5F5F7A]">
              Sub-second QR badge check-in delivered instantly to your corporate email.
            </p>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Event Selector */}
            <div className="space-y-1.5">
              <label className="block text-[#5F5F7A] font-semibold">Select Upcoming Event *</label>
              <select
                value={targetEventId}
                onChange={(e) => setChosenEventId(e.target.value)}
                className="w-full bg-[#F7F7F8] border border-gray-200 rounded-xl p-2.5 text-[#0E0E0E] text-xs font-medium focus:outline-none focus:border-[#00B4D8] focus:bg-white"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.city}) — {e.date}
                  </option>
                ))}
              </select>
            </div>

            {/* Pass Tier Selector */}
            <div className="space-y-1.5">
              <label className="block text-[#5F5F7A] font-semibold">Pass Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "FREE_VISITOR", label: "Free Visitor", price: "₦0" },
                  { id: "PRO_ORGANIZER", label: "Pro Pass", price: "₦15,000" },
                  { id: "ENTERPRISE_PARTNER", label: "Enterprise", price: "₦50,000" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setTicketTier(tier.id)}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                      ticketTier === tier.id
                        ? "border-[#00B4D8] bg-[#E6F8FB] text-[#0090AD] font-semibold shadow-xs"
                        : "border-gray-200 bg-[#F7F7F8] text-[#5F5F7A] hover:bg-white"
                    )}
                  >
                    <span className="block text-[11px] font-semibold">{tier.label}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{tier.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[#5F5F7A] font-semibold">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Olumide Adeleke"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full pl-9 bg-[#F7F7F8] border border-gray-200 rounded-xl p-2.5 text-[#0E0E0E] text-xs font-medium focus:outline-none focus:border-[#00B4D8] focus:bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Corporate Email */}
            <div className="space-y-1.5">
              <label className="block text-[#5F5F7A] font-semibold">Corporate Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="olumide@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 bg-[#F7F7F8] border border-gray-200 rounded-xl p-2.5 text-[#0E0E0E] text-xs font-medium focus:outline-none focus:border-[#00B4D8] focus:bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Company / Organization */}
            <div className="space-y-1.5">
              <label className="block text-[#5F5F7A] font-semibold">Company / Organization *</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanbic IBTC, Flutterwave, CWG PLC"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 bg-[#F7F7F8] border border-gray-200 rounded-xl p-2.5 text-[#0E0E0E] text-xs font-medium focus:outline-none focus:border-[#00B4D8] focus:bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-[#5F5F7A] font-semibold">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 bg-[#F7F7F8] border border-gray-200 rounded-xl p-2.5 text-[#0E0E0E] text-xs font-medium focus:outline-none focus:border-[#00B4D8] focus:bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* NDPR Compliance Notice */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2 text-[11px] text-[#5F5F7A]">
              <ShieldCheck className="w-4 h-4 text-[#0090AD] shrink-0 mt-0.5" />
              <span>
                By registering, your badge information is securely processed in accordance with NDPR data protection regulations.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              
              <BrandButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold"
              >
                {isSubmitting ? (
                  <span>Generating QR Pass...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Generate Digital Pass <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </BrandButton>
            </div>
          </form>
        </div>
      </div>

      {/* Render Generated Pass Modal if Confirmed */}
      {confirmedTicket && (
        <TicketPassModal
          isOpen={isPassModalOpen}
          onClose={handlePassModalClose}
          ticket={confirmedTicket}
        />
      )}
    </>
  );
}
