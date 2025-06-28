@echo off
setlocal enabledelayedexpansion

REM Set up Ctrl+C handler
if not defined QUIZ_LAUNCHER (
    set QUIZ_LAUNCHER=1
    cmd /c "%~f0" %*
    taskkill /f /im node.exe /t > nul 2>&1
    exit /b
)

echo ================================
echo     Quiz Server Launcher
echo ================================
echo.

REM read port config
set "port=8000"
if exist .env (
    for /f "tokens=2 delims==" %%a in ('findstr "SERVER_PORT" .env') do (
        set "port=%%a"
    )
)

echo Config Port: !port!
echo.

REM kill any existing node processes automatically
echo Cleaning up existing processes...
taskkill /f /im node.exe /t > nul 2>&1

REM kill processes using the specific port
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":!port! " 2^>nul') do (
    if not "%%a"=="" (
        taskkill /f /pid %%a > nul 2>&1
    )
)

timeout /t 1 /nobreak > nul

REM start server
echo Starting Node.js server...
start /b node server.js

REM wait for server to start
echo Waiting for server to start...
timeout /t 3 /nobreak > nul

REM open browser
echo Opening browser: http://localhost:!port!
start http://localhost:!port!

echo.
echo ================================
echo Server started!
echo Access URL: http://localhost:!port!
echo ================================
echo.
echo Press Ctrl+C to stop server, or close window
:loop
timeout /t 10 /nobreak > nul
goto loop
