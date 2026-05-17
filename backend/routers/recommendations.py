from fastapi import APIRouter
from backend.services.data_service import get_data

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/rules")
def get_rules():
    _, _, _, rules = get_data()
    if rules.empty:
        return []
    return rules.round(3).to_dict(orient="records")

@router.get("/kpis")
def rec_kpis():
    _, _, _, rules = get_data()
    if rules.empty:
        return {"rules_count": 0, "avg_confidence": 0, "avg_lift": 0, "max_lift": 0}
    return {
        "rules_count": len(rules),
        "avg_confidence": round(float(rules["confidence"].mean()), 3),
        "avg_lift": round(float(rules["lift"].mean()), 2),
        "max_lift": round(float(rules["lift"].max()), 2),
    }
