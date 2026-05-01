# chatbot/flask_api.py
from flask import Flask, request, jsonify, send_file # type: ignore
from flask_cors import CORS # type: ignore
import os, sys, logging, io, base64, traceback
from datetime import datetime
from pathlib import Path
from PIL import Image # type: ignore
from dotenv import load_dotenv

# Load .env from project root
project_root = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=project_root / ".env")

# Ensure local package import works
current_dir = Path(__file__).resolve().parent
sys.path.append(str(current_dir))
sys.path.append(str(current_dir.parent)) # for modules in src/

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stylegenie_api")

# Import Gemini Service
try:
    from gemini_service import gemini_service
    logger.info("Gemini Service loaded successfully")
except ImportError:
    logger.error("Could not import gemini_service. Gemini-based chat will be disabled.")
    gemini_service = None

# Import live search tools
try:
    from browser_search import get_live_recommendations, search_products_advanced
except ImportError:
    logger.warning("Could not import browser_search. Live search will be disabled.")
    def get_live_recommendations(*args, **kwargs): return []
    def search_products_advanced(*args, **kwargs): return []

# Fallback bot class to satisfy linter and provide safe default
class FallbackBot:
    def process_message(self, user_id, message, chat_id=None):
        return {
            'success': True,
            'response': {
                'text': "I'm here to help with your fashion needs! Tell me more about what you're looking for.",
                'suggestions': [],
                'products': []
            }
        }

    def get_quiz_recommendations(self, quiz_results):
        return []

# Initial default
empathetic_bot = FallbackBot()

try:
    from empathetic_fashion_bot import empathetic_bot as loaded_bot # type: ignore
    if loaded_bot:
        empathetic_bot = loaded_bot
        logger.info("Empathetic Fashion Bot loaded successfully")
except Exception as e:
    logger.error(f"Failed to load empathetic bot: {e}\n{traceback.format_exc()}")

app = Flask(__name__)
CORS(app)

logger.info("StylesGenie API Initializing...")

# Simple in-memory session store
SESSIONS = {}

def get_session(user_id: str):
    if not user_id:
        user_id = "guest"
    if user_id not in SESSIONS:
        SESSIONS[user_id] = {"history": [], "created": datetime.utcnow().isoformat()}
    return SESSIONS[user_id]

@app.route("/images/<path:filename>")
def serve_image(filename):
    try:
        basename = os.path.basename(filename)
        name, ext = os.path.splitext(basename)
        padded_name = name.zfill(10)
        subfolder = padded_name[:3]
        
        project_root = Path(__file__).resolve().parent.parent.parent
        img_path = project_root / "data" / "raw" / "images" / subfolder / f"{padded_name}{ext}"
        
        if img_path.exists():
            return send_file(img_path)
        else:
            return "Image not found", 404
    except Exception as e:
        logger.error(f"Error serving image: {e}")
        return str(e), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok", 
        "time": datetime.utcnow().isoformat(),
        "empathetic_bot_available": empathetic_bot is not None,
        "api_version": "7.0 - Unified Fashion AI",
        "features": {
            "emotion_detection": True,
            "therapeutic_responses": True,
            "quiz_recommendations": True
        }
    })

# Deprecated /chat route - moving to /api/chat for Gemini
@app.route("/chat", methods=["POST"])
def chat():
    try:
        payload = request.get_json(force=True)
        user_id = payload.get("user_id", "guest")
        message = (payload.get("message") or "").strip()
        
        # Get response from empathetic bot (Legacy)
        result = empathetic_bot.process_message(user_id, message, chat_id=payload.get('chat_id'))
        return jsonify({"success": result['success'], "response": result['response']})

    except Exception as e:
        logger.error("Error in /chat: %s\n%s", e, traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/chat", methods=["POST"])
def api_chat():
    try:
        if not gemini_service:
            return jsonify({"success": False, "error": "Gemini Service not available"}), 503
            
        payload = request.get_json(force=True)
        message = payload.get("message", "").strip()
        history = payload.get("history", [])
        image_data = payload.get("imageData") or payload.get("image_data")
        
        if not message and not image_data:
            return jsonify({"success": False, "error": "No message or image provided"}), 400
            
        response_text = gemini_service.generate_response(message, history, image_data)
        
        # Format response to match frontend expectation
        return jsonify({
            "success": True,
            "response": {
                "text": response_text,
                "status": "success"
            }
        })

    except Exception as e:
        logger.error("Error in /api/chat: %s\n%s", e, traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/quiz/recommendations", methods=["POST", "GET"])
def quiz_recommendations():
    """Quiz recommendations endpoint"""
    try:
        if request.method == "GET":
            return jsonify({"success": True, "recommendations": []})
        
        payload = request.get_json(force=True)
        user_id = payload.get("user_id", "guest")
        quiz_results = payload.get("quizResults") or payload.get("quiz_results") or {}
        
        # Get accurate recommendations from the bot
        recommendations = empathetic_bot.get_quiz_recommendations(quiz_results)
        
        return jsonify({
            "success": True,
            "products": recommendations, # Change to 'products' to match frontend expectation
            "user_id": user_id
        })

    except Exception as e:
        logger.error("Error in /api/quiz/recommendations: %s", e)
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/catalog", methods=["GET"])
def get_catalog():
    """Serve the complete curated product catalog"""
    try:
        catalog_path = Path(__file__).parent / "curated_products.json"
        if catalog_path.exists():
            return send_file(catalog_path)
        return jsonify({"success": False, "error": "Catalog not found"}), 404
    except Exception as e:
        logger.error("Error in /api/catalog: %s", e)
        return str(e), 500

@app.route('/api/recommendations/live-search', methods=['POST'])
def live_browser_search():
    """
    Search the live web explicitly using Google Shopping (Serper API) 
    and scraping to find appropriate products without mismatches.
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        user_profile = data.get('userProfile', {})
        
        # Determine exact keywords
        gender = user_profile.get('gender') or data.get('gender', 'unisex')
        # Safely extract from primary aesthetics or personality
        primary_aesthetic = user_profile.get('primaryAesthetic') or user_profile.get('personalityType', 'minimalist')
        traits = user_profile.get('traits', [])
        
        tags = [primary_aesthetic] + traits
        logger.info(f"Initiating live search endpoint for gender={gender}, tags={tags}")
        
        results = get_live_recommendations(gender, tags, limit=6)
        
        return jsonify({
            'success': True,
            'products': results,
            'aestheticStyle': primary_aesthetic
        })
        
    except Exception as e:
        logger.error(f"Error in Live browser search endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'products': []
        }), 500

@app.route('/api/products/search', methods=['POST'])
def search_products():
    """
    General purpose search with filters for the main Products page.
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        search_term = data.get('searchTerm', '')
        filters = data.get('filters', {})
        limit = data.get('limit', 20)
        
        logger.info(f"Product search request: '{search_term}', filters: {filters}")
        
        results = search_products_advanced(search_term, filters, limit=limit)
        
        return jsonify({
            'success': True,
            'products': results,
            'count': len(results)
        })
        
    except Exception as e:
        logger.error(f"Error in Product search endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'products': []
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)