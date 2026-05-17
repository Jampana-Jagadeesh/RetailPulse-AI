from fastapi import APIRouter
from backend.services.data_service import get_data

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/kpis")
def inventory_kpis():
    _, _r, inv, _ru = get_data()
    return {
        "fast_moving":   int((inv["Status"] == "Fast Moving").sum()),
        "slow_moving":   int((inv["Status"] == "Slow Moving").sum()),
        "dead_stock":    int((inv["Status"] == "Dead Stock Risk").sum()),
        "total_products": len(inv),
        "health_score":  round((inv["Status"] == "Fast Moving").sum() / len(inv) * 100, 1),
    }

@router.get("/products")
def inventory_products(status: str = None, limit: int = 50):
    _, _r, inv, _ru = get_data()
    data = inv if not status else inv[inv["Status"] == status]
    cols = ["StockCode","Description","TotalRevenue","TotalQty","OrderCount","Status","RecentActivity"]
    return data[cols].head(limit).round(2).to_dict(orient="records")

@router.get("/status-breakdown")
def status_breakdown():
    _, _r, inv, _ru = get_data()
    breakdown = inv.groupby("Status").agg(
        count=("StockCode","count"),
        revenue=("TotalRevenue","sum"),
        qty=("TotalQty","sum")
    ).reset_index().round(2)
    return breakdown.to_dict(orient="records")
