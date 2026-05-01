import google.generativeai as genai
import os
from pathlib import Path
from dotenv import load_dotenv

class GeminiService:
    def __init__(self):
        # Load .env from project root
        project_root = Path(__file__).resolve().parent.parent.parent
        load_dotenv(dotenv_path=project_root / ".env")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        # Using gemini-1.5-flash for speed and reliability, but keeping user's preference for flash models
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    def generate_response(self, message, history=None, image_data=None):
        system_instruction = """
        You are an elite, highly empathetic fashion counselor and personal stylist for StyleGenie.
        Your goal is to guide users to find their unique style, offer tailored fashion advice, and recommend products.
        
        CORE GUIDELINES:
        1. EMPATHY: Be highly attuned to user emotions. If a user expresses insecurity, respond with warmth and encouragement.
        2. FASHION EXPERTISE: Focus entirely on fashion, beauty, and styling. Mention specific stores like Myntra, Ajio, Flipkart, Savana, Urbanic, and Bewakoof for Indian users.
        3. IMAGE ANALYSIS: If images are provided, analyze the outfit and suggest complementary footwear, accessories, or styling tweaks with specific product names.
        4. POSITIVITY: Maintain an uplifting tone. Don't answer anything outside of fashion/styling.
        5. FORMATTING: Use Markdown for beautiful responses with bold headers and bullet points.
        6. AGENTIC STYLE: Be proactive. If they ask for a dress, suggest matching shoes too.
        """.strip()

        prompt_parts = [system_instruction]
        
        if history:
            for entry in history:
                role = "User" if entry.get('role') == 'user' else "Assistant"
                prompt_parts.append(f"{role}: {entry.get('content')}")
        
        prompt_parts.append(f"User: {message}")
        
        if image_data:
            # image_data is expected to be a base64 string or a PIL image
            # If it's a base64 string with prefix, remove it
            if isinstance(image_data, str) and "," in image_data:
                image_data = image_data.split(",")[1]
            
            prompt_parts.append({
                "mime_type": "image/jpeg",
                "data": image_data
            })

        response = self.model.generate_content(prompt_parts)
        return response.text

_gemini_service_instance = None

def get_gemini_service():
    global _gemini_service_instance
    if _gemini_service_instance is None:
        _gemini_service_instance = GeminiService()
    return _gemini_service_instance

# For backward compatibility if any module imports gemini_service directly
# but we should ideally use get_gemini_service()
# gemini_service = GeminiService() 
