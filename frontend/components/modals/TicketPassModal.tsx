"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, CheckCircle2 } from "lucide-react";
import { BrandButton } from "@/components/ui/BrandButtons";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export interface TicketPassData {
  visitorName: string;
  email: string;
  company: string;
  ticketTier: string;
  qrPassCode: string;
  qrBadgeDataUrl: string;
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    city: string;
  };
}

interface TicketPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketPassData | null;
}

export default function TicketPassModal({ isOpen, onClose, ticket }: TicketPassModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scrolling when modal is open
  useBodyScrollLock(isOpen && Boolean(ticket));

  if (!isOpen || !ticket || !mounted) return null;

  const downloadBadge = () => {
    const link = document.createElement("a");
    link.href = ticket.qrBadgeDataUrl;
    link.download = `FifthLab-Pass-${ticket.qrPassCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden font-sans my-auto max-h-[90vh] overflow-y-auto text-[#0E0E0E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Registration Confirmed
          </span>
          <h2 className="text-xl font-medium text-[#0E0E0E]">{ticket.event.title}</h2>
          <p className="text-xs text-[#5F5F7A]">
            Digital pass generated and delivered to <strong className="text-[#0E0E0E]">{ticket.email}</strong>.
          </p>
        </div>

        {/* Ticket Badge Box */}
        <div className="border border-gray-200 rounded-2xl bg-[#F7F7F8] p-5 space-y-4 text-center relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 text-xs">
            <span className="text-[#0090AD] font-semibold uppercase tracking-wider text-[11px]">
              {ticket.ticketTier.replace(/_/g, " ")}
            </span>
            <span className="text-[#5F5F7A] font-mono text-[11px] font-semibold">
              {ticket.qrPassCode}
            </span>
          </div>

          {/* QR Image */}
          <div className="p-3 bg-white rounded-xl inline-block shadow-sm border border-gray-100">
            <img
              src={ticket.qrBadgeDataUrl}
              alt="QR Ticket Code"
              className="w-40 h-40 object-contain mx-auto"
            />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-[#0E0E0E]">{ticket.visitorName}</h3>
            <p className="text-xs text-[#5F5F7A]">{ticket.company}</p>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200 text-left text-xs">
            <div>
              <span className="text-[10px] text-[#7C7C7C] font-medium block">Date & Time</span>
              <p className="text-[#0E0E0E] font-medium mt-0.5">{ticket.event.date}</p>
              <p className="text-[11px] text-[#5F5F7A]">{ticket.event.time}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#7C7C7C] font-medium block">Venue</span>
              <p className="text-[#0E0E0E] font-medium mt-0.5">{ticket.event.city}</p>
              <p className="text-[11px] text-[#5F5F7A] truncate">{ticket.event.location}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <BrandButton
            variant="primary"
            size="md"
            className="flex-1"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={downloadBadge}
          >
            Download Pass
          </BrandButton>

          <BrandButton
            variant="outline"
            size="md"
            onClick={onClose}
          >
            Done
          </BrandButton>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
