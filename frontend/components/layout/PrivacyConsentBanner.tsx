"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";
import PrivacyModal from "@/components/modals/PrivacyModal";
import { api } from "@/lib/api-client";

export default function PrivacyConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      // Check if user has already accepted in localStorage
      const accepted = localStorage.getItem("fifthlab_consent_accepted");
      if (accepted === "true") {
        setShowBanner(false);
        return;
      }

      // If not yet accepted, get or create anonymous visitor ID and prompt on every visit / refresh
      let visitorId = localStorage.getItem("fifthlab_visitor_id");
      if (!visitorId) {
        visitorId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("fifthlab_visitor_id", visitorId);
      }

      // Verify with backend database
      api.checkConsent(visitorId).then((res) => {
        if (res && res.accepted) {
          localStorage.setItem("fifthlab_consent_accepted", "true");
          setShowBanner(false);
        } else {
          // Must keep popping up on each visit or refresh until user accepts
          setShowBanner(true);
        }
      }).catch(() => {
        setShowBanner(true);
      });
    } catch {
      setShowBanner(true);
    }
  }, []);

  // Explicit user acceptance - persists to PostgreSQL database and local storage
  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      let visitorId = localStorage.getItem("fifthlab_visitor_id");
      if (!visitorId) {
        visitorId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("fifthlab_visitor_id", visitorId);
      }

      // Record to PostgreSQL database
      await api.recordConsent(visitorId, "ACCEPTED");

      // Mark accepted in browser
      localStorage.setItem("fifthlab_consent_accepted", "true");
      document.cookie = "fifthlab_consent=accepted; path=/; max-age=31536000; SameSite=Lax";
      setShowBanner(false);
    } catch (e) {
      console.warn("Could not sync consent to backend, saving locally:", e);
      localStorage.setItem("fifthlab_consent_accepted", "true");
      setShowBanner(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close temporarily for this single view without recording acceptance
  // (per requirement: until user accepts it will pop up again on the next refresh/visit)
  const handleTemporaryDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return (
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    );
  }

  return (
    <>
      <aside
        aria-label="Privacy and Storage Notice"
        className="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-5 sm:max-w-[360px] z-40 bg-white/98 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-xl p-3 sm:p-3.5 font-sans animate-in slide-in-from-bottom-2 duration-150 text-slate-900"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FifthEventsEmblem size={16} className="shrink-0" />
            <span className="text-[12px] font-bold text-slate-900">Privacy & Storage</span>
          </div>

          <button
            type="button"
            onClick={handleTemporaryDismiss}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors cursor-pointer shrink-0"
            aria-label="Close for now"
            title="Close for now (will remind on next visit)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug mt-1.5 mb-2.5">
          We use essential browser storage for your login session and digital passes. Zero advertising trackers.
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAccept}
            disabled={isSubmitting}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Got it"}
          </button>
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer underline decoration-slate-300 underline-offset-2"
          >
            Review Policy
          </button>
        </div>
      </aside>

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}
