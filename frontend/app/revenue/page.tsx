import Header from "@/components/layout/Header";
import ChartCard from "@/components/ui/ChartCard";
import KpiCard from "@/components/ui/KpiCard";
import {
  RevenueGrowthChart, CountryHBar, TopProductsBar, HourlyRevenueChart,
} from "@/components/charts/Charts";
import { api } from "@/lib/api";
import { fmtCurrency, fmt } from "@/lib/utils";
import { DollarSign, TrendingUp, ShoppingCart, Globe, Clock } from "lucide-react";

export default async function RevenuePage() {
  const [kpis, trend, products, countries, hourly] = await Promise.all([
    api.kpis(), api.revenueTrend(), api.topProducts(10),
    api.countryRevenue(), api.hourlyRevenue(),
  ]);

  const last = trend.at(-1);
  const prev = trend.at(-2);
  const growth = prev && last ? ((last.revenue - prev.revenue) / prev.revenue * 100) : 0;

  return (
    <div>
      <Header title="Revenue Analytics — RetailPulse AI" subtitle="Retail Revenue Optimization Platform · Sales Performance, Trends & Market Analysis" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          <KpiCard label="Total Revenue" value={fmtCurrency(kpis.total_revenue)}
            trend={kpis.revenue_growth_pct} compact
            icon={<DollarSign size={14} className="text-violet-400" />} gradient="#7c3aed" />
          <KpiCard label="Monthly Growth" value={`${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`}
            trend={growth} compact
            icon={<TrendingUp size={14} className="text-emerald-400" />} gradient="#22c55e" delay={0.05} />
          <KpiCard label="Total Orders" value={fmt(kpis.total_orders)} compact
            icon={<ShoppingCart size={14} className="text-cyan-400" />} gradient="#06b6d4" delay={0.1} />
          <KpiCard label="Avg Order Value" value={fmtCurrency(kpis.avg_order_value)} compact
            icon={<DollarSign size={14} className="text-amber-400" />} gradient="#f59e0b" delay={0.15} />
          <KpiCard label="Markets" value={String(kpis.total_countries)} compact
            icon={<Globe size={14} className="text-indigo-400" />} gradient="#6366f1" delay={0.2} />
        </div>

        <ChartCard title="Revenue & Growth Trend" subtitle="Monthly revenue with MoM growth rate overlay" delay={0.1}>
          <RevenueGrowthChart data={trend} />
        </ChartCard>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ChartCard title="Top 10 Products" subtitle="By total revenue contribution" delay={0.15}>
            <TopProductsBar data={products} />
          </ChartCard>
          <ChartCard title="Revenue by Country" subtitle="Top 12 markets — horizontal view" delay={0.2}>
            <CountryHBar data={countries} />
          </ChartCard>
        </div>

        <ChartCard title="Revenue by Hour of Day" subtitle="Peak shopping hours analysis — all markets combined" delay={0.25}>
          <HourlyRevenueChart data={hourly} />
        </ChartCard>

        <ChartCard title="Monthly Revenue Breakdown" subtitle="Detailed month-by-month analysis" delay={0.3}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
                  {["Month", "Revenue", "MoM Growth", "Est. Orders", "Avg Order Value"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trend.slice(-12).reverse().map((row, i) => {
                  const estOrders = Math.round(row.revenue / kpis.avg_order_value);
                  return (
                    <tr key={i} className="border-b transition-colors hover:bg-white/[0.025]"
                      style={{ borderColor: "rgba(148,163,184,0.05)" }}>
                      <td className="py-3 px-4 text-slate-300 font-medium">{row.month}</td>
                      <td className="py-3 px-4 text-white font-bold">{fmtCurrency(row.revenue)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          row.growth >= 0
                            ? "text-emerald-400 bg-emerald-400/10"
                            : "text-red-400 bg-red-400/10"
                        }`}>
                          {row.growth >= 0 ? "▲" : "▼"} {Math.abs(row.growth).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{fmt(estOrders)}</td>
                      <td className="py-3 px-4 text-slate-400">{fmtCurrency(kpis.avg_order_value)}</td>
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
