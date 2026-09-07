"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
      aria-labelledby="privacy-modal-title"
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
              <h2 id="privacy-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Privacy Policy
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
              1. Who runs this platform
            </h3>
            <p>
              fifthEvents is operated by FifthLab, the innovation and digital products division of CWG Plc, based in Lagos, Nigeria. We develop fintech solutions and host technology summits across Africa.
            </p>
            <p>
              We do not sell contact information or trade attendee lists to advertising brokers. Revenue comes from enterprise software and summit operations, not personal data brokerage.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              2. What we collect
            </h3>
            <p>We only collect information you intentionally submit through our forms:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong className="text-slate-800">Event passes:</strong> Your name, work email, phone number, organization, job title, and ticket tier.
              </li>
              <li>
                <strong className="text-slate-800">Product demos:</strong> Your name, work email, phone/WhatsApp number, company, preferred date and time, chosen solution (such as Bulkwave, FinEdge, or Smerp), and briefing notes.
              </li>
              <li>
                <strong className="text-slate-800">Speaker & pitch proposals:</strong> Organizer name, organization, email, phone, and summit session abstract.
              </li>
              <li>
                <strong className="text-slate-800">Staff logins:</strong> Corporate email addresses verified through one-time codes (OTP).
              </li>
              <li>
                <strong className="text-slate-800">Technical logs:</strong> Server request timestamps and IP addresses for rate limiting and server health monitoring. We do not load advertising tracking pixels or social network tracking scripts.
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              3. How your information is used
            </h3>
            <p>
              Your data is used strictly to deliver the service you requested:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Generating your digital event pass and emailing your ticket with its scannable QR verification code.</li>
              <li>Checking your pass at the venue entrance to confirm registration.</li>
              <li>Routing product demo inquiries to the assigned FifthLab or CWG product owner to schedule your session.</li>
              <li>Sending essential event updates, such as venue changes, speaker announcements, or schedule revisions.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              4. Storage and third-party processors
            </h3>
            <p>
              Data is stored in a secured PostgreSQL database hosted on Neon and served via Vercel cloud infrastructure. Transactional emails (such as pass confirmations and OTPs) are delivered through SMTP mail providers. These providers process data under contractual confidentiality terms and are not permitted to use your details for their own purposes.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              5. Your rights under NDPA 2023
            </h3>
            <p>
              Under the Nigeria Data Protection Act (NDPA) and applicable privacy regulations, you have the right to inspect what data we hold on you, update incorrect contact records, or request complete removal from our databases.
            </p>
            <p>
              To request a copy of your records or delete your attendee profile, send an email to <a href="mailto:events@thefifthlab.com" className="text-[#0090AD] font-medium underline">events@thefifthlab.com</a> with the subject line <em>Data Subject Request</em>. We review and process verified requests within 14 business days.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-mono">
            Contact: events@thefifthlab.com
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
