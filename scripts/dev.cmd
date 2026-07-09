@echo off
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "PATH=%ROOT%\scripts;%ROOT%\.tools\node;%PATH%"
cd /d "%ROOT%"

call "%~dp0stop-dev.cmd"
set "PORT=3000"
set "HOSTNAME=localhost"

echo Starting Forge Web at http://localhost:3000 ...
npm.cmd run dev