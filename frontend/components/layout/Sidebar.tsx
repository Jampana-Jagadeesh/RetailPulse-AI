"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, TrendingUp, LineChart, Package,
  Sparkles, Users, Lightbulb, FileBarChart, Settings, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard",         href: "/",                icon: LayoutDashboard, color: "#c084fc" },
  { label: "Revenue Analytics", href: "/revenue",         icon: TrendingUp,      color: "#34d399" },
  { label: "Forecasting",       href: "/forecasting",     icon: LineChart,       color: "#38bdf8" },
  { label: "Inventory",         href: "/inventory",       icon: Package,         color: "#fb923c" },
  { label: "Recommendations",   href: "/recommendations", icon: Sparkles,        color: "#f472b6" },
  { label: "Customers",         href: "/customers",       icon: Users,           color: "#fbbf24" },
  { label: "AI Insights",       href: "/insights",        icon: Lightbulb,       color: "#818cf8" },
  { label: "Reports",           href: "/reports",         icon: FileBarChart,    color: "#2dd4bf" },
  { label: "Settings",          href: "/settings",        icon: Settings,        color: "#94a3b8" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{
        background: "linear-gradient(180deg,#07091a 0%,#050714 100%)",
        borderRight: "1px solid rgba(124,58,237,0.25)",
        boxShadow: "4px 0 32px rgba(0,0,0,0.6), inset -1px 0 0 rgba(124,58,237,0.1)",
      }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(124,58,237,0.2)" }}>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.5)", "0 0 35px rgba(6,182,212,0.5)", "0 0 20px rgba(124,58,237,0.5)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>
            <Zap size={20} className="text-white" />
          </motion.div>
          <div>
            <p className="font-black text-sm leading-tight"
              style={{ background: "linear-gradient(90deg,#c084fc,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              RetailPulse AI
            </p>
            <p className="text-[10px] leading-tight text-violet-400">Retail Revenue Optimization Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon, color }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 5, transition: { type: "spring", stiffness: 400 } }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                  active ? "text-white" : "text-slate-300 hover:text-white"
                )}
                style={active ? {
                  background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                  border: `1px solid ${color}55`,
                  boxShadow: `0 0 20px ${color}25, inset 0 1px 0 rgba(255,255,255,0.08)`,
                } : {}}
              >
                <Icon size={17} style={{ color: active ? color : undefined,
                  filter: active ? `drop-shadow(0 0 6px ${color})` : undefined }} />
                <span style={{ color: active ? color : undefined }}>{label}</span>
                {active && (
                  <motion.div layoutId="active-pill" className="ml-auto w-2 h-2 rounded-full"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(124,58,237,0.2)" }}>
        <div className="px-3 py-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.06))",
            border: "1px solid rgba(124,58,237,0.25)",
          }}>
          <p className="text-[10px] text-slate-200 leading-relaxed text-center">
            AI platform helping retailers optimize revenue, forecast demand &amp; reduce inventory risks.
          </p>
        </div>
      </div>
    </aside>
  );
}
