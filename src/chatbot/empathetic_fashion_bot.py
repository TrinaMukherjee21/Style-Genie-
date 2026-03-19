"""
Empathetic Fashion Chatbot with Therapeutic Intelligence
"""

import json
import os
import logging
import random
import re
from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

class EmpathethicFashionBot:
    """Intelligent fashion chatbot with emotional understanding and therapeutic responses"""
    
    def __init__(self, products_file: str = None):
        self.products = []
        self.chat_histories = {}
        self.emotion_patterns = self._load_emotion_patterns()
        self.therapeutic_responses = self._load_therapeutic_responses()
        self.load_products(products_file)

    def _load_emotion_patterns(self) -> Dict:
        """Load emotion detection patterns"""
        return {
            'uncomfortable': {
                'keywords': ['uncomfortable', 'not comfortable', 'don\'t feel good', 'awkward', 'weird', 'strange'],
                'emotion': 'discomfort',
                'intensity': 'medium'
            },
            'insecure': {
                'keywords': ['insecure', 'self-conscious', 'ugly', 'fat', 'look bad', 'hate myself', 'not pretty'],
                'emotion': 'insecurity',
                'intensity': 'high'
            },
            'anxious': {
                'keywords': ['anxious', 'nervous', 'worried', 'scared', 'stressed', 'overwhelmed'],
                'emotion': 'anxiety',
                'intensity': 'high'
            },
            'frustrated': {
                'keywords': ['frustrated', 'annoyed', 'angry', 'hate', 'terrible', 'awful', 'nothing works'],
                'emotion': 'frustration',
                'intensity': 'medium'
            },
            'confused': {
                'keywords': ['confused', 'don\'t know', 'help me', 'lost', 'unsure', 'what should'],
                'emotion': 'confusion',
                'intensity': 'low'
            },
            'excited': {
                'keywords': ['excited', 'love', 'amazing', 'perfect', 'gorgeous', 'beautiful'],
                'emotion': 'excitement',
                'intensity': 'positive'
            }
        }

    def _load_therapeutic_responses(self) -> Dict:
        """Load therapeutic response templates"""
        return {
            'discomfort': {
                'validation': [
                    "I completely understand that feeling uncomfortable in clothes can be really distressing. Your feelings are totally valid! 💕",
                    "It's so important that you feel comfortable and confident in what you wear. Let's figure this out together! ✨",
                    "Feeling uncomfortable in clothing is more common than you think, and we can definitely work through this! 🌟"
                ],
                'guidance': [
                    "Let's identify what specifically is making you uncomfortable - is it the fit, fabric, style, or how it makes you feel?",
                    "Comfort comes first! Tell me what aspects of the top are bothering you - fit, material, or styling?",
                    "Your comfort matters most. What would make you feel more at ease in your outfit?"
                ],
                'suggestions': [
                    "Try: 'The fit feels too tight around my waist'",
                    "Say: 'The fabric feels scratchy on my skin'",
                    "Ask: 'Help me find a more comfortable alternative'",
                    "Tell me: 'I feel self-conscious about how it looks'"
                ]
            },
            'insecurity': {
                'validation': [
                    "Sweet soul, I want you to know that you are beautiful exactly as you are! These feelings are temporary, but your worth is permanent. 💖",
                    "Honey, I hear you and I want to wrap you in the biggest hug right now. You deserve to feel amazing in your clothes! 🤗",
                    "Beautiful, those negative thoughts are lying to you. You are worthy of feeling confident and gorgeous! ✨"
                ],
                'guidance': [
                    "Let's focus on finding pieces that make you feel empowered and confident. What makes you feel your best?",
                    "Fashion should celebrate you, not hide you. What styles have made you feel confident before?",
                    "Your body is amazing and deserves clothes that make you feel that way too. What would boost your confidence?"
                ],
                'suggestions': [
                    "Try: 'Help me find clothes that flatter my body type'",
                    "Say: 'I want to feel confident and beautiful'",
                    "Ask: 'What styles would make me look and feel amazing?'",
                    "Tell me: 'I need a confidence boost through fashion'"
                ]
            },
            'anxiety': {
                'validation': [
                    "I can feel your anxiety, and I want you to know that it's okay to feel this way. Let's take this one step at a time. 🌸",
                    "Breathe with me, beautiful. Fashion anxiety is real, but we'll work through this together with patience and care. 💕",
                    "Your feelings are completely valid. Let's create a calm, supportive space to find your perfect look. ✨"
                ],
                'guidance': [
                    "Let's start simple and build your confidence gradually. What's one small change that might help?",
                    "We'll take this slowly and focus on what makes you feel safe and comfortable first.",
                    "What would help reduce your anxiety about this outfit choice?"
                ],
                'suggestions': [
                    "Try: 'I need simple, foolproof outfit ideas'",
                    "Say: 'Help me feel less anxious about my appearance'",
                    "Ask: 'What are some confidence-building styling tips?'",
                    "Tell me: 'I want to feel calm and put-together'"
                ]
            },
            'frustration': {
                'validation': [
                    "I totally get that frustration! Fashion can be so challenging sometimes, but you're not alone in this. 💪",
                    "That frustration is so valid! Let's channel that energy into finding solutions that actually work for you. 🔥",
                    "I hear you, and I'm here to help turn this frustration into fashion success! We've got this! ⚡"
                ],
                'guidance': [
                    "Let's break down what's not working and find practical solutions that actually fit your lifestyle.",
                    "What specific issues keep coming up? We can tackle them one by one.",
                    "Tell me what's been your biggest fashion challenge - I'm here to help solve it!"
                ],
                'suggestions': [
                    "Try: 'Nothing seems to fit me properly'",
                    "Say: 'I'm tired of wasting money on clothes that don't work'",
                    "Ask: 'Help me build a foolproof wardrobe'",
                    "Tell me: 'I need practical solutions that actually work'"
                ]
            },
            'confusion': {
                'validation': [
                    "It's totally okay to feel confused about fashion - there are so many options! I'm here to guide you. 🌟",
                    "Fashion can be overwhelming, but that's what I'm here for! Let's figure this out together step by step. ✨",
                    "No judgment here! Everyone needs guidance sometimes, and I'm excited to help you find clarity. 💕"
                ],
                'guidance': [
                    "Let's start with the basics - what's the occasion and how do you want to feel?",
                    "Tell me about your lifestyle and preferences, and I'll help narrow down your options.",
                    "What's your main goal with this outfit? Comfort, style, confidence, or something else?"
                ],
                'suggestions': [
                    "Try: 'Help me understand what works for my body type'",
                    "Say: 'I need basic styling rules I can follow'",
                    "Ask: 'What should I consider when choosing clothes?'",
                    "Tell me: 'Guide me through building a wardrobe'"
                ]
            }
        }

    def detect_emotion_and_context(self, message: str) -> Dict[str, Any]:
        """Advanced emotion detection with context analysis"""
        message_lower = message.lower()
        detected_emotions = []
        
        # Check for emotion patterns
        for pattern_name, pattern_data in self.emotion_patterns.items():
            for keyword in pattern_data['keywords']:
                if keyword in message_lower:
                    detected_emotions.append({
                        'type': pattern_data['emotion'],
                        'intensity': pattern_data['intensity'],
                        'confidence': 0.8 if len(keyword.split()) > 1 else 0.6
                    })
                    break
        
        # Analyze context clues
        context = {
            'seeking_help': any(phrase in message_lower for phrase in ['help me', 'what should', 'guide me', 'suggest']),
            'expressing_problem': any(phrase in message_lower for phrase in ['problem', 'issue', 'trouble', 'wrong']),
            'about_clothing': any(phrase in message_lower for phrase in ['top', 'dress', 'outfit', 'clothes', 'wearing']),
            'emotional_distress': any(phrase in message_lower for phrase in ['feel', 'feeling', 'uncomfortable', 'bad'])
        }
        
        # Determine primary emotion
        primary_emotion = 'neutral'
        if detected_emotions:
            # Sort by confidence and intensity
            detected_emotions.sort(key=lambda x: x['confidence'], reverse=True)
            primary_emotion = detected_emotions[0]['type']
        
        return {
            'primary_emotion': primary_emotion,
            'all_emotions': detected_emotions,
            'context': context,
            'needs_support': primary_emotion in ['insecurity', 'anxiety', 'discomfort', 'frustration'],
            'seeking_guidance': context['seeking_help'] or context['expressing_problem']
        }

    def generate_empathetic_response(self, message: str, emotion_data: Dict) -> Dict[str, Any]:
        """Generate therapeutic, empathetic response"""
        primary_emotion = emotion_data['primary_emotion']
        
        if primary_emotion == 'neutral':
            return self._generate_general_response(message)
        
        # Get therapeutic responses for the emotion
        responses = self.therapeutic_responses.get(primary_emotion, {})
        
        # Build empathetic response
        validation = random.choice(responses.get('validation', ['I understand how you\'re feeling.']))
        guidance = random.choice(responses.get('guidance', ['How can I help you with this?']))
        suggestions = responses.get('suggestions', [])
        
        # Create comprehensive response
        response_text = f"{validation}\n\n{guidance}"
        
        # Add specific advice based on the message content
        if 'top' in message.lower() and 'comfortable' in message.lower():
            response_text += "\n\n💡 **For your top comfort:**\n"
            response_text += "• Check if it's the right size - too tight or loose can feel awkward\n"
            response_text += "• Consider the fabric - some materials can feel scratchy or clingy\n"
            response_text += "• Think about the fit - does it suit your body shape and personal style?\n"
            response_text += "• Remember: comfort is key to confidence!"
        
        return {
            'text': response_text,
            'suggestions': suggestions,
            'emotion_detected': emotion_data,
            'response_type': 'therapeutic',
            'products': []
        }

    def _generate_general_response(self, message: str) -> Dict[str, Any]:
        """Generate general helpful response"""
        general_responses = [
            "I'm here to help you feel amazing in your clothes! What's on your mind today? ✨",
            "Tell me more about what you're looking for - I want to give you the best advice! 💕",
            "I'm your fashion therapist and stylist rolled into one! How can I support you today? 🌟"
        ]
        
        suggestions = [
            "Try: 'I need help feeling confident in my clothes'",
            "Say: 'Help me find my perfect style'",
            "Ask: 'What should I wear to feel amazing?'",
            "Tell me: 'I want to love how I look'"
        ]
        
        return {
            'text': random.choice(general_responses),
            'suggestions': suggestions,
            'emotion_detected': {'primary_emotion': 'neutral', 'needs_support': False},
            'response_type': 'general',
            'products': []
        }

    def search_products(self, query: str, emotion_context: Dict = None) -> List[Dict]:
        """Search products with emotional context consideration"""
        if not self.products:
            return []
        
        # Simple product matching (can be enhanced with actual product data)
        matching_products = []
        query_lower = query.lower()
        
        # Mock products for demonstration
        comfort_products = [
            {
                'id': 'comfort_top_1',
                'title': 'Ultra-Soft Cotton Comfort Top',
                'description': 'Designed for all-day comfort with breathable fabric and relaxed fit',
                'price': '$29.99',
                'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
                'comfort_rating': 5,
                'confidence_boost': 4
            },
            {
                'id': 'comfort_top_2', 
                'title': 'Confidence-Boosting Fitted Tee',
                'description': 'Flattering cut that enhances your natural silhouette',
                'price': '$34.99',
                'image': 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=300&h=400&fit=crop',
                'comfort_rating': 4,
                'confidence_boost': 5
            }
        ]
        
        if 'top' in query_lower and emotion_context and emotion_context.get('needs_support'):
            return comfort_products
        
        return []

    def load_products(self, products_file: str = None):
        """Load products from JSON file"""
        if not products_file:
            products_file = Path(__file__).parent.parent.parent / "data" / "processed" / "smart_products.json"
        
        try:
            if os.path.exists(products_file):
                with open(products_file, 'r', encoding='utf-8') as f:
                    self.products = json.load(f)
                logger.info(f"Loaded {len(self.products)} products")
        except Exception as e:
            logger.error(f"Failed to load products: {e}")
            self.products = []

    def process_message(self, user_id: str, message: str, chat_id: str = None) -> Dict[str, Any]:
        """Main message processing with emotional intelligence"""
        try:
            # Detect emotion and context
            emotion_data = self.detect_emotion_and_context(message)
            
            # Generate empathetic response
            response = self.generate_empathetic_response(message, emotion_data)
            
            # Add products if appropriate
            if emotion_data['seeking_guidance'] and not emotion_data.get('needs_support'):
                products = self.search_products(message, emotion_data)
                response['products'] = products
            
            # Save to chat history
            self._save_to_history(user_id, message, response, chat_id)
            
            return {
                'success': True,
                'response': response
            }
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return {
                'success': False,
                'response': {
                    'text': "I'm here for you, even when technology hiccups! Let's focus on making you feel amazing. How can I help? 💕",
                    'suggestions': [
                        "Try: 'I need emotional support with fashion'",
                        "Say: 'Help me feel confident today'",
                        "Ask: 'What should I wear to boost my mood?'"
                    ],
                    'emotion_detected': {'primary_emotion': 'neutral', 'needs_support': False},
                    'response_type': 'error_recovery',
                    'products': []
                }
            }

    def _save_to_history(self, user_id: str, message: str, response: Dict, chat_id: str = None):
        """Save conversation to history"""
        if user_id not in self.chat_histories:
            self.chat_histories[user_id] = []
        
        self.chat_histories[user_id].append({
            'timestamp': datetime.now().isoformat(),
            'user_message': message,
            'bot_response': response,
            'chat_id': chat_id
        })

# Global instance
empathetic_bot = EmpathethicFashionBot()