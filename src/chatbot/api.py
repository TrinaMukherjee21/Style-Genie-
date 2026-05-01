"""
Proper Flask API for StyleGenie chatbot using the unified fashion AI
This replaces the existing api.py with better error handling and proper responses
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os, sys, logging, io, base64, traceback
from datetime import datetime
from pathlib import Path
from PIL import Image

# Add therapy modules to path
sys.path.append(str(Path(__file__).parent.parent))

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the dataset-enhanced AI first, then unified AI as fallback
try:
    from dataset_enhanced_ai import dataset_enhanced_ai
    ENHANCED_AI_AVAILABLE = True
    print("[TARGET] Using Dataset-Enhanced Fashion AI - Integrated with training datasets")
    
    # Get dataset statistics
    stats = dataset_enhanced_ai.get_dataset_statistics()
    print(f"   [STATS] Fashion vocabulary: {stats['fashion_vocabulary_count']} terms")
    print(f"   [SHOP]  Smart products: {stats['smart_products_count']} items")
    print(f"   [CHAT] Empathetic responses: {stats['empathetic_responses_count']} patterns")
    
except ImportError as e:
    print(f"[FAIL] Failed to import dataset-enhanced AI: {e}")
    ENHANCED_AI_AVAILABLE = False
    
    # Fallback to unified AI
    try:
        from unified_fashion_ai import unified_fashion_ai
        UNIFIED_AI_AVAILABLE = True
        print("[FALLBACK] Fallback: Using Unified Fashion AI - Advanced conversational system")
    except ImportError as e:
        print(f"[FAIL] Failed to import unified fashion AI: {e}")
        UNIFIED_AI_AVAILABLE = False
    # Fallback to existing systems
    try:
        from realtime_fashion_ai import RealtimeFashionAI
        fallback_ai = RealtimeFashionAI()
        print("[FALLBACK] Fallback: Using Real-time Fashion AI")
    except ImportError:
        try:
            from enhanced_interactive_ai import EnhancedInteractiveFashionAI
            fallback_ai = EnhancedInteractiveFashionAI()
            print("[FALLBACK] Fallback: Using Enhanced Interactive AI")
        except ImportError:
            from interactive_ai import InteractiveFashionAI
            fallback_ai = InteractiveFashionAI()
            print("[FALLBACK] Fallback: Using Standard Interactive AI")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stylegenie_chatbot_api")

app = Flask(__name__)
CORS(app)

# Simple in-memory session store
SESSIONS = {}

def get_session(user_id: str):
    """Get or create user session"""
    if not user_id:
        user_id = "guest"
    if user_id not in SESSIONS:
        SESSIONS[user_id] = {
            "history": [], 
            "created": datetime.utcnow().isoformat(),
            "preferences": {}
        }
    return SESSIONS[user_id]

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    health_data = {
        "status": "ok", 
        "time": datetime.utcnow().isoformat(),
        "service": "StyleGenie Chatbot API"
    }
    
    if ENHANCED_AI_AVAILABLE:
        health_data["ai_system"] = "dataset_enhanced"
        health_data["dataset_stats"] = dataset_enhanced_ai.get_dataset_statistics()
    elif 'UNIFIED_AI_AVAILABLE' in globals() and UNIFIED_AI_AVAILABLE:
        health_data["ai_system"] = "unified_ai"
    else:
        health_data["ai_system"] = "fallback"
    
    return jsonify(health_data)

@app.route("/chat", methods=["POST"])
def chat():
    """Main chat endpoint with proper error handling"""
    try:
        payload = request.get_json(force=True)
        user_id = payload.get("user_id", "guest")
        message = (payload.get("message") or "").strip()
        image_b64 = payload.get("image")
        top_k = int(payload.get("top_k", 5))
        
        logger.info(f"Chat request from user {user_id}: '{message}'")

        session = get_session(user_id)
        session["history"].append({
            "from": "user",
            "text": message, 
            "has_image": bool(image_b64), 
            "ts": datetime.utcnow().isoformat()
        })

        # Decode image if present
        image_data = None
        pil_image = None
        if image_b64:
            try:
                header, encoded = (image_b64.split(",", 1) if "," in image_b64 else ("", image_b64))
                img_bytes = base64.b64decode(encoded)
                pil_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                image_data = image_b64  # Keep the base64 data for processing
                logger.info("Successfully decoded uploaded image")
            except Exception as e:
                logger.error("Failed to decode uploaded image: %s", e)
                image_data = None
                pil_image = None

        # Use dataset-enhanced AI if available, then unified AI, then fallback
        if ENHANCED_AI_AVAILABLE:
            try:
                response = dataset_enhanced_ai.handle_conversation(
                    message=message,
                    user_id=user_id,
                    image_data=image_data
                )
                
                # Format response for frontend
                formatted_response = {
                    "text": response["message"],
                    "products": format_products(response.get("products", [])),
                    "suggestions": response.get("suggestions", []),
                    "intent": response.get("intent", "general"),
                    "confidence": response.get("confidence", 0.7)
                }
                
                logger.info(f"[TARGET] Dataset-Enhanced AI response generated for user {user_id}")
                
            except Exception as e:
                logger.error(f"Dataset-Enhanced AI failed: {e}")
                formatted_response = get_fallback_response(message, user_id, pil_image)
        elif 'UNIFIED_AI_AVAILABLE' in globals() and UNIFIED_AI_AVAILABLE:
            try:
                response = unified_fashion_ai.handle_conversation(
                    message=message,
                    user_id=user_id,
                    image_data=image_data
                )
                
                # Format response for frontend
                formatted_response = {
                    "text": response["message"],
                    "products": format_products(response.get("products", [])),
                    "suggestions": response.get("suggestions", []),
                    "intent": response.get("intent", "general"),
                    "confidence": response.get("confidence", 0.7)
                }
                
                logger.info(f"[FALLBACK] Unified AI response generated for user {user_id}")
                
            except Exception as e:
                logger.error(f"Unified AI failed: {e}")
                formatted_response = get_fallback_response(message, user_id, pil_image)
        else:
            formatted_response = get_fallback_response(message, user_id, pil_image)

        # Store bot response in session
        session["history"].append({
            "from": "bot",
            "text": formatted_response.get("text"),
            "products_count": len(formatted_response.get("products", [])),
            "intent": formatted_response.get("intent"),
            "ts": datetime.utcnow().isoformat()
        })
        
        return jsonify({"success": True, "response": formatted_response})

    except Exception as e:
        logger.error("Error in /chat: %s\n%s", e, traceback.format_exc())
        error_response = {
            "success": False,
            "response": {
                "text": "I'm having a technical moment, but I'm still here to help! What fashion question can I assist you with? ✨",
                "products": [],
                "suggestions": ["Show me dresses", "Find casual wear", "Style advice", "Help me shop"],
                "intent": "error",
                "confidence": 0.5
            }
        }
        return jsonify(error_response), 500

def get_fallback_response(message, user_id, image=None):
    """Use existing AI systems as fallback"""
    try:
        if 'fallback_ai' in globals():
            # Use existing AI system
            resp = fallback_ai.handle_turn(
                message=message, 
                image=image, 
                session={"user_id": user_id}
            )
            
            # Convert to unified format
            return {
                "text": resp.get("text", "I'm here to help you with fashion! What are you looking for?"),
                "products": format_products(resp.get("products", [])),
                "suggestions": resp.get("suggestions", ["Show me dresses", "Find casual wear", "Style advice"]),
                "intent": resp.get("intent", "general"),
                "confidence": 0.7
            }
    except Exception as e:
        logger.error(f"Fallback AI also failed: {e}")
    
    # Ultimate fallback
    return get_simple_fallback_response(message, user_id)

def get_simple_fallback_response(message, user_id):
    """Generate intelligent fallback response when AI is not available"""
    message_lower = message.lower()
    
    # Check for therapy-related requests first
    if any(phrase in message_lower for phrase in ["confidence", "insecure", "don't feel good", "hate my body", "want to wear dress", "dress but", "not confident"]):
        try:
            from therapy.confidence_therapy import confidence_therapist
            from therapy.voice_analysis import voice_analyzer
            
            # Analyze emotional state
            voice_analysis = voice_analyzer.analyze_voice_text(message)
            emotional_state = confidence_therapist.analyze_emotional_state(message)
            
            # Generate therapeutic response
            therapy_response = confidence_therapist.generate_therapeutic_response(emotional_state, message)
            voice_response = voice_analyzer.generate_voice_based_response(voice_analysis, message)
            
            # Combine therapy and voice analysis
            return {
                "text": f"{voice_response.get('empathy_message', '')} {therapy_response['text']}",
                "products": therapy_response.get('dress_suggestions', []),
                "suggestions": therapy_response.get('follow_up_questions', []),
                "intent": "confidence_therapy",
                "confidence": 0.95
            }
            
        except ImportError:
            # Fallback if therapy modules not available
            return {
                "text": "I understand you're looking for some confidence support. You deserve to feel beautiful and confident in whatever you choose to wear! Let me help you find some pieces that will make you feel amazing.",
                "products": get_sample_products(),
                "suggestions": ["Show me confidence-boosting outfits", "Help me feel beautiful", "What makes people confident?"],
                "intent": "confidence_support",
                "confidence": 0.9
            }
    
    # Greeting responses
    if any(word in message_lower for word in ["hi", "hello", "hey", "start"]):
        return {
            "text": "Hi there! ✨ I'm StyleBot, your personal AI fashion stylist! I'm absolutely thrilled to help you discover your perfect style. Whether you're looking for the perfect outfit for a special occasion, need wardrobe essentials, or want to explore new trends - I'm here to guide you every step of the way! What's on your fashion wishlist today?",
            "products": [],
            "suggestions": ["Show me elegant dresses", "Find professional wear", "I need casual outfits", "Help me style for a party"],
            "intent": "greeting",
            "confidence": 0.9
        }
    
    # Thank you responses
    if any(word in message_lower for word in ["thank", "thanks", "thx"]):
        return {
            "text": "You're so welcome! I absolutely love helping you find pieces that make you feel amazing! ✨",
            "products": [],
            "suggestions": ["Find more pieces like this", "Show me different colors", "What accessories would work?", "Help me complete this look"],
            "intent": "thanks",
            "confidence": 0.9
        }
    
    # Christmas/elegant requests
    if "christmas" in message_lower and any(word in message_lower for word in ["bodycon", "elegant", "dress"]):
        return {
            "text": "Perfect for Christmas Eve! A bodycon dress is such an elegant choice. I love the classy, Pinterest-worthy vibe you're going for! Here are some stunning options that would look amazing with a blazer and boots:",
            "products": get_christmas_products(),
            "suggestions": ["Show me boots to match", "Find a coat for this", "What accessories?", "Complete the Christmas look"],
            "intent": "christmas_elegant",
            "confidence": 0.85
        }
    
    # Professional wear requests
    if any(word in message_lower for word in ["professional", "work", "business", "office"]):
        return {
            "text": "Professional styling is one of my favorite challenges! 👔 There's something so empowering about a well-tailored work outfit. Here are some pieces that will make you look absolutely professional and chic:",
            "products": get_professional_products(),
            "suggestions": ["Complete business look", "Professional accessories", "Work-appropriate colors", "Blazer and shirt combos"],
            "intent": "professional",
            "confidence": 0.85
        }
    
    # About StyleGenie
    if any(phrase in message_lower for phrase in ["about stylegenie", "what is stylegenie", "tell me about"]):
        return {
            "text": "I'm StyleGenie, your AI-powered personal fashion stylist! ✨ I'm here to help you discover amazing fashion pieces, create stunning outfits, and express your unique style. I can help you find everything from professional workwear to elegant evening dresses, casual everyday pieces, and special occasion outfits. What would you like to explore today?",
            "products": get_sample_products(),
            "suggestions": ["Show me what you can do", "Find me a dress", "Help me with work clothes", "Style advice for dates"],
            "intent": "about_stylegenie",
            "confidence": 0.95
        }
    
    # Product search requests
    if any(word in message_lower for word in ["show", "find", "need", "want", "looking for", "search"]):
        if any(word in message_lower for word in ["dress", "dresses"]):
            return {
                "text": "I absolutely love helping with dress shopping! ✨ Dresses are such a versatile and elegant choice. Let me show you some gorgeous options that would look stunning on you:",
                "products": get_dress_products(),
                "suggestions": ["Show me more dresses", "Find matching accessories", "What shoes go with this?", "Help me choose colors"],
                "intent": "dress_search",
                "confidence": 0.9
            }
        elif any(word in message_lower for word in ["casual", "everyday", "comfortable"]):
            return {
                "text": "Casual chic is one of my favorite styles to work with! 😊 There's something so effortlessly beautiful about comfortable pieces that still make you look put-together. Here are some amazing casual pieces I think you'll love:",
                "products": get_casual_products(),
                "suggestions": ["Show me more casual wear", "Find comfortable shoes", "What about accessories?", "Help me layer these"],
                "intent": "casual_search",
                "confidence": 0.9
            }
        else:
            return {
                "text": "I'm excited to help you find exactly what you're looking for! ✨ Fashion is all about expressing your unique personality. Let me show you some carefully curated pieces that I think would be perfect for your style:",
                "products": get_sample_products(),
                "suggestions": ["Show me more options", "Find different styles", "What's trending now?", "Help me decide"],
                "intent": "product_search",
                "confidence": 0.8
            }
    
    # Style advice requests
    if any(phrase in message_lower for phrase in ["style advice", "help me style", "how to wear", "what goes with"]):
        return {
            "text": "I absolutely love giving style advice! 💫 Fashion is such a personal journey, and I'm here to help you feel confident and beautiful in whatever you choose to wear. What specific piece or occasion are you styling for? I can help you create the perfect look!",
            "products": [],
            "suggestions": ["Help me style for work", "What to wear on a date", "Casual weekend looks", "Special occasion outfits"],
            "intent": "style_advice",
            "confidence": 0.9
        }
    
    # Default response
    return {
        "text": "I love your fashion curiosity! ✨ As your personal AI stylist, I'm here to help you discover amazing pieces that reflect your unique style. Whether you're building a capsule wardrobe, looking for statement pieces, or need outfit inspiration - I've got you covered! What fashion adventure shall we embark on today?",
        "products": [],
        "suggestions": ["Show me trending pieces", "Find wardrobe essentials", "Help me with colors", "Style advice please"],
        "intent": "general",
        "confidence": 0.7
    }

def format_products(products):
    """Format products for frontend consumption"""
    formatted = []
    for product in products[:6]:  # Limit to 6 products
        price = product.get("price", "$0")
        if isinstance(price, (int, float)):
            price = f"${price}"
        
        formatted.append({
            "id": product.get("id", "unknown"),
            "title": product.get("title", "Fashion Item"),
            "price": price,
            "description": product.get("description", "Beautiful fashion piece"),
            "image": product.get("image", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop&auto=format&q=80"),
            "category": product.get("category", "clothing"),
            "style": product.get("style", "general")
        })
    return formatted

def get_sample_products():
    """Get sample products for fallback responses"""
    return [
        {
            "id": "sample_dress_001",
            "title": "Elegant Black Bodycon Dress",
            "price": "$89",
            "description": "Sophisticated dress perfect for special occasions",
            "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "dress",
            "style": "elegant"
        },
        {
            "id": "sample_blazer_001",
            "title": "Structured Navy Blazer",
            "price": "$125",
            "description": "Perfect blazer for professional settings",
            "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "blazer",
            "style": "professional"
        },
        {
            "id": "sample_sweater_001",
            "title": "Luxe Cashmere Sweater",
            "price": "$145",
            "description": "Soft cashmere for cozy styling",
            "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "sweater",
            "style": "casual"
        }
    ]

def get_dress_products():
    """Get dress products for dress-specific requests"""
    return [
        {
            "id": "dress_001",
            "title": "Elegant Black Midi Dress",
            "price": "$89",
            "description": "Timeless midi dress perfect for any occasion",
            "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "dress",
            "style": "elegant"
        },
        {
            "id": "dress_002",
            "title": "Flowy Floral Summer Dress",
            "price": "$65",
            "description": "Beautiful floral dress for sunny days",
            "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "dress",
            "style": "casual"
        },
        {
            "id": "dress_003",
            "title": "Sophisticated Wrap Dress",
            "price": "$95",
            "description": "Flattering wrap style that works for work or play",
            "image": "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "dress",
            "style": "professional"
        }
    ]

def get_casual_products():
    """Get casual products for casual wear requests"""
    return [
        {
            "id": "casual_001",
            "title": "Cozy Oversized Sweater",
            "price": "$55",
            "description": "Perfect for relaxed, comfortable styling",
            "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "sweater",
            "style": "casual"
        },
        {
            "id": "casual_002",
            "title": "Classic Denim Jeans",
            "price": "$75",
            "description": "Timeless jeans that go with everything",
            "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "jeans",
            "style": "casual"
        },
        {
            "id": "casual_003",
            "title": "Soft Cotton T-Shirt",
            "price": "$35",
            "description": "Essential basic tee for everyday comfort",
            "image": "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "top",
            "style": "casual"
        }
    ]

def get_blue_bottomwear_products():
    """Get blue bottomwear products for specific requests"""
    return [
        {
            "id": "blue_bottom_001",
            "title": "Classic Blue Denim Jeans",
            "price": "$85",
            "description": "Perfect medium wash blue jeans for any occasion",
            "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "jeans",
            "style": "casual"
        },
        {
            "id": "blue_bottom_002",
            "title": "Navy Blue Chinos",
            "price": "$65",
            "description": "Sophisticated navy chinos perfect for smart-casual looks",
            "image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "chinos",
            "style": "smart-casual"
        },
        {
            "id": "blue_bottom_003",
            "title": "Light Blue Denim Shorts",
            "price": "$45",
            "description": "Comfortable light blue denim shorts for summer",
            "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "shorts",
            "style": "casual"
        },
        {
            "id": "blue_bottom_004",
            "title": "Royal Blue Joggers",
            "price": "$55",
            "description": "Comfortable royal blue joggers for active wear",
            "image": "https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "joggers",
            "style": "athletic"
        }
    ]

def get_christmas_products():
    """Get Christmas-themed products"""
    return [
        {
            "id": "christmas_dress_001",
            "title": "Elegant Black Bodycon Dress",
            "price": "$89",
            "description": "Perfect for Christmas Eve - sophisticated and Pinterest-worthy",
            "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "dress",
            "style": "elegant"
        },
        {
            "id": "christmas_coat_001",
            "title": "Luxe Wool Hover Coat",
            "price": "$159",
            "description": "Classy winter coat that elevates any outfit",
            "image": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "coat",
            "style": "elegant"
        },
        {
            "id": "christmas_boots_001",
            "title": "Elegant Knee-High Boots",
            "price": "$129",
            "description": "Perfect finishing touch for your winter elegance",
            "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "shoes",
            "style": "elegant"
        }
    ]

def get_professional_products():
    """Get professional wear products"""
    return [
        {
            "id": "prof_blazer_001",
            "title": "Structured Navy Blazer",
            "price": "$125",
            "description": "Perfectly tailored for professional settings",
            "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "blazer",
            "style": "professional"
        },
        {
            "id": "prof_shirt_001",
            "title": "Classic White Button Shirt",
            "price": "$65",
            "description": "Crisp white shirt - wardrobe essential",
            "image": "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "shirt",
            "style": "professional"
        },
        {
            "id": "prof_pants_001",
            "title": "Tailored Black Trousers",
            "price": "$85",
            "description": "Perfectly tailored for modern professionals",
            "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "pants",
            "style": "professional"
        }
    ]

@app.route("/user/preferences", methods=["POST"])
def update_user_preferences():
    """Update user preferences endpoint"""
    try:
        data = request.get_json()
        user_id = data.get("user_id", "guest")
        interaction = data.get("interaction", {})
        
        if ENHANCED_AI_AVAILABLE:
            dataset_enhanced_ai.update_user_preferences(user_id, interaction)
        elif 'UNIFIED_AI_AVAILABLE' in globals() and UNIFIED_AI_AVAILABLE:
            unified_fashion_ai.update_user_preferences(user_id, interaction)
        
        # Also update local session
        session = get_session(user_id)
        preferences = session.get("preferences", {})
        
        if interaction.get("type") == "like" and "product" in interaction:
            product = interaction["product"]
            product_style = product.get("style", "general")
            preferences[product_style] = preferences.get(product_style, 0) + 1
        
        session["preferences"] = preferences
        
        return jsonify({"success": True, "message": "Preferences updated"})
    
    except Exception as e:
        logger.error(f"Error updating preferences: {e}")
        return jsonify({"success": False, "error": "Failed to update preferences"}), 500

@app.route("/api/quiz/recommendations", methods=["POST", "GET"])
def quiz_recommendations():
    """Quiz recommendations endpoint"""
    try:
        if request.method == "GET":
            # Return sample quiz recommendations for GET requests
            return jsonify({
                "success": True,
                "recommendations": get_sample_quiz_recommendations()
            })
        
        # Handle POST request with quiz data
        payload = request.get_json(force=True) if request.method == "POST" else {}
        user_id = payload.get("user_id", "guest")
        quiz_results = payload.get("quiz_results", {})
        
        logger.info(f"Quiz recommendations request from user {user_id}")
        
        # Generate recommendations based on quiz results
        recommendations = generate_quiz_recommendations(quiz_results)
        
        return jsonify({
            "success": True,
            "recommendations": recommendations,
            "user_id": user_id
        })

    except Exception as e:
        logger.error("Error in /api/quiz/recommendations: %s", e)
        return jsonify({
            "success": False,
            "error": "Failed to generate quiz recommendations",
            "recommendations": get_sample_quiz_recommendations()  # Fallback
        }), 500

def generate_quiz_recommendations(quiz_results):
    """Generate personalized recommendations based on quiz results"""
    # Sample logic - customize based on your quiz structure
    style_preferences = quiz_results.get("style", "casual")
    
    # Generate recommendations based on preferences
    recommendations = []
    
    if style_preferences == "professional":
        recommendations = get_professional_products()
    else:
        recommendations = [
            {
                "id": "quiz_rec_casual_1",
                "title": "Comfortable Cotton T-Shirt",
                "price": 45,
                "description": "Perfect for your casual lifestyle",
                "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&auto=format&q=80",
                "category": "tops",
                "style": "casual"
            },
            {
                "id": "quiz_rec_casual_2", 
                "title": "Relaxed Fit Jeans",
                "price": 75,
                "description": "Comfortable jeans for everyday wear",
                "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop&auto=format&q=80",
                "category": "bottoms",
                "style": "casual"
            }
        ]
    
    return recommendations[:6]  # Limit to 6 items

def get_sample_quiz_recommendations():
    """Get sample recommendations when quiz data is not available"""
    return [
        {
            "id": "sample_quiz_1",
            "title": "Versatile Blazer",
            "price": 125,
            "description": "Perfect for multiple occasions",
            "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "outerwear",
            "style": "versatile"
        },
        {
            "id": "sample_quiz_2",
            "title": "Classic White Shirt",
            "price": 65,
            "description": "Wardrobe essential for any style",
            "image": "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "tops", 
            "style": "classic"
        },
        {
            "id": "sample_quiz_3",
            "title": "Comfortable Jeans",
            "price": 85,
            "description": "Perfect fit for everyday comfort",
            "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop&auto=format&q=80",
            "category": "bottoms",
            "style": "casual"
        }
    ]

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    logger.info(f"Starting StyleGenie Chatbot API on port {port}")
    
    if ENHANCED_AI_AVAILABLE:
        logger.info("[TARGET] Dataset-Enhanced AI system active with training data integration")
    elif 'UNIFIED_AI_AVAILABLE' in globals() and UNIFIED_AI_AVAILABLE:
        logger.info("[FALLBACK] Unified AI system active as fallback")
    else:
        logger.info("[WARNING]  Using fallback response system")
    
    app.run(host="0.0.0.0", port=port, debug=True)
