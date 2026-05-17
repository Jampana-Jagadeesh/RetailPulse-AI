import pandas as pd

def generate_insights(df, rfm, inventory):
    insights = []

    # ── Revenue insight — MoM growth ─────────────────────────────────────────
    monthly = df.groupby('OrderMonth')['Revenue'].sum()
    if len(monthly) >= 2:
        last, prev = monthly.iloc[-1], monthly.iloc[-2]
        growth = ((last - prev) / prev * 100) if prev else 0
        direction = "up" if growth > 0 else "down"
        insights.append({
            "type": "Revenue",
            "icon": "📈" if growth > 0 else "📉",
            "color": "#22c55e" if growth > 0 else "#ef4444",
            "text": (
                f"Monthly revenue is {direction} {abs(growth):.1f}% vs last month. "
                f"Current period: ${last:,.0f} | Previous: ${prev:,.0f}"
            ),
        })

    # ── Top growing product category ─────────────────────────────────────────
    try:
        top_product = (
            df.groupby("Description")["Revenue"].sum()
              .nlargest(1)
        )
        if not top_product.empty:
            name = top_product.index[0][:45]
            rev  = top_product.iloc[0]
            insights.append({
                "type": "Top Product",
                "icon": "🏆",
                "color": "#f59e0b",
                "text": (
                    f"Best-selling product: \"{name}\" with ${rev:,.0f} in total revenue. "
                    f"Key driver of overall platform performance."
                ),
            })
    except Exception:
        pass

    # ── Customer insight — VIP share ──────────────────────────────────────────
    if 'Segment_Label' in rfm.columns:
        vip = rfm[rfm['Segment_Label'] == 'Champions']
        total_mon = rfm['Monetary'].sum()
        vip_rev_share = (vip['Monetary'].sum() / total_mon * 100) if total_mon > 0 else 0
        insights.append({
            "type": "Customer",
            "icon": "👑",
            "color": "#facc15",
            "text": (
                f"Champions segment contributes {vip_rev_share:.1f}% of total revenue "
                f"({len(vip):,} customers). "
                f"Avg spend per champion: ${(vip['Monetary'].mean() if not vip.empty else 0):,.0f}."
            ),
        })

    # ── At-risk customers ─────────────────────────────────────────────────────
    if 'Segment_Label' in rfm.columns:
        at_risk = rfm[rfm['Segment_Label'] == 'At Risk']
        avg_recency = at_risk['Recency'].mean() if not at_risk.empty else 0
        insights.append({
            "type": "Retention",
            "icon": "🔔",
            "color": "#f97316",
            "text": (
                f"{len(at_risk):,} customers are At Risk of churning. "
                f"Avg {avg_recency:.0f} days since last purchase. "
                f"Immediate re-engagement campaigns recommended."
            ),
        })

    # ── Inventory alert — dead stock ─────────────────────────────────────────
    dead = inventory[inventory['Status'] == 'Dead Stock Risk']
    if not dead.empty:
        top_dead = dead.iloc[0]
        insights.append({
            "type": "Inventory Alert",
            "icon": "⚠️",
            "color": "#ef4444",
            "text": (
                f"{len(dead)} products flagged as Dead Stock Risk. "
                f"Top at-risk SKU: \"{top_dead['Description'][:40]}\" "
                f"({top_dead['TotalQty']:,} units, ${top_dead['TotalRevenue']:,.0f} exposure)."
            ),
        })

    # ── Fast movers ───────────────────────────────────────────────────────────
    fast = inventory[inventory['Status'] == 'Fast Moving']
    if not fast.empty:
        top_fast = fast.iloc[0]
        insights.append({
            "type": "Inventory",
            "icon": "🚀",
            "color": "#38bdf8",
            "text": (
                f"{len(fast)} fast-moving products identified. "
                f"Top seller: \"{top_fast['Description'][:40]}\" — "
                f"{top_fast['TotalQty']:,} units across {top_fast['OrderCount']} orders."
            ),
        })

    # ── Country performance ───────────────────────────────────────────────────
    top_country = df.groupby('Country')['Revenue'].sum().nlargest(1)
    if not top_country.empty:
        country = top_country.index[0]
        rev = top_country.iloc[0]
        total_rev = df['Revenue'].sum()
        pct = (rev / total_rev * 100) if total_rev > 0 else 0
        insights.append({
            "type": "Market",
            "icon": "🌍",
            "color": "#a78bfa",
            "text": (
                f"Top market: {country} drives {pct:.1f}% of total revenue (${rev:,.0f}). "
                f"International expansion opportunity in {int(df['Country'].nunique())} active markets."
            ),
        })

    # ── CLV opportunity ───────────────────────────────────────────────────────
    if 'Predicted_CLV' in rfm.columns:
        avg_clv = rfm['Predicted_CLV'].mean()
        max_clv = rfm['Predicted_CLV'].max()
        insights.append({
            "type": "CLV",
            "icon": "💰",
            "color": "#34d399",
            "text": (
                f"Customer Lifetime Value (CLV) model active. "
                f"Avg predicted CLV: ${avg_clv:,.0f} | "
                f"Highest CLV customer: ${max_clv:,.0f}. "
                f"Prioritize high-CLV retention strategies."
            ),
        })

    # ── Recommendation opportunity ────────────────────────────────────────────
    avg_basket = df.groupby('InvoiceNo')['StockCode'].count().mean()
    insights.append({
        "type": "Recommendation",
        "icon": "🎯",
        "color": "#ec4899",
        "text": (
            f"Average basket size is {avg_basket:.1f} items per order. "
            f"Association rule engine identifies cross-sell opportunities "
            f"to increase basket size and average order value."
        ),
    })

    return insights
