@echo off
setlocal
title SmartGift - Server and UI Launcher

:: Set working directory to script location
cd /d "%~dp0"

echo ============================================================
echo   SmartGift Launcher - One-Click Server and UI
echo ============================================================
echo.

call :check_node || goto :fail
call :check_deps || goto :fail
call :start_backend
call :start_ui

exit /b 0

:check_node
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please download and install Node.js from: https://nodejs.org/
    exit /b 1
)
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    where npm.cmd >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm was not found in your PATH.
        exit /b 1
    )
)
exit /b 0

:check_deps
if not exist "node_modules\" (
    echo [*] Dependencies not found. Installing node_modules...
    echo     This may take a moment on the first run.
    echo.
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] npm install failed.
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
) else (
    echo [OK] UI dependencies are ready.
)
exit /b 0

:start_backend
set "_BACKEND_DIR=%~dp0..\business-01-smart-gift"
set "_BACKEND_SCRIPT=%_BACKEND_DIR%\public\serve.py"

if not exist "%_BACKEND_SCRIPT%" (
    echo [INFO] Backend repository not found at ..\business-01-smart-gift [standalone UI mode].
    echo.
    exit /b 0
)

netstat -ano | findstr /R /C:":5180 .*LISTENING" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Backend server [sv] is already running on http://localhost:5180
    echo.
    exit /b 0
)

echo [*] Starting SmartGift Backend Server [sv] on port 5180...
set "_PY=python"
where py >nul 2>&1 && set "_PY=py -3"

start "SmartGift Backend Server [Port 5180]" /D "%_BACKEND_DIR%" cmd /k "title SmartGift Backend Server [Port 5180] && echo ============================================================ && echo   SmartGift Backend Server [Port 5180] && echo   API: http://localhost:5180/api/catalog && echo ============================================================ && echo. && %_PY% -u public\serve.py"

ping 127.0.0.1 -n 2 >nul
echo [OK] Backend server launched on http://localhost:5180
echo.
exit /b 0

:start_ui
echo [*] Starting Web UI [Vite dev server]...
echo.
echo ============================================================
echo   Web UI will automatically open in your default browser.
echo   Local URL:  http://localhost:5173
echo.
echo   Press Ctrl+C in this window to stop the UI.
echo ============================================================
echo.
call npm run dev -- --host --open
exit /b 0

:fail
echo.
echo ============================================================
echo [ERROR] Launcher failed to start. See error message above.
echo ============================================================
pause
exit /b 1
