"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  FileBarChart, Download, FileText, Table2, Calendar,
  Mail, CheckCircle2, Clock, RefreshCw, ChevronRight,
  BarChart2, Users, Package, Sparkles, TrendingUp,
} from "lucide-react";

const REPORTS = [
  {
    id: "revenue",
    icon: <TrendingUp size={18} className="text-violet-400" />,
    title: "Revenue Analytics Report",
    desc: "Monthly revenue, growth trends, top products, and country breakdown.",
    category: "Analytics",
    frequency: "Monthly",
    lastGenerated: "2011-12-15",
    formats: ["PDF", "CSV", "Excel"],
    color: "#7c3aed",
  },
  {
    id: "forecast",
    icon: <BarChart2 size={18} className="text-cyan-400" />,
    title: "Sales Forecast Report",
    desc: "30-day revenue projections, demand spikes, and trend analysis.",
    category: "Forecasting",
    frequency: "Weekly",
    lastGenerated: "2011-12-14",
    formats: ["PDF", "CSV"],
    color: "#06b6d4",
  },
  {
    id: "customers",
    icon: <Users size={18} className="text-emerald-400" />,
    title: "Customer Intelligence Report",
    desc: "RFM segmentation, CLV predictions, and retention analysis.",
    category: "Customers",
    frequency: "Bi-weekly",
    lastGenerated: "2011-12-10",
    formats: ["PDF", "CSV", "Excel"],
    color: "#22c55e",
  },
  {
    id: "inventory",
    icon: <Package size={18} className="text-amber-400" />,
    title: "Inventory Intelligence Report",
    desc: "Stock risk classification, fast/slow movers, and dead stock alerts.",
    category: "Inventory",
    frequency: "Weekly",
    lastGenerated: "2011-12-13",
    formats: ["PDF", "CSV"],
    color: "#f59e0b",
  },
  {
    id: "recommendations",
    icon: <Sparkles size={18} className="text-pink-400" />,
    title: "Recommendation Engine Report",
    desc: "Association rules, cross-sell opportunities, and lift analysis.",
    category: "ML",
    frequency: "Monthly",
    lastGenerated: "2011-12-01",
    formats: ["PDF", "CSV"],
    color: "#ec4899",
  },
  {
    id: "executive",
    icon: <FileBarChart size={18} className="text-indigo-400" />,
    title: "Executive Summary Report",
    desc: "High-level KPIs, AI insights, and platform performance overview.",
    category: "Executive",
    frequency: "Weekly",
    lastGenerated: "2011-12-15",
    formats: ["PDF"],
    color: "#6366f1",
  },
];

const SCHEDULE = [
  { time: "Every Monday 09:00 AM", report: "Sales Forecast Report", status: "active" },
  { time: "Every Monday 09:30 AM", report: "Inventory Intelligence Report", status: "active" },
  { time: "1st of each month", report: "Revenue Analytics Report", status: "active" },
  { time: "15th of each month", report: "Customer Intelligence Report", status: "paused" },
  { time: "1st of each month", report: "Recommendation Engine Report", status: "active" },
];

const FORMAT_ICON: Record<string, string> = {
  PDF: "📄", CSV: "📊", Excel: "📋",
};

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [activeFormat, setActiveFormat] = useState<Record<string, string>>({});

  function getFormat(id: string, formats: string[]) {
    return activeFormat[id] ?? formats[0];
  }

  function handleGenerate(id: string) {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setDownloaded(prev => [...prev, id]);
      setTimeout(() => setDownloaded(prev => prev.filter(d => d !== id)), 3000);
    }, 1800);
  }

  return (
    <div>
      <Header title="Reports" subtitle="Generate, schedule, and export business intelligence reports" />
      <div className="p-6 space-y-6">

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: "6", icon: <FileBarChart size={16} />, color: "#7c3aed" },
            { label: "Scheduled", value: "5", icon: <Calendar size={16} />, color: "#06b6d4" },
            { label: "Auto-delivered", value: "3", icon: <Mail size={16} />, color: "#22c55e" },
            { label: "Formats", value: "3", icon: <FileText size={16} />, color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className="glass p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}22`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Report cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-bold text-white">Available Reports</h2>
            <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(148,163,184,0.07)", border: "1px solid rgba(148,163,184,0.1)" }}>
              {REPORTS.length} reports
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {REPORTS.map(r => {
              const fmt = getFormat(r.id, r.formats);
              const isDone = downloaded.includes(r.id);
              const isLoading = generating === r.id;
              return (
                <div key={r.id} className="glass p-5 group hover:border-violet-500/20 transition-all duration-300"
                  style={{ borderLeft: `3px solid ${r.color}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${r.color}18` }}>
                        {r.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white">{r.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: `${r.color}20`, color: r.color }}>
                            {r.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="flex items-center gap-1 text-[11px] text-slate-600">
                            <Clock size={11} />
                            {r.frequency}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-600">
                            <Calendar size={11} />
                            Last: {r.lastGenerated}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {/* Format selector */}
                      <div className="flex gap-1">
                        {r.formats.map(f => (
                          <button key={f}
                            onClick={() => setActiveFormat(prev => ({ ...prev, [r.id]: f }))}
                            className="text-[10px] px-2 py-1 rounded-lg font-mono font-bold transition-all"
                            style={fmt === f
                              ? { background: `${r.color}30`, color: r.color, border: `1px solid ${r.color}50` }
                              : { background: "rgba(148,163,184,0.06)", color: "#64748b", border: "1px solid rgba(148,163,184,0.08)" }
                            }>
                            {FORMAT_ICON[f]} {f}
                          </button>
                        ))}
                      </div>
                      {/* Generate button */}
                      <button
                        onClick={() => handleGenerate(r.id)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-60"
                        style={isDone
                          ? { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }
                          : { background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}30` }
                        }>
                        {isLoading ? (
                          <><RefreshCw size={12} className="animate-spin" /> Generating…</>
                        ) : isDone ? (
                          <><CheckCircle2 size={12} /> Downloaded!</>
                        ) : (
                          <><Download size={12} /> Export {fmt}</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled reports */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Scheduled Reports</h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated delivery to stakeholders</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Calendar size={12} />
              Add Schedule
            </button>
          </div>
          <div className="space-y-2">
            {SCHEDULE.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                style={{ background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.05)" }}>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === "active" ? "bg-emerald-400" : "bg-slate-600"}`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{s.report}</p>
                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {s.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    s.status === "active"
                      ? "text-emerald-400 bg-emerald-400/10"
                      : "text-slate-500 bg-slate-800"
                  }`}>
                    {s.status === "active" ? "● Active" : "○ Paused"}
                  </span>
                  <ChevronRight size={14} className="text-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export formats info */}
        <div className="glass p-5">
          <h2 className="text-sm font-bold text-white mb-4">Supported Export Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "📄", title: "PDF Reports", desc: "Executive-ready formatted reports with charts, KPIs, and AI insights. Ideal for board presentations.",
                features: ["Charts included", "Branded layout", "AI summaries", "Executive format"],
                color: "#7c3aed",
              },
              {
                icon: "📊", title: "CSV Export", desc: "Raw data export for analysts. Compatible with Excel, Python, R, and BI tools like Power BI.",
                features: ["Raw data rows", "All columns", "UTF-8 encoded", "No formatting"],
                color: "#06b6d4",
              },
              {
                icon: "📋", title: "Excel Workbook", desc: "Multi-sheet workbook with formatted tables, pivot-ready data, and summary dashboards.",
                features: ["Multiple sheets", "Formatted cells", "Pivot tables", "Summary sheet"],
                color: "#22c55e",
              },
            ].map(f => (
              <div key={f.title} className="p-4 rounded-xl" style={{ background: `${f.color}08`, border: `1px solid ${f.color}18` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{f.icon}</span>
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{f.desc}</p>
                <div className="space-y-1">
                  {f.features.map(ft => (
                    <div key={ft} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 size={10} style={{ color: f.color }} />
                      {ft}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data table preview */}
        <div className="glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <Table2 size={15} className="text-slate-500" />
            <h2 className="text-sm font-bold text-white">Report Generation Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
                  {["Report Name", "Generated At", "Format", "Size", "Status", "Action"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Executive Summary Report", date: "2011-12-15 09:00", fmt: "PDF", size: "2.4 MB", status: "Success" },
                  { name: "Sales Forecast Report", date: "2011-12-14 09:05", fmt: "CSV", size: "840 KB", status: "Success" },
                  { name: "Revenue Analytics Report", date: "2011-12-01 08:00", fmt: "Excel", size: "3.1 MB", status: "Success" },
                  { name: "Inventory Intelligence Report", date: "2011-12-13 09:00", fmt: "CSV", size: "1.2 MB", status: "Success" },
                  { name: "Customer Intelligence Report", date: "2011-12-10 10:00", fmt: "PDF", size: "1.8 MB", status: "Success" },
                  { name: "Recommendation Engine Report", date: "2011-12-01 08:30", fmt: "PDF", size: "980 KB", status: "Success" },
                ].map((row, i) => (
                  <tr key={i} className="border-b hover:bg-white/[0.025] transition-colors"
                    style={{ borderColor: "rgba(148,163,184,0.05)" }}>
                    <td className="py-3 px-4 text-slate-300 text-xs font-medium">{row.name}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs font-mono">{row.date}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa" }}>
                        {row.fmt}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{row.size}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={11} /> {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-semibold">
                        <Download size={11} /> Re-export
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
