"use client";
import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  action?: React.ReactNode;
  accent?: string;
}

export default function ChartCard({ title, subtitle, children, className = "", delay = 0, action, accent = "#7c3aed" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(160deg, rgba(20,28,54,0.95) 0%, rgba(10,15,30,0.98) 100%)",
        backdropFilter: "blur(20px)",
        border: `1.5px solid ${accent}40`,
        borderRadius: "20px",
        boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accent}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Vivid top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[20px]"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80, transparent)` }} />

      {/* Corner glow */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
        style={{ background: accent, opacity: 0.08 }} />

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-1 ml-4">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0 ml-4">{action}</div>}
        </div>
        {children}
      </div>
    </motion.div>
  );
}
