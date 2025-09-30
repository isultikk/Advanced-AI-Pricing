import google.generativeai as genai
import os
import json
from typing import List, Optional

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


def _build_market_prompt(query: str, prices: List[dict]) -> str:
    in_stock = [p for p in prices if p.get("in_stock", True)]
    out_of_stock = [p for p in prices if not p.get("in_stock", True)]

    lines = []
    for p in in_stock:
        line = f"- {p['store_name']}: ${p['price']}"
        if p.get("original_price"):
            discount = round((1 - p["price"] / p["original_price"]) * 100)
            line += f" (was ${p['original_price']}, -{discount}%)"
        if p.get("rating"):
            line += f" | Rating: {p['rating']}/5 ({p.get('reviews', 0)} reviews)"
        if p.get("delivery_days"):
            line += f" | Ships in {p['delivery_days']} days"
        lines.append(line)

    for p in out_of_stock:
        lines.append(f"- {p['store_name']}: ${p['price']} [OUT OF STOCK]")

    available_prices = [p["price"] for p in in_stock] if in_stock else [p["price"] for p in prices]
    min_price = min(available_prices)
    max_price = max(available_prices)

    return f"""You are a professional shopping analyst. Analyze prices for "{query}" across these stores:

{chr(10).join(lines)}

Available price range: ${min_price} - ${max_price}

Return a JSON object with exactly these fields:
{{
  "summary": "2-3 sentence market overview for this specific product",
  "best_deal": "store name with best value and brief reason why",
  "recommendation": "specific actionable advice - should they buy now, wait, or go to a specific store",
  "market_insights": ["insight about pricing pattern", "insight about discounts/availability", "insight about value comparison"],
  "savings_tip": "one concrete tip to save more money on this product",
  "price_trend": "rising/stable/falling with a brief one-sentence explanation",
  "verdict": "one word only: excellent OR good OR fair OR expensive"
}}

Respond with valid JSON only, no markdown fences."""


def _build_optimize_prompt(cost: float, ad_spend: float, comp_price: float, month: int,
                            optimal_price: float, expected_profit: float,
                            market_context: Optional[dict]) -> str:
    market_section = ""
    if market_context:
        market_section = f"""
Market research context (from live price search for "{market_context.get('query', '')}"):
- Market average price: ${market_context.get('avg_price', 0)}
- Cheapest competitor: ${market_context.get('min_price', 0)}
- Most expensive competitor: ${market_context.get('max_price', 0)}
- Number of stores analyzed: {market_context.get('store_count', 0)}
"""

    return f"""You are a strategic pricing consultant. Analyze this pricing optimization result:

Your product costs: ${cost}
Your ad spend: ${ad_spend}/month
Competitor market price: ${comp_price}
Current month/season: {month}
{market_section}
AI-recommended optimal price: ${optimal_price}
Expected profit at optimal price: ${expected_profit}

Return a JSON object with exactly these fields:
{{
  "positioning": "1-2 sentences on where this price sits in the market and why it's smart",
  "margin_insight": "brief analysis of the profit margin at this price point",
  "competitive_edge": "how this price compares to competitors and what advantage it creates",
  "risks": "one potential downside to watch for at this price",
  "action_items": ["specific action 1 to maximize revenue", "specific action 2", "specific action 3"],
  "confidence": "high/medium/low with one-sentence reason"
}}

Respond with valid JSON only, no markdown fences."""


def _parse_json(text: str) -> dict:
    text = text.strip()
    if "```" in text:
        for part in text.split("```"):
            cleaned = part.strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()
            if cleaned.startswith("{"):
                text = cleaned
                break
    return json.loads(text)


async def analyze_prices(query: str, prices: List[dict]) -> dict:
    if not GEMINI_API_KEY:
        in_stock = [p for p in prices if p.get("in_stock", True)]
        best = min(in_stock, key=lambda x: x["price"]) if in_stock else prices[0]
        worst = max(prices, key=lambda x: x["price"])
        spread = round(worst["price"] - best["price"], 2)
        return {
            "summary": f"Prices for {query} range from ${best['price']} to ${worst['price']} across {len(prices)} stores. {best['store_name']} offers the lowest price at ${best['price']}.",
            "best_deal": f"{best['store_name']} at ${best['price']}",
            "recommendation": f"Buy from {best['store_name']} to save ${spread} vs the priciest option.",
            "market_insights": [
                f"Price spread of ${spread} indicates a competitive market",
                f"{sum(1 for p in prices if p.get('original_price'))} of {len(prices)} stores have active discounts",
                f"{sum(1 for p in prices if p.get('in_stock', True))} of {len(prices)} stores have stock available",
            ],
            "savings_tip": f"Buy from {best['store_name']} for the best available price right now.",
            "price_trend": "stable — set a price alert to track future changes.",
            "verdict": "good",
        }

    prompt = _build_market_prompt(query, prices)
    response = model.generate_content(prompt)
    return _parse_json(response.text)


async def analyze_optimization(cost: float, ad_spend: float, comp_price: float, month: int,
                                optimal_price: float, expected_profit: float,
                                market_context: Optional[dict]) -> dict:
    if not GEMINI_API_KEY:
        margin = round(((optimal_price - cost) / optimal_price) * 100, 1)
        vs_market = round(optimal_price - comp_price, 2)
        direction = "above" if vs_market > 0 else "below"
        return {
            "positioning": f"At ${optimal_price}, you're positioned ${abs(vs_market)} {direction} the market average, which maximizes profit given your cost structure.",
            "margin_insight": f"Profit margin of {margin}% at this price is healthy given your ${cost} unit cost.",
            "competitive_edge": f"Pricing ${abs(vs_market)} {direction} competitors while maintaining demand creates a strong value signal.",
            "risks": "Monitor competitor price changes closely — any significant drop may require a price adjustment.",
            "action_items": [
                f"Launch at ${optimal_price} and monitor demand for the first 2 weeks",
                f"Increase ad spend above ${ad_spend} if conversion rates are high",
                "A/B test a price 5% higher to test demand elasticity",
            ],
            "confidence": "medium — based on modeled data; adjust after first real sales cycle",
        }

    prompt = _build_optimize_prompt(cost, ad_spend, comp_price, month, optimal_price, expected_profit, market_context)
    response = model.generate_content(prompt)
    return _parse_json(response.text)
