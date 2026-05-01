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

class EmpatheticFashionBot:
    """Intelligent fashion chatbot with emotional understanding and therapeutic responses"""
    
    def __init__(self, products_file: Optional[str] = None):
        self.products: List[Dict[str, Any]] = []
        self.chat_histories: Dict[str, Any] = {}
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
        search_keywords = ['show', 'find', 'looking for', 'need', 'give me', 'suggest', 'get me', 'search', 'buy']
        clothing_keywords = ['top', 'dress', 'outfit', 'clothes', 'wearing', 'shirt', 'jeans', 'pant', 'shoe', 'accessory', 'jewelry', 'skirt', 'jacket', 'coat', 'hoodie']
        
        context = {
            'seeking_help': any(phrase in message_lower for phrase in ['help me', 'what should', 'guide me', 'suggest', 'advice']),
            'expressing_problem': any(phrase in message_lower for phrase in ['problem', 'issue', 'trouble', 'wrong']),
            'about_clothing': any(phrase in message_lower for phrase in clothing_keywords),
            'emotional_distress': any(phrase in message_lower for phrase in ['feel', 'feeling', 'uncomfortable', 'bad']),
            'is_search_intent': any(phrase in message_lower for phrase in search_keywords) or any(phrase in message_lower for phrase in clothing_keywords)
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
            'seeking_guidance': context['seeking_help'] or context['expressing_problem'] or context['is_search_intent']
        }

    def generate_empathetic_response(self, message: str, emotion_data: Dict) -> Dict[str, Any]:
        """Generate therapeutic, empathetic response"""
        primary_emotion = emotion_data['primary_emotion']
        message_lower = message.lower()
        
        # Add products if it looks like a search
        products = []
        if emotion_data['seeking_guidance']:
            products = self.search_products(message, emotion_data)
        
        if primary_emotion == 'neutral':
            if products:
                response_text = f"I've found some wonderful pieces that match your style! Take a look at these suggestions: ✨"
                return {
                    'text': response_text,
                    'suggestions': ["Show me more like this", "Do you have this in other colors?", "What should I wear with these?"],
                    'emotion_detected': emotion_data,
                    'response_type': 'product_search',
                    'products': products
                }
            return self._generate_general_response(message)
        
        # Get therapeutic responses for the emotion
        responses = self.therapeutic_responses.get(primary_emotion, {})
        
        # Build empathetic response
        validation = random.choice(responses.get('validation', ['I understand how you\'re feeling.']))
        guidance = random.choice(responses.get('guidance', ['How can I help you with this?']))
        suggestions = responses.get('suggestions', [])
        
        # Create comprehensive response
        response_text = f"{validation}\n\n{guidance}"
        
        if products:
            response_text += f"\n\nTo help brighten your day, I've curated a few items that I think you'll love! Style can be a great form of self-care. 💕"
        
        # Add specific advice based on the message content
        if 'top' in message_lower and 'comfortable' in message_lower:
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
            'products': products
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

    def search_products(self, query: str, emotion_context: Optional[Dict] = None) -> List[Dict]:
        """Real keyword-based product search scanning the entire catalog"""
        if not self.products:
            return []
        
        query_lower = query.lower()
        
        # Remove common "noise" words from search
        noise_words = ['show', 'me', 'some', 'find', 'looking', 'for', 'need', 'a', 'an', 'the', 'can', 'you', 'give', 'stylebot', 'bot']
        keywords = [word for word in query_lower.split() if word not in noise_words and len(word) > 2]
        
        if not keywords:
            # If no specific keywords, use a broad search for clothing types
            clothing_types = ['top', 'dress', 'jeans', 'shirt', 'shoe', 'skirt', 'jacket']
            keywords = [word for word in query_lower.split() if word in clothing_types]
            
        if not keywords:
            return []

        scored_products = []
        for p in self.products:
            score = 0
            name = p.get('name', '').lower()
            desc = p.get('description', '').lower()
            cat = p.get('category', '').lower()
            styles = [s.lower() for s in p.get('style', [])]
            
            # 1. Keyword matching with prioritization
            for kw in keywords:
                # Exact name match (highest priority)
                if kw == name: score += 50
                # Keyword in name
                if kw in name: score += 10
                # Keyword in category
                if kw in cat: score += 8
                # Keyword in style tags
                if any(kw in s for s in styles): score += 5
                # Keyword in description
                if kw in desc: score += 2
            
            if score > 0:
                # Format for frontend expectatons
                scored_products.append({
                    'id': p.get('id', p.get('product_id')),
                    'title': p.get('name'),
                    'price': f"${p.get('price', '85')}",
                    'description': p.get('description'),
                    'category': p.get('category'),
                    'image': p.get('image_url', ''),
                    'score': score
                })
        
        # Sort by score and take top 6
        scored_products.sort(key=lambda x: x['score'], reverse=True)
        return scored_products[:6]

    def get_quiz_recommendations(self, quiz_results: Dict) -> List[Dict]:
        """Generate accurate tag-based recommendations based on quiz results"""
        primary_aesthetic = quiz_results.get('primaryAesthetic', 'minimalist').lower()
        secondary_aesthetics = quiz_results.get('secondaryAesthetics', [])
        if isinstance(secondary_aesthetics, dict):
            secondary_aesthetics = list(secondary_aesthetics.keys())
            
        user_gender = quiz_results.get('gender', 'unisex').lower()
        # Normalize gender strings - expanded list for robustness
        female_terms = ['women', 'woman', 'female', 'lady', 'girl', 'girls', 'ladies', 'femme']
        male_terms = ['men', 'man', 'male', 'gentleman', 'boy', 'boys', 'gentlemen', 'masculine']
        
        if any(term == user_gender or re.search(rf'\b{term}\b', user_gender) for term in male_terms):
            target_gender = 'male'
        elif any(term == user_gender or re.search(rf'\b{term}\b', user_gender) for term in female_terms):
            target_gender = 'female'
        else:
            target_gender = 'unisex'
            
        logger.info(f"Targeting gender: {target_gender} for user preference: {user_gender}")
            
        all_scored_products = []
        
        for p in self.products:
            score = 0.0
            
            # 1. Strict Gender check
            prod_genders = p.get('gender', ['unisex'])
            # Normalize product genders as well
            prod_genders = [g.lower() for g in prod_genders]
            
            if target_gender == 'female':
                # ABSOLUTE FILTER: Only 'female' or 'unisex' items allowed
                if 'male' in prod_genders and 'female' not in prod_genders:
                    continue
                if 'female' not in prod_genders and 'unisex' not in prod_genders:
                    continue
                
                # Name-based safety check
                prod_name = p.get('name', '').lower()
                if any(m in prod_name for m in [' men', 'male', ' boy', 'gentlemen']) and 'women' not in prod_name:
                    continue
                    
            elif target_gender == 'male':
                # ABSOLUTE FILTER: Only 'male' or 'unisex' items allowed
                if 'female' in prod_genders and 'male' not in prod_genders:
                    continue
                if 'male' not in prod_genders and 'unisex' not in prod_genders:
                    continue
                    
                # Name-based safety check
                prod_name = p.get('name', '').lower()
                if any(f in prod_name for f in ['women', 'female', 'girl', 'lady', 'ladies']) and ' men' not in prod_name:
                    continue
            
            # 2. KIDS CLOTHING FILTER - completely ignore for everyone
            prod_name = p.get('name', '').lower()
            if any(k in prod_name for k in ['kids', 'boy', 'girl', 'frock']):
                # Double check to ensure we don't skip adult items with these words accidentally
                # But to be safe as per user request: ignore
                continue
            
            # Additional robustness for 'unisex' target
            if target_gender == 'unisex' or target_gender not in ['male', 'female']:
                # If product is strictly male or strictly female, it's not a great unisex fit
                if 'male' in prod_genders and 'female' not in prod_genders:
                     score -= 2.0
                if 'female' in prod_genders and 'male' not in prod_genders:
                     score -= 2.0
                
            # 2. Relaxed Tag matching (Style)
            prod_styles = p.get('style', [])
            
            if any(primary_aesthetic in s for s in prod_styles) or any(s in primary_aesthetic for s in prod_styles):
                score += 5.0
            
            for sa in secondary_aesthetics:
                if isinstance(sa, str) and (any(sa.lower() in s for s in prod_styles) or any(s in sa.lower() for s in prod_styles)):
                    score += 2.0
                    
            # 3. Add base score and a small random factor to prevent repetition
            score = float(score) + 1.0 + (random.random() * 0.5)
                    
            if score > 0:
                img_url = p.get('image_url', '')
                all_scored_products.append({
                    'id': p.get('id', p.get('product_id')), # robust id mapping
                    'title': p.get('name'),
                    'price': f"${p.get('price', 85)}",
                    'description': p.get('description'),
                    'aesthetic': primary_aesthetic,
                    'category': p.get('category'),
                    'score': score,
                    'image': img_url
                })

        # Sort by score descending
        all_scored_products.sort(key=lambda x: x['score'], reverse=True)
        
        # 3. Select for Variety
        diverse_products = []
        broad_category_counts = {}
        category_map = {
            'vest top': 'tops', 'shirt': 'tops', 't-shirt': 'tops', 'blouse': 'tops',
            'leggings': 'bottoms', 'pants': 'bottoms', 'shorts': 'bottoms'
        }
        
        for p in all_scored_products:
            raw_cat = str(p.get('category', 'tops')).lower()
            broad_cat = category_map.get(raw_cat, raw_cat)
            
            # Variety filter: If we have many items, be strict. If few, be relaxed.
            limit = 2 if len(diverse_products) < 4 else 3
            if broad_category_counts.get(broad_cat, 0) < limit:
                current_score = p.get('score', 0)
                p['score'] = min(0.99, 0.82 + (float(str(current_score)) * 0.01))
                diverse_products.append(p)
                broad_category_counts[broad_cat] = broad_category_counts.get(broad_cat, 0) + 1
            
            if len(diverse_products) >= 12:
                break
                
        # Fallback to straight scoring if diversity filters out too much
        # Fallback to straight scoring if diversity filters out too much
        if len(diverse_products) < 4 and all_scored_products:
            diverse_products = []
            for i, p in enumerate(all_scored_products):
                if i >= 12: break
                diverse_products.append(p)
            for p in diverse_products:
                current_score = p.get('score', 0)
                p['score'] = min(0.99, 0.82 + (float(str(current_score)) * 0.01))

        if not diverse_products:
            logger.warning(f"No matching products found for {primary_aesthetic} and gender {target_gender}, using generic gender-filtered items")
            # CRITICAL FIX: Even in fallback, filter by gender!
            gender_filtered_fallback = []
            for p in self.products:
                pg = [g.lower() for g in p.get('gender', ['unisex'])]
                if target_gender == 'female':
                    if 'female' in pg or 'unisex' in pg:
                        # Name check in fallback too
                        pn = p.get('name', '').lower()
                        if not ('male' in pn and 'female' not in pn):
                            if not any(k in pn for k in ['kids', 'boy', 'girl', 'frock']):
                                gender_filtered_fallback.append(p)
                elif target_gender == 'male':
                    if 'male' in pg or 'unisex' in pg:
                        pn = p.get('name', '').lower()
                        if not ('female' in pn and 'male' not in pn):
                            if not any(k in pn for k in ['kids', 'boy', 'girl', 'frock']):
                                gender_filtered_fallback.append(p)
                else:
                    # Unisex fallback: prioritize only items NOT strictly male or female
                    pn = p.get('name', '').lower()
                    if not any(k in pn for k in ['kids', 'boy', 'girl', 'frock']):
                        if 'male' not in pg or 'female' in pg: # items that are unisex or both
                            gender_filtered_fallback.append(p)
            
            diverse_products = gender_filtered_fallback[:12] # type: ignore
            
            # Ensure the generic catalog items are formatted properly for the frontend
            formatted_fallbacks = []
            for item in diverse_products:
                formatted_fallbacks.append({
                    'id': item.get('id', item.get('product_id')),
                    'title': item.get('name'),
                    'price': f"${item.get('price', 85)}",
                    'description': item.get('description'),
                    'aesthetic': primary_aesthetic,
                    'category': item.get('category'),
                    'score': 0.85,
                    'image': item.get('image_url', '')
                })
            return formatted_fallbacks

        return diverse_products[:12] # type: ignore

    def _get_fallback_products(self, aesthetic: str) -> List[Dict]:
        """High quality fallback products when search returns too few results"""
        templates = {
            'minimalist': [
                {'title': 'Essential White Cotton Tee', 'price': '$42', 'category': 'tops'},
                {'title': 'Sleek Minimalist Watch', 'price': '$198', 'category': 'accessories'},
                {'title': 'Minimalist Silk Blouse', 'price': '$78', 'category': 'tops'}
            ],
            'streetwear': [
                {'title': 'Urban Oversized Hoodie', 'price': '$72', 'category': 'tops'},
                {'title': 'High-Top Street Sneakers', 'price': '$95', 'category': 'shoes'}
            ]
        }
        
        items = templates.get(aesthetic, templates['minimalist'])
        fallbacks = []
        for i, item in enumerate(items):
            fallbacks.append({
                'id': f'fb_{aesthetic}_{i}',
                'title': item['title'],
                'price': item['price'],
                'description': f"A signature {aesthetic} piece for your unique style.",
                'aesthetic': aesthetic,
                'category': item['category'],
                'score': 0.9 - (i * 0.05),
                'image': ''
            })
        return fallbacks

    def load_products(self, products_file: Optional[str] = None):
        """Load products from JSON file"""
        if not products_file:
            products_file = str(Path(__file__).parent / "curated_products.json")
        
        try:
            if os.path.exists(products_file):
                with open(products_file, 'r', encoding='utf-8') as f:
                    self.products = json.load(f)
                logger.info(f"Loaded {len(self.products)} products")
        except Exception as e:
            logger.error(f"Failed to load products: {e}")
            self.products = []

    def process_message(self, user_id: str, message: str, chat_id: Optional[str] = None) -> Dict[str, Any]:
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

    def _save_to_history(self, user_id: str, message: str, response: Dict, chat_id: Optional[str] = None):
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
empathetic_bot = EmpatheticFashionBot()
# Force flask reload for JSON update pt 4