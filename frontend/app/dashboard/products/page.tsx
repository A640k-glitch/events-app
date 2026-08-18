"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Clock, Globe, Plus, Box, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const { products, owners, addProduct } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Briefcase");

  // Only display owners who have PRODUCT_OWNER role or have products assigned
  const designatedOwners = owners.filter(
    (o) => o.role === "PRODUCT_OWNER" || (o.assignedProducts && o.assignedProducts.length > 0)
  );

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      tagline,
      description,
      iconName,
    });
    setName("");
    setSlug("");
    setTagline("");
    setDescription("");
    setIsAddModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left">
        
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-heading">
                Products & Solutions Catalog
              </h1>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                NEON POSTGRESQL LIVE
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Enterprise solution catalog, designated engineering owners, and public demo booking schedules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product Offering</span>
            </button>
          </div>
        </div>

        {/* Product Offerings Catalog Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-white/60 uppercase tracking-wider">
            <span>Enterprise Product Offerings ({products.length})</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Sync Active
            </span>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center border border-white/10 bg-black/60 backdrop-blur-xl space-y-3 text-left max-w-xl mx-auto">
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 mx-auto">
                <Box className="w-5 h-5" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-medium text-white">No Product Offerings in Database</h3>
                <p className="text-xs text-white/50 font-light">
                  Click "Add Product Offering" above to publish your first enterprise solution to Neon DB.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-3 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-base font-normal text-white font-heading">{prod.name}</h3>
                    </div>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 border border-cyan-500/30 font-light">
                      {prod.tagline}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light">{prod.description}</p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-light">
                    <span>Specialist: <strong className="text-white font-normal">{prod.ownerName}</strong></span>
                    <span className="text-cyan-400 font-mono">{prod.activeDemosThisMonth} Demos Scheduled</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Designated Product Owners Grid */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Designated Product Owners ({designatedOwners.length})
          </div>

          {designatedOwners.length === 0 ? (
            <div className="p-8 text-center border border-white/10 bg-black/60 text-white/40 text-xs font-light">
              No staff members assigned as Product Owners yet. Staff members who register as product specialists will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designatedOwners.map((owner) => (
                <div
                  key={owner.id}
                  className="border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-4 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={owner.avatarUrl}
                        alt={owner.name}
                        className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-white">{owner.name}</h3>
                        <p className="text-xs text-cyan-400 font-light">{owner.role}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/30">
                      Sync Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-light">
                    <div className="p-3 bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-white/50 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" /> Timezone
                      </span>
                      <p className="text-white font-medium">{owner.timezone}</p>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 space-y-0.5">
                      <span className="text-[10px] text-white/50 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> Working Hours
                      </span>
                      <p className="text-emerald-400 font-medium">{owner.workingHours}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1.5 font-light">
                    <span className="text-[10px] text-white/50 uppercase">Assigned Products</span>
                    <div className="flex flex-wrap gap-1.5">
                      {owner.assignedProducts.length === 0 ? (
                        <span className="text-xs text-white/40">General Specialist</span>
                      ) : (
                        owner.assignedProducts.map((p) => (
                          <span key={p} className="text-xs text-white bg-white/10 px-2.5 py-0.5 border border-white/10">
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Product Offering Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e1017] border border-white/10 p-6 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-normal text-white font-heading flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" /> Publish Product Solution
              </h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1 text-white/50 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-light">
              <div className="space-y-1.5">
                <label className="text-white/70 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bulkwave Core Payments"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 font-medium">Tagline / Subheading *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-throughput NGN Switching"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 font-medium">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline core capabilities and integration options..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white p-2.5 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-white/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold cursor-pointer shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
