@echo off
call "%~dp0ensure-node.cmd"
if errorlevel 1 exit /b 1
call "%~dp0install.cmd"
if errorlevel 1 exit /b 1
echo.
echo Setup complete. Run scripts\dev.cmd to start the app.
exit /b 0