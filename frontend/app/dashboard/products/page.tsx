"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MOCK_PRODUCTS, MOCK_PRODUCT_OWNERS } from "@/lib/mock-data";
import { FifthLabProduct, ProductOwner } from "@/lib/types";
import { Layers, Clock, Globe, Plus, Box, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [products] = useState<FifthLabProduct[]>(MOCK_PRODUCTS);
  const [owners] = useState<ProductOwner[]>(MOCK_PRODUCT_OWNERS);

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Products & Product Owners Catalog
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                CALENDAR ROUTING
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Product catalog, assigned engineering owners, working hours, and automated timezone routing rules.
            </p>
          </div>

          <Link
            href="/demo"
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Test Public Demo Booking</span>
          </Link>
        </div>

        {/* Designated Product Owners Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white/60 uppercase tracking-wider">
            <span>Designated Product Owners ({owners.length})</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Calendar Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {owners.map((owner) => (
              <div
                key={owner.id}
                className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-4 hover:border-white/20 transition-all shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={owner.avatarUrl}
                      alt={owner.name}
                      className="w-10 h-10 rounded-full object-cover border border-blue-500/40 shadow-md"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{owner.name}</h3>
                      <p className="text-xs text-blue-400 font-medium">{owner.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Sync Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-white/50 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-400" /> Timezone
                    </span>
                    <p className="text-white font-medium">{owner.timezone}</p>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-white/50 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> Working Hours
                    </span>
                    <p className="text-emerald-400 font-medium">{owner.workingHours}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono text-white/50 uppercase">Assigned Products</span>
                  <div className="flex flex-wrap gap-1.5">
                    {owner.assignedProducts.map((p) => (
                      <span key={p} className="text-xs font-semibold text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Offerings Catalog Grid */}
        <div className="space-y-3 pt-4">
          <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Enterprise Product Offerings ({products.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-3 hover:border-white/20 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-400" />
                    <h3 className="text-base font-bold text-white">{prod.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                    {prod.tagline}
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{prod.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
