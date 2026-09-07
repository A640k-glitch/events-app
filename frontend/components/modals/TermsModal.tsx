"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150 overscroll-contain"
      onClick={onClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 sm:p-7 space-y-5 max-h-[88vh] overflow-y-auto font-sans text-left text-slate-900 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FifthEventsEmblem size={22} className="shrink-0" />
              <h2 id="terms-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Terms of Service
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              fifthEvents • Last updated: September 2026
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              1. The Agreement
            </h3>
            <p>
              By registering for passes, scheduling product demos, or submitting speaker proposals on fifthEvents, you agree to these ground rules. This platform is managed by FifthLab, a division of CWG Plc.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              2. Event Passes & Venue Admission
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>A digital pass confirms registration for a specific summit session or conference track. It is issued to the individual named on the pass and cannot be transferred or resold.</li>
              <li>Physical admission remains subject to venue safety capacities and the host organizers check-in desk. Registration does not override physical fire codes if a venue reaches its legal occupancy limit.</li>
              <li>Event organizers reserve the right to verify credentials or turn away attendees who violate venue safety policies or disrupt proceedings.</li>
              <li>If a summit is canceled or postponed by organizers, we will send an email notice to the address on file. FifthLab and CWG Plc are not responsible for private travel, flights, or accommodation costs incurred by attendees.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              3. Product Demos & Consultations
            </h3>
            <p>
              Booking a demo connects you directly with the product teams behind FifthLab and CWG solutions. Demo requests are scheduled based on engineer and product specialist availability.
            </p>
            <p>
              A demo booking is an introductory briefing. It does not constitute a formal commercial license, delivery commitment, or binding service level agreement. Commercial deployments are handled under dedicated enterprise Master Services Agreements (MSAs).
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              4. Code of Conduct
            </h3>
            <p>When using this site, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Submit fabricated contact names or disposable email accounts to hoard passes.</li>
              <li>Run automated crawlers, scrapers, or scripts designed to extract attendee directories or flood endpoints.</li>
              <li>Attempt to gain unauthorized access to staff administration views or bypass OTP verification controls.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              5. Disclaimers & Governing Law
            </h3>
            <p>
              fifthEvents is provided on an &quot;as is&quot; basis. We verify event details to the best of our ability, but speaker rosters and summit agendas may change without notice at the discretion of the event hosts.
            </p>
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. Any legal disputes arising from use of the platform will be resolved in the competent courts of Lagos State, Nigeria.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-mono">
            Questions: events@thefifthlab.com
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
