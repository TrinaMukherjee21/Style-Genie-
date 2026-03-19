# StyleGenie Chatbot System

This directory contains all the chatbot components for the StyleGenie application, consolidating both backend and frontend chatbot functionality.

## Directory Structure

```
src/chatbot/
├── api.py                  # Main Flask API server for chatbot
├── auth.py                 # Authentication server
├── models.py               # ML models and user preference management
├── enhancedChatbot.js      # Advanced chatbot with dataset intelligence
├── workingChatbot.js       # Simple, reliable fallback chatbot
├── enhancedStyleBot.js     # Advanced conversational AI chatbot
├── index.js                # JavaScript module exports
├── __init__.py             # Python package initialization
└── README.md               # This file
```

## Components

### Backend Components

#### `api.py`
- Main Flask API server
- Handles chat recommendations (`/api/chat/recommendations`)
- Quiz-based recommendations (`/api/quiz/recommendations`)
- User preference management
- Image serving

#### `auth.py`
- Simple file-based authentication
- Login/register endpoints
- User session management

#### `models.py`
- `SimpleEnhancedStyleGenieRecommender`: Main ML recommendation engine
- `UserPreferenceManager`: Manages user preferences and learning
- `InteractiveFashionAI`: AI interaction layer

### Frontend Components

#### `enhancedChatbot.js`
- Dataset-inspired intelligence (ATIS, Empathetic Dialogues)
- Intent classification and slot filling
- Emotional response generation
- Fashion vocabulary processing

#### `workingChatbot.js`
- Simple, reliable chatbot implementation
- Basic intent detection
- Product matching with image integration
- Fallback system

#### `enhancedStyleBot.js`
- Advanced conversational AI
- Context memory and personality detection
- Dynamic response generation
- Personalized recommendations

## Usage

### Starting the Servers

```bash
# Start chatbot API server
python src/chatbot/api.py

# Start authentication server (optional)
python src/chatbot/auth.py
```

Or use the batch scripts:
```bash
# Start chatbot server
start_chatbot.bat

# Start auth server
start_auth.bat
```

### Frontend Integration

```javascript
// Import chatbot components
import { enhancedChatbot } from '../chatbot/enhancedChatbot';
import { workingChatbot } from '../chatbot/workingChatbot';
import { enhancedStyleBot } from '../chatbot/enhancedStyleBot';

// Or use the index file
import { enhancedChatbot, workingChatbot, enhancedStyleBot } from '../chatbot';
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat/recommendations` - Get chat recommendations
- `POST /api/quiz/recommendations` - Get quiz-based recommendations
- `POST /api/user/preferences` - Update user preferences
- `GET /api/user/preferences/<user_id>` - Get user preferences
- `GET /api/images/<path>` - Serve product images

## Features

- **Multi-layered Recommendation System**: Content-based, collaborative filtering, and preference learning
- **Conversational AI**: Multiple chatbot engines with different complexity levels
- **User Preference Learning**: Dynamic adaptation based on user interactions
- **Context-Aware Responses**: Maintains conversation memory and context
- **Fashion Domain Intelligence**: Specialized vocabulary and styling knowledge
- **Real-time Processing**: Live recommendation generation and preference updates
- **Fallback Systems**: Multiple chatbot layers ensure reliability

## Configuration

The system uses `config/config.yaml` for configuration. Key settings:
- API port and model paths
- Preprocessing parameters
- Model version information

## Dependencies

### Python
- Flask
- Flask-CORS
- scikit-learn
- pandas
- numpy
- PyYAML

### JavaScript
- React (for frontend integration)
- Lucide React (for icons)

## Development

To add new chatbot functionality:

1. **Backend**: Add new endpoints to `api.py` or extend the models in `models.py`
2. **Frontend**: Create new chatbot classes or extend existing ones
3. **Integration**: Update the imports in components that use the chatbot

## Error Handling

The system includes comprehensive error handling:
- Fallback chatbots when advanced systems fail
- Graceful degradation of functionality
- Error logging and user-friendly messages

## Performance

- Conversation memory management (limited to last 10 interactions)
- Efficient product filtering and scoring
- Caching of user preferences
- Optimized image serving