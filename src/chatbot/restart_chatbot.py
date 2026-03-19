#!/usr/bin/env python3
"""
Restart script for StyleGenie chatbot API.
This script helps restart the chatbot service after making changes.
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def restart_chatbot():
    """Restart the chatbot API service"""
    
    print("Restarting StyleGenie Chatbot...")
    
    # Change to chatbot directory
    chatbot_dir = Path(__file__).parent
    os.chdir(chatbot_dir)
    
    # Kill any existing Python processes running the API
    try:
        if os.name == 'nt':  # Windows
            subprocess.run(['taskkill', '/f', '/im', 'python.exe'], 
                         capture_output=True, check=False)
        else:  # Unix/Linux/Mac
            subprocess.run(['pkill', '-f', 'api.py'], 
                         capture_output=True, check=False)
        print("Stopped existing chatbot processes")
        time.sleep(2)
    except Exception as e:
        print(f"Note: Could not stop existing processes: {e}")
    
    # Start the API server
    try:
        print("Starting chatbot API server...")
        if os.name == 'nt':  # Windows
            subprocess.Popen(['python', 'api.py'], 
                           creationflags=subprocess.CREATE_NEW_CONSOLE)
        else:  # Unix/Linux/Mac
            subprocess.Popen(['python3', 'api.py'])
        
        print("Chatbot API server started successfully!")
        print("The chatbot should now be responding with varied, non-repetitive messages.")
        print("API endpoint: http://localhost:5000/chat")
        
    except Exception as e:
        print(f"Error starting chatbot: {e}")
        return False
    
    return True

if __name__ == "__main__":
    restart_chatbot()