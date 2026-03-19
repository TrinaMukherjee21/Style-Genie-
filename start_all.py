#!/usr/bin/env python3
"""
Unified StyleGenie Application Starter
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def run_backend():
    """Start the Flask backend server"""
    print("🐍 Starting backend server...")
    os.chdir(Path("src/chatbot"))
    subprocess.run([sys.executable, "flask_api.py"])

def run_frontend():
    """Start the React frontend server"""
    print("⚛️ Starting frontend server...")
    os.chdir(Path.cwd().parent.parent)  # Go back to root
    subprocess.run(["npm.cmd", "start"], shell=True)

def main():
    print("🚀 Starting StyleGenie Application...")
    print("=" * 50)
    
    print("📦 Skipping dependency installation...")
    
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    print("⏳ Waiting for backend to initialize...")
    time.sleep(3)
    
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down StyleGenie...")
        sys.exit(0)

if __name__ == "__main__":
    main()