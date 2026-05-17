from fastapi import APIRouter
from backend.services.data_service import get_data
from src.insights import generate_insights

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/")
def get_insights():
    df, rfm, inventory, _ = get_data()
    return generate_insights(df, rfm, inventory)
