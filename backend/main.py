from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import uvicorn
from scraper import search_product_prices
from gemini_service import analyze_prices, analyze_optimization

app = FastAPI(title="Dynamic Pricing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str
    stores: Optional[List[str]] = None


class AnalyzeRequest(BaseModel):
    query: str
    prices: List[dict]


class OptimizeRequest(BaseModel):
    cost: float
    ad_spend: float
    comp_price: float
    month: int


class OptimizeInsightsRequest(BaseModel):
    cost: float
    ad_spend: float
    comp_price: float
    month: int
    optimal_price: float
    expected_profit: float
    market_context: Optional[dict] = None


def build_model() -> RandomForestRegressor:
    np.random.seed(42)
    n = 2000
    prices = np.random.uniform(50, 250, n)
    ad_spend = np.random.uniform(0, 1000, n)
    comp_prices = np.random.uniform(50, 250, n)
    months = np.random.randint(1, 13, n)
    season = 50 * np.sin(2 * np.pi * months / 12)
    ad_impact = 4 * np.sqrt(ad_spend)
    comp_impact = 0.6 * (comp_prices - prices)
    demand = np.maximum(300 - 1.2 * prices + ad_impact + comp_impact + season + np.random.normal(0, 15, n), 0)
    X = np.column_stack([prices, ad_spend, comp_prices, months])
    m = RandomForestRegressor(n_estimators=100, random_state=42)
    m.fit(X, demand)
    return m


rf_model = build_model()


@app.post("/search")
async def search_prices(request: SearchRequest):
    from scraper import _relevant_store_ids, BRAND_TO_STORE, STORE_DATA
    all_user = request.stores if request.stores else list(STORE_DATA.keys())
    relevant = _relevant_store_ids(request.query, all_user)
    brand_filtered = len(relevant) < len(all_user)
    results = await search_product_prices(request.query, request.stores)
    return {"results": results, "query": request.query, "brand_filtered": brand_filtered, "store_count": len(relevant)}


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    analysis = await analyze_prices(request.query, request.prices)
    return {"analysis": analysis}


@app.post("/optimize")
async def optimize(request: OptimizeRequest):
    test_prices = np.linspace(request.cost * 1.05, request.cost * 5, 120)
    X = np.column_stack([
        test_prices,
        np.full(120, request.ad_spend),
        np.full(120, request.comp_price),
        np.full(120, request.month),
    ])
    predicted_demand = rf_model.predict(X)
    profits = (test_prices - request.cost) * predicted_demand
    best_idx = int(np.argmax(profits))
    chart_data = [
        {"price": round(float(p), 1), "profit": round(float(pr), 1), "demand": round(float(d), 1)}
        for p, pr, d in zip(test_prices, profits, predicted_demand)
    ]
    return {
        "optimal_price": round(float(test_prices[best_idx]), 2),
        "expected_profit": round(float(profits[best_idx]), 2),
        "expected_demand": round(float(predicted_demand[best_idx]), 1),
        "chart_data": chart_data,
    }


@app.post("/optimize-insights")
async def optimize_insights(request: OptimizeInsightsRequest):
    insights = await analyze_optimization(
        request.cost, request.ad_spend, request.comp_price, request.month,
        request.optimal_price, request.expected_profit, request.market_context,
    )
    return {"insights": insights}


@app.get("/stores")
async def get_stores():
    from scraper import STORE_DATA
    return {"stores": [{"id": k, "name": v["name"]} for k, v in STORE_DATA.items()]}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
