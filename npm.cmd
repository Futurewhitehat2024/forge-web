@echo off
for %%I in ("%~dp0.") do set "ROOT=%%~fI"
set "PATH=%ROOT%\scripts;%ROOT%\.tools\node;%PATH%"
call "%ROOT%\.tools\node\npm.cmd" %*
exit /b %ERRORLEVEL%