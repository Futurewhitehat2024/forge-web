@echo off
setlocal
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "PATH=%ROOT%\scripts;%ROOT%\.tools\node;%PATH%"
cd /d "%ROOT%"

call "%~dp0stop-dev.cmd"

if exist "%ROOT%\node_modules" (
  echo Removing existing node_modules...
  rmdir /s /q "%ROOT%\node_modules" 2>nul
  if exist "%ROOT%\node_modules" (
    echo WARNING: Could not fully remove node_modules. Retrying...
    powershell -NoProfile -Command "Start-Sleep -Seconds 3"
    rmdir /s /q "%ROOT%\node_modules" 2>nul
  )
)

echo Installing dependencies...
call "%ROOT%\.tools\node\npm.cmd" install %*
if errorlevel 1 exit /b 1

echo Install complete.
exit /b 0