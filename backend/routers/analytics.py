from fastapi import APIRouter
from backend.services.data_service import get_data

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/kpis")
def get_kpis():
    df, rfm, _, _r = get_data()
    monthly = df.groupby("OrderMonth")["Revenue"].sum()
    growth = 0.0
    if len(monthly) >= 2:
        growth = round((monthly.iloc[-1] - monthly.iloc[-2]) / monthly.iloc[-2] * 100, 1)
    return {
        "total_revenue": round(df["Revenue"].sum(), 2),
        "total_orders": int(df["InvoiceNo"].nunique()),
        "total_customers": int(df["CustomerID"].nunique()),
        "avg_order_value": round(df["Revenue"].sum() / df["InvoiceNo"].nunique(), 2),
        "total_products": int(df["StockCode"].nunique()),
        "total_countries": int(df["Country"].nunique()),
        "revenue_growth_pct": growth,
        "forecasted_revenue": round(monthly.mean() * 1.08, 2),
    }

@router.get("/revenue-trend")
def revenue_trend():
    df, _, _i, _r = get_data()
    monthly = df.groupby("OrderMonth")["Revenue"].sum().reset_index()
    monthly.columns = ["month", "revenue"]
    monthly["growth"] = monthly["revenue"].pct_change().fillna(0).mul(100).round(1)
    return monthly.to_dict(orient="records")

@router.get("/top-products")
def top_products(limit: int = 10):
    df, _, _i, _r = get_data()
    top = df.groupby("Description")["Revenue"].sum().nlargest(limit).reset_index()
    top.columns = ["product", "revenue"]
    return top.to_dict(orient="records")

@router.get("/country-revenue")
def country_revenue(limit: int = 15):
    df, _, _i, _r = get_data()
    cr = df.groupby("Country")["Revenue"].sum().nlargest(limit).reset_index()
    cr.columns = ["country", "revenue"]
    return cr.to_dict(orient="records")

@router.get("/weekday-revenue")
def weekday_revenue():
    df, _, _i, _r = get_data()
    order = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    wd = df.groupby("Weekday")["Revenue"].sum().reindex(order).reset_index()
    wd.columns = ["day", "revenue"]
    return wd.fillna(0).to_dict(orient="records")

@router.get("/hourly-revenue")
def hourly_revenue():
    df, _, _i, _r = get_data()
    hr = df.groupby("Hour")["Revenue"].sum().reset_index()
    hr.columns = ["hour", "revenue"]
    return hr.to_dict(orient="records")
