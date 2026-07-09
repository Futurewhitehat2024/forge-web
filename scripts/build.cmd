@echo off
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "PATH=%ROOT%\scripts;%ROOT%\.tools\node;%PATH%"
cd /d "%ROOT%"

call "%~dp0stop-dev.cmd"
call "%~dp0clean-next.cmd"
call npm.cmd run build
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

echo Build complete. Run scripts\dev.cmd to start the dev server.
exit /b 0