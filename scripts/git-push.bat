@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo Git status...
git status
if errorlevel 1 (
    echo Git init...
    git init
    git branch -M main
)
echo.
echo Remote origin...
git remote get-url origin 2>nul
if errorlevel 1 (
    git remote add origin https://github.com/Jaeyoung0218/jinam_ver.1.0.0.git
)
echo.
echo Add all...
git add -A
echo Commit...
git commit -m "feat: KSPO concert JSON and page integration (26 Q1)"
echo Push...
git push -u origin main
echo Done.
pause
