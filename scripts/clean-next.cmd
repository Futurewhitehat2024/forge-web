@echo off
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
if exist "%ROOT%\.next" (
  echo Clearing .next cache...
  rmdir /s /q "%ROOT%\.next" 2>nul
)
exit /b 0