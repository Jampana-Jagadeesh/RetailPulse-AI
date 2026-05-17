"use client";
import { useApi } from "@/lib/useApi";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import ChartCard from "@/components/ui/ChartCard";
import KpiCard from "@/components/ui/KpiCard";
import { InventoryPie } from "@/components/charts/Charts";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { fmtCurrency, fmt } from "@/lib/utils";
import { Package, TrendingDown, AlertTriangle, Activity } from "lucide-react";

const STATUS: Record<string, { bg: string; color: string; icon: string }> = {
  "Fast Moving":     { bg: "rgba(34,197,94,0.12)",  color: "#22c55e", icon: "🚀" },
  "Slow Moving":     { bg: "rgba(234,179,8,0.12)",   color: "#eab308", icon: "🐢" },
  "Dead Stock Risk": { bg: "rgba(239,68,68,0.12)",   color: "#ef4444", icon: "⚠️" },
};

export default function InventoryPage() {
  const { data: kpis,      loading } = useApi(api.inventoryKpis);
  const { data: products }           = useApi(api.inventoryProducts);
  const { data: breakdown }          = useApi(api.inventoryBreakdown);

  if (loading && !kpis) return (
    <div>
      <Header title="Inventory Intelligence — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · AI-Powered Stock Risk Analysis & Demand Classification" />
      <div className="p-6"><PageSkeleton /></div>
    </div>
  );

  const pieData = breakdown?.map(b => ({ Status: b.Status, count: b.count, revenue: b.revenue })) ?? [];

  return (
    <div>
      <Header title="Inventory Intelligence — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · AI-Powered Stock Risk Analysis & Demand Classification" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Inventory Health" value={kpis ? `${kpis.health_score}%` : "—"}
            sub="Fast-moving ratio" icon={<Activity size={18} className="text-emerald-400" />} gradient="#22c55e" />
          <KpiCard label="Fast Moving"      value={kpis ? fmt(kpis.fast_moving) : "—"}
            icon={<Package size={18} className="text-cyan-400" />} gradient="#06b6d4" delay={0.05} />
          <KpiCard label="Slow Moving"      value={kpis ? fmt(kpis.slow_moving) : "—"}
            icon={<TrendingDown size={18} className="text-amber-400" />} gradient="#f59e0b" delay={0.1} />
          <KpiCard label="Dead Stock Risk"  value={kpis ? fmt(kpis.dead_stock) : "—"}
            sub="Needs attention" icon={<AlertTriangle size={18} className="text-red-400" />} gradient="#ef4444" delay={0.15} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ChartCard title="Status Distribution" subtitle="Products by movement classification" delay={0.1}>
            {pieData.length > 0 ? <InventoryPie data={pieData} /> : <div className="h-60 animate-pulse bg-slate-800 rounded-xl" />}
          </ChartCard>

          <div className="xl:col-span-2 grid grid-cols-1 gap-4">
            {breakdown?.map((b, i) => {
              const s = STATUS[b.Status] ?? { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", icon: "📦" };
              const pct = kpis ? (b.count / kpis.total_products * 100).toFixed(1) : "0";
              return (
                <div key={i} className="glass p-5" style={{ borderLeft: `3px solid ${s.color}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span className="text-sm font-bold text-white">{b.Status}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: s.bg, color: s.color }}>{pct}%</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{b.count.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-500">Total Revenue</p>
                      <p className="text-sm font-bold text-white">{fmtCurrency(b.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Total Qty Sold</p>
                      <p className="text-sm font-bold text-white">{fmt(b.qty)}</p>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ChartCard title="Product Inventory Table" subtitle="All products with AI risk classification" delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
                  {["SKU","Product Name","Revenue","Qty Sold","Orders","Status","Recent Activity"].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products?.map((p, i) => {
                  const s = STATUS[p.Status] ?? { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", icon: "📦" };
                  return (
                    <tr key={i} className="border-b hover:bg-white/[0.025] transition-colors"
                      style={{ borderColor: "rgba(148,163,184,0.05)" }}>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-xs">{p.StockCode}</td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-[200px] truncate text-xs">{p.Description}</td>
                      <td className="py-2.5 px-3 text-white font-bold text-xs">{fmtCurrency(p.TotalRevenue)}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-xs">{fmt(p.TotalQty)}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-xs">{p.OrderCount}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: s.bg, color: s.color }}>{s.icon} {p.Status}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-xs font-semibold ${p.RecentActivity ? "text-emerald-400" : "text-red-400"}`}>
                          {p.RecentActivity ? "✓ Active" : "✗ Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>

      </div>
    </div>
  );
}
