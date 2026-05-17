# RetailPulse AI — Retail Revenue Optimization Platform

<div align="center">

![RetailPulse AI](https://img.shields.io/badge/RetailPulse-AI-7c3aed?style=for-the-badge&logo=lightning&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3b82f6?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-22c55e?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-f59e0b?style=for-the-badge&logo=scikit-learn&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-06b6d4?style=for-the-badge)

**An enterprise-grade AI-powered retail intelligence platform that helps retailers optimize revenue, forecast demand, reduce inventory risks, and improve customer engagement using Machine Learning and advanced analytics.**

[Live Demo](#) · [API Docs](#) · [Report Bug](https://github.com/Jampana-Jagadeesh/RetailPulse-AI/issues) · [Request Feature](https://github.com/Jampana-Jagadeesh/RetailPulse-AI/issues)

</div>

---

## 📌 Overview

RetailPulse AI is a full-stack, production-ready retail intelligence platform built with a modern enterprise architecture. It combines **Machine Learning**, **Business Intelligence**, and **Real-time Analytics** into a single unified dashboard — designed to feel like a product used by companies like Amazon, Shopify, or Salesforce.

The platform processes transactional retail data to surface actionable insights across six core intelligence modules:

| Module | Capability |
|---|---|
| 📊 Revenue Analytics | Sales trends, growth analysis, market performance |
| 🔮 Sales Forecasting | AI-powered 7/30-day revenue predictions |
| 👥 Customer Intelligence | RFM segmentation, CLV prediction, churn detection |
| 📦 Inventory Intelligence | Fast/slow/dead stock classification, risk alerts |
| 🤝 Recommendation Engine | Apriori association rules, cross-sell opportunities |
| 🤖 AI Insights | Automated business intelligence from live data |

---

## 🏗 Architecture

```
RetailPulse-AI/
│
├── backend/                    # FastAPI REST API
│   ├── main.py                 # App entry point with lifespan cache warmup
│   ├── routers/                # Route handlers per module
│   │   ├── analytics.py        # Revenue KPIs, trends, country/product breakdown
│   │   ├── customers.py        # RFM segments, CLV, top customers
│   │   ├── forecast.py         # Revenue forecasting, demand spikes
│   │   ├── inventory.py        # Stock classification, risk analysis
│   │   ├── recommendations.py  # Association rules (Apriori)
│   │   └── insights.py         # AI-generated business insights
│   └── services/
│       └── data_service.py     # Cached ML pipeline (pickle-based)
│
├── src/                        # ML modules
│   ├── data_processing.py      # Feature engineering pipeline
│   ├── rfm.py                  # RFM scoring (Recency, Frequency, Monetary)
│   ├── segmentation.py         # KMeans customer clustering
│   ├── clv_model.py            # Random Forest CLV prediction
│   ├── forecasting.py          # Linear trend forecasting + spike detection
│   ├── recommendations.py      # Apriori association rule mining
│   ├── inventory.py            # Inventory intelligence classification
│   └── insights.py             # Automated insight generation engine
│
├── frontend/                   # Next.js 16 Enterprise Dashboard
│   ├── app/                    # App Router pages
│   │   ├── page.tsx            # Main dashboard
│   │   ├── revenue/            # Revenue analytics
│   │   ├── forecasting/        # Sales forecasting
│   │   ├── inventory/          # Inventory intelligence
│   │   ├── customers/          # Customer intelligence
│   │   ├── recommendations/    # Recommendation engine
│   │   └── insights/           # AI insights
│   ├── components/
│   │   ├── charts/Charts.tsx   # Recharts visualization library
│   │   ├── layout/             # Sidebar, Header, PageTransition
│   │   └── ui/                 # KpiCard, ChartCard, InsightCard, etc.
│   └── lib/
│       ├── api.ts              # Typed API client
│       ├── useApi.ts           # Client-side data fetching hook
│       └── utils.ts            # Formatting utilities
│
├── data/
│   └── Online Retail.xlsx      # UCI Online Retail Dataset (541K transactions)
│
├── render.yaml                 # Render deployment config
└── requirements.txt            # Python dependencies
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2 | Full-stack React framework (App Router) |
| React | 19 | UI component library |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | 12 | Page transitions & animations |
| Recharts | 3 | Interactive data visualizations |
| TypeScript | 5 | Type safety |
| Lucide React | Latest | Icon system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.136 | High-performance REST API |
| Uvicorn | 0.46 | ASGI server |
| Pydantic | 2 | Data validation |
| Python | 3.11+ | Core runtime |

### Machine Learning
| Library | Purpose |
|---|---|
| scikit-learn | KMeans clustering, Random Forest CLV, preprocessing |
| MLxtend | Apriori algorithm, association rule mining |
| Pandas | Data processing, feature engineering |
| NumPy | Numerical operations |

---

## ⚙️ ML Pipeline

```
Raw Excel Data (541K rows)
        │
        ▼
Feature Engineering
  ├── Revenue = Quantity × UnitPrice
  ├── OrderMonth, Weekday, Hour (temporal features)
  ├── BasketSize per invoice
  ├── CustomerSpend, PurchaseFrequency, AverageOrderValue
  └── ProductVelocity
        │
        ▼
RFM Analysis
  ├── Recency  (days since last purchase)
  ├── Frequency (unique orders)
  └── Monetary  (total spend)
        │
        ▼
KMeans Clustering (k=4)
  ├── Champions
  ├── Loyal
  ├── Potential
  └── At Risk
        │
        ▼
Random Forest CLV Model
  └── Predicted Customer Lifetime Value
        │
        ▼
Pickle Cache (instant API responses)
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm 9+

### 1. Clone the repository
```bash
git clone https://github.com/Jampana-Jagadeesh/RetailPulse-AI.git
cd RetailPulse-AI
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server (cache builds on first run ~20s, instant after)
python -m uvicorn backend.main:app --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/analytics/kpis` | GET | Total revenue, orders, customers, growth % |
| `/analytics/revenue-trend` | GET | Monthly revenue with MoM growth |
| `/analytics/top-products` | GET | Top N products by revenue |
| `/analytics/country-revenue` | GET | Revenue by country |
| `/forecast/revenue?days=30` | GET | AI revenue forecast |
| `/forecast/spikes` | GET | Historical demand spike events |
| `/customers/kpis` | GET | Customer intelligence KPIs |
| `/customers/segments` | GET | RFM segment breakdown |
| `/customers/top` | GET | Top customers by CLV |
| `/inventory/kpis` | GET | Inventory health score |
| `/inventory/products` | GET | Products with risk classification |
| `/recommendations/rules` | GET | Association rules (Apriori) |
| `/insights/` | GET | AI-generated business insights |

---

## 📊 Dataset

**UCI Online Retail Dataset**
- 541,909 transactions
- 8 features: InvoiceNo, StockCode, Description, Quantity, InvoiceDate, UnitPrice, CustomerID, Country
- Date range: Dec 2010 – Dec 2011
- 37 countries, 4,338 customers, 3,684 products

---

## 🌐 Deployment

### Frontend → Vercel
1. Import `RetailPulse-AI` repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=<your-render-url>`

### Backend → Render
1. Import `RetailPulse-AI` repo on [render.com](https://render.com)
2. Render auto-detects `render.yaml`
3. Start command: `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

---

## 🔑 Key Design Decisions

- **Pickle cache** — ML pipeline runs once on startup (~20s), all subsequent API calls return in <100ms
- **Client-side rendering** — All pages load instantly with skeleton states, data fills in asynchronously
- **Lazy recommendations** — Apriori rules pre-computed into cache to avoid 67s blocking on requests
- **CSV conversion** — Excel converted to CSV on first run (10x faster reads on restart)

---

## 👤 Author

**Jagadeesh Jampana**

[![Email](https://img.shields.io/badge/Email-jagadeeshjampana5%40gmail.com-red?style=flat-square&logo=gmail)](mailto:jagadeeshjampana5@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-Jampana--Jagadeesh-black?style=flat-square&logo=github)](https://github.com/Jampana-Jagadeesh)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Jagadeesh_Jampana-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/jampana-jagadeesh-9704002a2/)

> Built with ⚡ by **Jagadeesh Jampana** × **Amazon Q**

---

## 📄 License

© 2026 Jagadeesh Jampana — All Rights Reserved
