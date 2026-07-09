@echo off
setlocal
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "NODE_EXE=%ROOT%\.tools\node\node.exe"

if exist "%NODE_EXE%" (
  echo Node.js already available: %NODE_EXE%
  "%NODE_EXE%" --version
  exit /b 0
)

echo Downloading portable Node.js v22.14.0...
set "ZIP=%TEMP%\node-v22.14.0-win-x64.zip"
set "TOOLS=%ROOT%\.tools"
powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.14.0/node-v22.14.0-win-x64.zip' -OutFile '%ZIP%' -UseBasicParsing"
if errorlevel 1 (
  echo Failed to download Node.js.
  exit /b 1
)

if not exist "%TOOLS%" mkdir "%TOOLS%"
powershell -NoProfile -Command "Expand-Archive -Path '%ZIP%' -DestinationPath '%TOOLS%' -Force"
for /d %%D in ("%TOOLS%\node-v*") do (
  if exist "%%D\node.exe" (
    if exist "%ROOT%\.tools\node" rmdir /s /q "%ROOT%\.tools\node" 2>nul
    move "%%D" "%ROOT%\.tools\node" >nul
  )
)

if not exist "%NODE_EXE%" (
  echo Node.js setup failed.
  exit /b 1
)

echo @ECHO OFF> "%ROOT%\.tools\node\node.cmd"
echo "%%~dp0node.exe" %%*>> "%ROOT%\.tools\node\node.cmd"
echo exit /b %%ERRORLEVEL%%>> "%ROOT%\.tools\node\node.cmd"

powershell -NoProfile -Command "$npm='%ROOT%\.tools\node\npm.cmd'; if (Test-Path $npm) { $c=Get-Content $npm -Raw; if ($c -notmatch 'Forge: ensure bundled node') { $c=$c -replace 'SETLOCAL\r?\n\r?\n', \"SETLOCAL`r`n`r`nREM Forge: ensure bundled node is on PATH for dependency lifecycle scripts`r`nSET `\"PATH=%%~dp0;%%PATH%%`\"`r`n`r`n\"; Set-Content $npm $c -NoNewline } }"

echo Node.js installed successfully.
"%NODE_EXE%" --version

set "USER_PATH="
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%B"
echo ;%USER_PATH% | find /i "%ROOT%\.tools\node" >nul
if errorlevel 1 (
  setx PATH "%ROOT%\.tools\node;%USER_PATH%" >nul
  echo Added Node to user PATH.
)

exit /b 0