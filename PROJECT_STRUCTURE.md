# StyleGenie - Clean Project Structure

## Core Application Files

### Frontend (React)
- `src/App.jsx` - Main React application
- `src/components/` - React components
- `src/pages/` - Application pages
- `src/context/` - React context providers
- `src/styles/` - CSS and styling
- `public/` - Static assets

### Backend (Python)
- `src/chatbot/flask_api.py` - Main Flask API server
- `src/chatbot/interactive_ai.py` - Enhanced chatbot with anti-repetition
- `src/chatbot/models.py` - Recommendation models
- `src/chatbot/visual_search.py` - Image-based search
- `src/api/` - Additional API endpoints

### Data
- `data/models/` - Trained models and embeddings
- `data/processed/` - Processed datasets
- `data/raw/` - Raw product data

## Key Features

### Chatbot Improvements
✅ **Anti-repetitive responses** - Tracks conversation history
✅ **Varied greeting templates** - 4+ different greeting styles
✅ **Context awareness** - Detects repetitive queries
✅ **Session management** - Per-user conversation tracking

### Core Functionality
✅ **Visual search** - Upload images for style matching
✅ **Text recommendations** - Natural language product search
✅ **User profiles** - Personalized recommendations
✅ **Product management** - Cart and wishlist features

## Startup Instructions

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **Start the application:**
   ```bash
   python start_app.py
   ```

3. **Access the app:**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000

## Removed Files

### Cleaned up:
- ❌ 15+ duplicate chatbot implementations
- ❌ 20+ test files and scripts
- ❌ Unused batch files and startup scripts
- ❌ Large unused datasets
- ❌ Experimental therapy modules
- ❌ Redundant API implementations

### Kept essential:
- ✅ Core React frontend
- ✅ Working Flask API
- ✅ Enhanced chatbot with fixes
- ✅ Product data and models
- ✅ User management system

## File Count Reduction
- **Before:** 100+ files in chatbot directory
- **After:** 12 essential files
- **Space saved:** ~500MB+ of unused datasets and duplicates