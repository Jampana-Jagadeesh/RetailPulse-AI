from fastapi import APIRouter
from backend.services.data_service import get_data

router = APIRouter(prefix="/customers", tags=["customers"])

@router.get("/segments")
def get_segments():
    _, rfm, _i, _r = get_data()
    counts = rfm["Segment_Label"].value_counts().reset_index()
    counts.columns = ["segment", "count"]
    rev = rfm.groupby("Segment_Label")["Monetary"].sum().reset_index()
    rev.columns = ["segment", "revenue"]
    merged = counts.merge(rev, on="segment")
    merged["revenue"] = merged["revenue"].round(2)
    return merged.to_dict(orient="records")

@router.get("/top")
def top_customers(limit: int = 20):
    _, rfm, _i, _r = get_data()
    top = rfm.sort_values("Predicted_CLV", ascending=False).head(limit)
    return top[["CustomerID","Recency","Frequency","Monetary","Predicted_CLV","Segment_Label"]]\
        .round(2).to_dict(orient="records")

@router.get("/rfm-scatter")
def rfm_scatter():
    _, rfm, _i, _r = get_data()
    sample = rfm.sample(min(500, len(rfm)), random_state=42)
    return sample[["CustomerID","Recency","Frequency","Monetary","Predicted_CLV","Segment_Label"]]\
        .round(2).to_dict(orient="records")

@router.get("/kpis")
def customer_kpis():
    _, rfm, _i, _r = get_data()
    champions = rfm[rfm["Segment_Label"] == "Champions"]
    at_risk    = rfm[rfm["Segment_Label"] == "At Risk"]
    return {
        "total_customers": len(rfm),
        "avg_clv": round(rfm["Predicted_CLV"].mean(), 2),
        "avg_recency": round(rfm["Recency"].mean(), 1),
        "avg_frequency": round(rfm["Frequency"].mean(), 1),
        "champions_count": len(champions),
        "at_risk_count": len(at_risk),
        "champions_revenue_pct": round(champions["Monetary"].sum() / rfm["Monetary"].sum() * 100, 1),
    }
