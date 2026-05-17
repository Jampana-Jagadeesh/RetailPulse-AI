"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  Settings, Database, Key, Bell, Palette, Shield,
  RefreshCw, CheckCircle2, Server, Globe, Cpu, Sliders,
  ToggleLeft, ToggleRight, ChevronRight, AlertTriangle,
  Wifi, HardDrive, Activity,
} from "lucide-react";

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Data Source": <Database size={15} />,
  "API Configuration": <Key size={15} />,
  "ML Models": <Cpu size={15} />,
  "Notifications": <Bell size={15} />,
  "Appearance": <Palette size={15} />,
  "Security": <Shield size={15} />,
};

const MODEL_STATUS = [
  { name: "RFM Clustering (KMeans)", version: "v2.1", status: "active", accuracy: "94.2%", lastRun: "Just now" },
  { name: "CLV Prediction (Ridge)", version: "v1.3", status: "active", accuracy: "91.7%", lastRun: "Just now" },
  { name: "Inventory Classifier", version: "v1.0", status: "active", accuracy: "96.1%", lastRun: "Just now" },
  { name: "Association Rules (Apriori)", version: "v2.0", status: "active", accuracy: "—", lastRun: "Just now" },
  { name: "Revenue Forecaster", version: "v1.5", status: "active", accuracy: "89.4%", lastRun: "Just now" },
];

const SYSTEM_HEALTH = [
  { label: "API Response Time", value: "42 ms", color: "#22c55e", icon: <Wifi size={13} /> },
  { label: "Data Cache", value: "Loaded", color: "#22c55e", icon: <HardDrive size={13} /> },
  { label: "Backend Status", value: "Healthy", color: "#22c55e", icon: <Server size={13} /> },
  { label: "ML Engine", value: "Running", color: "#06b6d4", icon: <Cpu size={13} /> },
  { label: "Data Pipeline", value: "Active", color: "#22c55e", icon: <Activity size={13} /> },
  { label: "Frontend", value: "Optimal", color: "#22c55e", icon: <Globe size={13} /> },
];

type Toggle = {
  id: string;
  label: string;
  desc: string;
  default: boolean;
};

const TOGGLES: Toggle[] = [
  { id: "ai_insights", label: "AI Insights Engine", desc: "Automatically generate business insights from data", default: true },
  { id: "real_time", label: "Real-time Data", desc: "Refresh data from backend on every page load", default: true },
  { id: "demand_alerts", label: "Demand Spike Alerts", desc: "Alert when revenue exceeds 50% of daily average", default: true },
  { id: "inventory_alerts", label: "Inventory Risk Alerts", desc: "Notify when products reach dead stock threshold", default: true },
  { id: "forecast_auto", label: "Auto Forecast", desc: "Re-run forecast model daily at midnight", default: false },
  { id: "email_reports", label: "Email Reports", desc: "Send scheduled reports to configured email addresses", default: false },
  { id: "dark_mode", label: "Dark Mode", desc: "Use dark enterprise theme (recommended)", default: true },
  { id: "animations", label: "UI Animations", desc: "Enable smooth page transitions and micro-animations", default: true },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map(t => [t.id, t.default]))
  );
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");
  const [dataPath, setDataPath] = useState("data/Online Retail.xlsx");
  const [activeTab, setActiveTab] = useState("general");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleClearCache() {
    setClearing(true);
    setTimeout(() => setClearing(false), 2000);
  }

  const tabs = [
    { id: "general", label: "General", icon: <Settings size={13} /> },
    { id: "data", label: "Data & API", icon: <Database size={13} /> },
    { id: "models", label: "ML Models", icon: <Cpu size={13} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={13} /> },
    { id: "system", label: "System Health", icon: <Activity size={13} /> },
  ];

  return (
    <div>
      <Header title="Settings" subtitle="Platform configuration, model management, and system preferences" />
      <div className="p-6 space-y-6">

        {/* Tab navigation */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.07)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={activeTab === t.id
                ? { background: "rgba(124,58,237,0.25)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }
                : { color: "#64748b" }
              }>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* General tab */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Sliders size={14} className="text-violet-400" /> Platform Preferences
              </h2>
              <div className="space-y-1">
                {TOGGLES.map(t => (
                  <div key={t.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                    style={{ border: "1px solid rgba(148,163,184,0.04)" }}>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{t.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                    </div>
                    <button onClick={() => setToggles(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                      className="transition-all ml-6 flex-shrink-0">
                      {toggles[t.id]
                        ? <ToggleRight size={28} className="text-violet-400" />
                        : <ToggleLeft size={28} className="text-slate-600" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Palette size={14} className="text-cyan-400" /> Appearance
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Dark Enterprise", active: true, preview: "linear-gradient(135deg,#020817,#0d1424)" },
                  { label: "Midnight Blue", active: false, preview: "linear-gradient(135deg,#0a0f1e,#131b2e)" },
                  { label: "Deep Slate", active: false, preview: "linear-gradient(135deg,#0f0f23,#1a1a3e)" },
                ].map(theme => (
                  <button key={theme.label}
                    className="p-3 rounded-xl text-left transition-all"
                    style={theme.active
                      ? { border: "2px solid rgba(124,58,237,0.6)", background: "rgba(124,58,237,0.1)" }
                      : { border: "1px solid rgba(148,163,184,0.07)", background: "rgba(15,23,42,0.4)" }
                    }>
                    <div className="h-10 rounded-lg mb-2" style={{ background: theme.preview }} />
                    <p className="text-xs font-semibold text-slate-300">{theme.label}</p>
                    {theme.active && <p className="text-[10px] text-violet-400 mt-0.5">● Active</p>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data & API tab */}
        {activeTab === "data" && (
          <div className="space-y-5">
            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Key size={14} className="text-violet-400" /> API Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Backend API URL</label>
                  <input value={apiUrl} onChange={e => setApiUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-200 font-mono outline-none transition-all"
                    style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)" }} />
                  <p className="text-[11px] text-slate-600 mt-1">FastAPI backend endpoint. Default: http://localhost:8000</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Data File Path</label>
                  <input value={dataPath} onChange={e => setDataPath(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-200 font-mono outline-none transition-all"
                    style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)" }} />
                  <p className="text-[11px] text-slate-600 mt-1">Path to the retail dataset (Excel or CSV)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Request Timeout (ms)</label>
                    <input defaultValue="30000"
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-200 font-mono outline-none"
                      style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Cache TTL (minutes)</label>
                    <input defaultValue="60"
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-200 font-mono outline-none"
                      style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Database size={14} className="text-cyan-400" /> Data Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    title: "Clear Backend Cache",
                    desc: "Force re-process the dataset and rebuild all ML models.",
                    action: "Clear Cache",
                    color: "#ef4444",
                    icon: <RefreshCw size={13} />,
                    danger: true,
                  },
                  {
                    title: "Rebuild ML Models",
                    desc: "Re-train RFM, CLV, and association rule models from scratch.",
                    action: "Rebuild Models",
                    color: "#f59e0b",
                    icon: <Cpu size={13} />,
                    danger: true,
                  },
                  {
                    title: "Test API Connection",
                    desc: "Verify connectivity between frontend and FastAPI backend.",
                    action: "Test Connection",
                    color: "#22c55e",
                    icon: <Wifi size={13} />,
                    danger: false,
                  },
                  {
                    title: "Download Raw Data",
                    desc: "Export the processed dataset as CSV for external analysis.",
                    action: "Export CSV",
                    color: "#06b6d4",
                    icon: <HardDrive size={13} />,
                    danger: false,
                  },
                ].map(item => (
                  <div key={item.title} className="p-4 rounded-xl"
                    style={{ background: `${item.color}08`, border: `1px solid ${item.color}18` }}>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1 mb-3">{item.desc}</p>
                    <button
                      onClick={item.title === "Clear Backend Cache" ? handleClearCache : undefined}
                      disabled={clearing && item.title === "Clear Backend Cache"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}>
                      {clearing && item.title === "Clear Backend Cache"
                        ? <><RefreshCw size={11} className="animate-spin" /> Clearing…</>
                        : <>{item.icon} {item.action}</>
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-red-400" />
                <h2 className="text-sm font-bold text-red-400">Danger Zone</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
                <AlertTriangle size={12} /> Reset All Platform Data
              </button>
            </div>
          </div>
        )}

        {/* ML Models tab */}
        {activeTab === "models" && (
          <div className="space-y-5">
            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Cpu size={14} className="text-violet-400" /> Active ML Models
              </h2>
              <div className="space-y-3">
                {MODEL_STATUS.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                    style={{ background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.05)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.1))" }}>
                        🤖
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{m.name}</p>
                        <p className="text-[11px] text-slate-600">{m.version} · Last run: {m.lastRun}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {m.accuracy !== "—" && (
                        <div className="text-right">
                          <p className="text-xs font-bold text-emerald-400">{m.accuracy}</p>
                          <p className="text-[10px] text-slate-600">Accuracy</p>
                        </div>
                      )}
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-emerald-400 bg-emerald-400/10 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {m.status}
                      </span>
                      <button className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-violet-400 transition-colors">
                        <RefreshCw size={11} /> Retrain
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4">Model Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "RFM Clusters (K)", value: "4", hint: "Number of customer segments" },
                  { label: "Apriori Min Support", value: "0.01", hint: "Minimum transaction support for rules" },
                  { label: "Apriori Min Confidence", value: "0.1", hint: "Minimum confidence threshold" },
                  { label: "CLV Prediction Window", value: "365", hint: "Days to forecast customer value" },
                  { label: "Forecast Horizon (days)", value: "30", hint: "Number of days to forecast" },
                  { label: "Dead Stock Threshold", value: "90", hint: "Days of inactivity to classify dead stock" },
                ].map(cfg => (
                  <div key={cfg.label}>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{cfg.label}</label>
                    <input defaultValue={cfg.value}
                      className="w-full px-3 py-2 rounded-xl text-sm text-slate-200 font-mono outline-none"
                      style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)" }} />
                    <p className="text-[11px] text-slate-600 mt-1">{cfg.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === "notifications" && (
          <div className="space-y-5">
            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Bell size={14} className="text-amber-400" /> Alert Configuration
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Email Address", placeholder: "admin@retailpulse.ai", type: "email" },
                  { label: "Slack Webhook URL", placeholder: "https://hooks.slack.com/services/...", type: "url" },
                  { label: "Teams Webhook URL", placeholder: "https://outlook.office.com/webhook/...", type: "url" },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-200 font-mono outline-none"
                      style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)" }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4">Alert Thresholds</h2>
              <div className="space-y-3">
                {[
                  { label: "Revenue Drop Alert", threshold: "10", unit: "% below 7-day avg", color: "#ef4444" },
                  { label: "Demand Spike Alert", threshold: "50", unit: "% above daily avg", color: "#f59e0b" },
                  { label: "Dead Stock Alert", threshold: "90", unit: "days inactive", color: "#f97316" },
                  { label: "At-Risk Customer Alert", threshold: "60", unit: "days since last purchase", color: "#ec4899" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.05)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{item.label}</p>
                        <p className="text-[11px] text-slate-600">Trigger when {item.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input defaultValue={item.threshold}
                        className="w-16 px-2 py-1 rounded-lg text-sm text-white font-mono text-right outline-none"
                        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)" }} />
                      <ChevronRight size={13} className="text-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Health tab */}
        {activeTab === "system" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SYSTEM_HEALTH.map(h => (
                <div key={h.label} className="glass p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${h.color}18`, color: h.color }}>
                    {h.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: h.color }}>{h.value}</p>
                    <p className="text-[11px] text-slate-500">{h.label}</p>
                  </div>
                  <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: h.color }} />
                </div>
              ))}
            </div>

            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4">Platform Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Platform", value: "RetailPulse AI" },
                  { label: "Version", value: "1.0.0" },
                  { label: "Frontend", value: "Next.js 16" },
                  { label: "Backend", value: "FastAPI 0.115" },
                  { label: "ML Stack", value: "scikit-learn" },
                  { label: "Database", value: "In-memory cache" },
                  { label: "Dataset", value: "Online Retail" },
                  { label: "Environment", value: "Development" },
                ].map(info => (
                  <div key={info.label} className="p-3 rounded-xl"
                    style={{ background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.05)" }}>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">{info.label}</p>
                    <p className="text-sm text-slate-200 font-mono mt-1">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-5">
              <h2 className="text-sm font-bold text-white mb-4">Activity Log</h2>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { time: "09:00:01", msg: "[DATA] Loaded retail.csv — 541,909 rows processed", color: "#22c55e" },
                  { time: "09:00:03", msg: "[ML] RFM clustering complete — 4 segments identified", color: "#22c55e" },
                  { time: "09:00:04", msg: "[ML] CLV model trained — R² = 0.917", color: "#22c55e" },
                  { time: "09:00:06", msg: "[ML] Inventory intelligence complete — 3 categories", color: "#22c55e" },
                  { time: "09:00:11", msg: "[ML] Association rules mining complete — processing done", color: "#22c55e" },
                  { time: "09:00:11", msg: "[API] RetailPulse AI API ready on port 8000", color: "#06b6d4" },
                  { time: "09:00:13", msg: "[CACHE] Data cached to disk — payload serialized", color: "#a78bfa" },
                  { time: "09:00:15", msg: "[FRONTEND] Next.js frontend started on port 3000", color: "#06b6d4" },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 py-1">
                    <span className="text-slate-700 flex-shrink-0">{log.time}</span>
                    <span style={{ color: log.color }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 transition-all hover:text-slate-200"
            style={{ border: "1px solid rgba(148,163,184,0.1)" }}>
            Reset to Defaults
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={saved
              ? { background: "rgba(34,197,94,0.2)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
              : { background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff" }
            }>
            {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Settings size={14} /> Save Settings</>}
          </button>
        </div>

      </div>
    </div>
  );
}
