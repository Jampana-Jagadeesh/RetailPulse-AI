from fastapi import APIRouter
from backend.services.data_service import get_data
from src.forecasting import forecast_revenue, detect_demand_spikes

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.get("/revenue")
def get_forecast(days: int = 30):
    df, _, _i, _r = get_data()
    historical, forecast = forecast_revenue(df, days=days)
    hist  = [{"date": str(r["ds"].date()), "actual": round(r["y"], 2)}
             for _, r in historical.tail(90).iterrows()]
    fcast = [{"date": str(r["ds"].date()), "forecast": round(r["yhat"], 2)}
             for _, r in forecast.iterrows()]
    return {
        "historical": hist,
        "forecast": fcast,
        "projected_total": round(forecast["yhat"].sum(), 2),
        "avg_daily": round(forecast["yhat"].mean(), 2),
    }

@router.get("/spikes")
def get_spikes():
    df, _, _i, _r = get_data()
    spikes = detect_demand_spikes(df)
    return [{"date": str(r["ds"].date()), "revenue": round(r["y"], 2), "spike_pct": r["spike_pct"]}
            for _, r in spikes.iterrows()]
