"use client";

import { X, Download, CheckCircle2, MapPin, Calendar, Clock, Ticket } from "lucide-react";

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
  if (!isOpen || !ticket) return null;

  const downloadBadge = () => {
    const link = document.createElement("a");
    link.href = ticket.qrBadgeDataUrl;
    link.download = `FifthLab-Pass-${ticket.qrPassCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0e1017] border border-white/15 shadow-2xl p-6 space-y-6 text-left relative overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-white/50 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Registration Confirmed
          </span>
          <h2 className="text-xl font-normal text-white font-heading">{ticket.event.title}</h2>
          <p className="text-xs text-white/60 font-light">
            Digital pass generated and delivered to <strong className="text-white">{ticket.email}</strong>.
          </p>
        </div>

        {/* Ticket Badge Box */}
        <div className="border border-white/10 bg-black/70 p-5 space-y-4 text-center relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">
              {ticket.ticketTier.replace(/_/g, " ")}
            </span>
            <span className="text-white/50 font-mono text-[10px]">
              {ticket.qrPassCode}
            </span>
          </div>

          {/* QR Image */}
          <div className="p-3 bg-white inline-block shadow-xl">
            <img
              src={ticket.qrBadgeDataUrl}
              alt="QR Ticket Code"
              className="w-40 h-40 object-contain mx-auto"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-white">{ticket.visitorName}</h3>
            <p className="text-xs text-white/60 font-light">{ticket.company}</p>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-left text-xs font-light">
            <div>
              <span className="text-[10px] text-white/40 block">Date & Time</span>
              <p className="text-white font-medium mt-0.5">{ticket.event.date}</p>
              <p className="text-[11px] text-white/60">{ticket.event.time}</p>
            </div>
            <div>
              <span className="text-[10px] text-white/40 block">Venue</span>
              <p className="text-white font-medium mt-0.5">{ticket.event.city}</p>
              <p className="text-[11px] text-white/60 truncate">{ticket.event.location}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={downloadBadge}
            className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Digital Pass</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-white/10 hover:border-white/20 text-white text-xs font-medium transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
