# 🚀 StyleGenie Application Startup Guide

## Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

## Quick Start

### 1. Install Dependencies

**Frontend (React):**
```bash
npm install
```

**Backend (Python):**
```bash
pip install -r requirements.txt
```

### 2. Start Backend Server
```bash
cd src/chatbot
python flask_api.py
```
Server will run on: http://localhost:5000

### 3. Start Frontend Application
```bash
npm start
```
Application will run on: http://localhost:3000

## Troubleshooting

### Common Issues:

**1. Missing smart_fashion_bot.py:**
The current flask_api.py uses `interactive_ai.py` instead. This is correct.

**2. Port conflicts:**
- Backend: Change port in flask_api.py (default: 5000)
- Frontend: Change port in package.json scripts

**3. CORS errors:**
Flask-CORS is configured. Ensure backend starts before frontend.

**4. Missing dependencies:**
```bash
# Frontend
npm install --legacy-peer-deps

# Backend  
pip install flask flask-cors pillow numpy scikit-learn
```

## Verification Steps

1. **Backend Health Check:**
   Visit: http://localhost:5000/health
   Should return: `{"status": "ok", "time": "..."}`

2. **Frontend Loading:**
   Visit: http://localhost:3000
   Should show StyleGenie homepage

3. **Chat Functionality:**
   Open chat widget and send test message

## Development Mode

**Start both servers simultaneously:**
```bash
# Terminal 1 - Backend
cd src/chatbot && python flask_api.py

# Terminal 2 - Frontend  
npm start
```

## Production Build

```bash
# Build frontend
npm run build

# Serve built files (optional)
npx serve -s build -l 3000
```