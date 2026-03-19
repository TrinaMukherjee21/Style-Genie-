# chatbot/interactive_ai.py
# Enhanced Interactive Fashion AI with greetings, small-talk, and visual search

import random

class InteractiveFashionAI:
    def __init__(self, recommender):
        """
        recommender: instance of your EnhancedStyleGenieRecommender
        """
        self.recommender = recommender
        self.last_responses = {}  # Track recent responses per session
        
        # Varied response templates
        self.greeting_responses = [
            "Hello! I'm your StyleBot! How can I help today? For example: 'Show me casual outfits', 'Suggest shoes for a red dress'.",
            "Hi there! I'm here to help with your fashion needs. What are you looking for today?",
            "Hey! Ready to find some amazing styles? Tell me what you need!",
            "Welcome! I'm your personal fashion assistant. How can I style you today?"
        ]
        
        self.thank_responses = [
            "You're welcome! Would you like more outfit suggestions?",
            "Happy to help! Need anything else for your wardrobe?",
            "My pleasure! Want to explore more styles?",
            "Glad I could assist! Looking for anything specific?"
        ]
        
        self.status_responses = [
            "I'm feeling stylish as always! Ready to help you with fashion tips!",
            "Doing great! Excited to help you find the perfect look!",
            "Fantastic! I'm here and ready to style you up!",
            "Wonderful! Let's create some amazing outfits together!"
        ]

    def _get_varied_response(self, session_id, response_type, responses_list):
        """Get a varied response that wasn't used recently"""
        if not session_id:
            session_id = "default"
            
        # Initialize session tracking
        if session_id not in self.last_responses:
            self.last_responses[session_id] = {}
            
        recent = self.last_responses[session_id].get(response_type, [])
        
        # Filter out recently used responses
        available = [r for r in responses_list if r not in recent[-2:]]
        if not available:
            available = responses_list
            
        chosen = random.choice(available)
        
        # Track the response
        if response_type not in self.last_responses[session_id]:
            self.last_responses[session_id][response_type] = []
        self.last_responses[session_id][response_type].append(chosen)
        
        # Keep only last 3 responses
        self.last_responses[session_id][response_type] = self.last_responses[session_id][response_type][-3:]
        
        return chosen

    def _check_conversation_context(self, session, message):
        """Check recent conversation to provide contextual responses"""
        if not session or "history" not in session:
            return None
            
        recent_history = session["history"][-3:]  # Last 3 exchanges
        
        # Check if user is asking the same thing repeatedly
        user_messages = [h.get("text", "").lower() for h in recent_history if h.get("from") == "user"]
        current_msg = message.lower().strip()
        
        if len(user_messages) >= 2 and current_msg in user_messages[-2:]:
            return {
                "text": "I notice you're asking something similar again. Let me try a different approach! Could you be more specific about what you're looking for?",
                "products": []
            }
            
        return None

    def handle_turn(self, message, image=None, session=None, top_k=5):
        """
        Main conversational handler.
        - message: user text input
        - image: optional uploaded image (PIL image or base64 decoded)
        - session: optional user session dict
        - top_k: number of product recommendations to return
        """
        msg = (message or "").strip().lower()
        session_id = session.get("user_id", "default") if session else "default"
        
        # Check for repetitive conversation patterns
        context_response = self._check_conversation_context(session, message or "")
        if context_response:
            return context_response

        # 1. Greetings and small talk with variety
        greetings = ["hi", "hello", "hey", "good morning", "good evening", "good night"]
        if any(g in msg for g in greetings):
            return {
                "text": self._get_varied_response(session_id, "greeting", self.greeting_responses),
                "products": []
            }

        if "thank" in msg:
            return {
                "text": self._get_varied_response(session_id, "thanks", self.thank_responses),
                "products": []
            }

        if "how are you" in msg or "how do you feel" in msg:
            return {
                "text": self._get_varied_response(session_id, "status", self.status_responses),
                "products": []
            }

        # 2. If an image is provided → visual search
        if image is not None:
            try:
                result = self.recommender.handle_visual_query(
                    image=image,
                    query=message,
                    top_k=top_k
                )
                # Add context to avoid repetitive image responses
                if session and "history" in session:
                    recent_image_responses = [h for h in session["history"][-3:] 
                                            if h.get("from") == "bot" and h.get("has_image")]
                    if len(recent_image_responses) >= 2:
                        result["text"] = f"Here's a fresh take: {result.get('text', '')}"
                        
                return result
            except Exception as e:
                return {
                    "text": f"Sorry, I couldn't process the image. ({str(e)})",
                    "products": []
                }

        # 3. If it's a text-based fashion query → use recommender
        if msg:
            try:
                result = self.recommender.handle_text_query(
                    query=message,
                    top_k=top_k
                )
                
                # Add variety to text responses if they seem repetitive
                if result and "text" in result:
                    base_text = result["text"]
                    if session and "history" in session:
                        recent_bot_responses = [h.get("text", "") for h in session["history"][-3:] 
                                              if h.get("from") == "bot"]
                        if base_text in recent_bot_responses:
                            variations = [
                                f"Let me show you some different options: {base_text.split(':', 1)[-1] if ':' in base_text else base_text}",
                                f"Here's another selection: {base_text.split(':', 1)[-1] if ':' in base_text else base_text}",
                                f"I found some fresh picks: {base_text.split(':', 1)[-1] if ':' in base_text else base_text}"
                            ]
                            result["text"] = random.choice(variations)
                            
                return result
            except Exception as e:
                return {
                    "text": f"Oops, something went wrong while finding styles: {str(e)}",
                    "products": []
                }

        # 4. Fallback if nothing matches
        fallback_responses = [
            "I'm your Style Assistant! Ask me about outfits, colors, or upload a photo for suggestions!",
            "Ready to help with fashion! Try asking about specific items or upload an image.",
            "Let's find your perfect style! What are you shopping for today?",
            "I'm here to help with all things fashion! What can I find for you?"
        ]
        
        return {
            "text": self._get_varied_response(session_id, "fallback", fallback_responses),
            "products": []
        }