import mediapipe as mp
import os
import sys

print(f"Python Version: {sys.version}")
print(f"MediaPipe File: {getattr(mp, '__file__', 'No __file__ attribute')}")
print(f"MediaPipe Folder: {os.path.dirname(mp.__file__) if hasattr(mp, '__file__') else 'N/A'}")
print(f"MediaPipe Dir Attributes: {dir(mp)}")

try:
    print(f"Solutions: {mp.solutions}")
except Exception as e:
    print(f"Error accessing solutions: {e}")
