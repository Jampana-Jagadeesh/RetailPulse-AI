import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

from src.data_processing import load_and_clean_data
from src.rfm import create_rfm
from src.segmentation import perform_clustering
from src.clv_model import train_clv_model
from src.forecasting import forecast_revenue, detect_demand_spikes
from src.recommendations import get_recommendations
from src.inventory import get_inventory_intelligence
from src.insights import generate_insights

# ─── CONFIG ───────────────────────────────────────────────────────────────────
st.set_page_config(page_title="RetailPulse AI", layout="wide", page_icon="🛍️")

st.markdown("""
<style>
[data-testid="stAppViewContainer"] { background: linear-gradient(135deg,#020617,#0f172a); }
[data-testid="stSidebar"] { background: #0f172a; border-right: 1px solid #1e293b; }

@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

.card {
    background: rgba(15,23,42,0.9);
    border: 1px solid rgba(124,58,237,0.5);
    border-radius: 14px; padding: 18px; margin-bottom: 12px;
    animation: fadeIn 0.4s ease;
    transition: all 0.2s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 0 22px rgba(59,130,246,0.4); }
.kpi-val { font-size: 30px; font-weight: 700; margin: 4px 0; }
.kpi-label { font-size: 13px; color: #94a3b8; }
.insight-card {
    border-radius: 12px; padding: 14px 18px; margin-bottom: 10px;
    background: rgba(15,23,42,0.95); border-left: 4px solid;
    animation: fadeIn 0.5s ease;
}
h1,h2,h3,h4,h5 { color: white !important; }
.stDataFrame { border-radius: 10px; }
</style>
""", unsafe_allow_html=True)

# ─── DATA LOAD ────────────────────────────────────────────────────────────────
@st.cache_data(show_spinner="Loading RetailPulse AI...")
def load_all():
    df = load_and_clean_data("data/Online Retail.xlsx")
    rfm = create_rfm(df)
    rfm, _ = perform_clustering(rfm)
    _, rfm = train_clv_model(rfm)

    seg_map = {0: "Champions", 1: "Loyal", 2: "Potential", 3: "At Risk"}
    rfm["Segment_Label"] = rfm["Segment"].map(seg_map)

    inventory = get_inventory_intelligence(df)
    return df, rfm, inventory

df, rfm, inventory = load_all()

# ─── SIDEBAR ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown('<h2 style="color:#7c3aed;">🛍️ RetailPulse AI</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color:#64748b;font-size:12px;">Retail Decision Intelligence</p>', unsafe_allow_html=True)
    st.divider()

    page = st.radio("Navigation", [
        "🏠 Dashboard",
        "📊 Revenue Analytics",
        "🔮 Forecasting",
        "📦 Inventory Intelligence",
        "🤝 Recommendations",
        "👥 Customers",
        "🤖 AI Insights",
    ])

    st.divider()
    countries = ["All"] + sorted(df['Country'].unique().tolist())
    country_filter = st.selectbox("Country Filter", countries)

st.markdown('<div class="card"><h1 style="text-align:center;margin:0;">🛍️ RetailPulse AI — Retail Decision Intelligence</h1></div>', unsafe_allow_html=True)

# ─── FILTER ───────────────────────────────────────────────────────────────────
dff = df if country_filter == "All" else df[df['Country'] == country_filter]

# ─── HELPERS ──────────────────────────────────────────────────────────────────
COLORS = {"Champions": "#22c55e", "Loyal": "#3b82f6", "Potential": "#facc15", "At Risk": "#ef4444"}

def fig_style(fig, title=""):
    fig.update_layout(
        title=dict(text=title, x=0.5, font=dict(color="white", size=16)),
        paper_bgcolor="#020617", plot_bgcolor="#020617", font_color="white",
        legend=dict(orientation="h", y=-0.25, x=0.5, xanchor="center", font=dict(color="white")),
        margin=dict(l=30, r=30, t=50, b=70)
    )
    fig.update_xaxes(showgrid=True, gridcolor="#1e293b")
    fig.update_yaxes(showgrid=True, gridcolor="#1e293b")
    return fig

def kpi(col, label, value, color, icon):
    col.markdown(f'<div class="card"><p class="kpi-label">{icon} {label}</p>'
                 f'<p class="kpi-val" style="color:{color};">{value}</p></div>', unsafe_allow_html=True)

# ─── GLOBAL KPIs ──────────────────────────────────────────────────────────────
total_rev = dff['Revenue'].sum()
total_orders = dff['InvoiceNo'].nunique()
total_customers = dff['CustomerID'].nunique()
avg_order_val = total_rev / total_orders if total_orders else 0

k1, k2, k3, k4, k5, k6 = st.columns(6)
kpi(k1, "Total Revenue",    f"${total_rev:,.0f}",       "#22c55e", "💰")
kpi(k2, "Total Orders",     f"{total_orders:,}",         "#38bdf8", "🧾")
kpi(k3, "Active Customers", f"{total_customers:,}",      "#a78bfa", "👥")
kpi(k4, "Avg Order Value",  f"${avg_order_val:,.2f}",    "#facc15", "📊")
kpi(k5, "Products",         f"{dff['StockCode'].nunique():,}", "#f97316", "📦")
kpi(k6, "Countries",        f"{dff['Country'].nunique():,}",   "#ec4899", "🌍")

st.divider()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE: DASHBOARD
# ══════════════════════════════════════════════════════════════════════════════
if page == "🏠 Dashboard":
    c1, c2 = st.columns([2, 1])

    with c1:
        # Revenue trend
        monthly = dff.groupby('OrderMonth')['Revenue'].sum().reset_index()
        fig = px.area(monthly, x='OrderMonth', y='Revenue', color_discrete_sequence=['#7c3aed'])
        fig.update_traces(fill='tozeroy', line_color='#a78bfa')
        st.plotly_chart(fig_style(fig, "Monthly Revenue Trend"), use_container_width=True)

    with c2:
        # Segment donut
        seg_rev = rfm.groupby('Segment_Label')['Monetary'].sum().reset_index()
        fig = px.pie(seg_rev, names='Segment_Label', values='Monetary',
                     hole=0.55, color='Segment_Label', color_discrete_map=COLORS)
        fig.update_traces(textposition='outside', textinfo='percent+label',
                          marker=dict(line=dict(color='#020617', width=2)))
        st.plotly_chart(fig_style(fig, "Revenue by Segment"), use_container_width=True)

    c3, c4, c5 = st.columns(3)

    with c3:
        top_products = dff.groupby('Description')['Revenue'].sum().nlargest(8).reset_index()
        fig = px.bar(top_products, x='Revenue', y='Description', orientation='h',
                     color='Revenue', color_continuous_scale='Purples')
        st.plotly_chart(fig_style(fig, "Top 8 Products"), use_container_width=True)

    with c4:
        weekday_rev = dff.groupby('Weekday')['Revenue'].sum().reset_index()
        order = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        weekday_rev['Weekday'] = pd.Categorical(weekday_rev['Weekday'], categories=order, ordered=True)
        weekday_rev = weekday_rev.sort_values('Weekday')
        fig = px.bar(weekday_rev, x='Weekday', y='Revenue', color='Revenue',
                     color_continuous_scale='Blues')
        st.plotly_chart(fig_style(fig, "Revenue by Weekday"), use_container_width=True)

    with c5:
        hourly = dff.groupby('Hour')['Revenue'].sum().reset_index()
        fig = px.line(hourly, x='Hour', y='Revenue', color_discrete_sequence=['#22c55e'])
        fig.update_traces(mode='lines+markers')
        st.plotly_chart(fig_style(fig, "Revenue by Hour"), use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE: REVENUE ANALYTICS
# ══════════════════════════════════════════════════════════════════════════════
elif page == "📊 Revenue Analytics":
    c1, c2 = st.columns(2)

    with c1:
        monthly = dff.groupby('OrderMonth')['Revenue'].sum().reset_index()
        monthly['Growth%'] = monthly['Revenue'].pct_change() * 100
        fig = go.Figure()
        fig.add_trace(go.Bar(x=monthly['OrderMonth'], y=monthly['Revenue'],
                             name='Revenue', marker_color='#7c3aed'))
        fig.add_trace(go.Scatter(x=monthly['OrderMonth'], y=monthly['Growth%'],
                                 name='Growth %', yaxis='y2', line=dict(color='#22c55e', width=2)))
        fig.update_layout(yaxis2=dict(overlaying='y', side='right', showgrid=False,
                                      tickfont=dict(color='#22c55e')))
        st.plotly_chart(fig_style(fig, "Revenue & Monthly Growth %"), use_container_width=True)

    with c2:
        country_rev = dff.groupby('Country')['Revenue'].sum().nlargest(10).reset_index()
        fig = px.bar(country_rev, x='Country', y='Revenue', color='Revenue',
                     color_continuous_scale='Viridis')
        st.plotly_chart(fig_style(fig, "Top 10 Countries by Revenue"), use_container_width=True)

    c3, c4 = st.columns(2)

    with c3:
        top_cat = dff.groupby('Description')['Revenue'].sum().nlargest(10).reset_index()
        fig = px.treemap(top_cat, path=['Description'], values='Revenue',
                         color='Revenue', color_continuous_scale='RdPu')
        st.plotly_chart(fig_style(fig, "Product Revenue Treemap"), use_container_width=True)

    with c4:
        basket_dist = dff.groupby('InvoiceNo')['BasketSize'].first().value_counts().head(15).reset_index()
        basket_dist.columns = ['BasketSize', 'Count']
        fig = px.bar(basket_dist, x='BasketSize', y='Count', color='Count',
                     color_continuous_scale='Teal')
        st.plotly_chart(fig_style(fig, "Basket Size Distribution"), use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE: FORECASTING
# ══════════════════════════════════════════════════════════════════════════════
elif page == "🔮 Forecasting":
    horizon = st.radio("Forecast Horizon", ["7 Days", "30 Days"], horizontal=True)
    days = 7 if horizon == "7 Days" else 30

    with st.spinner("Running forecast model..."):
        historical, forecast = forecast_revenue(dff, days=days)
        spikes = detect_demand_spikes(dff)

    c1, c2 = st.columns([3, 1])

    with c1:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=historical['ds'], y=historical['y'],
                                 name='Historical', line=dict(color='#7c3aed', width=2)))
        fig.add_trace(go.Scatter(x=forecast['ds'], y=forecast['yhat'],
                                 name='Forecast', line=dict(color='#22c55e', width=2, dash='dash')))
        fig.add_vrect(x0=forecast['ds'].min(), x1=forecast['ds'].max(),
                      fillcolor="#22c55e", opacity=0.05, line_width=0)
        st.plotly_chart(fig_style(fig, f"Revenue Forecast — Next {days} Days"), use_container_width=True)

    with c2:
        proj = forecast['yhat'].sum()
        st.markdown(f'<div class="card"><p class="kpi-label">🔮 Projected Revenue</p>'
                    f'<p class="kpi-val" style="color:#22c55e;">${proj:,.0f}</p>'
                    f'<p class="kpi-label">Next {days} days</p></div>', unsafe_allow_html=True)

        avg_daily = forecast['yhat'].mean()
        st.markdown(f'<div class="card"><p class="kpi-label">📅 Avg Daily Revenue</p>'
                    f'<p class="kpi-val" style="color:#38bdf8;">${avg_daily:,.0f}</p></div>',
                    unsafe_allow_html=True)

        st.markdown(f'<div class="card"><p class="kpi-label">⚡ Demand Spikes Detected</p>'
                    f'<p class="kpi-val" style="color:#facc15;">{len(spikes)}</p></div>',
                    unsafe_allow_html=True)

    if not spikes.empty:
        st.subheader("⚡ Demand Spike Events")
        fig = px.scatter(spikes, x='ds', y='y', size='spike_pct',
                         color_discrete_sequence=['#ef4444'],
                         hover_data=['spike_pct'])
        fig.update_traces(marker=dict(line=dict(width=1, color='white')))
        st.plotly_chart(fig_style(fig, "Historical Demand Spikes"), use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE: INVENTORY INTELLIGENCE
# ══════════════════════════════════════════════════════════════════════════════
elif page == "📦 Inventory Intelligence":
    inv = get_inventory_intelligence(dff)

    fast = inv[inv['Status'] == 'Fast Moving']
    slow = inv[inv['Status'] == 'Slow Moving']
    dead = inv[inv['Status'] == 'Dead Stock Risk']

    i1, i2, i3 = st.columns(3)
    kpi(i1, "Fast Moving",     f"{len(fast):,}",  "#22c55e", "🚀")
    kpi(i2, "Slow Moving",     f"{len(slow):,}",  "#facc15", "🐢")
    kpi(i3, "Dead Stock Risk", f"{len(dead):,}",  "#ef4444", "⚠️")

    c1, c2 = st.columns(2)

    with c1:
        status_rev = inv.groupby('Status')['TotalRevenue'].sum().reset_index()
        fig = px.pie(status_rev, names='Status', values='TotalRevenue', hole=0.5,
                     color='Status',
                     color_discrete_map={'Fast Moving':'#22c55e','Slow Moving':'#facc15','Dead Stock Risk':'#ef4444'})
        fig.update_traces(textposition='outside', textinfo='percent+label')
        st.plotly_chart(fig_style(fig, "Revenue Share by Inventory Status"), use_container_width=True)

    with c2:
        top_fast = fast.head(10)
        fig = px.bar(top_fast, x='TotalQty', y='Description', orientation='h',
                     color='TotalRevenue', color_continuous_scale='Greens')
        st.plotly_chart(fig_style(fig, "Top Fast-Moving Products"), use_container_width=True)

    st.subheader("⚠️ Dead Stock Risk Products")
    st.dataframe(dead[['StockCode','Description','TotalQty','TotalRevenue','RecentActivity']].head(20),
                 use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE: RECOMMENDATIONS
# ══════════════════════════════════════════════════════════════════════════════
elif page == "🤝 Recommendations":
    st.info("Association rule mining on transaction data. May take a moment...")

    with st.spinner("Mining association rules..."):
        rules = get_recommendations(dff)

    if rules.empty:
        st.warning("Not enough transaction overlap to generate rules. Try a broader dataset.")
    else:
        r1, r2, r3 = st.columns(3)
        kpi(r1, "Rules Found",      f"{len(rules)}",                          "#7c3aed", "🔗")
        kpi(r2, "Avg Confidence",   f"{rules['confidence'].mean():.1%}",      "#22c55e", "✅")
        kpi(r3, "Avg Lift",         f"{rules['lift'].mean():.2f}x",           "#facc15", "📈")

        c1, c2 = st.columns(2)

        with c1:
            fig = px.scatter(rules, x='support', y='confidence', size='lift',
                             color='lift', color_continuous_scale='Purples',
                             hover_data=['antecedents','consequents'])
            fig.update_traces(marker=dict(line=dict(width=1, color='white')))
            st.plotly_chart(fig_style(fig, "Support vs Confidence (size = Lift)"), use_container_width=True)

        with c2:
            fig = px.bar(rules.head(10), x='lift', y='antecedents', orientation='h',
                         color='confidence', color_continuous_scale='Teal')
            st.plotly_chart(fig_style(fig, "Top 10 Rules by Lift"), use_container_width=True)

        st.subheader("📋 Association Rules Table")
        st.dataframe(rules.style.format({'support':'{:.3f}','confidence':'{:.2%}','lift':'{:.2f}'}),
                     use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE: CUSTOMERS
# ══════════════════════════════════════════════════════════════════════════════
elif page == "👥 Customers":
    seg_filter = st.selectbox("Segment", ["All"] + list(rfm['Segment_Label'].unique()))
    rfm_f = rfm if seg_filter == "All" else rfm[rfm['Segment_Label'] == seg_filter]

    c1, c2, c3, c4 = st.columns(4)
    kpi(c1, "Customers",   f"{len(rfm_f):,}",                          "#38bdf8", "👥")
    kpi(c2, "Total Revenue", f"${rfm_f['Monetary'].sum():,.0f}",        "#22c55e", "💰")
    kpi(c3, "Avg CLV",     f"${rfm_f['Predicted_CLV'].mean():,.0f}",    "#facc15", "📈")
    kpi(c4, "Avg Recency", f"{rfm_f['Recency'].mean():.0f} days",       "#a78bfa", "📅")

    c1, c2, c3 = st.columns(3)

    with c1:
        fig = px.scatter(rfm_f, x='Frequency', y='Monetary', size='Predicted_CLV',
                         color='Segment_Label', color_discrete_map=COLORS)
        fig.update_traces(marker=dict(line=dict(width=1, color='white')))
        st.plotly_chart(fig_style(fig, "Customer Distribution"), use_container_width=True)

    with c2:
        fig = px.box(rfm_f, x='Segment_Label', y='Predicted_CLV',
                     color='Segment_Label', color_discrete_map=COLORS)
        st.plotly_chart(fig_style(fig, "CLV Distribution by Segment"), use_container_width=True)

    with c3:
        agg = rfm_f.groupby('Segment_Label')['Predicted_CLV'].mean().reset_index()
        fig = px.bar(agg, x='Segment_Label', y='Predicted_CLV',
                     color='Segment_Label', color_discrete_map=COLORS, text_auto=True)
        st.plotly_chart(fig_style(fig, "Avg CLV by Segment"), use_container_width=True)

    st.subheader("🏆 Top 20 Customers by CLV")
    top = rfm_f.sort_values('Predicted_CLV', ascending=False).head(20)
    st.dataframe(top[['CustomerID','Recency','Frequency','Monetary','Predicted_CLV','Segment_Label']],
                 use_container_width=True)
    st.download_button("⬇️ Export CSV", top.to_csv(index=False).encode(), "top_customers.csv")

# ══════════════════════════════════════════════════════════════════════════════
# PAGE: AI INSIGHTS
# ══════════════════════════════════════════════════════════════════════════════
elif page == "🤖 AI Insights":
    insights = generate_insights(dff, rfm, inventory)

    st.markdown("### 🤖 AI-Generated Business Insights")
    st.markdown('<p style="color:#64748b;">Automated intelligence from your retail data</p>',
                unsafe_allow_html=True)

    for ins in insights:
        st.markdown(
            f'<div class="insight-card" style="border-left-color:{ins["color"]};">'
            f'<strong style="color:{ins["color"]};">{ins["icon"]} {ins["type"]}</strong><br>'
            f'<span style="color:#e2e8f0;">{ins["text"]}</span>'
            f'</div>',
            unsafe_allow_html=True
        )

    st.divider()
    st.subheader("📊 Insight Analytics")

    c1, c2 = st.columns(2)

    with c1:
        monthly = dff.groupby('OrderMonth')['Revenue'].sum().reset_index()
        monthly['Growth%'] = monthly['Revenue'].pct_change() * 100
        fig = px.bar(monthly.tail(12), x='OrderMonth', y='Growth%',
                     color='Growth%', color_continuous_scale='RdYlGn')
        st.plotly_chart(fig_style(fig, "Monthly Revenue Growth %"), use_container_width=True)

    with c2:
        seg_counts = rfm['Segment_Label'].value_counts().reset_index()
        seg_counts.columns = ['Segment', 'Count']
        fig = px.bar(seg_counts, x='Segment', y='Count',
                     color='Segment', color_discrete_map=COLORS, text_auto=True)
        st.plotly_chart(fig_style(fig, "Customer Segment Distribution"), use_container_width=True)
