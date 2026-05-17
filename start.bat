@echo off
echo ========================================
echo   RetailPulse AI - Starting Platform
echo ========================================
echo.

echo [1/2] Starting FastAPI Backend on port 8000...
start "RetailPulse Backend" cmd /k "cd /d "%~dp0" && python -m uvicorn backend.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Next.js Frontend on port 3000...
start "RetailPulse Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   RetailPulse AI is starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /FI "WindowTitle eq RetailPulse Backend*" /T /F
taskkill /FI "WindowTitle eq RetailPulse Frontend*" /T /F
