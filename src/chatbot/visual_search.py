# chatbot/visual_search.py
"""
Visual Search component for StyleGenie.

Features:
- Uses CLIP via sentence-transformers (if available) to encode images and perform similarity search
  against precomputed product image embeddings.
- Falls back to dominant color matching + category heuristics when embeddings are missing.
- Maps natural language queries to intents (similar, complementary_shoes, complementary_accessories, alternatives).
- Returns consistent product JSON entries with product_id, name, image_url, description, score.

Usage:
  from chatbot.visual_search import VisualSearch
  vs = VisualSearch(products_path="data/raw/products.json",
                    embeddings_path="data/models/product_embeddings.pkl")
  results = vs.search(image=pil_image, query="suggest shoes", top_k=5)
"""

import os
import json
import pickle
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple

import numpy as np
from PIL import Image

logger = logging.getLogger("stylegenie_visual_search")
# logging.basicConfig(level=logging.INFO)

# Optional dependency: sentence-transformers (CLIP) - DEFERRED to lazy loading
HAS_ST_MODEL = True # Assume true for checking, will verify on first load
SentenceTransformer = None
util = None

# Small utility functions -----------------------------------------------------

def extract_dominant_color(pil_image: Image.Image) -> Tuple[int,int,int]:
    """Return rounded dominant color (r,g,b)"""
    img = pil_image.resize((64,64))
    pixels = np.array(img).reshape(-1,3)
    pixels_rounded = (pixels // 32) * 32
    vals, counts = np.unique(pixels_rounded, axis=0, return_counts=True)
    idx = counts.argmax()
    return tuple(map(int, vals[idx]))

def map_rgb_to_color_group(rgb: Tuple[int,int,int]) -> str:
    r,g,b = rgb
    if r>200 and g<120 and b<120:
        return "red"
    if b>150 and r<150 and g<150:
        return "blue"
    if r>200 and g>200 and b<150:
        return "yellow"
    if r<100 and g<100 and b<100:
        return "black"
    if r>200 and g>200 and b>200:
        return "white"
    return "neutral"

def cosine_similarities(vec: np.ndarray, matrix: np.ndarray) -> np.ndarray:
    # vec: (d,) or (1,d); matrix: (n,d)
    if matrix is None:
        return np.array([])
    vec = np.array(vec).reshape(1,-1)
    # normalize
    ve = vec / (np.linalg.norm(vec, axis=1, keepdims=True) + 1e-9)
    me = matrix / (np.linalg.norm(matrix, axis=1, keepdims=True) + 1e-9)
    sims = (ve @ me.T)[0]
    return sims

# VisualSearch class ---------------------------------------------------------

class VisualSearch:
    def __init__(self,
                 products_path: Optional[str] = None,
                 embeddings_path: Optional[str] = None,
                 clip_model_name: str = "clip-ViT-B-32"):
        """
        products_path: path to JSON array of product objects (product_id, name, image_url, description, product_group_name, colour_group_name)
        embeddings_path: path to pickle with {"product_ids": [...], "image_embeddings": numpy_array, "text_embeddings": optional}
        """
        self.products_path = Path(products_path) if products_path else None
        self.embeddings_path = Path(embeddings_path) if embeddings_path else None

        self.products: Dict[str, Dict[str,Any]] = {}
        self.product_ids: List[str] = []
        self.image_embeddings: Optional[np.ndarray] = None
        self.text_embeddings: Optional[np.ndarray] = None

        # CLIP model (optional)
        self.clip_model = None
        self.clip_model_name = clip_model_name if HAS_ST_MODEL else None

        # Load data if available
        if self.products_path and self.products_path.exists():
            self._load_products(self.products_path)
        if self.embeddings_path and self.embeddings_path.exists():
            self._load_embeddings(self.embeddings_path)

        # Try load CLIP model - DEFERRED to ensure_model_loaded
        pass

    def ensure_model_loaded(self):
        """Lazy-load the CLIP model only when actually used"""
        global SentenceTransformer, util, HAS_ST_MODEL
        if HAS_ST_MODEL and self.clip_model is None:
            try:
                logger.info("Initializing CLIP model (First use lazy-load)...")
                from sentence_transformers import SentenceTransformer, util
                self.clip_model = SentenceTransformer(self.clip_model_name)
                logger.info("Loaded CLIP model: %s", self.clip_model_name)
            except Exception as e:
                logger.warning("Could not load CLIP model: %s", e)
                HAS_ST_MODEL = False
                self.clip_model = None

    # Loading helpers -------------------------------------------------------
    def _load_products(self, path: Path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                prods = json.load(f)
                for p in prods:
                    pid = str(p.get("product_id") or p.get("id") or p.get("article_id"))
                    if pid:
                        self.products[pid] = p
                self.product_ids = list(self.products.keys())
            logger.info("Loaded %d products from %s", len(self.product_ids), path)
        except Exception as e:
            logger.error("Failed to load products: %s", e)

    def _load_embeddings(self, path: Path):
        try:
            with open(path, "rb") as f:
                data = pickle.load(f)
            pids = data.get("product_ids")
            img_emb = data.get("image_embeddings")
            txt_emb = data.get("text_embeddings")
            if pids and img_emb is not None:
                self.product_ids = pids
                self.image_embeddings = np.array(img_emb)
                # ensure product_ids match loaded products where possible
                logger.info("Loaded image embeddings for %d products", len(self.product_ids))
            if txt_emb is not None:
                self.text_embeddings = np.array(txt_emb)
        except Exception as e:
            logger.error("Failed to load embeddings: %s", e)

    # Intent mapping -------------------------------------------------------
    def map_query_to_intent(self, query: Optional[str]) -> str:
        q = (query or "").lower()
        if not q or q.strip()=="":
            return "unknown"
        if any(w in q for w in ["shoe","shoes","heels","sneaker","sneakers","footwear","sandals","boots"]):
            return "complementary_shoes"
        if any(w in q for w in ["accessor","necklace","bracelet","earring","bag","handbag","purse","belt"]):
            return "complementary_accessories"
        if any(w in q for w in ["similar","same","like this","find similar","show similar"]):
            return "similar_products"
        if any(w in q for w in ["cheaper","cheapest","budget","affordable","alternativ","other options","similar but"]):
            return "alternatives"
        if any(w in q for w in ["what goes with","what should i wear","recommend","suggest","help me"]):
            return "recommendation"
        if any(w in q for w in ["find","show","search","looking for","i want","need","get me"]):
            return "search"
        return "unknown"

    # Core search functions ------------------------------------------------
    def _nearest_by_image_embedding(self, pil_image: Image.Image, top_k: int=5) -> List[Dict[str,Any]]:
        """Use CLIP model (if available) to encode uploaded image and find nearest product images."""
        self.ensure_model_loaded()
        if self.clip_model is None or self.image_embeddings is None:
            return []

        try:
            # clip encode
            emb = self.clip_model.encode(pil_image, convert_to_numpy=True)
            sims = cosine_similarities(emb, self.image_embeddings)
            idxs = np.argsort(-sims)[:top_k]
            results = []
            for i in idxs:
                pid = self.product_ids[i]
                prod = self.products.get(pid, {})
                results.append({
                    "product_id": pid,
                    "name": prod.get("name") or prod.get("title"),
                    "image_url": prod.get("image_url"),
                    "description": prod.get("description"),
                    "score": float(sims[i])
                })
            return results
        except Exception as e:
            logger.warning("Nearest by image embedding failed: %s", e)
            return []

    def _dominant_color_search(self, pil_image: Image.Image, top_k: int=10) -> List[Dict[str,Any]]:
        """Fallback: match based on dominant color then return candidates (score 1 if color matches)."""
        try:
            rgb = extract_dominant_color(pil_image)
            color_key = map_rgb_to_color_group(rgb)
            candidates = []
            for pid, prod in self.products.items():
                pc = (prod.get("colour_group_name") or prod.get("color") or prod.get("colour") or "").lower()
                score = 1.0 if color_key in pc else 0.0
                if score>0:
                    candidates.append({
                        "product_id": pid,
                        "name": prod.get("name"),
                        "image_url": prod.get("image_url"),
                        "description": prod.get("description"),
                        "score": float(score)
                    })
            candidates.sort(key=lambda x: -x["score"])
            return candidates[:top_k]
        except Exception as e:
            logger.error("Dominant color search failed: %s", e)
            return []

    def _filter_by_category(self, candidates: List[Dict[str,Any]], target_categories: List[str], top_k: int=5) -> List[Dict[str,Any]]:
        if not candidates:
            # fallback: search entire catalog for target categories
            found = []
            for pid, prod in self.products.items():
                cat = (prod.get("product_group_name") or prod.get("category") or "").lower()
                if any(t in cat for t in target_categories):
                    found.append({
                        "product_id": pid,
                        "name": prod.get("name"),
                        "image_url": prod.get("image_url"),
                        "description": prod.get("description"),
                        "score": 0.6
                    })
            return found[:top_k]
        # Filter candidates by category if product metadata present
        filtered = []
        for c in candidates:
            pid = str(c.get("product_id"))
            prod = self.products.get(pid) or {}
            cat = (prod.get("product_group_name") or prod.get("category") or "").lower()
            if any(t in cat for t in target_categories):
                filtered.append(c)
        if not filtered:
            return candidates[:top_k]
        return filtered[:top_k]

    # Public API -----------------------------------------------------------
    def search(self,
               image: Optional[Image.Image] = None,
               query: Optional[str] = None,
               intent: Optional[str] = None,
               top_k: int = 5) -> Dict[str,Any]:
        """
        Main entrypoint.

        Returns dict:
        {
          "intent": "...",
          "query_object": "detected object or label (best-match product name)",
          "results": [ {product_id,name,image_url,description,score}, ... ]
        }
        """
        detected_intent = intent or self.map_query_to_intent(query)
        results = []
        query_object = None

        # If image exists, prefer image-based retrieval
        if image is not None:
            # First try embeddings-based nearest
            hits = self._nearest_by_image_embedding(image, top_k=top_k*3)
            if hits:
                query_object = hits[0]["name"] if hits[0].get("name") else None
            else:
                # fallback color-based
                hits = self._dominant_color_search(image, top_k=top_k*3)
                if hits:
                    query_object = hits[0]["name"]

            # Decide what to return based on intent
            if detected_intent in ("complementary_shoes", "complementary_accessories"):
                # Choose a target category list
                if detected_intent == "complementary_shoes":
                    target_categories = ["shoe","footwear","sneaker","heel","boots","sandals"]
                else:
                    target_categories = ["accessory","jewelry","necklace","bag","purse","belt","scarf"]

                # Best approach: find matching items in catalog by category
                results = self._filter_by_category(hits, target_categories, top_k=top_k)
                # If not enough, append filtered global category results
                if len(results) < top_k:
                    fallback = self._filter_by_category([], target_categories, top_k=top_k)
                    for r in fallback:
                        if r["product_id"] not in {x["product_id"] for x in results}:
                            results.append(r)
                # Return
                return {"intent": detected_intent, "query_object": query_object, "results": results[:top_k]}

            # For similar / recommendation intents — return top hits
            if detected_intent in ("similar_products","recommendation","search","alternatives","unknown"):
                results = hits[:top_k]
                return {"intent": detected_intent, "query_object": query_object, "results": results}

            # default
            results = hits[:top_k]
            return {"intent": detected_intent, "query_object": query_object, "results": results}

        # If no image: fallback to text search (basic)
        if not query:
            return {"intent": detected_intent, "query_object": None, "results": []}

        # Text-only path: naive substring match over product name/description
        q = query.lower()
        candidates = []
        for pid, prod in self.products.items():
            name = (prod.get("name") or prod.get("title") or "").lower()
            desc = (prod.get("description") or "").lower()
            score = 0.0
            if q in name: score += 1.0
            if q in desc: score += 0.5
            if score > 0:
                candidates.append({"product_id": pid, "name": prod.get("name"), "image_url": prod.get("image_url"), "description": prod.get("description"), "score": float(score)})
        candidates.sort(key=lambda x: -x["score"])
        return {"intent": detected_intent, "query_object": None, "results": candidates[:top_k]}

    # Utility: product lookup ------------------------------------------------
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str,Any]]:
        return self.products.get(str(product_id))

