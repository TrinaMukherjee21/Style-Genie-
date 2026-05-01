# src/chatbot/openai_integration.py
import os
import logging
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger("stylegenie_openai")
logging.basicConfig(level=logging.INFO)

class OpenAIBot:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            logger.warning("OPENAI_API_KEY not found in environment variables!")
        openai.api_key = self.api_key
        
        # Use GPT-4o for its superior fashion coding and vision capabilities
        self.model = "gpt-4o"
        self.system_prompt = """
You are StyleBot, a sophisticated, fashion-forward, and empathetic personal AI stylist for StyleGenie. 
Your goal is to help users discover their unique style, build confidence, and find perfect outfits.

Key Traits:
- Fashion Expert: Deep knowledge of trends, fabrics, silhouettes, and color theory.
- Empathetic Stylist: You understand that clothing is personal and can affect how people feel.
- Encouraging: You empower users to feel beautiful and confident.
- Practical: You provide real styling advice (e.g., "Pair this with a structured blazer for a professional look").

When users ask for styling advice or show items:
1. Acknowledge their style preference.
2. Provide specific, actionable pairing suggestions (shoes, accessories, layers).
3. Explain WHY these choices work (e.g., "The contrast in textures adds visual interest").
4. Always maintain a premium, friendly, and expert tone.
"""

    def generate_response(self, user_message, recommendations=None, user_profile=None):
        """Generate a contextual, empathetic fashion response"""
        if not self.api_key: 
            return "I'm currently in basic mode, but I can still help! You have great taste."

        # Format context for OpenAI
        context = f"User profile: {user_profile}\n" if user_profile else ""
        if recommendations:
            context += "Recommended products:\n"
            for p in recommendations[:3]:
                context += f"- {p.get('title') or p.get('name')}: {p.get('description')}\n"

        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": f"{context}\nUser said: {user_message}"}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI generate_response error: {e}")
            return "I'm having a technical moment with my fashion database, but I'd still love to help you style this! What's your favorite color?"

    def generate_product_recommendations_text(self, recommendations, query):
        """Generate specific text highlighting why these products match the query"""
        if not self.api_key or not recommendations:
            return "Here are some beautiful pieces I found for you! ✨"

        try:
            product_list = "\n".join([f"- {p.get('title') or p.get('name')}" for p in recommendations[:3]])
            prompt = f"The user is looking for: '{query}'.\nI found these products:\n{product_list}\n\nWrite a short, exciting, and expert response (2-3 sentences) explaining why these pieces are perfect for them."

            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI generate_product_recommendations_text error: {e}")
            return "These pieces match your request beautifully! I love how they balance style and comfort. ✨"

    def analyze_image_styling(self, image_b64, user_query="What should I pair with this?"):
        """Advanced vision-based styling advice"""
        if not self.api_key:
            return "I'm still learning to see, but that item looks like it has great potential!"

        try:
            # Note: GPT-4o supports vision via the same ChatCompletion endpoint
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": user_query},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_b64}" if not image_b64.startswith("data:") else image_b64
                                }
                            }
                        ]
                    }
                ],
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI vision error: {e}")
            return "I can see you've uploaded an image! I'm having a slight bit of trouble 'seeing' the details right now, but generally, pieces like this look amazing with neutral basics and bold accessories. ✨"

# Export a singleton instance
openai_bot = OpenAIBot()
