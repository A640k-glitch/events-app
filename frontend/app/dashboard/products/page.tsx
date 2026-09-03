"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Plus, X, Layers } from "lucide-react";

export default function ProductsPage() {
  const { products, addProduct } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left text-slate-900">
        
        {/* Header Title Bar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-slate-900">
              Products & Demos
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage products showcased at summits and assign team specialists to handle live demo requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs font-bold shadow-md shadow-[#0090AD]/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            Active Solutions ({products.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Layers className="w-6 h-6 text-[#0090AD] stroke-[1.75] shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{prod.name}</h3>
                      <span className="text-xs text-[#0090AD] font-semibold">{prod.tagline}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{prod.description}</p>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Specialist: <strong className="text-slate-900 font-semibold">{prod.ownerName || "Product Specialist"}</strong></span>
                  <span className="text-[#0090AD] font-mono font-semibold">{prod.activeDemosThisMonth} Demos Scheduled</span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                <h3 className="text-base font-bold text-[#111827]">Add New Product Solution</h3>
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
                    placeholder="e.g. KuleanPay Rail Gateway"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
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
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD]"
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
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#111827] focus:outline-none focus:border-[#0090AD] resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0090AD] hover:bg-[#007A94] text-white rounded-xl text-xs font-semibold shadow-xs"
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
