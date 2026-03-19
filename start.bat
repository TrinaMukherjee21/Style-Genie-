@echo off
echo Starting StyleGenie Application...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting backend server...
start "StyleGenie Backend" cmd /k "cd src\chatbot && python flask_api.py"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting frontend application...
start "StyleGenie Frontend" cmd /k "npm start"

echo.
echo StyleGenie is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause