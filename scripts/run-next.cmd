@echo off
setlocal
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
"%ROOT%\.tools\node\node.exe" "%ROOT%\node_modules\next\dist\bin\next" %*
exit /b %ERRORLEVEL%