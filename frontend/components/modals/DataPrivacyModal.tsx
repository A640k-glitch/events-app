"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataPrivacyModal({ isOpen, onClose }: DataPrivacyModalProps) {
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
      aria-labelledby="data-security-modal-title"
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
              <h2 id="data-security-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Data Privacy & Security Statement
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              fifthEvents • Technical Safeguards & NDPA Compliance
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
              1. Security Architecture
            </h3>
            <p>
              fifthEvents handles registration records, enterprise demo bookings, and digital event passes. We implement direct technical controls to protect this data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong className="text-slate-800">In-Transit Encryption:</strong> All browser communication is encrypted over HTTPS using modern TLS certificates. Unencrypted HTTP traffic is rejected.
              </li>
              <li>
                <strong className="text-slate-800">Database Protection:</strong> Database connections to our Neon PostgreSQL clusters mandate SSL encryption with strict connection authentication.
              </li>
              <li>
                <strong className="text-slate-800">Passwordless Staff Access:</strong> Staff portal authentication relies on time-expiring one-time passcodes (OTP) dispatched directly to authorized email inboxes. No static passwords exist to be compromised.
              </li>
              <li>
                <strong className="text-slate-800">Least Privilege:</strong> Access to attendee inquiries is segmented by role. Product owners only see leads routed to their specific solutions (e.g. Bulkwave, FinEdge, or Smerp).
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              2. Data Retention & Purging
            </h3>
            <p>
              We retain attendee records and demo requests for 24 months to support summit check-in verification, annual attendee accreditation, and legitimate product consultation follow-up.
            </p>
            <p>
              After 24 months of account inactivity, attendee records are permanently purged or aggregated into anonymized attendance counts. You do not need to wait 24 months: you can request immediate data deletion at any point.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              3. Incident Notification
            </h3>
            <p>
              While we maintain rigorous defenses, no digital infrastructure is completely immune to threats. In the event of a security incident affecting your personal data, FifthLab will notify affected attendees and the Nigeria Data Protection Commission (NDPC) without undue delay, outlining the nature of the event and recommended protective steps.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              4. Responsible Vulnerability Disclosure
            </h3>
            <p>
              We welcome reports from security researchers. If you identify an unintended exposure or potential vulnerability on fifthEvents, please submit details to <a href="mailto:security@thefifthlab.com" className="text-[#0090AD] font-medium underline">security@thefifthlab.com</a>. Please allow our team reasonable time to remediate before public disclosure.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-mono">
            Security Desk: security@thefifthlab.com
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
