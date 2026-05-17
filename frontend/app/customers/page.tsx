import Header from "@/components/layout/Header";
import ChartCard from "@/components/ui/ChartCard";
import KpiCard from "@/components/ui/KpiCard";
import SegmentBadge from "@/components/ui/SegmentBadge";
import { SegmentDonut, RFMScatterChart } from "@/components/charts/Charts";
import { api } from "@/lib/api";
import { fmtCurrency, fmt } from "@/lib/utils";
import { Users, Star, AlertCircle, TrendingUp, Clock, Repeat2, Target } from "lucide-react";

export default async function CustomersPage() {
  const [kpis, segments, topCustomers, rfmData] = await Promise.all([
    api.customerKpis(), api.segments(), api.topCustomers(25), api.rfmScatter(),
  ]);

  const totalRevenue = segments.reduce((a, b) => a + b.revenue, 0);

  return (
    <div>
      <Header title="Customer Intelligence — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · RFM Segmentation, CLV Analysis & Retention Insights" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Total Customers" value={fmt(kpis.total_customers)}
            icon={<Users size={18} className="text-violet-400" />} gradient="#7c3aed" />
          <KpiCard label="Avg CLV" value={fmtCurrency(kpis.avg_clv)}
            icon={<TrendingUp size={18} className="text-cyan-400" />} gradient="#06b6d4" delay={0.05} />
          <KpiCard label="Champions" value={fmt(kpis.champions_count)}
            sub={`${kpis.champions_revenue_pct}% of revenue`}
            icon={<Star size={18} className="text-amber-400" />} gradient="#f59e0b" delay={0.1} />
          <KpiCard label="At Risk" value={fmt(kpis.at_risk_count)}
            sub="Need re-engagement"
            icon={<AlertCircle size={18} className="text-red-400" />} gradient="#ef4444" delay={0.15} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ChartCard title="Segment Revenue Share" subtitle="Revenue contribution by RFM segment" delay={0.1}>
            <SegmentDonut data={segments} />
          </ChartCard>

          <div className="xl:col-span-2">
            <ChartCard title="Segment Intelligence" subtitle="RFM-based customer group analysis" delay={0.15}>
              <div className="space-y-3">
                {segments.map((s, i) => {
                  const pct = (s.revenue / totalRevenue * 100).toFixed(1);
                  const avgClv = s.count > 0 ? s.revenue / s.count : 0;
                  return (
                    <div key={i} className="p-4 rounded-xl transition-colors hover:bg-white/[0.02]"
                      style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.06)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <SegmentBadge segment={s.segment} />
                          <span className="text-sm text-slate-400">{s.count.toLocaleString()} customers</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-sm">{fmtCurrency(s.revenue)}</p>
                          <p className="text-xs text-slate-500">{pct}% of total revenue</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : i === 2 ? "#eab308" : "#ef4444" }} />
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          Avg CLV: <span className="text-slate-300 font-semibold">{fmtCurrency(avgClv)}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* RFM Scatter */}
        <ChartCard title="RFM Scatter Analysis" subtitle="Customer distribution by Recency vs Frequency (bubble size = Monetary)" delay={0.18}>
          <RFMScatterChart data={rfmData} />
        </ChartCard>

        {/* RFM explanation */}
        <div className="glass p-5">
          <h3 className="text-sm font-bold text-white mb-3">RFM Analysis Framework</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Clock size={16} className="text-violet-400" />, label: "Recency", desc: "Days since last purchase. Lower = more engaged customer." },
              { icon: <Repeat2 size={16} className="text-cyan-400" />, label: "Frequency", desc: "Number of unique orders. Higher = more loyal customer." },
              { icon: <TrendingUp size={16} className="text-emerald-400" />, label: "Monetary", desc: "Total spend value. Higher = more valuable customer." },
            ].map(r => (
              <div key={r.label} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "rgba(148,163,184,0.04)", border: "1px solid rgba(148,163,184,0.06)" }}>
                <div className="mt-0.5">{r.icon}</div>
                <div>
                  <p className="text-sm font-bold text-white">{r.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Avg Recency", value: `${Math.round(kpis.avg_recency)} days`, icon: <Clock size={14} className="text-slate-400" />, desc: "Average days since last purchase" },
            { label: "Avg Frequency", value: `${kpis.avg_frequency.toFixed(1)} orders`, icon: <Repeat2 size={14} className="text-slate-400" />, desc: "Average orders per customer" },
            { label: "Champions Revenue", value: `${kpis.champions_revenue_pct}%`, icon: <Target size={14} className="text-slate-400" />, desc: "Revenue share from top customers" },
          ].map(item => (
            <div key={item.label} className="glass p-4">
              <div className="flex items-center gap-2 mb-2">{item.icon}<span className="text-xs text-slate-500">{item.label}</span></div>
              <p className="text-xl font-bold text-white">{item.value}</p>
              <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <ChartCard title="Top 25 Customers by CLV" subtitle="Highest predicted lifetime value customers" delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
                  {["#", "Customer ID", "Recency", "Frequency", "Monetary", "Predicted CLV", "Segment"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={i} className="border-b hover:bg-white/[0.025] transition-colors"
                    style={{ borderColor: "rgba(148,163,184,0.05)" }}>
                    <td className="py-3 px-4 text-slate-600 text-xs font-mono">{i + 1}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-xs">{c.CustomerID}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{c.Recency}d ago</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{c.Frequency} orders</td>
                    <td className="py-3 px-4 text-white font-bold text-xs">{fmtCurrency(c.Monetary)}</td>
                    <td className="py-3 px-4">
                      <span className="text-cyan-400 font-bold text-xs">{fmtCurrency(c.Predicted_CLV)}</span>
                    </td>
                    <td className="py-3 px-4"><SegmentBadge segment={c.Segment_Label} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

      </div>
    </div>
  );
}
