@echo off
REM StackStudio Build Fix Script for Windows
REM This script clears all caches and rebuilds the project

echo.
echo ========================================
echo   StackStudio Build Fix Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "client" (
    echo Error: client directory not found
    echo Please run this script from the project root directory
    exit /b 1
)

if not exist "server" (
    echo Error: server directory not found
    echo Please run this script from the project root directory
    exit /b 1
)

echo Step 1: Cleaning client build cache...
cd client
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "dist" rmdir /s /q "dist"
if exist ".vite" rmdir /s /q ".vite"
echo Client cache cleared
echo.

echo Step 2: Reinstalling client dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install client dependencies
    exit /b 1
)
echo Client dependencies installed
echo.

echo Step 3: Building client...
call npm run build
if errorlevel 1 (
    echo Error: Client build failed
    exit /b 1
)
echo Client build successful
echo.

echo Step 4: Checking server...
cd ..\server
if not exist "node_modules" (
    echo Installing server dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install server dependencies
        exit /b 1
    )
    echo Server dependencies installed
) else (
    echo Server dependencies already installed
)
echo.

cd ..

echo.
echo ========================================
echo   Build fix complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start the backend: cd server ^&^& npm run dev
echo 2. Start the frontend: cd client ^&^& npm run dev
echo 3. Clear browser cache (Ctrl+Shift+Delete)
echo 4. Hard refresh (Ctrl+Shift+R)
echo.
echo Your app should now work without errors!
echo.
pause
