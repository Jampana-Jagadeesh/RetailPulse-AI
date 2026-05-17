"use client";
import { motion } from "framer-motion";
import type { Insight } from "@/lib/api";

export default function InsightCard({ insight, delay = 0 }: { insight: Insight; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.15 } }}
      className="p-4 rounded-2xl relative overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(135deg, ${insight.color}22 0%, rgba(10,15,30,0.97) 65%)`,
        border: `1.5px solid ${insight.color}55`,
        boxShadow: `0 6px 30px ${insight.color}20, 0 0 0 1px ${insight.color}10`,
      }}
    >
      {/* Big glow blob */}
      <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full blur-2xl pointer-events-none"
        style={{ background: insight.color, opacity: 0.25 }} />

      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${insight.color}, ${insight.color}30)` }} />

      <div className="relative z-10 pl-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{insight.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.15em]"
            style={{ color: insight.color, textShadow: `0 0 12px ${insight.color}` }}>{insight.type}</span>
          <span className="ml-auto w-2 h-2 rounded-full animate-pulse"
            style={{ background: insight.color, boxShadow: `0 0 8px ${insight.color}` }} />
        </div>
        <p className="text-sm text-slate-100 leading-relaxed font-medium">{insight.text}</p>
      </div>
    </motion.div>
  );
}
