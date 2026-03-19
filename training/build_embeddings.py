# training/build_embeddings.py
"""
Build embeddings for product catalog:
- image_embeddings: CLIP model encoding of product images
- text_embeddings: sentence-transformer encoding of product name+description

Saves: data/models/product_embeddings.pkl
"""

import os, sys, argparse, json, pickle
from pathlib import Path
from tqdm import tqdm
import numpy as np
from PIL import Image
import requests
from io import BytesIO

def safe_open_image(url_or_path):
    try:
        if os.path.exists(url_or_path):
            return Image.open(url_or_path).convert("RGB")
        else:
            r = requests.get(url_or_path, timeout=10)
            r.raise_for_status()
            return Image.open(BytesIO(r.content)).convert("RGB")
    except Exception as e:
        return None

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--products", default="data/raw/products_hm.json")
    p.add_argument("--out", default="data/models/product_embeddings.pkl")
    p.add_argument("--clip_model", default="clip-ViT-B-32")
    p.add_argument("--text_model", default="all-MiniLM-L6-v2")
    args = p.parse_args()

    from sentence_transformers import SentenceTransformer

    prod_path = Path(args.products)
    if not prod_path.exists():
        raise SystemExit("Products file not found: " + str(prod_path))

    with open(prod_path, "r", encoding="utf-8") as f:
        products = json.load(f)

    # Load models
    print("Loading models...")
    clip = SentenceTransformer(args.clip_model)   # CLIP for images
    text_model = SentenceTransformer(args.text_model)

    ids = []
    image_embs = []
    text_embs = []

    for pinfo in tqdm(products, desc="Products"):
        pid = str(pinfo.get("product_id"))
        ids.append(pid)

        # Text embedding from name + description
        txt = (pinfo.get("name") or "") + " . " + (pinfo.get("description") or "")
        try:
            t_emb = text_model.encode(txt, convert_to_numpy=True)
        except Exception as e:
            t_emb = None
        text_embs.append(t_emb)

        # Image embedding: try image_url
        img_emb = None
        url = pinfo.get("image_url") or ""
        if url:
            img = safe_open_image(url)
            if img is not None:
                try:
                    img_emb = clip.encode(img, convert_to_numpy=True)
                except Exception as e:
                    img_emb = None
        image_embs.append(img_emb)

    # Convert lists -> arrays; for missing embeddings we use zeros or None placeholders
    img_arr = None
    text_arr = None

    # Build image array for entries that have image embeddings
    valid_img_idxs = [i for i,e in enumerate(image_embs) if e is not None]
    if valid_img_idxs:
        img_arr = np.vstack([image_embs[i] for i in valid_img_idxs])
    else:
        img_arr = None

    valid_text_idxs = [i for i,e in enumerate(text_embs) if e is not None]
    if valid_text_idxs:
        text_arr = np.vstack([text_embs[i] for i in valid_text_idxs])
    else:
        text_arr = None

    out_obj = {
        "product_ids": ids,
        "image_embeddings": image_embs,   # keep full list (some None)
        "text_embeddings": text_embs,    # full list
        "valid_image_idxs": valid_img_idxs,
        "valid_text_idxs": valid_text_idxs
    }

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    with open(args.out, "wb") as f:
        pickle.dump(out_obj, f)

    print("Saved embeddings to", args.out)
    print("Products:", len(ids))
    print("Image embeddings available:", len(valid_img_idxs))
    print("Text embeddings available:", len(valid_text_idxs))

if __name__ == "__main__":
    main()
