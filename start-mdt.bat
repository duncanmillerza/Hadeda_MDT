@echo off
REM Startup script for HadedaHealth MDT App (Windows)

echo.
echo Starting HadedaHealth MDT Application...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies first-time setup...
    call npm install
)

REM Check if database exists
if not exist "data\mdt.db" (
    echo Setting up database first-time setup...
    call npm run db:migrate -- --name init
    call npm run db:seed

    echo.
    echo Create your first user account:
    call npm run create-user
)

REM Start the application
echo.
echo Starting server...
echo The app will open automatically in your browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Open browser after starting server
start http://localhost:3000

REM Start Next.js server
call npm run dev
