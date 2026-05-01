import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def clear_port(port):
    """Silently kill process on a specific port to prevent 'port in use' hangs."""
    if sys.platform == "win32":
        try:
            # Find PID using netstat and taskkill
            cmd = f'netstat -ano | findstr :{port}'
            output = subprocess.check_output(cmd, shell=True).decode()
            for line in output.strip().split('\n'):
                if 'LISTENING' in line:
                    parts = line.strip().split()
                    if len(parts) >= 5:
                        pid = parts[-1]
                        if int(pid) != os.getpid():
                            subprocess.run(f'taskkill /F /PID {pid} /T', shell=True, capture_output=True, timeout=2)
        except Exception:
            pass


def run_backend(script_dir):
    """Start the Flask backend server from its specific directory"""
    backend_dir = script_dir / "src" / "api"
    os.chdir(backend_dir)
    
    # Enable initial backend logs to verify it's working
    print("Backend: Initializing services and AI models...")
    
    # Use Popen to allow us to read logs or just let it run
    # If the user wants it clean, we can suppress it after a while, 
    # but for debugging 'stuck' issues, we need to see if it's crashing.
    process = subprocess.Popen(
        [sys.executable, "app.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    
    # Read first few lines of output to confirm success
    count = 0
    while count < 10:
        line = process.stdout.readline()
        if not line: break
        if "Running on" in line or "Debugger is active" in line:
            print(f"Backend: {line.strip()}")
            break
        count += 1
    
    # Now let it run in background (closing the handles so we don't block)
    process.stdout.close()

def run_frontend(script_dir):
    """Start the React frontend server from the project root"""
    os.chdir(script_dir)
    
    # Speed Optimization: Disable ESLint plugin during development
    # This significantly reduces compilation time in CRA (Create React App)
    env = os.environ.copy()
    env["DISABLE_ESLINT_PLUGIN"] = "true"
    
    print("Frontend: Compiling application (Clean Cache Mode)...")

    
    # Use npm start with the custom environment
    subprocess.run(["npm.cmd", "start"], shell=True, env=env)

def main():
    print("=" * 55)
    print("🚀 STYLEGENIE OPTIMIZED STARTUP")
    print("=" * 55)
    
    script_dir = Path(__file__).resolve().parent
    
    # 1. Clear ports with a timeout
    print("🔍 Cleaning up ports 5000 and 3000...")
    clear_port(5000)
    clear_port(3000)
    
    # 2. Start backend in a background thread
    backend_thread = threading.Thread(target=run_backend, args=(script_dir,), daemon=True)
    backend_thread.start()
    
    # Wait for backend to at least start its imports
    time.sleep(3)
    
    print("\n* Backend: http://127.0.0.1:5000")
    print("* Frontend: http://localhost:3000")
    print("\nStarting Frontend compiler... Browser will open when ready.\n")
    
    # 3. Start frontend in the main thread
    try:
        run_frontend(script_dir)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down StyleGenie...")
        sys.exit(0)

if __name__ == "__main__":
    main()