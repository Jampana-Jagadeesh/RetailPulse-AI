const COLORS: Record<string, string> = {
  Champions: "#22c55e",
  Loyal:     "#3b82f6",
  Potential: "#eab308",
  "At Risk": "#ef4444",
};

export default function SegmentBadge({ segment }: { segment: string }) {
  const color = COLORS[segment] ?? "#94a3b8";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: color + "20", color, border: `1px solid ${color}40` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {segment}
    </span>
  );
}
