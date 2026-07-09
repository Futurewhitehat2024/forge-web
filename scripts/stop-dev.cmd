@echo off
setlocal
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
echo Stopping Forge Web dev processes...
powershell -NoProfile -Command "Get-Process -Name 'node' -ErrorAction SilentlyContinue | ForEach-Object { $c = (Get-CimInstance Win32_Process -Filter ('ProcessId=' + $_.Id) -ErrorAction SilentlyContinue).CommandLine; if ($c -like '*forge-web*') { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue } }; Start-Sleep -Seconds 2"
exit /b 0