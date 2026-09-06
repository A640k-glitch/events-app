"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { 
  Plus, 
  X, 
  Layers, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Search,
  Mail,
  Building,
  Phone,
  BarChart3
} from "lucide-react";
import { CardGridSkeleton } from "@/components/ui/SkeletonLoaders";
import { FifthLabProduct } from "@/lib/types";
import { resolveProductLogo, resolveProductTheme } from "@/lib/products-data";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const { products, addProduct, isLoading, owners, leads, updateLeadStatus, updateLead } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FifthLabProduct | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "FIFTHLAB" | "CWG">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalLeadFilter, setModalLeadFilter] = useState<"ALL" | "BOOKINGS" | "INBOUND">("ALL");

  // Live matched leads from global state for the selected product
  const activeProductLeads = selectedProduct
    ? leads.filter((l) => {
        const interest = (l.productInterested || "").toLowerCase();
        const pSlug = (selectedProduct.slug || "").toLowerCase();
        const pName = (selectedProduct.name || "").toLowerCase();
        return (
          interest.includes(pSlug) ||
          pSlug.includes(interest) ||
          interest.includes(pName) ||
          pName.includes(interest)
        );
      })
    : [];

  const displayLeads = activeProductLeads.length > 0 
    ? activeProductLeads 
    : (selectedProduct?.recentLeads || []);

  const totalDemosForSelected = displayLeads.filter((l: any) => l.bookingDate || l.bookingTime).length;
  const bookedLeadsForSelected = displayLeads.filter((l: any) => l.bookingDate || l.bookingTime);
  const inboundLeadsForSelected = displayLeads.filter((l: any) => !l.bookingDate && !l.bookingTime);
  const visibleModalLeads = modalLeadFilter === "BOOKINGS"
    ? bookedLeadsForSelected
    : modalLeadFilter === "INBOUND"
    ? inboundLeadsForSelected
    : displayLeads;
  const convertedForSelected = displayLeads.filter((l: any) => l.status === "Converted" || l.status === "Qualified").length;
  const followedUpForSelected = displayLeads.filter((l: any) => l.status === "Followed Up").length;
  const unreadForSelected = displayLeads.filter((l: any) => l.status === "Unread").length;
  const conversionRateForSelected = displayLeads.length > 0 ? Math.round((convertedForSelected / displayLeads.length) * 100) : 0;

  const handleLeadStatusChange = async (leadId: string, newStatus: any) => {
    await updateLeadStatus(leadId, newStatus);
  };

  const handleLeadOwnerChange = async (leadId: string, ownerId: string) => {
    const targetOwner = owners.find((o) => o.id === ownerId);
    await updateLead(leadId, {
      assignedProductOwnerId: ownerId === "unassigned" || !ownerId ? null : ownerId,
      assignedProductOwner: targetOwner ? targetOwner.name : "Unassigned",
    });
  };

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      tagline,
      description,
      iconName: "Layers",
    });
    setName("");
    setSlug("");
    setTagline("");
    setDescription("");
    setIsAddModalOpen(false);
  };

  // Filtered products list
  const filteredProducts = products.filter((prod) => {
    const isCWG = (prod.slug || "").startsWith("cwg-");
    if (activeFilter === "FIFTHLAB" && isCWG) return false;
    if (activeFilter === "CWG" && !isCWG) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.tagline.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q) ||
        (prod.tags && prod.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Calculate aggregate metrics from live leads
  const totalDemosScheduled = leads.filter((l) => l.bookingDate || l.bookingTime).length;
  const totalLeadsCaptured = leads.length;
  const totalQualifiedOrConverted = leads.filter((l) => l.status === "Qualified" || l.status === "Converted").length;
  const avgConversion = totalLeadsCaptured > 0 
    ? Math.round((totalQualifiedOrConverted / totalLeadsCaptured) * 100)
    : 68;

  const selectedTheme = selectedProduct ? resolveProductTheme(selectedProduct.slug || selectedProduct.name) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left text-slate-900">
        
        {/* Header Title Bar - Compact AWS Enterprise Style */}
        <div className="bg-gradient-to-r from-[#EAF7F7]/70 via-white to-[#F0F6FF]/70 p-3.5 sm:p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10.5px] font-bold text-[#005B6E] tracking-wider uppercase">
                Enterprise Catalog
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500 font-medium">Live Bookings Telemetry</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Products &amp; Analytics
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Real-time pipeline, demo schedules, and verified attendee inquiry metrics across FifthLab &amp; CWG solutions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/demo"
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Test Demo Booking</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip - Clean Enterprise Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ecosystem Solutions</span>
            <div className="text-xl font-bold text-slate-950 flex items-baseline gap-2">
              <span>{products.length}</span>
              <span className="text-xs font-semibold text-slate-600">Active in DB</span>
            </div>
            <span className="text-[10.5px] text-slate-500 font-medium">FifthLab Core + CWG Infra</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Scheduled Demos</span>
            <div className="text-xl font-bold text-slate-950 flex items-baseline gap-2">
              <span>{totalDemosScheduled}</span>
              <span className="text-xs font-semibold text-slate-600">active bookings</span>
            </div>
            <span className="text-[10.5px] text-slate-500 font-medium">Max 11 executive bookings</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Prospect Inquiries</span>
            <div className="text-xl font-bold text-slate-950 flex items-baseline gap-2">
              <span>{totalLeadsCaptured}</span>
              <span className="text-xs font-semibold text-slate-600">leads routed</span>
            </div>
            <span className="text-[10.5px] text-slate-500 font-medium">Recorded from summits &amp; demos</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Conversion Velocity</span>
            <div className="text-xl font-bold text-slate-950 flex items-baseline gap-2">
              <span>{avgConversion}%</span>
              <span className="text-xs font-semibold text-slate-600">qualified</span>
            </div>
            <span className="text-[10.5px] text-slate-500 font-medium">Qualified &amp; converted prospects</span>
          </div>
        </div>

        {/* Compact Filter & Search Toolbar (AWS Console Style) */}
        <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Compact Segmented Filter Tabs - Image 1 Design */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={cn(
                "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                activeFilter === "ALL"
                  ? "bg-slate-950 text-white font-bold shadow-xs"
                  : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
              )}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setActiveFilter("FIFTHLAB")}
              className={cn(
                "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                activeFilter === "FIFTHLAB"
                  ? "bg-slate-950 text-white font-bold shadow-xs"
                  : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
              )}
            >
              FifthLab ({products.filter((p) => !(p.slug || "").startsWith("cwg-")).length})
            </button>
            <button
              onClick={() => setActiveFilter("CWG")}
              className={cn(
                "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                activeFilter === "CWG"
                  ? "bg-slate-950 text-white font-bold shadow-xs"
                  : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
              )}
            >
              CWG Infra ({products.filter((p) => (p.slug || "").startsWith("cwg-")).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions..."
              className="w-full h-8 pl-8 pr-2.5 rounded-md border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#005B6E] transition-all font-medium"
            />
          </div>
        </div>

        {/* Product Catalog Grid - Matching Homepage Nav Cards Style & Authentic Colors */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Enterprise Solutions ({filteredProducts.length})</span>
            <span className="text-[11px] text-slate-500 font-medium">Click any card to inspect bookings &amp; customer roster</span>
          </div>

          {isLoading ? (
            <CardGridSkeleton count={6} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <Layers className="w-8 h-8 text-slate-400 mx-auto stroke-1" />
              <p className="text-sm font-semibold text-slate-700">No matching products found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query or active filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredProducts.map((prod) => {
                const theme = resolveProductTheme(prod.slug || prod.name);
                const isCWG = (prod.slug || "").startsWith("cwg-");
                
                // Real-time matched leads from global state
                const matchingLeads = leads.filter((l) => {
                  const interest = (l.productInterested || "").toLowerCase();
                  const pSlug = (prod.slug || "").toLowerCase();
                  const pName = (prod.name || "").toLowerCase();
                  return (
                    interest.includes(pSlug) ||
                    pSlug.includes(interest) ||
                    interest.includes(pName) ||
                    pName.includes(interest)
                  );
                });
                const liveLeadCount = matchingLeads.length > 0 ? matchingLeads.length : (prod.leadsCount || 0);
                const liveDemoCount = matchingLeads.length > 0 
                  ? matchingLeads.filter((l) => l.bookingDate || l.bookingTime).length 
                  : (prod.activeDemosThisMonth || 0);

                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: theme.cardBorder,
                    }}
                    className="group relative rounded-xl p-4 sm:p-4.5 flex flex-col justify-between gap-3 border shadow-none hover:shadow-xs transition-all duration-200 cursor-pointer text-left select-none"
                  >
                    <div className="space-y-2.5">
                      {/* Top Row: Clean Authentic Logo + Arrow Button */}
                      <div className="flex items-center justify-between gap-3 min-h-[40px]">
                        <div className="flex items-center justify-start shrink-0">
                          <img
                            src={resolveProductLogo(prod.slug || prod.name, prod.logoUrl)}
                            alt={prod.name}
                            className="h-9 sm:h-10 w-auto max-w-[150px] object-contain object-left shrink-0 transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/brand/bulkwave-icon.png";
                            }}
                          />
                        </div>

                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-white/90 border border-black/[0.08] text-slate-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all duration-200 shadow-2xs">
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      {/* Name & Tagline */}
                      <div className="space-y-0.5">
                        <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-950 group-hover:text-slate-900 transition-colors">
                          {prod.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                          {prod.tagline}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {prod.description}
                      </p>
                    </div>

                    {/* Bottom Metrics Row - Spacious and clean without Inspect button */}
                    <div className="pt-2.5 border-t border-black/[0.06] grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Scheduled Demos
                        </span>
                        <div 
                          className="font-bold flex items-center gap-1.5 text-xs text-slate-950"
                        >
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-[#005B6E]" />
                          <span>{liveDemoCount} Bookings</span>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Total Leads
                        </span>
                        <div className="font-bold text-slate-950 flex items-center justify-end gap-1.5 text-xs">
                          <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{liveLeadCount} Inquiries</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Individual Product Analytics & Customer Roster Modal ─────────── */}
        {selectedProduct && selectedTheme && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-7 lg:p-8 space-y-6 text-left max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Authentic Product Brand Styling */}
              <div 
                style={{ 
                  backgroundColor: selectedTheme.bgColor,
                  borderColor: selectedTheme.cardBorder 
                }}
                className="p-5 rounded-2xl border flex items-start justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/90 border border-black/[0.06] p-2 flex items-center justify-center shrink-0 shadow-2xs">
                    <img
                      src={resolveProductLogo(selectedProduct.slug || selectedProduct.name, selectedProduct.logoUrl)}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/brand/bulkwave-icon.png";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                      {selectedProduct.name}
                    </h2>
                    <p 
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: selectedTheme.accentColor }}
                    >
                      {selectedProduct.tagline}
                    </p>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Database ID: /{selectedProduct.slug}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complete Booking Analytics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#EAF7F7] border border-[#CEEFEF] space-y-1">
                  <span className="text-[10px] font-bold text-[#007A94] uppercase tracking-wider">Booked Demos</span>
                  <div className="text-2xl font-bold text-[#0090AD]">
                    {totalDemosForSelected}
                  </div>
                  <span className="text-[11px] text-slate-600">Scheduled slots (max 11)</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0F6FF] border border-[#D8E6FA] space-y-1">
                  <span className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider">Total Inquiries</span>
                  <div className="text-2xl font-bold text-slate-950">
                    {displayLeads.length}
                  </div>
                  <span className="text-[11px] text-slate-600">Executive customers</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1">
                  <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider">Conversion Rate</span>
                  <div className="text-2xl font-bold text-emerald-700">
                    {conversionRateForSelected}%
                  </div>
                  <span className="text-[11px] text-slate-600">{convertedForSelected} qualified / converted</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1">
                  <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider">Active Pipeline</span>
                  <div className="text-2xl font-bold text-amber-700">
                    {followedUpForSelected + unreadForSelected}
                  </div>
                  <span className="text-[11px] text-slate-600">{unreadForSelected} unread inquiries</span>
                </div>
              </div>

              {/* Product Overview Brief */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solution Overview</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Active Booking Windows */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Demo Booking Windows</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.availableSlots.map((slot) => (
                    <span
                      key={slot}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      <Clock className="w-3 h-3 text-[#0090AD]" />
                      <span>{slot}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Customer Bookings Roster & Table */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Customer Bookings &amp; Inquiries ({displayLeads.length})</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      All verified corporate prospects requesting a demo walkthrough for {selectedProduct.name}.
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/leads?search=${encodeURIComponent(selectedProduct.name)}`}
                    className="text-xs font-semibold text-[#005B6E] hover:underline flex items-center gap-1 group whitespace-nowrap"
                  >
                    <span>View in Leads CRM Table</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Sub-filter Tabs for Modal - Image 1 Design */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setModalLeadFilter("ALL")}
                    className={cn(
                      "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                      modalLeadFilter === "ALL"
                        ? "bg-slate-950 text-white font-bold shadow-xs"
                        : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                    )}
                  >
                    All Contacts ({displayLeads.length})
                  </button>
                  <button
                    onClick={() => setModalLeadFilter("BOOKINGS")}
                    className={cn(
                      "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                      modalLeadFilter === "BOOKINGS"
                        ? "bg-slate-950 text-white font-bold shadow-xs"
                        : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                    )}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Confirmed Bookings ({bookedLeadsForSelected.length})</span>
                  </button>
                  <button
                    onClick={() => setModalLeadFilter("INBOUND")}
                    className={cn(
                      "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                      modalLeadFilter === "INBOUND"
                        ? "bg-slate-950 text-white font-bold shadow-xs"
                        : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                    )}
                  >
                    Inbound Inquiries ({inboundLeadsForSelected.length})
                  </button>
                </div>

                {visibleModalLeads.length > 0 ? (
                  <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-none">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-300 bg-slate-100/90 text-slate-800 uppercase tracking-wider text-[10px] font-bold">
                            <th className="py-2.5 px-3">Customer &amp; Contact</th>
                            <th className="py-2.5 px-3">Company / Bank</th>
                            <th className="py-2.5 px-3">Scheduled Demo</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Assigned Specialist</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {visibleModalLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                              {/* Customer Contact */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0 uppercase">
                                    {lead.visitorName ? lead.visitorName.slice(0, 2) : "CU"}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-950 truncate max-w-[150px]">
                                      {lead.visitorName}
                                    </div>
                                    <div className="text-[10.5px] text-slate-600 truncate max-w-[150px]">
                                      {lead.email}
                                    </div>
                                    {lead.phone && (
                                      <div className="text-[10px] text-slate-500 font-mono">
                                        {lead.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Company */}
                              <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                                {lead.company || "Enterprise Corp"}
                              </td>

                              {/* Scheduled Demo Time */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                {lead.bookingDate || lead.bookingTime ? (
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-950">
                                      <Calendar className="w-3.5 h-3.5 text-[#005B6E] shrink-0" />
                                      <span>{lead.bookingDate || "Date Pending"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10.5px] text-slate-600 font-medium">
                                      <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                                      <span>{lead.bookingTime || "Time Pending"}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[11px] font-medium text-slate-500 italic flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                    Inbound (Unscheduled)
                                  </span>
                                )}
                              </td>

                              {/* Status Dropdown with indicator dot */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span className={cn(
                                    "w-2 h-2 rounded-full shrink-0",
                                    lead.status === "Unread" && "bg-slate-400",
                                    lead.status === "Followed Up" && "bg-amber-500",
                                    lead.status === "Qualified" && "bg-[#005B6E]",
                                    lead.status === "Converted" && "bg-emerald-600",
                                    lead.status === "Closed" && "bg-slate-500"
                                  )} />
                                  <select
                                    value={lead.status}
                                    onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as any)}
                                    className="text-[10.5px] font-bold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:border-[#005B6E] focus:outline-none cursor-pointer h-6.5"
                                  >
                                    <option value="Unread">Unread</option>
                                    <option value="Followed Up">Followed Up</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                </div>
                              </td>

                              {/* Handled / Assigned By Dropdown */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <select
                                  value={lead.assignedProductOwnerId || "unassigned"}
                                  onChange={(e) => handleLeadOwnerChange(lead.id, e.target.value)}
                                  className="text-[10.5px] font-semibold text-slate-800 bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:border-[#005B6E] focus:outline-none cursor-pointer h-6.5"
                                >
                                  <option value="unassigned">Unassigned</option>
                                  {owners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                      {owner.name} ({owner.role})
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        No demo signups for {selectedProduct.name} yet
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        When attendees or prospective clients schedule a walkthrough for this product, their details and assigned handlers will appear here in real time.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  FifthEvents Database Connected • Real-Time Synchronization Active
                </span>

                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/demo?product=${selectedProduct.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-bold shadow-xs hover:scale-105 transition-all"
                  >
                    <span>Launch Booking Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 space-y-5 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-[#111827]">Add Product to Catalog</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KuleanPay Multi-Rail Gateway"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-hidden focus:border-[#0090AD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Tagline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unified Cross-Border Settlement"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-hidden focus:border-[#0090AD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter strategic capabilities and enterprise target persona..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-hidden focus:border-[#0090AD] resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0090AD] hover:bg-[#007A94] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Publish Solution
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
