import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import analytics, forecast, customers, inventory, recommendations, insights

app = FastAPI(title="RetailPulse AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://retailpulse-ai.vercel.app",
        "https://retailpulse-backend.onrender.com",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics.router)
app.include_router(forecast.router)
app.include_router(customers.router)
app.include_router(inventory.router)
app.include_router(recommendations.router)
app.include_router(insights.router)

@app.get("/")
def root():
    return {"status": "RetailPulse AI API running", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
