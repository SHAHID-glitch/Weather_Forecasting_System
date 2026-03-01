@echo off
echo ========================================
echo Weather Forecasting API - Quick Setup
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Node.js detected: 
node --version
echo.

:: Check if .env file exists
if not exist .env (
    echo [2/5] Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and add your OpenWeatherMap API key!
    echo Get your free API key at: https://openweathermap.org/api
    echo.
) else (
    echo [2/5] .env file already exists
    echo.
)

:: Install dependencies
echo [3/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo.

:: Create logs directory
echo [4/5] Creating logs directory...
if not exist logs mkdir logs
echo.

:: Display completion message
echo [5/5] Setup completed successfully!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit .env file and add your WEATHER_API_KEY
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:3000 to see the API
echo 4. Check README.md for API documentation
echo ========================================
echo.
pause
