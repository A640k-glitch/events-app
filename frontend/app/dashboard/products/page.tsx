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
  Sparkles,
  Search,
  Filter,
  BarChart3,
  Mail,
  Building,
  Phone
} from "lucide-react";
import { CardGridSkeleton } from "@/components/ui/SkeletonLoaders";
import { FifthLabProduct } from "@/lib/types";
import { resolveProductLogo } from "@/lib/products-data";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const { products, addProduct, isLoading } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FifthLabProduct | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "FIFTHLAB" | "CWG">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Calculate high-level aggregate analytics
  const totalDemosScheduled = products.reduce((acc, p) => acc + (p.activeDemosThisMonth || 0), 0);
  const totalLeadsCaptured = products.reduce((acc, p) => acc + (p.leadsCount || 0), 0);
  const avgConversion = products.length > 0 
    ? Math.round(products.reduce((acc, p) => acc + (p.conversionRate || 65), 0) / products.length)
    : 65;

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left text-slate-900">
        
        {/* Header Title Bar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F8FB] text-[#00829B] border border-[#CEEFEF]">
                Ecosystem Catalog
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Products & Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real-time pipeline, demo schedules, and attendee inquiry metrics across FifthLab & CWG solutions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Test Demo Booking</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs font-bold shadow-md shadow-[#0090AD]/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ecosystem Solutions</span>
            <div className="text-2xl font-bold text-slate-950 flex items-baseline gap-2">
              <span>{products.length}</span>
              <span className="text-xs font-semibold text-emerald-600 font-sans">Active in DB</span>
            </div>
            <span className="text-[11px] text-slate-400">FifthLab Core + CWG Infrastructure</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Demos Scheduled</span>
            <div className="text-2xl font-bold text-[#0090AD] flex items-baseline gap-2">
              <span>{totalDemosScheduled}</span>
              <span className="text-xs font-semibold text-slate-400 font-sans">this month</span>
            </div>
            <span className="text-[11px] text-slate-400">Aggregated executive bookings</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prospect Inquiries</span>
            <div className="text-2xl font-bold text-slate-950 flex items-baseline gap-2">
              <span>{totalLeadsCaptured}</span>
              <span className="text-xs font-semibold text-cyan-600 font-sans">leads routed</span>
            </div>
            <span className="text-[11px] text-slate-400">Recorded from summits & portal</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Conversion Benchmark</span>
            <div className="text-2xl font-bold text-emerald-600 flex items-baseline gap-2">
              <span>{avgConversion}%</span>
              <span className="text-xs font-semibold text-slate-400 font-sans">qualified</span>
            </div>
            <span className="text-[11px] text-slate-400">Lead qualification velocity</span>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={cn(
                "flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeFilter === "ALL"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              All Solutions ({products.length})
            </button>
            <button
              onClick={() => setActiveFilter("FIFTHLAB")}
              className={cn(
                "flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeFilter === "FIFTHLAB"
                  ? "bg-white text-[#0090AD] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              FifthLab Core ({products.filter((p) => !(p.slug || "").startsWith("cwg-")).length})
            </button>
            <button
              onClick={() => setActiveFilter("CWG")}
              className={cn(
                "flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeFilter === "CWG"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              CWG Infrastructure ({products.filter((p) => (p.slug || "").startsWith("cwg-")).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or tags..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#0090AD] transition-all"
            />
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Enterprise Solutions ({filteredProducts.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Click any product to inspect data & leads</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => {
                const isCWG = (prod.slug || "").startsWith("cwg-");
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="group rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs hover:border-[#0090AD]/50 hover:shadow-md transition-all text-left cursor-pointer relative overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top Row: Logo, Title, Tagline, and Ecosystem Tag */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                            <img
                              src={resolveProductLogo(prod.slug || prod.name, prod.logoUrl)}
                              alt={prod.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/brand/bulkwave-icon.png";
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-slate-950 leading-snug group-hover:text-[#0090AD] transition-colors">
                                {prod.name}
                              </h3>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                              {prod.tagline}
                            </span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight uppercase shrink-0 border",
                            isCWG
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-[#E6F8FB] text-[#00829B] border-[#CEEFEF]"
                          )}
                        >
                          {isCWG ? "CWG Infra" : "FifthLab"}
                        </span>
                      </div>

                      {/* Brief */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {prod.description}
                      </p>

                      {/* Tags */}
                      {prod.tags && prod.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {prod.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Metrics Bar */}
                    <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Scheduled Demos</span>
                        <div className="font-bold text-[#0090AD] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{prod.activeDemosThisMonth} Bookings</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Leads</span>
                          <div className="font-bold text-slate-900 flex items-center justify-end gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{prod.leadsCount || 0}</span>
                          </div>
                        </div>

                        <span className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#0090AD] group-hover:text-white transition-all shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Individual Product Analytics & Telemetry Modal / Drawer ─────── */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6 text-left max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2.5 flex items-center justify-center shrink-0 shadow-xs">
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
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-950">
                        {selectedProduct.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Live Solution
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#0090AD] mt-0.5">
                      {selectedProduct.tagline}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Slug: /{selectedProduct.slug}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* KPI Performance Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly Demos</span>
                  <div className="text-xl font-bold text-[#0090AD]">
                    {selectedProduct.activeDemosThisMonth}
                  </div>
                  <span className="text-[10.5px] text-slate-400">Scheduled Slots</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Total Leads</span>
                  <div className="text-xl font-bold text-slate-950">
                    {selectedProduct.leadsCount || 0}
                  </div>
                  <span className="text-[10.5px] text-slate-400">Prospect Inquiries</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Conversion</span>
                  <div className="text-xl font-bold text-emerald-600">
                    {selectedProduct.conversionRate || 65}%
                  </div>
                  <span className="text-[10.5px] text-slate-400">Pipeline Velocity</span>
                </div>
              </div>

              {/* Product Brief Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solution Overview</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Available Time Slots */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Demo Booking Windows</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.availableSlots.map((slot) => (
                    <span
                      key={slot}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-50/70 border border-cyan-200/80 text-[#00829B] text-xs font-semibold"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{slot}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Ingested Leads Telemetry for this product */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Recent Captured Leads ({selectedProduct.recentLeads?.length || 0})
                  </h4>
                  <Link
                    href="/dashboard/leads"
                    className="text-xs font-bold text-[#0090AD] hover:underline"
                  >
                    View in Leads Table →
                  </Link>
                </div>

                {selectedProduct.recentLeads && selectedProduct.recentLeads.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProduct.recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{lead.visitorName}</span>
                            <span className="text-[10.5px] text-slate-500 font-medium">({lead.company})</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </span>
                            {lead.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {lead.phone}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 self-start sm:self-auto">
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
                    No individual leads captured for this product yet at recent summits.
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  FifthLab Platform Data Service
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
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
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
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
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
