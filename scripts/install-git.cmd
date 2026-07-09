@echo off
setlocal
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "GIT_DIR=%ROOT%\tools\git"
set "ZIP=%TEMP%\PortableGit.zip"

if exist "%GIT_DIR%\cmd\git.exe" (
  echo Git already installed at %GIT_DIR%
  "%GIT_DIR%\cmd\git.exe" --version
  exit /b 0
)

echo Downloading Portable Git...
powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.2/PortableGit-2.47.1.2-64-bit.7z.exe' -OutFile '%ZIP%' -UseBasicParsing"
if errorlevel 1 (
  echo Download failed.
  exit /b 1
)

if not exist "%ROOT%\tools" mkdir "%ROOT%\tools"
echo Extracting...
"%ZIP%" -o"%GIT_DIR%" -y
if errorlevel 1 (
  echo Extract failed.
  exit /b 1
)

"%GIT_DIR%\cmd\git.exe" --version
echo Git installed to %GIT_DIR%
exit /b 0