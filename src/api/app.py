# src/api/app.py
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import sys
import os
import yaml
import pickle
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from chatbot.models import SimpleEnhancedStyleGenieRecommender as EnhancedStyleGenieRecommender
try:
    from chatbot.openai_integration import openai_bot
except ImportError:
    openai_bot = None

app = Flask(__name__)
CORS(app)

# Set up logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load configuration
config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'config.yaml')
with open(config_path, 'r') as f:
    config = yaml.safe_load(f)

# Initialize enhanced model with preference learning
recommender = EnhancedStyleGenieRecommender(config)

# Log OpenAI availability
if openai_bot:
    logger.info("OpenAI integration available for enhanced responses")
else:
    logger.warning("OpenAI integration not available - using fallback responses")

# Load trained model if available
model_path = config['api']['model_path']
if os.path.exists(model_path):
    try:
        recommender.load_model(model_path)
        logger.info("Enhanced StyleGenie model with preference learning loaded successfully!")
    except Exception as e:
        logger.warning(f"Failed to load trained model: {e}")
else:
    logger.warning(f"No trained model found at {model_path}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model': 'EnhancedStyleGenieRecommender',
        'version': config['model']['version'],
        'features': ['preference_learning', 'personalized_responses', 'context_awareness', 'openai_integration'],
        'openai_available': openai_bot is not None,
        'api_key_configured': bool(os.getenv('OPENAI_API_KEY'))
    })

@app.route('/api/images/<path:image_path>')
def serve_image(image_path):
    """Serve product images"""
    try:
        # Clean the path - remove leading slash if present
        if image_path.startswith('/'):
            image_path = image_path[1:]
        
        # Build full path from project root
        full_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),  # Go to project root
            image_path
        )
        
        if os.path.exists(full_path):
            return send_file(full_path)
        else:
            logger.warning(f"Image not found: {full_path}")
            # Return placeholder or 404
            return jsonify({'error': 'Image not found'}), 404
            
    except Exception as e:
        logger.error(f"Error serving image {image_path}: {e}")
        return jsonify({'error': 'Image error'}), 500

@app.route('/api/chat/recommendations', methods=['POST'])
def get_recommendations():
    """Main recommendation endpoint for chatbot"""
    try:
        data = request.json
        user_message = data.get('message', '')
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', None)
        
        logger.info(f"Recommendation request: '{user_message}'")
        
        # Extract user preferences from profile
        user_preferences = extract_user_preferences(user_profile)
        
        # Generate personalized recommendations with chat response
        try:
            result = recommender.recommend_with_chat(
                user_query=user_message,
                user_id=user_id,
                n_recommendations=3,
                user_preferences=user_preferences
            )
            
            recommendations = result['products']
            suggestions = result['suggestions']
            
            # Use OpenAI for enhanced response if available
            if openai_bot:
                try:
                    response_text = openai_bot.generate_product_recommendations_text(
                        recommendations, user_message
                    )
                except Exception as e:
                    logger.error(f"OpenAI error: {e}")
                    response_text = result['response']
            else:
                response_text = result['response']
                
        except Exception as e:
            logger.error(f"Error in recommend_with_chat: {e}")
            # Fallback response
            recommendations = recommender._generate_fallback_recommendations(user_message, 3, user_preferences)
            suggestions = ["Tell me more about your style", "Show me different categories", "Help me find colors I love"]
            
            if openai_bot:
                try:
                    response_text = openai_bot.generate_response(user_message, recommendations, user_profile)
                except Exception:
                    response_text = "I'm learning about your style preferences! Here are some great pieces to start with:"
            else:
                response_text = "I'm learning about your style preferences! Here are some great pieces to start with:"
        
        return jsonify({
            'response': response_text,
            'products': recommendations,
            'suggestions': suggestions,
            'model_version': config['model']['version']
        })
    
    except Exception as e:
        logger.error(f"Error in recommendation endpoint: {str(e)}")
        return jsonify({
            'error': 'Sorry, I encountered an error. Please try again!',
            'response': "I'm having some technical difficulties, but I'm still here to help!",
            'products': [],
            'suggestions': ['Try asking again', 'Browse our catalog', 'Help me understand your style']
        }), 500

def generate_response_text(message, recommendations, profile):
    """Generate contextual response based on recommendations"""
    if not recommendations:
        return "I couldn't find exactly what you're looking for, but let me learn more about your preferences!"
    
    aesthetic = profile.get('personalityType', 'unique style')
    return f"Perfect! Based on your {aesthetic} and what you're looking for, I found some great matches!"

def generate_follow_up_suggestions(message, profile):
    """Generate contextual follow-up suggestions"""
    base_suggestions = [
        "Show me more like this",
        "I prefer different colors", 
        "What's trending now?",
        "Surprise me with something new!"
    ]
    
    # Add personalized suggestions based on profile
    if profile.get('personalityType'):
        personality = profile['personalityType'].lower()
        if 'minimalist' in personality:
            base_suggestions.append("Show me more minimalist pieces")
        elif 'vintage' in personality:
            base_suggestions.append("Find me vintage treasures")
        elif 'cyberpunk' in personality:
            base_suggestions.append("Show me futuristic items")
    
    return base_suggestions[:4]  # Return top 4 suggestions

def extract_user_preferences(user_profile):
    """Convert user profile to preference format"""
    if not user_profile:
        return None
    
    # Extract preferences from user profile
    preferences = {
        'style_preferences': {},
        'category_preferences': {},
        'color_preferences': {},
        'interaction_patterns': {
            'preferred_response_length': 'medium',
            'likes_suggestions': True,
            'prefers_detailed_descriptions': False,
            'conversation_style': 'friendly'
        }
    }
    
    # Map personality type to style preferences
    personality = user_profile.get('personalityType', '').lower()
    style_map = {
        'minimalist': {'minimalist': 0.9, 'classic': 0.6},
        'vintage': {'vintage': 0.9, 'classic': 0.7},
        'cyberpunk': {'trendy': 0.9, 'streetwear': 0.8},
        'gothic': {'minimalist': 0.7, 'streetwear': 0.6},
        'boho': {'bohemian': 0.9, 'vintage': 0.5},
        'preppy': {'classic': 0.9, 'minimalist': 0.6},
        'streetwear': {'streetwear': 0.9, 'trendy': 0.8},
        'maximalist': {'trendy': 0.8, 'bohemian': 0.7}
    }
    
    if personality in style_map:
        preferences['style_preferences'] = style_map[personality]
    
    return preferences

def convert_quiz_to_preferences(quiz_results):
    """Convert comprehensive quiz results to detailed user preferences"""
    # Start with the actual preferences from quiz if available
    base_preferences = quiz_results.get('preferences', {})
    
    preferences = {
        'style_preferences': base_preferences.get('style_preferences', {}),
        'category_preferences': base_preferences.get('category_preferences', {}),
        'color_preferences': base_preferences.get('color_preferences', {}),
        'price_range': base_preferences.get('price_range', {'min': 0, 'max': 200, 'preferred': 50}),
        'occasion_preferences': base_preferences.get('occasion_preferences', {}),
        'interaction_patterns': {
            'preferred_response_length': 'medium',
            'likes_suggestions': True,
            'prefers_detailed_descriptions': True,
            'conversation_style': 'friendly'
        }
    }
    
    # If we don't have detailed preferences, fall back to personality mapping
    if not preferences['style_preferences']:
        personality = quiz_results.get('personalityType', '').lower()
        style_weights = {
            'minimalist maven': {'minimalist': 0.95, 'classic': 0.7, 'clean': 0.9},
            'vintage virtuoso': {'vintage': 0.95, 'classic': 0.8, 'bohemian': 0.6, 'retro': 0.9},
            'street style star': {'streetwear': 0.95, 'trendy': 0.85, 'urban': 0.9},
            'preppy perfectionist': {'classic': 0.95, 'minimalist': 0.8, 'preppy': 0.9},
            'bohemian spirit': {'bohemian': 0.95, 'vintage': 0.7, 'boho': 0.9},
            'gothic guardian': {'gothic': 0.95, 'dark': 0.9, 'alternative': 0.8},
            'tech trendsetter': {'trendy': 0.95, 'streetwear': 0.85, 'futuristic': 0.9},
            'maximalist maverick': {'maximalist': 0.95, 'bold': 0.9, 'colorful': 0.8}
        }
        
        if personality in style_weights:
            preferences['style_preferences'] = style_weights[personality]
    
    # Extract aesthetic information
    primary_aesthetic = quiz_results.get('primaryAesthetic', '')
    if primary_aesthetic and primary_aesthetic not in preferences['style_preferences']:
        preferences['style_preferences'][primary_aesthetic] = 0.9
    
    # Add secondary aesthetics
    secondary_aesthetics = quiz_results.get('secondaryAesthetics', [])
    for aesthetic in secondary_aesthetics:
        if aesthetic not in preferences['style_preferences']:
            preferences['style_preferences'][aesthetic] = 0.7
    
    # Extract confidence level for interaction style
    confidence = quiz_results.get('confidence', 0.8)
    if confidence > 0.8:
        preferences['interaction_patterns']['conversation_style'] = 'confident'
        preferences['interaction_patterns']['prefers_detailed_descriptions'] = True
    elif confidence < 0.6:
        preferences['interaction_patterns']['conversation_style'] = 'supportive'
        preferences['interaction_patterns']['preferred_response_length'] = 'long'
    
    logger.info(f"Converted quiz preferences: {preferences}")
    return preferences

@app.route('/api/user/preferences', methods=['POST'])
def update_user_preferences():
    """Update user preferences based on interactions"""
    try:
        data = request.json
        user_id = data.get('userId')
        interaction = data.get('interaction')
        
        if not user_id or not interaction:
            return jsonify({'error': 'Missing user_id or interaction'}), 400
        
        # Update preferences
        recommender.update_user_preferences(user_id, interaction)
        
        return jsonify({
            'success': True,
            'message': 'Preferences updated successfully'
        })
    
    except Exception as e:
        logger.error(f"Error updating preferences: {str(e)}")
        return jsonify({'error': 'Failed to update preferences'}), 500

@app.route('/api/user/preferences/<user_id>', methods=['GET'])
def get_user_preferences(user_id):
    """Get current user preferences"""
    try:
        preferences = recommender.preference_manager.get_user_preferences(user_id)
        return jsonify({
            'preferences': preferences,
            'success': True
        })
    
    except Exception as e:
        logger.error(f"Error getting preferences: {str(e)}")
        return jsonify({'error': 'Failed to get preferences'}), 500

@app.route('/api/quiz/recommendations', methods=['POST'])
def get_quiz_recommendations():
    """Generate recommendations based on quiz results"""
    try:
        data = request.json
        quiz_results = data.get('quizResults', {})
        user_profile = data.get('userProfile', {})
        
        # Convert quiz results to comprehensive preferences
        quiz_preferences = convert_quiz_to_preferences(quiz_results)
        
        # Extract aesthetic preference from quiz results
        aesthetic_style = quiz_results.get('primaryAesthetic', quiz_results.get('personalityType', 'minimalist')).lower()
        
        # Build comprehensive query from preferences
        query_parts = []
        
        # Add style preferences
        style_prefs = quiz_preferences.get('style_preferences', {})
        top_styles = sorted(style_prefs.items(), key=lambda x: x[1], reverse=True)[:3]
        for style, score in top_styles:
            if score > 0.6:
                query_parts.append(style)
        
        # Add category preferences if available
        cat_prefs = quiz_preferences.get('category_preferences', {})
        top_cats = sorted(cat_prefs.items(), key=lambda x: x[1], reverse=True)[:2]
        for cat, score in top_cats:
            if score > 0.6:
                query_parts.append(cat)
        
        # Add color preferences if available
        color_prefs = quiz_preferences.get('color_preferences', {})
        top_colors = sorted(color_prefs.items(), key=lambda x: x[1], reverse=True)[:2]
        for color, score in top_colors:
            if score > 0.6:
                query_parts.append(color)
        
        # Fallback to style-based queries if no specific preferences
        if not query_parts:
            style_queries = {
                'minimalist': 'clean simple basic minimal plain',
                'vintage': 'vintage retro classic traditional',
                'cyberpunk': 'futuristic metallic tech neon modern',
                'gothic': 'dark black gothic edgy metal',
                'boho': 'bohemian hippie ethnic folk flowing',
                'preppy': 'preppy classic formal business structured',
                'streetwear': 'street urban casual hip modern',
                'maximalist': 'bright colorful pattern print bold'
            }
            query_parts.append(style_queries.get(aesthetic_style, 'basic style'))
        
        query = ' '.join(query_parts)
        
        logger.info(f"Quiz recommendation request for style: {aesthetic_style}, query: {query}")
        logger.info(f"Quiz preferences: {quiz_preferences}")
        
        # Generate personalized recommendations based on quiz
        try:
            result = recommender.recommend_with_chat(
                user_query=query,
                user_id=None,
                n_recommendations=6,
                user_preferences=quiz_preferences
            )
            recommendations = result['products']
            
            # Use OpenAI for enhanced quiz response if available
            if openai_bot:
                try:
                    response_text = openai_bot.generate_response(
                        f"Quiz results show {aesthetic_style} style preference. Query: {query}",
                        recommendations,
                        quiz_results
                    )
                except Exception as e:
                    logger.error(f"OpenAI quiz error: {e}")
                    response_text = result.get('response', f"Based on your {aesthetic_style} style, here are some perfect matches for you!")
            else:
                response_text = result.get('response', f"Based on your {aesthetic_style} style, here are some perfect matches for you!")
                
        except Exception as e:
            logger.error(f"Error in quiz recommend_with_chat: {e}")
            # Use direct fallback with preferences
            recommendations = recommender._generate_fallback_recommendations(query, 6, quiz_preferences)
            
            if openai_bot:
                try:
                    response_text = openai_bot.generate_response(
                        f"Style preference: {aesthetic_style}", recommendations, quiz_results
                    )
                except Exception:
                    response_text = f"Based on your {aesthetic_style} style preferences, I've found these perfect matches for you!"
            else:
                response_text = f"Based on your {aesthetic_style} style preferences, I've found these perfect matches for you!"
        
        return jsonify({
            'response': response_text,
            'products': recommendations,
            'aestheticStyle': aesthetic_style,
            'confidence': quiz_results.get('confidence', 0.8),
            'model_version': config['model']['version']
        })
    
    except Exception as e:
        logger.error(f"Error in quiz recommendation endpoint: {str(e)}")
        return jsonify({
            'error': 'Sorry, I encountered an error processing your quiz results!',
            'response': "Let me try to help you find your style in a different way.",
            'products': [],
            'aestheticStyle': 'minimalist'
        }), 500

@app.route('/api/model/status', methods=['GET'])
def model_status():
    """Check if model is trained and ready"""
    model_path = config['api']['model_path']
    is_trained = os.path.exists(model_path)
    
    return jsonify({
        'trained': is_trained,
        'model_path': model_path,
        'config': config['model']
    })

@app.route('/api/model/train', methods=['POST'])
def trigger_training():
    """Trigger model training (for development)"""
    try:
        # This would trigger your training pipeline
        logger.info("Training request received")
        return jsonify({'message': 'Training started', 'status': 'in_progress'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = config['api']['port']
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Enhanced StyleGenie API with preference learning on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)