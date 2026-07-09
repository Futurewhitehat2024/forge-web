@echo off
REM Usage: scripts\push-github.cmd YOUR_GITHUB_USERNAME
setlocal
if "%~1"=="" (
  echo Usage: scripts\push-github.cmd YOUR_GITHUB_USERNAME
  echo Example: scripts\push-github.cmd orlan
  exit /b 1
)

for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "PATH=%ROOT%\tools\git\cmd;%PATH%"
cd /d "%ROOT%"

set "REPO=https://github.com/%~1/forge-web.git"
git remote remove origin 2>nul
git remote add origin %REPO%
git push -u origin main
exit /b %ERRORLEVEL%