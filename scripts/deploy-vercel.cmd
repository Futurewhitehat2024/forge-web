@echo off
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "PATH=%ROOT%\scripts;%ROOT%\.tools\node;%PATH%"
cd /d "%ROOT%"

echo Deploying to Vercel...
echo Ensure you have run: npx vercel login
echo And set env vars in Vercel dashboard or via: npx vercel env add

call npx.cmd vercel --prod --yes
exit /b %ERRORLEVEL%