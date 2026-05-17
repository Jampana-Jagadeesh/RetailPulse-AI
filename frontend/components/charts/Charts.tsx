"use client";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

// ── Shared styles ────────────────────────────────────────────────────────────
const TT: React.CSSProperties = {
  backgroundColor: "#0d1424",
  border: "1px solid rgba(148,163,184,0.25)",
  borderRadius: "12px",
  color: "#f8fafc",
  fontSize: 12,
  padding: "10px 14px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
};

const AX = { fill: "#e2e8f0", fontSize: 11 };
const LEGEND_STYLE = { color: "#f1f5f9", fontSize: 12 };

export const PALETTE = [
  "#7c3aed","#06b6d4","#22c55e","#f59e0b",
  "#ef4444","#ec4899","#8b5cf6","#14b8a6","#f97316","#6366f1",
];
export const SEG_COLORS: Record<string, string> = {
  Champions: "#22c55e", Loyal: "#3b82f6", Potential: "#eab308", "At Risk": "#ef4444",
};

// ── Revenue Area Chart ───────────────────────────────────────────────────────
export function RevenueAreaChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="revLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="month" tick={AX} tickLine={false} axisLine={false} />
        <YAxis tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={52} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
        <Area type="monotone" dataKey="revenue" stroke="url(#revLine)" strokeWidth={2.5}
          fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#a78bfa", strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Revenue + Growth Combo ───────────────────────────────────────────────────
export function RevenueGrowthChart({ data }: { data: { month: string; revenue: number; growth: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="month" tick={AX} tickLine={false} axisLine={false} />
        <YAxis yAxisId="rev" tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={52} />
        <YAxis yAxisId="growth" orientation="right" tick={{ ...AX, fill: "#4ade80" }}
          tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} width={40} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown, name: unknown) =>
            name === "revenue"
              ? [`$${Number(v).toLocaleString()}`, "Revenue"]
              : [`${Number(v).toFixed(1)}%`, "Growth"]} />
        <Legend formatter={v => <span style={LEGEND_STYLE}>{v === "revenue" ? "Revenue" : "Growth %"}</span>} />
        <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#7c3aed"
          strokeWidth={2.5} fill="url(#revGrad2)" dot={false} />
        <Line yAxisId="growth" type="monotone" dataKey="growth" stroke="#22c55e"
          strokeWidth={2} dot={false} strokeDasharray="4 2" />
        <ReferenceLine yAxisId="growth" y={0} stroke="rgba(148,163,184,0.2)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Top Products Horizontal Bar ──────────────────────────────────────────────
export function TopProductsBar({ data }: { data: { product: string; revenue: number }[] }) {
  const trimmed = data.map(d => ({ ...d, product: d.product.length > 24 ? d.product.slice(0, 24) + "…" : d.product }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={trimmed} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
        <XAxis type="number" tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
        <YAxis type="category" dataKey="product" tick={{ ...AX, fontSize: 11 }}
          tickLine={false} axisLine={false} width={150} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="revenue" radius={[0, 8, 8, 0]} maxBarSize={18}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Segment Donut ────────────────────────────────────────────────────────────
export function SegmentDonut({ data }: { data: { segment: string; count: number; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="revenue" nameKey="segment"
          cx="50%" cy="45%" innerRadius={60} outerRadius={95} paddingAngle={4}>
          {data.map((d, i) => (
            <Cell key={i} fill={SEG_COLORS[d.segment] ?? PALETTE[i]}
              stroke="rgba(2,8,23,0.8)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={TT}
          formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
        <Legend formatter={v => <span style={LEGEND_STYLE}>{v}</span>}
          iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Country Bar ──────────────────────────────────────────────────────────────
export function CountryBar({ data }: { data: { country: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="country" tick={{ ...AX, fontSize: 11 }} tickLine={false}
          axisLine={false} angle={-40} textAnchor="end" interval={0} />
        <YAxis tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={52} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={32}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Forecast Line ────────────────────────────────────────────────────────────
export function ForecastChart({
  historical, forecast,
}: {
  historical: { date: string; actual: number }[];
  forecast: { date: string; forecast: number }[];
}) {
  const combined = [
    ...historical.map(d => ({ date: d.date, actual: d.actual, forecast: undefined as number | undefined })),
    ...forecast.map(d => ({ date: d.date, actual: undefined as number | undefined, forecast: d.forecast })),
  ];
  const splitDate = forecast[0]?.date;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={combined} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="date" tick={{ ...AX, fontSize: 11 }} tickLine={false} axisLine={false}
          interval={Math.floor(combined.length / 7)} />
        <YAxis tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={52} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown, name: unknown) => [
            `$${Number(v).toLocaleString()}`,
            name === "actual" ? "Historical" : "Forecast",
          ]} />
        <Legend formatter={v => <span style={LEGEND_STYLE}>
          {v === "actual" ? "Historical Revenue" : "AI Forecast"}</span>} />
        {splitDate && (
          <ReferenceLine x={splitDate} stroke="rgba(124,58,237,0.5)"
            strokeDasharray="4 2" label={{ value: "Forecast Start", fill: "#c4b5fd", fontSize: 11 }} />
        )}
        <Line type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2.5}
          dot={false} connectNulls={false} activeDot={{ r: 4, fill: "#a78bfa" }} />
        <Line type="monotone" dataKey="forecast" stroke="#22c55e" strokeWidth={2.5}
          strokeDasharray="6 3" dot={false} connectNulls={false} activeDot={{ r: 4, fill: "#4ade80" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Weekday Bar ──────────────────────────────────────────────────────────────
export function WeekdayBar({ data }: { data: { day: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="day" tick={{ ...AX, fontSize: 11 }} tickLine={false} axisLine={false}
          tickFormatter={v => v.slice(0, 3)} />
        <YAxis tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={48} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={36}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Inventory Status Pie ─────────────────────────────────────────────────────
export function InventoryPie({ data }: { data: { Status: string; count: number; revenue: number }[] }) {
  const COLORS: Record<string, string> = {
    "Fast Moving": "#22c55e", "Slow Moving": "#eab308", "Dead Stock Risk": "#ef4444",
  };
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="Status"
          cx="50%" cy="45%" innerRadius={55} outerRadius={90} paddingAngle={4}>
          {data.map((d, i) => (
            <Cell key={i} fill={COLORS[d.Status] ?? PALETTE[i]}
              stroke="rgba(2,8,23,0.8)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={TT}
          formatter={(v: unknown, name: unknown) => [Number(v).toLocaleString(), String(name)]} />
        <Legend formatter={v => <span style={LEGEND_STYLE}>{v}</span>}
          iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Hourly Revenue Area ──────────────────────────────────────────────────────
export function HourlyRevenueChart({ data }: { data: { hour: number; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#06b6d4" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="hour" tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `${v}:00`} interval={3} />
        <YAxis tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={52} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
          labelFormatter={l => `Hour: ${l}:00`} />
        <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2.5}
          fill="url(#hourGrad)" dot={false} activeDot={{ r: 5, fill: "#22d3ee", strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── RFM Scatter Plot ─────────────────────────────────────────────────────────
export function RFMScatterChart({ data }: { data: { Recency: number; Frequency: number; Monetary: number; Segment_Label: string }[] }) {
  const segColors: Record<string, string> = {
    Champions: "#22c55e", Loyal: "#3b82f6", Potential: "#eab308", "At Risk": "#ef4444",
  };
  const segments = ["Champions", "Loyal", "Potential", "At Risk"];
  const grouped = segments.map(seg => ({
    name: seg,
    color: segColors[seg] ?? "#94a3b8",
    data: data
      .filter(d => d.Segment_Label === seg)
      .slice(0, 120)
      .map(d => ({ x: d.Recency, y: d.Frequency, z: Math.max(d.Monetary / 500, 20) })),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
        <XAxis type="number" dataKey="x" name="Recency" tick={AX} tickLine={false} axisLine={false}
          label={{ value: "Recency (days)", position: "insideBottomRight", offset: -5, fill: "#e2e8f0", fontSize: 11 }} />
        <YAxis type="number" dataKey="y" name="Frequency" tick={AX} tickLine={false} axisLine={false}
          label={{ value: "Frequency", angle: -90, position: "insideLeft", fill: "#e2e8f0", fontSize: 11 }} />
        <ZAxis type="number" dataKey="z" range={[20, 200]} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown, name: unknown) => [String(v), String(name)]} />
        <Legend formatter={v => <span style={LEGEND_STYLE}>{v}</span>} />
        {grouped.map(g => (
          <Scatter key={g.name} name={g.name} data={g.data} fill={g.color} fillOpacity={0.7} />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

// ── Country Revenue Horizontal Bar ───────────────────────────────────────────
export function CountryHBar({ data }: { data: { country: string; revenue: number }[] }) {
  const top = data.slice(0, 12);
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={top} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
        <XAxis type="number" tick={AX} tickLine={false} axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
        <YAxis type="category" dataKey="country" tick={{ ...AX, fontSize: 11 }}
          tickLine={false} axisLine={false} width={80} />
        <Tooltip contentStyle={TT}
          formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="revenue" radius={[0, 8, 8, 0]} maxBarSize={16}>
          {top.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
