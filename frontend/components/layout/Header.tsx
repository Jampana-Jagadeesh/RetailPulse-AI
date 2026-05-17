"use client";
import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return null;
  return (
    <div className="hidden md:flex flex-col items-end">
      <span className="text-xs font-mono font-bold text-slate-200">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
      <span className="text-[10px] text-slate-500">
        {now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
      </span>
    </div>
  );
}

interface Props { title: string; subtitle?: string; }

export default function Header({ title, subtitle }: Props) {
  return (
    <header className="flex items-center justify-between px-8 py-4 sticky top-0 z-40 relative overflow-hidden"
      style={{
        background: "rgba(5,8,18,0.92)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(124,58,237,0.2)",
        boxShadow: "0 1px 0 rgba(124,58,237,0.15), 0 4px 24px rgba(0,0,0,0.4)",
      }}>

      {/* Gradient bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #06b6d4, #34d399, transparent)" }} />

      <div>
        <h1 className="text-xl font-black gradient-text">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <LiveClock />

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 cursor-pointer transition-all"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}>
          <Search size={14} className="text-violet-400" />
          <span className="hidden sm:inline text-xs text-slate-400">Search...</span>
        </div>

        <div className="relative">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Bell size={16} className="text-violet-300" />
          </button>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-[#050812] animate-pulse" />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)", boxShadow: "0 0 16px rgba(52,211,153,0.15)" }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
            style={{ boxShadow: "0 0 8px #34d399" }} />
          <span className="text-xs text-emerald-300 font-bold">Live</span>
        </div>

        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 cursor-pointer"
          style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
          RP
        </div>
      </div>
    </header>
  );
}
