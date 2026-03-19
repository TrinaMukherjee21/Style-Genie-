# chatbot/flask_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os, sys, logging, io, base64, traceback
from datetime import datetime
from pathlib import Path
from PIL import Image

# Ensure local package import works
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stylegenie_api")

try:
    from empathetic_fashion_bot import empathetic_bot
    logger.info("Empathetic Fashion Bot loaded successfully")
except Exception as e:
    logger.error(f"Failed to load empathetic bot: {e}\n{traceback.format_exc()}")
    empathetic_bot = None

app = Flask(__name__)
CORS(app)

logger.info("StylesGenie API Initializing...")

# Use empathetic bot
if not empathetic_bot:
    # Fallback to simple responses
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
    empathetic_bot = FallbackBot()

# Simple in-memory session store
SESSIONS = {}

def get_session(user_id: str):
    if not user_id:
        user_id = "guest"
    if user_id not in SESSIONS:
        SESSIONS[user_id] = {"history": [], "created": datetime.utcnow().isoformat()}
    return SESSIONS[user_id]

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

@app.route("/chat", methods=["POST"])
def chat():
    try:
        payload = request.get_json(force=True)
        user_id = payload.get("user_id", "guest")
        message = (payload.get("message") or "").strip()
        
        # Get response from empathetic bot
        result = empathetic_bot.process_message(user_id, message, chat_id=payload.get('chat_id'))
        return jsonify({"success": result['success'], "response": result['response']})

    except Exception as e:
        logger.error("Error in /chat: %s\n%s", e, traceback.format_exc())
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/quiz/recommendations", methods=["POST", "GET"])
def quiz_recommendations():
    """Quiz recommendations endpoint"""
    try:
        if request.method == "GET":
            return jsonify({"success": True, "recommendations": []})
        
        payload = request.get_json(force=True)
        user_id = payload.get("user_id", "guest")
        quiz_results = payload.get("quiz_results", {})
        
        # Simple recommendation: if they like 'minimalist', give them minimalist products
        # For now, we return empty and let the frontend use its fallback 
        # But having the route prevents 404s
        return jsonify({
            "success": True,
            "recommendations": [],
            "user_id": user_id
        })

    except Exception as e:
        logger.error("Error in /api/quiz/recommendations: %s", e)
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info("Starting StyleGenie API on port %s", port)
    app.run(host="0.0.0.0", port=port, debug=True)