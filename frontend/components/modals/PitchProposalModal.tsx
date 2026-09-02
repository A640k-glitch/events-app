"use client";

import { useState } from "react";
import { X, Sparkles, Send, CheckCircle2, Building, Mail, Phone, Calendar, MapPin, Users } from "lucide-react";
import { api } from "@/lib/api-client";
import { useApp } from "@/context/AppContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface PitchProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PitchProposalModal({ isOpen, onClose }: PitchProposalModalProps) {
  // Lock background scroll when modal is open
  useBodyScrollLock(isOpen);

  const { refreshData } = useApp();

  const [organizerName, setOrganizerName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedCity, setProposedCity] = useState("Lagos");
  const [expectedAudience, setExpectedAudience] = useState(500);
  const [pitchDescription, setPitchDescription] = useState("");
  const [sponsorshipRequested, setSponsorshipRequested] = useState("Co-Hosting & Keynote Presentation");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerName || !organization || !email || !eventTitle || !pitchDescription) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await api.submitPitch({
        organizerName: organizerName.trim(),
        organization: organization.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || "+234 800 000 0000",
        eventTitle: eventTitle.trim(),
        proposedDate: proposedDate || "Q4 2026",
        proposedCity,
        expectedAudience: Number(expectedAudience) || 500,
        pitchDescription: pitchDescription.trim(),
        sponsorshipRequested,
      });

      if (res.success) {
        setIsSubmitted(true);
        await refreshData();
      } else {
        throw new Error(res.error || "Submission failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Proposal submission failed";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-[#0b0c10] border border-white/15 p-6 sm:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden font-sans max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-1 text-white/50 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center space-y-6 py-6">
            <div className="w-14 h-14 mx-auto bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center rounded-full shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-normal text-white font-heading">
                Proposal Submitted to FifthLab!
              </h2>
              <p className="text-xs text-white/70 max-w-sm mx-auto font-light leading-relaxed">
                Thank you, <strong>{organizerName}</strong>. Your event proposal for <strong className="text-cyan-400">{eventTitle}</strong> has been routed to The FifthLab Executive Operations Board for review.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-white/5 text-left text-xs space-y-2 text-white/70 font-light">
              <p>● <strong>Review Timeline:</strong> 48-72 business hours</p>
              <p>● <strong>Co-Hosting Notification:</strong> Emitted to {email}</p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1.5 pr-8">
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Pro Organizer Proposal Portal
              </span>
              <h2 className="text-2xl font-normal text-white font-heading">
                Pitch an Event to The FifthLab
              </h2>
              <p className="text-xs text-white/60 font-light">
                Suggest tech summits, hackathons, and enterprise conferences for FifthLab & CWG co-hosting, sponsorship, and engineering keynotes.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-light">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-light">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 font-medium">Organizer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-medium">Organization / Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos FinTech Forum"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-medium">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="organizer@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-medium">Proposed Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Africa Open Banking Summit 2026"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 font-medium">Target Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 14, 2026"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-medium">Target City</label>
                  <select
                    value={proposedCity}
                    onChange={(e) => setProposedCity(e.target.value)}
                    className="w-full bg-[#13151b] border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                  >
                    <option value="Lagos">Lagos, Nigeria</option>
                    <option value="Abuja">Abuja, Nigeria</option>
                    <option value="Accra">Accra, Ghana</option>
                    <option value="Kigali">Kigali, Rwanda</option>
                    <option value="Virtual">Virtual / Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 font-medium">Audience</label>
                  <input
                    type="number"
                    value={expectedAudience}
                    onChange={(e) => setExpectedAudience(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-medium">Proposal & Collaboration Summary *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline the event theme, target attendees, and how you would like FifthLab to participate (e.g. Lead Sponsor, Keynote, Product Demo Booth)..."
                  value={pitchDescription}
                  onChange={(e) => setPitchDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting Proposal..." : "Submit Event Pitch"}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
