"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
  compact?: boolean;
}

export default function KpiCard({ label, value, sub, trend, icon, gradient, delay = 0, compact = false }: Props) {
  const up = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -7, scale: 1.03, transition: { duration: 0.18 } }}
      className="cursor-default relative overflow-hidden"
      style={{
        padding: compact ? "14px 16px" : "24px",
        background: `linear-gradient(135deg, ${gradient}30 0%, #0d1628 70%)`,
        border: `1.5px solid ${gradient}60`,
        borderRadius: "20px",
        boxShadow: `0 8px 40px ${gradient}25, 0 0 0 1px ${gradient}15, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* Big vivid glow blob top-right */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-3xl pointer-events-none"
        style={{ background: gradient, opacity: 0.35 }} />

      {/* Bottom left subtle glow */}
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ background: gradient, opacity: 0.15 }} />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ color: gradient }}>{label}</p>
          <p className="leading-none tracking-tight font-black text-white mt-2"
            style={{ fontSize: compact ? "1.3rem" : "2.1rem", textShadow: `0 0 30px ${gradient}60` }}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1.5 font-medium">{sub}</p>}
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.25 }}
              className={`flex items-center gap-1.5 mt-3 text-xs font-bold px-2.5 py-1 rounded-full w-fit`}
              style={{
                background: up ? "rgba(52,211,153,0.18)" : "rgba(239,68,68,0.18)",
                color: up ? "#6ee7b7" : "#fca5a5",
                border: up ? "1px solid rgba(52,211,153,0.35)" : "1px solid rgba(239,68,68,0.35)",
              }}
            >
              {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {up ? "+" : ""}{Math.abs(trend).toFixed(1)}% vs last month
            </motion.div>
          )}
        </div>

        <motion.div
          whileHover={{ rotate: 15, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 280 }}
          className="rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
          style={{
            width: compact ? "32px" : "40px",
            height: compact ? "32px" : "40px",
            background: `linear-gradient(135deg, ${gradient}55, ${gradient}25)`,
            border: `1.5px solid ${gradient}70`,
            boxShadow: `0 0 30px ${gradient}50, inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}
