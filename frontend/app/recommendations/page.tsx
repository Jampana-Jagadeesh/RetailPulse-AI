"use client";
import { useApi } from "@/lib/useApi";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import ChartCard from "@/components/ui/ChartCard";
import KpiCard from "@/components/ui/KpiCard";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Sparkles, Link2, TrendingUp, Zap } from "lucide-react";

export default function RecommendationsPage() {
  const { data: kpis,  loading } = useApi(api.recKpis);
  const { data: rules }          = useApi(api.rules);

  if (loading && !kpis) return (
    <div>
      <Header title="Recommendation Engine — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · Association Rule Mining & Cross-Sell Intelligence" />
      <div className="p-6"><PageSkeleton /></div>
    </div>
  );

  return (
    <div>
      <Header title="Recommendation Engine — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · Association Rule Mining & Cross-Sell Intelligence" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Rules Discovered" value={kpis ? String(kpis.rules_count) : "—"}
            icon={<Link2 size={18} className="text-violet-400" />} gradient="#7c3aed" />
          <KpiCard label="Avg Confidence"   value={kpis ? `${(kpis.avg_confidence * 100).toFixed(1)}%` : "—"}
            icon={<Sparkles size={18} className="text-cyan-400" />} gradient="#06b6d4" delay={0.05} />
          <KpiCard label="Avg Lift"         value={kpis ? `${kpis.avg_lift}x` : "—"}
            icon={<TrendingUp size={18} className="text-emerald-400" />} gradient="#22c55e" delay={0.1} />
          <KpiCard label="Max Lift"         value={kpis ? `${kpis.max_lift}x` : "—"}
            icon={<Zap size={18} className="text-amber-400" />} gradient="#f59e0b" delay={0.15} />
        </div>

        {/* How it works */}
        <div className="glass p-5">
          <h3 className="text-sm font-bold text-white mb-3">How the Recommendation Engine Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Transaction Mining",   desc: "Apriori algorithm scans all UK purchase transactions to find frequent itemsets." },
              { step: "02", title: "Rule Generation",      desc: "Association rules generated with support, confidence, and lift metrics." },
              { step: "03", title: "Cross-sell Targeting", desc: "High-lift rules identify the best product pairs for cross-selling campaigns." },
            ].map(s => (
              <div key={s.step} className="p-4 rounded-xl"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <span className="text-xs font-bold text-violet-500">STEP {s.step}</span>
                <p className="text-sm font-bold text-white mt-1">{s.title}</p>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <ChartCard title="Association Rules" subtitle="Product pairs with highest cross-sell potential" delay={0.15}>
          {!rules ? (
            <div className="h-40 animate-pulse bg-slate-800 rounded-xl" />
          ) : rules.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">No rules generated.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
                    {["If Customer Buys","Then Recommend","Support","Confidence","Lift","Strength"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rules.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-white/[0.025] transition-colors"
                      style={{ borderColor: "rgba(148,163,184,0.05)" }}>
                      <td className="py-3 px-4 text-slate-300 max-w-[160px] text-xs truncate">{r.antecedents}</td>
                      <td className="py-3 px-4 text-cyan-400 max-w-[160px] text-xs truncate">→ {r.consequents}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{(r.support * 100).toFixed(2)}%</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold text-xs">{(r.confidence * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-amber-400 font-bold text-xs">{r.lift.toFixed(2)}x</td>
                      <td className="py-3 px-4">
                        <div className="w-20 h-1.5 rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-violet-500"
                            style={{ width: `${Math.min(r.lift / 5 * 100, 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

      </div>
    </div>
  );
}
