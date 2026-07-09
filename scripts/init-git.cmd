@echo off
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "PATH=%ROOT%\tools\git\cmd;%ROOT%\scripts;%ROOT%\.tools\node;%PATH%"
cd /d "%ROOT%"

if not exist "%ROOT%\tools\git\cmd\git.exe" (
  echo Git not found. Run scripts\install-git.cmd first.
  exit /b 1
)

if not exist "%ROOT%\.git" (
  git init
  git branch -M main
)

git add -A
git status
exit /b 0