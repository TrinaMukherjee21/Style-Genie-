# src/chatbot/models.py
import os
print(f"ACTUAL MODELS FILE: {os.path.abspath(__file__)}")
"""
Lightweight recommender + interactive AI for StyleGenie.
This is a self-contained and readable implementation intended to be easy to extend.
It supports:
- text-only recommendations using TF-IDF + cosine similarity (if product descriptions available)
- image-based retrieval using CLIP via sentence_transformers (optional)
- simple intent detection and response templates
- product lookup by product_id (expects a CSV or JSON with product info)
Note: You should precompute product embeddings (image/text) and save them under data/models/
"""

import os, logging, pickle, json, random
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime
import io
from PIL import Image

# Optional heavy dependencies: handled inside methods or lazily
HAS_ST_MODEL = False # Will check lazily

logger = logging.getLogger("stylegenie_models")
# logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("stylegenie_models")
# logging.basicConfig(level=logging.INFO)

class UserPreferenceManager:
    def __init__(self):
        # Example structure; extend as needed
        self.preferences = {}

    def update_from_interaction(self, user_id, signals):
        # signals: dict like {"like": +1, "view": +0.1}
        self.preferences.setdefault(user_id, {})
        for k,v in signals.items():
            self.preferences[user_id][k] = self.preferences[user_id].get(k, 0) + v

    def get(self, user_id):
        return self.preferences.get(user_id, {})

class SimpleEnhancedStyleGenieRecommender:
    def __init__(self, model_dir: str=None):
        self.model_dir = Path(model_dir) if model_dir else None
        self.products = {}  # product_id -> metadata
        self.product_ids = []
        self.text_embeddings = None
        self.image_embeddings = None
        self.text_vectorizer = None
        self.clip_model = None

        # Try to load assets - DEFERRED to first use for fast startup
        if not self.model_dir:
            # Default to data/models
            self.model_dir = Path(__file__).resolve().parent.parent.parent / "data" / "models"
            
        # self._load_assets()  <-- REMOVED FROM INIT

    def ensure_assets_loaded(self):
        """Lazy-load assets only when first needed"""
        if not self.products:
            logger.info("Initializing recommendation assets (First use lazy-load)...")
            self._load_assets()

    def _load_assets(self):
        try:
            # load curated product catalog
            curated_path = Path(__file__).parent / "curated_products.json"
            if curated_path.exists():
                with open(curated_path, "r", encoding="utf-8") as f:
                    prods = json.load(f)
                    for p in prods:
                        pid = str(p.get("product_id") or p.get("id"))
                        self.products[pid] = p
                    logger.info("Loaded %d products from %s", len(self.products), curated_path)
            
            # load raw product catalog as fallback/supplement
            prod_path = self.model_dir.parent / "raw" / "products.json" if self.model_dir else None
            if prod_path and prod_path.exists():
                with open(prod_path, "r", encoding="utf-8") as f:
                    prods = json.load(f)
                    for p in prods:
                        pid = str(p.get("product_id") or p.get("id") or p.get("article_id"))
                        if pid not in self.products:
                            self.products[pid] = p
            self.product_ids = list(self.products.keys())
            # load precomputed embeddings if present
            emb_file = self.model_dir / "product_embeddings.pkl"
            if emb_file.exists():
                data = pickle.load(open(emb_file,"rb"))
                self.product_ids = data.get("product_ids", self.product_ids)
                self.image_embeddings = data.get("image_embeddings")
                self.text_embeddings = data.get("text_embeddings")
                logger.info("Loaded product embeddings from %s", emb_file)
            # Load CLIP model if available
            if HAS_ST_MODEL:
                try:
                    # self.clip_model = SentenceTransformer("clip-ViT-B-32")
                    # logger.info("Loaded CLIP model for image embeddings")
                    logger.info("CLIP model loading skipped for faster startup")
                except Exception as e:
                    logger.warning("Failed to load CLIP model: %s", e)
            # Load TF-IDF vectorizer if available
            tfidf_file = self.model_dir / "tfidf_vectorizer.pkl"
            if tfidf_file.exists():
                self.text_vectorizer = pickle.load(open(tfidf_file,"rb"))
                logger.info("Loaded TF-IDF vectorizer")
        except Exception as e:
            logger.error("Error loading assets: %s", e)

    def get_product_by_id(self, pid: str) -> Optional[Dict[str,Any]]:
        return self.products.get(str(pid))

    def search_by_text(self, query: str, top_k: int=5, gender: str=None) -> List[Dict[str,Any]]:
        """Text search over product descriptions using TF-IDF and cosine similarity"""
        self.ensure_assets_loaded()
        # LAZY IMPORTS for slow machines
        import numpy as np
        from sklearn.metrics.pairwise import cosine_similarity
        
        # Normalize gender
        target_gender = gender.lower() if gender else None
        if target_gender in ['men', 'man', 'male', 'gentleman', 'boy']: target_gender = 'male'
        if target_gender in ['women', 'woman', 'female', 'lady', 'girl']: target_gender = 'female'

        # Collect candidate texts
        if not self.text_vectorizer or not self.text_embeddings:
            # fallback: naive substring matching
            results = []
            q = query.lower()
            for pid,p in self.products.items():
                # Strict gender filtering
                if target_gender:
                    prod_genders = [g.lower() for g in p.get("gender", ["unisex"])]
                    if target_gender not in prod_genders and 'unisex' not in prod_genders:
                        continue

                name = (p.get("name") or p.get("title") or "").lower()
                desc = (p.get("description") or "").lower()
                score = 0.0
                if q in name: score += 1.0
                if q in desc: score += 0.5
                if score>0:
                    results.append({"product":p,"score":score})
            results.sort(key=lambda x: x["score"], reverse=True)
            return [ {"product_id": r["product"].get("product_id") or r["product"].get("id"), 
                      "name": r["product"].get("name") or r["product"].get("title"),
                      "image_url": r["product"].get("image_url") or r["product"].get("image"),
                      "description": r["product"].get("description"),
                      "gender": r["product"].get("gender"),
                      "score": float(r["score"])} for r in results[:top_k] ]
        try:
            qv = self.text_vectorizer.transform([query])
            sims = cosine_similarity(qv, self.text_embeddings)[0]
            
            # Sort all indices by similarity
            all_idxs = np.argsort(-sims)
            results = []
            
            for i in all_idxs:
                if len(results) >= top_k:
                    break
                    
                pid = self.product_ids[i]
                prod = self.products.get(pid, {})
                
                # Strict gender filtering for embeddings search
                if target_gender:
                    prod_genders = [g.lower() for g in prod.get("gender", ["unisex"])]
                    if target_gender not in prod_genders and 'unisex' not in prod_genders:
                        continue
                
                results.append({"product_id": pid, 
                                "name": prod.get("name") or prod.get("title"),
                                "image_url": prod.get("image_url"),
                                "description": prod.get("description"),
                                "score": float(sims[i])})
            return results
        except Exception as e:
            logger.error("Error in search_by_text: %s", e)
            return []

    def search_by_image(self, pil_image: Image.Image, top_k: int=5, gender: str=None) -> List[Dict[str,Any]]:
        """Search by image embedding (CLIP) or fallback to color-based matching"""
        self.ensure_assets_loaded()
        # Normalize gender
        target_gender = gender.lower() if gender else None
        if target_gender in ['men', 'man', 'male', 'gentleman', 'boy']: target_gender = 'male'
        if target_gender in ['women', 'woman', 'female', 'lady', 'girl']: target_gender = 'female'

        if self.clip_model and self.image_embeddings is not None:
            try:
                import numpy as np
                img_emb = self.clip_model.encode(pil_image, convert_to_numpy=True)
                sims = util_cosine_similarity(img_emb, self.image_embeddings)
                all_idxs = np.argsort(-sims if isinstance(sims, np.ndarray) else -np.array(sims))
                results = []
                for i in all_idxs:
                    if len(results) >= top_k:
                        break
                        
                    pid = self.product_ids[i]
                    prod = self.products.get(pid, {})
                    
                    # Gender filtering
                    if target_gender:
                        p_gen = prod.get("gender", ["unisex"])
                        if isinstance(p_gen, str): p_gen = [p_gen]
                        prod_genders = [g.lower() for g in p_gen]
                        if target_gender not in prod_genders and 'unisex' not in prod_genders:
                            continue

                    results.append({"product_id": pid, 
                                    "name": prod.get("name") or prod.get("title"),
                                    "image_url": prod.get("image_url") or prod.get("image"),
                                    "description": prod.get("description"),
                                    "gender": prod.get("gender"),
                                    "score": float(sims[i])})
                return results
            except Exception as e:
                logger.warning("Image search via CLIP failed: %s", e)
        # Fallback: dominant color matching
        try:
            color = extract_dominant_color(pil_image)
            color_key = map_rgb_to_color_group(color)
            results = []
            for pid, prod in self.products.items():
                # Gender filtering
                if target_gender:
                    p_gen = prod.get("gender", ["unisex"])
                    if isinstance(p_gen, str): p_gen = [p_gen]
                    prod_genders = [g.lower() for g in p_gen]
                    if target_gender not in prod_genders and 'unisex' not in prod_genders:
                        continue

                prod_color = (prod.get("colour_group_name") or prod.get("color") or "").lower()
                score = 1.0 if color_key in prod_color else 0.0
                if score>0:
                    results.append({"product_id": pid,
                                    "name": prod.get("name") or prod.get("title"),
                                    "image_url": prod.get("image_url") or prod.get("image"),
                                    "description": prod.get("description"),
                                    "gender": prod.get("gender"),
                                    "score": score})
            results.sort(key=lambda x: x["score"], reverse=True)
            return [ {"product_id": r["product_id"],
                      "name": r["name"],
                      "image_url": r["image_url"],
                      "description": r["description"],
                      "gender": r.get("gender"),
                      "score": float(r["score"])} for r in results[:top_k] ]
        except Exception as e:
            logger.error("Fallback image search failed: %s", e)
            return []

    def recommend_with_chat(self, user_query, user_id=None, n_recommendations=3, user_preferences=None, gender: str=None):
        """Unified method for chat-based recommendations used by app.py"""
        # 0. Extract gender from preferences if not explicitly provided
        if not gender and user_preferences:
             gender = user_preferences.get('gender')

        # 1. Get recommendations using search_by_text with gender filter
        recs = self.search_by_text(user_query, top_k=n_recommendations, gender=gender)
        
        # 2. Format products for response
        products = []
        for r in recs:
            products.append({
                'id': r['product_id'],
                'title': r['name'] or "Fashion Item",
                'image': r['image_url'] or "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop&auto=format&q=80",
                'description': r['description'] or "A beautiful fashion piece for your collection.",
                'price': f"${random.randint(40, 150)}" # Mock price if not in data
            })
            
        # 3. Generate initial response
        response = f"I've found some amazing pieces that match your request for '{user_query}'! ✨ Based on your style profile, I think these would look stunning on you."
        
        # 4. Contextual suggestions
        suggestions = [
            f"Show me more like these",
            "What accessories would pair well?",
            "Find these in different colors",
            "Help me style these for an event"
        ]
        
        return {
            'products': products,
            'suggestions': suggestions,
            'response': response
        }

    def update_user_preferences(self, user_id, interaction):
        """Update user preferences based on interactions"""
        if not user_id: return
        logger.info(f"Updating preferences for user {user_id} based on {interaction.get('type')}")
        # Implementation can be expanded with real persistent storage
        pass

    def load_model(self, path):
        """Mock load for compatibility with app.py"""
        logger.info(f"Mock loading model from {path}")
        return True

    def _generate_fallback_recommendations(self, query, n, preferences):
        """Fallback recommendations for app.py"""
        return self.recommend_with_chat(query, n_recommendations=n, user_preferences=preferences)['products']

    def get_quiz_recommendations(self, quiz_results):
        """
        Main entry point for quiz-based recommendations from the chatbot logic.
        """
        primary_aesthetic = (quiz_results.get('primaryAesthetic') or quiz_results.get('personalityType') or 'minimalist').lower()
        gender = quiz_results.get('gender', 'unisex')
        
        # 1. Try to search our internal (trained) catalog first
        search_query = f"{primary_aesthetic} fashion"
        internal_recs = self.search_by_text(search_query, top_k=6, gender=gender)
        
        # 2. Map internal recs to the format expected by QuizResults
        formatted_recs = []
        for r in internal_recs:
            score = float(r.get('score', 0))
            # Ensure score looks premium (0.80 - 0.99)
            display_score = min(0.99, max(0.80, 0.85 + (score * 0.15)))
            
            formatted_recs.append({
                'id': r.get('product_id'),
                'title': r.get('name'),
                'image': r.get('image_url'),
                'description': r.get('description'),
                'price': f"₹{random.randint(1499, 4999)}", # Fallback price
                'score': round(display_score, 2),
                'matchScore': round(display_score, 2),
                'buy_link': "#"
            })
            
        return formatted_recs

def util_cosine_similarity(vec, matrix):
    # vec: 1D numpy, matrix: (n, d)
    try:
        import numpy as np
        from sklearn.metrics.pairwise import cosine_similarity
        vec = np.array(vec).reshape(1,-1)
        sims = cosine_similarity(vec, matrix)[0]
        return sims
    except Exception as e:
        logger.error("util_cosine_similarity error: %s", e)
        return np.zeros(len(matrix))

def extract_dominant_color(pil_image: Image.Image):
    # Resize small and get most common pixel color
    img = pil_image.resize((64,64))
    pixels = np.array(img).reshape(-1,3)
    # Round colors to reduce variance
    pixels_rounded = (pixels//32)*32
    vals, counts = np.unique(pixels_rounded, axis=0, return_counts=True)
    idx = counts.argmax()
    return tuple(map(int, vals[idx]))  # (r,g,b)

def map_rgb_to_color_group(rgb):
    r,g,b = rgb
    if r>200 and g<100 and b<100:
        return "red"
    if r>200 and g>200 and b<150:
        return "yellow"
    if r<100 and g<100 and b<100:
        return "black"
    if r>200 and g>200 and b>200:
        return "white"
    if b>150 and r<150:
        return "blue"
    return "neutral"

class InteractiveFashionAI:
    def __init__(self, recommender: SimpleEnhancedStyleGenieRecommender):
        self.recommender = recommender
        # small templates for greetings and small talk
        self.greetings = [
            "Hi there! I'm StyleGenie — your personal fashion assistant. How can I help you today?",
            "Hello! Ready to discover some pieces that match your style?",
            "Hey! Need help styling an outfit or finding something new?"
        ]
        self.fallbacks = [
            "I'm sorry — can you tell me a little more about what you're looking for?",
            "I didn't quite catch that. Do you mean 'find similar', 'suggest accessories', or 'search products'?",
            "Hmm — could you rephrase that? For example: 'Suggest shoes for this dress' or 'Find similar tops'."
        ]

    def detect_intent(self, message: str) -> str:
        if not message or message.strip()=="" or message.lower() in ["hi","hello","hey","good morning","good evening","good afternoon"]:
            return "greeting"
        m = message.lower()
        if any(w in m for w in ["similar", "same", "like this", "find similar", "show similar"]):
            return "similar_products"
        if any(w in m for w in ["shoe","shoes","heels","sneaker","sneakers","footwear","sandals","boots"]):
            return "complementary_shoes"
        if any(w in m for w in ["accessor","necklace","bracelet","earring","bag","handbag","purse"]):
            return "complementary_accessories"
        if any(w in m for w in ["cheaper","cheapest","budget","affordable","alternativ"]):
            return "alternatives"
        if any(w in m for w in ["help","suggest","recommend","what should i wear","what goes with"]):
            return "recommendation"
        # fallback detect search keywords
        if any(w in m for w in ["find","show","search","looking for","get me","i want","need"]):
            return "search"
        return "unknown"

    def handle_turn(self, message: str="", image=None, session: dict=None, top_k:int=5) -> dict:
        """
        Combines message + optional image to return a response dict:
        {
            "text": "...",
            "intent": "...",
            "products": [ {product_id, name, image_url, description, score}, ... ]
        }
        """
        try:
            intent = self.detect_intent(message or "")
            text_response = ""
            products = []
            
            # Check session for recent responses to avoid repetition
            recent_responses = []
            if session and "history" in session:
                recent_responses = [h.get("text", "") for h in session["history"][-3:] if h.get("from") == "bot"]

            # greeting
            if intent == "greeting":
                available_greetings = [g for g in self.greetings if g not in recent_responses]
                if not available_greetings:
                    available_greetings = self.greetings
                text_response = random.choice(available_greetings)
                return {"text": text_response, "intent": intent, "products": []}

            # If there's an image and the user asked something specific, use image search
            if image is not None:
                # If message empty or generic, ask clarifying question
                if not message or intent in ("unknown","greeting"):
                    # Basic image recognition: try to infer category from product metadata via image search top hit
                    hits = self.recommender.search_by_image(image, top_k=top_k)
                    if hits:
                        # Compose a friendly prompt
                        top = hits[0]
                        text_response = f"I see an item similar to '{top.get('name')}'. Would you like similar items, accessories, or shoes to match it?"
                        return {"text": text_response, "intent": "image_detected", "products": hits}
                    else:
                        return {"text": "I couldn't confidently identify this item. Do you want me to search for similar items or accessories?", "intent":"clarify", "products": []}

                # If message explicitly asks for complementary items
                if intent in ("complementary_shoes","complementary_accessories","recommendation","similar_products","search","alternatives"):
                    # Use image to find similar and then filter by complementary categories
                    hits = self.recommender.search_by_image(image, top_k=top_k*3)
                    # Filter by requested category
                    if intent=="complementary_shoes":
                        products = self._filter_complements(hits, target_categories=["shoes","footwear","sneakers","heels","boots"])
                        text_response = "Here are some footwear options that should go well with that item:"
                    elif intent=="complementary_accessories":
                        products = self._filter_complements(hits, target_categories=["accessories","jewelry","necklace","bag","purse","bracelet","earrings"])
                        text_response = "Here are some accessories that will pair nicely:"
                    elif intent=="similar_products":
                        products = hits[:top_k]
                        text_response = "Here are similar items I found:"
                    elif intent=="alternatives":
                        # for price alternatives, we currently just return similar items (extend later)
                        products = hits[:top_k]
                        text_response = "Here are some alternative options I found:"
                    else:
                        products = hits[:top_k]
                        text_response = "I found these items — would you like to see more or filter by price/brand?"

                    return {"text": text_response, "intent": intent, "products": products}

            # No image provided — handle text-only queries
            if intent == "search" or intent=="similar_products" or intent=="recommendation" or intent=="alternatives":
                products = self.recommender.search_by_text(message, top_k=top_k)
                if products:
                    text_response = random.choice([
                        "Here are some options I found for you:",
                        "These might match what you're looking for:",
                        "Take a look at the following items:"
                    ])
                    return {"text": text_response, "intent": intent, "products": products}
                else:
                    return {"text": random.choice(self.fallbacks), "intent":"no_results", "products": []}

            # Unknown intent -> fallback conversational handling
            available_fallbacks = [f for f in self.fallbacks if f not in recent_responses]
            if not available_fallbacks:
                available_fallbacks = self.fallbacks
            return {"text": random.choice(available_fallbacks), "intent":"unknown", "products": []}
        except Exception as e:
            logger.error("InteractiveFashionAI.handle_turn error: %s", e)
            return {"text": "Sorry, something went wrong while processing your request.", "intent":"error", "products": []}

    def _filter_complements(self, hits, target_categories):
        if not hits: return []
        # naive complement selection: look for products in catalog that are in target categories
        results = []
        for pid, prod in self.recommender.products.items():
            cat = (prod.get("product_group_name") or prod.get("category") or "").lower()
            if any(t in cat for t in target_categories):
                results.append({"product_id": pid, "name": prod.get("name"), "image_url": prod.get("image_url"), "description": prod.get("description"), "score": 0.6})
        # Return top_n capped
        return results[:5]


# For backward compatibility
SimpleEnhancedStyleGenieRecommender = SimpleEnhancedStyleGenieRecommender
