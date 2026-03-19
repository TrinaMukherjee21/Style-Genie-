# training/preprocess_hm.py
"""
Preprocess H&M articles CSV -> products json.
Input: data/raw/articles_processed.csv
Output: data/raw/products_hm.json
"""

import pandas as pd
import json
from pathlib import Path

SRC = Path("data/raw/articles_processed.csv")
OUT = Path("data/raw/products_hm.json")

def row_to_product(row):
    return {
        "product_id": str(row.get("article_code") or row.get("product_code") or row.get("id")),
        "name": row.get("product_name") or row.get("name") or "",
        "description": row.get("product_description") or "",
        "product_group_name": row.get("product_group_name") or row.get("product_type") or "",
        "colour_group_name": row.get("colour_group_name") or row.get("color") or "",
        "gender": row.get("gender") or "",
        "price": row.get("price") if "price" in row else None,
        "image_url": row.get("image_url") or row.get("image") or ""
    }

def main():
    if not SRC.exists():
        print("Source CSV not found:", SRC)
        return
    df = pd.read_csv(SRC)
    prods = []
    for _, row in df.iterrows():
        prods.append(row_to_product(row))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(prods, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(prods)} products to {OUT}")

if __name__ == "__main__":
    main()
