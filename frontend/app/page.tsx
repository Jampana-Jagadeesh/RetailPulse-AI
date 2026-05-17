"use client";
import { useApi } from "@/lib/useApi";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import KpiCard from "@/components/ui/KpiCard";
import ChartCard from "@/components/ui/ChartCard";
import InsightCard from "@/components/ui/InsightCard";
import { RevenueAreaChart, SegmentDonut, TopProductsBar, WeekdayBar } from "@/components/charts/Charts";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { fmtCurrency, fmt } from "@/lib/utils";
import { DollarSign, Users, ShoppingCart, TrendingUp, Package, Globe } from "lucide-react";

export default function DashboardPage() {
  const { data: kpis }     = useApi(api.kpis);
  const { data: trend }    = useApi(api.revenueTrend);
  const { data: products } = useApi(() => api.topProducts(8));
  const { data: segments } = useApi(api.segments);
  const { data: weekday }  = useApi(api.weekdayRevenue);
  const { data: insights, loading } = useApi(api.insights);

  if (loading && !kpis) return (
    <div>
      <Header title="Dashboard — RetailPulse AI" subtitle="AI-Powered Retail Revenue Optimization Platform · Real-time Intelligence Overview" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_,i) => <div key={i} className="h-32 animate-pulse bg-slate-800 rounded-2xl" />)}
        </div>
        <PageSkeleton />
      </div>
    </div>
  );

  return (
    <div>
      <Header title="Dashboard — RetailPulse AI" subtitle="AI-Powered Retail Revenue Optimization Platform · Real-time Intelligence Overview" />
      <div className="p-6 space-y-6">

        {/* KPI Cards — Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <KpiCard label="Total Revenue" value={kpis ? fmtCurrency(kpis.total_revenue) : "—"}
            trend={kpis?.revenue_growth_pct}
            icon={<DollarSign size={20} className="text-violet-300" />} gradient="#7c3aed" delay={0} />
          <KpiCard label="Forecasted Revenue" value={kpis ? fmtCurrency(kpis.forecasted_revenue) : "—"}
            sub="Next 30 days projected"
            icon={<TrendingUp size={20} className="text-cyan-300" />} gradient="#06b6d4" delay={0.05} />
          <KpiCard label="Active Customers" value={kpis ? fmt(kpis.total_customers) : "—"}
            icon={<Users size={20} className="text-emerald-300" />} gradient="#10b981" delay={0.1} />
        </div>

        {/* KPI Cards — Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <KpiCard label="Avg Order Value" value={kpis ? fmtCurrency(kpis.avg_order_value) : "—"}
            icon={<ShoppingCart size={20} className="text-amber-300" />} gradient="#f59e0b" delay={0.15} />
          <KpiCard label="Total Products" value={kpis ? fmt(kpis.total_products) : "—"}
            icon={<Package size={20} className="text-pink-300" />} gradient="#ec4899" delay={0.2} />
          <KpiCard label="Countries Served" value={kpis ? String(kpis.total_countries) : "—"}
            icon={<Globe size={20} className="text-indigo-300" />} gradient="#6366f1" delay={0.25} />
        </div>

        {/* Revenue + Segments */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ChartCard title="Revenue Trend" subtitle="Monthly revenue performance" delay={0.1} accent="#7c3aed">
              {trend ? <RevenueAreaChart data={trend} /> : <div className="h-64 animate-pulse bg-slate-800 rounded-xl" />}
            </ChartCard>
          </div>
          <ChartCard title="Customer Segments" subtitle="Revenue by RFM segment" delay={0.15} accent="#22c55e">
            {segments ? <SegmentDonut data={segments} /> : <div className="h-64 animate-pulse bg-slate-800 rounded-xl" />}
          </ChartCard>
        </div>

        {/* Products + Weekday */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ChartCard title="Top Products" subtitle="Highest revenue-generating products" delay={0.2} accent="#f59e0b">
              {products ? <TopProductsBar data={products} /> : <div className="h-64 animate-pulse bg-slate-800 rounded-xl" />}
            </ChartCard>
          </div>
          <ChartCard title="Revenue by Weekday" subtitle="Peak sales day analysis" delay={0.25} accent="#06b6d4">
            {weekday ? <WeekdayBar data={weekday} /> : <div className="h-52 animate-pulse bg-slate-800 rounded-xl" />}
          </ChartCard>
        </div>

        {/* AI Insights */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>🤖</div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Insights Engine</h2>
              <p className="text-xs text-slate-500">Automated intelligence from your retail data</p>
            </div>
            {insights && (
              <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
                {insights.length} insights active
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {insights
              ? insights.map((ins, i) => <InsightCard key={i} insight={ins} delay={i * 0.07} />)
              : [...Array(3)].map((_, i) => <div key={i} className="h-24 animate-pulse bg-slate-800 rounded-2xl" />)
            }
          </div>
        </div>

        {/* Status bar + Credits */}
        <div className="glass px-5 py-5 space-y-4">

          {/* Status row — centered */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { label: "ML Models",         value: "Active",  color: "#22c55e" },
              { label: "Data Pipeline",     value: "Live",    color: "#22c55e" },
              { label: "Forecast Engine",   value: "Running", color: "#06b6d4" },
              { label: "Recommendation AI", value: "Ready",   color: "#a78bfa" },
              { label: "Last Updated",      value: "Just now",color: "#64748b" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                <span className="text-xs text-slate-500">{s.label}:</span>
                <span className="text-xs font-semibold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: "rgba(148,163,184,0.08)" }} />

          {/* Credits — all centered */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[11px] text-slate-500">
              Built with <span className="text-slate-300">Python • scikit-learn • Streamlit • pandas • numpy</span>
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a href="mailto:jagadeeshjampana5@gmail.com"
                className="text-[11px] text-slate-400 hover:text-white transition-colors">
                📧 jagadeeshjampana5@gmail.com
              </a>
              <a href="https://github.com/Jampana-Jagadeesh" target="_blank" rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-white transition-colors">
                🐙 github.com/Jampana-Jagadeesh
              </a>
              <a href="https://linkedin.com/in/jampana-jagadeesh-9704002a2/" target="_blank" rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-white transition-colors">
                💼 linkedin.com/in/jampana-jagadeesh-9704002a2
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              © 2026 <span className="text-white font-semibold">Jagadeesh Jampana</span> — All Rights Reserved
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
