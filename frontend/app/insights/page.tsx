"use client";
import { useApi } from "@/lib/useApi";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import InsightCard from "@/components/ui/InsightCard";
import ChartCard from "@/components/ui/ChartCard";
import { RevenueAreaChart, SegmentDonut } from "@/components/charts/Charts";

export default function InsightsPage() {
  const { data: insights } = useApi(api.insights);
  const { data: trend }    = useApi(api.revenueTrend);
  const { data: segments } = useApi(api.segments);

  return (
    <div>
      <Header title="AI Insights — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · Automated Business Intelligence from Your Retail Data" />
      <div className="p-6 space-y-6">

        {/* Hero */}
        <div className="glass p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.06))",
            border: "1px solid rgba(124,58,237,0.18)" }}>
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }} />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>🤖</div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-white">AI Intelligence Engine</h2>
                {insights && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(124,58,237,0.25)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
                    {insights.length} Insights Active
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Analysis
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-2xl">
                RetailPulse AI continuously analyzes your sales data, customer behavior, inventory patterns,
                and market trends to surface actionable business intelligence in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {insights
            ? insights.map((ins, i) => <InsightCard key={i} insight={ins} delay={i * 0.07} />)
            : [...Array(5)].map((_, i) => <div key={i} className="h-24 animate-pulse bg-slate-800 rounded-2xl" />)
          }
        </div>

        {/* Supporting charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ChartCard title="Revenue Trend" subtitle="Supporting data for revenue insights" delay={0.2}>
            {trend ? <RevenueAreaChart data={trend} /> : <div className="h-64 animate-pulse bg-slate-800 rounded-xl" />}
          </ChartCard>
          <ChartCard title="Customer Segments" subtitle="Supporting data for customer insights" delay={0.25}>
            {segments ? <SegmentDonut data={segments} /> : <div className="h-64 animate-pulse bg-slate-800 rounded-xl" />}
          </ChartCard>
        </div>

        {/* How it works */}
        <div className="glass p-5">
          <h3 className="text-sm font-bold text-white mb-4">How AI Insights Are Generated</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { step:"01", icon:"📊", title:"Data Ingestion",    desc:"Raw transaction data is processed and feature-engineered." },
              { step:"02", icon:"🧠", title:"ML Analysis",       desc:"RFM clustering, CLV prediction, and trend models run on the dataset." },
              { step:"03", icon:"🔍", title:"Pattern Detection", desc:"AI identifies revenue trends, inventory risks, and customer anomalies." },
              { step:"04", icon:"💡", title:"Insight Generation",desc:"Business-readable insights surfaced with actionable recommendations." },
            ].map(s => (
              <div key={s.step} className="p-4 rounded-xl"
                style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">Step {s.step}</span>
                </div>
                <p className="text-sm font-bold text-white">{s.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
