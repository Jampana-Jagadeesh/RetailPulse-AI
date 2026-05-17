"use client";
import { useApi } from "@/lib/useApi";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import ChartCard from "@/components/ui/ChartCard";
import KpiCard from "@/components/ui/KpiCard";
import { ForecastChart } from "@/components/charts/Charts";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { fmtCurrency } from "@/lib/utils";
import { TrendingUp, Calendar, Zap, BarChart2 } from "lucide-react";

export default function ForecastingPage() {
  const { data: fc7,    loading } = useApi(() => api.forecast(7));
  const { data: fc30 }            = useApi(() => api.forecast(30));
  const { data: spikes }          = useApi(api.spikes);

  if (loading && !fc7) return (
    <div>
      <Header title="Sales Forecasting — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · AI-Powered Revenue Predictions & Demand Spike Detection" />
      <div className="p-6"><PageSkeleton /></div>
    </div>
  );

  return (
    <div>
      <Header title="Sales Forecasting — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · AI-Powered Revenue Predictions & Demand Spike Detection" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="7-Day Forecast"   value={fc7 ? fmtCurrency(fc7.projected_total) : "—"}
            sub="Next 7 days" icon={<Calendar size={18} className="text-violet-400" />} gradient="#7c3aed" />
          <KpiCard label="30-Day Forecast"  value={fc30 ? fmtCurrency(fc30.projected_total) : "—"}
            sub="Next 30 days" icon={<TrendingUp size={18} className="text-cyan-400" />} gradient="#06b6d4" delay={0.05} />
          <KpiCard label="Avg Daily"        value={fc30 ? fmtCurrency(fc30.avg_daily) : "—"}
            sub="Forecasted daily avg" icon={<BarChart2 size={18} className="text-emerald-400" />} gradient="#22c55e" delay={0.1} />
          <KpiCard label="Demand Spikes"    value={spikes ? String(spikes.length) : "—"}
            sub="Historical anomalies" icon={<Zap size={18} className="text-amber-400" />} gradient="#f59e0b" delay={0.15} />
        </div>

        {/* Model info */}
        <div className="glass px-5 py-4 flex items-center gap-4 flex-wrap"
          style={{ background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.15)" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-semibold text-violet-400">Forecast Model Active</span>
          </div>
          {["Linear Trend Regression","90-Day Historical Window","Daily Granularity","Auto-updated"].map(t => (
            <span key={t} className="text-xs text-slate-500 px-2.5 py-1 rounded-lg"
              style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.08)" }}>{t}</span>
          ))}
        </div>

        <ChartCard title="30-Day Revenue Forecast" subtitle="Historical revenue vs AI-predicted future revenue" delay={0.1}>
          {fc30 ? <ForecastChart historical={fc30.historical} forecast={fc30.forecast} />
                : <div className="h-72 animate-pulse bg-slate-800 rounded-xl" />}
        </ChartCard>

        <ChartCard title="7-Day Short-Term Forecast" subtitle="Near-term revenue projection" delay={0.15}>
          {fc7 ? <ForecastChart historical={fc7.historical.slice(-45)} forecast={fc7.forecast} />
               : <div className="h-72 animate-pulse bg-slate-800 rounded-xl" />}
        </ChartCard>

        {spikes && spikes.length > 0 && (
          <ChartCard title="⚡ Demand Spike Events" subtitle="AI-detected historical revenue anomalies" delay={0.2}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
                    {["Date","Revenue","Spike Above Avg","Severity","Action"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spikes.map((s, i) => {
                    const critical = s.spike_pct > 100;
                    return (
                      <tr key={i} className="border-b hover:bg-white/[0.025] transition-colors"
                        style={{ borderColor: "rgba(148,163,184,0.05)" }}>
                        <td className="py-3 px-4 text-slate-300 font-medium">{s.date}</td>
                        <td className="py-3 px-4 text-white font-bold">{fmtCurrency(s.revenue)}</td>
                        <td className="py-3 px-4 text-amber-400 font-bold">+{s.spike_pct}%</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: critical ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                              color: critical ? "#ef4444" : "#f59e0b" }}>
                            {critical ? "🔴 Critical" : "🟡 High"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {critical ? "Review inventory levels" : "Monitor stock"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ChartCard>
        )}

      </div>
    </div>
  );
}
