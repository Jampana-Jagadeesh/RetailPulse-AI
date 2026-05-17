const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${path}`);
  return res.json();
}

export const api = {
  kpis: () => get<KPIs>("/analytics/kpis"),
  revenueTrend: () => get<RevenueTrend[]>("/analytics/revenue-trend"),
  topProducts: (limit = 10) => get<TopProduct[]>(`/analytics/top-products?limit=${limit}`),
  countryRevenue: () => get<CountryRevenue[]>("/analytics/country-revenue"),
  weekdayRevenue: () => get<WeekdayRevenue[]>("/analytics/weekday-revenue"),
  hourlyRevenue: () => get<HourlyRevenue[]>("/analytics/hourly-revenue"),

  forecast: (days = 30) => get<ForecastData>(`/forecast/revenue?days=${days}`),
  spikes: () => get<Spike[]>("/forecast/spikes"),

  customerKpis: () => get<CustomerKPIs>("/customers/kpis"),
  segments: () => get<Segment[]>("/customers/segments"),
  topCustomers: (limit = 20) => get<Customer[]>(`/customers/top?limit=${limit}`),
  rfmScatter: () => get<Customer[]>("/customers/rfm-scatter"),

  inventoryKpis: () => get<InventoryKPIs>("/inventory/kpis"),
  inventoryProducts: (status?: string) =>
    get<InventoryProduct[]>(`/inventory/products${status ? `?status=${status}` : ""}`),
  inventoryBreakdown: () => get<InventoryBreakdown[]>("/inventory/status-breakdown"),

  recKpis: () => get<RecKPIs>("/recommendations/kpis"),
  rules: () => get<Rule[]>("/recommendations/rules"),

  insights: () => get<Insight[]>("/insights/"),
};

// ── Types ──────────────────────────────────────────────────────────────────
export interface KPIs {
  total_revenue: number; total_orders: number; total_customers: number;
  avg_order_value: number; total_products: number; total_countries: number;
  revenue_growth_pct: number; forecasted_revenue: number;
}
export interface RevenueTrend { month: string; revenue: number; growth: number; }
export interface TopProduct { product: string; revenue: number; }
export interface CountryRevenue { country: string; revenue: number; }
export interface WeekdayRevenue { day: string; revenue: number; }
export interface HourlyRevenue { hour: number; revenue: number; }
export interface ForecastData {
  historical: { date: string; actual: number }[];
  forecast: { date: string; forecast: number }[];
  projected_total: number; avg_daily: number;
}
export interface Spike { date: string; revenue: number; spike_pct: number; }
export interface CustomerKPIs {
  total_customers: number; avg_clv: number; avg_recency: number;
  avg_frequency: number; champions_count: number; at_risk_count: number;
  champions_revenue_pct: number;
}
export interface Segment { segment: string; count: number; revenue: number; }
export interface Customer {
  CustomerID: number; Recency: number; Frequency: number;
  Monetary: number; Predicted_CLV: number; Segment_Label: string;
}
export interface InventoryKPIs {
  fast_moving: number; slow_moving: number; dead_stock: number;
  total_products: number; health_score: number;
}
export interface InventoryProduct {
  StockCode: string; Description: string; TotalRevenue: number;
  TotalQty: number; OrderCount: number; Status: string; RecentActivity: boolean;
}
export interface InventoryBreakdown { Status: string; count: number; revenue: number; qty: number; }
export interface RecKPIs { rules_count: number; avg_confidence: number; avg_lift: number; max_lift: number; }
export interface Rule { antecedents: string; consequents: string; support: number; confidence: number; lift: number; }
export interface Insight { type: string; icon: string; color: string; text: string; }
