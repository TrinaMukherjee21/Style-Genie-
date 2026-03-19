# StyleGenie System Architecture

## 🏗️ **Overview**
StyleGenie is a comprehensive AI-powered fashion e-commerce platform with empathetic chatbot, voice assistant, style personality assessment, and product recommendations.

## 📊 **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  React.js Application (Vite + Tailwind CSS)                    │
│  ┌─────────────────┬─────────────────┬─────────────────────────┐ │
│  │   Pages Layer   │ Components Layer│    Context Layer        │ │
│  │                 │                 │                         │ │
│  │ • HomePage      │ • EnhancedChat  │ • UserContext          │ │
│  │ • ProductsPage  │ • ProductModal  │ • AuthContext          │ │
│  │ • QuizPage      │ • VoiceAssist   │ • CartContext          │ │
│  │ • ProfilePage   │ • StyleQuiz     │                         │ │
│  └─────────────────┴─────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Flask REST API Server (Python)                                │
│  ┌─────────────────┬─────────────────┬─────────────────────────┐ │
│  │   Endpoints     │   Middleware    │    Error Handling       │ │
│  │                 │                 │                         │ │
│  │ • /chat         │ • CORS          │ • Empathetic Errors     │ │
│  │ • /health       │ • JSON Parser   │ • Graceful Fallbacks    │ │
│  │ • /history      │ • Rate Limiting │ • Therapeutic Messages  │ │
│  └─────────────────┴─────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI ENGINE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  SmartFashionBot (Python)                                      │
│  ┌─────────────────┬─────────────────┬─────────────────────────┐ │
│  │ Emotion Engine  │ Response Engine │   Product Engine        │ │
│  │                 │                 │                         │ │
│  │ • Detect Mood   │ • Empathy Gen   │ • Smart Search          │ │
│  │ • Context Aware │ • Therapeutic   │ • Image Matching        │ │
│  │ • Support Level │ • Diverse Style │ • Category Filter       │ │
│  └─────────────────┴─────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┬─────────────────┬─────────────────────────┐ │
│  │  Product Data   │   User Data     │    Chat Data            │ │
│  │                 │                 │                         │ │
│  │ • 105K+ Items   │ • LocalStorage  │ • Chat History          │ │
│  │ • JSON Format   │ • User Profile  │ • Message Context       │ │
│  │ • Smart Catalog │ • Preferences   │ • Emotion Tracking      │ │
│  └─────────────────┴─────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 **Core Components**

### **1. Frontend Architecture (React.js)**

#### **Pages Layer**
```
src/pages/
├── HomePage.jsx           # Landing page with hero section
├── ProductsPage.jsx       # Product catalog with filters
├── QuizPage.jsx          # Style personality assessment
├── ProfilePage.jsx       # User profile management
├── CartPage.jsx          # Shopping cart functionality
└── FavoritesPage.jsx     # Wishlist management
```

#### **Components Layer**
```
src/components/
├── EnhancedChatBot.jsx   # AI chatbot with voice support
├── ProductModal.jsx      # Detailed product view
├── StyleQuiz.jsx         # Personality quiz component
├── VoiceAssistant.jsx    # Speech recognition interface
├── ProductCard.jsx       # Product display component
└── Navigation.jsx        # App navigation
```

#### **Context Layer**
```
src/context/
├── UserContext.js        # Global user state management
├── AuthContext.js        # Authentication state
└── CartContext.js        # Shopping cart state
```

#### **Utilities Layer**
```
src/utils/
├── quizAnalyzer.js       # Style personality analysis
├── voiceUtils.js         # Speech recognition utilities
└── apiUtils.js           # API communication helpers
```

### **2. Backend Architecture (Flask API)**

#### **API Server Structure**
```
src/chatbot/
├── flask_api.py          # Main Flask application
├── smart_fashion_bot.py  # AI chatbot engine
├── chat_histories.json   # Chat persistence
└── requirements.txt      # Python dependencies
```

#### **API Endpoints**
```
GET  /                    # API information
GET  /health             # System health check
POST /chat               # Main chat interaction
GET  /chat/history/:id   # User chat history
GET  /chat/messages/:id  # Chat messages
POST /chat/new/:id       # Create new chat
DELETE /chat/delete/:id  # Delete chat session
```

### **3. AI Engine Architecture**

#### **SmartFashionBot Class Structure**
```python
class SmartFashionBot:
    ├── __init__()                    # Initialize bot with products
    ├── detect_emotion()              # Emotion recognition engine
    ├── get_empathetic_response()     # Therapeutic response generator
    ├── get_styling_advice()          # Fashion styling expertise
    ├── get_therapeutic_suggestions() # Contextual suggestions
    ├── search_products()             # Smart product matching
    ├── format_products()             # Product presentation
    └── process_message()             # Main message processing
```

#### **Emotion Detection System**
```python
emotions = {
    'excited': ['excited', 'love', 'amazing', 'perfect'],
    'anxious': ['nervous', 'worried', 'anxious', 'scared'],
    'frustrated': ['frustrated', 'annoyed', 'hate', 'terrible'],
    'sad': ['sad', 'depressed', 'down', 'upset'],
    'confident': ['confident', 'ready', 'bold', 'fierce'],
    'insecure': ['insecure', 'self-conscious', 'ugly']
}
```

### **4. Data Architecture**

#### **Product Database**
```json
{
  "product_id": "unique_identifier",
  "name": "Product Name",
  "category": "dress|shoes|top|bottom",
  "color": "color_name",
  "description": "detailed_description",
  "price": "price_range",
  "image_url": "product_image",
  "metadata": {
    "style": "casual|formal|party",
    "season": "spring|summer|fall|winter",
    "occasion": "work|date|party|casual"
  }
}
```

#### **User Profile Structure**
```json
{
  "user_id": "unique_identifier",
  "profile": {
    "name": "user_name",
    "gender": "female|male|non-binary",
    "style_personality": "minimalist|bohemian|classic",
    "preferences": {
      "colors": ["preferred_colors"],
      "styles": ["preferred_styles"],
      "sizes": ["size_preferences"]
    }
  },
  "chat_history": [],
  "favorites": [],
  "cart": []
}
```

#### **Chat Session Structure**
```json
{
  "chat_id": "unique_identifier",
  "user_id": "user_identifier",
  "messages": [
    {
      "type": "user|bot|system",
      "content": "message_text",
      "products": [],
      "suggestions": [],
      "emotion_detected": {},
      "timestamp": "ISO_datetime"
    }
  ],
  "emotion_context": {},
  "created_at": "ISO_datetime",
  "updated_at": "ISO_datetime"
}
```

## 🔄 **Data Flow Architecture**

### **1. User Interaction Flow**
```
User Input → Voice/Text Processing → Emotion Detection → 
Context Analysis → Response Generation → Product Matching → 
UI Rendering → User Feedback Loop
```

### **2. Chat Processing Pipeline**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   Frontend  │    │   API       │
│   Input     │───▶│   Process   │───▶│   Endpoint  │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Response  │    │   AI Engine │    │   Emotion   │
│   Format    │◀───│   Process   │◀───│   Detection │
└─────────────┘    └─────────────┘    └─────────────┘
```

### **3. Voice Assistant Flow**
```
Speech Input → Web Speech API → Transcript Processing → 
Empathetic Confirmation → Chat Processing → 
Voice Feedback → Error Handling
```

## 🛡️ **Security & Performance**

### **Security Measures**
- CORS configuration for cross-origin requests
- Input sanitization and validation
- Rate limiting on API endpoints
- Secure error handling without data exposure

### **Performance Optimizations**
- Lazy loading for product images
- Efficient product search algorithms
- Local storage for chat persistence
- Debounced voice recognition
- Optimized React rendering with keys

## 🔧 **Technology Stack**

### **Frontend**
- **Framework**: React.js 18+ with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: Context API + Local Storage
- **Voice**: Web Speech API

### **Backend**
- **Framework**: Flask (Python)
- **AI Processing**: Custom NLP engine
- **Data Storage**: JSON files
- **API**: RESTful architecture
- **CORS**: Flask-CORS

### **Development Tools**
- **Package Manager**: npm/yarn
- **Build Tool**: Vite
- **Code Quality**: ESLint
- **Version Control**: Git

## 📈 **Scalability Considerations**

### **Current Architecture Supports**
- 105,000+ products in memory
- Multiple concurrent chat sessions
- Real-time emotion detection
- Voice processing capabilities

### **Future Enhancements**
- Database integration (PostgreSQL/MongoDB)
- Redis for session management
- Microservices architecture
- Machine learning model integration
- Real-time notifications

## 🎨 **UI/UX Architecture**

### **Design System**
- **Color Palette**: Purple/Pink gradients with dark theme
- **Typography**: Modern, readable fonts
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

### **User Experience Flow**
```
Landing → Quiz (Optional) → Chat/Browse → Product Selection → 
Cart → Checkout → Profile Management
```

This architecture provides a robust, scalable foundation for an AI-powered fashion platform with empathetic user interaction capabilities.