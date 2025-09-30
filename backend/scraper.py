import asyncio
import hashlib
import random
from time import time
from typing import List, Optional

STORE_DATA = {
    "zara":        {"name": "Zara",            "url": "https://www.zara.com",          "price_factor": (0.90, 1.20), "description": "Fashion-forward clothing with modern styles"},
    "adidas":      {"name": "Adidas",          "url": "https://www.adidas.com",        "price_factor": (1.00, 1.40), "description": "Sports and lifestyle apparel"},
    "nike":        {"name": "Nike",            "url": "https://www.nike.com",          "price_factor": (1.05, 1.45), "description": "Athletic footwear and apparel"},
    "hm":          {"name": "H&M",             "url": "https://www.hm.com",            "price_factor": (0.50, 0.80), "description": "Affordable fashion for all"},
    "amazon":      {"name": "Amazon",          "url": "https://www.amazon.com",        "price_factor": (0.70, 1.10), "description": "Wide selection with fast delivery"},
    "asos":        {"name": "ASOS",            "url": "https://www.asos.com",          "price_factor": (0.65, 0.95), "description": "Online fashion destination"},
    "uniqlo":      {"name": "Uniqlo",          "url": "https://www.uniqlo.com",        "price_factor": (0.60, 0.85), "description": "Everyday essentials with quality focus"},
    "mango":       {"name": "Mango",           "url": "https://www.mango.com",         "price_factor": (0.85, 1.15), "description": "Mediterranean-inspired contemporary fashion"},
    "puma":        {"name": "Puma",            "url": "https://www.puma.com",          "price_factor": (0.90, 1.30), "description": "Sport-inspired streetwear and footwear"},
    "levis":       {"name": "Levi's",          "url": "https://www.levi.com",          "price_factor": (0.85, 1.25), "description": "Classic denim and casual wear since 1853"},
    "tommy":       {"name": "Tommy Hilfiger",  "url": "https://www.tommy.com",         "price_factor": (1.10, 1.60), "description": "American classic lifestyle brand"},
    "newbalance":  {"name": "New Balance",     "url": "https://www.newbalance.com",    "price_factor": (1.00, 1.40), "description": "Performance and lifestyle footwear"},
    "shein":       {"name": "Shein",           "url": "https://www.shein.com",         "price_factor": (0.10, 0.35), "description": "Ultra-affordable fast fashion"},
    "zalando":     {"name": "Zalando",         "url": "https://www.zalando.com",       "price_factor": (0.75, 1.05), "description": "Europe's largest online fashion platform"},
    "gap":         {"name": "Gap",             "url": "https://www.gap.com",           "price_factor": (0.65, 1.00), "description": "Classic American casual wear"},
    "pullbear":    {"name": "Pull&Bear",       "url": "https://www.pullandbear.com",   "price_factor": (0.50, 0.80), "description": "Urban young fashion and streetwear"},
    "primark":     {"name": "Primark",         "url": "https://www.primark.com",       "price_factor": (0.15, 0.45), "description": "Budget-friendly high-street fashion"},
}

MARKETPLACES = {"amazon", "zalando", "asos"}

BRAND_TO_STORE: dict[str, str] = {
    "nike":           "nike",
    "adidas":         "adidas",
    "zara":           "zara",
    "h&m":            "hm",
    "uniqlo":         "uniqlo",
    "mango":          "mango",
    "puma":           "puma",
    "levi":           "levis",
    "levis":          "levis",
    "levi's":         "levis",
    "tommy hilfiger": "tommy",
    "tommy":          "tommy",
    "new balance":    "newbalance",
    "shein":          "shein",
    "gap":            "gap",
    "pull&bear":      "pullbear",
    "pullbear":       "pullbear",
    "primark":        "primark",
}

BRAND_EXTRA_STORES: dict[str, set[str]] = {
    "levis":    {"gap"},
    "nike":     set(),
    "adidas":   set(),
    "puma":     set(),
    "newbalance": set(),
    "tommy":    set(),
    "shein":    set(),
    "primark":  set(),
    "pullbear": set(),
}


def _relevant_store_ids(query: str, user_stores: list[str]) -> list[str]:
    normalized = query.lower()

    detected: str | None = None
    for brand, store_id in sorted(BRAND_TO_STORE.items(), key=lambda x: -len(x[0])):
        if brand in normalized:
            detected = store_id
            break

    if not detected:
        return user_stores

    allowed = {detected} | MARKETPLACES | BRAND_EXTRA_STORES.get(detected, set())
    filtered = [s for s in user_stores if s in allowed]
    return filtered if filtered else [s for s in allowed if s in STORE_DATA]


CATEGORY_PRICE_MAP = {
    "shoe": 120, "sneaker": 130, "boot": 140, "heel": 110, "loafer": 100, "sandal": 70,
    "jacket": 150, "coat": 180, "hoodie": 80, "sweater": 90, "cardigan": 85, "parka": 200,
    "dress": 100, "skirt": 70, "jeans": 90, "pants": 85, "trousers": 85, "shorts": 55, "leggings": 50,
    "shirt": 60, "t-shirt": 40, "tshirt": 40, "top": 50, "blouse": 65, "polo": 60,
    "bag": 120, "backpack": 100, "wallet": 50, "belt": 45, "purse": 130, "tote": 90,
    "watch": 200, "sunglasses": 80, "hat": 35, "cap": 35, "scarf": 45, "gloves": 40,
}

_cache: dict = {}
CACHE_TTL = 300


def _cache_key(query: str, stores: Optional[List[str]]) -> str:
    store_str = ",".join(sorted(stores)) if stores else "all"
    return f"{query.lower().strip()}|{store_str}"


def _base_price(query: str) -> float:
    normalized = query.lower().strip()
    for keyword, price in CATEGORY_PRICE_MAP.items():
        if keyword in normalized:
            seed_offset = int(hashlib.md5(normalized.encode()).hexdigest(), 16) % 40
            return float(price + seed_offset - 20)
    seed = int(hashlib.md5(normalized.encode()).hexdigest(), 16)
    return round(30 + (seed % 150), 2)


async def _fetch_store(store_id: str, query: str, base: float) -> dict:
    store = STORE_DATA[store_id]
    rng = random.Random(int(hashlib.md5(f"{query}_{store_id}".encode()).hexdigest(), 16))
    low, high = store["price_factor"]
    price = round(base * rng.uniform(low, high), 2)
    has_discount = rng.random() > 0.55
    original_price = round(price * rng.uniform(1.15, 1.5), 2) if has_discount else None
    return {
        "store_id": store_id,
        "store_name": store["name"],
        "store_url": f"{store['url']}/search?q={query.replace(' ', '+')}",
        "product_name": query,
        "price": price,
        "original_price": original_price,
        "currency": "USD",
        "in_stock": rng.random() > 0.12,
        "rating": round(rng.uniform(3.4, 5.0), 1),
        "reviews": rng.randint(12, 3500),
        "delivery_days": rng.randint(1, 7),
        "description": store["description"],
    }


async def search_product_prices(query: str, stores: Optional[List[str]] = None) -> List[dict]:
    key = _cache_key(query, stores)
    if key in _cache:
        cached_at, data = _cache[key]
        if time() - cached_at < CACHE_TTL:
            return data

    all_user_stores = stores if stores else list(STORE_DATA.keys())
    target = _relevant_store_ids(query, all_user_stores)
    base = _base_price(query)

    results = await asyncio.gather(*[_fetch_store(sid, query, base) for sid in target])
    sorted_results = sorted(results, key=lambda x: (not x["in_stock"], x["price"]))

    _cache[key] = (time(), sorted_results)
    return sorted_results
