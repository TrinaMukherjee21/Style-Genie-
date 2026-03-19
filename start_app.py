#!/usr/bin/env python3
"""
Simple startup script for StyleGenie application.
Starts both the React frontend and Flask chatbot API.
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def start_services():
    """Start the StyleGenie services"""
    
    print("Starting StyleGenie Application...")
    
    # Change to project root
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    try:
        # Start Flask API in background
        print("Starting chatbot API...")
        api_process = subprocess.Popen(
            [sys.executable, "src/chatbot/flask_api.py"],
            cwd=project_root
        )
        
        # Wait a moment for API to start
        time.sleep(3)
        
        # Start React frontend
        print("Starting React frontend...")
        frontend_process = subprocess.Popen(
            ["npm", "start"],
            cwd=project_root
        )
        
        print("✅ StyleGenie is starting up!")
        print("📱 Frontend: http://localhost:3000")
        print("🤖 Chatbot API: http://localhost:5000")
        print("\nPress Ctrl+C to stop all services")
        
        # Wait for processes
        try:
            frontend_process.wait()
        except KeyboardInterrupt:
            print("\nShutting down services...")
            api_process.terminate()
            frontend_process.terminate()
            
    except Exception as e:
        print(f"Error starting services: {e}")
        return False
    
    return True

if __name__ == "__main__":
    start_services()