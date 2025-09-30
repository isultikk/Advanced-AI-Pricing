# PriceAI — AI Dynamic Pricing

Compare product prices across major retailers and find the profit-optimal price for your own products, with AI-generated market and pricing insights powered by Gemini.

The project has two parts:

- **`backend/`** — a FastAPI service that simulates multi-store price search, runs a Random Forest demand model to find the profit-maximizing price, and generates natural-language insights via Google Gemini.
- **`pricing-ai/`** — a Next.js frontend for searching/comparing prices, running the price optimizer, and a break-even calculator.

## Features

- **Price search** — query a product and get simulated prices across 17 retailers (Nike, Zara, Adidas, Amazon, ASOS, Shein, etc.), with brand-aware store filtering, stock status, ratings, and discounts.
- **Market analysis** — Gemini summarizes the price landscape: best deal, buy/wait recommendation, price trend, and savings tips.
- **Price optimizer** — given your cost, ad spend, competitor price, and month, a Random Forest regression model estimates demand across a price range and returns the price that maximizes expected profit, plus a profit/demand curve.
- **Optimizer insights** — Gemini explains the recommended price: market positioning, margin analysis, competitive edge, and risks.
- **Break-even calculator** — quick break-even units/revenue and margin analysis from fixed costs, variable cost, and selling price.

## Tech stack

- **Backend:** FastAPI, scikit-learn (RandomForestRegressor), NumPy/Pandas, `google-generativeai` (Gemini), Uvicorn
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Recharts, lucide-react

## Getting started

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY="your-gemini-api-key"   # required for AI insights
python main.py
```

The API runs at `http://localhost:8000`.

### Frontend

```bash
cd pricing-ai
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## API endpoints

| Method | Endpoint             | Description                                      |
|--------|-----------------------|---------------------------------------------------|
| POST   | `/search`             | Search product prices across stores               |
| POST   | `/analyze`             | Get AI market analysis for a set of prices         |
| POST   | `/optimize`             | Compute the profit-maximizing price                |
| POST   | `/optimize-insights`   | Get AI insights on an optimization result          |
| GET    | `/stores`              | List available stores                              |

## Notes

- Store price data is procedurally simulated (not scraped from live retailers), so results are deterministic per query but not real-world prices.
- Without a `GEMINI_API_KEY`, the backend falls back to rule-based (non-AI) summaries for `/analyze` and `/optimize-insights`.
